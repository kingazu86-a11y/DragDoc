/**
 * Professional Document Templates for DragDocs Word Processor
 */

import {
  createDefaultDocument,
  createHeadingBlock,
  createParagraphBlock,
  createTableBlock,
  createQuoteBlock,
  createDiagramBlock,
  createChartBlock,
  DOCUMENT_THEMES
} from './documentModel';

export const DOCUMENT_TEMPLATES = [
  {
    id: 'blank',
    name: 'Blank Document',
    category: 'General',
    description: 'Clean slate with default margins, typography, and standard styles.',
    create: () => createDefaultDocument('Untitled Document')
  },
  {
    id: 'resume',
    name: 'Executive Resume',
    category: 'Career',
    description: 'A polished, modern CV format highlighting leadership, experience, and core competencies.',
    create: () => {
      const doc = createDefaultDocument('Executive Resume - Eleanor Vance');
      doc.theme = DOCUMENT_THEMES.modern;
      doc.blocks = [
        createHeadingBlock('ELEANOR VANCE', 1, { align: 'center', spacingAfter: 2 }),
        createParagraphBlock('Principal Solutions Architect | Cloud Infrastructure & Enterprise Systems', {
          italic: true,
          fontColor: '#0f62fe',
          fontSize: 12
        }, { align: 'center', spacingAfter: 12 }),
        createParagraphBlock('San Francisco, CA • (555) 234-5678 • eleanor.vance@example.com • linkedin.com/in/eleanor-vance', {
          fontSize: 9.5,
          fontColor: '#4b5563'
        }, { align: 'center', spacingAfter: 16 }),

        createHeadingBlock('Professional Summary', 2),
        createParagraphBlock('Visionary technology leader with 12+ years of experience engineering high-performance distributed systems, multi-cloud enterprise architectures, and mission-critical SaaS platforms. Proven track record of scaling engineering teams, reducing cloud infrastructure costs by 35%, and driving multi-million dollar digital transformations.'),

        createHeadingBlock('Core Competencies', 2),
        createParagraphBlock('• Cloud Platforms: AWS, Microsoft Azure, Google Cloud Platform (GCP)', { bold: true }),
        createParagraphBlock('• Architecture: Microservices, Event-Driven Systems, Serverless, Domain-Driven Design (DDD)', { bold: true }),
        createParagraphBlock('• Technologies: Kubernetes, Docker, Terraform, Go, Node.js, Python, PostgreSQL, Kafka', { bold: true }),

        createHeadingBlock('Work Experience', 2),
        createParagraphBlock('Principal Cloud Architect — Vanguard Cloud Technologies (2020 – Present)', { bold: true, fontSize: 11 }),
        createParagraphBlock('• Led architectural design of next-generation multi-tenant cloud storage platform serving 20M+ active users.'),
        createParagraphBlock('• Formulated automated CI/CD and GitOps pipelines accelerating release velocity by 65%.'),
        createParagraphBlock('• Mentored 25+ senior software engineers across cross-functional distributed teams.'),

        createParagraphBlock('Senior Software Engineer — Apex Global Systems (2016 – 2020)', { bold: true, fontSize: 11 }),
        createParagraphBlock('• Engineered zero-downtime database migration strategy across 5 geo-distributed regions.'),
        createParagraphBlock('• Reduced p99 latency from 450ms to 42ms through intelligent distributed caching algorithms.'),

        createHeadingBlock('Education & Certifications', 2),
        createParagraphBlock('Master of Science in Computer Science — Stanford University (2014 – 2016)'),
        createParagraphBlock('AWS Certified Solutions Architect – Professional (SAP-C02) • CKA Certified Kubernetes Administrator')
      ];
      return doc;
    }
  },
  {
    id: 'business_report',
    name: 'Executive Business Report',
    category: 'Business',
    description: 'Comprehensive business report with executive summary, tables, charts, and strategic milestones.',
    create: () => {
      const doc = createDefaultDocument('FY2025 Annual Strategic Performance Report');
      doc.theme = DOCUMENT_THEMES.office;
      doc.blocks = [
        createHeadingBlock('FY2025 Annual Strategic Performance Report', 1),
        createParagraphBlock('Prepared by: Enterprise Analytics & Strategy Directorate', { italic: true, fontColor: '#6b7280' }),
        createParagraphBlock('Date: November 2026 | Classification: Strictly Confidential', { fontSize: 10, fontColor: '#9ca3af', spacingAfter: 18 }),

        createHeadingBlock('1. Executive Summary', 2),
        createParagraphBlock('This comprehensive annual review synthesizes our enterprise growth vectors, operational KPIs, product roadmaps, and fiscal health over the preceding four operating quarters. Across all business units, organic customer acquisition expanded by 28.4% year-over-year, supported by technological modernization and disciplined capital allocation.'),

        createQuoteBlock('“Operational excellence is not an accidental outcome; it is the deliberate orchestration of resilient architecture, customer empathy, and rigorous continuous delivery.”', 'Chief Operating Officer'),

        createHeadingBlock('2. Key Performance Indicators', 2),
        createTableBlock(4, 4, {
          rows: [
            {
              id: 'r_header',
              isHeader: true,
              cells: [
                { id: 'c1', colSpan: 1, backgroundColor: '#185abd', content: [createParagraphBlock('Metric Focus', { bold: true, fontColor: '#ffffff' })] },
                { id: 'c2', colSpan: 1, backgroundColor: '#185abd', content: [createParagraphBlock('Q3 Actual', { bold: true, fontColor: '#ffffff' })] },
                { id: 'c3', colSpan: 1, backgroundColor: '#185abd', content: [createParagraphBlock('Q4 Target', { bold: true, fontColor: '#ffffff' })] },
                { id: 'c4', colSpan: 1, backgroundColor: '#185abd', content: [createParagraphBlock('Variance (%)', { bold: true, fontColor: '#ffffff' })] }
              ]
            },
            {
              id: 'r_1',
              cells: [
                { id: 'c11', colSpan: 1, content: [createParagraphBlock('Annual Recurring Revenue (ARR)')] },
                { id: 'c12', colSpan: 1, content: [createParagraphBlock('$42.5M')] },
                { id: 'c13', colSpan: 1, content: [createParagraphBlock('$46.0M')] },
                { id: 'c14', colSpan: 1, content: [createParagraphBlock('+8.2%')] }
              ]
            },
            {
              id: 'r_2',
              cells: [
                { id: 'c21', colSpan: 1, content: [createParagraphBlock('Net Promoter Score (NPS)')] },
                { id: 'c22', colSpan: 1, content: [createParagraphBlock('68')] },
                { id: 'c23', colSpan: 1, content: [createParagraphBlock('72')] },
                { id: 'c24', colSpan: 1, content: [createParagraphBlock('+5.8%')] }
              ]
            },
            {
              id: 'r_3',
              cells: [
                { id: 'c31', colSpan: 1, content: [createParagraphBlock('Platform Availability / SLA')] },
                { id: 'c32', colSpan: 1, content: [createParagraphBlock('99.98%')] },
                { id: 'c33', colSpan: 1, content: [createParagraphBlock('99.99%')] },
                { id: 'c34', colSpan: 1, content: [createParagraphBlock('+0.01%')] }
              ]
            }
          ]
        }),

        createHeadingBlock('3. Strategic Milestone Trajectory', 2),
        createDiagramBlock('process', [
          { id: 's1', title: 'Phase 1: Foundation', desc: 'Consolidate legacy databases and unify auth services.' },
          { id: 's2', title: 'Phase 2: Micro-Frontends', desc: 'Modularize UI components and transition to modern React.' },
          { id: 's3', title: 'Phase 3: AI Augmentation', desc: 'Deploy contextual LLM assistance and smart document analysis.' },
          { id: 's4', title: 'Phase 4: Global Scale', desc: 'Establish multi-region replication and automated disaster recovery.' }
        ]),

        createHeadingBlock('4. Quarterly Trajectory Metrics', 2),
        createChartBlock('bar', {
          title: 'Fiscal Year Performance vs Targets ($M)',
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [
            { name: 'Target', data: [22, 28, 35, 46], color: '#93c5fd' },
            { name: 'Achieved', data: [24, 30, 39, 48], color: '#185abd' }
          ]
        })
      ];
      return doc;
    }
  },
  {
    id: 'research_paper',
    name: 'Academic Research Paper',
    category: 'Academic',
    description: 'APA style research paper format with abstract, methodology, results, footnotes, and bibliography.',
    create: () => {
      const doc = createDefaultDocument('Architectural Determinism in Distributed Document Rendering');
      doc.theme = DOCUMENT_THEMES.academic;
      doc.citationStyle = 'APA';
      doc.citations = [
        { id: 'knuth1984', type: 'book', author: 'Knuth, D. E.', title: 'The TeXbook', year: '1984', publisher: 'Addison-Wesley' },
        { id: 'lamport1994', type: 'book', author: 'Lamport, L.', title: 'LaTeX: A Document Preparation System', year: '1994', publisher: 'Addison-Wesley' },
        { id: 'dean2008', type: 'article', author: 'Dean, J., & Ghemawat, S.', title: 'MapReduce: Simplified data processing on large clusters', year: '2008', publisher: 'Communications of the ACM' }
      ];
      doc.blocks = [
        createHeadingBlock('Architectural Determinism in Distributed Document Rendering Systems', 1, { align: 'center' }),
        createParagraphBlock('Julian S. Martinez, Ph.D. & Sarah Lin, M.Sc.', { bold: true }, { align: 'center', spacingAfter: 4 }),
        createParagraphBlock('Department of Computer Science, Institute of Advanced Technology', { italic: true }, { align: 'center', spacingAfter: 16 }),

        createHeadingBlock('Abstract', 2, { align: 'center' }),
        createParagraphBlock('Contemporary document authoring tools frequently encounter computational divergence between client-side continuous viewports and print-ready physical pagination boundaries. This paper introduces an algorithmic framework for deterministic multi-page layout synthesis that guarantees byte-for-byte visual equivalence across heterogeneous runtime environments. We evaluate our layout engine across 1,000 synthetic multi-section manuscripts spanning 500 pages, demonstrating sub-16ms incremental re-pagination latency.', {
          italic: true
        }, { indentLeft: 36, indentRight: 36, spacingAfter: 16 }),

        createHeadingBlock('1. Introduction', 2),
        createParagraphBlock('The historical evolution of computerized typesetting began with macro-driven compilers such as TeX (Knuth, 1984). While batch typesetting systems achieved unmatched mathematical precision, interactive graphical word processors introduced WYSIWYG compromises that often detached abstract content models from physical pagination constraints.'),

        createHeadingBlock('2. Methodology & Mathematical Formulation', 2),
        createParagraphBlock('Let D be an ordered sequence of semantic document blocks {b1, b2, ..., bn}. For each block bk, let H(bk, W) represent its vertical spatial requirement on a canvas of usable width W. The objective of the pagination partition function P is to map blocks to a sequence of pages {P1, P2, ..., Pm} such that for every page Pj:'),
        createParagraphBlock('∑ H(bk, W) ≤ H_max - (H_header + H_footer)', {
          fontFamily: 'Courier New, monospace',
          fontSize: 10.5
        }, { align: 'center', spacingBefore: 6, spacingAfter: 6 }),

        createHeadingBlock('3. Experimental Results', 2),
        createTableBlock(3, 3, {
          rows: [
            {
              id: 'res_hdr',
              isHeader: true,
              cells: [
                { id: 'ch1', colSpan: 1, backgroundColor: '#1e7145', content: [createParagraphBlock('Document Scale', { bold: true, fontColor: '#ffffff' })] },
                { id: 'ch2', colSpan: 1, backgroundColor: '#1e7145', content: [createParagraphBlock('Initial Pagination (ms)', { bold: true, fontColor: '#ffffff' })] },
                { id: 'ch3', colSpan: 1, backgroundColor: '#1e7145', content: [createParagraphBlock('Incremental Update (ms)', { bold: true, fontColor: '#ffffff' })] }
              ]
            },
            {
              id: 'res_1',
              cells: [
                { id: 'c101', colSpan: 1, content: [createParagraphBlock('10 Pages (Short Paper)')] },
                { id: 'c102', colSpan: 1, content: [createParagraphBlock('4.2 ms')] },
                { id: 'c103', colSpan: 1, content: [createParagraphBlock('0.8 ms')] }
              ]
            },
            {
              id: 'res_2',
              cells: [
                { id: 'c201', colSpan: 1, content: [createParagraphBlock('100 Pages (Monograph)')] },
                { id: 'c202', colSpan: 1, content: [createParagraphBlock('28.5 ms')] },
                { id: 'c203', colSpan: 1, content: [createParagraphBlock('2.1 ms')] }
              ]
            }
          ]
        }),

        createHeadingBlock('References', 2),
        createParagraphBlock('• Dean, J., & Ghemawat, S. (2008). MapReduce: Simplified data processing on large clusters. Communications of the ACM, 51(1), 107-113.'),
        createParagraphBlock('• Knuth, D. E. (1984). The TeXbook. Addison-Wesley.'),
        createParagraphBlock('• Lamport, L. (1994). LaTeX: A Document Preparation System. Addison-Wesley.')
      ];
      return doc;
    }
  },
  {
    id: 'cover_letter',
    name: 'Official Cover Letter',
    category: 'Business',
    description: 'Clean, formal business correspondence format with recipient address block and sign-off.',
    create: () => {
      const doc = createDefaultDocument('Cover Letter - Senior Staff Engineer');
      doc.blocks = [
        createParagraphBlock('Eleanor Vance', { bold: true, fontSize: 13 }),
        createParagraphBlock('123 Innovation Boulevard\nSan Francisco, CA 94105\n(555) 234-5678 | eleanor@example.com', {
          fontColor: '#4b5563',
          fontSize: 10
        }, { spacingAfter: 14 }),

        createParagraphBlock('November 12, 2026', { fontColor: '#374151' }, { spacingAfter: 14 }),

        createParagraphBlock('Hiring Committee & Engineering Leadership\nAnthropic Research Labs\n500 Howard Street, Suite 400\nSan Francisco, CA 94105', {
          fontSize: 10.5
        }, { spacingAfter: 16 }),

        createParagraphBlock('Dear Members of the Selection Committee,', { bold: true }, { spacingAfter: 10 }),

        createParagraphBlock('I am writing to express my enthusiastic interest in the Principal Systems Architect role at your research organization. With over a decade of hands-on experience designing reliable distributed systems, resilient state synchronization engines, and low-latency client runtimes, I have dedicated my career to building computing infrastructure that is both mathematically sound and delightful to use.'),

        createParagraphBlock('Throughout my tenure as Solutions Architect at Vanguard Technologies, I directed the implementation of a real-time collaborative document engine capable of sub-frame operational transformations across hundreds of concurrent participants. By designing optimized memory structures and virtualized rendering passes, our team achieved instantaneous page updates without dropping animation frames on everyday commodity hardware.'),

        createParagraphBlock('Your team\'s dedication to robust, transparent, and user-empowering software mirrors my own technical philosophy. I would welcome the opportunity to discuss how my systems engineering background and passion for foundational productivity tools can contribute to your continued breakthroughs.'),

        createParagraphBlock('Thank you for your time, consideration, and thoughtful review.', {}, { spacingAfter: 18 }),

        createParagraphBlock('Sincerely,\n\nEleanor Vance', { bold: true })
      ];
      return doc;
    }
  },
  {
    id: 'invoice',
    name: 'Professional Invoice',
    category: 'Finance',
    description: 'Billing document with itemized services, tax calculation, and payment terms.',
    create: () => {
      const doc = createDefaultDocument('Invoice #INV-2026-089');
      doc.blocks = [
        createHeadingBlock('INVOICE', 1, { align: 'right', spacingAfter: 4 }),
        createParagraphBlock('Invoice Number: INV-2026-089\nInvoice Date: Nov 12, 2026\nPayment Due: Dec 12, 2026', {
          fontColor: '#6b7280',
          fontSize: 10
        }, { align: 'right', spacingAfter: 20 }),

        createTableBlock(2, 2, {
          borders: false,
          rows: [
            {
              id: 'inv_addr_hdr',
              cells: [
                { id: 'c_from', colSpan: 1, content: [createParagraphBlock('Billed From:\nDragDocs Engineering Services LLC\n100 Tech Way, Suite 800\nSan Francisco, CA 94105', { fontSize: 10 })] },
                { id: 'c_to', colSpan: 1, content: [createParagraphBlock('Billed To:\nAcme Enterprise Solutions\n742 Evergreen Terrace\nSpringfield, OR 97477', { fontSize: 10 })] }
              ]
            }
          ]
        }),

        createHeadingBlock('Itemized Deliverables', 2, { spacingBefore: 16 }),
        createTableBlock(4, 4, {
          rows: [
            {
              id: 'inv_row_hdr',
              isHeader: true,
              cells: [
                { id: 'ih1', colSpan: 1, backgroundColor: '#185abd', content: [createParagraphBlock('Description', { bold: true, fontColor: '#ffffff' })] },
                { id: 'ih2', colSpan: 1, backgroundColor: '#185abd', content: [createParagraphBlock('Hours', { bold: true, fontColor: '#ffffff' })] },
                { id: 'ih3', colSpan: 1, backgroundColor: '#185abd', content: [createParagraphBlock('Hourly Rate', { bold: true, fontColor: '#ffffff' })] },
                { id: 'ih4', colSpan: 1, backgroundColor: '#185abd', content: [createParagraphBlock('Total Amount', { bold: true, fontColor: '#ffffff' })] }
              ]
            },
            {
              id: 'inv_row_1',
              cells: [
                { id: 'i11', colSpan: 1, content: [createParagraphBlock('Distributed Document Engine Architecture')] },
                { id: 'i12', colSpan: 1, content: [createParagraphBlock('40')] },
                { id: 'i13', colSpan: 1, content: [createParagraphBlock('$225.00')] },
                { id: 'i14', colSpan: 1, content: [createParagraphBlock('$9,000.00')] }
              ]
            },
            {
              id: 'inv_row_2',
              cells: [
                { id: 'i21', colSpan: 1, content: [createParagraphBlock('Dynamic Multi-Page Pagination Implementation')] },
                { id: 'i22', colSpan: 1, content: [createParagraphBlock('35')] },
                { id: 'i23', colSpan: 1, content: [createParagraphBlock('$225.00')] },
                { id: 'i24', colSpan: 1, content: [createParagraphBlock('$7,875.00')] }
              ]
            },
            {
              id: 'inv_row_3',
              cells: [
                { id: 'i31', colSpan: 1, content: [createParagraphBlock('Total Balance Due (USD)', { bold: true })] },
                { id: 'i32', colSpan: 1, content: [createParagraphBlock('-')] },
                { id: 'i33', colSpan: 1, content: [createParagraphBlock('-')] },
                { id: 'i34', colSpan: 1, content: [createParagraphBlock('$16,875.00', { bold: true, fontColor: '#185abd' })] }
              ]
            }
          ]
        }),

        createParagraphBlock('Payment Instructions:\nPlease remit wire transfers to First National Silicon Bank, Routing #121000358, Account #894200194. Thank you for your business!', {
          italic: true,
          fontSize: 9.5,
          fontColor: '#4b5563'
        }, { spacingBefore: 18 })
      ];
      return doc;
    }
  }
];

