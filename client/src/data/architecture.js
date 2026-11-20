export const ARCH_LAYERS = {
  react: {
    id: 'react',
    layerNumber: 1,
    title: 'React Modern Frontend (SPA)',
    badge: 'Presentation Layer',
    subtitle: 'Vite + React + Tailwind CSS client communicating over HTTPS',
    overview: 'The user-facing Single Page Application. It manages interactive UI state, tables, forms, modals, and initiates asynchronous network communication using standard fetch(). It treats SAP RAP strictly as a RESTful JSON provider.',
    dataFlow: 'User Action (e.g. Save Button) → Form Validation → getCsrfToken() handshake → HTTP POST/PATCH JSON request sent to SAP Gateway.',
    keyMechanics: [
      'Two-step CSRF Handshake: preliminary HEAD/GET with "X-CSRF-Token: Fetch" header',
      'Surgical delta updates using HTTP PATCH with "If-Match: *" (or ETag timestamp)',
      'OData V4 array extraction from response.value and record counting via response["@odata.count"]',
      'Parsing structured backend errors from response.error.details to highlight input fields in red'
    ],
    cleanCoreRule: 'The frontend has zero dependency on legacy SAP GUI, Web Dynpro, or SAP proprietary UI libraries. Built with open web standards (React/Vite).',
    language: 'javascript',
    sampleCode: `// Layer 1: React API Service Handshake
export async function updateEmployeeSalary(uuid, newSalary, etag = '*') {
  // 1. Fetch CSRF token
  const tokenRes = await fetch('/sap/opu/odata4/sap/zapi_emp_o4/srvd/sap/zapi_emp_o4/0001/', {
    method: 'HEAD',
    headers: { 'X-CSRF-Token': 'Fetch' },
    credentials: 'include'
  });
  const csrf = tokenRes.headers.get('x-csrf-token');

  // 2. Surgical delta update with PATCH
  const res = await fetch(\`/sap/opu/odata4/sap/zapi_emp_o4/srvd/sap/zapi_emp_o4/0001/Employee(\${uuid})\`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrf,
      'If-Match': etag
    },
    credentials: 'include',
    body: JSON.stringify({ Salary: newSalary })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Update failed');
  }
  return res.json();
}`
  },

  odata: {
    id: 'odata',
    layerNumber: 2,
    title: 'Service Definition & Service Binding (OData V4)',
    badge: 'API Gateway Layer',
    subtitle: 'Exposes CDS Projection Views over standard HTTPS OData V4 protocol',
    overview: 'The Service Definition (ZSD_*) groups projection entities for public exposure. The Service Binding (ZSB_*) binds them to OData V4 protocol with binding type "OData V4 - Web API". Generates the live service endpoint and JSON $metadata.',
    dataFlow: 'Receives HTTP request from React → Validates CSRF token & user session → Parses OData URL query options ($filter, $top, $skip) → Delegates transactional dispatch to the RAP runtime.',
    keyMechanics: [
      'OData V4 payload optimization: lightweight JSON format (no redundant XML or verbose metadata headers)',
      'Built-in server-side pagination with $top and $skip preventing high-memory out-of-memory dumps',
      'Standardized HTTP verbs: GET (read), POST (create/action), PATCH (delta update), DELETE (remove)',
      'Exposes bound business actions directly as callable HTTP endpoints'
    ],
    cleanCoreRule: 'Only CDS Projection Views (ZC_*) are exposed in the service definition, hiding internal tables and interface views.',
    language: 'cds',
    sampleCode: `// Layer 2: Service Definition
@EndUserText.label: 'Employee OData V4 API'
define service ZAPI_EMPLOYEE_O4 {
  expose ZC_Employee   as Employee;
  expose ZC_Department as Department;
}

// Service Binding in ADT:
// Name: ZSB_EMPLOYEE_O4
// Type: OData V4 - Web API (Local & Remote Consumption)
// URL:  /sap/opu/odata4/sap/zapi_employee_o4/srvd/sap/zapi_employee_o4/0001`
  },

  cds: {
    id: 'cds',
    layerNumber: 3,
    title: 'CDS View Entities & Virtual Data Model (VDM)',
    badge: 'Data Modeling Layer',
    subtitle: 'High-performance SQL pushdown on SAP HANA with DDIC-free View Entities (7.55+)',
    overview: 'The Virtual Data Model (VDM) forms the semantic backbone of SAP S/4HANA. Built with modern `DEFINE VIEW ENTITY` (not legacy DEFINE VIEW), it models tables into reusable Interface Views (ZI_*) and purpose-built Projection Views (ZC_*).',
    dataFlow: 'Receives query request from OData V4 → Applies field projections and calculated columns → Resolves Associations on demand → Filters rows according to Data Control Language (DCL) authorization policies.',
    keyMechanics: [
      'DEFINE ROOT VIEW ENTITY: Zero DDIC SQL view generation, lightning-fast activation and strict compiler checks',
      'Lazy Associations: SQL JOINs execute in HANA only when requested fields are queried by the client',
      'Parent-Child Compositions: strictly locks child records to parent lifecycle for deep transactional integrity',
      'DCL Access Control (@AccessControl.authorizationCheck: #CHECK) enforcing row-level security'
    ],
    cleanCoreRule: 'View Entities isolate UI projections from raw DB storage and exclusively query released Level A CDS views for standard data.',
    language: 'cds',
    sampleCode: `// Layer 3: CDS Interface View Entity (ZI_*)
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Employee Interface View'
define root view entity ZI_Employee
  as select from zemp_table_db
  association [0..1] to ZI_Department as _Department
    on $projection.DepartmentId = _Department.DepartmentId
{
  key emp_uuid        as EmployeeUUID,
      emp_id          as EmployeeId,
      first_name      as FirstName,
      last_name       as LastName,
      department_id   as DepartmentId,
      salary          as Salary,
      last_changed_at as LastChangedAt,
      _Department
}`
  },

  rap: {
    id: 'rap',
    layerNumber: 4,
    title: 'RAP Behavior Definition & Implementation (EML)',
    badge: 'Business Logic Layer',
    subtitle: 'strict ( 2 ) BDEF, Validations, Determinations, Actions & Local EML',
    overview: 'The transactional heart of the application. The Behavior Definition (BDEF) declares what operations are permitted (create, update, delete, actions, validations, determinations, draft). The Behavior Pool (ABAP class) implements custom business rules using EML in LOCAL MODE.',
    dataFlow: 'OData V4 triggers operation → Interaction Phase validates authorization and runs Determinations → Save Sequence triggers Validations ON SAVE → Writes to DB Buffer.',
    keyMechanics: [
      'strict ( 2 ); syntax mode: enforces modern RAP rules, explicit table mapping, and cloud compatibility',
      'Validations ON SAVE: inspects field values and blocks invalid commits by filling failed and reported',
      'Determinations ON MODIFY / ON SAVE: derives field values (timestamps, initial status, totals) automatically',
      'Entity Manipulation Language (EML) with IN LOCAL MODE for internal intra-BO data orchestration'
    ],
    cleanCoreRule: 'All transactional modifications route through RAP and EML. No direct INSERT / UPDATE / DELETE SQL statements on custom or standard tables.',
    language: 'abap',
    sampleCode: `// Layer 4: RAP Validation with EML IN LOCAL MODE
METHOD validateSalary.
  READ ENTITIES OF zi_employee IN LOCAL MODE
    ENTITY Employee FIELDS ( Salary )
    WITH CORRESPONDING #( keys )
    RESULT DATA(lt_employees).

  LOOP AT lt_employees INTO DATA(ls_emp).
    IF ls_emp-Salary <= 0.
      APPEND VALUE #( %tky = ls_emp-%tky ) TO failed-employee.
      APPEND VALUE #(
        %tky = ls_emp-%tky
        %msg = new_message_with_text(
          severity = if_abap_behv_message=>severity-error
          text     = 'Salary must be greater than zero.'
        )
      ) TO reported-employee.
    ENDIF.
  ENDLOOP.
ENDMETHOD.`
  },

  hana: {
    id: 'hana',
    layerNumber: 5,
    title: 'SAP HANA Database & Clean Core APIs',
    badge: 'Persistence Layer',
    subtitle: 'Transparent columnar storage and officially released Level A SAP APIs (C1 Contract)',
    overview: 'The database foundation in SAP S/4HANA and SAP BTP ABAP Environment. Custom data resides in transparent Z* tables with UUID primary keys. All interactions with SAP standard business objects occur strictly via released Level A CDS View Entities.',
    dataFlow: 'RAP runtime commits transactional buffer to custom HANA columnar tables and interacts with released SAP objects during the Finalize & Save phases.',
    keyMechanics: [
      'In-memory columnar storage with automated compression and high-speed aggregation',
      'UUID 16-byte raw primary keys preventing key collision and enabling distributed replication',
      'Optimistic locking timestamps (timestampl) serving as total etag masters',
      'Contract C1 (System Internal Use) and C2 (Remote API) release compliance'
    ],
    cleanCoreRule: 'Zero direct reads or modifications of unreleased standard tables (BUT000, MARA, VBAK). Access strictly via I_BusinessPartner, I_Product, etc.',
    language: 'sql',
    sampleCode: `-- Layer 5: HANA DB Table + Released Clean Core VDM
define table zemp_table_db {
  key client      : abap.clnt not null;
  key emp_uuid    : sysuuid_x16 not null;
  emp_id          : abap.char(10);
  salary          : abap.curr(15,2);
  last_changed_at : timestampl;
}

* Clean Core Access to SAP Standard Data:
SELECT FROM i_businesspartner
  FIELDS businesspartner, businesspartnerfullname
  WHERE businesspartnercategory = '1'
  INTO TABLE @DATA(lt_released_bp)
  UP TO 10 ROWS.`
  }
};
