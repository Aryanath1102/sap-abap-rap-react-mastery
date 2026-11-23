/**
 * Clean Core & Modern ABAP Static Code Analyzer (Client & Browser Edition)
 * Enforces ABAP Cloud, S/4HANA Clean Core, RAP strict ( 2 ), and OData V4 best practices.
 */

const UNRELEASED_TABLES = [
  'but000', 'mara', 'marc', 'mard', 'vbak', 'vbap', 'kna1', 'lfa1',
  'bseg', 'bkpf', 'ekko', 'ekpo', 'mast', 'stko', 'stpo', 'aufk', 'afko'
];

const TABLE_REPLACEMENTS = {
  'but000': 'I_BusinessPartner / I_BusinessPartnerAddress',
  'mara': 'I_Product / I_ProductDescription',
  'marc': 'I_ProductPlant',
  'mard': 'I_ProductStorageLocation',
  'vbak': 'I_SalesOrderTP / I_SalesOrder',
  'vbap': 'I_SalesOrderItemTP / I_SalesOrderItem',
  'kna1': 'I_Customer',
  'lfa1': 'I_Supplier',
  'bseg': 'I_JournalEntryItem',
  'bkpf': 'I_JournalEntry',
  'ekko': 'I_PurchaseOrderAPI01',
  'ekpo': 'I_PurchaseOrderItemAPI01'
};

export function validateAssignment(lessonId, code) {
  if (!code || typeof code !== 'string' || !code.trim()) {
    return {
      status: 'needs_revision',
      complianceScore: 0,
      grade: 'F',
      violations: [{
        rule: 'EMPTY_CODE',
        severity: 'ERROR',
        message: 'No code was submitted. Please write your modern ABAP / RAP implementation.',
        remediation: 'Implement the exercise according to the prompt instructions.'
      }],
      strengths: [],
      architectNotes: 'An empty submission cannot be verified against the SAP Clean Core standards.'
    };
  }

  const cleanLines = code.split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('*') && !line.startsWith('//') && !line.startsWith('"'));
  const cleanCode = cleanLines.join(' ');
  const lowerCode = cleanCode.toLowerCase();

  const violations = [];
  const strengths = [];

  // ==========================================
  // 1. UNIVERSAL CLEAN CORE CHECKS
  // ==========================================

  // Check 1: Classic WRITE statement
  if (/\bwrite\s*:/i.test(code) || (/\bwrite\s+['a-z0-9_]/i.test(code) && !/out->write/i.test(code))) {
    violations.push({
      rule: 'NO_CLASSIC_WRITE',
      severity: 'ERROR',
      message: 'Classic Dynpro WRITE statement detected.',
      remediation: 'In ABAP Cloud, classic WRITE is forbidden. Use `out->write( )` via `IF_OO_ADT_CLASSRUN` for console testing, or expose data via CDS View Entities + RAP OData V4 services.',
      example: 'out->write( |Employee: { ls_emp-name }| ).'
    });
  }

  // Check 2: Unreleased standard tables
  for (const table of UNRELEASED_TABLES) {
    const tableRegex = new RegExp(`\\bfrom\\s+${table}\\b|\\binto\\s+table\\s+.*${table}\\b`, 'i');
    if (tableRegex.test(lowerCode)) {
      const replacement = TABLE_REPLACEMENTS[table] || 'released Level A CDS View Entity';
      violations.push({
        rule: 'UNRELEASED_TABLE_READ',
        severity: 'ERROR',
        message: `Direct read on unreleased standard table '${table.toUpperCase()}' violates Clean Core!`,
        remediation: `In ABAP Cloud & S/4HANA Clean Core, direct access to unreleased standard tables is strictly blocked by ATC. Query released CDS View Entities like '${replacement}'.`,
        example: `SELECT FROM ${replacement.split(' ')[0]} FIELDS ... INTO TABLE @DATA(lt_res).`
      });
    }
  }

  // Check 3: Obsolete Header Lines and OCCURS 0
  if (/\bheader\s+line\b/i.test(code) || /\boccurs\s+0\b/i.test(code)) {
    violations.push({
      rule: 'OBSOLETE_HEADER_LINE',
      severity: 'ERROR',
      message: 'Obsolete table declaration with HEADER LINE or OCCURS 0 found.',
      remediation: 'Internal tables with header lines have been obsolete for 15+ years and fail ABAP Cloud syntax checks. Use explicit table types with empty keys.',
      example: 'TYPES tt_items TYPE STANDARD TABLE OF ty_item WITH EMPTY KEY.'
    });
  }

  // Check 4: Obsolete Subroutines (FORM / PERFORM)
  if (/\bform\s+[a-z0-9_]/i.test(code) || /\bperform\s+[a-z0-9_]/i.test(code)) {
    violations.push({
      rule: 'NO_FORM_PERFORM',
      severity: 'ERROR',
      message: 'Subroutines (FORM / PERFORM) are obsolete and forbidden in ABAP Cloud.',
      remediation: 'Replace subroutines with Object-Oriented ABAP methods inside local or global classes.',
      example: 'METHODS calculate_discount IMPORTING iv_amount TYPE decfloat16 RETURNING VALUE(rv_res) TYPE decfloat16.'
    });
  }

  // Check 5: Obsolete MOVE ... TO ...
  if (/\bmove\s+[a-z0-9_().-]+\s+to\s+[a-z0-9_().-]+/i.test(code)) {
    violations.push({
      rule: 'OBSOLETE_MOVE_STATEMENT',
      severity: 'WARNING',
      message: 'Legacy MOVE ... TO ... statement detected.',
      remediation: 'Use direct assignment (=) or the modern constructor expression CORRESPONDING #( ).',
      example: 'ls_target = CORRESPONDING #( ls_source ).'
    });
  }

  // Check 6: Unreleased Function Modules
  if (/\bcall\s+function\b/i.test(code)) {
    violations.push({
      rule: 'UNRELEASED_FUNCTION_MODULE',
      severity: 'WARNING',
      message: 'CALL FUNCTION detected. Classic function modules are rarely released for ABAP Cloud.',
      remediation: 'Use RAP Business Object operations (EML), released classes, or HTTP client destinations.',
      example: 'MODIFY ENTITIES OF zi_order ...'
    });
  }

  // Check 7: Classic CDS DEFINE VIEW (instead of DEFINE VIEW ENTITY)
  if (/\bdefine\s+view\s+z/i.test(code) && !/\bdefine\s+(root\s+)?view\s+entity\b/i.test(code)) {
    violations.push({
      rule: 'OBSOLETE_CDS_DEFINE_VIEW',
      severity: 'ERROR',
      message: 'Obsolete DEFINE VIEW used instead of DEFINE VIEW ENTITY.',
      remediation: 'DDIC-based CDS views (DEFINE VIEW) generate an SE11 SQL view and are deprecated in modern RAP. Use DEFINE [ROOT] VIEW ENTITY.',
      example: 'define root view entity ZI_Employee as select from zemp_db { ... }'
    });
  }

  // ==========================================
  // 2. POSITIVE PATTERN RECOGNITION (STRENGTHS)
  // ==========================================

  if (/\b(value\s+#|value\s+[a-z0-9_]+)\s*\(/i.test(code)) {
    strengths.push('Constructor expression VALUE #( ) utilized for clean inline data creation.');
  }
  if (/\breduce\s+(i|decfloat[0-9]*|[a-z0-9_]+)\s*\(/i.test(code)) {
    strengths.push('Modern REDUCE expression applied for declarative table aggregation.');
  }
  if (/\bcond\s+(i|string|[a-z0-9_]+)\s*\(/i.test(code)) {
    strengths.push('Conditional constructor expression COND #( ) utilized.');
  }
  if (/\bdata\s*\([a-z0-9_]+\)/i.test(code) || /\bfinal\s*\([a-z0-9_]+\)/i.test(code)) {
    strengths.push('Inline variable declaration (DATA(...) / FINAL(...)) properly leveraged.');
  }
  if (/\bfinal\s*\([a-z0-9_]+\)/i.test(code)) {
    strengths.push('ABAP 7.57+ immutable FINAL(...) used for functional immutability.');
  }
  if (/\bdefine\s+(root\s+)?view\s+entity\b/i.test(code)) {
    strengths.push('Modern CDS View Entity (7.55+) declared without legacy DDIC views.');
  }
  if (/\bstrict\s*\(\s*2\s*\)\s*;/i.test(code)) {
    strengths.push('RAP BDEF strict ( 2 ) mode enforced for Cloud compliance.');
  }
  if (/\bin\s+local\s+mode\b/i.test(code)) {
    strengths.push('EML IN LOCAL MODE used correctly for intra-BO operational isolation.');
  }
  if (/x-csrf-token/i.test(code)) {
    strengths.push('X-CSRF-Token security handshake present for stateful OData V4 operations.');
  }
  if (/\bpatch\b/i.test(code)) {
    strengths.push('HTTP PATCH method correctly targeted for OData V4 delta updates.');
  }

  // ==========================================
  // 3. LESSON-SPECIFIC VALIDATIONS
  // ==========================================

  let lessonSpecificPassed = true;

  if (lessonId === 'modern-abap' || lessonId === 'day-1-modern-abap') {
    if (!/reduce/i.test(code)) {
      violations.push({
        rule: 'MISSING_REDUCE',
        severity: 'ERROR',
        message: 'Day 1 exercise requires a REDUCE constructor expression to aggregate employee records.',
        remediation: 'Use REDUCE i( INIT cnt = 0 FOR ls IN lt_emps NEXT cnt = cnt + COND i( WHEN ls-salary > 70000 THEN 1 ELSE 0 ) ).'
      });
      lessonSpecificPassed = false;
    }
  } else if (lessonId === 'oop-abap' || lessonId === 'day-2-oop-abap') {
    if (!/for\s+testing/i.test(code)) {
      violations.push({
        rule: 'MISSING_TEST_ANNOTATION',
        severity: 'ERROR',
        message: 'Day 2 exercise requires an ABAP Unit test class declaration with FOR TESTING.',
        remediation: 'Declare the local class with `CLASS ltc_... DEFINITION FINAL FOR TESTING DURATION SHORT RISK LEVEL HARMLESS.`'
      });
      lessonSpecificPassed = false;
    }
  } else if (lessonId === 'cds-entities' || lessonId === 'day-3-cds-entities') {
    if (!/projection\s+on/i.test(code) && !/view\s+entity/i.test(code)) {
      violations.push({
        rule: 'MISSING_PROJECTION_SYNTAX',
        severity: 'WARNING',
        message: 'CDS projection view should specify `provider contract transactional_query as projection on ZI_*`.',
        remediation: 'Use `define root view entity ZC_Employee provider contract transactional_query as projection on ZI_Employee { ... }`'
      });
    }
  } else if (lessonId.includes('rap-arch') || lessonId.includes('rap-bdef')) {
    if (!/strict\s*\(\s*2\s*\)/i.test(code) && /define\s+behavior/i.test(code)) {
      violations.push({
        rule: 'MISSING_STRICT_2',
        severity: 'ERROR',
        message: 'All modern RAP Behavior Definitions must declare `strict ( 2 );`.',
        remediation: 'Add `strict ( 2 );` immediately below `managed implementation in class ... unique;`.'
      });
      lessonSpecificPassed = false;
    }
  } else if (lessonId.includes('eml')) {
    if (!/%cid/i.test(code) && !/%tky/i.test(code) && !/modify\s+entities/i.test(code) && !/read\s+entities/i.test(code)) {
      violations.push({
        rule: 'MISSING_EML_STRUCTURE',
        severity: 'WARNING',
        message: 'Expected modern EML statements or %cid / %tky operational identifiers.',
        remediation: 'Utilize MODIFY ENTITIES OF ... or READ ENTITIES OF ... with %cid for new instances.'
      });
    }
  } else if (lessonId.includes('odata')) {
    if (!/patch/i.test(code) && !/define\s+service/i.test(code)) {
      violations.push({
        rule: 'ODATA_V4_METHOD',
        severity: 'WARNING',
        message: 'Ensure OData V4 PATCH method is specified for partial updates.',
        remediation: 'OData V4 mandates PATCH (with only modified attributes) rather than PUT.'
      });
    }
  } else if (lessonId.includes('react')) {
    if (!/value/i.test(code) && !/csrf/i.test(code)) {
      violations.push({
        rule: 'REACT_ODATA_PATTERN',
        severity: 'WARNING',
        message: 'In React + OData V4, remember to fetch X-CSRF-Token and extract records from data.value.',
        remediation: 'Read array data from `data.value` and total records from `data["@odata.count"]`.'
      });
    }
  }

  // ==========================================
  // 4. SCORING & FINAL EVALUATION
  // ==========================================

  const errorCount = violations.filter(v => v.severity === 'ERROR').length;
  const warningCount = violations.filter(v => v.severity === 'WARNING').length;

  let complianceScore = 100 - (errorCount * 35) - (warningCount * 10);
  if (strengths.length > 0) complianceScore += Math.min(15, strengths.length * 5);
  complianceScore = Math.max(0, Math.min(100, complianceScore));

  let grade = 'F';
  if (complianceScore >= 90) grade = 'A+';
  else if (complianceScore >= 80) grade = 'A';
  else if (complianceScore >= 65) grade = 'B';
  else if (complianceScore >= 50) grade = 'C';

  const status = (errorCount === 0 && lessonSpecificPassed && complianceScore >= 70)
    ? 'passed'
    : 'needs_revision';

  let architectNotes = '';
  if (status === 'passed') {
    architectNotes = `Excellent Clean Core execution! Your code demonstrates full compliance with Modern ABAP and ABAP Cloud principles. ${strengths.length > 0 ? 'Notable strengths: ' + strengths.join(' ') : ''}`;
  } else {
    architectNotes = `Your submission has ${errorCount} Clean Core violation(s) that would fail SAP S/4HANA Cloud ATC checks. Review the detailed remediation instructions below to make your solution production-grade.`;
  }

  return {
    status,
    complianceScore,
    grade,
    violations,
    strengths,
    architectNotes
  };
}

/**
 * Built-in SAP Technical Architect Code Reviewer & Assistant
 */
export function analyzeMentorPrompt(prompt) {
  const lower = prompt.toLowerCase();
  const issues = [];

  if (lower.includes('write:') || /\bwrite\s+['a-z0-9]/i.test(prompt)) {
    issues.push('Classic `WRITE` detected: in Modern ABAP & ABAP Cloud, use `out->write()` in console apps or expose via RAP OData V4.');
  }
  if (lower.includes('select * from but000') || lower.includes('select * from mara') || lower.includes('select * from vbak')) {
    issues.push('Clean Core violation: Direct read on unreleased standard table. In ABAP Cloud, query released Level A CDS View Entities (e.g., `I_BusinessPartner`, `I_Product`, `I_SalesOrderTP`).');
  }
  if (lower.includes('header line') || lower.includes('occurs 0')) {
    issues.push('Obsolete syntax (`HEADER LINE / OCCURS 0`): use modern `TYPES tt_... TYPE STANDARD TABLE OF ... WITH EMPTY KEY` and inline `VALUE #()`.');
  }
  if (lower.includes('define behavior') && !lower.includes('strict')) {
    issues.push('Missing `strict ( 2 );` in Behavior Definition: `strict ( 2 )` is mandatory for cloud-certified RAP BOs.');
  }

  let prefix = '';
  if (issues.length > 0) {
    prefix += `### ⚠️ Clean Core & Architecture Code Review\n\n`;
    issues.forEach(issue => {
      prefix += `- ❌ **Violation**: ${issue}\n`;
    });
    prefix += `\n---\n\n`;
  }

  // Question 1: Immutable inline variables (FINAL(...) vs DATA(...))
  if (lower.includes('immutable') || lower.includes('final(') || (lower.includes('variable') && lower.includes('cannot be modified'))) {
    return prefix + `### 💎 Modern ABAP 7.57+: Immutability with \`FINAL(...)\`

In Modern ABAP 7.57+ (and ABAP Cloud), the correct keyword for declaring an **immutable inline variable** is **\`FINAL(...)\`**.

#### 1. Layman Terms & Analogy
- Think of \`DATA(...)\` as a **dry-erase whiteboard**: you write a number, and anyone can wipe it out and change it later.
- Think of \`FINAL(...)\` as **stone engraving**: once you write the value during declaration, it is locked forever. Any later attempt to modify it causes a compile-time syntax check error.

#### 2. Technical Comparison
| Keyword | Introduced | Mutability | Scope | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **\`FINAL(...)\`** | **ABAP 7.57+** | **Immutable** (Write-once) | Block / Method local | Clean Functional programming, avoiding accidental state tampering |
| **\`DATA(...)\`** | ABAP 7.40+ | Mutable (Read/Write) | Block / Method local | Variables that legitimately need recalculation in loops |
| **\`CONSTANTS\`** | Classic ABAP | Immutable | Class / Method static | Compile-time fixed literals known before runtime |

#### 3. Production Code Example
\`\`\`abap
" 1. Inline immutable variable declaration (ABAP 7.57+)
FINAL(lv_tax_rate) = zcl_tax_calculator=>get_current_rate( 'DE' ).

" 2. Attempting to modify triggers a syntax error:
" lv_tax_rate = 0.25.  <-- ERROR: "lv_tax_rate" is declared as FINAL and cannot be modified.

" 3. Immutable internal table reference
FINAL(lt_active_orders) = CORRESPONDING tt_orders( lt_raw_orders ).
\`\`\`

> [!TIP]
> **Clean Core Rule**: Always prefer \`FINAL(...)\` over \`DATA(...)\` whenever a local variable or internal table is initialized once and never needs re-assignment. It prevents side-effects and aids the ABAP compiler's optimization pipeline.`;
  }

  // Question 2: Greetings
  if (/^(hi|hello|hey|greetings|good morning|good afternoon)/i.test(prompt.trim())) {
    return prefix + `### 👋 Welcome to SAP Modern ABAP, RAP & Clean Core Studio!

I am your **Principal SAP Technical Architect & Clean Core Advisor**. I'm here to help you master:

1. **Modern ABAP (7.50+ / 7.57+ / ABAP Cloud)**:
   - Constructor expressions: \`VALUE #()\`, \`COND #()\`, \`SWITCH #()\`, \`REDUCE #()\`, \`CORRESPONDING #()\`
   - Immutability: \`FINAL(...)\` vs \`DATA(...)\`
2. **CDS View Entities (7.55+)**:
   - \`DEFINE [ROOT] VIEW ENTITY\`, Provider contracts, Associations & Compositions
3. **SAP RAP (RESTful Application Programming Model)**:
   - Behavior Definitions (\`strict ( 2 )\`), Behavior Pools (\`ZBP_*\`), EML (\`MODIFY ENTITIES\`, \`IN LOCAL MODE\`)
   - Draft lifecycle, Validations, Determinations, Dynamic Feature Control
4. **React UI Integration**:
   - OData V4 consumption via \`fetch()\`, \`X-CSRF-Token\` handshake, \`PATCH\` delta updates

Ask me any architectural question, or paste your ABAP/RAP code for an instant Clean Core compliance review!`;
  }

  // Question 3: EML
  if (lower.includes('eml') || lower.includes('entity manipulation language')) {
    return prefix + `### 📘 EML (Entity Manipulation Language) Deep Dive

EML is modern ABAP's type-safe, transactional language for interacting with RAP Business Objects.

#### 1. Core Principles
- **Intra-BO Isolation (\`IN LOCAL MODE\`)**: When writing validation or action logic inside a behavior implementation class (\`ZBP_*\`), always use \`IN LOCAL MODE\` to bypass redundant external authorization checks.
- **Transactional IDs (\`%cid\` & \`%tky\`)**:
  - \`%cid\` (Content ID): Temporary alphanumeric identifier used when creating new uncommitted instances.
  - \`%tky\` (Transactional Key): Technical key structure including active/draft indicator (\`%is_draft\`).
- **Control Flags (\`%control\`)**: In \`READ ENTITIES\`, tell RAP which specific attributes you want to fetch using \`%control-field_name = if_abap_behv=>mk-on\`.

#### 2. Production EML Example
\`\`\`abap
" Create a new Travel instance with Content ID
MODIFY ENTITIES OF zi_travel_m
  ENTITY Travel
  CREATE FIELDS ( AgencyID CustomerID BeginDate EndDate BookingFee )
  WITH VALUE #( (
    %cid        = 'CID_NEW_TRAVEL_01'
    AgencyID    = '070001'
    CustomerID  = '000012'
    BeginDate   = cl_abap_context_info=>get_system_date( )
    EndDate     = cl_abap_context_info=>get_system_date( ) + 14
    BookingFee  = '25.00'
    %control-AgencyID   = if_abap_behv=>mk-on
    %control-CustomerID = if_abap_behv=>mk-on
  ) )
  MAPPED   FINAL(mapped)
  FAILED   FINAL(failed)
  REPORTED FINAL(reported).

IF failed IS NOT INITIAL.
  " Process T100 business messages from reported-travel
ENDIF.
\`\`\``;
  }

  // Question 4: Draft Handling
  if (lower.includes('draft')) {
    return prefix + `### 📝 SAP RAP Draft Handling & Architecture

Draft capabilities allow end-users to stage incomplete, invalid, or in-progress business data without corrupting the active production database tables.

#### 1. BDEF Declaration
\`\`\`abap
managed implementation in class zbp_i_travel unique;
strict ( 2 );
with draft;

define behavior for ZI_Travel alias Travel
persistent table ztravel_active
draft table ztravel_draft
lock master total etag LastChangedAt
etag master LocalLastChangedAt
{
  create; update; delete;
  draft action Edit;
  draft action Activate optimized;
  draft action Discard;
  draft determine action Prepare {
    validation validateDates;
    validation validateCustomer;
  }
}
\`\`\`

#### 2. Key Mechanics
- **Draft Table (\`ztravel_draft\`)**: Stores unvalidated user inputs. Automatically mirrors active table fields plus draft administrative fields (\`draftuuid\`, \`hasactiveentity\`).
- **\`%is_draft\` Flag**:
  - \`if_abap_behv=>mk-on\`: Operating on draft instance.
  - \`if_abap_behv=>mk-off\`: Operating on persisted active production instance.
- **\`Prepare\` Action**: Executes all validations during activation before swapping draft records into the active database table.`;
  }

  // Question 5: strict ( 2 )
  if (lower.includes('strict') || lower.includes('contract')) {
    return prefix + `### 🛡️ RAP Behavior Definition: \`strict ( 2 )\`

The \`strict ( 2 );\` statement is **mandatory** for Cloud-certified SAP RAP Business Objects in SAP S/4HANA Cloud and modern on-premise releases (2022+).

#### What Does \`strict ( 2 )\` Enforce?
1. **Total ETag Declaration**: Requires \`total etag <field>\` on lock master root entities to detect concurrency conflicts during draft activation.
2. **Read-Only / Mandatory Annotations**: BDEF annotations take strict precedence and are validated at compilation time.
3. **No Dynamic Operations**: Forbids un-typed or weakly-typed operational calls.
4. **Draft Safety**: Enforces explicit declaration of \`draft action Edit\`, \`draft action Activate\`, and \`draft action Discard\`.
5. **Clean Core Ready**: Guarantees zero unreleased APIs are called within the BO implementation pool.`;
  }

  // Question 6: React + OData V4 Integration
  if (lower.includes('react') || lower.includes('csrf') || lower.includes('odata')) {
    return prefix + `### ⚛️ React UI + SAP OData V4 Clean Core Integration

Connecting a custom React frontend to SAP S/4HANA OData V4 services requires two critical architectural steps:

#### 1. The Two-Step Security Handshake (CSRF)
SAP Gateway rejects any state-changing HTTP request (\`POST\`, \`PATCH\`, \`DELETE\`) unless authenticated with a fresh \`X-CSRF-Token\`.

\`\`\`javascript
// Step 1: Pre-flight GET request to fetch security token
async function fetchCsrfToken(serviceUrl) {
  const response = await fetch(serviceUrl, {
    method: 'GET',
    headers: {
      'X-CSRF-Token': 'Fetch',
      'Accept': 'application/json'
    },
    credentials: 'include'
  });
  return response.headers.get('X-CSRF-Token');
}

// Step 2: Stateful mutation with token attached
async function updateEmployee(empId, deltaChanges, csrfToken) {
  const response = await fetch(\`/sap/opu/odata4/sap/zui_emp_v4/srvd/sap/zui_employee/0001/Employee('\${empId}')\`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      'If-Match': '*'
    },
    body: JSON.stringify(deltaChanges)
  });
  return await response.json();
}
\`\`\`

#### 2. Key OData V4 Differences vs V2
- Payload collection data is in **\`response.value\`** (NOT \`response.d.results\`).
- Total count is in **\`response['@odata.count']\`** (NOT \`response.d.__count\`).
- Partial updates strictly use **\`PATCH\`** with only modified fields (NOT \`PUT\`).`;
  }

  // Default Architectural Guidance
  return prefix + `### 💡 SAP Technical Architect Insight

- **Clean Core Focus**: Always build extensions using released APIs and RAP BOs with \`strict ( 2 )\`. Avoid unreleased tables like \`BUT000\` or \`MARA\`.
- **Data Virtualization**: Use \`DEFINE VIEW ENTITY\` for Interface (\`ZI_*\`) and Projection (\`ZC_*\`) views.
- **Modern ABAP (7.57+)**: Use \`FINAL(...)\` for immutable declarations, \`VALUE #()\` for constructors, and \`REDUCE #()\` for table aggregations.
- **React Integration**: Connect via OData V4 using \`fetch()\`, remember the CSRF handshake, and handle delta updates with \`PATCH\`.`;
}
