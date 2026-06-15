# Changelog

All notable changes to FunPlay Skill will be documented in this file.

This project follows a simple changelog format inspired by Keep a Changelog, and uses semantic versioning when releases are tagged.

## [Unreleased]

### Added

- Added `commercial-unity-game`, a verified Unity commercial-readiness workflow with sanitized references and a commercial-plan validator.
- Added `playable-game-build-flow`, a verified browser-game vertical-slice workflow adapted from the Zaohua workflow notes with a pillar-contract validator.
- Added explicit skill categories and validation for category metadata.

## [0.3.0] - 2026-05-21

### Changed

- Updated `unity-mcp-workflow` from the latest `FunplayAI/funplay-unity-mcp` default project skill guidance.
- Tightened the skill validation policy so shipped skills must have tests/scripts, verified upstream provenance, or be a required meta-routing skill.

### Removed

- Removed unverified advisory skills and their command wrappers until they have a validation surface.

## [0.2.0] - 2026-04-30

### Added

- Added `unity-mcp-workflow`, the default project workflow skill from `FunplayAI/funplay-unity-mcp`.
- Added repository validation for skill metadata, README indexing, and skill directory naming.
- Added contributor, release, PR, and CI scaffolding borrowed from the Funplay MCP project family.

### Changed

- Updated engine workflow command wrappers to route Unity MCP-connected projects to `unity-mcp-workflow`.
