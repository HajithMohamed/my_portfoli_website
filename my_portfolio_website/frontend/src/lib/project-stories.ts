/**
 * Editorial notes derived from public repository READMEs, reviewed 2026-09-10.
 * These describe project goals and documented design, not verified deployments,
 * individual contribution percentages, commercial results, or production readiness.
 * Live repository activity and deployment evidence are resolved separately.
 */
export type ProjectStory = {
  repository: string;
  title: string;
  goal: string;
  summary: string;
  technologies: string[];
  sourceUrl: string;
  reviewedAt: string;
  sections: { heading: string; body: string }[];
  blog: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
  };
  coverImage?: string;
};

export const projectStories: ProjectStory[] = [
  {
    repository: "HajithMohamed/Saga-Elite-Web-project",
    title: "Saga Elite",
    goal: "Build a limited-edition fashion storefront around themed product drops, stock availability, and online or manually verified payments.",
    summary: "A university group project for a Sri Lankan fashion brand, connecting drop-based shopping with order, inventory, payment, and admin workflows.",
    technologies: ["React", "Redux Toolkit", "Node.js", "Express", "MongoDB", "Socket.IO", "Docker"],
    coverImage: "/projects/saga-elite-cover.png",
    sourceUrl: "https://github.com/HajithMohamed/Saga-Elite-Web-project/blob/main/README.md",
    reviewedAt: "2026-09-10",
    sections: [
      {
        heading: "Goal",
        body: "Saga Elite treats a product release as a limited drop with a theme, story, stock limit, and availability window. Its goal is to connect that shopping experience to the everyday work of managing products, orders, and payments for a Sri Lankan fashion brand.",
      },
      {
        heading: "Approach",
        body: "The documented architecture separates a React and Redux Toolkit client from a Node.js and Express API, with MongoDB for users, products, orders, reviews, and drops. Socket.IO carries stock and order notifications; Docker and GitHub Actions support development and build checks.",
      },
      {
        heading: "Workflow",
        body: "Online payments and manual bank payments meet at an order-confirmation step. Manual payments require verification, while gift assignment follows payment confirmation. The admin area separates product, order, inventory, marketing, and support permissions so operational actions have defined access rules.",
      },
      {
        heading: "Evidence",
        body: "The public README identifies this as a four-member undergraduate group project and names Mohamed Hajith among its contributors. This case study summarizes the documented scope; integration availability and deployment readiness require separate verification.",
      },
    ],
    blog: {
      title: "Saga Elite: connecting a fashion drop to the order behind it",
      slug: "saga-elite-fashion-drops-and-order-workflows",
      excerpt: "Project notes on limited-stock releases, payment confirmation, and the admin workflows behind a Sri Lankan fashion storefront.",
      content: `# A storefront built around releases
Saga Elite is a university group project for a Sri Lankan limited-edition fashion brand. Its public README describes a selling model based on themed drops: each release has a story, limited stock, and limited availability. That gives the project a more specific goal than putting a product catalogue online. A visitor needs to understand the release, see what remains available, and move through checkout while the shop can manage the same stock and orders.

# Payment confirmation connects the customer and admin views
The documented checkout supports online payments and manually verified bank payments. Those paths have different confirmation steps. A manual payment needs evidence and verification before an order becomes confirmed; optional bank-inbox and SMS integrations are also described. The important design relationship is the shared confirmation point: gift assignment and order notifications follow payment confirmation rather than a customer simply opening checkout.

This makes an order more than a cart total. Its payment state determines what the customer sees and which action an operator needs to take next. The README's gift system reinforces that relationship by assigning gifts after confirmation and using purchase-value tiers.

# Operational permissions belong in the design
The admin documentation distinguishes product, order, inventory, marketing, and support responsibilities. Restricted admin roles receive specific permissions, while privileged account management is reserved for super administrators. That structure connects the interface to real operational tasks: editing a product and verifying a payment are separate responsibilities, even when both happen inside the same admin area.

# The stack supports both sides of the workflow
The repository describes a React and Redux Toolkit frontend, a Node.js and Express API, MongoDB storage, and Socket.IO notifications. Docker supplies a shared development setup, and GitHub Actions is documented for build and test checks. The README also distinguishes required services from optional integrations, which makes configuration part of the project design.

# Scope of these notes
The README identifies Saga Elite as a four-member undergraduate group project and lists Mohamed Hajith as a contributor. These notes describe its documented goals and architecture. They do not certify a live deployment, successful payment-provider approval, or measured business results.

Source: https://github.com/HajithMohamed/Saga-Elite-Web-project/blob/main/README.md
Repository documentation reviewed on 10 September 2026.`,
    },
  },
  {
    repository: "HajithMohamed/Footwear_Business_Management_System",
    title: "Shoe Bank",
    goal: "Help a Sri Lankan footwear wholesaler track inventory, import costs, credit sales, cheques, and the difference between profit and cash collected.",
    summary: "A mobile-first wholesale management system with landed-cost calculations, customer ledgers, sales, import clearance, and financial reporting.",
    technologies: ["PHP", "MySQL", "Tailwind CSS", "Alpine.js", "Docker"],
    coverImage: "/projects/shoe-bank-cover.png",
    sourceUrl: "https://github.com/HajithMohamed/Footwear_Business_Management_System/blob/Development/README.md",
    reviewedAt: "2026-09-10",
    sections: [
      {
        heading: "Goal",
        body: "Shoe Bank is designed for a Sri Lankan wholesale footwear shop that purchases stock, handles imports, sells on credit, and collects customer payments over time. The mobile-first interface aims to make inventory and financial records usable within that daily workflow.",
      },
      {
        heading: "Approach",
        body: "The project uses PHP, MySQL or MariaDB, a lightweight custom MVC structure, Tailwind CSS, and Alpine.js. The README emphasizes inexpensive shared-hosting operation with no frontend build step, while also documenting Docker development and a Render deployment path.",
      },
      {
        heading: "Workflow",
        body: "Profit and collected cash are calculated separately. Landed cost is copied onto each invoice at sale time, uncosted sales are excluded from profit totals with a warning, and pending or bounced cheques do not count as collected cash. Customer payment history applies receipts to invoices that existed when each payment arrived.",
      },
      {
        heading: "Evidence",
        body: "The Development-branch README marks core inventory, credit, sales, and import phases complete, but reports exports, backup/restore, hardening, PDF invoices, and sharing features as pending. Those are the repository's stated milestones, not an independent production-readiness assessment.",
      },
    ],
    blog: {
      title: "Shoe Bank: why profit and cash need separate views",
      slug: "shoe-bank-profit-cash-and-credit-sales",
      excerpt: "How the wholesale footwear project's documented rules handle landed cost, credit invoices, and cheque clearing without confusing sales with money received.",
      content: `# Start with the shop's actual question
Shoe Bank is a mobile-first management project for a Sri Lankan footwear wholesaler. Its README puts inventory, import clearance, credit sales, and reporting in the same system. The central distinction is between making a profitable sale and receiving its payment. A shop can sell on credit and still have little cash available to purchase the next shipment.

# Keep profit and collected cash separate
The documented profit calculation considers sales, the cost of goods sold, and operating expenses. A credit sale belongs to the day of sale, while the cash view only includes money actually received. Pending and bounced cheques stay outside collected cash. Presenting both views helps explain why an invoice can contribute to revenue while its balance still appears in a customer's ledger.

# Preserve the cost of a sale
The README describes taking a cost snapshot when an invoice is created. Recalculating an import shipment later should not silently rewrite the recorded profit on a past sale. It also treats uncosted sales as incomplete evidence: they still contribute to revenue, but are excluded from profit totals with a visible warning. Missing cost is therefore not presented as a full-margin sale.

Stock purchases are treated as inventory rather than immediately counted as operating expenses. Their cost reaches the profit calculation when the corresponding goods are sold. That rule gives inventory, sales, and reporting a shared interpretation of the same transaction.

# Customer history depends on event order
The documented customer-intelligence service replays an account chronologically. It applies a payment to the oldest invoice that already existed when the payment arrived. This avoids using a past receipt to settle an invoice that had not yet been issued. The derived customer assessment can be recalculated from the underlying ledger, so it is a view of transaction history rather than a replacement for it.

# Fit the implementation to the environment
The stack is PHP with a lightweight MVC structure, MySQL or MariaDB, Tailwind CSS, and Alpine.js. The README explains a no-build frontend setup intended for inexpensive hosting, and provides Docker instructions for development. That choice reflects the project's operating constraints as well as its feature list.

# The work still documented as pending
The reviewed README lists further reports and exports, backup/restore, hardening, PDF invoices, and sharing features as unfinished. This post describes the repository's design and stated progress, not a certification that the application is production ready.

Source: https://github.com/HajithMohamed/Footwear_Business_Management_System/blob/Development/README.md
Repository documentation reviewed on 10 September 2026.`,
    },
  },
  {
    repository: "HajithMohamed/Library-Management-System",
    title: "University Library Management System",
    goal: "Bring book discovery, borrowing, returns, overdue fines, and library administration into a role-based university library application.",
    summary: "A PHP MVC library system for students, faculty, and administrators, with borrowing records, book inventory, email verification, and Docker services.",
    technologies: ["PHP", "MySQL", "Bootstrap", "PHPMailer", "Nginx", "Docker"],
    coverImage: "/projects/university-library-cover.png",
    sourceUrl: "https://github.com/HajithMohamed/Library-Management-System/blob/main/README.md",
    reviewedAt: "2026-09-10",
    sections: [
      {
        heading: "Goal",
        body: "The library project connects finding a book with borrowing and returning it. Student, faculty, and administrator roles share the same book inventory and transaction records, while administrators manage availability, users, reports, and fine settings.",
      },
      {
        heading: "Approach",
        body: "The PHP application separates request controllers, database models, business services, and view templates. Its documented Docker environment runs Nginx, PHP-FPM, MySQL, and PHPMyAdmin, with Bootstrap for the interface and PHPMailer for verification and notifications.",
      },
      {
        heading: "Workflow",
        body: "The README describes book search, borrowing with due dates, returns, automatic overdue-fine calculation, and transaction history. Account registration includes email OTP verification, and role checks separate ordinary library use from administrative actions.",
      },
      {
        heading: "Evidence",
        body: "This case study is based on the public README's features, route catalogue, architecture, and setup instructions. No institutional adoption, active deployment, or performance measurements are claimed.",
      },
    ],
    blog: {
      title: "University Library: following a book from search to return",
      slug: "university-library-search-borrow-return",
      excerpt: "Project notes on connecting catalogue availability, borrowing history, overdue fines, and role-based administration in a PHP MVC application.",
      content: `# Model the complete borrowing journey
The University Library Management System brings book discovery and circulation into one application. The public README describes student, faculty, and administrator accounts, book search, borrowing, returns, and overdue fines. Those features are connected: a search result's availability matters only if borrowing and return records keep that inventory current.

# Three records provide the foundation
The documented schema centers on users, books, and transactions. Users identify the person borrowing, books describe the inventory, and transactions record borrowing and return activity. The README also describes due dates, available and borrowed counts, and transaction history. Together, those records support the path from finding an available title to seeing what remains due on an account.

# Put rules beyond the page template
The PHP code is organized into controllers, models, services, and views. Controllers handle requests, models access stored data, services hold business rules, and views present the result. The directory structure explicitly includes book, user, authentication, and administration services. That separation gives operations such as borrowing and fine calculation a home beyond the form that triggers them.

# Give each role the right workflow
Students and faculty need book discovery and account information. Administrators need inventory editing, user management, reports, and fine settings. The README documents role-based access, email OTP verification, and separate administrative routes. These are parts of the documented design; the presence of a feature list alone does not establish that every security control has been independently tested.

# Document the runtime as part of the project
Docker Compose is described as coordinating Nginx, PHP-FPM, MySQL, and PHPMyAdmin. Composer dependencies are installed before starting the containers, and the database schema is initialized as part of the setup. This makes the local runtime explicit and gives another developer a starting point for reproducing the environment.

# What this case study establishes
The repository supports a case study about library workflows and PHP MVC organization. It does not provide evidence here for university adoption, live service availability, or measured time savings. Those would need their own sources before becoming portfolio claims.

Source: https://github.com/HajithMohamed/Library-Management-System/blob/main/README.md
Repository documentation reviewed on 10 September 2026.`,
    },
  },
  {
    repository: "HajithMohamed/NEXTGEN---Sri-Lankan-Mobile-Shop-eCommerce-Website",
    title: "NEXTGEN Mobile Shop",
    goal: "Connect a Sri Lankan mobile shop's responsive storefront and checkout to product, customer, and order management.",
    summary: "A mobile-shop eCommerce project combining an HTML, CSS, JavaScript, and jQuery storefront with PHP, MySQL, and an admin panel.",
    technologies: ["HTML", "CSS", "JavaScript", "jQuery", "PHP", "MySQL", "Bootstrap"],
    coverImage: "/projects/nextgen-mobile-cover.png",
    sourceUrl: "https://github.com/HajithMohamed/NEXTGEN---Sri-Lankan-Mobile-Shop-eCommerce-Website/blob/main/README.md",
    reviewedAt: "2026-09-10",
    sections: [
      {
        heading: "Goal",
        body: "NEXTGEN aims to give a Sri Lankan mobile shop an online customer journey from product browsing to cart and checkout, together with the administration needed to maintain products, customer accounts, and orders.",
      },
      {
        heading: "Approach",
        body: "The documented stack combines HTML, CSS, JavaScript, jQuery, and Bootstrap with PHP and MySQL. The repository separates admin files, shared includes, configuration, static assets, and database setup.",
      },
      {
        heading: "Workflow",
        body: "The README lists authentication, a shopping cart, checkout, and product, customer, and order management. This links the public storefront to the records shop staff need to maintain after a customer places an order.",
      },
      {
        heading: "Evidence",
        body: "The source provides a feature list and local setup instructions. It does not establish a verified live checkout, payment-provider integration, commercial results, or production readiness.",
      },
    ],
    blog: {
      title: "NEXTGEN: connecting a mobile-shop storefront to its admin tools",
      slug: "nextgen-mobile-shop-storefront-and-admin",
      excerpt: "A look at the documented customer and administration workflows in a PHP and MySQL mobile-shop eCommerce project.",
      content: `# Give the shop a complete customer path
NEXTGEN is an eCommerce website project for a Sri Lankan mobile shop. Its README describes a responsive storefront, user authentication, a shopping cart, and checkout. The goal is to support a connected shopping journey instead of stopping at a static display of products.

# The order also needs an operational home
The same README lists product, customer, and order management in an admin panel. Those functions give the customer-facing pages an operational counterpart: products need maintaining, customers need account records, and orders need a place to be reviewed. A storefront and its admin tools therefore belong to the same product story.

# A familiar web stack with clear boundaries
The documented frontend uses HTML, CSS, JavaScript, jQuery, and Bootstrap. PHP handles the backend with MySQL storage. The directory structure separates administrative pages from static assets, shared includes, configuration, and the database schema. Local setup consists of importing that schema, configuring the database connection, and running a PHP-capable server such as XAMPP or WAMP.

# Describe the evidence precisely
The README lists password hashing, form validation, role-based access, and protections against common web attacks. These are documented features, not an independent security assessment. Similarly, a checkout feature in the README does not establish a payment-provider approval or a currently hosted application. The portfolio can explain the project's scope while keeping deployment evidence and production-readiness checks separate.

Source: https://github.com/HajithMohamed/NEXTGEN---Sri-Lankan-Mobile-Shop-eCommerce-Website/blob/main/README.md
Repository documentation reviewed on 10 September 2026.`,
    },
  },
];
