import { digestReadme, truncateAtSentence } from './readme-digest';

describe('digestReadme', () => {
  it('summarises the opening paragraph and ignores badges, images and html', () => {
    const digest = digestReadme(`# BenchBook — Lab Resource Reservation System

<p align="center"><img src="docs/banner.png" alt="banner" /></p>

[![CI](https://github.com/o/r/actions/workflows/ci.yml/badge.svg)](https://github.com/o/r/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)

BenchBook gives everyone in a medical laboratory network **one live schedule** for shared instruments, rooms and [sample-transport vans](docs/vans.md). Bookings can never clash.

**Links:** [ER diagram](docs/er.svg) · [Demo video](https://example.com) · [Design decisions](docs/decisions.md)
`);
    expect(digest.summary).toBe(
      'BenchBook gives everyone in a medical laboratory network one live schedule for shared instruments, rooms and sample-transport vans. Bookings can never clash.',
    );
  });

  it('returns no summary for a README that is only a title', () => {
    const digest = digestReadme(
      '# -BloodBridge--ADBMS\nBloodBridge: An Index-Optimized Emergency Blood Availability and Donor Matching System\n',
    );
    expect(digest).toEqual({ summary: null, sections: [] });
  });

  it('prefers the paragraph that names the project over a slogan', () => {
    const digest = digestReadme(`# 🌉 TechBridge

> **Digital Opportunity Bridge for Technology Students**
> Empowering students across ICT, ET and BST by connecting them directly with industry opportunities, hardware and mentors

## 📖 Overview

Students in technology disciplines frequently face hurdles when discovering career opportunities and borrowing hardware.

TechBridge centralizes this ecosystem into a single platform built for technology faculties. It enables organisations to publish opportunities.
`);
    expect(digest.summary).toBe(
      'TechBridge centralizes this ecosystem into a single platform built for technology faculties. It enables organisations to publish opportunities.',
    );
    expect(digest.sections[0].heading).toBe('Overview');
  });

  it('skips code blocks and setup sections, and keeps features, stack and testing', () => {
    const digest = digestReadme(`# Shoe Bank

Mobile-first inventory, credit-sales and reporting system for a Sri Lankan wholesale footwear shop. Built to run on shared hosting.

## Getting started

Install dependencies and run the server:

\`\`\`bash
npm install
# Features of the CLI
\`\`\`

## 4. Features

- **Inventory:** imported, local and custom products
- **Credit sales:** customer ledgers and cheque reminders
- Profit and cash are reported separately

## Tech stack

| Layer | Technology |
|-------|------------|
| Backend | PHP 8.1, custom MVC |
| Database | MySQL / MariaDB |

## Testing and CI

A dependency-free test suite covers landed costing and customer statements.

## License

MIT
`);
    expect(digest.sections).toEqual([
      {
        heading: 'Features',
        body: '• Inventory: imported, local and custom products\n• Credit sales: customer ledgers and cheque reminders\n• Profit and cash are reported separately',
      },
      {
        heading: 'Tech stack',
        body: '• Backend — PHP 8.1, custom MVC\n• Database — MySQL / MariaDB',
      },
      {
        heading: 'Testing and CI',
        body: 'A dependency-free test suite covers landed costing and customer statements.',
      },
    ]);
  });

  it('builds one bullet per sub-heading when features are grouped by role', () => {
    const digest = digestReadme(`# Faculty Event Management System

A university event management system that streamlines event approval workflows and engagement within a faculty.

## Features

### Admin
- **User Management**: Add and edit students and lecturers.
- **Event Oversight**: Approve or reject events with conflict detection.

### Student
- **Event Participation**: Browse and register for events.
- **Club Creation**: Request new clubs.

## Tech Stack

### Frontend
- **Framework:** React 18
- **Styling:** Tailwind CSS
`);
    expect(digest.sections).toEqual([
      {
        heading: 'Features',
        body: '• Admin — User Management, Event Oversight\n• Student — Event Participation, Club Creation',
      },
      { heading: 'Tech Stack', body: '• Frontend — React 18, Tailwind CSS' },
    ]);
  });

  it('caps features at eight bullets and shortens long ones', () => {
    const items = Array.from(
      { length: 12 },
      (_, i) => `- Feature ${i + 1} ${'detail '.repeat(i === 0 ? 40 : 2)}`,
    ).join('\n');
    const digest = digestReadme(
      `# Demo\n\nA demo project that shows how long feature lists are shortened for the case study.\n\n## Features\n\n${items}\n`,
    );
    const bullets = digest.sections[0].body.split('\n');
    expect(bullets).toHaveLength(8);
    expect(bullets[0].length).toBeLessThanOrEqual(162);
    expect(bullets[0].endsWith('…')).toBe(true);
  });
});

describe('truncateAtSentence', () => {
  it('cuts at the last full sentence that fits', () => {
    const text = `${'First sentence is here. '.repeat(10)}Last bit`;
    const result = truncateAtSentence(text, 100);
    expect(result.length).toBeLessThanOrEqual(100);
    expect(result.endsWith('.')).toBe(true);
  });

  it('falls back to a word boundary with an ellipsis', () => {
    expect(truncateAtSentence('word '.repeat(40).trim(), 50)).toMatch(
      /^(word ){8}word…$/,
    );
  });
});
