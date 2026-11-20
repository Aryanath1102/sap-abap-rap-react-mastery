/**
 * SAP Fiori Enterprise Mastery Curriculum: 6 In-Depth Modules
 * Covers Fiori Fundamentals, Fiori Elements, Freestyle SAPUI5,
 * Deployment (On-Premise & BTP), Fiori Launchpad (FLP), and SAP Build Work Zone.
 */

import { FIORI_ASSIGNMENTS, FIORI_BRIDGES } from './fioriAssignments';

const BASE_FIORI_LESSONS = [
  // =========================================================================
  // MODULE 1: FIORI FUNDAMENTALS & TOOLING
  // =========================================================================
  {
    id: 'fiori-mod-1-fundamentals',
    day: 1,
    track: 'fiori',
    title: 'Module 1: Fiori Fundamentals & Tooling',
    subtitle: 'Design Principles, Standard Floorplans, Development Tools (BAS & VS Code), and OData Protocol (V2 vs V4)',
    readTime: '20 min read',
    vlogHook: "Welcome to the SAP Fiori Track! In modern enterprise IT, users demand consumer-grade web apps. SAP Fiori is the design system and user experience framework powering SAP S/4HANA and SAP BTP. Today we break down the 5 design principles, the standard floorplans, the modern tooling stack (BAS & VS Code), and master OData V2 vs OData V4 query semantics ($metadata, $filter, $select, $expand).",
    layman: "Think of SAP Fiori as the enterprise equivalent of Apple's Human Interface Guidelines or Google's Material Design. Before Fiori, SAP screens were massive, cluttered 100-field forms (SAP GUI). Fiori cuts away the clutter: one screen for one specific role, working beautifully on desktop, tablet, and smartphone.",
    technical: "SAP Fiori is grounded on open web standards: HTML5, CSS3, JavaScript, and the OData REST protocol. Standard floorplans (List Report, Object Page, Overview Page, Analytical List Page) are implemented either through metadata-driven SAP Fiori Elements or code-driven Freestyle SAPUI5. Tooling is anchored in SAP Business Application Studio (BAS) and VS Code with the SAP Fiori Tools extension pack.",

    deepDiveKeywords: [
      {
        name: '1.1 SAP Fiori Design Principles & Application Types',
        sapDocRef: 'SAP Fiori Design Guidelines: Five Core Principles & App Archetypes',
        syntax: `/* The 5 Pillars of SAP Fiori Design:
 1. Role-Based: Designed for specific tasks and personas (Buyer, Approver, Warehouse Clerk).
 2. Adaptive: Responsive across Desktop (1920px), Tablet (1024px), and Mobile (375px).
 3. Coherent: Consistent visual hierarchy, theme (Morning Horizon / Quartz Light), and interaction.
 4. Simple: 1-1-3 Rule (1 user, 1 use case, at most 3 screens).
 5. Delightful: Micro-animations, instant feedback, and seamless performance. */

// Application Types:
// - Transactional Apps: CRUD operations, master-detail editing (e.g., Manage Purchase Orders)
// - Analytical Apps: KPI cards, charts, multidimensional drill-downs (e.g., Procurement Spend Analysis)
// - Fact Sheets: Read-only 360-degree object views with contextual links (e.g., Supplier 360 View)`,
        laymanAnalogy: 'Think of Fiori like specialized smartphone apps. Instead of opening a gigantic desktop spreadsheet with 50 tabs, a warehouse worker has one 2-button app to scan barcodes, while a financial director has a dashboard app with revenue KPI dials.',
        technicalDefinition: `SAP Fiori enforces a persona-centric application taxonomy:
1. Transactional Apps: Optimized for fast task execution with transactional buffers and draft handling.
2. Analytical Apps: Built on SAP HANA Calculation Views or Analytical CDS View Entities, executing real-time aggregations.
3. Fact Sheets: Searchable via SAP Enterprise Search, providing contextual cross-navigation between business objects.`,
        underTheHood: `Fiori apps render using the sap.m mobile-first responsive control library. Layout managers dynamically collapse columns and transform tables into responsive lists when viewport width drops below 768px.`,
        commonPitfall: `Building "mega-apps": Attempting to recreate a legacy 50-tab SAP GUI transaction inside a single Fiori app. Always break complex workflows into discrete role-based apps connected via Intent-Based Navigation (CrossApplicationNavigation).`,
        modernExample: `<!-- Sample sap.m.Page adhering to Fiori Design Standard -->
<mvc:View
  xmlns:mvc="sap.ui.core.mvc"
  xmlns="sap.m"
  controllerName="fiori.demo.controller.Main">
  <Page
    title="{i18n>appTitle}"
    showNavButton="false">
    <headerContent>
      <Button icon="sap-icon://action" tooltip="{i18n>shareBtn}" />
    </headerContent>
    <content>
      <!-- Single clean role-based metric card -->
      <GenericTile
        header="{i18n>pendingApprovals}"
        subheader="{i18n>urgentPOs}"
        press=".onPressTile">
        <TileContent unit="EUR">
          <NumericContent value="14" state="Critical" icon="sap-icon://travel-expense" />
        </TileContent>
      </GenericTile>
    </content>
  </Page>
</mvc:View>`,
        springBootBridge: {
          explanation: 'In web architecture, Fiori Design Principles are UX design tokens and atomic design patterns. Transactional apps are REST CRUD forms; Analytical apps are Grafana/Chart.js KPI dashboards.',
          springBootCode: `// Spring Boot REST Controller serving Fiori Transactional App:
@RestController
@RequestMapping("/api/v1/purchase-orders")
public class PurchaseOrderController {
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderDTO> getOrder(@PathVariable String id) {
        return ResponseEntity.ok(orderService.findOrderForRole(id, Role.BUYER));
    }
}`,
          expressCode: `// Express.js route serving Fiori App:
app.get('/api/v1/purchase-orders/:id', authMiddleware(['BUYER']), async (req, res) => {
  const order = await orderService.getForRole(req.params.id, req.user.role);
  res.json(order);
});`
        }
      },
      {
        name: '1.2 Standard Floorplans: List Report, Object Page, Overview Page & ALP',
        sapDocRef: 'SAP Fiori Design Guidelines: Standard Floorplan Patterns',
        syntax: `/* Standard SAP Fiori Floorplans:
 1. List Report (LR):
    Filter bar on top (@UI.selectionField) + Interactive table below (@UI.lineItem).
 2. Object Page (OP):
    Rich header (@UI.headerInfo) + Tabbed or scrolling facets (@UI.facet) for child entities.
 3. Overview Page (OVP):
    Interactive dashboard of cards (List, Table, Bar Chart, KPI) aggregating multiple sources.
 4. Analytical List Page (ALP):
    Combines visual filters, interactive micro-charts, and tabular data with drill-downs. */`,
        laymanAnalogy: 'Think of List Report + Object Page like Amazon: The List Report is the search results page with filters on the side/top; clicking a product opens the Object Page with images, reviews, specs, and the "Buy Now" button.',
        technicalDefinition: `SAP Fiori floorplans are pre-engineered UI patterns optimized for enterprise tasks:
- List Report (LR): Standard entry point for master data and document management.
- Object Page (OP): Unified object viewer supporting Draft states, navigation tabs, and child tables.
- Overview Page (OVP): Card-driven dashboard driven by OData annotations.
- Analytical List Page (ALP): High-density data analysis interface combining visual filter bars with chart/table hybrid layouts.`,
        underTheHood: `In Fiori Elements, floorplans are generated dynamically from CDS annotations at runtime by the sap.fe.core template engine, requiring zero lines of JavaScript code.`,
        commonPitfall: `Hand-crafting custom tables and headers for simple CRUD entities. If your requirements fit a standard List Report and Object Page, always use SAP Fiori Elements instead of Freestyle UI5.`,
        modernExample: `/* CDS View Entity defining a List Report & Object Page Floorplan */
@UI.headerInfo: {
  typeName: 'Travel',
  typeNamePlural: 'Travels',
  title: { type: #STANDARD, value: 'TravelId' },
  description: { value: 'Description' }
}
define view entity ZC_Travel_LR
  as projection on ZI_Travel
{
  @UI.facet: [
    { id: 'GeneralData', purpose: #STANDARD, type: #IDENTIFICATION_REFERENCE, label: 'General Info', position: 10 },
    { id: 'Bookings', purpose: #STANDARD, type: #LINEITEM_REFERENCE, label: 'Bookings', position: 20, targetElement: '_Booking' }
  ]
  @UI.selectionField: [{ position: 10 }]
  @UI.lineItem: [{ position: 10 }]
  key TravelId,
  @UI.lineItem: [{ position: 20 }]
  AgencyId
}`,
        springBootBridge: {
          explanation: 'List Report is React TanStack Table with filtering; Object Page is Detail view with tabbed child grids.',
          springBootCode: `// Java DTO with OpenAPI metadata mapping to Floorplan annotations:
public record TravelListReportDTO(
    @Schema(description = "Travel Primary Key") String travelId,
    @Schema(description = "Customer ID") String customerId,
    @Schema(description = "Total Payout") BigDecimal totalPrice
) {}`,
          expressCode: `// Express schema definition for List Report endpoint:
const travelListSchema = {
  travelId: { type: 'string', filterable: true, sortable: true },
  totalPrice: { type: 'number', filterable: true }
};`
        }
      },
      {
        name: '1.3 Development Environment: Business Application Studio (BAS) & VS Code',
        sapDocRef: 'SAP Fiori Tools Documentation: Setup, CLI & Generators',
        syntax: `# Terminal commands for SAP Fiori development:
npm install -g @sap/fiori-tools @sap/generator-fiori-elements yo

# Launch Fiori Application Generator:
yo @sap/fiori-elements

# Preview local app with live mock server or remote backend:
npm run start
npm run start-mock

# Build production bundle (minified & component preload):
npm run build`,
        laymanAnalogy: 'Just like React developers use Create-React-App or Vite + VS Code extensions, SAP developers use SAP Fiori Tools inside VS Code or SAP Business Application Studio (a cloud version of VS Code hosted on SAP BTP).',
        technicalDefinition: `SAP Business Application Studio (BAS) is an SAP BTP service providing containerized development workspaces pre-configured with Node.js, CDS compiler, UI5 tooling, and Cloud Foundry CLI. In local VS Code, the "SAP Fiori Tools" extension pack provides the Page Map, Guided Development, Service Modeler, and Application Generator.`,
        underTheHood: `The UI5 Tooling CLI (\`@ui5/cli\`) compiles XML views, transpiles modern JavaScript/TypeScript, and generates \`Component-preload.js\` containing all application resources compressed into a single payload to eliminate multiple HTTP network round-trips.`,
        commonPitfall: `Editing generated \`Component-preload.js\` or \`manifest.json\` by hand without understanding the UI5 build pipeline. Always configure paths and proxy settings in \`ui5.yaml\` and \`ui5-mock.yaml\`.`,
        modernExample: `# ui5.yaml - SAP Fiori Development Server Configuration
specVersion: "3.0"
metadata:
  name: ztravel_fiori_app
type: application
server:
  customMiddleware:
    - name: fiori-tools-proxy
      afterMiddleware: compression
      configuration:
        backend:
          - path: /sap/opu/odata4/dmo/sb_travel/srvd/dmo/travel/0001/
            url: https://my-s4hana-system.corp:44300
            client: "100"
    - name: fiori-tools-appreload
      afterMiddleware: compression`,
        springBootBridge: {
          explanation: 'ui5.yaml is the vite.config.js or application.yml of SAP UI5. fiori-tools-proxy is identical to Vite or Webpack devServer proxying backend API requests.',
          springBootCode: `// Spring Boot application.yml CORS proxy config:
management:
  endpoints:
    web:
      cors:
        allowed-origins: "http://localhost:8080"
        allowed-methods: "GET,POST,PUT,DELETE"`,
          expressCode: `// Express.js development proxy middleware:
import { createProxyMiddleware } from 'http-proxy-middleware';
app.use('/sap/opu/odata4', createProxyMiddleware({ target: 'https://s4hana:44300', changeOrigin: true }));`
        }
      },
      {
        name: '1.4 OData Protocol Basics: V2 vs V4, $metadata, $filter, $select, $expand',
        sapDocRef: 'OASIS OData Standard V4.01 Specification & SAP OData V4 Model',
        syntax: `/* OData V4 Query Semantics:
1. Metadata Document (Schema & Annotations):
   GET /sap/opu/odata4/dmo/travel/srvd/dmo/travel/0001/$metadata

2. Projections & Filtering:
   GET /Travel?$select=TravelId,AgencyId,TotalPrice&$filter=TotalPrice gt 500

3. Deep Expand (Child Navigation):
   GET /Travel?$expand=_Booking($select=BookingId,FlightDate)

4. OData V2 vs OData V4 Differences:
   - Payload: V2 uses verbose d: { results: [] }; V4 uses lean { value: [] }.
   - Batching: V4 uses multipart/mixed $batch with atomic changesets by default.
   - Paging: V2 uses $inlinecount=allpages; V4 uses $count=true. */`,
        laymanAnalogy: 'Think of OData as a standardized REST API specification that gives you GraphQL superpowers without needing GraphQL! With simple URL query parameters (`$select`, `$filter`, `$expand`), the frontend can ask the backend for exact columns, child relationships, and sorted slices in one request.',
        technicalDefinition: `OData (Open Data Protocol) is an OASIS standard REST API protocol. SAP S/4HANA and RAP use OData V4 for modern web and mobile apps. OData V4 eliminates the nested JSON wrappers of V2, supports structured types, provides server-driven paging with \`@odata.nextLink\`, and enables asynchronous operations through \`Prefer: respond-async\`.`,
        underTheHood: `When the SAP Fiori app sends \`$filter=TotalPrice gt 500\`, the SAP Gateway framework translates the OData AST directly into an Open SQL / HANA SQL WHERE clause, pushing execution down into the database layer.`,
        commonPitfall: `Using OData V2 syntax in OData V4 apps (e.g. typing \`$inlinecount=allpages\` instead of \`$count=true\`). The OData V4 service will return HTTP 400 Bad Request.`,
        modernExample: `// Consuming OData V4 in SAPUI5 Controller:
onSearchTravels: function(oEvent) {
  const oTable = this.byId("travelsTable");
  const oBinding = oTable.getBinding("items");

  // Create OData V4 Filter:
  const oFilter = new sap.ui.model.Filter({
    path: "TotalPrice",
    operator: sap.ui.model.FilterOperator.GT,
    value1: 1000
  });

  // Apply filter - triggers GET /Travel?$filter=TotalPrice gt 1000
  oBinding.filter([oFilter]);
}`,
        springBootBridge: {
          explanation: 'OData is Spring Data REST or GraphQL queries translated into SQL query parameters ($filter -> JPA Specification, $expand -> JPA JOIN FETCH).',
          springBootCode: `// Spring Data JPA Specification mapping OData $filter:
public Specification<Travel> filterByPriceGreaterThan(BigDecimal minPrice) {
    return (root, query, cb) -> cb.greaterThan(root.get("totalPrice"), minPrice);
}`,
          expressCode: `// Express query parser mapping OData parameters:
const minPrice = parseFloat(req.query.$filter?.match(/gt (\\d+)/)?.[1]);
if (minPrice) query.where = { totalPrice: { [Op.gt]: minPrice } };`
        }
      }
    ],

    showdown: {
      title: 'Architectural Showdown: OData V2 vs OData V4 in Modern Fiori Development',
      verdict: 'OData V4 is the modern standard for SAP Fiori and Clean Core applications. It reduces JSON payload size by up to 40%, introduces native draft support, and unifies metadata annotations with ABAP RAP CDS Views.',
      elementA: {
        name: 'OData V2 (Legacy Gateway Architecture)',
        syntax: `GET /sap/opu/odata/sap/ZTRAVEL_SRV/TravelSet?$filter=TotalPrice%20gt%20500&$inlinecount=allpages
Response:
{
  "d": {
    "results": [
      {
        "__metadata": { "id": "...", "uri": "..." },
        "TravelId": "00000001",
        "TotalPrice": "1200.00"
      }
    ],
    "__count": "1"
  }
}`,
        pros: ['Supported by legacy pre-1909 ECC and older S/4HANA systems', 'Massive collection of legacy tutorials'],
        cons: ['Verbose payload with __metadata duplicates on every row', 'Draft handling requires complex custom orchestrations', 'Inflexible batch processing']
      },
      elementB: {
        name: 'OData V4 (Modern Clean Core Standard)',
        syntax: `GET /sap/opu/odata4/dmo/travel/srvd/dmo/travel/0001/Travel?$filter=TotalPrice gt 500&$count=true
Response:
{
  "@odata.count": 1,
  "value": [
    {
      "TravelId": "00000001",
      "TotalPrice": 1200.00
    }
  ]
}`,
        pros: ['Lean JSON payload without __metadata pollution', 'Native SAP RAP Draft orchestration built into protocol', 'Advanced navigation and deep $expand query trees', 'First-class support in SAP Fiori Elements V4'],
        cons: ['Requires S/4HANA 1909+ or SAP BTP ABAP Environment']
      },
      comparisonTable: [
        { feature: 'JSON Payload Format', elementA: 'Verbose nested { d: { results: [] } }', elementB: 'Lean standard { value: [] }', winner: 'OData V4' },
        { feature: 'Row Count Syntax', elementA: '$inlinecount=allpages', elementB: '$count=true', winner: 'OData V4' },
        { feature: 'Draft Coordination', elementA: 'Custom implementation required', elementB: 'Built-in protocol standard', winner: 'OData V4' },
        { feature: 'RAP Integration', elementA: 'Requires V2 adapter bridge', elementB: 'Native 1-to-1 Service Binding', winner: 'OData V4' }
      ]
    },

    files: [
      {
        path: 'webapp/manifest.json',
        language: 'json',
        description: 'Application descriptor configuring OData V4 Data Source',
        code: `{
  "_version": "1.58.0",
  "sap.app": {
    "id": "fiori.travel.manage",
    "type": "application",
    "dataSources": {
      "mainService": {
        "uri": "/sap/opu/odata4/dmo/travel/srvd/dmo/travel/0001/",
        "type": "OData",
        "settings": {
          "odataVersion": "4.0"
        }
      }
    }
  },
  "sap.ui5": {
    "models": {
      "": {
        "dataSource": "mainService",
        "preload": true,
        "settings": {
          "synchronizationMode": "None",
          "operationMode": "Server",
          "autoExpandSelect": true,
          "earlyRequests": true
        }
      }
    }
  }
}`
      }
    ]
  },

  // =========================================================================
  // MODULE 2: SAP FIORI ELEMENTS (METADATA-DRIVEN UI)
  // =========================================================================
  {
    id: 'fiori-mod-2-elements',
    day: 2,
    track: 'fiori',
    title: 'Module 2: SAP Fiori Elements (Metadata-Driven UI)',
    subtitle: 'App Generation, Metadata Extensions (MDE), Core @UI Annotations, Value Helps, and the Flexible Programming Model',
    readTime: '22 min read',
    vlogHook: "Why write 5,000 lines of frontend code when your backend CDS views already know what fields to show? SAP Fiori Elements turns your ABAP CDS annotations directly into a world-class UI automatically! Today we explore the SAP Fiori Application Generator, author Metadata Extensions (.mde), configure @UI annotations, wire up Value Helps, and harness the Flexible Programming Model for custom actions and sections.",
    layman: "Think of Fiori Elements like a 3D printer for web apps. In traditional web development, you write HTML, CSS, table components, pagination, and modals manually. In Fiori Elements, your backend data model contains the blueprint (annotations), and the Fiori engine prints the working web app automatically!",
    technical: "Fiori Elements generates standard floorplans at runtime using OData V4 metadata and Vocabulary annotations (UI, Common, Communication). By segregating UI annotations into Metadata Extensions (.asddls MDE files), Clean Core separation of business data from presentation logic is preserved. The Flexible Programming Model allows developers to seamlessly blend custom SAPUI5 views into Fiori Elements pages.",

    deepDiveKeywords: [
      {
        name: '2.1 App Generation via SAP Fiori Application Generator',
        sapDocRef: 'SAP Fiori Tools: Application Generator Guide for Fiori Elements V4',
        syntax: `# Generate a Fiori Elements app from CDS Service:
npx @sap/generator-fiori-elements

# Select Template:
# 1. List Report Page
# 2. Worklist Page
# 3. Analytical List Page
# 4. Form Entry Object Page`,
        laymanAnalogy: 'Like running `npm create vite@latest` or `spring init`, the Fiori Generator asks you which OData service to connect to and creates the entire production project directory with test configurations.',
        technicalDefinition: `The Fiori Application Generator constructs an NPM-managed project containing \`manifest.json\`, \`ui5.yaml\`, and test mock data. It registers the OData V4 service endpoint, configures the component target hierarchy, and enables Fiori Tools live reload middleware.`,
        underTheHood: `The generated app relies on the SAPUI5 framework library \`sap.fe.templates\`. At runtime, the Fiori Elements template parser reads the \`$metadata\` document and instantiates standard controls (\`sap.ui.mdc.Table\`, \`sap.ui.mdc.FilterBar\`).`,
        commonPitfall: `Modifying the generated \`manifest.json\` targets manually without using the Fiori Tools Page Map visual editor.`,
        modernExample: `<!-- manifest.json target configuration for List Report -->
"targets": {
  "TravelList": {
    "type": "Component",
    "id": "TravelList",
    "name": "sap.fe.templates.ListReport",
    "options": {
      "settings": {
        "contextPath": "/Travel",
        "navigation": {
          "Travel": {
            "detail": { "route": "TravelObjectPage" }
          }
        }
      }
    }
  }
}`,
        springBootBridge: {
          explanation: 'Fiori Application Generator is JHipster or Spring Initializr for enterprise frontend apps.',
          springBootCode: `// Spring Initializr CLI equivalent:
curl https://start.spring.io/starter.zip -d dependencies=web,data-jpa -d name=travel-app -o travel.zip`,
          expressCode: `// Express generator equivalent:
npx express-generator --view=pug travel-app`
        }
      },
      {
        name: '2.2 Metadata Extensions (MDE) & Core @UI Annotations',
        sapDocRef: 'SAP CDS Annotation Reference: UI Vocabulary & Metadata Extensions',
        syntax: `@Metadata.layer: #CUSTOMER // Layers: #CORE, #LOCALIZATION, #INDUSTRY, #PARTNER, #CUSTOMER
annotate view ZC_Travel with
{
  @UI.facet: [
    { id: 'GeneralInfo', type: #IDENTIFICATION_REFERENCE, label: 'Travel Info', position: 10 }
  ]

  @UI.lineItem: [{ position: 10, importance: #HIGH, label: 'Travel Ref' }]
  @UI.selectionField: [{ position: 10 }]
  TravelId;

  @UI.lineItem: [{ position: 20, importance: #HIGH }]
  @UI.identification: [{ position: 10 }]
  AgencyId;

  @UI.lineItem: [{ position: 30, importance: #MEDIUM }]
  @UI.identification: [{ position: 20 }]
  TotalPrice;
}`,
        laymanAnalogy: 'Imagine your database table has 40 fields. How does the browser know which 5 fields to show in the summary table and which field to search by? Metadata Extensions (.mde) tell the browser: "Show TravelId in column 1, AgencyId in column 2, and put a search filter on TravelId!"',
        technicalDefinition: `Metadata Extensions (MDE) decouple UI annotations from the core CDS View Entity. They support layering (#CORE, #INDUSTRY, #PARTNER, #CUSTOMER), allowing customers and partners to customize UI layouts without modifying SAP standard code. Core annotations include:
- @UI.headerInfo: Title, subtitle, and badge of the Object Page.
- @UI.lineItem: Columns displayed in the List Report table.
- @UI.selectionField: Filter inputs in the top search bar.
- @UI.facet: Section headers and tabs on the Object Page.
- @UI.identification: Fields grouped inside an Object Page form.`,
        underTheHood: `The ABAP CDS compiler compiles MDE annotations into the SAP HANA metadata repository. Gateway merges these into the OData $metadata XML document as com.sap.vocabularies.UI.v1 terms.`,
        commonPitfall: `Putting @UI annotations directly inside the core data definition (ZI_) rather than an MDE file (.asddls) on the projection view (ZC_). This pollutes the database layer with UI styling rules.`,
        modernExample: `@Metadata.layer: #CUSTOMER
annotate view ZC_Travel with
{
  @UI.headerInfo: {
    typeName: 'Trip',
    typeNamePlural: 'Trips',
    title: { type: #STANDARD, value: 'Description' }
  }
  @UI.lineItem: [
    { position: 10, label: 'Booking Code' },
    { position: 20, criticality: 'OverallStatusCriticality' } // 1=Red, 2=Yellow, 3=Green
  ]
  TravelId;
}`,
        springBootBridge: {
          explanation: 'MDE is Swagger / OpenAPI / Jackson field annotations (@JsonPropertyDescription, @Schema(title="...")) providing UI schema tokens.',
          springBootCode: `// Java Record with OpenAPI schema defining UI table visibility:
public record TravelDTO(
    @Schema(title = "Travel Ref", accessMode = Schema.AccessMode.READ_ONLY)
    String travelId,
    @Schema(title = "Total Cost", format = "currency")
    BigDecimal totalPrice
) {}`,
          expressCode: `// JSON-Schema defining frontend table columns:
const travelUiSchema = {
  properties: {
    travelId: { title: 'Travel Ref', 'ui:widget': 'text' },
    totalPrice: { title: 'Total Cost', 'ui:widget': 'currency' }
  }
};`
        }
      },
      {
        name: '2.3 Value Helps (@Consumption.valueHelpDefinition) & FPM Extensions',
        sapDocRef: 'SAP Fiori Elements: Value Help Definitions & Flexible Programming Model',
        syntax: `// ABAP CDS Value Help Annotation:
@Consumption.valueHelpDefinition: [{
  entity: { name: 'ZI_Agency_VH', element: 'AgencyId' },
  useForValidation: true
}]
AgencyId;

// Flexible Programming Model (FPM) Building Blocks in XML View:
<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns:macros="sap.fe.macros">
  <!-- Reusable Fiori Elements Table Building Block inside Custom View -->
  <macros:Table id="customBookingsTable" metaPath="_Booking" />
</mvc:View>`,
        laymanAnalogy: 'Value Help is the little search icon (F4 search) next to an input field. When you click it, a popup window opens showing all valid Airlines or Customers. The Flexible Programming Model lets you drop pre-built Fiori tables or filter bars into your own custom React or UI5 screens like LEGO blocks!',
        technicalDefinition: `Value Helps provide search-as-you-type, dialog popups, and validation for foreign keys. The Flexible Programming Model (FPM) bridges Fiori Elements and Freestyle UI5: developers can add Custom Sections to Object Pages, Custom Actions to table toolbars, or embed \`sap.fe.macros\` (Table, Field, FilterBar) into custom views.`,
        underTheHood: `When the user focuses an input decorated with \`@Consumption.valueHelpDefinition\`, Fiori Elements executes a debounced \`GET /AgencyVH?$filter=startswith(Name, '...')\` and renders a responsive search dialog.`,
        commonPitfall: `Writing a 200-line custom controller dialog for simple dropdown selection instead of using standard CDS Value Help annotations.`,
        modernExample: `// Custom Action Handler in Flexible Programming Model controller:
sap.ui.define(["sap/m/MessageToast"], function(MessageToast) {
  "use strict";
  return {
    onApproveDiscount: async function(oContext, aSelectedContexts) {
      // Execute EML action bound to Fiori Elements table
      await oContext.getModel().bindContext("Travel/com.sap.gateway.srvd.dmo.travel.v0001.approveDiscount(...)").execute();
      MessageToast.show("Discount approved via custom action!");
    }
  };
});`,
        springBootBridge: {
          explanation: 'Value Help is an autocomplete dropdown API endpoint (GET /api/v1/agencies/lookup). FPM is a React Component Library (e.g. MUI DataGrid) configured via backend props.',
          springBootCode: `// Spring Boot lookup controller serving Value Help:
@GetMapping("/api/v1/agencies/lookup")
public List<LookupItemDTO> getAgencyLookup(@RequestParam("q") String search) {
    return agencyService.searchByName(search);
}`,
          expressCode: `// Express Value Help autocomplete endpoint:
app.get('/api/v1/agencies/lookup', async (req, res) => {
  const matches = await Agency.findAll({ where: { name: { [Op.like]: \`%\${req.query.q}%\` } } });
  res.json(matches);
});`
        }
      }
    ],

    showdown: {
      title: 'Architectural Showdown: SAP Fiori Elements vs Freestyle SAPUI5',
      verdict: 'SAP Fiori Elements should be used for 80% of enterprise scenarios (standard CRUD, List Reports, Object Pages). Reserve Freestyle SAPUI5 for bespoke, non-standard visual layouts (e.g. interactive factory floor plans or visual drag-and-drop kanban boards).',
      elementA: {
        name: 'SAP Fiori Elements (Metadata-Driven)',
        syntax: `// 0 Lines of Frontend JavaScript!
// Driven 100% by CDS Annotations:
@UI.lineItem: [{ position: 10 }]
@UI.selectionField: [{ position: 10 }]
TravelId;`,
        pros: ['Up to 80% faster time-to-market', 'Zero frontend UI code to maintain', 'Automatic compliance with SAP UX guidelines and theme upgrades', 'Free built-in Draft handling, Excel export, and personalization'],
        cons: ['Custom layout variations require FPM extensions']
      },
      elementB: {
        name: 'Freestyle SAPUI5 (Code-Driven)',
        syntax: `<mvc:View controllerName="my.Controller">
  <Table items="{/Travel}">
    <columns><Column><Text text="Travel ID" /></Column></columns>
    <items><ColumnListItem><Text text="{TravelId}" /></ColumnListItem></items>
  </Table>
</mvc:View>`,
        pros: ['100% pixel-perfect control over every HTML/DOM element', 'Ability to build completely unique visual experiences'],
        cons: ['Developer must write all controllers, dialogs, sorting, filtering, and paging', 'Higher maintenance cost across SAP upgrades']
      },
      comparisonTable: [
        { feature: 'Development Speed', elementA: '1 - 2 Days per app', elementB: '2 - 4 Weeks per app', winner: 'Fiori Elements' },
        { feature: 'Maintenance Overhead', elementA: 'Low (Handled by SAPUI5 framework)', elementB: 'High (Custom code owned by team)', winner: 'Fiori Elements' },
        { feature: 'UX Consistency', elementA: '100% Guaranteed', elementB: 'Depends on developer discipline', winner: 'Fiori Elements' },
        { feature: 'Unusual Custom Layouts', elementA: 'Requires FPM Building Blocks', elementB: 'Fully unrestricted', winner: 'Freestyle SAPUI5' }
      ]
    },

    files: [
      {
        path: 'src/zc_travel.mde.asddls',
        language: 'abap',
        description: 'Metadata Extension defining Fiori Elements annotations for Travel entity',
        code: `@Metadata.layer: #CUSTOMER
@UI.headerInfo: {
  typeName: 'Travel Document',
  typeNamePlural: 'Travel Documents',
  title: { type: #STANDARD, value: 'TravelId' },
  description: { value: 'Description' }
}
annotate view ZC_Travel with
{
  @UI.facet: [
    { id: 'GeneralData', purpose: #STANDARD, type: #IDENTIFICATION_REFERENCE, label: 'General Info', position: 10 }
  ]

  @UI.lineItem: [{ position: 10, label: 'Travel ID' }]
  @UI.selectionField: [{ position: 10 }]
  @UI.identification: [{ position: 10 }]
  TravelId;

  @UI.lineItem: [{ position: 20, label: 'Agency' }]
  @UI.identification: [{ position: 20 }]
  @Consumption.valueHelpDefinition: [{ entity: { name: '/DMO/I_Agency', element: 'AgencyId' } }]
  AgencyId;
}`
      }
    ]
  },

  // =========================================================================
  // MODULE 3: FREESTYLE SAPUI5 (CODE-DRIVEN UI)
  // =========================================================================
  {
    id: 'fiori-mod-3-freestyle',
    day: 3,
    track: 'fiori',
    title: 'Module 3: Freestyle SAPUI5 (Code-Driven UI)',
    subtitle: 'MVC Architecture, sap.m Controls, JSON & OData Models, Data Binding, Routing & XML Fragments',
    readTime: '24 min read',
    vlogHook: "When your business demands a unique user experience beyond standard templates, Freestyle SAPUI5 is your superpower! Today we master the Model-View-Controller (MVC) architecture, manifest.json descriptors, responsive sap.m layout controls, all 4 types of data binding, hash-based client routing, and reusable XML fragments with dialogs.",
    layman: "Freestyle SAPUI5 is to SAP what React or Vue is to web development. You write the HTML-like XML views for the structure, JavaScript controllers for the logic, and JSON/OData models for the data. You have complete creative freedom over every button, animation, and click.",
    technical: "SAPUI5 is an enterprise JavaScript framework utilizing an asynchronous AMD module loader (sap.ui.define). Applications are configured via manifest.json (App Descriptor specification). Views are authored declaratively in XML to enforce separation of concerns, while Controllers encapsulate event handling, data transformations, and OData CRUD operations.",

    deepDiveKeywords: [
      {
        name: '3.1 MVC Architecture: manifest.json, XML Views & JS Controllers',
        sapDocRef: 'SAPUI5 Developer Guide: Model-View-Controller Concept',
        syntax: `/* Modern SAPUI5 Controller (AMD Module Pattern): */
sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel"
], function(Controller, MessageToast, JSONModel) {
  "use strict";

  return Controller.extend("my.app.controller.Main", {
    onInit: function() {
      // Local view state model
      const oViewModel = new JSONModel({ isBusy: false, counter: 0 });
      this.getView().setModel(oViewModel, "view");
    },

    onIncrement: function() {
      const oModel = this.getView().getModel("view");
      const current = oModel.getProperty("/counter");
      oModel.setProperty("/counter", current + 1);
      MessageToast.show("Counter incremented!");
    }
  });
});`,
        laymanAnalogy: 'MVC is like a restaurant: The Model is the kitchen pantry (where data lives), the View is the plated dinner presentation (what the customer sees), and the Controller is the waiter (handling user clicks, fetching data, and updating the plate).',
        technicalDefinition: `SAPUI5 adheres strictly to the MVC paradigm:
- manifest.json: Declares application dependencies, routing tables, and data models.
- XML View: Declares controls hierarchy with namespaces (xmlns:mvc, xmlns="sap.m").
- Controller: Extends sap.ui.core.mvc.Controller to provide lifecycle hooks (onInit, onExit, onBeforeRendering, onAfterRendering) and event handlers.`,
        underTheHood: `The SAPUI5 XMLView parser compiles the XML DOM tree asynchronously into JavaScript control instances, attaching two-way data bindings to the managed object model.`,
        commonPitfall: `Directly manipulating the browser DOM using jQuery ($("#myButton")) or document.getElementById(). Always manipulate UI5 controls via this.byId("myControlId") or two-way data bindings.`,
        modernExample: `<!-- webapp/view/Main.view.xml -->
<mvc:View
  controllerName="my.app.controller.Main"
  xmlns:mvc="sap.ui.core.mvc"
  xmlns="sap.m">
  <Page title="{i18n>mainPageTitle}">
    <content>
      <VBox class="sapUiMediumMargin">
        <Title text="Interactive Freestyle Demo" />
        <Text text="Current Value: {view>/counter}" class="sapUiSmallMarginBottom" />
        <Button text="Add Counter" press=".onIncrement" type="Emphasized" />
      </VBox>
    </content>
  </Page>
</mvc:View>`,
        springBootBridge: {
          explanation: 'XML View + JS Controller is identical to React JSX + Hook Controller (useState/useEffect) or Angular Template + Component.ts.',
          springBootCode: `// Angular TypeScript equivalent:
@Component({ selector: 'app-main', templateUrl: './main.component.html' })
export class MainComponent {
    counter: number = 0;
    onIncrement() { this.counter++; }
}`,
          expressCode: `// React component equivalent:
export function MainView() {
  const [counter, setCounter] = useState(0);
  return <button onClick={() => setCounter(c => c + 1)}>Count: {counter}</button>;
}`
        }
      },
      {
        name: '3.2 Data Binding Types: Property, Aggregation, Element & Expression',
        sapDocRef: 'SAPUI5 Data Binding Documentation: Syntax & Binding Modes',
        syntax: `<!-- 1. Property Binding: Simple single value -->
<Text text="{/userName}" />

<!-- 2. Aggregation Binding: Binds array to table rows -->
<Table items="{/travels}">
  <items>
    <ColumnListItem>
      <Text text="{travelId}" />
      <Text text="{totalPrice}" />
    </ColumnListItem>
  </items>
</Table>

<!-- 3. Element Binding: Sets context for parent container -->
<VBox binding="{/selectedTravel}">
  <Text text="{description}" />
</VBox>

<!-- 4. Expression Binding: Inline calculation/condition in XML -->
<ObjectStatus
  text="{= \${status} === 'A' ? 'Approved' : 'Pending' }"
  state="{= \${status} === 'A' ? 'Success' : 'Warning' }" />`,
        laymanAnalogy: 'Data binding is like a live mirror. When the data in your JavaScript model changes, the text on the screen updates instantly without needing to manually find and replace text in HTML.',
        technicalDefinition: `SAPUI5 supports one-way, two-way, and one-time binding modes:
- Property Binding: Connects a control property to a single model attribute.
- Aggregation Binding: Clones a template control for each item in a collection.
- Element Binding: Sets a relative binding path context for a subtree of controls.
- Expression Binding: Embedded JavaScript expressions evaluated dynamically inside XML curly braces {= ... }.`,
        underTheHood: `The SAPUI5 PropertyBinding class subscribes to model change events. When \`setProperty\` is called, the model notifies all registered bindings, which invoke \`control.setProperty\` during the next rendering frame.`,
        commonPitfall: `Forgetting the leading slash \`/\` in absolute paths (e.g., typing \`{userName}\` instead of \`{/userName}\` when no relative context binding is active).`,
        modernExample: `<!-- Expression binding with complex ternary operator -->
<ObjectHeader
  title="{travelId}"
  number="{totalPrice}"
  numberUnit="{currencyCode}">
  <statuses>
    <ObjectStatus
      text="{= \${totalPrice} > 5000 ? 'High Value' : 'Standard' }"
      state="{= \${totalPrice} > 5000 ? 'Error' : 'None' }" />
  </statuses>
</ObjectHeader>`,
        springBootBridge: {
          explanation: 'Expression binding {= ... } is React inline JSX ternary ({status === "A" ? "Approved" : "Pending"}) or Angular pipe/interpolation.',
          springBootCode: `// Java Thymeleaf template binding equivalent:
<span th:text="\${order.total > 5000 ? 'High Value' : 'Standard'}"
      th:classappend="\${order.total > 5000 ? 'text-danger' : 'text-muted'}"></span>`,
          expressCode: `// React JSX equivalent:
<Badge color={item.totalPrice > 5000 ? 'red' : 'gray'}>
  {item.totalPrice > 5000 ? 'High Value' : 'Standard'}
</Badge>`
        }
      },
      {
        name: '3.3 Routing, Navigation & XML Fragments (Dialogs)',
        sapDocRef: 'SAPUI5 Navigation & Routing Documentation: Router, Targets & Fragments',
        syntax: `/* manifest.json Routing Configuration: */
"routing": {
  "config": {
    "routerClass": "sap.m.routing.Router",
    "viewType": "XML",
    "viewPath": "my.app.view",
    "controlId": "appRoot",
    "controlAggregation": "pages"
  },
  "routes": [
    { "pattern": "", "name": "home", "target": "homeTarget" },
    { "pattern": "travel/{travelId}", "name": "detail", "target": "detailTarget" }
  ],
  "targets": {
    "homeTarget": { "viewName": "Home" },
    "detailTarget": { "viewName": "Detail" }
  }
}`,
        laymanAnalogy: 'Routing is what changes the page when you click a link and updates the URL hash (e.g. `#/travel/100`). XML Fragments are reusable UI pieces that do not have their own controller—like a popup "Confirm Delete?" dialog box that you can reuse across 5 different pages.',
        technicalDefinition: `SAPUI5 HashChanger tracks URL fragment changes (#/route) and dispatches them to sap.m.routing.Router. The router matches route patterns, extracts URL parameters, and loads views into target control aggregations. XML Fragments (sap.ui.core.Fragment) instantiate reusable modal dialogs, popovers, or table rows without creating separate controller classes.`,
        underTheHood: `Fragments are loaded asynchronously via \`Fragment.load()\`. Once loaded, they share the parent controller instance, allowing dialog buttons to directly invoke methods on the host controller.`,
        commonPitfall: `Instantiating a new Dialog fragment on every button click without caching. This leaks memory. Always cache dialog instances: \`if (!this._oDialog) { this._oDialog = await Fragment.load(...); }\`.`,
        modernExample: `// Controller method loading and opening an XML Dialog fragment:
onOpenConfirmationDialog: async function() {
  if (!this._oConfirmDialog) {
    this._oConfirmDialog = await this.loadFragment({
      name: "my.app.view.ConfirmDialog"
    });
  }
  this._oConfirmDialog.open();
},

onCloseDialog: function() {
  this._oConfirmDialog.close();
}`,
        springBootBridge: {
          explanation: 'Routing is React Router (useNavigate / useParams). Fragments are React Modal Portals or sub-components without state.',
          springBootCode: `// React Router route configuration equivalent:
<Routes>
  <Route path="/" element={<HomeView />} />
  <Route path="/travel/:travelId" element={<DetailView />} />
</Routes>`,
          expressCode: `// React modal fragment equivalent:
export function ConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  return <div className="modal"><h3>Confirm Action</h3><button onClick={onConfirm}>Yes</button></div>;
}`
        }
      }
    ],

    showdown: {
      title: 'Architectural Showdown: JSONModel vs ODataModel V4 in SAPUI5',
      verdict: 'Use ODataModel V4 for all backend database entity CRUD operations. Use JSONModel strictly for client-side ephemeral UI state (e.g., toggling edit modes, tab selection, loading spinners).',
      elementA: {
        name: 'JSONModel (Client-Side Ephemeral State)',
        syntax: `const oModel = new sap.ui.model.json.JSONModel({
  isEditing: false,
  selectedTab: "General"
});
this.getView().setModel(oModel, "ui");`,
        pros: ['Instant synchronous read/write', 'Zero network latency for local state', 'Supports arbitrary nested JSON objects'],
        cons: ['Does not communicate with backend database automatically', 'No pagination or server-side filtering']
      },
      elementB: {
        name: 'ODataModel V4 (Server-Side Enterprise Engine)',
        syntax: `// Automatically bound in manifest.json
const oContext = oTable.getBinding("items").create({
  TravelId: "NEW_01",
  Description: "Executive Summit"
});`,
        pros: ['Native SAP HANA push-down for filtering and sorting', 'Automatic transactional batching and draft management', 'Optimistic concurrency control with ETags'],
        cons: ['Asynchronous operations require promise handling']
      },
      comparisonTable: [
        { feature: 'Primary Purpose', elementA: 'Local UI toggles & temporary form state', elementB: 'Backend database entity persistence', winner: 'Both (Hybrid)' },
        { feature: 'Network Activity', elementA: 'None (Client RAM)', elementB: 'Automated OData V4 REST calls', winner: 'ODataModel V4' },
        { feature: 'Two-Way Binding', elementA: 'Immediate memory update', elementB: 'Deferred to changeset submit', winner: 'Both' }
      ]
    },

    files: [
      {
        path: 'webapp/view/Main.view.xml',
        language: 'xml',
        description: 'Freestyle SAPUI5 XML View demonstrating responsive Table and Data Binding',
        code: `<mvc:View
  controllerName="my.travel.controller.Main"
  xmlns:mvc="sap.ui.core.mvc"
  xmlns="sap.m">
  <Page title="{i18n>appTitle}">
    <headerContent>
      <Button icon="sap-icon://add" text="New Travel" press=".onNewTravel" type="Emphasized" />
    </headerContent>
    <content>
      <Table id="travelTable" items="{/Travel}">
        <columns>
          <Column><Text text="Travel ID" /></Column>
          <Column><Text text="Agency" /></Column>
          <Column><Text text="Total Price" /></Column>
        </columns>
        <items>
          <ColumnListItem type="Navigation" press=".onTravelPress">
            <cells>
              <ObjectIdentifier title="{TravelId}" text="{Description}" />
              <Text text="{AgencyId}" />
              <ObjectNumber number="{TotalPrice}" unit="{CurrencyCode}" />
            </cells>
          </ColumnListItem>
        </items>
      </Table>
    </content>
  </Page>
</mvc:View>`
      }
    ]
  },

  // =========================================================================
  // MODULE 4: APPLICATION DEPLOYMENT
  // =========================================================================
  {
    id: 'fiori-mod-4-deployment',
    day: 4,
    track: 'fiori',
    title: 'Module 4: Application Deployment (S/4HANA & SAP BTP)',
    subtitle: 'S/4HANA ABAP Repository Deployment (BSP, ICF, Transport Request) & SAP BTP Cloud Foundry Deployment (MTA, HTML5 App Repo)',
    readTime: '20 min read',
    vlogHook: "Your app is built and running locally—now how do you deploy it to production? Enterprise SAP has two primary deployment targets: On-Premise S/4HANA ABAP Repository (via BSP application and Transport Requests) and SAP BTP Cloud Foundry (via Multi-Target Application MTA archives and the HTML5 Application Repository). Today we master both deployment pipelines end-to-end!",
    layman: "Building code on your laptop is like cooking a meal in your kitchen. Deployment is packaging that meal and delivering it to a 10,000-seat stadium! You will learn how to send your Fiori app into the S/4HANA enterprise core using Transport Requests, and how to push it to the SAP Cloud using Cloud Foundry.",
    technical: "On-Premise deployment compiles the web application into a Business Server Page (BSP) stored in the SAP ABAP Repository (/UI5/THEME, /UI5/UI5_REPOSITORY) and activates an ICF node in transaction SICF under a recorded Workbench Transport Request. Cloud deployment packages the app into an MTA (.mtar) using mbt build and deploys to the SAP BTP HTML5 Application Repository via cf deploy.",

    deepDiveKeywords: [
      {
        name: '4.1 S/4HANA ABAP Repository Deployment: BSP, ICF & Transport Requests',
        sapDocRef: 'SAP S/4HANA Deployment Guide: /UI5/ABAP_REPOSITORY & Transport Management',
        syntax: `# 1. Configure deployment parameters in ui5-deploy.yaml
# 2. Execute automated build and deployment:
npm run deploy

# Under the hood, this invokes:
# ui5-task-zipper + @sap-ux/deploy-tooling
# Parameters specified:
# - Target ABAP System: https://s4hana-host:44300
# - BSP Application Name: ZTRAVEL_APP (Max 15 characters)
# - Package: ZTRAVEL_PKG (or $TMP for local)
# - Transport Request: TR1K900123`,
        laymanAnalogy: 'In on-premise SAP, code is moved between Dev, QA, and Production systems in sealed containers called "Transport Requests". Deploying your Fiori app bundles all HTML/JS files into a BSP container and locks it into a Transport Request so your basis administrator can migrate it to production.',
        technicalDefinition: `Deployment to S/4HANA transforms the web app into an ABAP BSP Application (viewable in SE80). The deployment tool writes metadata records into table \`WAPA\` and contents into the MIME Repository (\`SMIM\`). An ICF Service node is generated in transaction \`SICF\` under path \`/sap/bc/ui5_ui5/sap/ztravel_app\`.`,
        underTheHood: `The deploy tooling authenticates with SAP Gateway via HTTP Basic or OAuth SAML bearer, requests a CSRF token, and uploads the compressed ZIP payload to OData service \`/sap/opu/odata/UI5/ABAP_REPOSITORY_SRV/\`.`,
        commonPitfall: `Deploying to package \`$TMP\` in production. Apps deployed to \`$TMP\` are local objects and cannot be transported to QA or Production. Always assign a registered ABAP package and transport request.`,
        modernExample: `# ui5-deploy.yaml configuration for S/4HANA deployment
specVersion: "3.0"
metadata:
  name: ztravel_app
type: application
builder:
  resources:
    excludes:
      - "/test/**"
      - "/localService/**"
  customTasks:
    - name: deploy-to-abap
      afterTask: generateVersionInfo
      configuration:
        target:
          url: https://s4hana.enterprise.corp:44300
          client: "100"
        app:
          name: ZTRAVEL_APP
          description: "Manage Travel Fiori App"
          package: ZTRAVEL_PACKAGE
          transport: S4HK901234`,
        springBootBridge: {
          explanation: 'BSP Deployment is copying static frontend assets into a Spring Boot JAR /resources/static folder or S3 bucket.',
          springBootCode: `// Maven plugin packaging frontend into JAR /static:
<plugin>
  <artifactId>maven-resources-plugin</artifactId>
  <executions>
    <execution><id>copy-resources</id><phase>generate-resources</phase></execution>
  </executions>
</plugin>`,
          expressCode: `// Express serving static frontend build:
app.use(express.static(path.join(__dirname, 'client/dist')));`
        }
      },
      {
        name: '4.2 SAP BTP Cloud Foundry Deployment: MTA, mbt build & cf deploy',
        sapDocRef: 'SAP BTP Cloud Foundry Documentation: Multi-Target Application (MTA) Lifecycle',
        syntax: `# 1. Build Multi-Target Application archive (.mtar):
mbt build -t ./mta_archives

# 2. Log in to SAP BTP Cloud Foundry Space:
cf login -a https://api.cf.eu10.hana.ondemand.com -o my-org -s dev

# 3. Deploy archive to HTML5 Application Repository:
cf deploy ./mta_archives/travel_app_1.0.0.mtar`,
        laymanAnalogy: 'Think of an MTA (.mtar) like a ZIP box that contains your frontend React/Fiori app, security authorization files, and database bindings all packed together. Running `cf deploy` unboxes everything onto SAP Cloud and launches the services automatically.',
        technicalDefinition: `Multi-Target Application (MTA) describes interdependent modules (frontend, backend, security, database) configured via \`mta.yaml\`. The Cloud Foundry Multiapps controller reads the MTA descriptor, provisions destination services and XSUAA security instances, and uploads HTML5 static assets into the BTP HTML5 Application Repository service (\`app-runtime\` and \`app-host\`).`,
        underTheHood: `The BTP Approuter (Managed Approuter or Standalone Approuter) acts as the reverse proxy gateway, terminating user sessions, validating JWT tokens against XSUAA, and routing requests to the HTML5 App Repository or destination backends.`,
        commonPitfall: `Mismatch between the HTML5 module name in \`mta.yaml\` and the \`sap.app/id\` in \`manifest.json\`. If these IDs do not match, the Approuter cannot locate the app in the repository.`,
        modernExample: `# mta.yaml for SAP BTP Cloud Foundry Deployment
_schema-version: "3.2"
ID: travel-app-btp
version: 1.0.0
modules:
  - name: travel-app-frontend
    type: html5
    path: .
    build-parameters:
      build-result: dist
      builder: custom
      commands:
        - npm install
        - npm run build
    requires:
      - name: uaa_travel_app
      - name: html5_repo_host

resources:
  - name: html5_repo_host
    type: org.cloudfoundry.managed-service
    parameters:
      service: html5-apps-repo
      service-plan: app-host
  - name: uaa_travel_app
    type: org.cloudfoundry.managed-service
    parameters:
      service: xsuaa
      service-plan: application`,
        springBootBridge: {
          explanation: 'MTA is Docker Compose or Kubernetes Helm Chart for SAP BTP, declaring services and frontend containers.',
          springBootCode: `// Docker Compose declaration equivalent:
version: '3.8'
services:
  frontend:
    build: ./client
    ports: ["80:80"]
  backend:
    build: ./server
    environment:
      - DB_URL=postgres://...`,
          expressCode: `// Helm Chart values.yaml equivalent:
replicaCount: 2
image:
  repository: travel-app
  tag: 1.0.0`
        }
      }
    ],

    showdown: {
      title: 'Architectural Showdown: S/4HANA ABAP Repository vs SAP BTP Cloud Deployment',
      verdict: 'For Clean Core architecture, modern deployments should target SAP BTP Cloud Foundry with the Managed Approuter whenever possible, keeping the S/4HANA core pristine.',
      elementA: {
        name: 'S/4HANA ABAP Repository (On-Premise / Private Cloud)',
        syntax: `npm run deploy
-> Packages into BSP: ZTRAVEL_APP
-> Recorded in Transport: TR1K900123
-> Served via SICF: /sap/bc/ui5_ui5/sap/ztravel_app`,
        pros: ['Direct co-location with on-premise ERP data', 'Uses existing ABAP transport management (TMS / ChaRM)'],
        cons: ['Tight coupling with ABAP system upgrade cycles', 'Consumes on-premise application server CPU/RAM']
      },
      elementB: {
        name: 'SAP BTP Cloud Foundry (Side-by-Side Clean Core)',
        syntax: `mbt build && cf deploy ./mta_archives/app.mtar
-> Hosted on BTP HTML5 Application Repository
-> Served via Managed Approuter + SAP Build Work Zone`,
        pros: ['100% Clean Core compliant (Zero custom frontend code inside ERP)', 'Global CDN caching and independent CI/CD release cycles', 'Seamless integration with SAP Build Work Zone'],
        cons: ['Requires SAP BTP subscription and Cloud Foundry configuration']
      },
      comparisonTable: [
        { feature: 'Clean Core Rating', elementA: 'Traditional (In Core)', elementB: '100% Clean Core Standard', winner: 'SAP BTP Cloud' },
        { feature: 'Release Velocity', elementA: 'Tied to ABAP Transport Windows', elementB: 'Continuous Deployment (CI/CD)', winner: 'SAP BTP Cloud' },
        { feature: 'Transport Mechanism', elementA: 'PFCG / SE09 / STMS', elementB: 'Git / Cloud Foundry CLI / mbt', winner: 'SAP BTP Cloud' }
      ]
    },

    files: [
      {
        path: 'ui5-deploy.yaml',
        language: 'yaml',
        description: 'S/4HANA ABAP Repository automated deployment configuration',
        code: `specVersion: "3.0"
metadata:
  name: zfiori_travel
type: application
builder:
  customTasks:
    - name: deploy-to-abap
      afterTask: generateVersionInfo
      configuration:
        target:
          url: https://s4hana-dev.corp:44300
          client: "100"
        app:
          name: ZFIORI_TRAVEL
          description: "Manage Travel Bookings"
          package: ZRAP_TRAVEL
          transport: S4HK900456`
      }
    ]
  },

  // =========================================================================
  // MODULE 5: SAP FIORI LAUNCHPAD INTEGRATION (S/4HANA)
  // =========================================================================
  {
    id: 'fiori-mod-5-launchpad',
    day: 5,
    track: 'fiori',
    title: 'Module 5: SAP Fiori Launchpad Integration (S/4HANA)',
    subtitle: 'Semantic Objects, Business Catalogs, Target Mappings (Intent-Based Navigation), Tiles, Spaces & Pages, and PFCG Security Roles',
    readTime: '22 min read',
    vlogHook: "Your Fiori app is deployed—but how do end users actually find and launch it? Through the SAP Fiori Launchpad (FLP)! Today we master Intent-Based Navigation (#SemanticObject-action), configure Business Catalogs using /UI2/FLPCM_CUST, create Static and Dynamic tiles, design modern Spaces & Pages layouts, and generate PFCG security authorization roles to grant users access.",
    layman: "The SAP Fiori Launchpad is like the home screen of an iPad or Android smartphone. Each app has a tile or icon on the home screen. Today you learn how to register your newly deployed app into this home screen, decide which employees get the tile, and group tiles into organized tabs called Spaces and Pages.",
    technical: "The SAP Fiori Launchpad (FLP) is the unified enterprise entry point for S/4HANA and BTP. Navigation is resolved via Intent-Based Navigation (IBN) conforming to the semantic pattern: #SemanticObject-action?params. Catalog and target mapping definitions are maintained in transaction /UI2/FLPCM_CUST (Launchpad Content Manager), mapped to Spaces & Pages in /UI2/FDM_PAGE, and assigned to user authorization profiles via transaction PFCG.",

    deepDiveKeywords: [
      {
        name: '5.1 Semantic Objects (/UI2/SEMOBJ) & Intent-Based Navigation',
        sapDocRef: 'SAP Fiori Launchpad Architecture: Intent-Based Navigation & Resolution',
        syntax: `/* Intent-Based Navigation URI Structure:
   #<SemanticObject>-<action>?<parameter=value>

   Examples:
   #Travel-manage          -> Opens Manage Travels App
   #Travel-display?Id=100  -> Opens Travel #100 Object Page
   #PurchaseOrder-approve  -> Opens Approval Dialog */

// Defining Semantic Object in S/4HANA:
// Transaction: /UI2/SEMOBJ
// Semantic Object: Travel
// Name: Travel Management Business Entity`,
        laymanAnalogy: 'Think of Intent-Based Navigation like a telephone directory. Instead of memorizing a messy URL like `/sap/bc/ui5_ui5/sap/ztravel_app/index.html?var=1`, the system simply asks for `#Travel-manage`. The launchpad looks up that intent and opens the right app automatically.',
        technicalDefinition: `Intent-Based Navigation (IBN) decouples the user intent from concrete technology implementations. The client triggers navigation via \`CrossApplicationNavigation.to({ target: { semanticObject: "Travel", action: "manage" } })\`. The FLP Navigation Target Resolution service resolves the intent against the user's assigned Target Mappings in real time.`,
        underTheHood: `During logon, the FLP loads the user's authorization catalog index. When an intent is clicked, the launchpad evaluates user device constraints (Desktop, Tablet, Phone) and launches the matching BSP or external URL in a sandbox iframe or native container.`,
        commonPitfall: `Hardcoding direct URLs inside application code (e.g., \`window.location.href = "/sap/bc/..."\`). This bypasses FLP navigation history, destroys state caching, and breaks Clean Core standards. Always use CrossApplicationNavigation.`,
        modernExample: `// Triggering Intent-Based Cross-Navigation in SAPUI5 Controller:
onNavigateToAgency: function(sAgencyId) {
  const oCrossAppNav = sap.ushell.Container.getService("CrossApplicationNavigation");
  oCrossAppNav.to({
    target: {
      semanticObject: "Agency",
      action: "display"
    },
    params: {
      "AgencyId": sAgencyId
    }
  });
}`,
        springBootBridge: {
          explanation: 'Intent-Based Navigation is a Reverse Proxy / Service Registry (like Netflix Eureka or Spring Cloud Gateway) resolving logical service names to concrete endpoints.',
          springBootCode: `// Spring Cloud Gateway routing route by intent:
@Bean
public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
    return builder.routes()
        .route("travel_route", r -> r.path("/travel/**").uri("lb://TRAVEL-SERVICE"))
        .build();
}`,
          expressCode: `// Express intent router equivalent:
const intentMap = { 'Travel-manage': '/apps/travel', 'Agency-display': '/apps/agency' };
app.get('/navigate/:intent', (req, res) => res.redirect(intentMap[req.params.intent]));`
        }
      },
      {
        name: '5.2 Content Manager (/UI2/FLPCM_CUST), Target Mappings & Tiles',
        sapDocRef: 'SAP Fiori Launchpad Administration: Launchpad Content Manager Guide',
        syntax: `/* Launchpad Configuration Hierarchy:
 1. Business Catalog (Z_BC_TRAVEL_ADMIN):
    Holds Target Mappings and Tiles.
 2. Target Mapping:
    Semantic Object: Travel
    Action: manage
    App Type: SAPUI5 Fiori App
    URL / BSP: /sap/bc/ui5_ui5/sap/ztravel_app
    ID: zfiori.travel.manage
 3. Tile (Static or Dynamic App Launcher):
    Title: "Manage Travels"
    Subtitle: "Corporate Travel Approvals"
    Icon: sap-icon://flight
    Service URL (Dynamic count): /sap/opu/odata4/.../Travel/$count */`,
        laymanAnalogy: 'A Business Catalog is a master toolbox. The Target Mapping is the blueprint explaining how to open the tool. The Tile is the visual icon sitting on your desk. Dynamic tiles can even show live numbers (like "14 Pending Travels") without opening the app!',
        technicalDefinition: `Transaction \`/UI2/FLPCM_CUST\` (Launchpad Content Manager) is the official Clean Core tool for administering catalogs and target mappings in S/4HANA (replacing the legacy /UI2/FLPD_CUST tool). Target mappings bind intents to specific BSP application IDs or external URLs. Tiles define visual icons, subtitles, and dynamic OData count poll endpoints.`,
        underTheHood: `Dynamic tiles trigger periodic HTTP GET requests to the specified OData service URL to retrieve scalar integer counts, refreshing every 60 seconds with an animated badge counter.`,
        commonPitfall: `Leaving Target Mapping device types unchecked. If you don't check "Desktop" in the target mapping, users on desktop PCs will see an error: "Could not open app. Try again later."`,
        modernExample: `<!-- Sample Dynamic Tile Definition JSON -->
{
  "tileType": "sap.ushell.ui.tile.DynamicTile",
  "properties": {
    "title": "Pending Travel Approvals",
    "subtitle": "Urgent Flights",
    "icon": "sap-icon://flight",
    "serviceUrl": "/sap/opu/odata4/dmo/travel/0001/Travel/$count?$filter=OverallStatus eq 'O'",
    "refreshInterval": 60
  }
}`,
        springBootBridge: {
          explanation: 'Target Mapping is an OAuth Resource Server Scope mapping. A dynamic tile is an API endpoint polling count (SELECT COUNT(*) WHERE status="O").',
          springBootCode: `// Spring Boot endpoint providing dynamic count for Fiori Tile:
@GetMapping("/api/v1/travels/count")
public ResponseEntity<Long> getPendingCount() {
    return ResponseEntity.ok(travelRepository.countByStatus("O"));
}`,
          expressCode: `// Express dynamic tile count endpoint:
app.get('/api/v1/travels/count', async (req, res) => {
  const count = await Travel.count({ where: { status: 'O' } });
  res.send(count.toString());
});`
        }
      },
      {
        name: '5.3 Spaces & Pages Layout & PFCG Security Role Assignment',
        sapDocRef: 'SAP Fiori Launchpad: Spaces and Pages Concept & PFCG Integration',
        syntax: `/* S/4HANA Spaces and Pages Architecture:
 - Space: Top navigation bar tab (e.g. "Travel & Expense")
 - Page: The visual content area inside the space
 - Section: Grouping inside the page (e.g. "Quick Actions", "Analytics")

Steps in Transaction PFCG (Role Maintenance):
1. Create Single Role: Z_ROLE_TRAVEL_MANAGER
2. Tab "Menu" -> Add "SAP Fiori Tile Catalog" -> Z_BC_TRAVEL_ADMIN
3. Tab "Menu" -> Add "SAP Fiori Space" -> Z_SP_TRAVEL
4. Tab "Authorizations" -> Generate Profile
5. Tab "User" -> Assign SAP User IDs */`,
        laymanAnalogy: 'Groups were the old way where everything was dumped onto one endless scrolling page. Spaces and Pages is like a modern browser with clean tabs at the top. PFCG is the digital security badge: you scan the badge at the door to see only the spaces and tiles you are allowed to access.',
        technicalDefinition: `Spaces and Pages (/UI2/FDM_PAGE) replaces the legacy FLP Groups model. Each Space corresponds to a broad business domain and contains one or more Pages organized into Sections. Role assignment in PFCG links authorization profiles to the Launchpad Catalogs and Spaces, enforcing strict role-based access control (RBAC).`,
        underTheHood: `When user logs into \`/UI2/FLP\`, the launchpad queries \`/UI2/PAGE_RUNTIME_SRV\` to compile the personalized user menu based on authorized PFCG role assignments.`,
        commonPitfall: `Assigning the Tile Catalog in PFCG but forgetting to generate the Authorization profile. Users will see the tile on their home screen, but clicking it will result in HTTP 403 Forbidden.`,
        modernExample: `/* Steps to test Launchpad after PFCG assignment:
1. Open browser: https://s4hana-host:44300/sap/bc/ui2/flp?sap-client=100
2. Enter User ID & Password
3. Verify Space "Travel Management" appears in top navigation tab
4. Click Tile "Manage Travels" -> verifies intent #Travel-manage resolves cleanly */`,
        springBootBridge: {
          explanation: 'PFCG is Spring Security @PreAuthorize("hasRole(\'TRAVEL_MANAGER\')") or Keycloak Realm Role mapping.',
          springBootCode: `// Spring Security Role Assignment equivalent:
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(auth -> auth
            .requestMatchers("/apps/travel/**").hasRole("TRAVEL_MANAGER")
        ).build();
    }
}`,
          expressCode: `// Express role authorization middleware:
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user.roles.includes(role)) return res.status(403).json({ error: 'Access Denied' });
    next();
  };
}`
        }
      }
    ],

    showdown: {
      title: 'Architectural Showdown: Legacy FLP Groups vs Modern Spaces & Pages',
      verdict: 'SAP has officially deprecated FLP Groups in modern S/4HANA releases. Spaces and Pages is the mandatory Clean Core standard for all new S/4HANA and SAP BTP implementations.',
      elementA: {
        name: 'Legacy FLP Groups (Deprecated Model)',
        syntax: `// All tiles displayed on one giant endless scrolling page
// Maintained in /UI2/FLPD_CUST
// Heavy initial DOM load for users with 100+ tiles`,
        pros: ['Familiar to older consultants who configured pre-1809 systems'],
        cons: ['Cluttered, overwhelming user experience', 'Slow initial launchpad page load time', 'Deprecated by SAP in modern S/4HANA releases']
      },
      elementB: {
        name: 'Modern Spaces & Pages (Clean Core Standard)',
        syntax: `// Clean top navigation tabs (Spaces)
// Structured Sections inside each Page
// Maintained in /UI2/FDM_PAGE & Content Manager`,
        pros: ['Lightning-fast lazy loading of page tiles', 'Intuitive role-based task grouping', 'Identical layout on S/4HANA On-Premise and SAP BTP Cloud'],
        cons: ['Requires configuring Spaces and Pages in addition to Catalogs']
      },
      comparisonTable: [
        { feature: 'Initial Page Load', elementA: 'Slow (Loads all tiles in 1 DOM)', elementB: 'Instant (Lazy loads active space)', winner: 'Spaces & Pages' },
        { feature: 'Visual Organization', elementA: 'Endless vertical scroll', elementB: 'Clean structured tabs & sections', winner: 'Spaces & Pages' },
        { feature: 'SAP Road Map Support', elementA: 'Deprecated', elementB: 'Standard of the Future', winner: 'Spaces & Pages' }
      ]
    },

    files: [
      {
        path: 'admin/pfcg_assignment_guide.txt',
        language: 'text',
        description: 'Checklist for configuring S/4HANA Fiori Launchpad PFCG Role',
        code: `===================================================================
S/4HANA FIORI LAUNCHPAD PFCG INTEGRATION CHECKLIST:
===================================================================
1. Transaction: /UI2/SEMOBJ
   - Register Semantic Object: Travel

2. Transaction: /UI2/FLPCM_CUST (Launchpad Content Manager)
   - Create Catalog: Z_BC_TRAVEL_ADMIN
   - Add Target Mapping:
     * Semantic Object: Travel
     * Action: manage
     * App Type: SAPUI5 Fiori App
     * Target URL / BSP: /sap/bc/ui5_ui5/sap/ztravel_app
     * Device Types: Desktop, Tablet, Phone
   - Create Tile: "Manage Travels" (Static or Dynamic)

3. Transaction: /UI2/FDM_PAGE (Page Builder)
   - Create Space: Z_SP_TRAVEL ("Corporate Travel")
   - Create Page: Z_PG_TRAVEL ("Travel Workspace")
   - Assign Section: "Bookings & Expenses" -> Add Tile from Catalog

4. Transaction: PFCG (Role Maintenance)
   - Create Role: Z_FIORI_TRAVEL_USER
   - Tab "Menu" -> Insert "SAP Fiori Tile Catalog" -> Z_BC_TRAVEL_ADMIN
   - Tab "Menu" -> Insert "SAP Fiori Space" -> Z_SP_TRAVEL
   - Tab "Authorizations" -> Generate Authorization Profile
   - Tab "User" -> Assign SAP User IDs

5. Access Launchpad:
   - URL: https://s4hana-host:44300/sap/bc/ui2/flp?sap-client=100
===================================================================`
      }
    ]
  },

  // =========================================================================
  // MODULE 6: SAP BUILD WORK ZONE INTEGRATION (SAP BTP CLOUD)
  // =========================================================================
  {
    id: 'fiori-mod-6-workzone',
    day: 6,
    track: 'fiori',
    title: 'Module 6: SAP Build Work Zone Integration (SAP BTP Cloud)',
    subtitle: 'Channel Manager Sync (HTML5 App Repo), Content Manager (URL Apps, Catalogs, Groups/Spaces), and BTP Role Collections',
    readTime: '22 min read',
    vlogHook: "Welcome to the cloud future of SAP user experience: SAP Build Work Zone! In cloud enterprise environments, your users might need to access S/4HANA apps, SuccessFactors HR modules, Ariba procurement, and custom React micro-frontends all from a single corporate digital workplace. Today we master SAP Build Work Zone: Channel Manager synchronization with the HTML5 Application Repository, Content Manager administration, and BTP Cockpit Role Collection mapping.",
    layman: "Think of SAP Build Work Zone like a modern corporate portal (like a high-tech intranet dashboard). Instead of logging into 5 different websites with 5 different passwords, employees log into SAP Build Work Zone and see all their business apps, notifications, company news, and team workspaces in one gorgeous, unified browser tab.",
    technical: "SAP Build Work Zone (Standard & Advanced Editions) is SAP BTP's central digital workplace service. It aggregates content across cloud and on-premise systems via Channel Manager (federating S/4HANA Launchpad content via Common Data Model CDM) and HTML5 Application Repository subscriptions. Security authorization is orchestrated through SAP BTP Cockpit Role Collections mapped to corporate Identity Providers (IdPs) via SAML 2.0 or OpenID Connect (OIDC).",

    deepDiveKeywords: [
      {
        name: '6.1 Channel Manager & HTML5 Application Repository Synchronization',
        sapDocRef: 'SAP Build Work Zone Documentation: Channel Manager & Content Federation',
        syntax: `/* Content Sources in SAP Build Work Zone:
 1. HTML5 Apps Channel (Default):
    Automatically discovers apps deployed to BTP HTML5 Application Repository via MTA.
 2. Content Federation Channels:
    - SAP S/4HANA On-Premise / Cloud (via Cloud Connector + CDM service)
    - SAP SuccessFactors
    - SAP Integrated Business Planning (IBP)

Channel Manager Sync Action:
Navigate to: SAP Build Work Zone Administration -> Channel Manager
Click: "Fetch Updates" on HTML5 Apps Channel
Status changes to: "Synchronized" */`,
        laymanAnalogy: 'Think of Channel Manager like an RSS reader or Spotify podcast feed. When a developer deploys a new app to the BTP Cloud, Channel Manager detects the new release and automatically pulls its icon, name, and routes into the corporate portal catalog.',
        technicalDefinition: `The Channel Manager synchronizes external content providers using the SAP Common Data Model (CDM) specification. When an MTA with an \`html5-apps-repo\` service is deployed, the BTP runtime exposes an \`exposed-content\` payload. The Channel Manager consumes this payload, registers the business app descriptor, and updates the local repository schema.`,
        underTheHood: `The sync mechanism evaluates the \`manifest.json\` \`sap.app\` block, extracting the \`crossNavigation\` inbound definitions to construct local intent mapping tables inside the BTP PostgreSQL tenant database.`,
        commonPitfall: `Deploying an app without declaring \`inbounds\` in \`manifest.json\`. Without an inbound intent definition (\`#SemanticObject-action\`), Work Zone cannot generate a clickable tile for the application.`,
        modernExample: `<!-- manifest.json inbound crossNavigation declaration required for Work Zone: -->
"sap.app": {
  "id": "btp.fiori.travel",
  "crossNavigation": {
    "inbounds": {
      "manage-travel": {
        "semanticObject": "Travel",
        "action": "manage",
        "title": "{{appTitle}}",
        "signature": {
          "parameters": {},
          "additionalParameters": "allowed"
        }
      }
    }
  }
}`,
        springBootBridge: {
          explanation: 'Channel Manager is Kubernetes Service Discovery or Consul catalog sync discovering new microservices.',
          springBootCode: `// Spring Cloud Eureka Service Registration equivalent:
@SpringBootApplication
@EnableEurekaClient
public class TravelServiceApplication { ... }`,
          expressCode: `// Express service registration to Consul/Kubernetes equivalent:
consul.agent.service.register({ name: 'travel-service', address: '10.0.0.5', port: 8080 });`
        }
      },
      {
        name: '6.2 Content Manager in Work Zone: Catalogs, Spaces & Roles',
        sapDocRef: 'SAP Build Work Zone Administration: Managing Content in Content Manager',
        syntax: `/* Steps in SAP Build Work Zone Content Manager:
 1. Content Explorer:
    Browse "HTML5 Apps" channel -> Select "Travel Management App" -> Click "Add to My Content".
 2. Catalogs:
    Create Catalog: "Finance & Travel Operations" -> Assign Travel App.
 3. Spaces & Pages:
    Create Space: "Employee Travel Hub" -> Add Page with sections -> Add Travel Tile.
 4. Roles:
    Create Role: "Travel_Approver_Role" -> Assign Catalog & Space. */`,
        laymanAnalogy: 'Content Manager is your portal editor. You pick apps from the store (Content Explorer), put them into categories (Catalogs), design the user screen layout (Spaces & Pages), and assign access passes (Roles).',
        technicalDefinition: `The Work Zone Content Manager administers the lifecycle of local and federated business content. Applications are assigned to Catalogs for authorization bundling and to Spaces/Pages for layout rendering. Work Zone Roles combine Catalogs and Spaces into deployable entitlement packages.`,
        underTheHood: `Content configurations are serialized into JSON CDM documents and cached in the SAP BTP Redis session layer, delivering sub-100ms dashboard render speeds.`,
        commonPitfall: `Adding an app to a Page without adding it to the user's Catalog. If the app is not in the assigned catalog, the user's role will not authorize the underlying API request, resulting in an authorization load error.`,
        modernExample: `/* Work Zone CDM (Common Data Model) JSON structure generated under the hood: */
{
  "_version": "3.0",
  "identification": { "id": "travel.manager.role", "entityType": "role" },
  "payload": {
    "title": "Corporate Travel Manager",
    "apps": [{ "id": "btp.fiori.travel" }],
    "catalogs": [{ "id": "travel.admin.catalog" }],
    "spaces": [{ "id": "travel.operations.space" }]
  }
}`,
        springBootBridge: {
          explanation: 'Work Zone Content Manager is Okta / Auth0 Application Dashboard or AWS IAM Group Policy administration.',
          springBootCode: `// Auth0 Role Assignment equivalent:
auth0.roles.assignUsers({ id: "rol_travel_manager" }, { users: ["usr_12345"] });`,
          expressCode: `// Express role mapping equivalent:
const rolePermissions = { 'Travel_Approver_Role': ['read:travels', 'approve:travels'] };`
        }
      },
      {
        name: '6.3 SAP BTP Cockpit Role Collections & User Identity Mapping',
        sapDocRef: 'SAP BTP Security Guide: Role Collections, XSUAA & Identity Authentication Service',
        syntax: `/* Steps in SAP BTP Cockpit:
 1. Navigate to: Security -> Role Collections
 2. Create Role Collection: "Travel_Manager_BTP_Collection"
 3. Edit -> Add Role:
    Application Identifier: <workzone-service-instance>
    Role Template: Travel_Approver_Role
 4. Assign Users:
    - Direct User Assignment (e.g. employee.email@corp.com)
    - Group Mapping from Corporate IdP (SAP Cloud Identity Services / Azure AD / Okta) */`,
        laymanAnalogy: 'Role Collections in BTP Cockpit are the final link in the chain. You created the "Travel Manager" role in Work Zone. Now in BTP Cockpit, you say: "Anyone who logs in from our company Azure AD / Okta with the group \'Finance Team\' automatically gets the Travel Manager role!"',
        technicalDefinition: `SAP BTP enforces OAuth 2.0 / SAML 2.0 trust through the SAP Authorization and Trust Management service (XSUAA). Role Collections aggregate individual scopes and role templates. When a user authenticates via SAP Cloud Identity Services (IAS) or corporate Active Directory, their SAML assertion attributes / OIDC claims are mapped to BTP Role Collections dynamically, granting instant single-sign-on (SSO) access to Work Zone.`,
        underTheHood: `When the browser accesses the Work Zone URL, the BTP Approuter initiates an OAuth 2.0 authorization code flow with XSUAA, receiving a signed JWT access token containing the user's \`scope\` and \`xs.system.attributes\` array.`,
        commonPitfall: `Not configuring user email attribute mapping in SAP Cloud Identity Services (IAS), causing BTP Cockpit to receive anonymous or missing sub claims.`,
        modernExample: `/* Sample decoded JWT payload received by SAP Build Work Zone: */
{
  "user_name": "alex.dev@corp.com",
  "scope": [
    "openid",
    "workzone.viewer",
    "travel-app!t1234.Travel_Approver_Role"
  ],
  "exp": 1748000000,
  "iss": "https://my-subaccount.authentication.eu10.hana.ondemand.com/oauth/token"
}`,
        springBootBridge: {
          explanation: 'BTP Role Collection is Spring Security OAuth2 / JWT Resource Server Role Mapping (@PreAuthorize("hasAuthority(\'SCOPE_Travel_Approver\')")).',
          springBootCode: `// Spring Security JWT Authentication Converter mapping BTP Scopes:
@Bean
public JwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtGrantedAuthoritiesConverter converter = new JwtGrantedAuthoritiesConverter();
    converter.setAuthoritiesClaimName("scope");
    converter.setAuthorityPrefix("");
    JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
    jwtConverter.setJwtGrantedAuthoritiesConverter(converter);
    return jwtConverter;
}`,
          expressCode: `// Express JWT scope verification middleware:
import { expressjwt } from 'express-jwt';
app.use(expressjwt({ secret: jwksRsa.expressJwtSecret(...), algorithms: ['RS256'] }));
function checkScope(scope) {
  return (req, res, next) => req.auth.scope.includes(scope) ? next() : res.sendStatus(403);
}`
        }
      }
    ],

    showdown: {
      title: 'Architectural Showdown: S/4HANA On-Premise FLP vs SAP Build Work Zone (BTP Cloud)',
      verdict: 'SAP Build Work Zone is the strategic central digital workplace for intelligent enterprise architecture, federating on-premise S/4HANA content alongside cloud applications under a unified multi-cloud experience.',
      elementA: {
        name: 'S/4HANA On-Premise FLP (/UI2/FLP)',
        syntax: `https://s4hana:44300/sap/bc/ui2/flp
-> Strictly serves S/4HANA ERP apps on that single system
-> Direct ABAP kernel session handling`,
        pros: ['Zero cloud subscription costs', 'Lowest latency for on-premise local intranet users'],
        cons: ['Siloed to one S/4HANA system (cannot natively aggregate Ariba, SuccessFactors, or external apps)', 'Requires VPN for remote mobile access']
      },
      elementB: {
        name: 'SAP Build Work Zone (SAP BTP Cloud)',
        syntax: `https://my-subaccount.workzone.ondemand.com
-> Central digital workplace across multi-cloud enterprise
-> Integrates S/4HANA, SuccessFactors, BTP, and custom React apps`,
        pros: ['True enterprise-wide single pane of glass', 'Native SSO integration with corporate Azure AD / Okta', 'Supports custom micro-frontends and collaborative workspaces'],
        cons: ['Requires SAP BTP cloud subscription and destination service configuration']
      },
      comparisonTable: [
        { feature: 'Cross-System Federation', elementA: 'Single S/4HANA System Only', elementB: 'Multi-Cloud (S/4HANA + SuccessFactors + Custom)', winner: 'SAP Build Work Zone' },
        { feature: 'Identity Integration', elementA: 'S/4HANA User Master (SU01)', elementB: 'Corporate SSO (Azure AD / Okta / IAS)', winner: 'SAP Build Work Zone' },
        { feature: 'Clean Core Alignment', elementA: 'Traditional On-Premise', elementB: 'Strategic Cloud Standard', winner: 'SAP Build Work Zone' }
      ]
    },

    files: [
      {
        path: 'cloud/workzone_deployment_manifest.json',
        language: 'json',
        description: 'Common Data Model (CDM) configuration for Work Zone Cloud federation',
        code: `{
  "_version": "3.0",
  "identification": {
    "id": "com.sap.fiori.travel.portal",
    "entityType": "bundle"
  },
  "payload": {
    "catalogs": [
      {
        "id": "CATALOG_TRAVEL_OPS",
        "title": "Corporate Travel Operations",
        "appIds": ["btp.fiori.travel"]
      }
    ],
    "spaces": [
      {
        "id": "SPACE_TRAVEL_GLOBAL",
        "title": "Travel & Expense",
        "pages": [
          {
            "id": "PAGE_TRAVEL_SUMMARY",
            "title": "Travel Dashboard",
            "sections": [
              {
                "title": "Core Applications",
                "tileIds": ["btp.fiori.travel.tile"]
              }
            ]
          }
        ]
      }
    ]
  }
}`
      }
    ]
  }
];

export const FIORI_LESSONS = BASE_FIORI_LESSONS.map((l) => {
  const modAssignments = FIORI_ASSIGNMENTS[l.id] || [];
  const bridge = FIORI_BRIDGES[l.id] || null;
  return {
    ...l,
    beginnerBridge: bridge,
    assignments: modAssignments,
    assignment: modAssignments[9] || modAssignments[0] || null
  };
});

export default FIORI_LESSONS;
