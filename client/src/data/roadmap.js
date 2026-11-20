/**
 * Master SAP RAP Curriculum Roadmap: 9 Core Modules (Module 0 to Module 8)
 * Designed for developers with Java, Spring Boot, Node.js, and React backgrounds.
 * Features 2-Minute Interviewer Challenges and Practical SAP GUI & Eclipse ADT checkpoints.
 */

export const ROADMAP_14_DAYS = [
  {
    day: 0,
    moduleNumber: 0,
    title: 'Module 0 – Prerequisites: SAP Ecosystem & ABAP Foundations',
    priority: 'Foundation',
    lessonId: 'day-0-abap-prerequisites',
    duration: '4.0 Hours',
    focus: 'Ecosystem, ABAP Cloud, ADT, Data Types, Internal Tables, Field Symbols, Control Flow, Open SQL, and OOP',
    subLessons: [
      { id: '0.1', title: 'What is SAP, ERP and S/4HANA?' },
      { id: '0.2', title: 'SAP BTP, ABAP Cloud and Eclipse ADT' },
      { id: '0.3', title: 'ABAP Program Structure' },
      { id: '0.4', title: 'Data Types and Variables (DATA, FINAL)' },
      { id: '0.5', title: 'Constants, Structures (TYPES) and Internal Tables' },
      { id: '0.6', title: 'Field Symbols (<fs>) and Data References' },
      { id: '0.7', title: 'Modern ABAP Syntax (Constructor expressions, Pipes |...|)' },
      { id: '0.8', title: 'Control Statements (IF, CASE) and Loops (LOOP AT)' },
      { id: '0.9', title: 'Modern Open SQL (SELECT, FIELDS, @host_var)' },
      { id: '0.10', title: 'Classes, Methods, Interfaces (~) and Exceptions' }
    ],
    topics: [
      'SAP S/4HANA vs SAP BTP architecture',
      'Clean Core and Released APIs: Why traditional modifications are dead',
      'Eclipse ADT setup and connection to SAP S/4HANA',
      'Comparing ABAP OOP with Java Spring Boot and TypeScript'
    ],
    interviewerChallenge: {
      question: "Explain the difference between S/4HANA and SAP BTP, and why ABAP Cloud strictly enforces Released APIs over classic direct table reads.",
      keyPoints: [
        "S/4HANA is the core ERP system running transactional business data.",
        "SAP BTP is the cloud platform for side-by-side extensions without polluting the core.",
        "ABAP Cloud enforces Clean Core via Tier 1 released APIs (e.g. I_BusinessPartner) so ERP upgrades never break custom code."
      ]
    }
  },
  {
    day: 1,
    moduleNumber: 1,
    title: 'Module 1 – Data Modeling: Tables, CDS Entities & Virtual Data Model',
    priority: 'Essential',
    lessonId: 'day-3-cds-entities',
    duration: '3.5 Hours',
    focus: 'Database Tables, DEFINE VIEW ENTITY, Compositions [0..*], Associations, and Virtual Data Model (VDM)',
    topics: [
      'Creating database tables with modern DDIC / ABAP CDS in ADT',
      'Core Data Services (CDS) View Entities: DEFINE ROOT VIEW ENTITY',
      'On-demand lazy joins with Associations vs strict parent-child Compositions',
      'Clean Core VDM layering: Interface Views (ZI_) vs Consumption Projections (ZC_)'
    ],
    interviewerChallenge: {
      question: "What is the architectural difference between an Association and a Composition in CDS View Entities, and when should you use each?",
      keyPoints: [
        "Association: A lazy-join relationship (e.g. Travel to Agency). Target exists independently.",
        "Composition: A strict lifecycle dependency (e.g. Travel to Booking). Deleting the root deletes the child."
      ]
    }
  },
  {
    day: 2,
    moduleNumber: 2,
    title: 'Module 2 – RAP Fundamentals: Architecture & Comparison with CAP / Spring Boot',
    priority: 'Essential',
    lessonId: 'day-4-rap-managed',
    duration: '3.0 Hours',
    focus: 'RAP Business Object Trees, Managed vs Unmanaged, Interaction Phase vs Save Phase, and CAP comparison',
    topics: [
      'The 3 Pillars of RAP: Data Modeling (CDS), Behavior (BDEF), and Service Exposure (SRVD)',
      'Comparing SAP RAP with SAP CAP (Node.js/Java) and Spring Boot JPA',
      'Managed Implementation: automatic transactional orchestration, buffer, and locking',
      'Understanding the RAP Runtime Phases: Interaction Phase vs Save Sequence'
    ],
    interviewerChallenge: {
      question: "Compare SAP RAP with Spring Boot or SAP CAP. How does RAP manage transactional state without manual Hibernate commit calls?",
      keyPoints: [
        "RAP uses an automated transactional buffer and save sequence (FINALIZE -> CHECK_BEFORE_SAVE -> SAVE).",
        "Managed BOs handle CRUD, draft state, and optimistic locking natively in memory."
      ]
    }
  },
  {
    day: 3,
    moduleNumber: 3,
    title: 'Module 3 – Behavior Definition & Implementation: CRUD, Validations & Actions',
    priority: 'Essential',
    lessonId: 'day-5-bdef-validations',
    duration: '4.0 Hours',
    focus: 'BDEF strict ( 2 ), Behavior Pools (lhc_), Validations on Save, Determinations, Custom Actions, and %tky',
    topics: [
      'BDEF strict ( 2 ) compiler enforcement for Cloud Certification',
      'Local Handler Classes (lhc_root) inside Behavior Pools',
      'Validations on save: reporting business errors without aborting transactions',
      'Determinations on modify/save: automated derivation of calculated attributes',
      'Instance-bound custom actions (e.g. approveOrder, rejectOrder) and Dynamic Feature Control'
    ],
    interviewerChallenge: {
      question: "Why do RAP validations append errors to reported-entity instead of throwing CX exceptions, and what does %tky represent?",
      keyPoints: [
        "RAP avoids hard crashes; errors in reported are translated into standard OData 400 JSON payloads for Fiori.",
        "%tky is the Transactional Key: it transparently unifies Active database keys and ephemeral Draft keys."
      ]
    }
  },
  {
    day: 4,
    moduleNumber: 4,
    title: 'Module 4 – Projection & UI Layer: Metadata Extensions & Fiori Elements',
    priority: 'Essential',
    lessonId: 'day-8-metadata-ui',
    duration: '3.5 Hours',
    focus: 'Consumption Views (ZC_), Behavior Projections, Metadata Extensions (.mde), and Core @UI Annotations',
    topics: [
      'Creating the Public Projection Facade: DEFINE ROOT VIEW ENTITY as projection on ZI_',
      'Behavior Projections: use etag, use draft, and exposing actions to the UI',
      'Metadata Extensions (MDE): layering annotations with @Metadata.layer: #CUSTOMER',
      'Configuring List Report and Object Page floorplans with @UI.headerInfo, @UI.lineItem, and @UI.facet'
    ],
    interviewerChallenge: {
      question: "Why should @UI annotations never be placed in the core Interface View (ZI_), and how do Metadata Extensions preserve Clean Core?",
      keyPoints: [
        "ZI_ defines pure enterprise data logic and should remain UI-agnostic.",
        "MDE files (.asddls) isolate presentation tokens, allowing customer layers (#CUSTOMER) without modifying core code."
      ]
    }
  },
  {
    day: 5,
    moduleNumber: 5,
    title: 'Module 5 – Service Layer: Service Definitions, Bindings & OData Testing',
    priority: 'Essential',
    lessonId: 'day-9-service-exposure',
    duration: '3.0 Hours',
    focus: 'Service Definition (SRVD), Service Binding (OData V4 Web API vs UI), and Postman Testing',
    topics: [
      'Authoring Service Definitions: exposing ZC_ consumption entities and child associations',
      'Service Bindings: OData V4 - UI (for Fiori Elements) vs OData V4 - Web API (for React/External)',
      'Publishing local bindings in ADT and launching the Fiori Elements Preview',
      'Testing OData V4 payloads, $metadata, $filter, and $batch in Postman'
    ],
    interviewerChallenge: {
      question: "What is the difference between an OData V4 - UI binding and an OData V4 - Web API binding in SAP RAP?",
      keyPoints: [
        "UI binding: Enforces user-facing metadata, draft orchestrations, and SAP Fiori UI vocabularies.",
        "Web API binding: Optimized for headless system-to-system integrations without UI metadata bloat."
      ]
    }
  },
  {
    day: 6,
    moduleNumber: 6,
    title: 'Module 6 – Advanced RAP: EML, Draft Handling, Side Effects & Custom Entities',
    priority: 'Advanced',
    lessonId: 'day-7-draft-handling',
    duration: '4.0 Hours',
    focus: 'Entity Manipulation Language (EML), with draft, PREPARE phase, Side Effects, and Custom Query Providers',
    topics: [
      'Entity Manipulation Language (EML): READ ENTITIES, MODIFY ENTITIES in local mode',
      'Draft Handling: Active Table vs Draft Table (_D), draft activate, and optimistic locking',
      'Side Effects annotations: auto-refreshing dependent fields on value change',
      'Custom Entities & Query Providers implementing if_rap_query_provider for external APIs'
    ],
    interviewerChallenge: {
      question: "Explain what happens behind the scenes during the RAP Draft Prepare phase when a user clicks 'Save' in a Fiori app.",
      keyPoints: [
        "The runtime triggers the PREPARE action, running all determinations and validations against the draft buffer.",
        "If reported errors exist, save halts; otherwise, draft data is copied into the active table and draft rows are deleted."
      ]
    }
  },
  {
    day: 7,
    moduleNumber: 7,
    title: 'Module 7 – Testing & Quality: ABAP Unit, Test Doubles, Debugging & Clean ABAP',
    priority: 'High Quality',
    lessonId: 'day-2-oop-abap',
    duration: '3.5 Hours',
    focus: 'ABAP Unit (FOR TESTING), cl_abap_unit_assert, Test Double Framework, ADT Debugging, and ATC Checks',
    topics: [
      'Writing automated ABAP Unit tests inside local test classes (ltcl_)',
      'Mocking database dependencies using the SQL Test Double Framework (cl_osql_test_environment)',
      'Interactive debugging in Eclipse ADT: breakpoints, watchpoints, and EML inspection',
      'ABAP Test Cockpit (ATC) static analysis and Clean Core compliance rules'
    ],
    interviewerChallenge: {
      question: "How do you isolate a RAP Business Object from the real database during unit testing in Eclipse ADT?",
      keyPoints: [
        "Use the SQL Test Double Framework (cl_osql_test_environment) to inject mock data into temporary test memory.",
        "Assert transactional outcomes using cl_abap_unit_assert without committing to the real SAP HANA DB."
      ]
    }
  },
  {
    day: 8,
    moduleNumber: 8,
    title: 'Module 8 – Real-World Capstone: End-to-End Enterprise RAP Application',
    priority: 'Master Capstone',
    lessonId: 'day-14-capstone-architecture',
    duration: '5.0 Hours',
    focus: 'Full Enterprise Implementation: Permit-to-Work or Leave Management System with Fiori & React UI',
    topics: [
      'Designing domain model: Header, Items, Approvers, and Attachment tables',
      'Implementing Managed RAP BO with Draft, Numbering: Managed UUID, and strict ( 2 )',
      'Custom Determinations for total calculation and Validations for date & risk ranges',
      'Actions: ApprovePermit, RevokePermit with dynamic button feature control',
      'Exposing OData V4 service and connecting a custom responsive React / SAPUI5 frontend'
    ],
    interviewerChallenge: {
      question: "Walk an interviewer through the architecture of your Capstone RAP application from the database table up to the React/Fiori frontend.",
      keyPoints: [
        "Database Layer: Transparent tables with draft tables.",
        "CDS Layer: ZI_ Interface root and child entities with compositions.",
        "Behavior Layer: BDEF with validations, determinations, actions, and authorization master.",
        "Consumption Layer: ZC_ projections with MDE annotations.",
        "Service Layer: SRVD + OData V4 Binding consumed by React/Fiori."
      ]
    }
  }
];

export default ROADMAP_14_DAYS;
