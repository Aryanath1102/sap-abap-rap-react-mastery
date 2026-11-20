export const ROADMAP_14_DAYS = [
  {
    day: 1,
    title: 'Modern ABAP Fundamentals & Constructor Expressions',
    priority: 'Essential',
    lessonId: 'day-1-modern-abap',
    duration: '2.5 Hours',
    focus: 'Inline DATA/FINAL, VALUE, COND, SWITCH, REDUCE, FILTER, FOR, String Templates, Modern Open SQL',
    topics: [
      'Immutable inline declarations with FINAL(var) and DATA(var)',
      'Constructing complex deep tables with VALUE #() and FOR',
      'Declarative data transformation with REDUCE and COND',
      'Modern Open SQL: comma-separated fields, @ host variables, and inline INTO TABLE @DATA(lt)'
    ]
  },
  {
    day: 2,
    title: 'Object-Oriented ABAP, Exceptions & ABAP Unit',
    priority: 'Essential',
    lessonId: 'day-2-oop-abap',
    duration: '3.0 Hours',
    focus: 'Clean Code OO, Interfaces, Factory Methods, CX_STATIC_CHECK, and Automated Unit Testing with Test Doubles',
    topics: [
      'Pure OO in ABAP Cloud: IF_OO_ADT_CLASSRUN console runner',
      'Factory patterns and Interface abstraction for dependency injection',
      'Class-based exceptions with MESSAGE interface and clean error bubbling',
      'Writing automated ABAP Unit tests with FOR TESTING and cl_abap_unit_assert'
    ]
  },
  {
    day: 3,
    title: 'CDS View Entities & Virtual Data Model (VDM)',
    priority: 'Essential',
    lessonId: 'day-3-cds-entities',
    duration: '3.0 Hours',
    focus: 'DEFINE VIEW ENTITY, Basic/Composite/Consumption Views, Associations vs Compositions, DCL Authorization',
    topics: [
      'Migrating from legacy DEFINE VIEW (DDIC) to DEFINE ROOT VIEW ENTITY (7.55+)',
      'On-demand lazy joins with Associations [0..1] and [0..*]',
      'Strict parent-child composition trees for Business Objects',
      'Data Control Language (DCL) role-based authorization rules with Access Control'
    ]
  },
  {
    day: 4,
    title: 'SAP RAP Architecture: Managed Business Objects',
    priority: 'Essential',
    lessonId: 'day-4-rap-managed',
    duration: '3.5 Hours',
    focus: 'RAP BO Trees, Managed vs Unmanaged, Lock Master, Numbering: Managed UUID, and Transactional Lifecycle',
    topics: [
      'RAP Business Object composition tree: Root and Child entities',
      'Managed implementation runtime: automatic CRUD, locking, and persistence',
      'Draft vs Non-Draft transactional phases (Interaction vs Save)',
      'Managed UUID numbering vs semantic numbering with number ranges'
    ]
  },
  {
    day: 5,
    title: 'RAP Behavior Definitions (strict 2), Validations & Determinations',
    priority: 'Essential',
    lessonId: 'day-5-bdef-validations',
    duration: '3.5 Hours',
    focus: 'BDEF strict ( 2 ), validate on save, determine on modify/save, FAILED and REPORTED message handling',
    topics: [
      'BDEF strict ( 2 ) mandatory rules for ABAP Cloud certification',
      'Validations on save: ensuring business integrity and throwing localized messages',
      'Determinations on modify and save: auto-populating derived fields and timestamps',
      'Populating %tky, failed-entity, and reported-entity with /DMO/CM_FLIGHT or custom message classes'
    ]
  },
  {
    day: 6,
    title: 'RAP Actions, Dynamic Feature Control & Authorization',
    priority: 'Very High',
    lessonId: 'day-6-actions-auth',
    duration: '3.0 Hours',
    focus: 'Instance/Static bound actions, Dynamic Feature Control (enabling/disabling buttons), Authorization master',
    topics: [
      'Declaring and implementing bound custom actions (e.g. approve, reject, calculateDiscount)',
      'Instance Feature Control: dynamically disabling edit/delete/action based on record status',
      'Master and Dependent authorization methods: authorization master ( instance / global )',
      'Testing custom actions via ADT EML console scripts'
    ]
  },
  {
    day: 7,
    title: 'RAP Draft Handling & Concurrency Control',
    priority: 'Very High',
    lessonId: 'day-7-draft-handling',
    duration: '3.0 Hours',
    focus: 'Draft table generation, with draft, %is_draft flag, PREPARE phase, Optimistic Locking & ETags',
    topics: [
      'Why Draft is essential for modern web applications (Google Docs style auto-save)',
      'Declaring `with draft;` and generating draft persistence tables (`_D`)',
      'The Draft lifecycle: Edit -> Draft Save -> Validate (PREPARE) -> Activate to Active table',
      'Concurrency control with total etag (LocallyLastChangedAt) and ETag headers'
    ]
  },
  {
    day: 8,
    title: 'Service Definition, Service Binding & OData V4 Exposure',
    priority: 'Essential',
    lessonId: 'day-8-odata-v4',
    duration: '3.0 Hours',
    focus: 'Service Definition (EXPOSE), Service Binding (OData V4 - Web API / UI), $metadata, and OData V4 semantics',
    topics: [
      'Defining clean API exposure with `define service ZAPI_*`',
      'Binding types: OData V4 - Web API (for React/external) vs OData V4 - UI (for Fiori Elements)',
      'Publishing local services and inspecting the OData V4 JSON $metadata document',
      'OData V4 HTTP semantics: GET, POST (Deep Create), PATCH (Delta updates), DELETE, and Actions'
    ]
  },
  {
    day: 9,
    title: 'React + RAP OData V4 Service Architecture',
    priority: 'Very High',
    lessonId: 'day-9-react-service',
    duration: '3.5 Hours',
    focus: 'Modular React fetch() service, X-CSRF-Token handshake, $filter, $top/$skip pagination, and data.value',
    topics: [
      'Architecting a robust, production-grade SAP API service layer in React',
      'The mandatory X-CSRF-Token handshake: fetching tokens via HEAD/GET with credentials: include',
      'Querying SAP RAP: reading arrays from data.value and total count from data["@odata.count"]',
      'Building responsive React data tables with server-side $filter, $orderby, and $skip pagination'
    ]
  },
  {
    day: 10,
    title: 'React CRUD Forms, Delta PATCH & SAP Error Handling',
    priority: 'Very High',
    lessonId: 'day-10-react-forms-errors',
    duration: '3.5 Hours',
    focus: 'Controlled React forms, HTTP PATCH with If-Match ETag, POST create, and parsing RAP error.details',
    topics: [
      'Submitting new records via POST with X-CSRF-Token and Content-Type: application/json',
      'Executing surgical delta updates via PATCH sending only modified fields and If-Match: *',
      'Deep parsing SAP RAP error payloads: extracting error.code, error.message, and error.details',
      'Translating SAP backend validation failures into inline React form field errors and toast alerts'
    ]
  },
  {
    day: 11,
    title: 'EML (Entity Manipulation Language) Deep Dive',
    priority: 'Very High',
    lessonId: 'day-11-eml-deep-dive',
    duration: '3.0 Hours',
    focus: 'READ ENTITIES, MODIFY ENTITIES with %cid, %control, COMMIT ENTITIES, IN LOCAL MODE',
    topics: [
      'EML as the native programmatic interface to RAP Business Objects',
      'MODIFY ENTITIES: CREATE, UPDATE, DELETE, and EXECUTE custom actions',
      'Correlating transient input with %cid (Content ID) and receiving %tky in MAPPED',
      'Using IN LOCAL MODE to safely bypass external authorization inside behavior pools'
    ]
  },
  {
    day: 12,
    title: 'Advanced RAP: Side Effects, Virtual Elements & Unmanaged Save',
    priority: 'Very High',
    lessonId: 'day-12-side-effects-virtual',
    duration: '3.5 Hours',
    focus: 'Side Effects annotations, Virtual Elements with SADL exit classes, and Unmanaged Save in Managed BOs',
    topics: [
      'Configuring Side Effects so changing one field automatically refreshes calculated fields in React UI',
      'Declaring Virtual Elements in CDS with `@ObjectModel.virtualElementCalculatedBy`',
      'Implementing SADL exit classes (`IF_SADL_EXIT_CALC_ELEMENT_READ`) for on-the-fly calculations',
      'Extending Managed RAP with `with additional save` or `unmanaged save` to update legacy secondary tables'
    ]
  },
  {
    day: 13,
    title: 'Clean Core, ABAP Cloud & ATC Quality Governance',
    priority: 'Very High',
    lessonId: 'day-13-clean-core-atc',
    duration: '3.0 Hours',
    focus: 'ABAP Language Version 5 (Cloud), Level A Released APIs (C1 contract), ATC Clean Core checks, Zero Modifications',
    topics: [
      'The 3 Pillars of Clean Core: Upgrade Stability, Cloud Readiness, and Modular Separation',
      'ABAP Cloud restrictions: no direct reads of standard tables (BUT000, MARA, VBAK) -> use I_* VDM views',
      'Contract C1 (Release for System Internal Use) and Contract C2 (Remote API Release)',
      'Configuring and running the ABAP Test Cockpit (ATC) with Clean Core and Cloud check variants'
    ]
  },
  {
    day: 14,
    title: 'Full-Stack Capstone, Architecture Review & Technical Interview',
    priority: 'Very High',
    lessonId: 'day-14-capstone-interview',
    duration: '4.0 Hours',
    focus: 'End-to-End Enterprise Architecture, Production Deployment Checklist, and Lead Architect Interview Mastery',
    topics: [
      'Full-Stack Architecture recap: React SPA -> SAP Gateway OData V4 -> RAP BO -> HANA DB',
      'Production deployment checklist: Cloud Connector, Destination service in BTP, CSRF protection, and CORS',
      'Architect Interview scenario 1: Designing high-concurrency RAP applications with optimistic locking',
      'Architect Interview scenario 2: Modernizing a 15-year-old classic ABAP system into S/4HANA Clean Core'
    ]
  }
];
