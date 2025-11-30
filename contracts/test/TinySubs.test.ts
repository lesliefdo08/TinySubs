import { expect } from "chai";
import hre from "hardhat";
import { TinySubs } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const { ethers } = hre;

describe("TinySubs", function () {
  let tinySubs: TinySubs;
  let owner: HardhatEthersSigner;
  let creator1: HardhatEthersSigner;
  let creator2: HardhatEthersSigner;
  let subscriber1: HardhatEthersSigner;
  let subscriber2: HardhatEthersSigner;

  const PLAN_NAME = "Premium Content";
  const PLAN_DESCRIPTION = "Access to all premium content";
  const PRICE_PER_MONTH = ethers.parseEther("0.01"); // 0.01 ETH
  const MONTH_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds

  beforeEach(async function () {
    [owner, creator1, creator2, subscriber1, subscriber2] = await ethers.getSigners();

    const TinySubsFactory = await ethers.getContractFactory("TinySubs");
    tinySubs = await TinySubsFactory.deploy();
    await tinySubs.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await tinySubs.owner()).to.equal(owner.address);
    });

    it("Should set the correct platform fee", async function () {
      expect(await tinySubs.platformFeePercent()).to.equal(250); // 2.5%
    });
  });

  describe("Creator Registration", function () {
    it("Should allow a creator to register", async function () {
      await expect(
        tinySubs
          .connect(creator1)
          .registerCreator(PLAN_NAME, PLAN_DESCRIPTION, PRICE_PER_MONTH, ethers.ZeroAddress)
      )
        .to.emit(tinySubs, "CreatorRegistered")
        .withArgs(creator1.address, PLAN_NAME, PRICE_PER_MONTH, ethers.ZeroAddress);

      expect(await tinySubs.isCreator(creator1.address)).to.be.true;
    });

    it("Should not allow duplicate registration", async function () {
      await tinySubs
        .connect(creator1)
        .registerCreator(PLAN_NAME, PLAN_DESCRIPTION, PRICE_PER_MONTH, ethers.ZeroAddress);

      await expect(
        tinySubs
          .connect(creator1)
          .registerCreator("Another Plan", "Description", PRICE_PER_MONTH, ethers.ZeroAddress)
      ).to.be.revertedWith("Already registered as creator");
    });

    it("Should not allow zero price", async function () {
      await expect(
        tinySubs
          .connect(creator1)
          .registerCreator(PLAN_NAME, PLAN_DESCRIPTION, 0, ethers.ZeroAddress)
      ).to.be.revertedWith("Price must be greater than 0");
    });

    it("Should not allow empty plan name", async function () {
      await expect(
        tinySubs
          .connect(creator1)
          .registerCreator("", PLAN_DESCRIPTION, PRICE_PER_MONTH, ethers.ZeroAddress)
      ).to.be.revertedWith("Plan name required");
    });

    it("Should store correct plan details", async function () {
      await tinySubs
        .connect(creator1)
        .registerCreator(PLAN_NAME, PLAN_DESCRIPTION, PRICE_PER_MONTH, ethers.ZeroAddress);

      const plan = await tinySubs.getCreatorPlan(creator1.address);
      expect(plan.planName).to.equal(PLAN_NAME);
      expect(plan.description).to.equal(PLAN_DESCRIPTION);
      expect(plan.pricePerMonth).to.equal(PRICE_PER_MONTH);
      expect(plan.tokenAddress).to.equal(ethers.ZeroAddress);
      expect(plan.isActive).to.be.true;
      expect(plan.subscriberCount).to.equal(0);
      expect(plan.totalEarned).to.equal(0);
    });
  });

  describe("Plan Management", function () {
    beforeEach(async function () {
      await tinySubs
        .connect(creator1)
        .registerCreator(PLAN_NAME, PLAN_DESCRIPTION, PRICE_PER_MONTH, ethers.ZeroAddress);
    });

    it("Should allow creator to update plan", async function () {
      const newName = "Super Premium";
      const newDescription = "Even better content";
      const newPrice = ethers.parseEther("0.02");

      await expect(
        tinySubs.connect(creator1).updatePlan(newName, newDescription, newPrice)
      )
        .to.emit(tinySubs, "PlanUpdated")
        .withArgs(creator1.address, newName, newPrice);

      const plan = await tinySubs.getCreatorPlan(creator1.address);
      expect(plan.planName).to.equal(newName);
      expect(plan.description).to.equal(newDescription);
      expect(plan.pricePerMonth).to.equal(newPrice);
    });

    it("Should allow creator to toggle plan status", async function () {
      await tinySubs.connect(creator1).togglePlanStatus();
      let plan = await tinySubs.getCreatorPlan(creator1.address);
      expect(plan.isActive).to.be.false;

      await tinySubs.connect(creator1).togglePlanStatus();
      plan = await tinySubs.getCreatorPlan(creator1.address);
      expect(plan.isActive).to.be.true;
    });

    it("Should not allow non-creator to update plan", async function () {
      await expect(
        tinySubs.connect(subscriber1).updatePlan("Name", "Desc", PRICE_PER_MONTH)
      ).to.be.revertedWith("Not a registered creator");
    });
  });

  describe("Subscriptions", function () {
    beforeEach(async function () {
      await tinySubs
        .connect(creator1)
        .registerCreator(PLAN_NAME, PLAN_DESCRIPTION, PRICE_PER_MONTH, ethers.ZeroAddress);
    });

    it("Should allow subscription to a creator", async function () {
      const platformFee = (PRICE_PER_MONTH * 250n) / 10000n;
      const creatorAmount = PRICE_PER_MONTH - platformFee;

      await expect(
        tinySubs.connect(subscriber1).subscribe(creator1.address, { value: PRICE_PER_MONTH })
      )
        .to.emit(tinySubs, "SubscriptionCreated")
        .withArgs(subscriber1.address, creator1.address, PRICE_PER_MONTH, await time.latest() + MONTH_DURATION);

      const subscription = await tinySubs.getSubscription(subscriber1.address, creator1.address);
      expect(subscription.isActive).to.be.true;
      expect(subscription.creator).to.equal(creator1.address);
      expect(subscription.totalPaid).to.equal(PRICE_PER_MONTH);

      const plan = await tinySubs.getCreatorPlan(creator1.address);
      expect(plan.subscriberCount).to.equal(1);
      expect(plan.totalEarned).to.equal(creatorAmount);
    });

    it("Should not allow subscription with incorrect payment", async function () {
      await expect(
        tinySubs
          .connect(subscriber1)
          .subscribe(creator1.address, { value: ethers.parseEther("0.005") })
      ).to.be.revertedWith("Incorrect payment amount");
    });

    it("Should not allow subscribing to yourself", async function () {
      await expect(
        tinySubs.connect(creator1).subscribe(creator1.address, { value: PRICE_PER_MONTH })
      ).to.be.revertedWith("Cannot subscribe to yourself");
    });

    it("Should not allow duplicate subscription", async function () {
      await tinySubs.connect(subscriber1).subscribe(creator1.address, { value: PRICE_PER_MONTH });

      await expect(
        tinySubs.connect(subscriber1).subscribe(creator1.address, { value: PRICE_PER_MONTH })
      ).to.be.revertedWith("Already subscribed");
    });

    it("Should not allow subscription to inactive plan", async function () {
      await tinySubs.connect(creator1).togglePlanStatus();

      await expect(
        tinySubs.connect(subscriber1).subscribe(creator1.address, { value: PRICE_PER_MONTH })
      ).to.be.revertedWith("Plan is not active");
    });
  });

  describe("Subscription Renewal", function () {
    beforeEach(async function () {
      await tinySubs
        .connect(creator1)
        .registerCreator(PLAN_NAME, PLAN_DESCRIPTION, PRICE_PER_MONTH, ethers.ZeroAddress);
      await tinySubs.connect(subscriber1).subscribe(creator1.address, { value: PRICE_PER_MONTH });
    });

    it("Should allow subscription renewal", async function () {
      await expect(
        tinySubs.connect(subscriber1).renewSubscription(creator1.address, { value: PRICE_PER_MONTH })
      ).to.emit(tinySubs, "SubscriptionRenewed");

      const subscription = await tinySubs.getSubscription(subscriber1.address, creator1.address);
      expect(subscription.totalPaid).to.equal(PRICE_PER_MONTH * 2n);
    });

    it("Should not allow renewal without active subscription", async function () {
      await expect(
        tinySubs.connect(subscriber2).renewSubscription(creator1.address, { value: PRICE_PER_MONTH })
      ).to.be.revertedWith("No active subscription");
    });
  });

  describe("Subscription Cancellation", function () {
    beforeEach(async function () {
      await tinySubs
        .connect(creator1)
        .registerCreator(PLAN_NAME, PLAN_DESCRIPTION, PRICE_PER_MONTH, ethers.ZeroAddress);
      await tinySubs.connect(subscriber1).subscribe(creator1.address, { value: PRICE_PER_MONTH });
    });

    it("Should allow subscription cancellation", async function () {
      await expect(tinySubs.connect(subscriber1).cancelSubscription(creator1.address))
        .to.emit(tinySubs, "SubscriptionCancelled")
        .withArgs(subscriber1.address, creator1.address);

      const subscription = await tinySubs.getSubscription(subscriber1.address, creator1.address);
      expect(subscription.isActive).to.be.false;

      const plan = await tinySubs.getCreatorPlan(creator1.address);
      expect(plan.subscriberCount).to.equal(0);
    });

    it("Should not allow cancelling non-existent subscription", async function () {
      await expect(
        tinySubs.connect(subscriber2).cancelSubscription(creator1.address)
      ).to.be.revertedWith("No active subscription");
    });
  });

  describe("Fund Withdrawal", function () {
    beforeEach(async function () {
      await tinySubs
        .connect(creator1)
        .registerCreator(PLAN_NAME, PLAN_DESCRIPTION, PRICE_PER_MONTH, ethers.ZeroAddress);
      await tinySubs.connect(subscriber1).subscribe(creator1.address, { value: PRICE_PER_MONTH });
    });

    it("Should allow creator to withdraw funds", async function () {
      const platformFee = (PRICE_PER_MONTH * 250n) / 10000n;
      const creatorAmount = PRICE_PER_MONTH - platformFee;

      await expect(tinySubs.connect(creator1).withdrawFunds())
        .to.emit(tinySubs, "FundsWithdrawn")
        .withArgs(creator1.address, creatorAmount, ethers.ZeroAddress);

      const plan = await tinySubs.getCreatorPlan(creator1.address);
      expect(plan.totalEarned).to.equal(0);
    });

    it("Should not allow withdrawal with no funds", async function () {
      await tinySubs.connect(creator1).withdrawFunds();

      await expect(tinySubs.connect(creator1).withdrawFunds()).to.be.revertedWith(
        "No funds to withdraw"
      );
    });

    it("Should not allow non-creator to withdraw", async function () {
      await expect(tinySubs.connect(subscriber1).withdrawFunds()).to.be.revertedWith(
        "Not a registered creator"
      );
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await tinySubs
        .connect(creator1)
        .registerCreator("Plan 1", "Description 1", PRICE_PER_MONTH, ethers.ZeroAddress);
      await tinySubs
        .connect(creator2)
        .registerCreator("Plan 2", "Description 2", PRICE_PER_MONTH, ethers.ZeroAddress);
      await tinySubs.connect(subscriber1).subscribe(creator1.address, { value: PRICE_PER_MONTH });
    });

    it("Should return all creators", async function () {
      const creators = await tinySubs.getAllCreators();
      expect(creators.length).to.equal(2);
      expect(creators[0]).to.equal(creator1.address);
      expect(creators[1]).to.equal(creator2.address);
    });

    it("Should return creator count", async function () {
      expect(await tinySubs.getCreatorCount()).to.equal(2);
    });

    it("Should return creator subscribers", async function () {
      const subscribers = await tinySubs.getCreatorSubscribers(creator1.address);
      expect(subscribers.length).to.equal(1);
      expect(subscribers[0]).to.equal(subscriber1.address);
    });

    it("Should calculate remaining days correctly", async function () {
      const remainingDays = await tinySubs.getRemainingDays(
        subscriber1.address,
        creator1.address
      );
      expect(remainingDays).to.be.closeTo(30n, 1n);
    });

    it("Should check if subscription is expired", async function () {
      expect(
        await tinySubs.isSubscriptionExpired(subscriber1.address, creator1.address)
      ).to.be.false;

      // Fast forward time
      await time.increase(MONTH_DURATION + 1);

      expect(
        await tinySubs.isSubscriptionExpired(subscriber1.address, creator1.address)
      ).to.be.true;
    });
  });

  describe("Platform Fee Management", function () {
    beforeEach(async function () {
      await tinySubs
        .connect(creator1)
        .registerCreator(PLAN_NAME, PLAN_DESCRIPTION, PRICE_PER_MONTH, ethers.ZeroAddress);
      await tinySubs.connect(subscriber1).subscribe(creator1.address, { value: PRICE_PER_MONTH });
    });

    it("Should allow owner to update platform fee", async function () {
      await tinySubs.connect(owner).updatePlatformFee(500); // 5%
      expect(await tinySubs.platformFeePercent()).to.equal(500);
    });

    it("Should not allow fee greater than 10%", async function () {
      await expect(tinySubs.connect(owner).updatePlatformFee(1001)).to.be.revertedWith(
        "Fee cannot exceed 10%"
      );
    });

    it("Should allow owner to withdraw platform fees", async function () {
      const platformFee = (PRICE_PER_MONTH * 250n) / 10000n;

      await expect(tinySubs.connect(owner).withdrawPlatformFees(ethers.ZeroAddress))
        .to.emit(tinySubs, "PlatformFeeWithdrawn")
        .withArgs(owner.address, platformFee, ethers.ZeroAddress);
    });

    it("Should not allow non-owner to withdraw platform fees", async function () {
      await expect(
        tinySubs.connect(creator1).withdrawPlatformFees(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(tinySubs, "OwnableUnauthorizedAccount");
    });
  });

  describe("Multiple Subscriptions", function () {
    beforeEach(async function () {
      await tinySubs
        .connect(creator1)
        .registerCreator("Plan 1", "Description 1", PRICE_PER_MONTH, ethers.ZeroAddress);
      await tinySubs
        .connect(creator2)
        .registerCreator("Plan 2", "Description 2", PRICE_PER_MONTH, ethers.ZeroAddress);
    });

    it("Should allow subscribing to multiple creators", async function () {
      await tinySubs.connect(subscriber1).subscribe(creator1.address, { value: PRICE_PER_MONTH });
      await tinySubs.connect(subscriber1).subscribe(creator2.address, { value: PRICE_PER_MONTH });

      const sub1 = await tinySubs.getSubscription(subscriber1.address, creator1.address);
      const sub2 = await tinySubs.getSubscription(subscriber1.address, creator2.address);

      expect(sub1.isActive).to.be.true;
      expect(sub2.isActive).to.be.true;
    });

    it("Should track multiple subscribers per creator", async function () {
      await tinySubs.connect(subscriber1).subscribe(creator1.address, { value: PRICE_PER_MONTH });
      await tinySubs.connect(subscriber2).subscribe(creator1.address, { value: PRICE_PER_MONTH });

      const plan = await tinySubs.getCreatorPlan(creator1.address);
      expect(plan.subscriberCount).to.equal(2);

      const subscribers = await tinySubs.getCreatorSubscribers(creator1.address);
      expect(subscribers.length).to.equal(2);
    });
  });
});
