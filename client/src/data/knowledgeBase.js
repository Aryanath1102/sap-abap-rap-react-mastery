export const KB_ITEMS = [
  {
    id: 'kb-1',
    term: 'VALUE # / FOR / REDUCE',
    category: 'Modern ABAP',
    badge: 'Constructor Expressions',
    summary: 'Expression-oriented table population and aggregation introduced in ABAP 7.40 and refined in 7.57+.',
    details: 'VALUE #( ... ) constructs internal tables and deep structures inline without manual APPEND loops. FOR ... IN ... WHERE provides declarative list comprehension. REDUCE folds a table into an aggregated scalar value (sum, count, average).',
    codeSnippet: `FINAL(lv_payroll) = REDUCE decfloat16(
  INIT sum = 0
  FOR ls IN lt_employees
  WHERE ( is_active = abap_true )
  NEXT sum = sum + ls-salary
).`
  },
  {
    id: 'kb-2',
    term: 'FINAL(var) vs DATA(var)',
    category: 'Modern ABAP',
    badge: 'ABAP 7.57+',
    summary: 'Immutable inline variable declaration syntax enforcing functional programming principles.',
    details: 'While DATA(var) declares a mutable inline variable, FINAL(var) (ABAP 7.57+ / S/4HANA 2022+) makes the variable read-only after assignment. Any subsequent reassignment triggers a syntax error, preventing accidental state mutations.',
    codeSnippet: `FINAL(lv_max_limit) = 500000.
DATA(lv_current)   = 120000.
" lv_max_limit = 600000.  <-- SYNTAX ERROR!`
  },
  {
    id: 'kb-3',
    term: 'DEFINE VIEW ENTITY',
    category: 'CDS Views',
    badge: 'ABAP 7.55+',
    summary: 'The modern, DDIC-free CDS syntax replacing obsolete DEFINE VIEW.',
    details: 'Unlike classic CDS views that generated a dictionary SQL view (SE11), CDS View Entities exist only in the CDS compiler layer. They activate 5x faster, prevent cyclic dependency deadlocks, support strict null checking, and are mandatory for RAP.',
    codeSnippet: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_Employee
  as select from zemp_db
{
  key emp_uuid as EmployeeUUID, ...
}`
  },
  {
    id: 'kb-4',
    term: 'strict ( 2 );',
    category: 'RAP BDEF',
    badge: 'Mandatory Standard',
    summary: 'SAP best-practice strict mode configuration in Behavior Definitions.',
    details: 'Mandatory for ABAP Cloud development. strict ( 2 ) enforces explicit mapping between CDS view entity elements and database columns, requires authorization master declarations, validates readonly/mandatory fields, and blocks deprecated keywords.',
    codeSnippet: `managed implementation in class zbp_i_employee unique;
strict ( 2 );

define behavior for ZI_Employee alias Employee ...`
  },
  {
    id: 'kb-5',
    term: 'EML (Entity Manipulation Language)',
    category: 'RAP EML',
    badge: 'Kernel Language',
    summary: 'The standard ABAP syntax for creating, reading, updating, and executing actions on RAP Business Objects.',
    details: 'EML provides compile-time syntax checks and code completion in ADT. Statements include READ ENTITIES, MODIFY ENTITIES, and COMMIT ENTITIES. Inside Behavior Pools, always specify IN LOCAL MODE to avoid external authorization overhead.',
    codeSnippet: `MODIFY ENTITIES OF zi_employee IN LOCAL MODE
  ENTITY Employee
  UPDATE FIELDS ( Status )
  WITH VALUE #( ( %tky = ls_key-%tky Status = 'CONFIRMED' ) )
  FAILED DATA(lt_failed)
  REPORTED DATA(lt_reported).`
  },
  {
    id: 'kb-6',
    term: 'X-CSRF-Token Handshake',
    category: 'React & OData V4',
    badge: 'Security',
    summary: 'Mandatory anti-Cross-Site-Request-Forgery handshake required before any stateful SAP Gateway operation.',
    details: 'Before executing POST, PATCH, or DELETE against SAP RAP OData V4, a web client must issue a preliminary HEAD or GET request with header "X-CSRF-Token: Fetch". The server responds with the cryptographic token in the response headers, which must be passed in subsequent mutating calls.',
    codeSnippet: `const tokenRes = await fetch('/sap/opu/odata4/.../', {
  method: 'HEAD',
  headers: { 'X-CSRF-Token': 'Fetch' },
  credentials: 'include'
});
const csrf = tokenRes.headers.get('x-csrf-token');`
  },
  {
    id: 'kb-7',
    term: 'OData V4 Delta Updates (PATCH vs PUT)',
    category: 'React & OData V4',
    badge: 'HTTP Protocol',
    summary: 'OData V4 mandates PATCH with surgical attribute deltas rather than PUT resource replacement.',
    details: 'In OData V4, updating an entity requires sending HTTP PATCH with only the modified fields in the JSON body, accompanied by "If-Match: *" or the entity ETag. This avoids overwriting server-calculated fields and respects optimistic locking.',
    codeSnippet: `await fetch(\`\${URL}(\${uuid})\`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf, 'If-Match': '*' },
  body: JSON.stringify({ Salary: 98000 })
});`
  },
  {
    id: 'kb-8',
    term: 'Clean Core & Level A Released APIs',
    category: 'Clean Core',
    badge: 'Enterprise Standard',
    summary: 'Extensibility model keeping the SAP S/4HANA core unmodified and cloud upgrade-ready.',
    details: 'In S/4HANA Cloud and modern on-premise systems, direct access to standard internal tables (BUT000, MARA, VBAK) is blocked by ATC. Developers must query officially released Level A CDS View Entities (Contract C1 for system internal use) such as I_BusinessPartner and I_Product.',
    codeSnippet: `* ❌ FORBIDDEN: SELECT * FROM mara INTO TABLE @DATA(lt_mat).
* ✅ CLEAN CORE:
SELECT FROM i_product
  FIELDS product, producttype, baseunit
  INTO TABLE @DATA(lt_clean_prod).`
  },
  {
    id: 'kb-9',
    term: 'RAP Draft Lifecycle (%is_draft & PREPARE)',
    category: 'RAP Draft',
    badge: 'Enterprise Architecture',
    summary: 'Framework-managed transactional drafts allowing users to pause and resume work without database pollution.',
    details: 'Draft BOs configure a draft table with `draft table z*_d` in BDEF. RAP automatically partitions records into Active and Draft. The user edits draft data; clicking "Save" invokes the PREPARE action which triggers validations before promoting draft data into the active production table.',
    codeSnippet: `draft determine action Prepare
{
  validation validateCustomer;
  validation validateTotalAmount;
}`
  },
  {
    id: 'kb-10',
    term: 'Dynamic Instance Feature Control',
    category: 'RAP Actions',
    badge: 'State Machine',
    summary: 'Lifecycle method enabling or disabling buttons, fields, and operations on the UI based on row status.',
    details: 'Implemented in the Behavior Pool via `get_instance_features`. It inspects entity status and returns flags such as `%action-approve = if_abap_behv=>fc-o-disabled`. The OData V4 service projects this to React or Fiori, allowing buttons to dynamically disable.',
    codeSnippet: `result = VALUE #(
  FOR r IN lt_orders
  ( %tky = r-%tky
    %action-approve = COND #(
      WHEN r-Status = 'APPROVED' THEN if_abap_behv=>fc-o-disabled
      ELSE if_abap_behv=>fc-o-enabled
    )
  )
).`
  }
];
