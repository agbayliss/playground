# Handoff Document Guidelines

These guidelines are for Claude Chat when writing a handoff document for a new project. The handoff document is what Claude Cowork receives to build the project, so it needs to contain everything Cowork needs to execute without going back and forth for clarification.

## How This Workflow Works

1. Brainstorm and define a new project idea in Claude Chat
2. When ready to build, tell Claude Chat to write a handoff document following these guidelines
3. Give the handoff document to Claude Cowork to read and build

## What Goes in a Handoff Document

### Project Overview (required)

A short description of what this project is, who it's for, and what it should feel like to use. This is the "elevator pitch" that helps Cowork understand the intent, not just the mechanics. Include:

- Project name
- One-paragraph concept description
- The goal or purpose (what should someone be able to do with it?)
- Tone/vibe (playful, minimal, technical, whimsical, etc.)

### Folder and File Structure (required)

Where this project lives in the repo and what files need to be created. Every new project in this playground gets its own subfolder off the root.

- Folder name (e.g., `/time-travel/`)
- List of files to create (e.g., `index.html`, `data.js`, `styles.css`)
- Whether it's a single-page or multi-page project
- If multi-page, describe the flow between pages

### Design Specs (required)

This playground has an established design system. Handoff docs should specify how the new project relates to it, plus any project-specific design details.

- **Use the existing playground design system** unless explicitly overriding it: dark theme, DM Sans/DM Mono fonts, indigo accent (`#6366f1`), CSS custom properties from the root `index.html`
- Page layout description (what goes where, how things are arranged)
- Any custom colors, icons, or visual elements beyond the base theme
- Responsive behavior expectations (mobile-friendly? desktop-only?)
- Specific UI components needed (cards, modals, forms, filters, tabs, etc.) and how they should behave

### Content and Data (required)

The actual stuff that goes on the page. Be specific — Cowork shouldn't have to invent content unless you explicitly say "make something up."

- Headings, labels, and copy (exact text or clear direction on what to write)
- Data sets (if the project displays a catalog, list, or collection, define the items — names, descriptions, attributes, etc.)
- Any placeholder or sample data that should ship with the project

### Functionality and Interactions (required)

What the project does beyond just displaying content.

- User interactions (click, filter, search, submit, expand, etc.)
- State changes (what happens when someone interacts with something?)
- Any JavaScript behavior (dynamic rendering, event listeners, animations)
- If using WebMCP: which API (declarative, imperative, or both), tool names, tool descriptions, input schemas, and execute function behavior

### Home Page Card (required)

Every project gets a card on the playground home page (`index.html`). Provide:

- Card title
- Card description (1-2 sentences)
- Icon (emoji)
- Tags (short labels like `webmcp`, `interactive`, `game`, etc.)

### What to Leave Out

Don't include instructions that duplicate what's already in the project context files. Cowork already has access to and should read:

- `PROJECT_CONTEXT.md` — repo structure, design system, deploy workflow
- `LESSONS_LEARNED.md` — technical patterns and known gotchas
- `TODO.md` — existing ideas and backlog

The handoff doc should focus on what's *new and specific* to this project.

## Format

There are no hard formatting requirements. Markdown is fine, plain text is fine, a structured outline is fine. What matters is that the information above is present and specific enough to build from. That said, the clearest handoff docs tend to use headers to separate the sections listed above so nothing gets buried in a wall of text.

## Example Structure

```
# [Project Name] — Handoff Doc

## Overview
[What is this? What's the vibe?]

## Structure
[Folder, files, page flow]

## Design
[Layout, custom visuals, components]

## Content
[Copy, data, items]

## Functionality
[Interactions, JS behavior, tools]

## Home Page Card
[Title, description, icon, tags]
```
