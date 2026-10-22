const fs = require('fs');
const path = require('path');

function escapePdf(text) {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

class SimplePdf {
  constructor() {
    this.stream = [];
  }

  addText(text, x, y, size = 10, font = 'F1', rgb = [0.1, 0.1, 0.1]) {
    const [r, g, b] = rgb;
    this.stream.push(
      `${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} rg BT /${font} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${escapePdf(text)}) Tj ET`
    );
  }

  addLine(x1, y1, x2, y2, width = 0.5, rgb = [0.75, 0.75, 0.75]) {
    const [r, g, b] = rgb;
    this.stream.push(
      `${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} RG ${width} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`
    );
  }

  addRect(x, y, w, h, fillRgb = [0.95, 0.95, 0.95]) {
    const [r, g, b] = fillRgb;
    this.stream.push(
      `${r.toFixed(2)} ${g.toFixed(2)} ${b.toFixed(2)} rg ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`
    );
  }

  build() {
    const streamContent = this.stream.join('\n');
    const streamBuffer = Buffer.from(streamContent, 'utf-8');
    const streamLength = streamBuffer.length;

    const objects = [
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 6 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> >>\nendobj',
      '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
      '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj',
      `6 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj`
    ];

    let header = '%PDF-1.4\n';
    let offset = Buffer.byteLength(header, 'utf-8');
    const offsets = [0];

    let body = '';
    for (let i = 0; i < objects.length; i++) {
      offsets.push(offset);
      const objStr = objects[i] + '\n';
      body += objStr;
      offset += Buffer.byteLength(objStr, 'utf-8');
    }

    let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i++) {
      xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    }

    const startxref = offset;
    const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;

    return Buffer.concat([
      Buffer.from(header, 'utf-8'),
      Buffer.from(body, 'utf-8'),
      Buffer.from(xref, 'utf-8'),
      Buffer.from(trailer, 'utf-8')
    ]);
  }
}

function generateCv() {
  const doc = new SimplePdf();
  const left = 45;
  const right = 550;
  let y = 805;

  // Header: Name & Specialization
  doc.addText('Mohamed Hajith', left, y, 22, 'F2', [0.05, 0.15, 0.25]);
  y -= 18;
  doc.addText('Full-Stack Software Developer | Backend & Database Engineering', left, y, 10, 'F2', [0.0, 0.5, 0.6]);
  y -= 14;

  // Contact line
  const contactText = 'Batticaloa, Sri Lanka  |  ahammedlebbehajith@gmail.com  |  linkedin.com/in/mohamed-hajith-b53559295';
  doc.addText(contactText, left, y, 8.5, 'F1', [0.35, 0.35, 0.35]);
  y -= 12;
  const webText = 'Portfolio: hzlabs.studio  |  GitHub: github.com/HajithMohamed';
  doc.addText(webText, left, y, 8.5, 'F1', [0.35, 0.35, 0.35]);
  y -= 10;
  doc.addLine(left, y, right, y, 1, [0.0, 0.5, 0.6]);
  y -= 16;

  // Summary
  doc.addText('PROFESSIONAL SUMMARY', left, y, 10, 'F2', [0.05, 0.15, 0.25]);
  y -= 12;
  doc.addText('Third-year BICT (Hons) undergraduate at the University of Ruhuna. I build practical web applications, secure REST APIs,', left, y, 8.5, 'F1', [0.2, 0.2, 0.2]);
  y -= 11;
  doc.addText('and database-driven business systems using React, Next.js, Node.js, and PostgreSQL. Open to software engineering internships,', left, y, 8.5, 'F1', [0.2, 0.2, 0.2]);
  y -= 11;
  doc.addText('junior development roles, and collaborative full-stack projects.', left, y, 8.5, 'F1', [0.2, 0.2, 0.2]);
  y -= 14;

  // Education
  doc.addText('EDUCATION', left, y, 10, 'F2', [0.05, 0.15, 0.25]);
  y -= 12;
  doc.addText('Bachelor of Information and Communication Technology (Honours) — BICT (Hons)', left, y, 9, 'F2', [0.1, 0.1, 0.1]);
  doc.addText('2023 – 2027 (Expected)', right - 110, y, 8.5, 'F1', [0.4, 0.4, 0.4]);
  y -= 11;
  doc.addText('Faculty of Technology, University of Ruhuna, Sri Lanka', left, y, 8.5, 'F1', [0.3, 0.3, 0.3]);
  y -= 14;

  // Technical Skills
  doc.addText('TECHNICAL SKILLS', left, y, 10, 'F2', [0.05, 0.15, 0.25]);
  y -= 12;
  const skills = [
    ['Languages:', 'JavaScript, TypeScript, Java, PHP, SQL, Python fundamentals'],
    ['Frontend:', 'React, Next.js, Redux Toolkit, Tailwind CSS, HTML5, CSS3'],
    ['Backend:', 'Node.js, Express.js, NestJS, Spring Boot, REST APIs'],
    ['Databases:', 'PostgreSQL, MySQL, MongoDB, Prisma ORM, PL/pgSQL'],
    ['Testing & DevOps:', 'Playwright, Vitest, Git, GitHub Actions, Docker, Docker Compose, Postman'],
    ['Security & Architecture:', 'JWT, Role-Based Access Control (RBAC), Socket.IO, Decoupled MVC / REST'],
    ['Currently Exploring:', 'Flutter / Dart, Applied AI in practical software systems, Cloud fundamentals (AWS)']
  ];
  for (const [cat, items] of skills) {
    doc.addText(cat, left, y, 8.5, 'F2', [0.15, 0.15, 0.15]);
    doc.addText(items, left + 130, y, 8.5, 'F1', [0.25, 0.25, 0.25]);
    y -= 11;
  }
  y -= 4;

  // Featured Engineering Projects
  doc.addText('FEATURED ENGINEERING PROJECTS', left, y, 10, 'F2', [0.05, 0.15, 0.25]);
  y -= 13;

  const projects = [
    {
      title: '1. Saga Elite — Full-Stack E-Commerce Platform',
      tech: 'React, Redux, Node.js, Express, MongoDB, Socket.IO, Playwright, GitHub Actions',
      points: [
        'Collaborative e-commerce application developed by a 4-member team. Led API architecture and admin workflows.',
        'Implemented JWT authentication, role-based controls, real-time Socket.IO notifications, and OCR receipt processing.',
        'Established automated end-to-end regression test suites with Playwright integrated into GitHub Actions CI/CD.',
        'Repository: github.com/Hz-Labs-studio/Saga-Elite-Web-project  |  Live: saga-elite.shop'
      ]
    },
    {
      title: '2. BenchBook — Laboratory Resource Reservation System',
      tech: 'Next.js, TypeScript, PostgreSQL, Prisma, Vitest',
      points: [
        'Engineered resource reservation platform managing medical and laboratory equipment availability.',
        'Designed database-enforced booking constraints in PostgreSQL to eliminate conflicting overlapping reservations.',
        'Constructed comprehensive unit and integration test suites using Vitest verifying reservation business logic.',
        'Repository: github.com/HajithMohamed/Medical-Lab-Resource-Reservation-System'
      ]
    },
    {
      title: '3. BloodBridge — Advanced Database Management System (ADBMS Prototype)',
      tech: 'PostgreSQL, PL/pgSQL, React, Node.js, Docker, GitHub Actions',
      points: [
        'Collaborative academic prototype for blood donation and inventory distribution management.',
        'Contributed pre-handoff architecture, PL/pgSQL transaction procedures, and transfer integrity constraints (PR #7).',
        'Authored database contract tests and integrated automated verification into GitHub Actions CI pipeline.',
        'Repository: github.com/akalanka001/-BloodBridge--ADBMS  |  Academic demonstration project'
      ]
    },
    {
      title: '4. HZ Labs — Portfolio and Content Management Platform',
      tech: 'Next.js, NestJS, TypeScript, Prisma, PostgreSQL',
      points: [
        'Architected full-stack portfolio and CMS with authenticated admin panel and real-time GitHub telemetry sync.',
        'Engineered type-safe REST APIs with NestJS and Prisma ORM for content updates and contact intake workflows.',
        'Repository: github.com/HajithMohamed/my_portfoli_website  |  Live: hzlabs.studio'
      ]
    },
    {
      title: '5. Shoe Bank — Footwear Business Management System',
      tech: 'PHP, MySQL, Tailwind CSS, Docker',
      points: [
        'Engineered operational business platform managing inventory, invoices, customer credit, and cheque registers.',
        'Dockerized development environment ensuring consistent containerized deployment and reproducible database states.',
        'Repository: github.com/HajithMohamed/Footwear_Business_Management_System'
      ]
    }
  ];

  for (const proj of projects) {
    doc.addText(proj.title, left, y, 9, 'F2', [0.05, 0.15, 0.25]);
    doc.addText(proj.tech, right - 260, y, 7.5, 'F1', [0.0, 0.45, 0.55]);
    y -= 10;
    for (const point of proj.points) {
      doc.addText('•', left + 8, y, 7.5, 'F1', [0.4, 0.4, 0.4]);
      doc.addText(point, left + 18, y, 8, 'F1', [0.25, 0.25, 0.25]);
      y -= 9.5;
    }
    y -= 3;
  }

  // Certifications
  doc.addText('CERTIFICATIONS & CONTINUOUS LEARNING', left, y, 10, 'F2', [0.05, 0.15, 0.25]);
  y -= 12;
  doc.addText('The Complete Full-Stack Web Development Bootcamp (62 Hours) — Udemy (Dr. Angela Yu)', left, y, 8.5, 'F2', [0.15, 0.15, 0.15]);
  doc.addText('Credential: ude.my/UC-8df6ecc3-ffca-4dd1-aafa-c240922d4c5e', right - 220, y, 7.5, 'F1', [0.4, 0.4, 0.4]);

  const outputBuffer = doc.build();
  const outputPath = path.join(__dirname, '..', 'public', 'Mohamed_Hajith_CV.pdf');
  fs.writeFileSync(outputPath, outputBuffer);
  console.log(`Generated CV at: ${outputPath} (${outputBuffer.length} bytes)`);
}

generateCv();
