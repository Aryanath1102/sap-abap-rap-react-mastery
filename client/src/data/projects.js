export const LIFECYCLE_STEPS = [
  '1. Business requirement analysis & user story mapping',
  '2. Functional specification & SAP architecture sign-off',
  '3. Database table design with UUID keys and timestamps',
  '4. CDS Interface View Entity (ZI_*) creation',
  '5. Associations and Compositions modeling',
  '6. Behavior Definition (BDEF) with strict ( 2 )',
  '7. Behavior Implementation pool class creation (ZBP_*)',
  '8. Validations on save (business constraints & T100 messages)',
  '9. Determinations on modify/save (derived fields & statuses)',
  '10. Actions and Dynamic Feature Control implementation',
  '11. DCL Authorization policy & access control',
  '12. Draft table generation and draft lifecycle configuration',
  '13. Service Definition (ZSD_* / ZAPI_*) with entity aliases',
  '14. Service Binding (ZSB_* OData V4 - Web API) publishing',
  '15. OData V4 API testing in ADT / Swagger / Postman',
  '16. React frontend component architecture & state setup',
  '17. React fetch() service with X-CSRF-Token handshake',
  '18. React CRUD forms, delta PATCH, and error parsing',
  '19. ABAP Unit test class development with test doubles',
  '20. Clean Core ATC code inspection & production release check'
];

export const PROJECTS = [
  // ==========================================
  // BEGINNER PROJECTS (1 - 5)
  // ==========================================
  {
    id: 'p1',
    name: 'Employee Management System',
    tier: 'Beginner',
    focus: 'Managed RAP CRUD + React Table & Form + Salary Validation',
    summary: 'Build a production-ready employee master data platform with automated UUID numbering, salary sanity validation on save, and a responsive React management table with search and modal form.',
    technologies: ['Managed RAP', 'CDS View Entity', 'OData V4 Web API', 'React fetch()', 'Tailwind CSS'],
    dbTable: `@EndUserText.label: 'Employee Persistence Table'
@AbapCatalog.enhancement.category: #NOT_EXTENSIBLE
@AbapCatalog.tableCategory: #TRANSPARENT
@AbapCatalog.deliveryClass: #A
@AbapCatalog.dataMaintenance: #RESTRICTED
define table zemp_table_db {
  key client    : abap.clnt not null;
  key emp_uuid  : sysuuid_x16 not null;
  emp_id        : abap.char(10);
  first_name    : abap.char(40);
  last_name     : abap.char(40);
  email         : abap.char(100);
  salary        : abap.curr(15,2);
  currency_code : abap.cuky;
  status        : abap.char(20);
  created_at    : timestampl;
  last_changed_at : timestampl;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Employee Root Interface View'
define root view entity ZI_Employee
  as select from zemp_table_db
{
  key emp_uuid        as EmployeeUUID,
      emp_id          as EmployeeId,
      first_name      as FirstName,
      last_name       as LastName,
      email           as Email,
      @Semantics.amount.currencyCode: 'CurrencyCode'
      salary          as Salary,
      currency_code   as CurrencyCode,
      status          as Status,
      @Semantics.systemDateTime.createdAt: true
      created_at      as CreatedAt,
      @Semantics.systemDateTime.lastChangedAt: true
      last_changed_at as LastChangedAt
}`,
    projectionView: `@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Employee Projection View'
@Metadata.allowExtensions: true
define root view entity ZC_Employee
  provider contract transactional_query
  as projection on ZI_Employee
{
  key EmployeeUUID,
      EmployeeId,
      FirstName,
      LastName,
      Email,
      Salary,
      CurrencyCode,
      Status,
      LastChangedAt
}`,
    bdef: `managed implementation in class zbp_i_employee unique;
strict ( 2 );

define behavior for ZI_Employee alias Employee
persistent table zemp_table_db
lock master
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;

  field ( readonly, numbering : managed ) EmployeeUUID;
  field ( readonly ) CreatedAt, LastChangedAt;
  field ( mandatory ) EmployeeId, LastName, Salary;

  validation validateSalary on save { field Salary; create; update; }
  determination setInitialStatus on modify { create; }

  mapping for zemp_table_db
  {
    EmployeeUUID  = emp_uuid;
    EmployeeId    = emp_id;
    FirstName     = first_name;
    LastName      = last_name;
    Email         = email;
    Salary        = salary;
    CurrencyCode  = currency_code;
    Status        = status;
    CreatedAt     = created_at;
    LastChangedAt = last_changed_at;
  }
}`,
    behaviorPool: `CLASS lhc_employee DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    METHODS validateSalary FOR VALIDATE ON SAVE
      IMPORTING keys FOR Employee~validateSalary.

    METHODS setInitialStatus FOR DETERMINE ON MODIFY
      IMPORTING keys FOR Employee~setInitialStatus.
ENDCLASS.

CLASS lhc_employee IMPLEMENTATION.
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
            text     = 'Employee salary must be strictly greater than zero.'
          )
          %element-Salary = if_abap_behv=>mk-on
        ) TO reported-employee.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

  METHOD setInitialStatus.
    MODIFY ENTITIES OF zi_employee IN LOCAL MODE
      ENTITY Employee
      UPDATE FIELDS ( Status )
      WITH VALUE #( FOR k IN keys ( %tky = k-%tky Status = 'ACTIVE' ) ).
  ENDMETHOD.
ENDCLASS.`,
    service: `@EndUserText.label: 'Employee Service Definition'
define service ZAPI_EMPLOYEE_O4 {
  expose ZC_Employee as Employee;
}
* Service Binding:
* Name: ZSB_EMPLOYEE_O4
* Binding Type: OData V4 - Web API
* URL: /sap/opu/odata4/sap/zapi_employee_o4/srvd/sap/zapi_employee_o4/0001/Employee`,
    react: `// React OData V4 Employee Service & Component
import React, { useState, useEffect } from 'react';

const API_BASE = '/sap/opu/odata4/sap/zapi_employee_o4/srvd/sap/zapi_employee_o4/0001';

export function EmployeeApp() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ EmployeeId: '', FirstName: '', LastName: '', Email: '', Salary: 75000, CurrencyCode: 'USD' });
  const [error, setError] = useState(null);

  async function loadEmployees() {
    try {
      setLoading(true);
      const res = await fetch(\`\${API_BASE}/Employee?$top=25&$count=true\`);
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      const data = await res.json();
      setEmployees(data.value || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      // 1. Fetch CSRF token
      const tokenRes = await fetch(\`\${API_BASE}/\`, {
        method: 'HEAD',
        headers: { 'X-CSRF-Token': 'Fetch' },
        credentials: 'include'
      });
      const csrf = tokenRes.headers.get('x-csrf-token');

      // 2. POST new employee
      const res = await fetch(\`\${API_BASE}/Employee\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrf
        },
        credentials: 'include',
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || 'Create failed');
      }

      setForm({ EmployeeId: '', FirstName: '', LastName: '', Email: '', Salary: 75000, CurrencyCode: 'USD' });
      loadEmployees();
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { loadEmployees(); }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">Employee Directory (RAP OData V4)</h2>
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
      {/* Table & Form render */}
    </div>
  );
}`
  },

  {
    id: 'p2',
    name: 'Department Management System',
    tier: 'Beginner',
    focus: 'CDS Value Help + Validations + Cascading Delete Prevention',
    summary: 'Manage corporate organizational departments, cost centers, and department managers with CDS Value Help annotations and RAP validations preventing orphaned employee assignments.',
    technologies: ['Managed RAP', 'CDS View Entity', 'Value Help', 'OData V4', 'React'],
    dbTable: `define table zdept_table_db {
  key client      : abap.clnt not null;
  key dept_uuid   : sysuuid_x16 not null;
  dept_id         : abap.char(10);
  dept_name       : abap.char(50);
  cost_center     : abap.char(10);
  manager_id      : abap.char(10);
  created_at      : timestampl;
  last_changed_at : timestampl;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Department Interface View'
define root view entity ZI_Department
  as select from zdept_table_db
{
  key dept_uuid       as DepartmentUUID,
      dept_id         as DepartmentId,
      dept_name       as DepartmentName,
      cost_center     as CostCenter,
      manager_id      as ManagerId,
      created_at      as CreatedAt,
      last_changed_at as LastChangedAt
}`,
    projectionView: `@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Department Projection View'
define root view entity ZC_Department
  provider contract transactional_query
  as projection on ZI_Department
{
  key DepartmentUUID,
      DepartmentId,
      DepartmentName,
      CostCenter,
      ManagerId,
      LastChangedAt
}`,
    bdef: `managed implementation in class zbp_i_department unique;
strict ( 2 );

define behavior for ZI_Department alias Department
persistent table zdept_table_db
lock master
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;

  field ( readonly, numbering : managed ) DepartmentUUID;
  field ( mandatory ) DepartmentId, DepartmentName, CostCenter;

  validation validateDepartmentId on save { field DepartmentId; create; }

  mapping for zdept_table_db
  {
    DepartmentUUID = dept_uuid;
    DepartmentId   = dept_id;
    DepartmentName = dept_name;
    CostCenter     = cost_center;
    ManagerId      = manager_id;
    CreatedAt      = created_at;
    LastChangedAt  = last_changed_at;
  }
}`,
    behaviorPool: `CLASS lhc_department DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    METHODS validateDepartmentId FOR VALIDATE ON SAVE
      IMPORTING keys FOR Department~validateDepartmentId.
ENDCLASS.

CLASS lhc_department IMPLEMENTATION.
  METHOD validateDepartmentId.
    READ ENTITIES OF zi_department IN LOCAL MODE
      ENTITY Department FIELDS ( DepartmentId )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_depts).

    LOOP AT lt_depts INTO DATA(ls_dept).
      IF ls_dept-DepartmentId IS INITIAL.
        APPEND VALUE #( %tky = ls_dept-%tky ) TO failed-department.
        APPEND VALUE #(
          %tky = ls_dept-%tky
          %msg = new_message_with_text( severity = if_abap_behv_message=>severity-error text = 'Department ID cannot be empty.' )
        ) TO reported-department.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.`,
    service: `define service ZAPI_DEPARTMENT_O4 {
  expose ZC_Department as Department;
}`,
    react: `// React Department Service with OData V4
export async function getDepartments() {
  const res = await fetch('/sap/opu/odata4/sap/zapi_department_o4/srvd/sap/zapi_department_o4/0001/Department');
  const data = await res.json();
  return data.value;
}`
  },

  {
    id: 'p3',
    name: 'Product Catalog System',
    tier: 'Beginner',
    focus: 'Modern ABAP SQL + OData V4 $filter & $orderby + Currency Support',
    summary: 'A fast e-commerce catalog featuring product categorization, price currency conversions, server-side search filters, and real-time inventory quantity status.',
    technologies: ['Modern ABAP SQL', 'CDS View Entity', 'OData V4', 'React Table', 'Debounced Search'],
    dbTable: `define table zprod_catalog_db {
  key client      : abap.clnt not null;
  key prod_uuid   : sysuuid_x16 not null;
  prod_id         : abap.char(18);
  name            : abap.char(60);
  category        : abap.char(30);
  price           : abap.curr(15,2);
  currency        : abap.cuky;
  stock_qty       : abap.int4;
  last_changed_at : timestampl;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_ProductCatalog
  as select from zprod_catalog_db
{
  key prod_uuid       as ProductUUID,
      prod_id         as ProductId,
      name            as ProductName,
      category        as Category,
      @Semantics.amount.currencyCode: 'Currency'
      price           as Price,
      currency        as Currency,
      stock_qty       as StockQuantity,
      last_changed_at as LastChangedAt
}`,
    projectionView: `define root view entity ZC_ProductCatalog
  provider contract transactional_query
  as projection on ZI_ProductCatalog
{
  key ProductUUID,
      ProductId,
      ProductName,
      Category,
      Price,
      Currency,
      StockQuantity,
      LastChangedAt
}`,
    bdef: `managed implementation in class zbp_i_prod_catalog unique;
strict ( 2 );

define behavior for ZI_ProductCatalog alias Product
persistent table zprod_catalog_db
lock master
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;
  field ( readonly, numbering : managed ) ProductUUID;
  field ( mandatory ) ProductId, ProductName, Price;
}`,
    behaviorPool: `CLASS lhc_product DEFINITION INHERITING FROM cl_abap_behavior_handler.
ENDCLASS.
CLASS lhc_product IMPLEMENTATION.
ENDCLASS.`,
    service: `define service ZAPI_PROD_CATALOG_O4 {
  expose ZC_ProductCatalog as Product;
}`,
    react: `export async function searchProducts(searchTerm) {
  const filter = searchTerm ? \`&$filter=contains(ProductName, '\${searchTerm}')\` : '';
  const res = await fetch(\`/sap/opu/odata4/sap/zapi_prod_catalog_o4/srvd/sap/zapi_prod_catalog_o4/0001/Product?$top=50\${filter}\`);
  const data = await res.json();
  return data.value;
}`
  },

  {
    id: 'p4',
    name: 'Customer Management System',
    tier: 'Beginner',
    focus: 'I_BusinessPartner Released API + Clean Core Compliance',
    summary: 'Build a compliant B2B customer directory reading standard SAP Business Partners strictly through the officially released Level A CDS View Entity I_BusinessPartner.',
    technologies: ['Clean Core', 'I_BusinessPartner', 'ABAP Cloud', 'OData V4', 'React'],
    dbTable: `* Clean Core Note: Custom extension data persists in custom Z table:
define table zcust_ext_db {
  key client      : abap.clnt not null;
  key bp_id       : abap.char(10) not null;
  loyalty_tier    : abap.char(20);
  account_manager : abap.char(30);
  notes           : abap.char(255);
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_CustomerDirectory
  as select from i_businesspartner as BP
  left outer join zcust_ext_db    as Ext on Ext.bp_id = BP.businesspartner
{
  key BP.businesspartner         as CustomerId,
      BP.businesspartnerfullname as FullName,
      BP.createdbyuser           as CreatedBy,
      Ext.loyalty_tier           as LoyaltyTier,
      Ext.account_manager        as AccountManager
}`,
    projectionView: `define root view entity ZC_CustomerDirectory
  provider contract transactional_query
  as projection on ZI_CustomerDirectory
{
  key CustomerId,
      FullName,
      CreatedBy,
      LoyaltyTier,
      AccountManager
}`,
    bdef: `* Read-only or unmanaged save extension for Clean Core customer data
managed implementation in class zbp_i_cust_dir unique;
strict ( 2 );
define behavior for ZI_CustomerDirectory alias Customer
lock master
authorization master ( instance )
{
  update;
}`,
    behaviorPool: `CLASS lhc_customer DEFINITION INHERITING FROM cl_abap_behavior_handler.
ENDCLASS.
CLASS lhc_customer IMPLEMENTATION.
ENDCLASS.`,
    service: `define service ZAPI_CUSTOMER_DIR_O4 {
  expose ZC_CustomerDirectory as Customer;
}`,
    react: `export async function fetchCustomers() {
  const res = await fetch('/sap/opu/odata4/sap/zapi_customer_dir_o4/srvd/sap/zapi_customer_dir_o4/0001/Customer?$top=20');
  const data = await res.json();
  return data.value;
}`
  },

  {
    id: 'p5',
    name: 'Leave Management System',
    tier: 'Beginner',
    focus: 'Dates Validation + Bound Approve/Reject Actions + Feature Control',
    summary: 'Employees submit paid time-off requests; managers review pending requests and execute Approve or Reject actions with dynamic button enabling via Instance Feature Control.',
    technologies: ['RAP Actions', 'Feature Control', 'Date Validations', 'OData V4', 'React'],
    dbTable: `define table zleave_req_db {
  key client      : abap.clnt not null;
  key req_uuid    : sysuuid_x16 not null;
  emp_id          : abap.char(10);
  start_date      : abap.dats;
  end_date        : abap.dats;
  leave_type      : abap.char(20);
  status          : abap.char(20);
  last_changed_at : timestampl;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_LeaveRequest
  as select from zleave_req_db
{
  key req_uuid        as RequestUUID,
      emp_id          as EmployeeId,
      start_date      as StartDate,
      end_date        as EndDate,
      leave_type      as LeaveType,
      status          as Status,
      last_changed_at as LastChangedAt
}`,
    projectionView: `define root view entity ZC_LeaveRequest
  provider contract transactional_query
  as projection on ZI_LeaveRequest
{
  key RequestUUID,
      EmployeeId,
      StartDate,
      EndDate,
      LeaveType,
      Status,
      LastChangedAt
}`,
    bdef: `managed implementation in class zbp_i_leave_req unique;
strict ( 2 );
define behavior for ZI_LeaveRequest alias LeaveRequest
persistent table zleave_req_db
lock master
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;

  action ( features : instance ) approveRequest result [1] $self;
  action ( features : instance ) rejectRequest result [1] $self;
  validation validateDates on save { field StartDate, EndDate; create; }
}`,
    behaviorPool: `CLASS lhc_leave DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    METHODS get_instance_features FOR INSTANCE FEATURES
      IMPORTING keys REQUEST requested_features FOR LeaveRequest RESULT result.
    METHODS approveRequest FOR MODIFY
      IMPORTING keys FOR ACTION LeaveRequest~approveRequest RESULT result.
    METHODS validateDates FOR VALIDATE ON SAVE
      IMPORTING keys FOR LeaveRequest~validateDates.
ENDCLASS.

CLASS lhc_leave IMPLEMENTATION.
  METHOD get_instance_features.
    READ ENTITIES OF zi_leaverequest IN LOCAL MODE
      ENTITY LeaveRequest FIELDS ( Status ) WITH CORRESPONDING #( keys )
      RESULT DATA(lt_reqs).

    result = VALUE #( FOR r IN lt_reqs
      ( %tky = r-%tky
        %action-approveRequest = COND #( WHEN r-Status = 'APPROVED' THEN if_abap_behv=>fc-o-disabled ELSE if_abap_behv=>fc-o-enabled )
        %action-rejectRequest  = COND #( WHEN r-Status = 'REJECTED' THEN if_abap_behv=>fc-o-disabled ELSE if_abap_behv=>fc-o-enabled )
      )
    ).
  ENDMETHOD.

  METHOD approveRequest.
    MODIFY ENTITIES OF zi_leaverequest IN LOCAL MODE
      ENTITY LeaveRequest UPDATE FIELDS ( Status )
      WITH VALUE #( FOR k IN keys ( %tky = k-%tky Status = 'APPROVED' ) ).
  ENDMETHOD.

  METHOD validateDates.
    READ ENTITIES OF zi_leaverequest IN LOCAL MODE
      ENTITY LeaveRequest FIELDS ( StartDate EndDate ) WITH CORRESPONDING #( keys )
      RESULT DATA(lt_reqs).
    LOOP AT lt_reqs INTO DATA(ls_r) WHERE EndDate < StartDate.
      APPEND VALUE #( %tky = ls_r-%tky ) TO failed-leaverequest.
      APPEND VALUE #( %tky = ls_r-%tky %msg = new_message_with_text( severity = if_abap_behv_message=>severity-error text = 'End date cannot be prior to start date.' ) ) TO reported-leaverequest.
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.`,
    service: `define service ZAPI_LEAVE_REQ_O4 {
  expose ZC_LeaveRequest as LeaveRequest;
}`,
    react: `export async function approveLeave(requestUUID) {
  const token = await getCsrfToken();
  const res = await fetch(\`/sap/opu/odata4/sap/zapi_leave_req_o4/srvd/sap/zapi_leave_req_o4/0001/LeaveRequest(\${requestUUID})/com.sap.gateway.srvd.zapi_leave_req_o4.v0001.approveRequest\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': token },
    body: JSON.stringify({})
  });
  return res.json();
}`
  },

  // ==========================================
  // INTERMEDIATE PROJECTS (6 - 10)
  // ==========================================
  {
    id: 'p6',
    name: 'Inventory & Stock Movement System',
    tier: 'Intermediate',
    focus: 'Stock Determinations + EML Stock Adjustments + Negative Stock Validation',
    summary: 'Track real-time warehouse inventory balances, post goods receipts and goods issues with EML, and prevent negative stock violations during save.',
    technologies: ['EML', 'Determinations', 'Stock Balances', 'OData V4', 'React'],
    dbTable: `define table zstock_db {
  key client      : abap.clnt not null;
  key item_uuid   : sysuuid_x16 not null;
  material_id     : abap.char(18);
  plant           : abap.char(4);
  storage_loc     : abap.char(4);
  quantity        : abap.quan(13,3);
  unit            : abap.unit(3);
  last_changed_at : timestampl;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_StockItem
  as select from zstock_db
{
  key item_uuid       as ItemUUID,
      material_id     as MaterialId,
      plant           as Plant,
      storage_loc     as StorageLocation,
      quantity        as Quantity,
      unit            as Unit,
      last_changed_at as LastChangedAt
}`,
    projectionView: `define root view entity ZC_StockItem
  provider contract transactional_query
  as projection on ZI_StockItem
{
  key ItemUUID,
      MaterialId,
      Plant,
      StorageLocation,
      Quantity,
      Unit,
      LastChangedAt
}`,
    bdef: `managed implementation in class zbp_i_stock unique;
strict ( 2 );
define behavior for ZI_StockItem alias StockItem
persistent table zstock_db
lock master
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;
  validation validateQuantity on save { field Quantity; create; update; }
}`,
    behaviorPool: `CLASS lhc_stock DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    METHODS validateQuantity FOR VALIDATE ON SAVE
      IMPORTING keys FOR StockItem~validateQuantity.
ENDCLASS.
CLASS lhc_stock IMPLEMENTATION.
  METHOD validateQuantity.
    READ ENTITIES OF zi_stockitem IN LOCAL MODE
      ENTITY StockItem FIELDS ( Quantity ) WITH CORRESPONDING #( keys )
      RESULT DATA(lt_items).
    LOOP AT lt_items INTO DATA(ls_i) WHERE Quantity < 0.
      APPEND VALUE #( %tky = ls_i-%tky ) TO failed-stockitem.
      APPEND VALUE #( %tky = ls_i-%tky %msg = new_message_with_text( severity = if_abap_behv_message=>severity-error text = 'Stock quantity cannot be negative.' ) ) TO reported-stockitem.
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.`,
    service: `define service ZAPI_STOCK_O4 {
  expose ZC_StockItem as StockItem;
}`,
    react: `// React stock overview
export async function getStockOverview() {
  const res = await fetch('/sap/opu/odata4/sap/zapi_stock_o4/srvd/sap/zapi_stock_o4/0001/StockItem');
  return (await res.json()).value;
}`
  },

  {
    id: 'p7',
    name: 'Purchase Requisition System',
    tier: 'Intermediate',
    focus: 'Header-Item Composition Tree + Total Aggregation with REDUCE',
    summary: 'Model a two-level Business Object composition tree (Purchase Requisition Header -> Line Items), calculate total estimated cost via REDUCE, and enforce item-level validations.',
    technologies: ['Composition Tree', 'Child Entities', 'REDUCE Aggregation', 'OData V4', 'React Nested Tables'],
    dbTable: `define table zpr_header_db {
  key client      : abap.clnt not null;
  key pr_uuid     : sysuuid_x16 not null;
  pr_number       : abap.char(10);
  description     : abap.char(80);
  total_amount    : abap.curr(15,2);
  currency        : abap.cuky;
  last_changed_at : timestampl;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_PurchaseReqHeader
  as select from zpr_header_db
  composition [0..*] of ZI_PurchaseReqItem as _Items
{
  key pr_uuid         as PrUUID,
      pr_number       as PrNumber,
      description     as Description,
      total_amount    as TotalAmount,
      currency        as Currency,
      last_changed_at as LastChangedAt,
      _Items
}`,
    projectionView: `define root view entity ZC_PurchaseReqHeader
  provider contract transactional_query
  as projection on ZI_PurchaseReqHeader
{
  key PrUUID,
      PrNumber,
      Description,
      TotalAmount,
      Currency,
      LastChangedAt,
      _Items : redirected to composition child ZC_PurchaseReqItem
}`,
    bdef: `managed implementation in class zbp_i_pr unique;
strict ( 2 );
define behavior for ZI_PurchaseReqHeader alias PRHeader
persistent table zpr_header_db
lock master
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;
  association _Items { create; }
}`,
    behaviorPool: `CLASS lhc_pr DEFINITION INHERITING FROM cl_abap_behavior_handler.
ENDCLASS.
CLASS lhc_pr IMPLEMENTATION.
ENDCLASS.`,
    service: `define service ZAPI_PR_O4 {
  expose ZC_PurchaseReqHeader as PurchaseRequisition;
  expose ZC_PurchaseReqItem as PurchaseRequisitionItem;
}`,
    react: `// Deep load PR with line items via $expand
export async function getPRWithItems(prUUID) {
  const res = await fetch(\`/sap/opu/odata4/sap/zapi_pr_o4/srvd/sap/zapi_pr_o4/0001/PurchaseRequisition(\${prUUID})?$expand=_Items\`);
  return res.json();
}`
  },

  {
    id: 'p8',
    name: 'Vendor Management System',
    tier: 'Intermediate',
    focus: 'DCL Authorization (PFCG) + Fuzzy Search + I_Supplier Released API',
    summary: 'Secure vendor records using CDS Data Control Language (DCL) access policies based on purchasing organization, and connect to released supplier data.',
    technologies: ['DCL Authorization', 'Clean Core', 'I_Supplier', 'OData V4', 'React'],
    dbTable: `define table zvendor_ext_db {
  key client      : abap.clnt not null;
  key vendor_id   : abap.char(10) not null;
  rating          : abap.char(5);
  compliance_ok   : abap.char(1);
  risk_score      : abap.int4;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_Vendor
  as select from i_supplier as Supplier
  left outer join zvendor_ext_db as Ext on Ext.vendor_id = Supplier.supplier
{
  key Supplier.supplier     as VendorId,
      Supplier.suppliername as VendorName,
      Ext.rating            as Rating,
      Ext.risk_score        as RiskScore
}`,
    projectionView: `define root view entity ZC_Vendor
  provider contract transactional_query
  as projection on ZI_Vendor
{
  key VendorId,
      VendorName,
      Rating,
      RiskScore
}`,
    bdef: `managed implementation in class zbp_i_vendor unique;
strict ( 2 );
define behavior for ZI_Vendor alias Vendor
lock master
authorization master ( instance )
{
  update;
}`,
    behaviorPool: `CLASS lhc_vendor DEFINITION INHERITING FROM cl_abap_behavior_handler.
ENDCLASS.
CLASS lhc_vendor IMPLEMENTATION.
ENDCLASS.`,
    service: `define service ZAPI_VENDOR_O4 {
  expose ZC_Vendor as Vendor;
}`,
    react: `export async function getVendors() {
  const res = await fetch('/sap/opu/odata4/sap/zapi_vendor_o4/srvd/sap/zapi_vendor_o4/0001/Vendor');
  return (await res.json()).value;
}`
  },

  {
    id: 'p9',
    name: 'Expense Management System',
    tier: 'Intermediate',
    focus: 'Expense Receipt Totals + REDUCE / Determinations + Currency Exchange',
    summary: 'Employees submit travel expenses with attached digital receipts; determinations automatically calculate line item taxes and sum total claims using REDUCE.',
    technologies: ['REDUCE', 'Determinations', 'Child Entities', 'OData V4', 'React'],
    dbTable: `define table zexpense_db {
  key client      : abap.clnt not null;
  key claim_uuid  : sysuuid_x16 not null;
  claim_id        : abap.char(10);
  claimant        : abap.char(40);
  total_claim     : abap.curr(15,2);
  currency        : abap.cuky;
  last_changed_at : timestampl;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_ExpenseClaim
  as select from zexpense_db
{
  key claim_uuid      as ClaimUUID,
      claim_id        as ClaimId,
      claimant        as Claimant,
      total_claim     as TotalClaim,
      currency        as Currency,
      last_changed_at as LastChangedAt
}`,
    projectionView: `define root view entity ZC_ExpenseClaim
  provider contract transactional_query
  as projection on ZI_ExpenseClaim
{
  key ClaimUUID,
      ClaimId,
      Claimant,
      TotalClaim,
      Currency,
      LastChangedAt
}`,
    bdef: `managed implementation in class zbp_i_expense unique;
strict ( 2 );
define behavior for ZI_ExpenseClaim alias ExpenseClaim
persistent table zexpense_db
lock master
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;
}`,
    behaviorPool: `CLASS lhc_expense DEFINITION INHERITING FROM cl_abap_behavior_handler.
ENDCLASS.
CLASS lhc_expense IMPLEMENTATION.
ENDCLASS.`,
    service: `define service ZAPI_EXPENSE_O4 {
  expose ZC_ExpenseClaim as ExpenseClaim;
}`,
    react: `export async function getClaims() {
  const res = await fetch('/sap/opu/odata4/sap/zapi_expense_o4/srvd/sap/zapi_expense_o4/0001/ExpenseClaim');
  return (await res.json()).value;
}`
  },

  {
    id: 'p10',
    name: 'IT Service Request Management',
    tier: 'Intermediate',
    focus: 'Status Feature Control + Dynamic Workflow Actions (Assign, Escalate, Close)',
    summary: 'A complete IT helpdesk ticketing system with dynamic status transitions: OPEN -> IN_PROGRESS -> ESCALATED -> RESOLVED with role-based action gating.',
    technologies: ['State Machine', 'Actions', 'Dynamic Feature Control', 'OData V4', 'React Kanban'],
    dbTable: `define table zticket_db {
  key client      : abap.clnt not null;
  key ticket_uuid : sysuuid_x16 not null;
  ticket_id       : abap.char(10);
  subject         : abap.char(100);
  priority        : abap.char(10);
  status          : abap.char(20);
  assigned_to     : abap.char(40);
  last_changed_at : timestampl;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_Ticket
  as select from zticket_db
{
  key ticket_uuid     as TicketUUID,
      ticket_id       as TicketId,
      subject         as Subject,
      priority        as Priority,
      status          as Status,
      assigned_to     as AssignedTo,
      last_changed_at as LastChangedAt
}`,
    projectionView: `define root view entity ZC_Ticket
  provider contract transactional_query
  as projection on ZI_Ticket
{
  key TicketUUID,
      TicketId,
      Subject,
      Priority,
      Status,
      AssignedTo,
      LastChangedAt
}`,
    bdef: `managed implementation in class zbp_i_ticket unique;
strict ( 2 );
define behavior for ZI_Ticket alias Ticket
persistent table zticket_db
lock master
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;
  action ( features : instance ) assignTicket parameter z_assign_param result [1] $self;
  action ( features : instance ) resolveTicket result [1] $self;
}`,
    behaviorPool: `CLASS lhc_ticket DEFINITION INHERITING FROM cl_abap_behavior_handler.
ENDCLASS.
CLASS lhc_ticket IMPLEMENTATION.
ENDCLASS.`,
    service: `define service ZAPI_TICKET_O4 {
  expose ZC_Ticket as Ticket;
}`,
    react: `export async function resolveTicket(uuid) {
  const csrf = await getCsrfToken();
  const res = await fetch(\`/sap/opu/odata4/sap/zapi_ticket_o4/srvd/sap/zapi_ticket_o4/0001/Ticket(\${uuid})/com.sap.gateway.srvd.zapi_ticket_o4.v0001.resolveTicket\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
    body: JSON.stringify({})
  });
  return res.json();
}`
  },

  // ==========================================
  // ADVANCED ENTERPRISE PROJECTS (11 - 18)
  // ==========================================
  {
    id: 'p11',
    name: 'Sales Order Processing System',
    tier: 'Advanced Enterprise',
    focus: 'Header-Item + Draft Handling + Deep Create + ETag Concurrency',
    summary: 'Full-scale enterprise Sales Order system with Header-Item composition, draft auto-save, deep create in one OData V4 POST payload, credit check validations, and item price recalculations.',
    technologies: ['Draft Handling', 'Deep Create', 'Composition Tree', 'Side Effects', 'React Cart'],
    dbTable: `define table zso_head_db {
  key client      : abap.clnt not null;
  key so_uuid     : sysuuid_x16 not null;
  order_number    : abap.char(10);
  customer_id     : abap.char(10);
  order_date      : abap.dats;
  net_amount      : abap.curr(15,2);
  tax_amount      : abap.curr(15,2);
  currency        : abap.cuky;
  status          : abap.char(20);
  last_changed_at : timestampl;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_SalesOrderHeader
  as select from zso_head_db
  composition [0..*] of ZI_SalesOrderItem as _Items
{
  key so_uuid         as OrderUUID,
      order_number    as OrderNumber,
      customer_id     as CustomerId,
      order_date      as OrderDate,
      net_amount      as NetAmount,
      tax_amount      as TaxAmount,
      currency        as Currency,
      status          as Status,
      last_changed_at as LastChangedAt,
      _Items
}`,
    projectionView: `define root view entity ZC_SalesOrderHeader
  provider contract transactional_query
  as projection on ZI_SalesOrderHeader
{
  key OrderUUID,
      OrderNumber,
      CustomerId,
      OrderDate,
      NetAmount,
      TaxAmount,
      Currency,
      Status,
      LastChangedAt,
      _Items : redirected to composition child ZC_SalesOrderItem
}`,
    bdef: `managed implementation in class zbp_i_sales_order unique;
strict ( 2 );
with draft;

define behavior for ZI_SalesOrderHeader alias Order
persistent table zso_head_db
draft table zso_head_d
lock master total etag LastChangedAt
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;
  association _Items { create; with draft; }

  draft action Edit;
  draft action Activate optimized;
  draft action Discard;
  draft action Resume;
  draft determine action Prepare { validation validateCustomer; }
}`,
    behaviorPool: `CLASS lhc_order DEFINITION INHERITING FROM cl_abap_behavior_handler.
ENDCLASS.
CLASS lhc_order IMPLEMENTATION.
ENDCLASS.`,
    service: `define service ZAPI_SALES_ORDER_O4 {
  expose ZC_SalesOrderHeader as SalesOrder;
  expose ZC_SalesOrderItem as SalesOrderItem;
}`,
    react: `// Deep Create: creates order header and nested items in one atomic OData V4 call
export async function createSalesOrderDeep(payload) {
  const csrf = await getCsrfToken();
  const res = await fetch('/sap/opu/odata4/sap/zapi_sales_order_o4/srvd/sap/zapi_sales_order_o4/0001/SalesOrder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  return res.json();
}`
  },

  {
    id: 'p12',
    name: 'Purchase Order Management System',
    tier: 'Advanced Enterprise',
    focus: 'Approval Workflow Actions + Side Effects + I_PurchaseOrderAPI01 Integration',
    summary: 'Enterprise procurement with multi-level approval thresholds, dynamic Side Effects recalculating PO line item totals, and Clean Core release API integration.',
    technologies: ['Approval Flow', 'Side Effects', 'Clean Core', 'OData V4', 'React Stepper'],
    dbTable: `define table zpo_head_db {
  key client      : abap.clnt not null;
  key po_uuid     : sysuuid_x16 not null;
  po_number       : abap.char(10);
  vendor_id       : abap.char(10);
  total_val       : abap.curr(15,2);
  status          : abap.char(20);
  last_changed_at : timestampl;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_PurchaseOrder
  as select from zpo_head_db
{
  key po_uuid         as POUUID,
      po_number       as PONumber,
      vendor_id       as VendorId,
      total_val       as TotalValue,
      status          as Status,
      last_changed_at as LastChangedAt
}`,
    projectionView: `define root view entity ZC_PurchaseOrder
  provider contract transactional_query
  as projection on ZI_PurchaseOrder
{
  key POUUID,
      PONumber,
      VendorId,
      TotalValue,
      Status,
      LastChangedAt
}`,
    bdef: `managed implementation in class zbp_i_po unique;
strict ( 2 );
define behavior for ZI_PurchaseOrder alias PurchaseOrder
persistent table zpo_head_db
lock master
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;
  action ( features : instance ) approvePO result [1] $self;
}`,
    behaviorPool: `CLASS lhc_po DEFINITION INHERITING FROM cl_abap_behavior_handler.
ENDCLASS.
CLASS lhc_po IMPLEMENTATION.
ENDCLASS.`,
    service: `define service ZAPI_PO_O4 {
  expose ZC_PurchaseOrder as PurchaseOrder;
}`,
    react: `export async function approvePO(poUUID) {
  const csrf = await getCsrfToken();
  const res = await fetch(\`/sap/opu/odata4/sap/zapi_po_o4/srvd/sap/zapi_po_o4/0001/PurchaseOrder(\${poUUID})/com.sap.gateway.srvd.zapi_po_o4.v0001.approvePO\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }
  });
  return res.json();
}`
  },

  {
    id: 'p13',
    name: 'Corporate Approval Workflow Engine',
    tier: 'Advanced Enterprise',
    focus: 'Dynamic Multi-Level Delegation + EML Orchestration + Audit Trail',
    summary: 'A generic multi-tier workflow engine capable of routing approvals across manager tiers, logging immutable audit trails, and executing cross-BO EML triggers.',
    technologies: ['EML Orchestration', 'Audit Trail', 'Delegation Rules', 'OData V4', 'React Timeline'],
    dbTable: `define table zwf_task_db {
  key client      : abap.clnt not null;
  key task_uuid   : sysuuid_x16 not null;
  task_type       : abap.char(20);
  ref_object_id   : abap.char(20);
  approver_id     : abap.char(40);
  level           : abap.int2;
  status          : abap.char(20);
  last_changed_at : timestampl;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_WorkflowTask
  as select from zwf_task_db
{
  key task_uuid       as TaskUUID,
      task_type       as TaskType,
      ref_object_id   as RefObjectId,
      approver_id     as ApproverId,
      level           as ApprovalLevel,
      status          as Status,
      last_changed_at as LastChangedAt
}`,
    projectionView: `define root view entity ZC_WorkflowTask
  provider contract transactional_query
  as projection on ZI_WorkflowTask
{
  key TaskUUID,
      TaskType,
      RefObjectId,
      ApproverId,
      ApprovalLevel,
      Status,
      LastChangedAt
}`,
    bdef: `managed implementation in class zbp_i_wf_task unique;
strict ( 2 );
define behavior for ZI_WorkflowTask alias WorkflowTask
persistent table zwf_task_db
lock master
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;
}`,
    behaviorPool: `CLASS lhc_wf DEFINITION INHERITING FROM cl_abap_behavior_handler.
ENDCLASS.
CLASS lhc_wf IMPLEMENTATION.
ENDCLASS.`,
    service: `define service ZAPI_WF_O4 {
  expose ZC_WorkflowTask as WorkflowTask;
}`,
    react: `export async function getPendingTasks(approverId) {
  const res = await fetch(\`/sap/opu/odata4/sap/zapi_wf_o4/srvd/sap/zapi_wf_o4/0001/WorkflowTask?$filter=ApproverId eq '\${approverId}' and Status eq 'PENDING'\`);
  return (await res.json()).value;
}`
  },

  {
    id: 'p14',
    name: 'Asset Lifecycle & Depreciation System',
    tier: 'Advanced Enterprise',
    focus: 'Straight-Line Depreciation Logic + ABAP Unit Testing + EML Asset Transfers',
    summary: 'Manage fixed capital assets, compute automated monthly straight-line depreciation values using modern ABAP math expressions, and write unit tests verifying accounting calculations.',
    technologies: ['ABAP Unit', 'Depreciation Math', 'EML Transfers', 'OData V4', 'React Analytics'],
    dbTable: `define table zasset_db {
  key client      : abap.clnt not null;
  key asset_uuid  : sysuuid_x16 not null;
  asset_number    : abap.char(12);
  description     : abap.char(80);
  acquisition_val : abap.curr(15,2);
  useful_life_yrs : abap.int2;
  current_val     : abap.curr(15,2);
  last_changed_at : timestampl;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_Asset
  as select from zasset_db
{
  key asset_uuid      as AssetUUID,
      asset_number    as AssetNumber,
      description     as Description,
      acquisition_val as AcquisitionValue,
      useful_life_yrs as UsefulLifeYears,
      current_val     as CurrentValue,
      last_changed_at as LastChangedAt
}`,
    projectionView: `define root view entity ZC_Asset
  provider contract transactional_query
  as projection on ZI_Asset
{
  key AssetUUID,
      AssetNumber,
      Description,
      AcquisitionValue,
      UsefulLifeYears,
      CurrentValue,
      LastChangedAt
}`,
    bdef: `managed implementation in class zbp_i_asset unique;
strict ( 2 );
define behavior for ZI_Asset alias Asset
persistent table zasset_db
lock master
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;
}`,
    behaviorPool: `CLASS lhc_asset DEFINITION INHERITING FROM cl_abap_behavior_handler.
ENDCLASS.
CLASS lhc_asset IMPLEMENTATION.
ENDCLASS.`,
    service: `define service ZAPI_ASSET_O4 {
  expose ZC_Asset as Asset;
}`,
    react: `export async function getAssets() {
  const res = await fetch('/sap/opu/odata4/sap/zapi_asset_o4/srvd/sap/zapi_asset_o4/0001/Asset');
  return (await res.json()).value;
}`
  },

  {
    id: 'p15',
    name: 'Accounts Payable Invoice System',
    tier: 'Advanced Enterprise',
    focus: 'Draft Concurrency Locking + Tax Calculations + 3-Way Match Verification',
    summary: 'Process vendor supplier invoices with draft locking, 3-way match checking against purchase orders, and automated multi-tax withholding calculations.',
    technologies: ['Draft Locking', '3-Way Match', 'Determinations', 'OData V4', 'React Form'],
    dbTable: `define table zap_inv_db {
  key client      : abap.clnt not null;
  key inv_uuid    : sysuuid_x16 not null;
  inv_number      : abap.char(16);
  vendor_id       : abap.char(10);
  po_number       : abap.char(10);
  gross_amount    : abap.curr(15,2);
  tax_amount      : abap.curr(15,2);
  net_amount      : abap.curr(15,2);
  status          : abap.char(20);
  last_changed_at : timestampl;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_ApInvoice
  as select from zap_inv_db
{
  key inv_uuid        as InvoiceUUID,
      inv_number      as InvoiceNumber,
      vendor_id       as VendorId,
      po_number       as PONumber,
      gross_amount    as GrossAmount,
      tax_amount      as TaxAmount,
      net_amount      as NetAmount,
      status          as Status,
      last_changed_at as LastChangedAt
}`,
    projectionView: `define root view entity ZC_ApInvoice
  provider contract transactional_query
  as projection on ZI_ApInvoice
{
  key InvoiceUUID,
      InvoiceNumber,
      VendorId,
      PONumber,
      GrossAmount,
      TaxAmount,
      NetAmount,
      Status,
      LastChangedAt
}`,
    bdef: `managed implementation in class zbp_i_ap_inv unique;
strict ( 2 );
with draft;
define behavior for ZI_ApInvoice alias Invoice
persistent table zap_inv_db
draft table zap_inv_d
lock master total etag LastChangedAt
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;
  draft action Edit;
  draft action Activate optimized;
  draft action Discard;
  draft action Resume;
  draft determine action Prepare;
}`,
    behaviorPool: `CLASS lhc_inv DEFINITION INHERITING FROM cl_abap_behavior_handler.
ENDCLASS.
CLASS lhc_inv IMPLEMENTATION.
ENDCLASS.`,
    service: `define service ZAPI_AP_INVOICE_O4 {
  expose ZC_ApInvoice as Invoice;
}`,
    react: `export async function getInvoices() {
  const res = await fetch('/sap/opu/odata4/sap/zapi_ap_invoice_o4/srvd/sap/zapi_ap_invoice_o4/0001/Invoice');
  return (await res.json()).value;
}`
  },

  {
    id: 'p16',
    name: 'Project & Resource Planning System',
    tier: 'Advanced Enterprise',
    focus: 'Multi-Entity 3-Tier Composition (Project -> WBS Element -> Resource Assignment)',
    summary: 'Enterprise project portfolio management with a deep 3-tier composition hierarchy, budget consumption tracking, and employee capacity scheduling.',
    technologies: ['3-Tier Composition', 'WBS Hierarchy', 'EML Deep Save', 'OData V4', 'React Gantt'],
    dbTable: `define table zpjt_header_db {
  key client      : abap.clnt not null;
  key pjt_uuid    : sysuuid_x16 not null;
  project_id      : abap.char(24);
  project_name    : abap.char(80);
  planned_budget  : abap.curr(15,2);
  consumed_budget : abap.curr(15,2);
  last_changed_at : timestampl;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_ProjectHeader
  as select from zpjt_header_db
  composition [0..*] of ZI_WbsElement as _WbsElements
{
  key pjt_uuid        as ProjectUUID,
      project_id      as ProjectId,
      project_name    as ProjectName,
      planned_budget  as PlannedBudget,
      consumed_budget as ConsumedBudget,
      last_changed_at as LastChangedAt,
      _WbsElements
}`,
    projectionView: `define root view entity ZC_ProjectHeader
  provider contract transactional_query
  as projection on ZI_ProjectHeader
{
  key ProjectUUID,
      ProjectId,
      ProjectName,
      PlannedBudget,
      ConsumedBudget,
      LastChangedAt,
      _WbsElements : redirected to composition child ZC_WbsElement
}`,
    bdef: `managed implementation in class zbp_i_project unique;
strict ( 2 );
define behavior for ZI_ProjectHeader alias Project
persistent table zpjt_header_db
lock master
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;
  association _WbsElements { create; }
}`,
    behaviorPool: `CLASS lhc_pjt DEFINITION INHERITING FROM cl_abap_behavior_handler.
ENDCLASS.
CLASS lhc_pjt IMPLEMENTATION.
ENDCLASS.`,
    service: `define service ZAPI_PROJECT_O4 {
  expose ZC_ProjectHeader as Project;
  expose ZC_WbsElement as WbsElement;
}`,
    react: `export async function getProjectsWithWBS() {
  const res = await fetch('/sap/opu/odata4/sap/zapi_project_o4/srvd/sap/zapi_project_o4/0001/Project?$expand=_WbsElements');
  return (await res.json()).value;
}`
  },

  {
    id: 'p17',
    name: 'Strategic Procurement & Contract Management',
    tier: 'Advanced Enterprise',
    focus: 'Clean Core Integration with Released SAP BOs + Target Spend Alerting',
    summary: 'Manage long-term supplier framework agreements, monitor target value consumption in real-time, and execute auto-renewals with EML.',
    technologies: ['Clean Core', 'Released BOs', 'EML Renewals', 'OData V4', 'React Dashboard'],
    dbTable: `define table zcontract_db {
  key client      : abap.clnt not null;
  key cntr_uuid   : sysuuid_x16 not null;
  contract_number : abap.char(10);
  supplier_id     : abap.char(10);
  target_value    : abap.curr(15,2);
  released_value  : abap.curr(15,2);
  valid_to        : abap.dats;
  last_changed_at : timestampl;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_ProcContract
  as select from zcontract_db
{
  key cntr_uuid       as ContractUUID,
      contract_number as ContractNumber,
      supplier_id     as SupplierId,
      target_value    as TargetValue,
      released_value  as ReleasedValue,
      valid_to        as ValidTo,
      last_changed_at as LastChangedAt
}`,
    projectionView: `define root view entity ZC_ProcContract
  provider contract transactional_query
  as projection on ZI_ProcContract
{
  key ContractUUID,
      ContractNumber,
      SupplierId,
      TargetValue,
      ReleasedValue,
      ValidTo,
      LastChangedAt
}`,
    bdef: `managed implementation in class zbp_i_contract unique;
strict ( 2 );
define behavior for ZI_ProcContract alias Contract
persistent table zcontract_db
lock master
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;
}`,
    behaviorPool: `CLASS lhc_contract DEFINITION INHERITING FROM cl_abap_behavior_handler.
ENDCLASS.
CLASS lhc_contract IMPLEMENTATION.
ENDCLASS.`,
    service: `define service ZAPI_CONTRACT_O4 {
  expose ZC_ProcContract as Contract;
}`,
    react: `export async function getContracts() {
  const res = await fetch('/sap/opu/odata4/sap/zapi_contract_o4/srvd/sap/zapi_contract_o4/0001/Contract');
  return (await res.json()).value;
}`
  },

  {
    id: 'p18',
    name: 'High-Volume Warehouse Operations App',
    tier: 'Advanced Enterprise',
    focus: 'High-Volume OData V4 Paging ($top / $skip) + Batch Scanning + Fast Barcode Intake',
    summary: 'A mission-critical logistics application handling high-velocity warehouse inventory movements, rapid barcode scanning, and optimized OData V4 pagination over thousands of records.',
    technologies: ['High Volume Paging', 'OData V4 Batch', 'Optimistic Locking', 'React Virtualized Table'],
    dbTable: `define table zwh_movement_db {
  key client      : abap.clnt not null;
  key move_uuid   : sysuuid_x16 not null;
  barcode         : abap.char(32);
  material_id     : abap.char(18);
  bin_location    : abap.char(12);
  quantity        : abap.quan(13,3);
  unit            : abap.unit(3);
  timestamp       : timestampl;
}`,
    interfaceView: `@AccessControl.authorizationCheck: #CHECK
define root view entity ZI_WarehouseMovement
  as select from zwh_movement_db
{
  key move_uuid    as MovementUUID,
      barcode      as Barcode,
      material_id  as MaterialId,
      bin_location as BinLocation,
      quantity     as Quantity,
      unit         as Unit,
      timestamp    as Timestamp
}`,
    projectionView: `define root view entity ZC_WarehouseMovement
  provider contract transactional_query
  as projection on ZI_WarehouseMovement
{
  key MovementUUID,
      Barcode,
      MaterialId,
      BinLocation,
      Quantity,
      Unit,
      Timestamp
}`,
    bdef: `managed implementation in class zbp_i_wh_move unique;
strict ( 2 );
define behavior for ZI_WarehouseMovement alias Movement
persistent table zwh_movement_db
lock master
authorization master ( instance )
{
  create;
  update;
  delete;
}`,
    behaviorPool: `CLASS lhc_wh DEFINITION INHERITING FROM cl_abap_behavior_handler.
ENDCLASS.
CLASS lhc_wh IMPLEMENTATION.
ENDCLASS.`,
    service: `define service ZAPI_WH_MOVE_O4 {
  expose ZC_WarehouseMovement as Movement;
}`,
    react: `// High-performance virtualized query with $top, $skip and count
export async function getWarehousePage(page = 0, pageSize = 100) {
  const skip = page * pageSize;
  const res = await fetch(\`/sap/opu/odata4/sap/zapi_wh_move_o4/srvd/sap/zapi_wh_move_o4/0001/Movement?$top=\${pageSize}&$skip=\${skip}&$count=true&$orderby=Timestamp desc\`);
  const data = await res.json();
  return { items: data.value, total: data['@odata.count'] };
}`
  }
];
