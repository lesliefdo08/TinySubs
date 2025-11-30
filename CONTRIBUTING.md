# Contributing to TinySubs

Thank you for your interest in contributing to TinySubs! 🎉

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/TinySubs.git`
3. Run setup: `node setup.js`
4. Create a branch: `git checkout -b feature/your-feature`

## Code Style

- Follow TypeScript best practices
- Use meaningful variable names
- Add comments for complex logic
- Run `npm run lint` before committing

## Smart Contract Guidelines

- Write comprehensive tests for new features
- Gas optimization is important
- Follow Solidity best practices
- Use OpenZeppelin libraries where possible

## Testing

### Smart Contracts
```bash
cd contracts
npx hardhat test
```

### Frontend
```bash
npm run dev
# Test manually in browser
```

## Pull Request Process

1. Update README.md if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update documentation
5. Create PR with clear description

## Commit Messages

Use conventional commits:
- `feat: Add new feature`
- `fix: Fix bug`
- `docs: Update documentation`
- `test: Add tests`
- `refactor: Refactor code`

## Questions?

Open an issue or reach out to the maintainers.

---

Built with ❤️ for BuildOnchain
