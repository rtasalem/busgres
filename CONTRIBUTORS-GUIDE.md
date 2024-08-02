# Contributor's Guide
This guide is for any developer who wants to contribute to the Busgres Node.js package.
## Reach Out
If you have any ideas for improvements or new features, reach out. Any and all ideas are welcome to be discussed.
## Branch Naming
Branch naming is largely flexible. The only requirement is that it is relevent to the work being completed on the branch. Each branch must include one of the following prefixes:
- `feature/`: Implementation of new features.
- `bugfix/`: Repairing bugs in the codebase.
- `refactor/`: Refactoring/cleaning up the codebase.
- `docs/`: Creating or updating existing documentation.
- `chore/`: Any small miscellaneous tasks.
Once merged into the main branch, your working branch must be deleted.
## GitHub Workflows
Two GitHub Actions have been configured to automate publishing new versions (stable and alpha) to the NPM registry:
- [npm-publish-alpha.yaml](https://github.com/rtasalem/busgres/blob/main/.github/workflows/npm-publish-alpha.yaml)
- [npm-publish-stable.yaml](https://github.com/rtasalem/busgres/blob/main/.github/workflows/npm-publish-stable.yaml)