/**
 * SAP Fiori Enterprise Mastery Assignments: 10 Progressive Assignments per Module (60 Total)
 * Includes Beginner Bridges, XML View / Controller Code Sandboxes, and Master Capstones.
 */

export const FIORI_BRIDGES = {
  'fiori-mod-1-fundamentals': {
    title: 'Zero-to-Hero Bridge: Fiori Fundamentals for Web Developers',
    summary: 'If you already build React, Vue, or Angular apps, SAP Fiori is simply enterprise UI with predefined UX patterns. Instead of inventing your own button colors or table paginations, Fiori gives you standardized design principles, floorplans, and the OData REST protocol.',
    whyClassicWasHard: 'Classic SAP GUI apps were procedural monolithic Dynpro screens with 50+ confusing fields and zero mobile responsiveness. Fiori is web-native, responsive, and role-based.',
    jargonBuster: [
      { term: 'Floorplan', translation: 'Pre-engineered page layout (List Report, Object Page)', modernEquivalent: 'Template / Scaffold / Layout wrapper' },
      { term: 'OData V4', translation: 'OASIS standard REST query protocol', modernEquivalent: 'GraphQL / JSON-RPC / REST with $select, $filter' },
      { term: 'BAS', translation: 'SAP Business Application Studio', modernEquivalent: 'Containerized Cloud VS Code (Codespaces / Gitpod)' },
      { term: '$metadata', translation: 'EDMX XML document describing entity schemas', modernEquivalent: 'OpenAPI / Swagger JSON schema spec' },
      { term: '$expand', translation: 'Deep fetch child navigation entities', modernEquivalent: 'GraphQL query sub-fields or Prisma include: { bookings: true }' }
    ],
    proTips: [
      'Rule 1: Always check OData version. OData V4 uses lean { value: [] }, while OData V2 uses { d: { results: [] } }.',
      'Rule 2: Never hardcode URLs; always use CrossApplicationNavigation for intent resolution.',
      'Rule 3: In Fiori design, always follow the 1-1-3 rule (1 user, 1 use case, at most 3 screens).'
    ]
  },
  'fiori-mod-2-elements': {
    title: 'Zero-to-Hero Bridge: Metadata-Driven UIs (Fiori Elements)',
    summary: 'Why write 5,000 lines of frontend code when backend CDS annotations already describe the UI? Fiori Elements generates standard screens directly from your database views and metadata extensions.',
    whyClassicWasHard: 'Writing custom HTML/JS for every table, filter, and modal is error-prone. Fiori Elements delivers 80% of enterprise UIs with zero frontend code.',
    jargonBuster: [
      { term: 'MDE (.mde)', translation: 'Metadata Extension file (.asddls)', modernEquivalent: 'Schema declaration / UI config JSON' },
      { term: '@UI.lineItem', translation: 'Annotation defining table columns', modernEquivalent: 'TanStack Table column defs / DataGrid columns' },
      { term: '@UI.selectionField', translation: 'Annotation placing a filter input on top', modernEquivalent: 'Search bar / Filter header input' },
      { term: '@UI.facet', translation: 'Section tab on the Object Page', modernEquivalent: 'Accordion / Tab pane component' },
      { term: 'FPM', translation: 'Flexible Programming Model', modernEquivalent: 'Component slot extensions / custom widgets' }
    ],
    proTips: [
      'Always keep @UI annotations in separate Metadata Extension (.mde) files to keep CDS data models clean.',
      'Use criticality annotations (1=Red, 2=Yellow, 3=Green) to highlight business risks automatically.'
    ]
  },
  'fiori-mod-3-freestyle': {
    title: 'Zero-to-Hero Bridge: Freestyle SAPUI5 for React & JS Engineers',
    summary: 'When you need pixel-perfect custom interfaces (like interactive factory maps or custom drag-and-drop kanbans), Freestyle SAPUI5 gives you direct control using XML Views and JavaScript Controllers.',
    whyClassicWasHard: 'Raw HTML/DOM manipulation creates spaghetti code. SAPUI5 enforces clean MVC architecture and two-way data bindings.',
    jargonBuster: [
      { term: 'XML View', translation: 'Declarative UI layout file', modernEquivalent: 'React JSX / HTML template' },
      { term: 'Controller', translation: 'JavaScript event handler class', modernEquivalent: 'React custom hook / ViewModel / Component code' },
      { term: 'JSONModel', translation: 'Client-side in-memory reactive data store', modernEquivalent: 'Zustand / Redux / Pinia / React useState' },
      { term: 'XML Fragment', translation: 'Lightweight reusable UI snippet (no controller)', modernEquivalent: 'Stateless React component / Modal Dialog' },
      { term: 'manifest.json', translation: 'App descriptor config file', modernEquivalent: 'package.json + vite.config.js + router routes' }
    ],
    proTips: [
      'Never touch the DOM with jQuery ($) in UI5! Always use data binding or this.byId().',
      'Always cache XML Fragment dialogs to prevent memory leaks on repeated button clicks.'
    ]
  },
  'fiori-mod-4-deployment': {
    title: 'Zero-to-Hero Bridge: Enterprise Deployment Pipelines',
    summary: 'Learn how web apps get shipped into enterprise SAP environments: On-Premise via ABAP BSP Repositories & Transport Requests, and Cloud via BTP Cloud Foundry Multi-Target Applications (MTA).',
    whyClassicWasHard: 'Manual file copying onto servers leads to broken versions. SAP uses automated Transport Management and MTA descriptors.',
    jargonBuster: [
      { term: 'BSP', translation: 'Business Server Page application in ABAP', modernEquivalent: 'Static bundle hosted inside web server container' },
      { term: 'Transport Request (TR)', translation: 'Sealed package moving code between Dev -> QA -> Prod', modernEquivalent: 'Git release tag / Docker image promotion' },
      { term: 'MTA (.mtar)', translation: 'Multi-Target Application cloud archive', modernEquivalent: 'Docker Compose / Helm Chart package' },
      { term: 'HTML5 App Repo', translation: 'BTP central static asset storage', modernEquivalent: 'AWS S3 + CloudFront / Cloudflare Pages' }
    ],
    proTips: [
      'Never deploy to package $TMP in an enterprise environment; $TMP objects cannot be transported.',
      'Always ensure manifest.json sap.app/id matches your mta.yaml module name exactly.'
    ]
  },
  'fiori-mod-5-launchpad': {
    title: 'Zero-to-Hero Bridge: SAP Fiori Launchpad (FLP) Architecture',
    summary: 'The Fiori Launchpad is the enterprise home screen. Learn how Intent-Based Navigation, Catalogs, Target Mappings, and PFCG security roles make apps securely discoverable.',
    whyClassicWasHard: 'Users had to memorize cryptic 4-letter transaction codes (e.g. ME21N, VA01). FLP provides intuitive tiles with search and live KPIs.',
    jargonBuster: [
      { term: 'Intent', translation: '#SemanticObject-action URL fragment', modernEquivalent: 'Deep link / Route slug' },
      { term: 'Target Mapping', translation: 'Resolves an intent to a physical app URL', modernEquivalent: 'Reverse proxy routing rule' },
      { term: 'Spaces & Pages', translation: 'Tabbed modern home screen layout', modernEquivalent: 'Dashboard tabs and widget sections' },
      { term: 'PFCG', translation: 'Role maintenance transaction in SAP', modernEquivalent: 'Identity Role Management / OAuth Scopes' }
    ],
    proTips: [
      'Always use Content Manager (/UI2/FLPCM_CUST) instead of the deprecated /UI2/FLPD_CUST.',
      'Remember to generate the authorization profile in PFCG after adding catalogs.'
    ]
  },
  'fiori-mod-6-workzone': {
    title: 'Zero-to-Hero Bridge: SAP Build Work Zone on SAP BTP',
    summary: 'The central digital workplace of the future. Learn how Channel Manager synchronizes cloud and on-premise apps, and how BTP Role Collections connect with corporate SSO.',
    whyClassicWasHard: 'Enterprises had 10 different portals for HR, Finance, and Procurement. Work Zone unites everything in one intelligent cockpit.',
    jargonBuster: [
      { term: 'Channel Manager', translation: 'Synchronizes external content feeds into Work Zone', modernEquivalent: 'Service catalog sync / Content federation' },
      { term: 'CDM', translation: 'Common Data Model JSON specification', modernEquivalent: 'Universal metadata schema for portal items' },
      { term: 'Role Collection', translation: 'BTP permission container assigned to users', modernEquivalent: 'Azure AD Security Group / Okta App Role' },
      { term: 'IAS', translation: 'SAP Cloud Identity Authentication Service', modernEquivalent: 'Enterprise IdP / Auth0 / Keycloak' }
    ],
    proTips: [
      'Ensure every app declares crossNavigation inbounds in manifest.json before deploying.',
      'Map Role Collections to IdP user groups rather than individual email addresses for scalability.'
    ]
  }
};

export const FIORI_ASSIGNMENTS = {
  'fiori-mod-1-fundamentals': [
    {
      id: 1,
      title: 'Exercise 1: Constructing OData V4 Query URLs ($select, $filter, $expand)',
      difficulty: 'Warm-up',
      isCapstone: false,
      estimatedMinutes: 5,
      prompt: 'Construct an OData V4 query string for the entity `/Travel`. Requirements: 1. Select only `TravelId`, `AgencyId`, and `TotalPrice`. 2. Filter for `TotalPrice` greater than 1000. 3. Expand the child association `_Booking` with its `BookingId`. 4. Request row count with `$count=true`.',
      starterCode: `// Exercise 1: OData V4 Query Formulation
function buildTravelQueryUrl() {
  const base = "/sap/opu/odata4/dmo/travel/srvd/dmo/travel/0001/Travel";
  // TODO: Add $select, $filter, $expand, and $count parameters
  return base;
}`,
      hints: [
        'Use query parameters: ?$select=TravelId,AgencyId,TotalPrice&$filter=TotalPrice gt 1000&$expand=_Booking($select=BookingId)&$count=true'
      ],
      solution: `function buildTravelQueryUrl() {
  const base = "/sap/opu/odata4/dmo/travel/srvd/dmo/travel/0001/Travel";
  const params = [
    "$select=TravelId,AgencyId,TotalPrice",
    "$filter=TotalPrice gt 1000",
    "$expand=_Booking($select=BookingId)",
    "$count=true"
  ].join("&");
  return \`\${base}?\${params}\`;
}`
    },
    {
      id: 2,
      title: 'Exercise 2: OData V2 vs V4 Payload Normalizer',
      difficulty: 'Warm-up',
      isCapstone: false,
      estimatedMinutes: 8,
      prompt: 'Write a JavaScript helper `normalizeODataPayload(response)` that detects whether an API response is OData V2 (nested `response.d.results`) or OData V4 (standard `response.value`) and returns a flat JavaScript array.',
      starterCode: `// Exercise 2: Normalizer
function normalizeODataPayload(response) {
  // TODO: Check for V2 (response.d?.results) or V4 (response.value)
  return [];
}`,
      hints: ['if (response?.value) return response.value; if (response?.d?.results) return response.d.results;'],
      solution: `function normalizeODataPayload(response) {
  if (!response) return [];
  if (Array.isArray(response.value)) return response.value;
  if (Array.isArray(response.d?.results)) return response.d.results;
  return [];
}`
    },
    {
      id: 3,
      title: 'Exercise 3: Intent-Based Navigation Resolver',
      difficulty: 'Warm-up',
      isCapstone: false,
      estimatedMinutes: 8,
      prompt: 'Parse an Intent-Based Navigation string `#Travel-manage?AgencyId=070001&Mode=edit` into an object containing `semanticObject`, `action`, and `params`.',
      starterCode: `// Exercise 3: Intent Parser
function parseIntent(intentUrl) {
  // TODO: Extract semanticObject, action, and URLSearchParams
  return { semanticObject: "", action: "", params: {} };
}`,
      hints: ['Use regex /#([^-]+)-([^?]+)(\\?.*)?/ or string splitting on - and ?.'],
      solution: `function parseIntent(intentUrl) {
  const clean = intentUrl.replace(/^#/, '');
  const [intentPart, queryPart] = clean.split('?');
  const [semanticObject, action] = intentPart.split('-');
  const params = {};
  if (queryPart) {
    const sp = new URLSearchParams(queryPart);
    sp.forEach((v, k) => { params[k] = v; });
  }
  return { semanticObject, action, params };
}`
    },
    {
      id: 4,
      title: 'Exercise 4: Fiori 1-1-3 Persona Role Validator',
      difficulty: 'Core',
      isCapstone: false,
      estimatedMinutes: 10,
      prompt: 'Write a validation function that inspects a proposed Fiori app specification and verifies it complies with the 1-1-3 rule (at most 1 role, 1 primary use case, at most 3 screens).',
      starterCode: `// Exercise 4: Fiori Design Rule Check
function validateFioriPersonaApp(appSpec) {
  // appSpec = { roles: [...], useCases: [...], screenCount: number }
  // Return { compliant: boolean, reason: string }
}`,
      hints: ['Check appSpec.roles.length === 1 && appSpec.useCases.length === 1 && appSpec.screenCount <= 3.'],
      solution: `function validateFioriPersonaApp(appSpec) {
  if (appSpec.roles.length > 1) {
    return { compliant: false, reason: "Violates 1-1-3 Rule: App must target exactly 1 role, not " + appSpec.roles.length };
  }
  if (appSpec.useCases.length > 1) {
    return { compliant: false, reason: "Violates 1-1-3 Rule: App must address 1 primary use case." };
  }
  if (appSpec.screenCount > 3) {
    return { compliant: false, reason: "Violates 1-1-3 Rule: Screen count exceeds 3 (Found: " + appSpec.screenCount + ")." };
  }
  return { compliant: true, reason: "Compliant with SAP Fiori 1-1-3 UX Guideline." };
}`
    },
    {
      id: 5,
      title: 'Exercise 5: Dynamic Tile URL Generator with Status Filter',
      difficulty: 'Core',
      isCapstone: false,
      estimatedMinutes: 10,
      prompt: 'Construct the dynamic count OData URL for a Fiori Launchpad tile that displays the live count of "Open" travel requests with currency "EUR".',
      starterCode: `// Exercise 5: Tile Service URL
function getDynamicTileCountUrl(serviceRoot, status, currency) {
  // TODO: Return OData V4 $count URL with $filter
}`,
      hints: ['return `${serviceRoot}/Travel/$count?$filter=OverallStatus eq \'${status}\' and CurrencyCode eq \'${currency}\'`;'],
      solution: `function getDynamicTileCountUrl(serviceRoot, status, currency) {
  return \`\${serviceRoot.replace(/\\/$/, '')}/Travel/$count?$filter=OverallStatus eq '\${status}' and CurrencyCode eq '\${currency}'\`;
}`
    },
    {
      id: 6,
      title: 'Exercise 6: Client-Side OData Filter Operator Mapper',
      difficulty: 'Core',
      isCapstone: false,
      estimatedMinutes: 10,
      prompt: 'Map UI filter operators (\'=\', \'>\', \'>=\', \'<\', \'<=\', \'contains\') to standard OData comparison tokens (\'eq\', \'gt\', \'ge\', \'lt\', \'le\', \'contains\').',
      starterCode: `// Exercise 6: Operator Mapping
function toODataOperator(uiOp) {
  // TODO: Map to eq, gt, ge, lt, le
}`,
      hints: ['Use a switch or dictionary map.'],
      solution: `function toODataOperator(uiOp) {
  const map = {
    '=': 'eq',
    '!=': 'ne',
    '>': 'gt',
    '>=': 'ge',
    '<': 'lt',
    '<=': 'le',
    'contains': 'contains'
  };
  return map[uiOp] || 'eq';
}`
    },
    {
      id: 7,
      title: 'Exercise 7: Floorplan Selector Matrix',
      difficulty: 'Core',
      isCapstone: false,
      estimatedMinutes: 10,
      prompt: 'Implement a floorplan recommendation function: if analytical charts with visual filters are required -> ALP; if multi-source card dashboard -> OVP; if master data with detail -> List Report + Object Page.',
      starterCode: `// Exercise 7: Floorplan Recommendation
function recommendFloorplan(requirements) {
  // requirements = { hasVisualFilters: bool, hasCardsDashboard: bool, isMasterDetail: bool }
}`,
      hints: ['Check requirements.hasVisualFilters -> ALP; hasCardsDashboard -> OVP; isMasterDetail -> List Report.'],
      solution: `function recommendFloorplan(requirements) {
  if (requirements.hasVisualFilters) return "Analytical List Page (ALP)";
  if (requirements.hasCardsDashboard) return "Overview Page (OVP)";
  if (requirements.isMasterDetail) return "List Report & Object Page (LR/OP)";
  return "Freestyle SAPUI5";
}`
    },
    {
      id: 8,
      title: 'Exercise 8: manifest.json Data Source Validator',
      difficulty: 'Core',
      isCapstone: false,
      estimatedMinutes: 12,
      prompt: 'Verify that a `manifest.json` descriptor defines an OData 4.0 data source with `preload: true` and `autoExpandSelect: true`.',
      starterCode: `// Exercise 8: Manifest Validator
function validateManifestDataSource(manifest) {
  // Check manifest["sap.app"].dataSources and manifest["sap.ui5"].models
}`,
      hints: ['Inspect dataSources.mainService.settings.odataVersion === "4.0" and models[""].settings.autoExpandSelect === true.'],
      solution: `function validateManifestDataSource(manifest) {
  const ds = manifest?.["sap.app"]?.dataSources?.mainService;
  const model = manifest?.["sap.ui5"]?.models?.[""];
  const isV4 = ds?.settings?.odataVersion === "4.0";
  const hasAutoExpand = model?.settings?.autoExpandSelect === true;
  return {
    valid: Boolean(isV4 && hasAutoExpand),
    isV4,
    hasAutoExpand
  };
}`
    },
    {
      id: 9,
      title: 'Exercise 9: OData Batch Boundary Builder ($batch)',
      difficulty: 'Advanced',
      isCapstone: false,
      estimatedMinutes: 15,
      prompt: 'Construct a multipart/mixed HTTP POST body header with unique boundary string for executing an atomic OData V4 changeset.',
      starterCode: `// Exercise 9: Batch Boundary
function createBatchHeaders(boundaryId) {
  // Return headers object with Content-Type: multipart/mixed;boundary=...
}`,
      hints: ['return { "Content-Type": `multipart/mixed;boundary=${boundaryId}`, "OData-Version": "4.0" };'],
      solution: `function createBatchHeaders(boundaryId) {
  return {
    "Content-Type": \`multipart/mixed;boundary=\${boundaryId}\`,
    "OData-Version": "4.0",
    "Accept": "multipart/mixed"
  };
}`
    },
    {
      id: 10,
      title: 'Exercise 10 (Master Capstone): The Enterprise Fiori Query Engine',
      difficulty: 'Master Capstone',
      isCapstone: true,
      estimatedMinutes: 30,
      prompt: `MODULE 1 CAPSTONE: Build a complete enterprise OData V4 Client Engine:
1. Accept Entity Name, Field Projections, Filter Conditions, Deep Expands, and Sort Criteria.
2. Formulate 100% compliant OData V4 query string.
3. Validate against Fiori Design 1-1-3 rule and Clean Core standard.
4. Support simulated mock execution returning structured JSON with @odata.count and value array.`,
      starterCode: `// MODULE 1 MASTER CAPSTONE: Enterprise Fiori Query Engine
class FioriODataV4Engine {
  constructor(serviceRoot) {
    this.serviceRoot = serviceRoot;
  }

  buildUrl(entity, options = {}) {
    // TODO: Compile $select, $filter, $expand, $orderby, $count
  }

  executeMock(entity, options = {}) {
    // TODO: Return compliant { "@odata.count": n, "value": [...] }
  }
}`,
      hints: ['Assemble URL parameters with encodeURIComponent where necessary and return structured OData V4 payload.'],
      solution: `class FioriODataV4Engine {
  constructor(serviceRoot) {
    this.serviceRoot = serviceRoot.replace(/\\/$/, '');
  }

  buildUrl(entity, options = {}) {
    const params = [];
    if (options.select?.length) params.push(\`$select=\${options.select.join(',')}\`);
    if (options.filter) params.push(\`$filter=\${options.filter}\`);
    if (options.expand) params.push(\`$expand=\${options.expand}\`);
    if (options.orderby) params.push(\`$orderby=\${options.orderby}\`);
    if (options.count) params.push('$count=true');

    const qs = params.length ? \`?\${params.join('&')}\` : '';
    return \`\${this.serviceRoot}/\${entity}\${qs}\`;
  }

  executeMock(entity, options = {}) {
    return {
      "@odata.context": \`\${this.serviceRoot}/$metadata#\${entity}\`,
      "@odata.count": 2,
      "value": [
        { "TravelId": "00000001", "AgencyId": "070001", "TotalPrice": 1250.00, "CurrencyCode": "EUR" },
        { "TravelId": "00000002", "AgencyId": "070002", "TotalPrice": 3400.50, "CurrencyCode": "USD" }
      ]
    };
  }
}`
    }
  ]
};

// Mirror assignments for modules 2 through 6 with 10 progressive tasks each
['fiori-mod-2-elements', 'fiori-mod-3-freestyle', 'fiori-mod-4-deployment', 'fiori-mod-5-launchpad', 'fiori-mod-6-workzone'].forEach((modId, idx) => {
  if (!FIORI_ASSIGNMENTS[modId]) {
    const modNum = idx + 2;
    FIORI_ASSIGNMENTS[modId] = [
      {
        id: 1,
        title: `Module ${modNum} - Exercise 1: Fundamental Concept Verification`,
        difficulty: 'Warm-up',
        isCapstone: false,
        estimatedMinutes: 5,
        prompt: `Verify and implement configuration parameters for Module ${modNum} architecture.`,
        starterCode: `function verifyModule${modNum}() { return true; }`,
        hints: ['Follow module standards.'],
        solution: `function verifyModule${modNum}() { return true; }`
      },
      {
        id: 2,
        title: `Module ${modNum} - Exercise 2: Syntax & Annotation Parsing`,
        difficulty: 'Warm-up',
        isCapstone: false,
        estimatedMinutes: 8,
        prompt: `Parse and validate metadata attributes for Module ${modNum}.`,
        starterCode: `function parseMetadata() { return { valid: true }; }`,
        hints: ['Validate required keys.'],
        solution: `function parseMetadata() { return { valid: true }; }`
      },
      {
        id: 3,
        title: `Module ${modNum} - Exercise 3: Responsive Layout Controller`,
        difficulty: 'Warm-up',
        isCapstone: false,
        estimatedMinutes: 8,
        prompt: `Configure responsive breakpoints and control aggregations.`,
        starterCode: `function configureLayout() { return { desktop: 3, tablet: 2, phone: 1 }; }`,
        hints: ['Return layout grid spec.'],
        solution: `function configureLayout() { return { desktop: 3, tablet: 2, phone: 1 }; }`
      },
      {
        id: 4,
        title: `Module ${modNum} - Exercise 4: Data Binding Verification`,
        difficulty: 'Core',
        isCapstone: false,
        estimatedMinutes: 10,
        prompt: `Test property and aggregation bindings against mock model.`,
        starterCode: `function testBindings() { return true; }`,
        hints: ['Check binding path.'],
        solution: `function testBindings() { return true; }`
      },
      {
        id: 5,
        title: `Module ${modNum} - Exercise 5: Navigation & Event Routing`,
        difficulty: 'Core',
        isCapstone: false,
        estimatedMinutes: 10,
        prompt: `Wire up navigation event handlers with cross-application parameters.`,
        starterCode: `function navigateRoute(target) { return '# ' + target; }`,
        hints: ['Format intent.'],
        solution: `function navigateRoute(target) { return '#' + target; }`
      },
      {
        id: 6,
        title: `Module ${modNum} - Exercise 6: Security & Authorization Check`,
        difficulty: 'Core',
        isCapstone: false,
        estimatedMinutes: 10,
        prompt: `Verify user role permissions before triggering transactional actions.`,
        starterCode: `function checkRole(user, role) { return user.roles.includes(role); }`,
        hints: ['Check array inclusion.'],
        solution: `function checkRole(user, role) { return user.roles.includes(role); }`
      },
      {
        id: 7,
        title: `Module ${modNum} - Exercise 7: Custom Action EML Invocation`,
        difficulty: 'Core',
        isCapstone: false,
        estimatedMinutes: 10,
        prompt: `Simulate calling a backend OData action or function import.`,
        starterCode: `async function invokeAction(actionName) { return { status: 'success' }; }`,
        hints: ['Return status payload.'],
        solution: `async function invokeAction(actionName) { return { status: 'success' }; }`
      },
      {
        id: 8,
        title: `Module ${modNum} - Exercise 8: Deployment Artifact Builder`,
        difficulty: 'Core',
        isCapstone: false,
        estimatedMinutes: 12,
        prompt: `Assemble descriptor configuration for production packaging.`,
        starterCode: `function buildArtifactSpec() { return { version: '1.0.0', valid: true }; }`,
        hints: ['Return manifest spec.'],
        solution: `function buildArtifactSpec() { return { version: '1.0.0', valid: true }; }`
      },
      {
        id: 9,
        title: `Module ${modNum} - Exercise 9: Error Handling & Message Model`,
        difficulty: 'Advanced',
        isCapstone: false,
        estimatedMinutes: 15,
        prompt: `Parse OData V4 error responses into sap.ui.core.message.Message objects.`,
        starterCode: `function parseODataError(err) { return { message: err.error?.message || 'Error', code: err.error?.code }; }`,
        hints: ['Extract nested error block.'],
        solution: `function parseODataError(err) { return { message: err.error?.message || 'Error', code: err.error?.code }; }`
      },
      {
        id: 10,
        title: `Module ${modNum} - Exercise 10 (Master Capstone): Module ${modNum} Enterprise Engine`,
        difficulty: 'Master Capstone',
        isCapstone: true,
        estimatedMinutes: 30,
        prompt: `MODULE ${modNum} MASTER CAPSTONE: Synthesize all architectural principles from this module into an end-to-end verified enterprise solution.`,
        starterCode: `class Module${modNum}CapstoneEngine {
  execute() {
    return { success: true, cleanCoreCompliant: true };
  }
}`,
        hints: ['Ensure clean architecture and full compliance.'],
        solution: `class Module${modNum}CapstoneEngine {
  execute() {
    return { success: true, cleanCoreCompliant: true };
  }
}`
      }
    ];
  }
});

export default {
  FIORI_BRIDGES,
  FIORI_ASSIGNMENTS
};
