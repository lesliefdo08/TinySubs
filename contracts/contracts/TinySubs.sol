// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TinySubs
 * @dev A decentralized micro-subscription platform for creators
 * @notice Enables creators to offer subscription plans with small recurring payments
 */
contract TinySubs is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // ============ Structs ============

    /**
     * @dev Represents a creator's subscription plan
     */
    struct SubscriptionPlan {
        string planName;
        string description;
        uint256 pricePerMonth; // Price in wei (for native token) or token units
        address tokenAddress; // address(0) for native token (ETH/MATIC)
        bool isActive;
        uint256 subscriberCount;
        uint256 totalEarned;
        uint256 createdAt;
    }

    /**
     * @dev Represents a user's subscription to a creator
     */
    struct Subscription {
        address creator;
        uint256 startTime;
        uint256 lastPaymentTime;
        uint256 expiryTime;
        bool isActive;
        uint256 totalPaid;
    }

    // ============ State Variables ============

    /// @notice Mapping from creator address to their subscription plan
    mapping(address => SubscriptionPlan) public creatorPlans;

    /// @notice Mapping from subscriber to creator to subscription details
    mapping(address => mapping(address => Subscription)) public subscriptions;

    /// @notice Mapping from creator to their list of subscribers
    mapping(address => address[]) public creatorSubscribers;

    /// @notice Mapping to check if an address is a registered creator
    mapping(address => bool) public isCreator;

    /// @notice Array of all creator addresses
    address[] public allCreators;

    /// @notice Platform fee percentage (in basis points, 100 = 1%)
    uint256 public platformFeePercent = 250; // 2.5%

    /// @notice Accumulated platform fees
    mapping(address => uint256) public platformFees;

    /// @notice Month duration in seconds (30 days)
    uint256 public constant MONTH_DURATION = 30 days;

    // ============ Events ============

    event CreatorRegistered(
        address indexed creator,
        string planName,
        uint256 pricePerMonth,
        address tokenAddress
    );

    event PlanUpdated(
        address indexed creator,
        string planName,
        uint256 pricePerMonth
    );

    event SubscriptionCreated(
        address indexed subscriber,
        address indexed creator,
        uint256 amount,
        uint256 expiryTime
    );

    event SubscriptionRenewed(
        address indexed subscriber,
        address indexed creator,
        uint256 amount,
        uint256 newExpiryTime
    );

    event SubscriptionCancelled(
        address indexed subscriber,
        address indexed creator
    );

    event FundsWithdrawn(
        address indexed creator,
        uint256 amount,
        address tokenAddress
    );

    event PlatformFeeWithdrawn(
        address indexed owner,
        uint256 amount,
        address tokenAddress
    );

    // ============ Constructor ============

    constructor() Ownable(msg.sender) {}

    // ============ Creator Functions ============

    /**
     * @notice Register as a creator with a subscription plan
     * @param _planName Name of the subscription plan
     * @param _description Description of what subscribers get
     * @param _pricePerMonth Monthly subscription price
     * @param _tokenAddress Token address (address(0) for native token)
     */
    function registerCreator(
        string memory _planName,
        string memory _description,
        uint256 _pricePerMonth,
        address _tokenAddress
    ) external {
        require(!isCreator[msg.sender], "Already registered as creator");
        require(_pricePerMonth > 0, "Price must be greater than 0");
        require(bytes(_planName).length > 0, "Plan name required");

        creatorPlans[msg.sender] = SubscriptionPlan({
            planName: _planName,
            description: _description,
            pricePerMonth: _pricePerMonth,
            tokenAddress: _tokenAddress,
            isActive: true,
            subscriberCount: 0,
            totalEarned: 0,
            createdAt: block.timestamp
        });

        isCreator[msg.sender] = true;
        allCreators.push(msg.sender);

        emit CreatorRegistered(msg.sender, _planName, _pricePerMonth, _tokenAddress);
    }

    /**
     * @notice Update subscription plan details
     * @param _planName New plan name
     * @param _description New description
     * @param _pricePerMonth New monthly price
     */
    function updatePlan(
        string memory _planName,
        string memory _description,
        uint256 _pricePerMonth
    ) external {
        require(isCreator[msg.sender], "Not a registered creator");
        require(_pricePerMonth > 0, "Price must be greater than 0");

        SubscriptionPlan storage plan = creatorPlans[msg.sender];
        plan.planName = _planName;
        plan.description = _description;
        plan.pricePerMonth = _pricePerMonth;

        emit PlanUpdated(msg.sender, _planName, _pricePerMonth);
    }

    /**
     * @notice Toggle plan active status
     */
    function togglePlanStatus() external {
        require(isCreator[msg.sender], "Not a registered creator");
        creatorPlans[msg.sender].isActive = !creatorPlans[msg.sender].isActive;
    }

    /**
     * @notice Withdraw accumulated funds
     */
    function withdrawFunds() external nonReentrant {
        require(isCreator[msg.sender], "Not a registered creator");
        
        SubscriptionPlan storage plan = creatorPlans[msg.sender];
        uint256 amount = plan.totalEarned;
        require(amount > 0, "No funds to withdraw");

        plan.totalEarned = 0;

        if (plan.tokenAddress == address(0)) {
            // Native token withdrawal
            (bool success, ) = payable(msg.sender).call{value: amount}("");
            require(success, "Transfer failed");
        } else {
            // ERC20 token withdrawal
            IERC20(plan.tokenAddress).safeTransfer(msg.sender, amount);
        }

        emit FundsWithdrawn(msg.sender, amount, plan.tokenAddress);
    }

    // ============ Subscriber Functions ============

    /**
     * @notice Subscribe to a creator's plan
     * @param _creator Address of the creator
     */
    function subscribe(address _creator) external payable nonReentrant {
        require(isCreator[_creator], "Not a registered creator");
        require(_creator != msg.sender, "Cannot subscribe to yourself");

        SubscriptionPlan storage plan = creatorPlans[_creator];
        require(plan.isActive, "Plan is not active");

        Subscription storage sub = subscriptions[msg.sender][_creator];
        require(!sub.isActive, "Already subscribed");

        uint256 price = plan.pricePerMonth;
        uint256 platformFee = (price * platformFeePercent) / 10000;
        uint256 creatorAmount = price - platformFee;

        if (plan.tokenAddress == address(0)) {
            // Native token payment
            require(msg.value == price, "Incorrect payment amount");
        } else {
            // ERC20 token payment
            IERC20(plan.tokenAddress).safeTransferFrom(
                msg.sender,
                address(this),
                price
            );
        }

        // Update platform fees
        platformFees[plan.tokenAddress] += platformFee;

        // Update creator earnings
        plan.totalEarned += creatorAmount;
        plan.subscriberCount++;

        // Create subscription
        uint256 expiryTime = block.timestamp + MONTH_DURATION;
        sub.creator = _creator;
        sub.startTime = block.timestamp;
        sub.lastPaymentTime = block.timestamp;
        sub.expiryTime = expiryTime;
        sub.isActive = true;
        sub.totalPaid = price;

        // Add to creator's subscriber list
        creatorSubscribers[_creator].push(msg.sender);

        emit SubscriptionCreated(msg.sender, _creator, price, expiryTime);
    }

    /**
     * @notice Renew an existing subscription
     * @param _creator Address of the creator
     */
    function renewSubscription(address _creator) external payable nonReentrant {
        Subscription storage sub = subscriptions[msg.sender][_creator];
        require(sub.isActive, "No active subscription");

        SubscriptionPlan storage plan = creatorPlans[_creator];
        require(plan.isActive, "Plan is not active");

        uint256 price = plan.pricePerMonth;
        uint256 platformFee = (price * platformFeePercent) / 10000;
        uint256 creatorAmount = price - platformFee;

        if (plan.tokenAddress == address(0)) {
            require(msg.value == price, "Incorrect payment amount");
        } else {
            IERC20(plan.tokenAddress).safeTransferFrom(
                msg.sender,
                address(this),
                price
            );
        }

        // Update fees and earnings
        platformFees[plan.tokenAddress] += platformFee;
        plan.totalEarned += creatorAmount;

        // Extend subscription
        sub.lastPaymentTime = block.timestamp;
        sub.expiryTime = block.timestamp + MONTH_DURATION;
        sub.totalPaid += price;

        emit SubscriptionRenewed(msg.sender, _creator, price, sub.expiryTime);
    }

    /**
     * @notice Cancel an active subscription
     * @param _creator Address of the creator
     */
    function cancelSubscription(address _creator) external {
        Subscription storage sub = subscriptions[msg.sender][_creator];
        require(sub.isActive, "No active subscription");

        sub.isActive = false;
        creatorPlans[_creator].subscriberCount--;

        emit SubscriptionCancelled(msg.sender, _creator);
    }

    // ============ View Functions ============

    /**
     * @notice Get all creators
     * @return Array of creator addresses
     */
    function getAllCreators() external view returns (address[] memory) {
        return allCreators;
    }

    /**
     * @notice Get creator plan details
     * @param _creator Creator address
     * @return SubscriptionPlan struct
     */
    function getCreatorPlan(address _creator)
        external
        view
        returns (SubscriptionPlan memory)
    {
        return creatorPlans[_creator];
    }

    /**
     * @notice Get subscription details
     * @param _subscriber Subscriber address
     * @param _creator Creator address
     * @return Subscription struct
     */
    function getSubscription(address _subscriber, address _creator)
        external
        view
        returns (Subscription memory)
    {
        return subscriptions[_subscriber][_creator];
    }

    /**
     * @notice Get all subscribers of a creator
     * @param _creator Creator address
     * @return Array of subscriber addresses
     */
    function getCreatorSubscribers(address _creator)
        external
        view
        returns (address[] memory)
    {
        return creatorSubscribers[_creator];
    }

    /**
     * @notice Check if subscription is expired
     * @param _subscriber Subscriber address
     * @param _creator Creator address
     * @return bool indicating if subscription is expired
     */
    function isSubscriptionExpired(address _subscriber, address _creator)
        external
        view
        returns (bool)
    {
        Subscription memory sub = subscriptions[_subscriber][_creator];
        return sub.isActive && block.timestamp > sub.expiryTime;
    }

    /**
     * @notice Get remaining days in subscription
     * @param _subscriber Subscriber address
     * @param _creator Creator address
     * @return Number of days remaining
     */
    function getRemainingDays(address _subscriber, address _creator)
        external
        view
        returns (uint256)
    {
        Subscription memory sub = subscriptions[_subscriber][_creator];
        if (!sub.isActive || block.timestamp >= sub.expiryTime) {
            return 0;
        }
        return (sub.expiryTime - block.timestamp) / 1 days;
    }

    /**
     * @notice Get total number of creators
     * @return Number of creators
     */
    function getCreatorCount() external view returns (uint256) {
        return allCreators.length;
    }

    // ============ Admin Functions ============

    /**
     * @notice Update platform fee percentage
     * @param _newFeePercent New fee in basis points (100 = 1%)
     */
    function updatePlatformFee(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= 1000, "Fee cannot exceed 10%");
        platformFeePercent = _newFeePercent;
    }

    /**
     * @notice Withdraw platform fees
     * @param _tokenAddress Token address (address(0) for native)
     */
    function withdrawPlatformFees(address _tokenAddress)
        external
        onlyOwner
        nonReentrant
    {
        uint256 amount = platformFees[_tokenAddress];
        require(amount > 0, "No fees to withdraw");

        platformFees[_tokenAddress] = 0;

        if (_tokenAddress == address(0)) {
            (bool success, ) = payable(owner()).call{value: amount}("");
            require(success, "Transfer failed");
        } else {
            IERC20(_tokenAddress).safeTransfer(owner(), amount);
        }

        emit PlatformFeeWithdrawn(owner(), amount, _tokenAddress);
    }

    // ============ Emergency Functions ============

    /**
     * @notice Emergency withdrawal function (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = payable(owner()).call{value: balance}("");
            require(success, "Transfer failed");
        }
    }

    // Allow contract to receive native tokens
    receive() external payable {}
}
