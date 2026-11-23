/**
 * Enterprise Full-Stack Project Blueprints & System Design Specifications
 * Contains functional requirements, business rules, performance SLAs, and
 * visual system design architectures for all 18 enterprise projects.
 */

export const PROJECT_BLUEPRINTS = {
  // =========================================================================
  // BEGINNER PROJECTS (p1 - p5)
  // =========================================================================
  p1: {
    requirements: {
      userStory: 'As an HR Operations Specialist, I need to create, update, and manage employee master records with automatic UUID assignment and instant salary sanity checks so that payroll discrepancies are eliminated at data entry.',
      businessRules: [
        'Employee ID must follow corporate format EMP-XXXXXX (10 characters max).',
        'Salary must be strictly greater than 0; salaries exceeding 250,000 require executive flag check.',
        'Email address must be well-formed and unique across all active employee records.',
        'System automatically sets CreatedAt and LastChangedAt using S/4HANA system timestamps.',
        'Employee record deletions must be rejected if the employee has active payroll records.'
      ],
      inputOutput: 'Input: JSON payload via OData V4 POST/PATCH (firstName, lastName, email, salary, currencyCode). Output: HTTP 201 Created with generated EmployeeUUID and server-validated status.'
    },
    performance: {
      targetSla: '< 85ms p95 response time for OData V4 single-entity operations',
      indexStrategy: 'Primary Key: (client, emp_uuid). Secondary Index ZEMP_IDX1 on (client, email) for unique email enforcement.',
      concurrency: 'Optimistic locking via `etag master LastChangedAt`. HTTP ETag header matched on PATCH.',
      cleanCoreBenchmark: '100% ABAP Cloud (Language Version 5). Zero access to unreleased PA0001 or PA0002 tables.'
    },
    systemDesign: null // Beginner project uses standard RAP single-entity pattern
  },

  p2: {
    requirements: {
      userStory: 'As an Enterprise Organization Architect, I need to maintain corporate department hierarchies, assign cost centers with CDS Value Help, and prevent accidental deletion of populated departments.',
      businessRules: [
        'Cost Center ID must validate against standard released CDS View Entity `I_CostCenter`.',
        'Cascading delete protection: Deletion must be blocked if any active employees are assigned.',
        'Budget allocated to a department cannot be negative.',
        'Department code must be unique per SAP Client.'
      ],
      inputOutput: 'Input: Department entity payload with CostCenter and DepartmentHead. Output: Validated department instance with dynamic feature control.'
    },
    performance: {
      targetSla: '< 95ms p95 response time for hierarchical CDS value help queries',
      indexStrategy: 'Primary Key: (client, dept_uuid). Secondary Index on (client, cost_center).',
      concurrency: 'ETag master on LastChangedAt with instance-based feature control.',
      cleanCoreBenchmark: 'Cost center verified against released `I_CostCenter` CDS View Entity.'
    },
    systemDesign: null
  },

  p3: {
    requirements: {
      userStory: 'As an E-Commerce Merchandiser, I need an ultra-fast product catalog API with server-side $filter, $orderby, multi-currency conversions, and category indexing so customer web storefronts render under 100ms.',
      businessRules: [
        'Prices must support on-the-fly currency conversion using standard SAP exchange rate tables.',
        'Discontinued products cannot be ordered; status must be set to `DISCONTINUED`.',
        'SKU code must be alphanumeric and strictly unique.'
      ],
      inputOutput: 'Input: OData V4 query with `$filter=Category eq \'HARDWARE\' and Price lt 500&$orderby=Price asc`. Output: Paginated JSON collection.'
    },
    performance: {
      targetSla: '< 65ms p95 response time for paginated catalog reads (50 items/page)',
      indexStrategy: 'Covering index on (client, category, price, currency_code) for index-only scans.',
      concurrency: 'Read-only transactional projection with caching header `Cache-Control: max-age=300`.',
      cleanCoreBenchmark: 'Queries released view `I_Product` and `I_ProductText`.'
    },
    systemDesign: null
  },

  p4: {
    requirements: {
      userStory: 'As a B2B Sales Representative, I need to search and view business partner accounts using only official SAP S/4HANA released APIs so our custom React CRM maintains 100% Clean Core upgradability.',
      businessRules: [
        'Direct SELECT on classic table `BUT000` is strictly prohibited by ATC Clean Core checks.',
        'All reads must go through released CDS View Entity `I_BusinessPartner`.',
        'Customer tax number must be verified against country-specific checksum algorithms.'
      ],
      inputOutput: 'Input: Search term or BusinessPartner ID. Output: Customer profile with credit score and released address entities.'
    },
    performance: {
      targetSla: '< 90ms p95 response time for customer master lookup',
      indexStrategy: 'Relies on SAP HANA standard B2B indices on `I_BusinessPartner`.',
      concurrency: 'Instance authorization check `#CHECK` enforced in CDS projection.',
      cleanCoreBenchmark: '100% Clean Core Tier 1 extension. Zero ATC warnings in Cloud Readiness check.'
    },
    systemDesign: null
  },

  p5: {
    requirements: {
      userStory: 'As an Employee and Team Manager, I need to submit and approve paid time-off requests with date sanity validations and bound actions so leave balances update accurately without overlap.',
      businessRules: [
        'End Date must be greater than or equal to Start Date; single-day leave allowed.',
        'Overlapping leave requests for the same employee must trigger validation error on save.',
        'Action `approveLeave` and `rejectLeave` only accessible to users with manager role authorization.',
        'Once approved or rejected, a leave request becomes immutable (dynamic feature control).'
      ],
      inputOutput: 'Input: Leave request payload or Action trigger `approveLeave()`. Output: Updated status with audit trail timestamp.'
    },
    performance: {
      targetSla: '< 110ms p95 response time including EML balance determination',
      indexStrategy: 'Index on (client, emp_uuid, start_date, end_date) for fast collision detection.',
      concurrency: 'Lock master on employee leave header to prevent concurrent overlapping bookings.',
      cleanCoreBenchmark: 'ABAP Cloud compliant with T100 message classes.'
    },
    systemDesign: null
  },

  // =========================================================================
  // INTERMEDIATE PROJECTS (p6 - p10) - COMPLEX ARCHITECTURES
  // =========================================================================
  p6: {
    requirements: {
      userStory: 'As a Warehouse Logistics Controller, I need to execute real-time goods receipts, goods issues, and inter-plant transfers using EML with negative-stock prevention and multi-plant locking.',
      businessRules: [
        'Stock balance must never fall below zero under any concurrent goods issue scenario.',
        'Goods receipt must automatically recalculate moving average price and total valuation.',
        'Inter-plant transfer requires atomic two-legged transaction: deduct plant A, credit plant B.',
        'Storage location must belong to the specified plant; validated against SAP Plant-Storage master.'
      ],
      inputOutput: 'Input: Movement posting JSON { material, plant, storageLoc, movementType, quantity }. Output: Movement document ID with updated stock snapshot.'
    },
    performance: {
      targetSla: '< 130ms p95 execution time for multi-plant EML goods movement posting',
      indexStrategy: 'Composite clustered index on (client, plant, storage_loc, material_id) to eliminate table scans.',
      concurrency: 'Lock Master on `ZI_StockItem` with exclusive enqueue during EML modify execution.',
      cleanCoreBenchmark: 'Uses released `I_MaterialStock` and RAP Managed EML. Zero direct update on MARD/MBEW.'
    },
    systemDesign: {
      complexity: 'High (Multi-Legged EML Postings & Negative Stock Enqueue)',
      diagram: `
+-----------------------------------------------------------------------------------+
|                        REACT CLIENT (WAREHOUSE SCANNER SPA)                        |
|   - Real-time barcode scan -> Optimistic UI deduction -> Delta OData V4 POST      |
+-----------------------------------------------------------------------------------+
                                        | (HTTPS / OData V4 Batch)
                                        v
+-----------------------------------------------------------------------------------+
|                      SAP GATEWAY & SERVICE BINDING LAYER                          |
|   - Service: ZAPI_STOCK_O4 (Web API Tier 1) | CSRF Token & ETag Header Handshake   |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                      RAP BEHAVIOR DEFINITION (BDEF) LAYER                         |
|   - strict ( 2 ); | lock master | etag master LastChangedAt                       |
|   - validation validateQuantity on save { field Quantity; create; update; }      |
|   - action postGoodsMovement parameter ZD_MovementParam result [1] $self;         |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                    BEHAVIOR IMPLEMENTATION POOL (ZBP_I_STOCK)                     |
|   [Phase 1: Interaction Phase]                                                    |
|     - validateQuantity: Reads stock in LOCAL MODE with EML                        |
|     - Rejects posting if (current_stock - issue_qty) < 0                          |
|   [Phase 2: Save Sequence (Early & Late Save)]                                    |
|     - Enqueue lock on (Material + Plant + SLoc)                                   |
|     - Computes moving average price valuation via EML                             |
|     - Appends mapped instance keys & commits transparently                        |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                      CDS VIRTUALIZATION & PERSISTENCE LAYER                       |
|   - ZC_StockItem (Projection) -> ZI_StockItem (Interface View) -> zstock_db      |
+-----------------------------------------------------------------------------------+
      `
    }
  },

  p7: {
    requirements: {
      userStory: 'As a Sales Executive, I need to create multi-item Sales Orders with real-time customer credit checks, line item price extensions, and one-click order confirmation.',
      businessRules: [
        'Header-to-Item composition: Deleting header cascades automatically to all line items.',
        'Order total must be automatically computed as SUM(Item Net Amount) using REDUCE in Determination.',
        'Customer credit balance cannot exceed credit limit assigned in `I_Customer`.',
        'Line items cannot have 0 quantity or negative unit price.'
      ],
      inputOutput: 'Input: Deep Sales Order JSON { customer, items: [...] }. Output: Created Sales Order with computed NetAmount and tax lines.'
    },
    performance: {
      targetSla: '< 150ms p95 for deep create of 25-item Sales Order',
      indexStrategy: 'Index on (client, customer_id, order_status) and foreign key index on items (client, order_uuid).',
      concurrency: 'Composition tree locking: Lock master at Header locks all child items.',
      cleanCoreBenchmark: '100% ABAP Cloud with EML deep-create operations.'
    },
    systemDesign: null
  },

  p8: {
    requirements: {
      userStory: 'As a Procurement Manager, I need to build a Purchase Requisition approval system with composition tree hierarchy, draft capability, and multi-tier manager approval limits.',
      businessRules: [
        'Requisitions under $5,000 auto-approve; $5,000 - $50,000 require Department Manager; >$50,000 require Director.',
        'Draft capability mandatory: Users can save partially completed requisitions without triggering validations.',
        'Activating draft verifies all business constraints: supplier active, delivery date in future, GL account valid.',
        'Line items sum must equal Header Total Amount before final activation.'
      ],
      inputOutput: 'Input: Deep draft Purchase Requisition with items. Output: Active purchasing document or draft error list.'
    },
    performance: {
      targetSla: '< 140ms p95 for Draft Activation with 20 items',
      indexStrategy: 'Header index on (client, req_id), Items index on (client, req_uuid, item_no). Draft tables mirrored with `%admin` keys.',
      concurrency: 'Lock Master total etag on Header LastChangedAt; optimistic draft locking on child items.',
      cleanCoreBenchmark: 'Uses released SAP `I_PurchaseRequisitionTP` RAP BO architecture.'
    },
    systemDesign: {
      complexity: 'High (RAP Managed with Draft Composition & Multi-Tier Approvals)',
      diagram: `
+-----------------------------------------------------------------------------------+
|                       REACT PURCHASE REQUISITION PORTAL SPA                       |
|   - Draft Auto-Save: Debounced PATCH calls on item edits without full form submit |
|   - Draft Activate Button: Triggers transactional commit & validation cascade     |
+-----------------------------------------------------------------------------------+
                                        | (OData V4 Draft Protocol)
                                        v
+-----------------------------------------------------------------------------------+
|                      SAP GATEWAY & DRAFT LIFECYCLE CONTROLLER                     |
|   - Manages Draft State: IsActiveEntity, HasDraftEntity, HasActiveEntity          |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|               RAP BDEF: ROOT REQUISITION + COMPOSITION OF ITEMS                   |
|   - with draft; | strict ( 2 ); | lock master total etag LastChangedAt            |
|   - draft table zpreq_d (Header) & zpreq_item_d (Child Items)                     |
|   - draft determine action Prepare { validation validateSupplier; }               |
|   - draft action Edit, Activate optimized, Discard, Resume                        |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                     LOCAL BEHAVIOR POOL (ZBP_I_PURCH_REQ)                         |
|   - Determination: calculateTotal on modify { field Price, Quantity; }            |
|   - Validation: validateDeliveryDate on save { field DeliveryDate; }              |
|   - Action approveOrder: evaluates spending authority of SY-UNAME via EML         |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                   PERSISTENCE LAYER (ACTIVE & DRAFT SEPARATION)                   |
|   - Active: zpreq_header_db / zpreq_item_db (HANA Column Store)                   |
|   - Draft:  zpreq_header_d  / zpreq_item_d  (Auto-managed by RAP Runtime)         |
+-----------------------------------------------------------------------------------+
      `
    }
  },

  p9: {
    requirements: {
      userStory: 'As an Accounts Payable Clerk, I need to match supplier invoices against Purchase Orders and Goods Receipts (3-Way Match) with automatic price and quantity tolerance checks.',
      businessRules: [
        'Quantity Invoiced cannot exceed Quantity Received across all referenced PO lines.',
        'Price variance tolerance: up to 2% auto-accepted; >2% triggers blocking status `BLOCKED_PRICE_VARIANCE`.',
        'Tax code must match supplier jurisdiction; total invoice amount must equal Net + Tax.',
        'Invoice cannot be posted against a PO that has status `CLOSED` or `DELETED`.'
      ],
      inputOutput: 'Input: Supplier invoice header + item references to PO and GR. Output: 3-way match validation result and posting status.'
    },
    performance: {
      targetSla: '< 160ms p95 for 3-way reconciliation against 50 line items',
      indexStrategy: 'Index on (client, po_number, po_item) on purchase and receipt persistence tables.',
      concurrency: 'Enqueue on Purchase Order document during invoice verification to prevent duplicate matching.',
      cleanCoreBenchmark: 'Calls released `I_SupplierInvoiceAPI01` CDS views.'
    },
    systemDesign: null
  },

  p10: {
    requirements: {
      userStory: 'As a Project Consultant, I need to submit weekly timesheets against WBS elements with daily hour caps, overtime factor calculations, and manager approval routing.',
      businessRules: [
        'Daily billable hours cannot exceed 24 hours (hard constraint) or 12 hours (soft warning).',
        'WBS element must be valid and in status `RELEASED`; cannot book against closed projects.',
        'Weekly total >40 hours triggers overtime rate factor determination automatically.',
        'Approved timesheets lock permanently and feed payroll delta queues.'
      ],
      inputOutput: 'Input: Timesheet entries for Monday-Sunday. Output: Validated weekly timesheet with computed billing amount.'
    },
    performance: {
      targetSla: '< 100ms p95 for weekly 7-day timesheet submission',
      indexStrategy: 'Composite index on (client, consultant_id, work_date, wbs_element).',
      concurrency: 'Lock master on (consultant_id, fiscal_week) to prevent duplicate double-booking.',
      cleanCoreBenchmark: 'Integrates with released `I_WorkAgreement` and `I_WBSElementBasicData`.'
    },
    systemDesign: null
  },

  // =========================================================================
  // ADVANCED ENTERPRISE PROJECTS (p11 - p18) - MISSION-CRITICAL SYSTEMS
  // =========================================================================
  p11: {
    requirements: {
      userStory: 'THE CAPSTONE MASTERPIECE: Design and build an Autonomous Enterprise Procurement & Contract Platform with AI vendor risk evaluation, draft-enabled contracts, dynamic feature controls, and React delta patching.',
      businessRules: [
        'Contract hierarchy: Root Contract -> Composition of Line Items -> Association to Supplier Master.',
        'Real-time vendor risk index calculated via CDS `case` expressions based on delivery history.',
        'Managed RAP BDEF strictly with `with draft;`, `strict ( 2 );`, and `numbering : managed`.',
        'Action `approveOrder` dynamically enables ONLY if order total is under user spending limit and supplier risk < 50%.',
        'Zero classic ABAP: No `WRITE`, no `TABLES`, no unreleased tables. 100% ABAP Cloud certified.'
      ],
      inputOutput: 'Input: Full procurement order with line items, risk parameters, and approval triggers. Output: Production-ready enterprise contract instance.'
    },
    performance: {
      targetSla: '< 175ms p95 for end-to-end Contract Creation with 50 lines and dynamic risk scoring',
      indexStrategy: 'Partitioned by fiscal year and purchasing org. Secondary indexes on (supplier_id, risk_score) and (contract_status, total_amount).',
      concurrency: 'Lock Master total etag on LastChangedAt; optimistic row-level locking with ETag pre-validation.',
      cleanCoreBenchmark: '100% ABAP Cloud Tier 1 Core Extension. Passes all SAP S/4HANA Cloud ATC checks.'
    },
    systemDesign: {
      complexity: 'Enterprise Capstone (Autonomous Procurement with Dynamic Feature Control & Risk CDS)',
      diagram: `
+---------------------------------------------------------------------------------------------------+
|                        REACT CLIENT: AUTONOMOUS PROCUREMENT ENTERPRISE SPA                         |
|   - Debounced draft auto-save | Delta PATCH with X-CSRF-Token | Real-time risk gauge rendering   |
+---------------------------------------------------------------------------------------------------+
                                                  | (OData V4 Web API / $batch)
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                 SAP GATEWAY & SERVICE BINDING                                     |
|   - Service: ZUI_PROCUREMENT_V4 (OData V4 Transactional) | HTTP ETag If-Match Validation          |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                             RAP BEHAVIOR DEFINITION (STRICT 2 + DRAFT)                            |
|   - managed implementation in class zbp_i_proc_order_m unique; strict ( 2 ); with draft;          |
|   - lock master total etag LastChangedAt | etag master LocalLastChangedAt                         |
|   - field ( readonly, numbering : managed ) OrderUUID;                                            |
|   - determination calculateOrderTotal on modify { field CurrencyCode; }                           |
|   - validation validateDeliveryDate on save { field DeliveryDate; }                               |
|   - action ( features : instance ) approveOrder result [1] $self;                                 |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                       BEHAVIOR POOL IMPLEMENTATION (CL_ABAP_BEHAVIOR_HANDLER)                     |
|   - get_instance_features: Evaluates spending threshold + vendor risk to toggle approve button   |
|   - approveOrder: Verifies EML permissions, updates OrderStatus to 'APPROVED' in LOCAL MODE       |
|   - validateSupplierActive: Checks released CDS I_BusinessPartner active flag                     |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                CDS DATA MODELING VIRTUALIZATION                                   |
|   - ZC_ProcurementOrder_M (Projection View with UI Annotations)                                  |
|   - ZI_ProcurementOrder_M (Root View Entity with Composition of Items & Association to Supplier) |
|   - Calculated CDS Field: RiskIndex = case when delivery_delay > 5 then 'HIGH' else 'LOW' end    |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                 HANA CLOUD COLUMN PERSISTENCE                                     |
|   - Active Tables: zproc_order_db / zproc_item_db (HANA In-Memory Storage)                        |
|   - Draft Tables:  zproc_order_d  / zproc_item_d  (Managed Lifecycle Storage)                     |
+---------------------------------------------------------------------------------------------------+
      `
    }
  },

  p12: {
    requirements: {
      userStory: 'As a Corporate Financial Controller, I need a Global Multi-Currency Financial Ledger with balanced debit/credit validation, automated foreign currency translation, and period-end closing locks.',
      businessRules: [
        'Total Debits must exactly equal Total Credits across all line items in the transaction currency.',
        'Foreign currency balances must translate to Group Currency (EUR/USD) using date-effective TCURR rates.',
        'Posting into closed fiscal periods must be strictly rejected with message FINS_PERIOD_CLOSED.',
        'Reversal documents must generate opposite debit/credit entries with reference to the original document.'
      ],
      inputOutput: 'Input: Journal entry with 2+ balanced line items and currency headers. Output: Posted Financial Document with ledger number.'
    },
    performance: {
      targetSla: '< 140ms p95 for balanced multi-line journal entry posting',
      indexStrategy: 'Index on (client, company_code, fiscal_year, doc_number) and line index on (account_number, posting_date).',
      concurrency: 'Lock Master on Company Code + Fiscal Year to prevent period-end race conditions.',
      cleanCoreBenchmark: 'Integrates with released `I_JournalEntryTP` and `I_GLAccount`.'
    },
    systemDesign: {
      complexity: 'Very High (Zero-Tolerance Debit/Credit Balancing & Multi-Currency Engine)',
      diagram: `
+-----------------------------------------------------------------------------------+
|                        REACT GENERAL LEDGER JOURNAL POSTING SPA                   |
|   - Live Debit/Credit balance tracker | Multi-currency real-time conversion display|
+-----------------------------------------------------------------------------------+
                                        | (OData V4 Transactional)
                                        v
+-----------------------------------------------------------------------------------+
|                        RAP BDEF: JOURNAL ENTRY ROOT + ITEMS                       |
|   - strict ( 2 ); | validation validateBalance on save { field Amount; }         |
|   - validation validateFiscalPeriod on save { field PostingDate; }                |
|   - determination calculateGroupCurrency on modify { field TransactionCurrency; } |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                     BEHAVIOR HANDLER (ZBP_I_JOURNAL_ENTRY)                        |
|   - Reads all items using EML: SUM(Debit) vs SUM(Credit)                          |
|   - Converts amounts using standard function module CONVERT_TO_FOREIGN_CURRENCY   |
|   - Enforces lock on fiscal year closing status table                             |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                        PERSISTENCE & FINANCIAL LEDGER DDL                         |
|   - zledger_head_db (Header) & zledger_item_db (Item Lines with debit/credit flag)|
+-----------------------------------------------------------------------------------+
      `
    }
  },

  p13: {
    requirements: {
      userStory: 'As a Corporate Governance Officer, I need a configurable Multi-Level Approval Workflow Engine that dynamically routes capital expenditure requests based on spending authority matrix and records audit trails.',
      businessRules: [
        'Multi-stage approval: Level 1 (Manager <$10k), Level 2 (VP <$50k), Level 3 (CFO >$50k).',
        'State Machine transitions: DRAFT -> SUBMITTED -> PENDING_L1 -> PENDING_L2 -> APPROVED / REJECTED.',
        'Delegation support: Managers can delegate approval to an authorized proxy during vacation dates.',
        'Complete immutable audit log capturing timestamp, approver ID, decision comment, and IP.'
      ],
      inputOutput: 'Input: Expenditure request or approval action `executeApproval(level, comment)`. Output: Updated workflow state.'
    },
    performance: {
      targetSla: '< 120ms p95 for state machine transition and delegation resolution',
      indexStrategy: 'Index on (client, request_id, current_step) and delegation index on (approver_id, start_date, end_date).',
      concurrency: 'Lock Master on Request UUID with optimistic concurrency token.',
      cleanCoreBenchmark: 'Clean Core state machine pattern without SAP Business Workflow legacy dependencies.'
    },
    systemDesign: {
      complexity: 'Very High (Dynamic State Machine & Multi-Level Delegation Matrix)',
      diagram: `
+-----------------------------------------------------------------------------------+
|                     REACT CORPORATE APPROVAL INBOX (FIORI-LIKE)                   |
|   - Instant approve/reject buttons | Multi-level approval progress timeline stepper|
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                       RAP BEHAVIOR POOL: STATE MACHINE ENGINE                     |
|   [State Transitions]                                                             |
|     DRAFT ----> SUBMITTED ----> LEVEL 1 (Mgr) ----> LEVEL 2 (VP) ----> APPROVED   |
|                    |                 |                   |                        |
|                    +-----------------+-------------------+----> REJECTED          |
|   [Instance Feature Control]                                                      |
|     - approveOrder button only enabled if sy-uname == CurrentAssignedApprover     |
|     - Auto-routes to Level 2 if TotalAmount >= 10,000                             |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                         AUDIT LOG & PERSISTENCE LAYER                             |
|   - zwf_request_db (Header State) & zwf_audit_log_db (Append-Only Decision Log)   |
+-----------------------------------------------------------------------------------+
      `
    }
  },

  p14: {
    requirements: {
      userStory: 'As a Plant Production Supervisor, I need to create Production Orders with multi-level Bill of Materials (BOM) explosion, scrap factor calculations, and machine routing reservations.',
      businessRules: [
        'BOM Explosion must resolve parent assemblies into child components recursively.',
        'Scrap factor (e.g. 3.5%) must automatically increase required component quantities.',
        'Component availability check: Warn if required raw material stock is insufficient in plant storage.',
        'Production order release updates scheduled start/end dates based on work center run times.'
      ],
      inputOutput: 'Input: Production Order request { material, targetQuantity, dueDate }. Output: Multi-tier exploded component reservation document.'
    },
    performance: {
      targetSla: '< 180ms p95 for 4-level recursive BOM explosion with 150 child parts',
      indexStrategy: 'Hierarchy index on (client, parent_mat, child_mat) and reservation index on (plant, material, req_date).',
      concurrency: 'Lock Master on Production Order ID with shared read lock on BOM definitions.',
      cleanCoreBenchmark: 'Queries released `I_BillOfMaterial` and `I_WorkCenter`.'
    },
    systemDesign: null
  },

  p15: {
    requirements: {
      userStory: 'As a Warehouse Distribution Manager, I need an automated Warehouse Bin & Wave Picking system that reserves inventory using FIFO/FEFO rules, calculates bin capacity, and dispatches wave pick lists.',
      businessRules: [
        'FIFO Allocation: Oldest batch/lot by expiration date (FEFO) allocated first.',
        'Bin Capacity Check: Total weight and volume of assigned items cannot exceed bin maximum.',
        'Wave Picking: Multiple sales orders grouped into a single optimized picking wave by warehouse aisle.',
        'Bin replenishment triggered automatically when bin stock falls below minimum threshold.'
      ],
      inputOutput: 'Input: Wave creation command for order list. Output: Optimized pick route document with assigned bin locations.'
    },
    performance: {
      targetSla: '< 160ms p95 for 100-line wave pick route generation',
      indexStrategy: 'Index on (client, warehouse_id, aisle, bin_id) and batch expiration index on (material, expiry_date).',
      concurrency: 'Lock on inventory bin instances to prevent two pickers from reserving the same stock unit.',
      cleanCoreBenchmark: '100% ABAP Cloud with released warehouse master data entities.'
    },
    systemDesign: null
  },

  p16: {
    requirements: {
      userStory: 'As a Customer Support Manager, I need a Service Ticket & SLA Escalation platform that calculates SLA breach timers based on customer contract tier and routes high-priority tickets to on-duty engineers.',
      businessRules: [
        'SLA Response Time: Tier 1 (Platinum) = 15 mins; Tier 2 (Gold) = 1 hr; Tier 3 (Standard) = 4 hrs.',
        'Breach timer calculated dynamically in CDS based on ticket creation timestamp and business hours calendar.',
        'Auto-escalation action triggers notification and reassigns ticket if SLA reaches 80% without acknowledgement.',
        'Ticket resolution requires mandatory root cause category code.'
      ],
      inputOutput: 'Input: Support ticket payload. Output: SLA response deadline and assigned support team queue.'
    },
    performance: {
      targetSla: '< 90ms p95 for ticket creation and real-time SLA deadline computation',
      indexStrategy: 'Index on (client, priority, sla_deadline, status) for queue prioritization queries.',
      concurrency: 'ETag master on ticket LastChangedAt with ticket lock master.',
      cleanCoreBenchmark: 'Clean Core event-driven design pattern.'
    },
    systemDesign: null
  },

  p17: {
    requirements: {
      userStory: 'As a Quality Assurance Manager, I need to record quality inspection lot results, calculate sample size deviations, and post usage decisions that automatically release or block inventory batches.',
      businessRules: [
        'Usage Decision: `ACCEPTED` releases batch to unrestricted stock; `REJECTED` posts to blocked stock via EML.',
        'Quantitative characteristics must fall within upper and lower specification limits (USL / LSL).',
        'Defect records must capture defect type, severity, and photo attachment metadata.',
        'Usage decision is final: once made, inspection lot cannot be modified.'
      ],
      inputOutput: 'Input: Inspection lot test measurements and usage decision code. Output: Stock posting confirmation and quality certificate.'
    },
    performance: {
      targetSla: '< 140ms p95 for usage decision execution including inventory batch status update',
      indexStrategy: 'Index on (client, inspection_lot, material, plant) and defect index on (lot_uuid, severity).',
      concurrency: 'Exclusive lock on inspection lot and associated inventory batch.',
      cleanCoreBenchmark: 'Integrates with released `I_InspectionLot` and `I_Batch`.'
    },
    systemDesign: null
  },

  p18: {
    requirements: {
      userStory: 'As a Plant Maintenance Engineer, I need to create and dispatch Work Orders against technical functional locations, reserve spare parts, and record actual technician labor hours.',
      businessRules: [
        'Functional Location hierarchy must be validated against plant equipment master.',
        'Spare parts reservation automatically checks stock availability and generates reservation document via EML.',
        'Labor hours posted must calculate total maintenance cost (Hours * Technician Rate).',
        'Technical Completion (TECO) requires all mandatory safety inspection check-steps to be completed.'
      ],
      inputOutput: 'Input: Maintenance work order with equipment ID, failure description, and parts list. Output: Dispatched work order.'
    },
    performance: {
      targetSla: '< 130ms p95 for work order dispatch and spare parts reservation',
      indexStrategy: 'Index on (client, functional_loc, equipment_id) and order status index on (plant, status, priority).',
      concurrency: 'Lock Master on Equipment ID during active maintenance order execution.',
      cleanCoreBenchmark: '100% ABAP Cloud with released `I_MaintenanceOrder` CDS views.'
    },
    systemDesign: null
  }
};
