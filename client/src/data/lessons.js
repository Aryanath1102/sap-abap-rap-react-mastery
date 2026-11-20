/**
 * Comprehensive Masterclass Lessons: SAP Modern ABAP, RAP & React Full-Stack
 * Styled as an in-depth developer book / vlog masterclass series.
 * References: Discovering ABAP RAP series & SAP Innovation Hub RAP "Get to Know" series.
 */

import { DAY_ASSIGNMENTS, BEGINNER_BRIDGES } from './dayAssignments';

const BASE_LESSONS = [
  // =========================================================================
  // DAY 0: PREREQUISITE FAST TRACK — MODERN ABAP CORE MECHANICS (FROM ZERO TO RAP)
  // =========================================================================
  {
    id: 'day-0-abap-prerequisites',
    day: 0,
    title: 'Day 0: Prerequisite Fast Track — Modern ABAP Core Mechanics (From Zero to RAP)',
    subtitle: 'Master Variables, Structures, Internal Tables (Arrays), OOP Classes, Interfaces (~), and Open SQL before diving into RAP',
    readTime: '22 min read',
    vlogHook: "Hey engineers! If you come from Spring Boot (Java) or Express.js (Node.js) and open a modern ABAP RAP file for the first time, you might feel like you are looking at hieroglyphics. Where are the semicolons? Why is there a tilde (~) and a hyphen (-)? What on earth is an internal table or READ ENTITIES? Take a deep breath: ABAP Cloud is simply an object-oriented business programming language running on an in-memory database. In this prerequisite fast track, we start from absolute zero (ABC or 0). Once you master variables, structures, internal tables, OOP interfaces, and Open SQL in these 5 modules, modern RAP code will suddenly make crystal-clear sense!",
    layman: "Think of ABAP as Java with business punctuation. Semicolon (;) becomes period (.). Object dot-notation (user.name) becomes a hyphen (ls_user-name). An ArrayList or JavaScript Array is called an Internal Table. That's it! Everything else—variables, functions, classes, interfaces, loops, and SQL—works on the exact same computer science principles you already use every day.",
    technical: "ABAP Cloud (Language Version 5) is the modern, type-safe, object-oriented runtime of SAP S/4HANA Cloud and SAP BTP. It completely forbids legacy procedural constructs like FORM routines, HEADER LINE tables, and Dynpro screens. Execution is unified through modern OOP classes implementing IF_OO_ADT_CLASSRUN for console output, ABAP SQL for database queries, and Core Data Services (CDS) for enterprise domain models.",

    deepDiveKeywords: [
      {
        name: '0.1 Modern ABAP Core Syntax: Variables, Strings, Punctuation (. and -)',
        sapDocRef: 'SAP ABAP Cloud Documentation: Declarations, Data Types & Formatting',
        syntax: `FINAL(lv_company) = 'SAP Labs'.  " Immutable constant (like Java final or JS const)
DATA(lv_counter)  = 0.           " Mutable variable (like Java int or JS let)
lv_counter        = lv_counter + 1.

" String templates using pipes |...| with embedded expressions { ... }
FINAL(lv_message) = |Welcome to { lv_company }! Active session #{ lv_counter }|.`,
        laymanAnalogy: 'In Java, statements end with a semicolon `;` and you access object properties with a dot (`user.name`). In ABAP, every statement ends with a period `.` and you access fields inside a record with a hyphen (`ls_user-name`). String templates in ABAP use vertical pipes `|Hello { name }|`, which is identical to JavaScript template literals `\`Hello \${name}\``. Easy!',
        technicalDefinition: `Modern ABAP is strongly and statically typed. With inline declarations, \`FINAL(var)\` defines an immutable symbol in the local stack, preventing accidental mutation, while \`DATA(var)\` defines a mutable variable. The period \`.\` is the fundamental statement terminator of the ABAP compiler. The hyphen \`-\` is the component selector for flat structures (records). Pipe delimiters \`|...|\` define string templates, with curly braces \`{ ... }\` evaluating expressions at runtime without manual concatenation.`,
        underTheHood: `The ABAP Virtual Machine evaluates inline expressions using type inference from the right-hand operand. When using string templates \`|...|\`, the kernel optimizes buffer allocation using dynamic character string descriptors, eliminating multiple intermediate heap reallocations.`,
        commonPitfall: `Beginner Pitfalls: 1. Forgetting the trailing period \`.\` on every statement. 2. Typing \`ls_user.name\` instead of \`ls_user-name\` (the dot in ABAP terminates a statement; use hyphen \`-\` for fields!). 3. Using \`DATA\` when the value never changes (violates Clean Core ATC checks).`,
        modernExample: `METHOD if_oo_adt_classrun~main.
  " 1. Immutable declaration
  FINAL(lv_service_name) = 'PaymentGatewayService'.
  
  " 2. Mutable counter
  DATA(lv_retry_count)   = 0.
  lv_retry_count         = lv_retry_count + 1.

  " 3. String template with pipe operator |...|
  FINAL(lv_log_entry) = |[SERVICE: { lv_service_name }] Attempt { lv_retry_count } of 3|.
  
  out->write( lv_log_entry ).
ENDMETHOD.`,
        springBootBridge: {
          explanation: 'ABAP FINAL is Java final; ABAP DATA is Java var. Statement terminator is period (.) instead of semicolon (;). String template |...| is JS template literal `...` or Java String.format.',
          springBootCode: `// Java / Spring Boot equivalent:
final String serviceName = "PaymentGatewayService";
int retryCount = 0;
retryCount = retryCount + 1;
final String logEntry = String.format("[SERVICE: %s] Attempt %d of 3", serviceName, retryCount);
System.out.println(logEntry);`,
          expressCode: `// Node.js / Express.js equivalent:
const serviceName = 'PaymentGatewayService';
let retryCount = 0;
retryCount += 1;
const logEntry = \`[SERVICE: \${serviceName}] Attempt \${retryCount} of 3\`;
console.log(logEntry);`
        }
      },
      {
        name: '0.2 Structures & Internal Tables: In-Memory Records and Collections',
        sapDocRef: 'SAP ABAP Language Reference: Complex Data Types & Internal Tables',
        syntax: `" 1. Define a Structure (DTO)
TYPES: BEGIN OF ty_user,
         id    TYPE string,
         email TYPE string,
         role  TYPE string,
       END OF ty_user,
       " 2. Define an Internal Table (List/Array)
       tt_users TYPE STANDARD TABLE OF ty_user WITH EMPTY KEY.

" 3. Instantiate table with rows
FINAL(lt_users) = VALUE tt_users(
  ( id = 'U01' email = 'alex@corp.com' role = 'ADMIN' )
  ( id = 'U02' email = 'zoe@corp.com'  role = 'DEVELOPER' )
).`,
        laymanAnalogy: 'A Structure is like a Java DTO or TypeScript interface (one single record with named fields). An Internal Table is simply a Java `List<UserDTO>` or a JavaScript array of objects `User[]`. In ABAP, the prefix `ls_` means "local structure" (single record), and `lt_` means "local table" (array/collection).',
        technicalDefinition: `An Internal Table is an in-memory multidimensional dynamic array managed by the ABAP kernel. Standard tables provide index-based sequential access (O(N) search or O(log N) binary search). Hashed and sorted tables provide O(1) or O(log N) key-based lookups. The constructor expression \`VALUE tt_type( ( ... ) ( ... ) )\` constructs and populates an internal table inline without manual work areas.`,
        underTheHood: `Internal tables store row headers in contiguous 64-bit page blocks in the ABAP session roll area. When rows are appended, the ABAP memory manager allocates memory chunks geometrically to minimize fragmentation and system call overhead.`,
        commonPitfall: `Never declare internal tables with legacy header lines (\`DATA itab TYPE TABLE OF ... WITH HEADER LINE\`). In modern ABAP Cloud, header lines are strictly forbidden; always separate the table (\`lt_users\`) from the work area (\`ls_user\`).`,
        modernExample: `METHOD if_oo_adt_classrun~main.
  TYPES: BEGIN OF ty_order,
           order_id TYPE string,
           amount   TYPE decfloat16,
         END OF ty_order,
         tt_orders TYPE STANDARD TABLE OF ty_order WITH EMPTY KEY.

  " Populate collection
  FINAL(lt_orders) = VALUE tt_orders(
    ( order_id = 'ORD_01' amount = '150.00' )
    ( order_id = 'ORD_02' amount = '320.50' )
  ).

  " Loop through collection (equivalent to for...of in JS or enhanced for in Java)
  DATA lv_total TYPE decfloat16 VALUE 0.
  LOOP AT lt_orders INTO FINAL(ls_order).
    lv_total = lv_total + ls_order-amount.
    out->write( |Order { ls_order-order_id }: Amount { ls_order-amount }| ).
  ENDLOOP.

  out->write( |Total Revenue: { lv_total }| ).
ENDMETHOD.`,
        springBootBridge: {
          explanation: 'Structure = DTO / POJO. Internal Table = List<DTO>. LOOP AT ... INTO wa = for (final DTO item : list). APPEND = list.add(item).',
          springBootCode: `// Java / Spring Boot equivalent:
record OrderDTO(String orderId, BigDecimal amount) {}
List<OrderDTO> orders = List.of(
    new OrderDTO("ORD_01", new BigDecimal("150.00")),
    new OrderDTO("ORD_02", new BigDecimal("320.50"))
);
BigDecimal total = BigDecimal.ZERO;
for (final OrderDTO order : orders) {
    total = total.add(order.amount());
    System.out.printf("Order %s: Amount %s%n", order.orderId(), order.amount());
}
System.out.println("Total Revenue: " + total);`,
          expressCode: `// Node.js / Express.js equivalent:
const orders = [
  { orderId: 'ORD_01', amount: 150.00 },
  { orderId: 'ORD_02', amount: 320.50 }
];
let total = 0;
for (const order of orders) {
  total += order.amount;
  console.log(\`Order \${order.orderId}: Amount \${order.amount}\`);
}
console.log(\`Total Revenue: \${total}\`);`
        }
      },
      {
        name: '0.3 Object-Oriented ABAP: Classes, Methods & The Interface Tilde (~)',
        sapDocRef: 'SAP ABAP OO Architecture Guide: Classes, Interfaces, and Scope Resolution',
        syntax: `" Interface definition
INTERFACE zif_tax_calculator.
  METHODS calculate
    IMPORTING iv_amount TYPE decfloat16
    RETURNING VALUE(rv_tax) TYPE decfloat16.
ENDINTERFACE.

" Class implementing interface
CLASS zcl_eu_tax DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES zif_tax_calculator.
ENDCLASS.

CLASS zcl_eu_tax IMPLEMENTATION.
  " Notice the tilde (~) operator: InterfaceName~MethodName
  METHOD zif_tax_calculator~calculate.
    rv_tax = iv_amount * '0.20'.
  ENDMETHOD.
ENDCLASS.`,
        laymanAnalogy: 'In Java, an interface method is implemented simply as `public double calculate(double amount)`. But what if a class implements two interfaces that have a method with the same name? In ABAP, the language resolves this explicitly using the tilde `~` operator: `InterfaceName~MethodName`. That is why you always see `if_oo_adt_classrun~main` in console classes!',
        technicalDefinition: `ABAP Objects enforces a clean two-part structure: \`CLASS ... DEFINITION\` (where members, visibility sections, and interfaces are declared) and \`CLASS ... IMPLEMENTATION\` (where method logic is authored). When implementing an interface method, the tilde (\`~\`) is the interface resolution operator. Method parameters are explicitly categorized as \`IMPORTING\` (input arguments), \`EXPORTING\` (output values), \`CHANGING\` (in-out references), or \`RETURNING VALUE(r)\` (functional return value).`,
        underTheHood: `The ABAP kernel constructs a virtual method table (vtable) per class. When a method is called via an interface reference, the compiler uses the interface component prefix \`intf~method\` to dispatch the call directly via the interface offset table in constant O(1) time.`,
        commonPitfall: `Writing \`METHOD calculate.\` instead of \`METHOD zif_tax_calculator~calculate.\` will result in a syntax error: "Method CALCULATE is not declared in class ZCL_EU_TAX." Always use the tilde when implementing interface methods.`,
        modernExample: `CLASS zcl_pricing_engine DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.

    METHODS calculate_discount
      IMPORTING iv_subtotal TYPE decfloat16
      RETURNING VALUE(rv_discount) TYPE decfloat16.
ENDCLASS.

CLASS zcl_pricing_engine IMPLEMENTATION.
  METHOD calculate_discount.
    IF iv_subtotal > 100.
      rv_discount = iv_subtotal * '0.10'. " 10% discount
    ELSE.
      rv_discount = 0.
    ENDIF.
  ENDMETHOD.

  " Interface method implementation:
  METHOD if_oo_adt_classrun~main.
    FINAL(lv_subtotal) = 250.
    FINAL(lv_disc)     = calculate_discount( lv_subtotal ).
    out->write( |Subtotal: { lv_subtotal }, Discount: { lv_disc }| ).
  ENDMETHOD.
ENDCLASS.`,
        springBootBridge: {
          explanation: 'CLASS DEFINITION is the Java Interface / Header. CLASS IMPLEMENTATION is the Class Body. METHOD intf~method is @Override public void method(). IMPORTING = method arguments. RETURNING = return type.',
          springBootCode: `// Java / Spring Boot equivalent:
public interface TaxCalculator {
    BigDecimal calculate(BigDecimal amount);
}

@Service
public class EuTaxCalculator implements TaxCalculator {
    @Override // In ABAP: METHOD zif_tax_calculator~calculate
    public BigDecimal calculate(BigDecimal amount) {
        return amount.multiply(new BigDecimal("0.20"));
    }
}`,
          expressCode: `// Node.js / Express.js equivalent:
class EuTaxCalculator {
  calculate(amount) {
    return amount * 0.20;
  }
}
export const taxService = new EuTaxCalculator();`
        }
      },
      {
        name: '0.4 ABAP Dictionary & Modern Open SQL: SELECT with Host Variables (@)',
        sapDocRef: 'SAP ABAP Core: Modern ABAP SQL (Open SQL) & Host Variable Escape',
        syntax: `" Modern ABAP SQL (Clean Core standard)
SELECT FROM /dmo/travel
  FIELDS travel_id, description, begin_date, end_date, total_price, currency_code
  WHERE customer_id = @lv_customer_id
  ORDER BY begin_date DESCENDING
  INTO TABLE @DATA(lt_travels).`,
        laymanAnalogy: 'Think of ABAP SQL as Spring Data JPA or Prisma ORM built directly into the programming language itself! You do not need to install JDBC drivers or configure connection pools. To keep database column names separate from your local program variables, ABAP uses the `@` sign before local variables (`@lv_customer_id`). It works like prepared statement parameters (`:customerId` or `?`) in SQL.',
        technicalDefinition: `Modern ABAP SQL (formerly Open SQL) executes directly against the underlying SAP HANA database with complete schema abstraction. The \`FIELDS\` clause specifies explicit projection (Clean Core rule: \`SELECT *\` is prohibited). The \`@\` symbol is the host variable escape character: it tells the ABAP SQL parser that the token is a program variable, not a database column. Inline target tables are declared with \`@DATA(lt_target)\`.`,
        underTheHood: `The ABAP Database Interface (DBI) transforms ABAP SQL statements into native SAP HANA SQL queries with parameterized statement caching. Results are transferred into the application server buffer using optimized columnar bulk-fetch protocols.`,
        commonPitfall: `Forgetting the \`@\` escape symbol in modern ABAP SQL. Writing \`WHERE customer_id = lv_customer_id\` will cause a compile error: "The escape character @ must be used for host variable lv_customer_id." Always prepend \`@\` to ABAP variables used inside SQL.`,
        modernExample: `METHOD if_oo_adt_classrun~main.
  FINAL(lv_target_curr) = 'EUR'.

  " Query database table with projection and host variable escaping
  SELECT FROM /dmo/travel
    FIELDS travel_id, agency_id, total_price, currency_code
    WHERE currency_code = @lv_target_curr
    ORDER BY total_price DESCENDING
    UP TO 5 ROWS
    INTO TABLE @DATA(lt_top_travels).

  IF sy-subrc = 0.
    out->write( |Retrieved { lines( lt_top_travels ) } Euro travels:| ).
    out->write( lt_top_travels ).
  ELSE.
    out->write( 'No records found.' ).
  ENDIF.
ENDMETHOD.`,
        springBootBridge: {
          explanation: 'ABAP SQL with @host_var is Spring Data JPA with @Param or prepared statements (WHERE c = :param). INTO TABLE @DATA(t) is automatic List<DTO> projection.',
          springBootCode: `// Java / Spring Boot equivalent (Spring Data JPA):
@Query("SELECT t.travelId, t.agencyId, t.totalPrice, t.currencyCode " +
       "FROM TravelEntity t WHERE t.currencyCode = :currency ORDER BY t.totalPrice DESC")
List<TravelSummaryDTO> findTopTravelsByCurrency(@Param("currency") String currency);`,
          expressCode: `// Node.js / Express.js equivalent (Prisma / pg):
const topTravels = await prisma.travel.findMany({
  where: { currencyCode: targetCurrency },
  select: { travelId: true, agencyId: true, totalPrice: true, currencyCode: true },
  orderBy: { totalPrice: 'desc' },
  take: 5
});`
        }
      },
      {
        name: '0.5 CDS Entities: Declarative Domain Models & The ZI_ vs ZC_ Pattern',
        sapDocRef: 'SAP Core Data Services (CDS) Entity Architecture & VDM Rules',
        syntax: `@EndUserText.label: 'Travel Interface Entity'
@AccessControl.authorizationCheck: #NOT_REQUIRED
define root view entity ZI_Travel
  as select from /dmo/travel
  composition [0..*] of ZI_Booking as _Booking
{
  key travel_id     as TravelId,
      agency_id     as AgencyId,
      customer_id   as CustomerId,
      begin_date    as BeginDate,
      end_date      as EndDate,
      _Booking      // Composition association exposed
}`,
        laymanAnalogy: 'Think of Core Data Services (CDS) as your JPA `@Entity` or Prisma schema definition. It creates an intelligent database view with relationships. The golden architectural rule in SAP is: `ZI_...` is your Private Core Domain Entity (like an internal database schema), and `ZC_...` is your Public Consumption Projection (like a GraphQL resolver or REST DTO for the frontend).',
        technicalDefinition: `Core Data Services (CDS) is the semantic data layer of SAP HANA. Unlike legacy DDIC views, CDS View Entities define type-safe relational models, annotations (@UI, @EndUserText), compositions (\`composition of\`), and lazy joins (\`association\`). In RAP, the Interface View (\`ZI_...\`) defines the core business object model, while Projection Views (\`ZC_...\`) define tailored consumer facades with UI annotations for SAP Fiori or custom React frontends.`,
        underTheHood: `The ABAP CDS compiler generates an advanced SQL view definition directly in the SAP HANA catalog. When executed, SAP HANA pushes down calculations, currency conversions, and joins directly to the hardware CPU cache lines, executing at millions of records per millisecond.`,
        commonPitfall: `Exposing database table names directly to the UI. Never bind a frontend or UI service directly to raw tables or \`ZI_\` entities. Always project through a \`ZC_\` consumption view to maintain Clean Core encapsulation.`,
        modernExample: `@EndUserText.label: 'Travel Consumption Projection'
@AccessControl.authorizationCheck: #NOT_REQUIRED
define root view entity ZC_Travel
  provider contract transactional_query
  as projection on ZI_Travel
{
  key TravelId,
      AgencyId,
      CustomerId,
      BeginDate,
      EndDate,
      /* Redirected composition to child projection */
      _Booking : redirected to composition child ZC_Booking
}`,
        springBootBridge: {
          explanation: 'ZI_ is JPA @Entity (Internal Domain Model). ZC_ is REST API DTO / Projection. Composition [0..*] is @OneToMany(cascade = CascadeType.ALL). Association is @ManyToOne(fetch = FetchType.LAZY).',
          springBootCode: `// Java / Spring Boot equivalent:
// ZI_Travel (Internal Entity):
@Entity
@Table(name = "dmo_travel")
public class TravelEntity {
    @Id private String travelId;
    @OneToMany(mappedBy = "travel", cascade = CascadeType.ALL)
    private List<BookingEntity> bookings;
}

// ZC_Travel (Public API Projection DTO):
public record TravelResponseDTO(
    String travelId,
    String agencyId,
    LocalDate beginDate,
    List<BookingSummaryDTO> bookings
) {}`,
          expressCode: `// Node.js / Express.js equivalent (Prisma Schema):
// ZI_ (Model):
model Travel {
  travelId   String    @id
  agencyId   String
  bookings   Booking[]
}
// ZC_ (API Response / Schema Projection):
// Exposes only client-facing fields over REST/GraphQL`
        }
      }
    ],

    showdown: {
      title: 'Architectural Showdown: Classic Procedural ABAP vs Modern ABAP Cloud Clean Core',
      verdict: 'Legacy procedural ABAP code contains global mutable state, untyped tables with header lines, and obsolete Dynpro statements that are fundamentally incompatible with SAP BTP and S/4HANA Cloud. Modern ABAP Cloud Clean Core enforces strict object orientation, compile-time immutability with FINAL, and standardized execution via IF_OO_ADT_CLASSRUN.',
      elementA: {
        name: 'Legacy Procedural ABAP (1990s Monolith)',
        syntax: `REPORT z_legacy_travel.
TABLES: /dmo/travel.
DATA: it_travel TYPE TABLE OF /dmo/travel WITH HEADER LINE.

SELECT * FROM /dmo/travel INTO TABLE it_travel.
LOOP AT it_travel.
  WRITE: / it_travel-travel_id, it_travel-total_price.
ENDLOOP.`,
        pros: [
          'Quick to write one-off throwaway scripts',
          'Permissive compiler allows sloppy implicit typing'
        ],
        cons: [
          'Completely banned in ABAP Cloud / Clean Core (fatal compile errors)',
          'Header line tables pollute global session memory and create race conditions',
          'Dynpro WRITE output cannot be exposed to web APIs or modern React frontends',
          'SELECT * causes catastrophic full-table scans on HANA columnar memory'
        ]
      },
      elementB: {
        name: 'Modern ABAP Cloud Clean Core (2026 Enterprise)',
        syntax: `CLASS zcl_modern_travel DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
ENDCLASS.

CLASS zcl_modern_travel IMPLEMENTATION.
  METHOD if_oo_adt_classrun~main.
    SELECT FROM /dmo/travel
      FIELDS travel_id, total_price
      UP TO 100 ROWS
      INTO TABLE @FINAL(lt_travels).

    LOOP AT lt_travels INTO FINAL(ls_travel).
      out->write( |Travel #{ ls_travel-travel_id }: EUR { ls_travel-total_price }| ).
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.`,
        pros: [
          '100% Clean Core compliant, runs identically on S/4HANA Cloud and SAP BTP',
          'Strict immutability via FINAL(var) eliminates shared state side effects',
          'Type-safe ABAP SQL projections maximize SAP HANA in-memory performance',
          'Structured JSON/OData ready for modern React, Vue, and Angular frontends'
        ],
        cons: [
          'Requires understanding modern OOP and constructor expressions',
          'Strict compiler rejects sloppy shortcuts'
        ]
      },
      comparisonTable: [
        {
          feature: 'Execution Model',
          elementA: 'Procedural Report (REPORT z_...)',
          elementB: 'Strict OOP Class (IF_OO_ADT_CLASSRUN)',
          winner: 'Modern Clean Core'
        },
        {
          feature: 'Memory Management',
          elementA: 'Untyped tables WITH HEADER LINE',
          elementB: 'Separated typed tables & work areas',
          winner: 'Modern Clean Core'
        },
        {
          feature: 'Immutability Support',
          elementA: 'None (Global mutable state)',
          elementB: 'Compile-time FINAL(var)',
          winner: 'Modern Clean Core'
        },
        {
          feature: 'Database Querying',
          elementA: 'Unchecked SELECT * without host escape',
          elementB: 'Strict FIELDS projection with @host_var',
          winner: 'Modern Clean Core'
        },
        {
          feature: 'Cloud & BTP Ready',
          elementA: '0% (Hard compile error in Cloud Language Version 5)',
          elementB: '100% Certified Clean Core standard',
          winner: 'Modern Clean Core'
        }
      ]
    },

    files: [
      {
        path: 'src/zcl_prereq_foundation.clas.abap',
        language: 'abap',
        description: 'Zero-to-Hero Foundation Class demonstrating Variables, Internal Tables, and Control Flow',
        code: `CLASS zcl_prereq_foundation DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.

    TYPES: BEGIN OF ty_employee,
             emp_id TYPE string,
             name   TYPE string,
             salary TYPE decfloat16,
           END OF ty_employee,
           tt_employees TYPE STANDARD TABLE OF ty_employee WITH EMPTY KEY.
ENDCLASS.

CLASS zcl_prereq_foundation IMPLEMENTATION.
  METHOD if_oo_adt_classrun~main.
    " 1. Inline declaration with FINAL and DATA
    FINAL(lv_dept)  = 'Core Platform Engineering'.
    DATA(lv_active) = abap_true.

    " 2. Internal table population using VALUE
    FINAL(lt_team) = VALUE tt_employees(
      ( emp_id = 'E101' name = 'Kavita Rao' salary = '95000.00' )
      ( emp_id = 'E102' name = 'David Chen' salary = '98000.00' )
    ).

    " 3. Iteration with LOOP AT and string formatting
    DATA lv_payroll_sum TYPE decfloat16 VALUE 0.
    LOOP AT lt_team INTO FINAL(ls_member).
      lv_payroll_sum = lv_payroll_sum + ls_member-salary.
      out->write( |Staff: { ls_member-name } ({ ls_member-emp_id }) -> \${ ls_member-salary }| ).
    ENDLOOP.

    out->write( |Department { lv_dept } Payroll Total: \${ lv_payroll_sum }| ).
  ENDMETHOD.
ENDCLASS.`
      }
    ]
  },

  // =========================================================================
  // DAY 1: MODERN ABAP FUNDAMENTALS
  // =========================================================================
  {
    id: 'day-1-modern-abap',
    day: 1,
    title: 'Day 1: Modern ABAP Fundamentals & Constructor Expressions',
    subtitle: 'From procedural 1990s syntax to functional, immutable, expression-driven ABAP 7.50+ / 7.57+',
    readTime: '18 min read',
    vlogHook: "Hey developers! Welcome to Day 1 of our SAP Full-Stack Architect Masterclass. If your ABAP code still starts with 50 lines of 'DATA: wa_mara TYPE mara, it_mara TYPE TABLE OF mara' followed by nested loops and manual APPENDs, you are writing 1998 code on a 2026 SAP HANA cloud engine. Today, we blow that open and master constructor expressions: VALUE, COND, SWITCH, REDUCE, FILTER, FOR, and immutable FINAL declarations.",
    layman: "Think of classic ABAP like an old typewriter where you had to manually roll the carriage, allocate temporary scratch paper for every calculation, and loop over rows line-by-line. Modern ABAP is like modern JavaScript (ES6+ with map, filter, reduce, template literals, and const): you construct, filter, and transform entire data collections inside a single, elegant, type-safe expression without intermediate clutter.",
    technical: "Introduced in ABAP 7.40 and finalized with functional immutability in 7.57+, constructor expressions operate directly on the operand position. The ABAP kernel evaluates these expressions in-place using type inference (`#` symbol for context-inferred types or explicit data types). In ABAP Cloud (Language Version 5), classic Dynpro statements (WRITE, TABLES, OCCURS 0, HEADER LINE) are completely prohibited by the compiler. Console execution is unified via the IF_OO_ADT_CLASSRUN interface, routing output to Eclipse ADT through `out->write( )`.",

    // Deep breakdown of every single element - Expanded Textbook Edition
    deepDiveKeywords: [
      {
        name: 'Immutable Inline Declarations: FINAL(var) vs DATA(var)',
        sapDocRef: 'SAP RAP Guide: RAP Architecture & ABAP Cloud Language Version 5 (Standard ABAP Spec 7.57+)',
        syntax: `FINAL(lv_immutable) = 'Fixed Threshold'.
DATA(lv_mutable)     = 'Initial Value'.
lv_mutable           = 'Updated Value'.
" lv_immutable       = 'Illegal'. <-- Triggers compile-time fatal error`,
        laymanAnalogy: 'Think of `FINAL` as writing an official contract in permanent ink, whereas `DATA` is writing in pencil. In modern JavaScript/TypeScript, this is identical to `const` vs `let`. Once a variable is declared with `FINAL`, neither you nor any junior developer working on your team can accidentally overwrite it 200 lines later.',
        technicalDefinition: `Introduced in ABAP 7.57 (SAP S/4HANA 2022 and SAP BTP ABAP Environment), \`FINAL(var)\` introduces compile-time immutability into the procedural core of ABAP. When a variable is initialized via \`FINAL(var) = expr\`, the ABAP syntax checker records the symbol with a read-only attribute within the current local method scope. Any subsequent assignment operator (\`=\`), clearing statement (\`CLEAR\`), or passing as an \`EXPORTING\`/\`CHANGING\` parameter to a subroutine or method causes immediate syntax failure in Eclipse ADT: "The variable lv_immutable is declared with FINAL and cannot be modified."

In the ABAP RESTful Application Programming Model (RAP), immutability is vital. Inside Local Handler Classes (\`lhc_travel\` in Behavior Pool \`/DMO/BP_TRAVEL_M\`), determinations and validations receive entity keys and root state. By declaring incoming parameters and intermediate keys with \`FINAL(lt_travel_keys)\`, you mathematically guarantee that your transactional handler logic is idempotent and cannot corrupt the internal transactional buffer during phase execution.`,
        underTheHood: `During compilation, the ABAP Virtual Machine (ABAP VM) assigns \`FINAL\` variables to the local execution stack in the current internal session roll area. Because the runtime kernel knows the memory address will never be mutated after initialization, it can eliminate CPU cache line synchronization fences and reuse CPU register allocations across multiple operand reads. Furthermore, in unit testing with ABAP Unit, immutable references eliminate shared mutable state, preventing concurrency bugs.`,
        commonPitfall: `The "Universal DATA" habit: developers migrating from pre-7.40 ABAP reflexively use \`DATA(var)\` for every inline declaration. This violates Clean Core static analysis rules (ATC check: "Variables assigned only once should be declared with FINAL"). If an intermediate calculation, entity key, or BAPI/EML response is never reassigned, declare it with \`FINAL(var)\`. Reserve \`DATA(var)\` strictly for loop counters or accumulators that genuinely mutate.`,
        modernExample: `METHOD calculate_employee_net_pay.
  " 1. Immutable base parameters - guaranteed never modified during calculation
  FINAL(lv_base_salary) = 85000.
  FINAL(lv_tax_rate)    = '0.20'. " 20% flat tax rate

  " 2. Mutable accumulator for deductions and bonuses
  DATA(lv_net_salary)   = lv_base_salary.

  " 3. Apply bonus if performance rating exceeds threshold
  FINAL(lv_rating) = 5.
  IF lv_rating >= 4.
    DATA(lv_bonus) = 5000.
    lv_net_salary  = lv_net_salary + lv_bonus.
  ENDIF.

  " 4. Deduct taxes
  lv_net_salary = lv_net_salary - ( lv_net_salary * lv_tax_rate ).

  " Output net calculation result
  rv_net_payout = lv_net_salary.
ENDMETHOD.`,
        springBootBridge: {
          explanation: `If you know Spring Boot (Java) or Express.js (Node.js), this ABAP method is literally a standard entity validator hook (like @PrePersist in JPA or a validation middleware in Express). It receives an array of entity IDs, queries the database/buffer for their BeginDate and EndDate, checks if EndDate is before BeginDate, and if so, pushes an error into the HTTP error response array (reported-travel)!`,
          springBootCode: `// Spring Boot (Java) Equivalent:
@Component
public class TravelValidator {
    @Autowired
    private TravelRepository travelRepo; // in ABAP: READ ENTITIES OF ...

    public void validateDates(List<TravelKey> keys, BindingResult errors) {
        // FINAL(lt_travel_keys)
        final List<TravelKey> travelKeys = keys;

        // READ ENTITIES OF ... IN LOCAL MODE
        final List<Travel> travelData = travelRepo.findAllById(travelKeys);

        // LOOP AT lt_travel_data INTO FINAL(ls_travel)
        for (final Travel travel : travelData) {
            // IF ls_travel-EndDate < ls_travel-BeginDate
            if (travel.getEndDate().isBefore(travel.getBeginDate())) {
                // APPEND ... TO reported-travel
                errors.rejectValue("endDate", "date.invalid", "End date must be after begin date");
            }
        }
    }
}`,
          expressCode: `// Express.js + Prisma / TypeORM (Node.js) Equivalent:
async function validateDates(req, res, next) {
    const { keys } = req.body; // incoming keys

    // READ ENTITIES OF ... IN LOCAL MODE
    const travelData = await prisma.travel.findMany({
        where: { id: { in: keys } },
        select: { id: true, beginDate: true, endDate: true }
    });

    // LOOP AT lt_travel_data INTO FINAL(ls_travel)
    for (const travel of travelData) {
        // IF ls_travel-EndDate < ls_travel-BeginDate
        if (new Date(travel.endDate) < new Date(travel.beginDate)) {
            // APPEND ... TO reported-travel
            return res.status(400).json({
                error: 'End date must be chronologically after begin date',
                targetField: 'endDate',
                entityId: travel.id
            });
        }
    }
    next();
}`
        }
      },
      {
        name: 'Constructing Complex Deep Tables with VALUE #( ) and FOR',
        sapDocRef: 'SAP RAP Guide: Chapter 5 - Implementing Behavior & EML Create-by-Association',
        syntax: `DATA(lt_target) = VALUE tt_target_type(
  FOR wa IN lt_source_table
  INDEX INTO lv_index
  WHERE ( condition_field = 'VAL' )
  LET lv_discount = wa-price * '0.10'
  IN ( field_a  = wa-key
       field_b  = lv_index
       discount = lv_discount )
).

" Appending to an existing internal table without overwriting:
lt_existing = VALUE #( BASE lt_existing ( field_a = 'NEW' ) ).`,
        laymanAnalogy: 'Imagine ordering a customized multi-course meal: instead of running back and forth to the kitchen five times to chop carrots, boil water, and plate each ingredient separately (as old `LOOP ... APPEND` did), you hand the chef an all-in-one recipe card (`VALUE #( FOR ... )`) and receive the finished table in one instant, perfectly prepared delivery.',
        technicalDefinition: `\`VALUE #( )\` is a constructor expression that initializes internal tables and deep structures directly at the operand position. The \`#\` symbol represents context-sensitive type inference: the ABAP compiler inspects the target variable or interface parameter type and infers the internal table type automatically.

When paired with \`FOR wa IN itab [INDEX INTO idx] [WHERE ( log_exp )]\`, \`VALUE\` acts as a functional table comprehension expression. It replaces the classic, verbose 1990s pattern:
\`LOOP AT itab INTO wa WHERE ... APPEND wa TO target ... ENDLOOP.\`

Advanced constructor operators:
1. \`BASE itab\`: Preserves all existing records in \`itab\` before adding new lines (replaces \`APPEND LINES OF\`).
2. \`LET var = expr IN\`: Declares locally scoped helper variables that exist only within the expression evaluation scope, preventing local stack pollution.
3. \`INDEX INTO idx\`: Binds the current 1-based loop counter without requiring a manual \`sy-tabix\` or counter variable.

In RAP, \`VALUE #( )\` is mandatory for EML (Entity Manipulation Language) deep inserts. Creating parent travels alongside child bookings via Create-by-Association requires nesting child structures inside the \`%target\` table parameter using nested \`VALUE #( FOR ... )\`.`,
        underTheHood: `When evaluating \`VALUE #( FOR ... )\`, the ABAP runtime analyzes the cardinality of the source table and pre-allocates contiguous heap blocks within the user roll area. Unlike iterative \`APPEND\` statements—which cause repeated geometric memory reallocation (doubling internal table capacity repeatedly: 8 -> 16 -> 32 -> 64 records) and frequent memory fragmentation—the constructor expression minimizes memory copying overhead, producing significant throughput speedups on multi-core SAP HANA application servers.`,
        commonPitfall: `Wiping existing table contents by forgetting \`BASE\`: writing \`lt_table = VALUE #( ( new_record ) )\` completely reinitializes \`lt_table\`, deleting all previously held rows! If you intend to append to an existing table, you MUST write \`lt_table = VALUE #( BASE lt_table ( new_record ) )\`. Another trap is omitting parentheses around each row item: \`VALUE tt_type( ( row1 ) ( row2 ) )\` requires double parentheses for individual internal table row constructors.`,
        modernExample: `" RAP Flight Scenario: Deep Create-by-Association (Travel -> Bookings)
MODIFY ENTITIES OF /dmo/i_travel_m
  ENTITY Travel
  CREATE BY \\_Booking
  FIELDS ( BookingDate CustomerID CarrierID ConnectionID FlightDate FlightPrice CurrencyCode )
  WITH VALUE #(
    FOR travel IN lt_travel_requests (
      %tky    = travel-%tky
      %target = VALUE #(
        FOR booking IN travel-bookings
        INDEX INTO lv_booking_index (
          %cid          = |CID_BOOKING_{ travel-travel_id }_{ lv_booking_index }|
          BookingDate   = cl_abap_context_info=>get_system_date( )
          CustomerID    = booking-customer_id
          CarrierID     = booking-carrier_id
          ConnectionID  = booking-connection_id
          FlightDate    = booking-flight_date
          FlightPrice   = booking-flight_price
          CurrencyCode  = booking-currency_code
          %control      = VALUE #(
            BookingDate  = if_abap_behv=>mk-on
            CustomerID   = if_abap_behv=>mk-on
            CarrierID    = if_abap_behv=>mk-on
            ConnectionID = if_abap_behv=>mk-on
            FlightDate   = if_abap_behv=>mk-on
            FlightPrice  = if_abap_behv=>mk-on
            CurrencyCode = if_abap_behv=>mk-on
          )
        )
      )
    )
  )
  MAPPED   FINAL(mapped_bookings)
  FAILED   FINAL(failed_bookings)
  REPORTED FINAL(reported_bookings).`
      },
      {
        name: 'Declarative Data Transformation with REDUCE #( )',
        sapDocRef: 'SAP RAP Guide: Chapter 7 - Determinations & Calculations in Behavior Pools',
        syntax: `FINAL(lv_result) = REDUCE target_type(
  INIT acc = initial_value
       [var2 = val2]
  FOR  wa IN source_table
  [WHERE ( boolean_condition )]
  NEXT acc = accumulator_expression
).`,
        laymanAnalogy: 'Think of a supermarket checkout register. As the conveyor belt feeds groceries item by item, the cash register keeps an internal running subtotal (`INIT acc = 0`), adding each item price (`NEXT acc = acc + item-price`). When the conveyor belt stops, you are left with one single total figure. This is identical to `Array.prototype.reduce()` in modern JavaScript or `foldLeft()` in Scala.',
        technicalDefinition: `\`REDUCE #( )\` is an iterative folding expression that reduces an entire collection (internal table) down to a single scalar value or condensed structure. It operates directly at the operand position, completely eliminating the legacy procedural anti-pattern of declaring scratch accumulator variables, writing manual \`LOOP AT ... INTO ...\`, manually incrementing counters, and checking for initial conditions.

Syntax Clauses:
1. \`INIT acc = init_val\`: Declares and initializes the accumulator variable(s). Crucially, the accumulator variables are locally scoped strictly within the reduction expression—they do not exist outside the statement, preventing variable leakage.
2. \`FOR wa IN source_table\`: Iterates over the table rows. Can include \`INDEX INTO\` and conditional \`WHERE ( cond )\`.
3. \`NEXT acc = acc + wa-field\`: The transformation applied at each iteration step to update the accumulator.

In the official SAP Flight Scenario (\`/DMO/\`), \`REDUCE\` is the standard Clean Core mechanism used inside RAP determinations. For example, in determination \`calculateTotalPrice\` on root entity \`/DMO/I_Travel_M\`, when bookings or supplements are updated, the determination reads all associated bookings and uses \`REDUCE\` to fold flight prices and supplement amounts into a unified \`total_price\`.`,
        underTheHood: `The ABAP Virtual Machine evaluates the \`REDUCE\` pipeline within a tight internal kernel loop without invoking dynamic table line address lookups or allocating temporary table work areas. If the internal table is a hashed or sorted table, the kernel leverages indexed iterator pointers directly in memory. This executes orders of magnitude faster than classic Dynpro loops with manual work area assignments.`,
        commonPitfall: `The Silent Currency Truncation Bug: writing \`INIT sum = 0\` causes the compiler to infer integer type \`i\` (4-byte integer) for \`sum\`. When adding currency figures with cents (e.g., $149.99), the decimals are silently rounded or truncated on every iteration step! To prevent financial calculation errors, ALWAYS declare the accumulator explicitly with the exact dictionary type or decimal floating point:
\`INIT sum = CONV /dmo/total_price( 0 )\` or \`INIT sum = CONV decfloat16( 0 )\`.`,
        modernExample: `" RAP Determination: calculateTotalFlightPrice in /DMO/BP_TRAVEL_M
METHOD calculateTotalPrice.
  " Read associated bookings for all requested travels
  READ ENTITIES OF /dmo/i_travel_m IN LOCAL MODE
    ENTITY Travel BY \\_Booking
    FIELDS ( FlightPrice CurrencyCode )
    WITH CORRESPONDING #( keys )
    RESULT FINAL(lt_bookings).

  " Read root travels to obtain the master currency
  READ ENTITIES OF /dmo/i_travel_m IN LOCAL MODE
    ENTITY Travel
    FIELDS ( BookingFee CurrencyCode )
    WITH CORRESPONDING #( keys )
    RESULT FINAL(lt_travels).

  LOOP AT lt_travels INTO FINAL(ls_travel).
    " Aggregate all booking prices matching root travel currency using REDUCE
    FINAL(lv_bookings_sum) = REDUCE /dmo/total_price(
      INIT sum = CONV /dmo/total_price( 0 )
      FOR ls_book IN lt_bookings
      WHERE ( CurrencyCode = ls_travel-CurrencyCode )
      NEXT sum = sum + ls_book-FlightPrice
    ).

    " Total Travel Price = Booking Fee + Sum of Flights
    FINAL(lv_final_total) = ls_travel-BookingFee + lv_bookings_sum.

    " Modify transactional buffer via EML
    MODIFY ENTITIES OF /dmo/i_travel_m IN LOCAL MODE
      ENTITY Travel
      UPDATE FIELDS ( TotalPrice )
      WITH VALUE #( ( %tky = ls_travel-%tky TotalPrice = lv_final_total ) ).
  ENDLOOP.
ENDMETHOD.`
      },
      {
        name: 'Conditional Branching with COND #( ) & SWITCH #( )',
        sapDocRef: 'SAP RAP Guide: Chapter 6 - Instance Feature Control & Dynamic UI Capabilities',
        syntax: `" Arbitrary Boolean Logic:
DATA(lv_tier) = COND string_type(
  WHEN condition_1             THEN result_1
  WHEN condition_2 AND cond_3  THEN result_2
  ELSE default_fallback
).

" Discrete Value Equality Matching:
DATA(lv_label) = SWITCH string_type( operand_variable
  WHEN 'VAL_A' THEN 'Label Alpha'
  WHEN 'VAL_B' THEN 'Label Beta'
  ELSE 'Unknown Fallback'
).`,
        laymanAnalogy: 'Imagine a modern automated airport gate. If you have a VIP ticket, the VIP gate opens (`COND WHEN ticket = "VIP"`). If you have standard boarding, the normal gate opens. If your ticket is expired, the alarm sounds (`ELSE`). `COND` and `SWITCH` are smart single-line decision engines that replace 20 lines of clunky nested `IF ... ELSEIF ... ENDIF` blocks.',
        technicalDefinition: `\`COND #( )\` and \`SWITCH #( )\` are conditional constructor expressions that evaluate conditions and return an operand value directly in-place.
- \`COND #( )\`: Evaluates arbitrary logical expressions, supporting relational operators (\`<\`, \`>\`, \`=\`, \`BETWEEN\`, \`IN\`), compound boolean expressions (\`AND\`, \`OR\`, \`NOT\`), and method return calls.
- \`SWITCH #( )\`: Evaluates discrete equality matches (\`=\`) against a single pivot operand (similar to \`switch\` in TypeScript/Java or pattern matching on scalar values).

Evaluation Rules:
1. Short-circuit evaluation: conditions are evaluated sequentially from top to bottom. The first \`WHEN\` that evaluates to true immediately terminates expression evaluation, returning the corresponding \`THEN\` value without evaluating subsequent branches.
2. Context Type Inference: with \`#\`, the return type is determined by the LHS operand or method parameter signature.
3. Explicit Default: every production \`COND\` and \`SWITCH\` must include an \`ELSE\` fallback to guarantee total function safety.

In RAP, conditional expressions are critical for Dynamic Instance Feature Control (\`get_features\` in \`lhc_travel\`). Based on the \`OverallStatus\` of a travel instance ('O' = Open, 'A' = Accepted, 'X' = Cancelled), \`COND\` or \`SWITCH\` expressions dynamically enable or disable UI buttons (\`acceptTravel\`, \`rejectTravel\`) and mark fields as read-only or mandatory.`,
        underTheHood: `The ABAP compiler compiles \`COND\` and \`SWITCH\` expressions into direct machine jump tables (for \`SWITCH\`) and branch instructions (for \`COND\`) within the kernel execution stream. Unlike legacy \`IF/ENDIF\` blocks that required manual variable assignment inside each branch, conditional expressions load the evaluated value directly into the target CPU register, eliminating intermediate stack pointer manipulation.`,
        commonPitfall: `The Catastrophic \`CX_SY_CONDITIONAL_EXPRESSION_ERROR\` Dump: In Java or JavaScript, an unmatched switch statement quietly returns \`undefined\` or \`null\`. In ABAP, if NO \`WHEN\` branch matches and the \`ELSE\` branch is omitted, the ABAP runtime engine raises the fatal catchable exception \`CX_SY_CONDITIONAL_EXPRESSION_ERROR\`. If unhandled, this results in an immediate production short dump (\`UNCAUGHT_EXCEPTION\`)! Clean Core certification mandates that EVERY \`COND\` and \`SWITCH\` expression MUST provide an explicit \`ELSE\` clause.`,
        modernExample: `" RAP Dynamic Feature Control: lhc_travel->get_features in /DMO/BP_TRAVEL_M
METHOD get_features.
  READ ENTITIES OF /dmo/i_travel_m IN LOCAL MODE
    ENTITY Travel
    FIELDS ( OverallStatus )
    WITH CORRESPONDING #( keys )
    RESULT FINAL(lt_travels).

  result = VALUE #(
    FOR travel IN lt_travels
    ( %tky = travel-%tky

      " Action acceptTravel is ONLY enabled if travel status is Open ('O')
      %action-acceptTravel = COND #(
        WHEN travel-OverallStatus = 'O'
          THEN if_abap_behv=>fc-o-enabled
        ELSE if_abap_behv=>fc-o-disabled
      )

      " Action rejectTravel is disabled if already rejected ('X')
      %action-rejectTravel = COND #(
        WHEN travel-OverallStatus = 'X'
          THEN if_abap_behv=>fc-o-disabled
        ELSE if_abap_behv=>fc-o-enabled
      )

      " Field BookingFee is read-only once Accepted or Cancelled
      %field-BookingFee = SWITCH #( travel-OverallStatus
        WHEN 'A' THEN if_abap_behv=>fc-f-read_only
        WHEN 'X' THEN if_abap_behv=>fc-f-read_only
        ELSE if_abap_behv=>fc-f-mandatory
      )
    )
  ).
ENDMETHOD.`
      },
      {
        name: 'Modern Open SQL: Strict Syntax, Comma Separation & Released CDS Entities',
        sapDocRef: 'SAP RAP Guide: Chapter 3 - CDS View Entities & Data Modeling Principles',
        syntax: `SELECT FROM /dmo/i_connection_r
  FIELDS AirlineID,
         ConnectionID,
         DepartureAirport,
         DestinationAirport,
         DepartureTime,
         ArrivalTime,
         Distance,
         DistanceUnit
  WHERE DepartureAirport = @lv_dep_airport
    AND AirlineID        = @lv_carrier
  ORDER BY DepartureTime ASCENDING
  INTO TABLE @DATA(lt_connections)
  UP TO 20 ROWS.`,
        laymanAnalogy: 'Legacy ABAP SQL was like a dialect of English from the 16th century where commas were banned, words were out of order, and the computer guessed what you meant. Modern ABAP Open SQL conforms to standard, universal ANSI SQL used across Google, Oracle, and Postgres: table names follow `FROM`, fields are clearly comma-separated, external variables are cleanly tagged with `@`, and the target table is declared right at the bottom.',
        technicalDefinition: `Modern ABAP SQL (introduced incrementally from 7.40 SP05 to 7.57+) represents the total convergence of ABAP database access with modern database standards. In ABAP Cloud (Language Version 5), the classic non-comma syntax is completely forbidden by the compiler.

Strict Clean Core Syntax Rules:
1. \`FROM\` precedes \`FIELDS\`: The source data source follows \`FROM\`, establishing the schema context before columns are specified.
2. Comma-Separated Field Lists: All selected columns must be separated by commas (\`FIELDS field1, field2, field3\`).
3. Mandatory Host Variable Escape with \`@\`: Any ABAP program variable, literal, or expression referenced inside SQL clauses (\`WHERE\`, \`HAVING\`, \`INTO\`) must be escaped with \`@\` (e.g., \`WHERE AirlineID = @lv_carrier\`). This prevents column-vs-variable shadowing vulnerabilities.
4. Inline Target Declarations: Target internal tables and structures are typed automatically by the compiler at the query location: \`INTO TABLE @DATA(lt_data)\` or \`INTO @DATA(ls_row)\`.
5. Access Released CDS View Entities ONLY: Direct SQL queries against underlying transparent database tables (such as \`/DMO/TRAVEL\`, \`BUT000\`, or \`MARA\`) violate S/4HANA Clean Core. Developers must query released C1-contract CDS View Entities (such as \`/DMO/I_Connection_R\`, \`/DMO/I_Flight_R\`, or \`I_BusinessPartner\`).`,
        underTheHood: `Modern Open SQL queries bypass classic application-server buffer parsing and are translated directly by the ABAP Database Interface (DBI) into optimized native SAP HANA SQL execution plans. Projections, calculations, aggregations, and associations are pushed down into HANA columnar in-memory calculation engines, achieving sub-millisecond query execution times across millions of records.`,
        commonPitfall: `Forgetting the \`@\` escape character: writing \`WHERE DepartureAirport = lv_dep_airport\` triggers the compiler error "Host variable lv_dep_airport must be escaped with @". Another fatal Clean Core violation is using \`SELECT *\`: selecting all fields defeats HANA columnar index optimizations, reads unneeded columns into application memory, and breaks when backend tables undergo structural schema evolution. Always specify an explicit comma-separated \`FIELDS\` list.`,
        modernExample: `" Modern Open SQL querying released Flight Scenario CDS View Entity
CLASS zcl_demo_modern_sql DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
ENDCLASS.

CLASS zcl_demo_modern_sql IMPLEMENTATION.
  METHOD if_oo_adt_classrun~main.
    FINAL(lv_target_dep) = 'FRA'. " Frankfurt Airport

    " Query released CDS view entity /DMO/I_Connection_R
    SELECT FROM /dmo/i_connection_r
      FIELDS AirlineID,
             ConnectionID,
             DepartureAirport,
             DestinationAirport,
             Distance,
             DistanceUnit
      WHERE DepartureAirport = @lv_target_dep
      ORDER BY AirlineID, ConnectionID
      INTO TABLE @DATA(lt_active_connections)
      UP TO 10 ROWS.

    out->write( |Fetched { lines( lt_active_connections ) } connections departing from { lv_target_dep }:| ).
    out->write( lt_active_connections ).
  ENDMETHOD.
ENDCLASS.`
      },
      {
        name: 'IF_OO_ADT_CLASSRUN Console Output & Scratch Testing',
        sapDocRef: 'SAP RAP Guide: Chapter 1 & Chapter 2 - Eclipse ADT Development Environment',
        syntax: `CLASS zcl_test_runner DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
ENDCLASS.

CLASS zcl_test_runner IMPLEMENTATION.
  METHOD if_oo_adt_classrun~main.
    out->write( 'Hello ABAP Cloud & SAP RAP!' ).
    out->write( data = lt_flight_records name = 'FLIGHTS' ).
  ENDMETHOD.
ENDCLASS.`,
        laymanAnalogy: 'Think of `if_oo_adt_classrun` as `console.log()` or `print()` for the cloud era. Instead of opening an ugly 1990s SAP GUI blue screen, setting up a transaction code in SE93, and executing a SE38 report with `WRITE:`, you press **F9** in Eclipse ADT and see your output instantly formatted in the built-in Console pane.',
        technicalDefinition: `\`if_oo_adt_classrun\` is the official SAP interface for executable classes in ABAP Cloud (Language Version 5). In SAP BTP ABAP Environment and S/4HANA Cloud, classic Dynpro report programs (\`REPORT\`), transaction codes tied to dynpros, and classic \`WRITE:\` / \`ULINE\` statements are completely banned and cause fatal compilation errors.

Technical Contract:
The interface defines a single method:
\`main( io_out TYPE REF TO if_oo_adt_classrun_out )\`.
The \`out\` object provides an overloaded \`write( )\` method capable of accepting strings, structures, and internal tables.

In RAP development, \`if_oo_adt_classrun\` is the indispensable diagnostic workbench. When implementing complex EML transactions (\`MODIFY ENTITIES\`, \`READ ENTITIES\`) or testing draft persistence before building a Fiori Elements UI, architects build a quick runner class to execute, inspect, and verify Behavior Pool logic in real time.`,
        underTheHood: `When you press F9 in Eclipse ADT, the ADT client sends an HTTP REST request over the ADT backend communication channel. The ABAP application server instantiates the class, invokes the \`main\` method, serializes the output into an XML/JSON payload, and transmits it back to Eclipse, rendering it in the "ABAP Console" tab without ever launching SAP GUI.`,
        commonPitfall: `Attempting to use \`WRITE:\` or \`MESSAGE ... TYPE 'I'\`: In ABAP Cloud, classic Dynpro keywords cause fatal compiler rejections. Always use \`out->write( ... )\` inside console classes, and use class-based exceptions (\`CX_ROOT\`) or RAP reported messages (\`if_abap_behv_message\`) in business logic.`,
        modernExample: `" RAP EML Test Workbench using IF_OO_ADT_CLASSRUN
CLASS zcl_test_rap_eml DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
ENDCLASS.

CLASS zcl_test_rap_eml IMPLEMENTATION.
  METHOD if_oo_adt_classrun~main.
    out->write( '=== Testing RAP EML Read Operation on /DMO/I_Travel_M ===' ).

    " Execute Read EML
    READ ENTITIES OF /dmo/i_travel_m
      ENTITY Travel
      FIELDS ( TravelID AgencyID CustomerID TotalPrice CurrencyCode OverallStatus )
      WITH VALUE #( ( TravelID = '00000001' ) )
      RESULT FINAL(lt_travels)
      FAILED FINAL(lt_failed).

    IF lt_failed IS NOT INITIAL.
      out->write( 'EML Read Failed. Travel instance not found.' ).
      RETURN.
    ENDIF.

    out->write( |Successfully read { lines( lt_travels ) } travel record(s):| ).
    out->write( lt_travels ).
  ENDMETHOD.
ENDCLASS.`
      }
    ],

    // The Battle of Elements (Side-by-Side Showdown)
    elementShowdown: {
      title: 'The Showdown: Classic Declarative Loops vs Modern Constructor Expressions',
      subtitle: 'See how 25 lines of legacy procedural boilerplate collapses into 4 lines of clean, cloud-ready modern ABAP.',
      elementA: {
        name: 'Classic Procedural ABAP (Legacy pre-7.40)',
        syntax: `DATA: lt_emp TYPE TABLE OF ty_emp,
      wa_emp TYPE ty_emp,
      lv_sum TYPE i,
      wa_high TYPE ty_emp,
      lt_high TYPE TABLE OF ty_emp.

SELECT * FROM zemp_db INTO TABLE lt_emp.

LOOP AT lt_emp INTO wa_emp.
  IF wa_emp-salary > 70000.
    lv_sum = lv_sum + wa_emp-salary.
    wa_high = wa_emp.
    APPEND wa_high TO lt_high.
  ENDIF.
ENDLOOP.

WRITE: / 'Total High Payroll:', lv_sum.`,
        pros: ['Familiar to developers who learned ABAP in R/3 4.6C or ECC 6.0.'],
        cons: [
          'Violates S/4HANA Clean Core.',
          'Requires declaring 5 temporary variables polluting the local memory stack.',
          'Prone to work area retention bugs (forgetting CLEAR wa).',
          'Forbidden in ABAP Cloud (WRITE statement causes fatal syntax error).'
        ],
        cleanCoreVerdict: 'NON-COMPLIANT (Fails ATC checks in ABAP Cloud)'
      },
      elementB: {
        name: 'Modern Expression-Oriented ABAP (Cloud Ready 7.57+)',
        syntax: `" 1. Modern Open SQL directly into inline @DATA
SELECT FROM zemp_db
  FIELDS emp_id, full_name, salary, is_active
  INTO TABLE @DATA(lt_emp).

" 2. Declarative list comprehension with FOR & WHERE
FINAL(lt_high) = VALUE tt_emp(
  FOR ls IN lt_emp WHERE ( salary > 70000 ) ( ls )
).

" 3. Functional folding with REDUCE
FINAL(lv_sum) = REDUCE decfloat16(
  INIT total = 0 FOR ls IN lt_high NEXT total = total + ls-salary
).

out->write( |Total High Payroll: { lv_sum }| ).`,
        pros: [
          '100% ABAP Cloud & Clean Core compliant.',
          'Immutable FINAL variables prevent accidental mutation.',
          'Zero manual temporary work areas or CLEAR statements needed.',
          'Runs in Eclipse ADT and on SAP BTP ABAP Environment.'
        ],
        cleanCoreVerdict: 'CERTIFIED CLEAN CORE (Grade A+)'
      },
      comparisonTable: [
        { feature: 'Lines of Code', elementA: '24 lines of repetitive loops & definitions', elementB: '6 lines of declarative expressions', winner: 'Modern ABAP' },
        { feature: 'Variable Pollution', elementA: '5 mutable variables allocated in memory', elementB: 'Zero temporary variables, immutable FINAL()', winner: 'Modern ABAP' },
        { feature: 'Memory Optimization', elementA: 'Repeated internal table reallocation on APPEND', elementB: 'Single block memory allocation via VALUE #()', winner: 'Modern ABAP' },
        { feature: 'ABAP Cloud Compatibility', elementA: '❌ Prohibited (WRITE, non-comma SQL, mutability)', elementB: '✅ 100% Certified for S/4HANA Cloud & BTP', winner: 'Modern ABAP' }
      ],
      architectAdvice: "When refactoring legacy codebases, don't just mechanically replace loops with VALUE. Check if the entire operation can be pushed down to SAP HANA using CDS View Entities or a single REDUCE expression. Keep variables immutable with FINAL whenever they don't need reassignment."
    },

    warStory: "At a global manufacturing client upgrading from ECC 6.0 to S/4HANA 2022, a payroll reconciliation routine was processing 450,000 employee records using nested 'LOOP AT itab INTO wa ... APPEND ... ENDLOOP' with manual accumulators. It took 4 minutes and 12 seconds per run and would occasionally crash with memory overflows. By refactoring the routine to use modern Open SQL pushdown, FOR table comprehension, and REDUCE expressions, runtime dropped from 252 seconds to 4.8 seconds—a 98% performance gain—while eliminating 180 lines of spaghetti code.",

    files: [
      {
        name: 'zcl_modern_abap_deep_dive.clas.abap',
        lang: 'abap',
        code: `CLASS zcl_modern_abap_deep_dive DEFINITION
  PUBLIC FINAL CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.

  PRIVATE SECTION.
    TYPES:
      BEGIN OF ty_employee,
        emp_id     TYPE c LENGTH 8,
        full_name  TYPE string,
        department TYPE string,
        salary     TYPE decfloat16,
        is_active  TYPE abap_bool,
      END OF ty_employee,
      tt_employee TYPE STANDARD TABLE OF ty_employee WITH EMPTY KEY.
ENDCLASS.

CLASS zcl_modern_abap_deep_dive IMPLEMENTATION.
  METHOD if_oo_adt_classrun~main.
    " 1. Inline immutable variable (ABAP 7.57+) & String Template
    FINAL(lv_studio) = 'SAP RAP & React Mastery Studio'.
    out->write( |=== Welcome to { lv_studio } - Masterclass Edition ===| ).

    " 2. Constructing an Internal Table inline with VALUE #()
    DATA(lt_employees) = VALUE tt_employee(
      ( emp_id = 'EMP001' full_name = 'Elena Rostova' department = 'ENGINEERING' salary = 98000 is_active = abap_true )
      ( emp_id = 'EMP002' full_name = 'Devon Taylor'  department = 'FINANCE'     salary = 72000 is_active = abap_true )
      ( emp_id = 'EMP003' full_name = 'Kenji Sato'    department = 'ENGINEERING' salary = 115000 is_active = abap_true )
      ( emp_id = 'EMP004' full_name = 'Sara Al-Mansur' department = 'SALES'      salary = 64000 is_active = abap_false )
      ( emp_id = 'EMP005' full_name = 'Marcus Vance'  department = 'ENGINEERING' salary = 135000 is_active = abap_true )
    ).

    " 3. Table Comprehension (FOR ... IN ... WHERE)
    FINAL(lt_active_engineers) = VALUE tt_employee(
      FOR ls_emp IN lt_employees
      WHERE ( department = 'ENGINEERING' AND is_active = abap_true )
      ( ls_emp )
    ).
    out->write( |Active Engineers Count: { lines( lt_active_engineers ) }| ).

    " 4. Calculating Totals with REDUCE (Functional Aggregation)
    FINAL(lv_total_payroll) = REDUCE decfloat16(
      INIT total = CONV decfloat16( 0 )
      FOR ls_emp IN lt_employees
      WHERE ( is_active = abap_true )
      NEXT total = total + ls_emp-salary
    ).
    out->write( |Total Active Payroll: $ { lv_total_payroll }| ).

    " 5. Categorizing Records with COND and SWITCH
    LOOP AT lt_employees INTO DATA(ls_current).
      FINAL(lv_salary_tier) = COND string(
        WHEN ls_current-salary >= 120000 THEN 'DIRECTOR / PRINCIPAL'
        WHEN ls_current-salary >= 90000  THEN 'SENIOR ARCHITECT'
        WHEN ls_current-salary >= 70000  THEN 'MID-LEVEL DEVELOPER'
        ELSE 'ASSOCIATE DEVELOPER'
      ).

      FINAL(lv_status_badge) = SWITCH string( ls_current-is_active
        WHEN abap_true  THEN '[ACTIVE EMPLOYEE]'
        WHEN abap_false THEN '[INACTIVE / OFFBOARDED]'
      ).

      out->write( |Emp { ls_current-emp_id }: { ls_current-full_name } -> { lv_salary_tier } { lv_status_badge }| ).
    ENDLOOP.

    " 6. Modern ABAP Open SQL (Released CDS View I_BusinessPartner)
    SELECT FROM i_businesspartner
      FIELDS businesspartner, businesspartnerfullname, createdbyuser
      WHERE businesspartnercategory = '1'
      INTO TABLE @DATA(lt_partners)
      UP TO 5 ROWS.

    out->write( |Fetched { lines( lt_partners ) } Business Partners via Released Clean Core API:| ).
    out->write( lt_partners ).
  ENDMETHOD.
ENDCLASS.`
      },
      {
        name: 'zcl_dmo_flight_analytics.clas.abap',
        lang: 'abap',
        code: `CLASS zcl_dmo_flight_analytics DEFINITION
  PUBLIC FINAL CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.

  PRIVATE SECTION.
    TYPES:
      tt_connections TYPE STANDARD TABLE OF /dmo/i_connection_r WITH EMPTY KEY.
ENDCLASS.

CLASS zcl_dmo_flight_analytics IMPLEMENTATION.
  METHOD if_oo_adt_classrun~main.
    out->write( '=== SAP Flight Scenario /DMO/ Clean Core Demonstration ===' ).

    " 1. Modern Open SQL: Querying released /DMO/I_Connection_R CDS View Entity
    FINAL(lv_dep_airport) = 'FRA'. " Frankfurt Main Airport

    SELECT FROM /dmo/i_connection_r
      FIELDS AirlineID,
             ConnectionID,
             DepartureAirport,
             DestinationAirport,
             DepartureTime,
             ArrivalTime,
             Distance,
             DistanceUnit
      WHERE DepartureAirport = @lv_dep_airport
      ORDER BY AirlineID, ConnectionID
      INTO TABLE @DATA(lt_connections)
      UP TO 15 ROWS.

    out->write( |Fetched { lines( lt_connections ) } connections departing from { lv_dep_airport }:| ).

    " 2. Declarative Table Comprehension with FOR, WHERE & LET
    FINAL(lt_long_haul) = VALUE tt_connections(
      FOR conn IN lt_connections
      WHERE ( Distance >= 3000 AND DistanceUnit = 'KM' )
      ( conn )
    ).
    out->write( |Long-Haul International Connections (>=3000 KM): { lines( lt_long_haul ) }| ).

    " 3. Functional Aggregation with REDUCE (Total Route Distance)
    FINAL(lv_total_km) = REDUCE decfloat16(
      INIT total_dist = CONV decfloat16( 0 )
      FOR conn IN lt_connections
      WHERE ( DistanceUnit = 'KM' )
      NEXT total_dist = total_dist + conn-Distance
    ).
    out->write( |Total Flight Distance in Network: { lv_total_km } KM| ).

    " 4. Dynamic Route Classification with COND & SWITCH
    LOOP AT lt_connections INTO FINAL(ls_conn).
      FINAL(lv_haul_type) = COND string(
        WHEN ls_conn-Distance >= 6000 THEN 'INTERCONTINENTAL HAUL'
        WHEN ls_conn-Distance >= 2500 THEN 'REGIONAL MEDIUM HAUL'
        ELSE 'DOMESTIC SHORT HOP'
      ).

      FINAL(lv_carrier_name) = SWITCH string( ls_conn-AirlineID
        WHEN 'LH' THEN 'Lufthansa German Airlines'
        WHEN 'AA' THEN 'American Airlines'
        WHEN 'SQ' THEN 'Singapore Airlines'
        WHEN 'UA' THEN 'United Airlines'
        ELSE |Carrier { ls_conn-AirlineID }|
      ).

      out->write( |Flight { ls_conn-AirlineID } { ls_conn-ConnectionID } [{ lv_carrier_name }]: { ls_conn-DepartureAirport } -> { ls_conn-DestinationAirport } ({ ls_conn-Distance } { ls_conn-DistanceUnit }) => { lv_haul_type }| ).
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.`
      }
    ],

    lineExplanations: [
      { line: 'FINAL(lv_dep_airport) = ...', desc: 'Declares an immutable variable (ABAP 7.57+). The compiler prevents any reassignment later in the method.' },
      { line: 'SELECT FROM /dmo/i_connection_r FIELDS ...', desc: 'Modern ABAP SQL: table precedes FIELDS, comma-separated field list, host variable @lv_dep_airport, querying released Flight Scenario CDS view entity.' },
      { line: 'VALUE tt_connections( FOR conn IN ... WHERE ... )', desc: 'Declarative table comprehension filtering and populating target internal table in a single memory allocation.' },
      { line: 'REDUCE decfloat16( INIT ... NEXT ... )', desc: 'Iterative folding expression accumulating flight distances with exact decfloat16 precision, avoiding integer truncation.' },
      { line: 'COND string( WHEN ... THEN ... ELSE ... )', desc: 'Evaluates conditional branches inline. Guarantees safe evaluation with fallback ELSE to avoid CX_SY_CONDITIONAL_EXPRESSION_ERROR.' },
      { line: 'SWITCH string( ls_conn-AirlineID ... )', desc: 'Direct equality evaluation mapping carrier codes to full airline names.' },
      { line: 'out->write( |...| )', desc: 'Replaces classic WRITE. Uses string templates (|...|) with embedded expressions ({ ... }) and writes to Eclipse ADT console.' }
    ],

    assignment: {
      prompt: 'Write a modern ABAP method or snippet that calculates the average salary of active employees whose salary is above 70,000 using REDUCE and COND (without classic LOOP, APPEND, or WRITE statements). Also fetch 5 released Business Partners using modern ABAP SQL.',
      starterCode: `* Clean Core Modern ABAP Exercise:
* Input table: lt_employees (with fields: salary TYPE decfloat16, is_active TYPE abap_bool)
* 1. Calculate count of qualifying employees with REDUCE
* 2. Calculate sum of qualifying employees with REDUCE
* 3. Compute average salary with FINAL(lv_avg_salary)
* 4. Query released CDS view I_BusinessPartner into @DATA(lt_bp)`,
      hints: [
        'Use REDUCE i( INIT cnt = 0 FOR ls IN lt_employees WHERE ( is_active = abap_true AND salary > 70000 ) NEXT cnt = cnt + 1 )',
        'Use REDUCE decfloat16( INIT sum = 0 FOR ls IN lt_employees WHERE ( is_active = abap_true AND salary > 70000 ) NEXT sum = sum + ls-salary )',
        'Never use classic WRITE or SELECT * FROM but000.'
      ],
      solution: `FINAL(lv_qualifying_count) = REDUCE i(
  INIT cnt = 0
  FOR ls IN lt_employees
  WHERE ( is_active = abap_true AND salary > 70000 )
  NEXT cnt = cnt + 1
).

FINAL(lv_qualifying_sum) = REDUCE decfloat16(
  INIT sum = CONV decfloat16( 0 )
  FOR ls IN lt_employees
  WHERE ( is_active = abap_true AND salary > 70000 )
  NEXT sum = sum + ls-salary
).

FINAL(lv_avg_salary) = COND decfloat16(
  WHEN lv_qualifying_count > 0 THEN lv_qualifying_sum / lv_qualifying_count
  ELSE 0
).

SELECT FROM i_businesspartner
  FIELDS businesspartner, businesspartnerfullname
  WHERE businesspartnercategory = '1'
  INTO TABLE @DATA(lt_bp)
  UP TO 5 ROWS.`
    }
  },

  // =========================================================================
  // DAY 2: OBJECT-ORIENTED ABAP & ABAP UNIT
  // =========================================================================
  {
    id: 'day-2-oop-abap',
    day: 2,
    title: 'Day 2: Object-Oriented ABAP, Exceptions & ABAP Unit',
    subtitle: 'Master enterprise class architecture, dependency injection, class-based exceptions, and automated testing',
    readTime: '19 min read',
    vlogHook: "Welcome back! In Day 2, we are talking about why procedural ABAP (FORM/PERFORM routines, global function pools, and SY-SUBRC checks) is dead in S/4HANA. If an exception happens in your code, does your program dump or does it cleanly bubble up a localized T100 message? Let's build pure OO ABAP classes with dependency injection, class-based exceptions, and automated ABAP Unit test doubles.",
    layman: "Think of an ABAP Class like a smartphone: the user interacts only with the touch screen and buttons (the PUBLIC interface), while the complex wiring, battery, and microchips are hidden inside (the PRIVATE section). If the battery dies, it doesn't explode—it emits a warning signal (a Class-based Exception). ABAP Unit is like an automated quality tester that tests every button on the phone in 2 seconds before it leaves the factory.",
    technical: "ABAP Cloud strictly enforces Object-Oriented programming. Classical subroutines (FORM/PERFORM) and function modules are prohibited or unreleased. Classes are declared with `CLASS ... DEFINITION FINAL CREATE PUBLIC` or `CREATE PRIVATE` for factory patterns. Exception handling relies on classes inheriting from `CX_STATIC_CHECK` (checked at compile time), `CX_DYNAMIC_CHECK`, or `CX_NO_CHECK`. Messages are localized using `IF_T100_MESSAGE` and `IF_T100_DYN_MSG`. Unit test classes (`FOR TESTING`) run in isolated memory roll areas without polluting transactional database tables.",

    deepDiveKeywords: [
      {
        name: 'Pure OO in ABAP Cloud: IF_OO_ADT_CLASSRUN Console Runner',
        syntax: 'CLASS zcl_demo DEFINITION PUBLIC. INTERFACES if_oo_adt_classrun. ... out->write( |...| ).',
        laymanAnalogy: 'The command-line terminal of the ABAP Cloud world. Press F9 in Eclipse ADT and see your output instantly without SAP GUI screens.',
        technicalDefinition: 'Replaces classic SE38 executable report programs. Any global class implementing `IF_OO_ADT_CLASSRUN` provides a standard `main( io_out )` method receiving a reference to `if_oo_adt_classrun_out`.',
        underTheHood: 'Output is streamed directly over RFC/HTTP from the SAP kernel to the ADT console view in Eclipse.',
        commonPitfall: "Using classic `WRITE:` or `MESSAGE ... TYPE 'I'` in ABAP Cloud. Both are blocked by the compiler.",
        modernExample: `METHOD if_oo_adt_classrun~main.\n  out->write( 'Executable console testing in ABAP Cloud' ).\nENDMETHOD.`
      },
      {
        name: 'Factory Patterns & Interface Abstraction for Dependency Injection',
        syntax: 'CLASS-METHODS create RETURNING VALUE(ro_inst) TYPE REF TO zif_service. PRIVATE SECTION. METHODS constructor.',
        laymanAnalogy: 'Ordering a rental car by category (Compact, SUV) instead of buying a specific VIN number off the lot: you can swap the car out anytime.',
        technicalDefinition: 'The Factory Pattern hides the concrete instantiation of a class behind a static method returning an interface reference. Marking the constructor `PRIVATE` ensures external consumers cannot use `NEW zcl_concrete( )` directly.',
        underTheHood: 'Enables seamless substitution of real production classes with mock test doubles during automated ABAP Unit testing.',
        commonPitfall: 'Instantiating concrete classes directly inside business logic with `NEW zcl_service( )`, which prevents test mock injection.',
        modernExample: `CLASS zcl_payroll_service DEFINITION PUBLIC FINAL CREATE PRIVATE.\n  PUBLIC SECTION.\n    INTERFACES zif_payroll_calculator.\n    CLASS-METHODS create RETURNING VALUE(ro_inst) TYPE REF TO zif_payroll_calculator.\nENDCLASS.`
      },
      {
        name: 'Class-Based Exceptions (CX_STATIC_CHECK) & Clean Error Bubbling',
        syntax: 'CLASS zcx_app_error DEFINITION INHERITING FROM cx_static_check. ... RAISE EXCEPTION NEW zcx_app_error( textid = ... ).',
        laymanAnalogy: 'A formal incident report that travels up the corporate hierarchy: the person at the top can read the full case history and decide how to resolve it.',
        technicalDefinition: 'Checked exceptions derived from `CX_STATIC_CHECK`. Methods throwing them must declare `RAISING zcx_...` in their signature, forcing the caller to explicitly handle the exception with `TRY...CATCH`. Combines with `IF_T100_MESSAGE` for localized messages.',
        underTheHood: 'Constructs an exception object with call stack history, source location, and localized message variables.',
        commonPitfall: 'Catching `cx_root` and continuing execution without logging or handling. Always catch specific exceptions!',
        modernExample: `IF iv_salary <= 0.\n  RAISE EXCEPTION NEW zcx_payroll_exception( textid = zcx_payroll_exception=>negative_salary ).\nENDIF.`
      },
      {
        name: 'Automated ABAP Unit Tests (FOR TESTING) & cl_abap_unit_assert',
        syntax: 'CLASS ltc_test DEFINITION FINAL FOR TESTING DURATION SHORT RISK LEVEL HARMLESS. ... cl_abap_unit_assert=>assert_equals( ... ).',
        laymanAnalogy: 'Like Jest, Mocha, or JUnit for ABAP. Run all test suites across the company in seconds with Ctrl+Shift+F10.',
        technicalDefinition: 'The integrated testing framework in ABAP. Test classes are declared locally inside the global class test includes with `FOR TESTING`. They execute automatically in ADT or CI/CD pipelines (ABAP Test Cockpit).',
        underTheHood: 'Test methods execute in an isolated roll area with automatic database rollback (COMMIT WORK is redirected to prevent production data corruption).',
        commonPitfall: 'Setting `RISK LEVEL DANGEROUS` when testing read-only logic. Always use `DURATION SHORT RISK LEVEL HARMLESS` for fast, side-effect-free unit tests.',
        modernExample: `METHOD test_valid_tax.\n  FINAL(lv_tax) = mo_cut->calculate_tax( 1000 ).\n  cl_abap_unit_assert=>assert_equals( act = lv_tax exp = 180 msg = 'Tax calculation failed' ).\nENDMETHOD.`
      }
    ],

    elementShowdown: {
      title: 'The Showdown: Legacy Subroutines (FORM/PERFORM) vs Modern OO ABAP Classes',
      subtitle: 'Why SAP completely abolished FORM / PERFORM routines and Function Modules in ABAP Cloud.',
      elementA: {
        name: 'Legacy Procedural ABAP (Subroutines & Function Modules)',
        syntax: `FORM calculate_bonus USING iv_salary CHANGING cv_bonus.
  IF iv_salary <= 0.
    MESSAGE 'Invalid salary' TYPE 'E'.
  ENDIF.
  cv_bonus = iv_salary * '0.15'.
ENDFORM.

" Calling code:
PERFORM calculate_bonus USING lv_salary CHANGING lv_bonus.
IF sy-subrc <> 0. ... ENDIF.`,
        pros: ['Very simple to write for trivial scripts in SAP R/3.'],
        cons: [
          'No type safety across program boundaries.',
          'Global variables bleed between subroutines causing side effects.',
          'Cannot be unit tested with test doubles or dependency injection.',
          'Completely FORBIDDEN in ABAP Cloud (compiler error).'
        ],
        cleanCoreVerdict: 'OBSOLETE & BLOCKED IN CLOUD'
      },
      elementB: {
        name: 'Modern OO ABAP (Interfaces, Classes & Exceptions)',
        syntax: `CLASS zcl_bonus_calc DEFINITION PUBLIC FINAL CREATE PUBLIC.
  PUBLIC SECTION.
    INTERFACES zif_bonus_calc.
ENDCLASS.

CLASS zcl_bonus_calc IMPLEMENTATION.
  METHOD zif_bonus_calc~calculate_bonus.
    IF iv_salary <= 0.
      RAISE EXCEPTION NEW zcx_invalid_salary( ).
    ENDIF.
    rv_bonus = iv_salary * '0.15'.
  ENDMETHOD.
ENDCLASS.`,
        pros: [
          'Full type safety checked at compile time.',
          'Clean contract separation using interfaces.',
          'Class-based exceptions preserve error context and localized T100 text.',
          'Fully testable with ABAP Unit test doubles.'
        ],
        cons: [
          'Requires declaring class definition and implementation sections.'
        ],
        cleanCoreVerdict: 'CERTIFIED CLEAN CORE (Grade A+)'
      },
      comparisonTable: [
        { feature: 'Type Checking', elementA: 'Weak typing; untyped USING/CHANGING parameters', elementB: 'Strict compile-time typing on method parameters', winner: 'OO ABAP' },
        { feature: 'Error Handling', elementA: 'sy-subrc codes & hard message dumps', elementB: 'Structured class-based exceptions (CX_STATIC_CHECK)', winner: 'OO ABAP' },
        { feature: 'Automated Testing', elementA: 'Impossible to mock without modifying source', elementB: 'Native test doubles via interfaces and ABAP Unit', winner: 'OO ABAP' },
        { feature: 'ABAP Cloud Status', elementA: '❌ Forbidden in Language Version 5', elementB: '✅ Mandatory foundation for all Cloud RAP code', winner: 'OO ABAP' }
      ],
      architectAdvice: 'Never use FUNCTION modules or FORM routines in new code. Encapsulate all logic into global classes, expose them via interfaces, and write ABAP Unit tests with at least 85% branch coverage.'
    },

    warStory: "During a migration to SAP S/4HANA Private Cloud, an insurance client had over 1,400 legacy FUNCTION MODULES that relied on shared global memory in function group top includes. When two web users accessed the same service simultaneously, one user's claim calculations would overwrite the other's due to non-reentrant global state! By refactoring the logic into stateless OO ABAP classes with local instances and class-based exceptions, concurrency collisions dropped to zero and system crashes were eliminated.",

    files: [
      {
        name: 'zcl_payroll_service.clas.abap',
        lang: 'abap',
        code: `CLASS zcl_payroll_service DEFINITION
  PUBLIC FINAL CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES zif_payroll_calculator.
    CLASS-METHODS create RETURNING VALUE(ro_instance) TYPE REF TO zif_payroll_calculator.

  PRIVATE SECTION.
    CONSTANTS: c_tax_rate TYPE decfloat16 VALUE '0.22'.
ENDCLASS.

CLASS zcl_payroll_service IMPLEMENTATION.
  METHOD create.
    ro_instance = NEW zcl_payroll_service( ).
  ENDMETHOD.

  METHOD zif_payroll_calculator~calculate_net.
    IF iv_gross_salary < 0.
      RAISE EXCEPTION NEW zcx_payroll_exception(
        textid = zcx_payroll_exception=>negative_salary
      ).
    ENDIF.

    rv_net_salary = iv_gross_salary * ( 1 - c_tax_rate ).
  ENDMETHOD.
ENDCLASS.`
      },
      {
        name: 'zcl_payroll_service.clas.testclasses.abap',
        lang: 'abap',
        code: `CLASS ltc_payroll_unit_test DEFINITION FINAL FOR TESTING
  DURATION SHORT
  RISK LEVEL HARMLESS.

  PRIVATE SECTION.
    DATA mo_cut TYPE REF TO zif_payroll_calculator.

    METHODS setup.
    METHODS test_valid_salary_calculation FOR TESTING RAISING cx_static_check.
    METHODS test_negative_salary_exception FOR TESTING.
ENDCLASS.

CLASS ltc_payroll_unit_test IMPLEMENTATION.
  METHOD setup.
    mo_cut = zcl_payroll_service=>create( ).
  ENDMETHOD.

  METHOD test_valid_salary_calculation.
    FINAL(lv_net) = mo_cut->calculate_net( 100000 ).
    cl_abap_unit_assert=>assert_equals(
      act = lv_net
      exp = 78000
      msg = 'Net salary calculation with 22% tax deduction failed'
    ).
  ENDMETHOD.

  METHOD test_negative_salary_exception.
    TRY.
        mo_cut->calculate_net( -500 ).
        cl_abap_unit_assert=>fail( msg = 'Expected zcx_payroll_exception on negative salary' ).
      CATCH zcx_payroll_exception INTO DATA(lx_err).
        cl_abap_unit_assert=>assert_bound( act = lx_err ).
    ENDTRY.
  ENDMETHOD.
ENDCLASS.`
      }
    ],

    lineExplanations: [
      { line: 'CLASS-METHODS create RETURNING ...', desc: 'Static factory method pattern returning an interface reference for clean dependency injection.' },
      { line: 'RAISE EXCEPTION NEW zcx_payroll_exception(...)', desc: 'Instantiates and raises a class-based exception with a typed T100 message identifier.' },
      { line: 'CLASS ltc_payroll_unit_test DEFINITION FINAL FOR TESTING', desc: 'Declares an ADT ABAP Unit test class. Runs in an isolated test environment without impacting production database records.' },
      { line: 'cl_abap_unit_assert=>assert_equals(...)', desc: 'Standard assertion checking actual output vs expected value.' }
    ],

    assignment: {
      prompt: 'Define an ABAP Unit test class (ltc_order_validator_test) with FOR TESTING, DURATION SHORT, and RISK LEVEL HARMLESS. Implement a test method test_validate_order that tests an order validation class and uses cl_abap_unit_assert=>assert_equals.',
      starterCode: `* Day 2 Exercise:
* Declare local test class ltc_order_validator_test
* Add setup method and test method
* Assert that order discount calculation returns expected value`,
      hints: [
        'Add FINAL FOR TESTING DURATION SHORT RISK LEVEL HARMLESS to the class definition.',
        'Use cl_abap_unit_assert=>assert_equals( act = lv_actual exp = lv_expected ).',
        'No classic FORM/PERFORM.'
      ],
      solution: `CLASS ltc_order_validator_test DEFINITION FINAL FOR TESTING
  DURATION SHORT
  RISK LEVEL HARMLESS.

  PRIVATE SECTION.
    DATA mo_cut TYPE REF TO zif_order_validator.
    METHODS setup.
    METHODS test_discount_calc FOR TESTING.
ENDCLASS.

CLASS ltc_order_validator_test IMPLEMENTATION.
  METHOD setup.
    mo_cut = NEW zcl_order_validator( ).
  ENDMETHOD.

  METHOD test_discount_calc.
    FINAL(lv_discount) = mo_cut->calculate_discount( iv_amount = 1000 ).
    cl_abap_unit_assert=>assert_equals(
      act = lv_discount
      exp = 100
      msg = 'Discount calculation failed for amount 1000'
    ).
  ENDMETHOD.
ENDCLASS.`
    }
  },

  // =========================================================================
  // DAY 3: CDS VIEW ENTITIES & VIRTUAL DATA MODEL (VDM)
  // =========================================================================
  {
    id: 'day-3-cds-entities',
    day: 3,
    title: 'Day 3: CDS View Entities & Virtual Data Model (VDM)',
    subtitle: 'Build high-performance, virtualized data models on SAP HANA without legacy DDIC SQL views',
    readTime: '21 min read',
    vlogHook: "Welcome to Day 3! Today we enter the foundation of modern SAP architecture: Core Data Services (CDS). But wait—are you still writing 'DEFINE VIEW' with '@AbapCatalog.sqlViewName'? STOP! That is deprecated. SAP introduced CDS View Entities in ABAP 7.55 and S/4HANA 2022 to completely replace DDIC views. Let's understand why and build a rock-solid Virtual Data Model.",
    layman: "Imagine you work at a huge library. A classic database table is like a giant basement storage room packed with raw paper folders. A CDS View Entity is like a brilliant research librarian: you ask for 'Active Employees in Berlin with their Department Name', and the librarian instantly pulls only those exact columns on the fly without making duplicate photocopies or messing up the basement files.",
    technical: "Introduced in ABAP 7.55 and feature-complete in 7.88 / S/4HANA 2022, `DEFINE [ROOT] VIEW ENTITY` completely replaces legacy `DEFINE VIEW`. Legacy CDS views generated two distinct artifacts: the CDS DDL source and an SE11 DDIC SQL View in the database dictionary. CDS View Entities do NOT generate an SE11 SQL view. This eliminates view activation locks, cyclic dependencies, and type mismatches. In the SAP Virtual Data Model (VDM), we build Basic/Interface Views (`ZI_*`) and Consumption/Projection Views (`ZC_*`) with `provider contract transactional_query`.",

    deepDiveKeywords: [
      {
        name: 'Migrating from Legacy DEFINE VIEW (DDIC) to DEFINE ROOT VIEW ENTITY (7.55+)',
        syntax: 'define root view entity ZI_Employee as select from zemp_db { key emp_uuid, ... }',
        laymanAnalogy: 'The root anchor of an entire family tree (e.g. Sales Order Header is the root; line items are children).',
        technicalDefinition: 'Declares the top-level root entity of a RAP Business Object composition tree. A BO can have only one Root entity, which acts as the lock master and transactional anchor. Zero SE11 SQL view is generated.',
        underTheHood: 'Parsed and managed directly by the CDS compiler and SAP HANA SQL optimizer. No SE11 view is generated.',
        commonPitfall: 'Using legacy `define view` with `@AbapCatalog.sqlViewName`. That generates an obsolete DDIC SQL view and fails modern RAP strict checks.',
        modernExample: `define root view entity ZI_Employee\n  as select from zemp_table_db\n{\n  key emp_uuid as EmployeeUUID,\n      emp_id   as EmployeeId\n}`
      },
      {
        name: 'On-Demand Lazy Joins with Associations [0..1] and [0..*]',
        syntax: 'association [0..1] to ZI_Department as _Department on $projection.DeptId = _Department.DeptId',
        laymanAnalogy: 'A lazy hyperlink on a website: related data is only fetched from the database when a user actually clicks or requests that column, saving massive memory.',
        technicalDefinition: 'A conceptual relationship between entities that defines a join condition evaluated strictly on-demand (lazy loading). Unlike standard SQL JOINs that execute immediately, an Association only translates into an SQL JOIN in HANA if elements of the associated view are requested in the SELECT list.',
        underTheHood: 'Pushed down to the SAP HANA query engine. If the client queries only employee name, the department table is never touched.',
        commonPitfall: 'Forgetting the `$projection` prefix when defining the ON condition in CDS View Entities: `on $projection.DepartmentId = _Department.DepartmentId`.',
        modernExample: `association [0..1] to ZI_Department as _Department\n  on $projection.DepartmentId = _Department.DepartmentId`
      },
      {
        name: 'Strict Parent-Child Composition Trees for Business Objects',
        syntax: 'composition [0..*] of ZI_SalesOrderItem as _Items',
        laymanAnalogy: 'A strict parent-child bond: a Sales Order Item cannot exist floating in space without its parent Sales Order Header. If the Header is deleted, all items die with it.',
        technicalDefinition: 'Defines an intra-Business-Object lifecycle dependency. Compositions define the strict hierarchical tree of a RAP Business Object. Locking, authorizations, and draft handling cascade automatically from the root down through compositions.',
        underTheHood: 'The RAP transactional runtime uses composition trees to manage deep creates, cascade deletions, and draft synchronization.',
        commonPitfall: 'Using standard `association` instead of `composition` for child entities that belong to the same Business Object.',
        modernExample: `composition [0..*] of ZI_EmployeeSkill as _Skills`
      },
      {
        name: 'Data Control Language (DCL) Role-Based Authorization with Access Control',
        syntax: '@AccessControl.authorizationCheck: #CHECK ... define role ZI_EmployeeRole { grant select on ZI_Employee where ( Plant ) = aspect pfcg_auth( M_MATE_WRK, WERKS, ACTVT = \'03\' ); }',
        laymanAnalogy: 'A bouncer at the database level: if a user does not have permission for the Berlin plant, those rows vanish from query results automatically.',
        technicalDefinition: 'Row-level security embedded directly into the CDS layer using Access Control objects. When `@AccessControl.authorizationCheck: #CHECK` is enabled, the SAP HANA optimizer automatically injects PFCG authorization checks into every SQL query.',
        underTheHood: 'Evaluated in the SAP HANA kernel during SQL execution, preventing unauthorized data from ever leaving the database engine.',
        commonPitfall: 'Using `#NOT_REQUIRED` in production. Always set `#CHECK` for real business entities to prevent security bypass.',
        modernExample: `@AccessControl.authorizationCheck: #CHECK\ndefine root view entity ZI_Employee as select from zemp_db ...`
      }
    ],

    elementShowdown: {
      title: 'The Showdown: Legacy DEFINE VIEW (DDIC) vs Modern DEFINE VIEW ENTITY',
      subtitle: 'Why SAP deprecated DDIC-based CDS views in favor of View Entities in modern S/4HANA.',
      elementA: {
        name: 'Legacy CDS View (DEFINE VIEW with SE11 View)',
        syntax: `@AbapCatalog.sqlViewName: 'ZEMP_SQL_V'
@AbapCatalog.compiler.compareFilter: true
define view ZI_LegacyEmployee
  as select from zemp_db
{
  key emp_uuid as EmployeeUUID,
      emp_id   as EmployeeId
}`,
        pros: ['Supported in older ABAP releases (7.40 to 7.54).'],
        cons: [
          'Generates a classic SE11 SQL view in the DDIC.',
          'Activation locks both CDS and DDIC views, leading to deadlock in large transport requests.',
          'Inconsistent type handling between ABAP dictionary and HANA DB.',
          'Deprecated for modern RAP Business Object development.'
        ],
        cleanCoreVerdict: 'DEPRECATED FOR RAP'
      },
      elementB: {
        name: 'Modern CDS View Entity (DEFINE VIEW ENTITY)',
        syntax: `@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Employee Interface View'
define root view entity ZI_Employee
  as select from zemp_db
{
  key emp_uuid as EmployeeUUID,
      emp_id   as EmployeeId
}`,
        pros: [
          'Zero DDIC SQL view generated in SE11.',
          '5x faster activation time with zero cyclic dependency locks.',
          'Strict type checking, strict parameter rules, and strict null handling.',
          'Mandatory foundation for modern RAP Managed & Unmanaged BOs.'
        ],
        cons: [
          'Requires ABAP 7.55 or higher (S/4HANA 2020+).'
        ],
        cleanCoreVerdict: 'CERTIFIED CLEAN CORE (Grade A+)'
      },
      comparisonTable: [
        { feature: 'SE11 DDIC SQL View', elementA: 'Generated (e.g. ZEMP_SQL_V)', elementB: 'None (pure CDS entity)', winner: 'View Entity' },
        { feature: 'Activation Speed', elementA: 'Slow due to two-phase DDIC synchronisation', elementB: 'Instantaneous compiler activation', winner: 'View Entity' },
        { feature: 'Cyclic Dependencies', elementA: 'Frequently deadlocks during transport import', elementB: 'Cleanly resolved by CDS compiler', winner: 'View Entity' },
        { feature: 'RAP Compatibility', elementA: 'Legacy workaround mode', elementB: 'Native strict ( 2 ) compatibility', winner: 'View Entity' }
      ],
      architectAdvice: 'In any project on S/4HANA 2020 or later, NEVER write `@AbapCatalog.sqlViewName`. Always write `define [root] view entity`. When migrating older systems, use the ADT automated quick fix to convert legacy views to view entities.'
    },

    warStory: "During a major S/4HANA migration with over 800 custom CDS views, transport imports were failing repeatedly with DDIC activation deadlocks between parent-child views. By converting all 800 views from legacy `DEFINE VIEW` to `DEFINE VIEW ENTITY` using ADT automated refactoring, the entire transport import time dropped from 45 minutes of lock contention to under 3 minutes with zero errors.",

    files: [
      {
        name: 'ZI_Employee.ddls.asddls',
        lang: 'cds',
        code: `@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Employee Interface View Entity'
@Metadata.allowExtensions: true

define root view entity ZI_Employee
  as select from zemp_table_db as Employee
  composition [0..*] of ZI_EmployeeSkill as _Skills
  association [0..1] to ZI_Department   as _Department
    on $projection.DepartmentId = _Department.DepartmentId
{
  key emp_uuid             as EmployeeUUID,
      emp_id               as EmployeeId,
      first_name           as FirstName,
      last_name            as LastName,
      concat_with_spaces(first_name, last_name, 1) as FullName,
      department_id        as DepartmentId,
      salary               as Salary,
      currency_code        as CurrencyCode,
      status               as Status,
      @Semantics.systemDateTime.createdAt: true
      created_at           as CreatedAt,
      @Semantics.systemDateTime.lastChangedAt: true
      last_changed_at      as LastChangedAt,

      /* Associations */
      _Department,
      _Skills
}`
      },
      {
        name: 'ZC_Employee.ddls.asddls',
        lang: 'cds',
        code: `@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Employee Projection View for OData'
@Metadata.allowExtensions: true

define root view entity ZC_Employee
  provider contract transactional_query
  as projection on ZI_Employee
{
  key EmployeeUUID,
      EmployeeId,
      FirstName,
      LastName,
      FullName,
      DepartmentId,
      Salary,
      CurrencyCode,
      Status,
      LastChangedAt,

      /* Redirected target */
      _Department,
      _Skills : redirected to composition child ZC_EmployeeSkill
}`
      }
    ],

    lineExplanations: [
      { line: 'define root view entity ZI_Employee', desc: 'Modern CDS View Entity syntax. Does not generate an SE11 SQL view, making it lightweight and Cloud-ready.' },
      { line: 'composition [0..*] of ZI_EmployeeSkill as _Skills', desc: 'Declares an intra-BO parent-child relationship where skills cannot exist without the parent employee root.' },
      { line: 'provider contract transactional_query as projection on ...', desc: 'Mandatory contract for Projection Views (ZC_*) exposed in modern RAP. Enforces transactional compliance.' },
      { line: 'redirected to composition child ...', desc: 'Re-binds the composition target from the interface layer to the consumption layer for OData projection.' }
    ],

    assignment: {
      prompt: 'Write a CDS projection view entity ZC_Department that projects on ZI_Department with provider contract transactional_query, includes DepartmentId, DepartmentName, ManagerId, and enables authorization checks.',
      starterCode: `* Day 3 Exercise:
* Define projection view entity ZC_Department on ZI_Department
* Set @AccessControl.authorizationCheck: #CHECK
* Use provider contract transactional_query`,
      hints: [
        'Use define root view entity ZC_Department provider contract transactional_query as projection on ZI_Department',
        'Do not use DEFINE VIEW (legacy DDIC syntax).'
      ],
      solution: `@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Department Projection View'
define root view entity ZC_Department
  provider contract transactional_query
  as projection on ZI_Department
{
  key DepartmentUUID,
      DepartmentId,
      DepartmentName,
      ManagerId,
      CostCenter,
      LastChangedAt
}`
    }
  },

  // =========================================================================
  // DAY 4: SAP RAP ARCHITECTURE & MANAGED BUSINESS OBJECTS
  // =========================================================================
  {
    id: 'day-4-rap-managed',
    day: 4,
    title: 'Day 4: SAP RAP Architecture: Managed Business Objects',
    subtitle: 'Implement cloud-ready transactional Business Objects with automated CRUD, locking, and persistence',
    readTime: '22 min read',
    vlogHook: "Welcome to Day 4! Today we tackle the core of modern SAP development: the ABAP RESTful Application Programming Model (RAP). If you come from classic SAP, you might remember BOPF, BAPIs, or manual COMMIT WORK in update tasks. RAP unifies all of this. In this chapter, we look at the 3 Pillars of RAP and pit Managed RAP against Unmanaged RAP.",
    layman: "Managed RAP is like using Supabase or Prisma for SAP: you provide the database table and CDS model, and the framework automatically writes all the SQL INSERT, UPDATE, DELETE, and concurrency locking code for you. Unmanaged RAP is when you're renovating a historic 100-year-old house and must manually connect the plumbing because you are wrapping an old BAPI from 2004.",
    technical: "RAP standardizes transactional application development across SAP BTP and SAP S/4HANA (both On-Premise and Cloud). As outlined in Discovering ABAP and SAP Innovation Hub, RAP is built on three architectural pillars:\n1. Data Modeling & Behavior (CDS View Entities + BDEF)\n2. Business Services Exposure (Service Definition)\n3. Service Consumption (Service Binding for OData V4/V2).\nIn a Managed BO, the RAP framework manages the transactional buffer, optimistic locking via ETags, and standard persistence. The BDEF declares `strict ( 2 );` which enforces modern compiler rules, authorization master declarations, and explicit field characteristics.",

    deepDiveKeywords: [
      {
        name: 'The 3 Pillars of RAP (Discovering ABAP Core Framework)',
        syntax: '1. CDS + BDEF -> 2. Service Definition -> 3. Service Binding',
        laymanAnalogy: '1. The Recipe & Cooking (Data + Logic), 2. The Restaurant Menu (API Exposure), 3. The Waiter delivering the food to the table (OData V4 Protocol Binding).',
        technicalDefinition: 'The core RAP architecture: Layer 1 defines the data model (CDS View Entities) and behavior definition (BDEF). Layer 2 defines which projection views to expose (`define service`). Layer 3 binds the service to an endpoint protocol (OData V4 - Web API or UI).',
        underTheHood: 'Orchestrated by the SAP Gateway Foundation and the RAP Transactional Framework.',
        commonPitfall: 'Skipping the projection layer and exposing interface views directly in the service definition.',
        modernExample: `* Pillar 1: CDS + BDEF\n* Pillar 2: define service ZAPI_EMP_O4 { expose ZC_Employee as Employee; }\n* Pillar 3: Service Binding ZSB_EMP_O4 (OData V4 - Web API)`
      },
      {
        name: 'Managed Implementation Runtime (Automatic CRUD & Buffering)',
        syntax: 'managed implementation in class zbp_i_employee unique; strict ( 2 );',
        laymanAnalogy: 'Auto-pilot mode for database operations. You only write code when you need custom business rules (like checking credit limit).',
        technicalDefinition: 'A RAP implementation type where standard CRUD operations (Create, Read, Update, Delete) and standard database persistence are handled out-of-the-box by the RAP runtime. The developer only writes code for validations, determinations, and custom actions inside the behavior pool class (`zbp_*`).',
        underTheHood: 'The RAP framework generates optimized HANA SQL INSERT/UPDATE/DELETE statements during the Save Sequence.',
        commonPitfall: 'Writing manual COMMIT WORK inside a managed behavior implementation. Doing so triggers a short dump!',
        modernExample: `managed implementation in class zbp_i_employee unique;\nstrict ( 2 );\ndefine behavior for ZI_Employee alias Employee\npersistent table zemp_table_db\nlock master ...`
      },
      {
        name: 'Lock Master & ETags Concurrency Mechanics',
        syntax: 'lock master etag master LastChangedAt',
        laymanAnalogy: 'Like Google Docs detecting when someone else edited a paragraph while you were offline, preventing your changes from overwriting theirs.',
        technicalDefinition: 'Concurrency control in RAP. `lock master` declares which entity controls the exclusive enqueue lock for the composition tree. `etag master` points to a timestamp field used for optimistic concurrency control (transmitting HTTP ETag headers in OData V4).',
        underTheHood: 'During the interaction phase, SAP Gateway validates the `If-Match` ETag header sent by React against the current database timestamp.',
        commonPitfall: 'Failing to include a `last_changed_at` timestamp field in your database table.',
        modernExample: `lock master\netag master LastChangedAt`
      },
      {
        name: 'Managed UUID Numbering vs Semantic Numbering',
        syntax: 'field ( readonly, numbering : managed ) EmployeeUUID;',
        laymanAnalogy: 'Auto-incrementing ID in MySQL or UUID v4 in JavaScript, handled by the server without asking the user.',
        technicalDefinition: 'Instructs the RAP framework to automatically generate a 16-byte raw UUID (sysuuid_x16) during the CREATE operation before the record is saved. Replaces manual number range object logic for technical keys.',
        underTheHood: 'Generated in the kernel during early numbering before the validation sequence executes.',
        commonPitfall: 'Allowing the frontend to pass custom UUIDs for managed numbering fields. Mark the field as `readonly` in the BDEF!',
        modernExample: `field ( readonly, numbering : managed ) EmployeeUUID;`
      }
    ],

    elementShowdown: {
      title: 'The Showdown: Managed RAP vs Unmanaged RAP',
      subtitle: 'Greenfield development with framework automation vs Brownfield legacy integration.',
      elementA: {
        name: 'Unmanaged RAP (Brownfield / Legacy BAPI Wrapper)',
        syntax: `unmanaged implementation in class zbp_i_legacy unique;
strict ( 2 );

define behavior for ZI_LegacyOrder alias Order
lock master
authorization master ( instance )
{
  create;
  update;
  delete;
}`,
        pros: [
          'Can wrap existing classic BAPIs (like BAPI_SALESORDER_CREATEFROMDAT2) or legacy update function modules.',
          'Gives complete control over the transactional buffer and save phase.'
        ],
        cons: [
          'The developer must manually write 100% of the CRUD logic in the Behavior Pool.',
          'Must manually implement locking, buffer management, and commit handling.',
          'Significantly more code and higher risk of bugs.'
        ],
        cleanCoreVerdict: 'FOR LEGACY WRAPPERS ONLY'
      },
      elementB: {
        name: 'Managed RAP (Greenfield / S/4HANA Standard)',
        syntax: `managed implementation in class zbp_i_order unique;
strict ( 2 );

define behavior for ZI_Order alias Order
persistent table zorder_db
lock master
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;
  field ( readonly, numbering : managed ) OrderUUID;
}`,
        pros: [
          'CRUD, locking, and persistence handled automatically by the RAP framework.',
          'Up to 80% less code than unmanaged implementations.',
          'Native Draft handling support out-of-the-box.',
          'Fully certified for ABAP Cloud and Clean Core.'
        ],
        cons: [
          'Directly operates on transparent custom database tables (not classic BAPIs).'
        ],
        cleanCoreVerdict: 'CERTIFIED CLEAN CORE (Recommended Standard)'
      },
      comparisonTable: [
        { feature: 'CRUD Implementation', elementA: 'Manual: developer writes CREATE/UPDATE/DELETE handlers', elementB: 'Automatic: RAP runtime handles database persistence', winner: 'Managed RAP' },
        { feature: 'Locking & Concurrency', elementA: 'Manual: developer calls ENQUEUE/DEQUEUE', elementB: 'Automatic: RAP lock master & ETag management', winner: 'Managed RAP' },
        { feature: 'Draft Handling', elementA: 'Extremely complex to implement manually', elementB: 'Native: single keyword `with draft;`', winner: 'Managed RAP' },
        { feature: 'Best Use Case', elementA: 'Wrapping existing classic BAPIs in S/4HANA', elementB: 'New enterprise applications on BTP or S/4HANA', winner: 'Managed RAP' }
      ],
      architectAdvice: 'Always choose Managed RAP for greenfield applications. Only use Unmanaged RAP when you are forced to wrap legacy business logic that cannot be rewritten into Clean Core CDS/BDEF.'
    },

    warStory: "An enterprise retail client spent 6 months attempting to build an Unmanaged RAP Business Object wrapping a 20-year-old custom BAPI for purchase orders. The unmanaged code was plagued by locking deadlocks, broken draft states, and buffer inconsistencies. We stepped in, designed a clean Managed RAP BO directly on a modernized transparent table structure with validations and determinations, and completed the entire production-ready service in just 2 weeks with 75% less code.",

    files: [
      {
        name: 'ZI_Employee.bdef',
        lang: 'bdef',
        code: `managed implementation in class zbp_i_employee unique;
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

  mapping for zemp_table_db
  {
    EmployeeUUID  = emp_uuid;
    EmployeeId    = emp_id;
    FirstName     = first_name;
    LastName      = last_name;
    DepartmentId  = department_id;
    Salary        = salary;
    CurrencyCode  = currency_code;
    Status        = status;
    CreatedAt     = created_at;
    LastChangedAt = last_changed_at;
  }
}`
      }
    ],

    lineExplanations: [
      { line: 'managed implementation in class zbp_i_employee unique;', desc: 'Delegates CRUD and database saves to the RAP framework, while handler methods reside in local class zbp_i_employee.' },
      { line: 'strict ( 2 );', desc: 'SAP best-practice strict mode. Mandates explicit mapping, prevents unreleased statements, and verifies Cloud readiness.' },
      { line: 'field ( readonly, numbering : managed ) EmployeeUUID;', desc: 'Instructs RAP to generate a cryptographically secure 16-byte raw UUID during the CREATE operation.' },
      { line: 'etag master LastChangedAt', desc: 'Enforces optimistic concurrency control. SAP Gateway uses this timestamp to verify whether another user updated the record.' }
    ],

    assignment: {
      prompt: 'Write a modern RAP managed behavior definition header for entity ZI_Product with persistent table zprod_db, strict ( 2 ), lock master, authorization master ( instance ), and managed numbering on ProductUUID.',
      starterCode: `* Day 4 Exercise:
* Create managed BDEF for ZI_Product
* Enforce strict ( 2 )
* Set ProductUUID as readonly with numbering : managed`,
      hints: [
        'Start with: managed implementation in class zbp_i_product unique;',
        'Always include: strict ( 2 );',
        'Add: field ( readonly, numbering : managed ) ProductUUID;'
      ],
      solution: `managed implementation in class zbp_i_product unique;
strict ( 2 );

define behavior for ZI_Product alias Product
persistent table zprod_db
lock master
authorization master ( instance )
etag master LastChangedAt
{
  create;
  update;
  delete;

  field ( readonly, numbering : managed ) ProductUUID;
  field ( readonly ) CreatedAt, LastChangedAt;
  field ( mandatory ) ProductId, ProductName, Price;

  mapping for zprod_db
  {
    ProductUUID   = prod_uuid;
    ProductId     = prod_id;
    ProductName   = prod_name;
    Price         = price;
    CurrencyCode  = currency_code;
    CreatedAt     = created_at;
    LastChangedAt = last_changed_at;
  }
}`
    }
  },

  // =========================================================================
  // DAY 5: BDEF VALIDATIONS & DETERMINATIONS
  // =========================================================================
  {
    id: 'day-5-bdef-validations',
    day: 5,
    title: 'Day 5: Behavior Definitions, Validations & Determinations',
    subtitle: 'Enforce business rules, automated field derivation, and structured error reporting',
    readTime: '23 min read',
    vlogHook: "Welcome to Day 5! In today's masterclass, we explore how business rules actually execute in RAP. When a user clicks 'Save' or edits a field in React, how does SAP validate the data? And how does it derive fields automatically? Today we break down Validations vs Determinations and the critical FAILED and REPORTED tables.",
    layman: "A Validation is like a strict airport security officer: 'Halt, you cannot board the plane with that item (e.g. Salary cannot be negative)'. A Determination is like a smart hotel concierge: 'Welcome, sir! I see you just checked in, so I have automatically set your room temperature to 72 degrees and poured your welcome drink (auto-setting Status = NEW and CreatedAt = NOW)'.",
    technical: "Validations and Determinations are declared in the BDEF and implemented in the Behavior Pool handler class (`lhc_*`). Validations execute during the Save Sequence (`validate on save`) triggered by entity creation or field updates. They must be side-effect-free (read-only). If a validation fails, the key is added to `failed-entity` and localized T100 messages are added to `reported-entity`. Determinations derive values and can execute either `on modify` (interaction phase) or `on save` (save sequence). All intra-BO queries use EML `IN LOCAL MODE`.",

    deepDiveKeywords: [
      {
        name: 'BDEF strict ( 2 ) Mandatory Rules for Cloud Certification',
        syntax: 'strict ( 2 );',
        laymanAnalogy: 'Switching your building code inspection to the highest modern earthquake resistance standard.',
        technicalDefinition: 'The strictest compiler check mode for RAP BDEFs. Enforces explicit field-by-field table mapping (`mapping for ztable`), requires authorization master on all entities, blocks deprecated syntax, and verifies Cloud readiness.',
        underTheHood: 'The RAP compiler verifies that no unreleased statements or implicit legacy mappings exist in the behavior definition.',
        commonPitfall: 'Using `strict;` instead of `strict ( 2 );`. `strict;` is strict mode level 1; modern projects require level 2.',
        modernExample: `managed implementation in class zbp_i_employee unique;\nstrict ( 2 );`
      },
      {
        name: 'Validations on Save: Ensuring Business Integrity & Localized Messages',
        syntax: 'validation validateSalary on save { field Salary; create; update; }',
        laymanAnalogy: 'The bouncer checking IDs before letting people into the club. If invalid, you are turned away before entering.',
        technicalDefinition: 'A business consistency check executed during the RAP save sequence. Triggered when specified fields are modified or when new instances are created. Cannot modify business object data.',
        underTheHood: 'Runs during the Early Save phase. If any instance is registered in `failed`, the RAP runtime aborts the transaction and rolls back the database buffer.',
        commonPitfall: 'Attempting to modify entity fields inside a validation. Validations must be strictly read-only checks! For derivations, use Determinations.',
        modernExample: `validation validateSalary on save { field Salary; create; update; }`
      },
      {
        name: 'Determinations on Modify vs Determinations on Save',
        syntax: 'determination setInitialStatus on modify { create; } determination calcTotal on save { field Price, Qty; }',
        laymanAnalogy: 'Real-time calculation as you type (on modify) vs finalizing the invoice total when you click submit (on save).',
        technicalDefinition: 'Logic that derives or computes business data. `on modify` determinations execute immediately during the interaction phase so the frontend sees the new value in the UI buffer. `on save` determinations execute during the save sequence before commit.',
        underTheHood: 'Executed by the RAP execution manager. Uses EML `MODIFY ENTITIES IN LOCAL MODE` to update the derived attributes.',
        commonPitfall: 'Creating infinite determination loops where Determination A modifies Field B, triggering Determination B which modifies Field A.',
        modernExample: `determination setInitialStatus on modify { create; }`
      },
      {
        name: 'FAILED & REPORTED Tables (%tky, %element, %msg Severity)',
        syntax: 'APPEND VALUE #( %tky = ls_emp-%tky ) TO failed-employee. APPEND VALUE #( %tky = ... %msg = ... %element-Salary = if_abap_behv=>mk-on ) TO reported-employee.',
        laymanAnalogy: 'FAILED is the red stop light that halts the train. REPORTED is the loudspeaker announcement explaining to passengers why the train stopped.',
        technicalDefinition: 'Special implicit structures in the RAP behavior pool. `failed-entity` receives keys of rejected instances, signaling the runtime to abort the save. `reported-entity` receives localized error messages (`%msg`), field links (`%element`), and severity levels transmitted to the client.',
        underTheHood: 'SAP Gateway translates `reported-entity` entries into OData V4 structured JSON error details (`error.details`).',
        commonPitfall: 'Appending to `reported` without appending to `failed`. If you do not append to `failed`, the transaction will still commit to the database despite your error message!',
        modernExample: `APPEND VALUE #( %tky = ls_emp-%tky ) TO failed-employee.\nAPPEND VALUE #( %tky = ls_emp-%tky %msg = new_message_with_text( ... ) ) TO reported-employee.`
      }
    ],

    elementShowdown: {
      title: 'The Showdown: Validations vs Determinations',
      subtitle: 'Understanding the strict separation between consistency checks and data derivations in RAP.',
      elementA: {
        name: 'Validations (Check & Block)',
        syntax: `validation validateSalary on save { field Salary; create; update; }

METHOD validateSalary.
  READ ENTITIES OF zi_employee IN LOCAL MODE ...
  IF ls_emp-Salary <= 0.
    APPEND VALUE #( %tky = ls_emp-%tky ) TO failed-employee.
    APPEND VALUE #( %tky = ls_emp-%tky %msg = ... ) TO reported-employee.
  ENDIF.
ENDMETHOD.`,
        pros: ['Guarantees business integrity before commit.', 'Halts invalid database writes cleanly.'],
        cons: ['Must be strictly read-only; cannot modify entity data.'],
        cleanCoreVerdict: 'SAVE SEQUENCE CONSISTENCY ENFORCER'
      },
      elementB: {
        name: 'Determinations (Calculate & Assign)',
        syntax: `determination setInitialStatus on modify { create; }

METHOD setInitialStatus.
  MODIFY ENTITIES OF zi_employee IN LOCAL MODE
    ENTITY Employee
    UPDATE FIELDS ( Status )
    WITH VALUE #( FOR k IN keys ( %tky = k-%tky Status = 'ACTIVE' ) ).
ENDMETHOD.`,
        pros: ['Automates field population without user intervention.', 'Can run real-time on modify or before save.'],
        cons: ['Must be carefully guarded against infinite loop triggers.'],
        cleanCoreVerdict: 'DATA DERIVATION ENGINE'
      },
      comparisonTable: [
        { feature: 'Primary Purpose', elementA: 'Inspect data and prevent invalid commits', elementB: 'Compute and populate derived field values', winner: 'Context Dependent' },
        { feature: 'Can Modify Data?', elementA: '❌ Strictly prohibited (read-only)', elementB: '✅ Yes, using EML MODIFY IN LOCAL MODE', winner: 'Determinations' },
        { feature: 'Trigger Timing', elementA: 'ON SAVE (Save Sequence)', elementB: 'ON MODIFY (Interaction) or ON SAVE', winner: 'Determinations' },
        { feature: 'Error Reporting', elementA: 'Populates failed and reported tables', elementB: 'Populates reported if derivation encounters issues', winner: 'Validations' }
      ],
      architectAdvice: 'Never mix validation logic into determinations or vice versa. If you need to calculate total price and then verify that total price does not exceed credit limit, use a Determination to compute the total, followed by a Validation to verify the credit limit.'
    },

    warStory: "In a global logistics project, developers wrote EML UPDATE statements inside a Validation on Save to automatically set order status to 'VERIFIED'. This created a recursive loop during the save sequence, resulting in 100% CPU lockups on the SAP HANA instance. Once we separated the logic into a Determination on Save for the status derivation and a pure Validation on Save for the consistency checks, CPU utilization returned to normal and the save completed in 12 milliseconds.",

    files: [
      {
        name: 'zbp_i_employee.clas.locals_imp.abap',
        lang: 'abap',
        code: `CLASS lhc_employee DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    METHODS validateSalary FOR VALIDATE ON SAVE
      IMPORTING keys FOR Employee~validateSalary.

    METHODS setInitialStatus FOR DETERMINE ON MODIFY
      IMPORTING keys FOR Employee~setInitialStatus.
ENDCLASS.

CLASS lhc_employee IMPLEMENTATION.
  METHOD validateSalary.
    " 1. Read instance data using EML IN LOCAL MODE
    READ ENTITIES OF zi_employee IN LOCAL MODE
      ENTITY Employee
      FIELDS ( Salary )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_employees).

    " 2. Validate business constraints
    LOOP AT lt_employees INTO DATA(ls_emp).
      IF ls_emp-Salary <= 0.
        " Report failure to block commit
        APPEND VALUE #( %tky = ls_emp-%tky ) TO failed-employee.

        " Report user-friendly error message
        APPEND VALUE #(
          %tky = ls_emp-%tky
          %msg = new_message_with_text(
            severity = if_abap_behv_message=>severity-error
            text     = |Salary for employee { ls_emp-EmployeeId } must be greater than zero.|
          )
          %element-Salary = if_abap_behv=>mk-on
        ) TO reported-employee.
      ENDIF.
    ENDLOOP.
  ENDMETHOD.

  METHOD setInitialStatus.
    " Derive default status on create
    MODIFY ENTITIES OF zi_employee IN LOCAL MODE
      ENTITY Employee
      UPDATE FIELDS ( Status )
      WITH VALUE #(
        FOR key IN keys
        ( %tky = key-%tky Status = 'NEW' )
      ).
  ENDMETHOD.
ENDCLASS.`
      }
    ],

    lineExplanations: [
      { line: 'READ ENTITIES OF zi_employee IN LOCAL MODE', desc: 'EML statement reading transactional buffer instances without triggering external authorization or feature control.' },
      { line: 'APPEND VALUE #( %tky = ls_emp-%tky ) TO failed-employee.', desc: 'Registers the entity key in failed-entity. This informs the RAP runtime to abort the save transaction.' },
      { line: '%element-Salary = if_abap_behv=>mk-on', desc: 'Links the error message specifically to the Salary field on the UI, highlighting the input red in React / Fiori.' }
    ],

    assignment: {
      prompt: 'Write an ABAP RAP validation method `validateEmail` that reads the EmailAddress field of entity Employee using EML IN LOCAL MODE, checks if it contains an "@" symbol, and appends to failed-employee and reported-employee if invalid.',
      starterCode: `* Day 5 Exercise:
* Implement method validateEmail FOR VALIDATE ON SAVE
* Read EmailAddress using READ ENTITIES OF zi_employee IN LOCAL MODE
* If email does not contain '@', append to failed and reported`,
      hints: [
        'Use READ ENTITIES OF zi_employee IN LOCAL MODE ENTITY Employee FIELDS ( EmailAddress ) ...',
        'Check IF NOT ls_emp-EmailAddress CP "*@*".',
        'Append %tky to failed-employee and reported-employee.'
      ],
      solution: `METHOD validateEmail.
  READ ENTITIES OF zi_employee IN LOCAL MODE
    ENTITY Employee
    FIELDS ( EmailAddress )
    WITH CORRESPONDING #( keys )
    RESULT DATA(lt_employees).

  LOOP AT lt_employees INTO DATA(ls_emp).
    IF NOT ls_emp-EmailAddress CP '*@*'.
      APPEND VALUE #( %tky = ls_emp-%tky ) TO failed-employee.
      APPEND VALUE #(
        %tky = ls_emp-%tky
        %msg = new_message_with_text(
          severity = if_abap_behv_message=>severity-error
          text     = 'A valid email address containing @ is required.'
        )
        %element-EmailAddress = if_abap_behv=>mk-on
      ) TO reported-employee.
    ENDIF.
  ENDLOOP.
ENDMETHOD.`
    }
  },

  // =========================================================================
  // DAY 6: RAP ACTIONS & DYNAMIC FEATURE CONTROL
  // =========================================================================
  {
    id: 'day-6-actions-auth',
    day: 6,
    title: 'Day 6: RAP Actions, Dynamic Feature Control & Authorization',
    subtitle: 'Design custom business operations, state machines, and dynamic UI button enablement',
    readTime: '20 min read',
    vlogHook: "Welcome to Day 6! In CRUD apps, standard create/edit/delete is not enough. Real enterprises run on business actions: 'Approve Purchase Order', 'Promote Employee', or 'Cancel Subscription'. But how do you prevent someone from clicking 'Approve' when the order is already approved? Let's master RAP Actions and Dynamic Feature Control.",
    layman: "Actions are custom buttons on your app. Dynamic Feature Control is the brain behind those buttons: like a traffic light, it turns the 'Approve' button green when an order is pending, but turns it gray and disabled once the order is approved.",
    technical: "RAP Actions are declared in BDEF as `action ( features : instance ) approveOrder result [1] $self;`. They can be instance-bound (acting on specific keys) or static (factory actions). Dynamic Instance Feature Control implements `get_instance_features`, returning flags such as `%action-approveOrder = if_abap_behv=>fc-o-disabled` or `%field-salary = if_abap_behv=>fc-f-read_only`. Authorization Master declares `authorization master ( instance )`, implementing `get_instance_authorizations` with standard SAP `AUTHORITY-CHECK`.",

    deepDiveKeywords: [
      {
        name: 'Bound Custom Actions (approve, reject, calculateDiscount)',
        syntax: 'action ( features : instance ) approveOrder result [1] $self;',
        laymanAnalogy: 'A custom action button on an e-commerce order: "Cancel Order" or "Request Refund".',
        technicalDefinition: 'Custom business logic operations defined on a RAP entity. They can take input parameters (`parameter z_param`) and return result entities (`result [1] $self` or `result [*] z_entity`).',
        underTheHood: 'Exposed in OData V4 as bound actions callable via HTTP POST: `/SalesOrder(\'UUID\')/approveOrder`.',
        commonPitfall: 'Forgetting to populate the `result` table in the behavior pool. If result is declared in BDEF, the action handler must populate it.',
        modernExample: `action ( features : instance ) promoteEmployee result [1] $self;`
      },
      {
        name: 'Dynamic Instance Feature Control: Enabling & Disabling Actions',
        syntax: 'METHODS get_instance_features FOR INSTANCE FEATURES IMPORTING keys REQUEST requested_features FOR Employee RESULT result.',
        laymanAnalogy: 'Disabling the "Submit" button until all required form fields are filled, or graying out the "Approve" button after an order is processed.',
        technicalDefinition: 'Runtime evaluation method that determines field access (read-only vs mandatory) and action enablement (enabled vs disabled) per instance row.',
        underTheHood: 'Returns flags `if_abap_behv=>fc-o-disabled` or `if_abap_behv=>fc-o-enabled` to SAP Gateway, which translates them into OData V4 UI metadata.',
        commonPitfall: 'Hardcoding enablement in the React frontend instead of driving it from backend Feature Control. Frontend-only checks can be bypassed by direct API calls.',
        modernExample: `result = VALUE #( FOR r IN lt_reqs ( %tky = r-%tky %action-approve = if_abap_behv=>fc-o-disabled ) );`
      },
      {
        name: 'Master & Dependent Authorization Methods (Instance / Global)',
        syntax: 'METHODS get_instance_authorizations FOR INSTANCE AUTHORIZATION IMPORTING keys REQUEST requested_authorizations FOR Order RESULT result.',
        laymanAnalogy: 'Checking whether a manager has the security clearance to approve an order over $100,000.',
        technicalDefinition: 'Enforces role-based access control (RBAC) at the instance level. Checks PFCG authorization objects using standard SAP `AUTHORITY-CHECK`.',
        underTheHood: 'Executed before any modifying action or CRUD operation. If unauthorized, registers failure in `result-%update = if_abap_behv=>auth-unauthorized`.',
        commonPitfall: 'Omitting authorization checks on actions. Even if a user cannot edit a record, they might still call the approve action if not protected by authorization master.',
        modernExample: `AUTHORITY-CHECK OBJECT 'M_MATE_WRK' ID 'WERKS' FIELD ls_order-plant ID 'ACTVT' FIELD '02'.`
      },
      {
        name: 'Testing Custom Actions via ADT EML Console Scripts',
        syntax: 'MODIFY ENTITIES OF zi_order ENTITY Order EXECUTE approveOrder FROM VALUE #( ( %tky = ... ) ) ...',
        laymanAnalogy: 'Testing an elevator button directly in the workshop with an electronic tester before installing it in the building.',
        technicalDefinition: 'Using EML statement `EXECUTE action_name` inside a standalone test class implementing `IF_OO_ADT_CLASSRUN` to verify business logic execution without launching web frontends.',
        underTheHood: 'Executes the action handler directly in the ABAP kernel, capturing MAPPED, FAILED, and REPORTED structures.',
        commonPitfall: 'Forgetting to inspect the FAILED table after executing an action in test scripts.',
        modernExample: `MODIFY ENTITIES OF zi_employee\n  ENTITY Employee\n  EXECUTE promoteEmployee FROM VALUE #( ( %tky = ls_emp-%tky ) )\n  FAILED DATA(lt_failed).`
      }
    ],

    elementShowdown: {
      title: 'The Showdown: Static Actions vs Instance Actions with Feature Control',
      subtitle: 'Understanding when actions apply globally vs when they adapt dynamically to individual record state.',
      elementA: {
        name: 'Static Actions (Factory Actions)',
        syntax: `static action createDefaultOrder result [1] $self;

METHOD createDefaultOrder.
  " Creates a new instance from scratch
  MODIFY ENTITIES OF zi_order IN LOCAL MODE ...
ENDMETHOD.`,
        pros: ['Does not require an existing record key.', 'Great for template creation or mass imports.'],
        cons: ['Cannot evaluate individual instance state (no row context).'],
        cleanCoreVerdict: 'FACTORY PATTERN ACTION'
      },
      elementB: {
        name: 'Instance Actions with Dynamic Feature Control',
        syntax: `action ( features : instance ) approveOrder result [1] $self;

METHOD get_instance_features.
  " Inspects order status and enables/disables button dynamically
  result = VALUE #( FOR o IN lt_orders (
    %tky = o-%tky
    %action-approveOrder = COND #( WHEN o-status = 'APPROVED'
      THEN if_abap_behv=>fc-o-disabled
      ELSE if_abap_behv=>fc-o-enabled )
  ) ).
ENDMETHOD.`,
        pros: [
          'Enforces state machine integrity at the server level.',
          'UI automatically grays out disabled buttons in React/Fiori.',
          'Blocks unauthorized state transitions even if called directly via Postman.'
        ],
        cons: [
          'Requires implementing `get_instance_features` in the behavior pool.'
        ],
        cleanCoreVerdict: 'STATE MACHINE STANDARD (Grade A+)'
      },
      comparisonTable: [
        { feature: 'Entity Context', elementA: 'No entity instance needed (static call)', elementB: 'Binds to specific record UUID (%tky)', winner: 'Instance Action' },
        { feature: 'Button Enablement', elementA: 'Always enabled globally on the UI', elementB: 'Dynamically enabled/disabled per row state', winner: 'Instance Action' },
        { feature: 'State Transition', elementA: 'Creates new instances from scratch', elementB: 'Transitions existing record from Pending -> Approved', winner: 'Instance Action' },
        { feature: 'Security Check', elementA: 'Global authorization check', elementB: 'Row-level instance authorization check', winner: 'Instance Action' }
      ],
      architectAdvice: 'Always link business state transitions to Dynamic Feature Control. If your entity has a Status field (Draft, Pending, Approved, Rejected, Closed), declare `( features : instance )` on every action to prevent out-of-order execution.'
    },

    warStory: "An energy provider launched a customer self-service portal where users could cancel utility contracts. Because the action was not protected by backend Feature Control, malicious users were able to replay the 'cancelContract' HTTP POST request on contracts that were already closed, triggering credit memos and automated refund payouts multiple times. Adding `( features : instance )` in the BDEF immediately blocked duplicate cancellations at the kernel level.",

    files: [
      {
        name: 'zbp_i_employee_actions.clas.locals_imp.abap',
        lang: 'abap',
        code: `CLASS lhc_employee DEFINITION INHERITING FROM cl_abap_behavior_handler.
  PRIVATE SECTION.
    METHODS get_instance_features FOR INSTANCE FEATURES
      IMPORTING keys REQUEST requested_features FOR Employee RESULT result.

    METHODS promoteEmployee FOR MODIFY
      IMPORTING keys FOR ACTION Employee~promoteEmployee RESULT result.
ENDCLASS.

CLASS lhc_employee IMPLEMENTATION.
  METHOD get_instance_features.
    READ ENTITIES OF zi_employee IN LOCAL MODE
      ENTITY Employee FIELDS ( Status )
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_employees).

    result = VALUE #(
      FOR ls_emp IN lt_employees
      ( %tky = ls_emp-%tky
        %action-promoteEmployee = COND #(
          WHEN ls_emp-Status = 'TERMINATED' THEN if_abap_behv=>fc-o-disabled
          ELSE if_abap_behv=>fc-o-enabled
        )
      )
    ).
  ENDMETHOD.

  METHOD promoteEmployee.
    " Execute business update via EML
    MODIFY ENTITIES OF zi_employee IN LOCAL MODE
      ENTITY Employee
      UPDATE FIELDS ( Status )
      WITH VALUE #( FOR k IN keys ( %tky = k-%tky Status = 'PROMOTED' ) )
      FAILED failed
      REPORTED reported.

    " Return updated instances
    READ ENTITIES OF zi_employee IN LOCAL MODE
      ENTITY Employee ALL FIELDS
      WITH CORRESPONDING #( keys )
      RESULT DATA(lt_updated).

    result = VALUE #( FOR u IN lt_updated ( %tky = u-%tky %param = u ) ).
  ENDMETHOD.
ENDCLASS.`
      }
    ],

    lineExplanations: [
      { line: 'METHODS get_instance_features FOR INSTANCE FEATURES', desc: 'RAP lifecycle method invoked to determine whether buttons/actions should be enabled or disabled for each row.' },
      { line: 'if_abap_behv=>fc-o-disabled', desc: 'Sets feature control status to disabled. OData V4 transmits this to React, allowing the UI to disable the button.' },
      { line: 'MODIFY ENTITIES OF zi_employee IN LOCAL MODE ... Status = \'PROMOTED\'', desc: 'Updates the entity instance in the transactional buffer before returning the modified instance.' }
    ],

    assignment: {
      prompt: 'Implement a RAP action `approveOrder` in class lhc_order. Update the OrderStatus to "APPROVED" using EML MODIFY ENTITIES IN LOCAL MODE and populate the action RESULT table.',
      starterCode: `* Day 6 Exercise:
* Implement method approveOrder FOR MODIFY
* Update OrderStatus = 'APPROVED'
* Read and return updated instances in result table`,
      hints: [
        'Use MODIFY ENTITIES OF zi_order IN LOCAL MODE ENTITY Order UPDATE FIELDS ( OrderStatus ) ...',
        'Read updated instances with READ ENTITIES OF zi_order IN LOCAL MODE ... RESULT DATA(lt_upd)',
        'Populate result = VALUE #( FOR r IN lt_upd ( %tky = r-%tky %param = r ) ).'
      ],
      solution: `METHOD approveOrder.
  MODIFY ENTITIES OF zi_order IN LOCAL MODE
    ENTITY Order
    UPDATE FIELDS ( OrderStatus )
    WITH VALUE #( FOR k IN keys ( %tky = k-%tky OrderStatus = 'APPROVED' ) )
    FAILED failed
    REPORTED reported.

  READ ENTITIES OF zi_order IN LOCAL MODE
    ENTITY Order ALL FIELDS
    WITH CORRESPONDING #( keys )
    RESULT DATA(lt_updated).

  result = VALUE #( FOR o IN lt_updated ( %tky = o-%tky %param = o ) ).
ENDMETHOD.`
    }
  },

  // =========================================================================
  // DAY 7: RAP DRAFT HANDLING & CONCURRENCY
  // =========================================================================
  {
    id: 'day-7-draft-handling',
    day: 7,
    title: 'Day 7: RAP Draft Handling & Concurrency Control',
    subtitle: 'Implement auto-saving drafts, edit state persistence, and conflict prevention',
    readTime: '24 min read',
    vlogHook: "Welcome to Day 7! Ever wondered how modern web apps like Google Docs or Notion auto-save your half-typed text without corrupting the main document? In classic SAP GUI, if you closed your session halfway, all your work was lost and table locks stayed hung up. RAP Draft changes everything. Let's explore how Draft tables work under the hood.",
    layman: "Imagine you are applying for a passport online. You fill in your personal details today, but you still need your tax documents tomorrow. Draft Handling lets you save your unfinished application into a safe temporary drawer (the Draft Table). It doesn't pollute the government's official database (the Active Table) until you click 'Submit' and pass all checks.",
    technical: "Draft-enabled Business Objects declare `with draft;` in the BDEF and configure companion draft tables (`draft table z*_d`). RAP partitions data into two states: Active instances (`%is_draft = 00`) residing in the transparent persistent table, and Draft instances (`%is_draft = 01`) residing in the draft table. The standard draft lifecycle executes `Edit` (clones active row into draft table and sets exclusive lock), `Discard` (deletes draft instance), and `Activate` (promotes draft to active). Before activation, RAP invokes `draft determine action Prepare`, which runs all mandatory business validations.",

    deepDiveKeywords: [
      {
        name: 'The Draft Lifecycle: Edit, Prepare, Activate, Discard',
        syntax: 'draft action Edit; draft action Activate optimized; draft action Discard; draft action Resume; draft determine action Prepare;',
        laymanAnalogy: '1. Edit (pull from file cabinet), 2. Draft Save (scribble notes on draft), 3. Prepare (check all items), 4. Activate (file permanently).',
        technicalDefinition: 'The 5 standard draft operations generated by RAP. `Edit` copies active data to draft table and enqueues the record. `Prepare` runs validations. `Activate` transitions validated draft data into the active table and deletes the draft record. `Discard` deletes the draft without changing active data.',
        underTheHood: 'Orchestrated by the RAP Draft Engine, managing internal status flags in the draft table header.',
        commonPitfall: 'Forgetting to include `draft determine action Prepare` in your BDEF. Without it, drafts can be activated without running validations!',
        modernExample: `draft determine action Prepare\n{\n  validation validateCustomer;\n}`
      },
      {
        name: 'Generating Draft Persistence Tables (_D)',
        syntax: 'draft table zso_header_d',
        laymanAnalogy: 'A temporary staging desk where papers are organized before being placed into the permanent steel vault.',
        technicalDefinition: 'A physical transparent DDIC table created with suffix `_D`. It replicates all fields of the persistent table plus administrative draft fields (`draftentitycreationdatetime`, `draftentitylastchangedatetime`, `%is_draft`, `draftadministrativestatus`).',
        underTheHood: 'Generated automatically via ADT Quick Fix (`Ctrl+1`). Maintained automatically by the RAP kernel.',
        commonPitfall: 'Manually writing SQL INSERT statements to the draft table. Never manipulate draft tables directly with Open SQL!',
        modernExample: `persistent table zso_header_db\ndraft table zso_header_d`
      },
      {
        name: 'Concurrency Control: total etag & Optimistic Locking',
        syntax: 'lock master total etag LastChangedAt etag master LocalLastChangedAt',
        laymanAnalogy: 'A timestamp stamp on your document: if someone updated the document while you were reading it, the server warns you before you overwrite their work.',
        technicalDefinition: 'Optimistic concurrency control. In draft applications, `total etag` watches the active instance timestamp, while `etag master` watches the local draft timestamp to prevent multiple users from editing the same draft simultaneously.',
        underTheHood: 'OData V4 returns an ETag header (`W/"datetime..."`). When sending PATCH or Activate, React includes `If-Match: ETag`.',
        commonPitfall: 'Omitting `total etag` in draft applications. This allows silent overwrite of active records if another user committed changes in background.',
        modernExample: `lock master total etag LastChangedAt\netag master LocalLastChangedAt`
      }
    ],

    elementShowdown: {
      title: 'The Showdown: Active Instance (%is_draft = 00) vs Draft Instance (%is_draft = 01)',
      subtitle: 'How SAP isolates incomplete transient edits from live production data.',
      elementA: {
        name: 'Active Instance (%is_draft = 00)',
        syntax: `* Querying Active records in ABAP:
SELECT FROM zi_salesorder
  WHERE %is_draft = if_abap_behv=>mk-off
  FIELDS * INTO TABLE @DATA(lt_active).`,
        pros: [
          'Guaranteed to be 100% validated and consistent.',
          'Visible to background jobs, financial ledger, and reporting queries.',
          'Resides in the transparent production database table (`persistent table`).'
        ],
        cons: [
          'Cannot store incomplete or invalid data during user editing.'
        ],
        cleanCoreVerdict: 'PRODUCTION COMMITTED DATA'
      },
      elementB: {
        name: 'Draft Instance (%is_draft = 01)',
        syntax: `* Querying Draft records in ABAP:
SELECT FROM zi_salesorder
  WHERE %is_draft = if_abap_behv=>mk-on
  FIELDS * INTO TABLE @DATA(lt_drafts).`,
        pros: [
          'Allows incomplete forms with missing mandatory fields to be saved.',
          'User can close their laptop, log off, and resume editing next week.',
          'Does not pollute the production ledger or trigger unwanted accounting postings.'
        ],
        cons: [
          'Requires companion draft tables (`draft table z*_d`).'
        ],
        cleanCoreVerdict: 'TRANSIENT WORK-IN-PROGRESS'
      },
      comparisonTable: [
        { feature: 'Database Table', elementA: 'Persistent table (`zso_header_db`)', elementB: 'Draft table (`zso_header_d`)', winner: 'Separation of Concerns' },
        { feature: 'Validation Strictness', elementA: 'Must pass 100% of business validations', elementB: 'Tolerates incomplete fields during editing', winner: 'Draft Instance' },
        { feature: 'Session Durability', elementA: 'Permanent until deleted or archived', elementB: 'Persists until Activated or Discarded', winner: 'Draft Instance' },
        { feature: 'Concurrency Lock', elementA: 'Optimistic locking via total etag', elementB: 'Exclusive draft lock preventing collisions', winner: 'Balanced' }
      ],
      architectAdvice: 'Always enable Draft for web and Fiori applications. Modern users expect seamless auto-saving. Without Draft, every browser tab crash results in lost data and unhappy enterprise users.'
    },

    warStory: "A utility billing clerk was processing a complex commercial invoice with 250 line items in a non-draft system. After spending 45 minutes entering meter readings, their internet connection blinked for 2 seconds. The browser timed out, all 250 items were lost, and the clerk had to re-type everything from scratch. After migrating the app to RAP Draft, the system auto-saved every row into the draft table as they typed—so when the network flickered, the clerk simply refreshed and continued immediately.",

    files: [
      {
        name: 'ZI_SalesOrder.bdef',
        lang: 'bdef',
        code: `managed implementation in class zbp_i_salesorder unique;
strict ( 2 );
with draft;

define behavior for ZI_SalesOrder alias SalesOrder
persistent table zso_header_db
draft table zso_header_d
lock master total etag LastChangedAt
authorization master ( instance )
etag master LocalLastChangedAt
{
  create;
  update;
  delete;

  draft action Edit;
  draft action Activate optimized;
  draft action Discard;
  draft action Resume;
  draft determine action Prepare
  {
    validation validateCustomer;
    validation validateTotalAmount;
  }

  field ( readonly, numbering : managed ) OrderUUID;
  field ( readonly ) OrderStatus, CreatedAt, LastChangedAt;
}`
      }
    ],

    lineExplanations: [
      { line: 'with draft;', desc: 'Enables draft capabilities across the entire Business Object tree.' },
      { line: 'draft table zso_header_d', desc: 'Identifies the DDIC database table where incomplete draft rows reside.' },
      { line: 'draft determine action Prepare', desc: 'Specifies which business validations must pass before a draft can be activated into live production data.' }
    ],

    assignment: {
      prompt: 'Declare a draft-enabled BDEF snippet for entity ZI_Invoice with draft table zinv_d, total etag LastChangedAt, and draft actions Edit, Activate, and Discard.',
      starterCode: `* Day 7 Exercise:
* Enable draft on ZI_Invoice
* Add draft table and standard draft actions`,
      hints: [
        'Include: with draft;',
        'Set: draft table zinv_d',
        'Add: draft action Edit; draft action Activate optimized; draft action Discard;'
      ],
      solution: `managed implementation in class zbp_i_invoice unique;
strict ( 2 );
with draft;

define behavior for ZI_Invoice alias Invoice
persistent table zinv_db
draft table zinv_d
lock master total etag LastChangedAt
authorization master ( instance )
etag master LocalLastChangedAt
{
  create;
  update;
  delete;

  draft action Edit;
  draft action Activate optimized;
  draft action Discard;
  draft action Resume;
  draft determine action Prepare;
}`
    }
  },

  // =========================================================================
  // DAY 8: SERVICE DEFINITION & ODATA V4 EXPOSURE
  // =========================================================================
  {
    id: 'day-8-odata-v4',
    day: 8,
    title: 'Day 8: Service Definition, Binding & OData V4 Exposure',
    subtitle: 'Expose projection views over HTTPS as high-performance, standardized OData V4 APIs',
    readTime: '21 min read',
    vlogHook: "Welcome to Day 8! You've built your database tables, your CDS views, and your RAP Business Object. Now: how does the outside world talk to it? In classic SAP, you opened transaction SEGW, clicked through 25 screens, generated mapping classes, and debugged DPC_EXT methods. In RAP, we use two simple text-based objects: Service Definition and Service Binding. Let's see why OData V4 crushes OData V2.",
    layman: "A Service Definition is like your restaurant menu: you choose which dishes (entities) to make available. A Service Binding is opening the kitchen counter with an HTTPS address that your React app can talk to over the internet.",
    technical: "Business Service Exposure consists of two steps:\n1. Service Definition (`ZSD_*` / `ZAPI_*`): declares `define service ZAPI_* { expose ZC_Entity as Entity; }`, selecting which projection entities to reveal.\n2. Service Binding (`ZSB_*`): binds the definition to an OData protocol and runtime target. For React, we choose `OData V4 - Web API` (lightweight, optimized for custom UI). For Fiori Elements, we choose `OData V4 - UI`. OData V4 features streamlined JSON, server-side paging (`$top`, `$skip`, `$count`), and delta `PATCH` semantics.",

    deepDiveKeywords: [
      {
        name: 'Defining Clean API Exposure with define service ZAPI_*',
        syntax: 'define service ZAPI_EMPLOYEE_O4 { expose ZC_Employee as Employee; }',
        laymanAnalogy: 'The API contract: choosing which internal database views are made public to web clients.',
        technicalDefinition: 'Text-based ADT development object grouping CDS projection views for consumption. Does not specify protocol or URL; strictly defines the scope of exposed entities.',
        underTheHood: 'Parsed by the SAP Gateway metadata compiler into a service model catalog.',
        commonPitfall: 'Exposing interface views (`ZI_*`) instead of projection views (`ZC_*`). Always expose projection views in your service definition!',
        modernExample: `define service ZAPI_EMPLOYEE_O4 {\n  expose ZC_Employee as Employee;\n  expose ZC_Department as Department;\n}`
      },
      {
        name: 'Binding Types: OData V4 - Web API (React) vs OData V4 - UI (Fiori Elements)',
        syntax: 'Binding Type: OData V4 - Web API / URL: /sap/opu/odata4/sap/zapi_.../0001',
        laymanAnalogy: 'Choosing between a lightweight JSON feed for your React app or an enterprise bundle with complete layout instructions for SAP Fiori.',
        technicalDefinition: 'Binds a Service Definition to a communication protocol. `OData V4 - Web API` produces a lightweight JSON feed with minimal metadata overhead, ideal for React/Vue/Angular. `OData V4 - UI` includes full UI annotations and value help descriptors needed by Fiori Elements floorplans.',
        underTheHood: 'Generates the SAP Gateway ICF service node in transaction SICF and activates the `$metadata` endpoint.',
        commonPitfall: 'Forgetting to click "Publish" in Eclipse ADT after creating the service binding.',
        modernExample: `* In Eclipse ADT: Right Click ZAPI_EMPLOYEE_O4 -> New Service Binding -> OData V4 - Web API -> Click "Publish"`
      },
      {
        name: 'Inspecting OData V4 JSON $metadata & HTTP Semantics',
        syntax: 'GET /sap/opu/odata4/sap/zapi_employee_o4/srvd/sap/zapi_employee_o4/0001/$metadata',
        laymanAnalogy: 'Like OpenAPI (Swagger) schema specification in the REST world: it tells React what entities, keys, and data types exist on the backend.',
        technicalDefinition: 'The formal schema definition of the OData V4 service. Outlines EntitySets, EntityTypes, Property types, NavigationProperties, and Bound Actions.',
        underTheHood: 'Generated dynamically by SAP Gateway from the underlying CDS projection views.',
        commonPitfall: 'Guessing field names in React instead of inspecting `$metadata` to see exact PascalCase or camelCase element aliases.',
        modernExample: `fetch('/sap/opu/odata4/.../$metadata')`
      }
    ],

    elementShowdown: {
      title: 'The Showdown: OData V2 (SEGW) vs OData V4 (RAP Service Binding)',
      subtitle: 'Why SAP transitioned from OData V2 to OData V4 across all modern platforms.',
      elementA: {
        name: 'Legacy OData V2 (Gateway SEGW / BOPF)',
        syntax: `GET /sap/opu/odata/sap/ZEMP_SRV/EmployeeSet
Response payload:
{
  "d": {
    "results": [
      {
        "__metadata": { "id": "...", "uri": "...", "type": "..." },
        "EmployeeId": "EMP01",
        "Salary": "85000.00"
      }
    ]
  }
}`,
        pros: ['Supported in older SAP UI5 libraries from 2014-2018.'],
        cons: [
          'Heavy payload: redundant `__metadata` objects for every single row.',
          'Array lives inside nested `data.d.results`.',
          'Updates require full resource replacement with `PUT`.',
          'Batch requests use cumbersome multipart MIME encoding.'
        ],
        cleanCoreVerdict: 'LEGACY API STANDARD'
      },
      elementB: {
        name: 'Modern OData V4 (RAP Service Binding)',
        syntax: `GET /sap/opu/odata4/sap/zapi_emp_o4/.../Employee
Response payload:
{
  "@odata.count": 145,
  "value": [
    {
      "EmployeeId": "EMP01",
      "Salary": 85000
    }
  ]
}`,
        pros: [
          'Up to 40% smaller JSON payload (no redundant __metadata).',
          'Standard array container: records live directly in `data.value`.',
          'Surgical delta updates using HTTP `PATCH`.',
          'Clean batching and standardized error formatting.'
        ],
        cons: [
          'Requires OData V4 compliant client parsers.'
        ],
        cleanCoreVerdict: 'CERTIFIED CLEAN CORE (Recommended Standard)'
      },
      comparisonTable: [
        { feature: 'JSON Payload Size', elementA: 'Heavy: redundant __metadata per entity', elementB: 'Lean: clean JSON objects in value array', winner: 'OData V4' },
        { feature: 'Array Container', elementA: 'Nested in data.d.results', elementB: 'Direct in data.value', winner: 'OData V4' },
        { feature: 'Update Semantics', elementA: 'PUT (replaces entire resource)', elementB: 'PATCH (delta update only modified fields)', winner: 'OData V4' },
        { feature: 'RAP Creation Tool', elementA: 'Transaction SEGW (GUI click-and-point)', elementB: 'Eclipse ADT text-based Service Definition', winner: 'OData V4' }
      ],
      architectAdvice: 'Always choose OData V4 for new React or web applications. The leaner payload translates directly to faster mobile loading speeds and lower network costs.'
    },

    warStory: "A logistics mobile warehouse app built on OData V2 was consuming 18 MB of network data every time a forklift driver refreshed their delivery queue of 2,000 pallets, because OData V2 transmitted 15 lines of `__metadata` metadata URLs for every single pallet! After upgrading the backend to RAP OData V4 and consuming `data.value` with `$select`, payload size dropped from 18 MB to 840 KB—a 95% reduction—making the warehouse scanners fly.",

    files: [
      {
        name: 'ZAPI_EMPLOYEE_O4.srvd.asrvd',
        lang: 'cds',
        code: `@EndUserText.label: 'Employee OData V4 Service Definition'
define service ZAPI_EMPLOYEE_O4 {
  expose ZC_Employee as Employee;
  expose ZC_Department as Department;
  expose ZC_EmployeeSkill as EmployeeSkill;
}`
      }
    ],

    lineExplanations: [
      { line: 'define service ZAPI_EMPLOYEE_O4', desc: 'Creates the service definition grouping CDS projection entities for external exposure.' },
      { line: 'expose ZC_Employee as Employee;', desc: 'Exposes projection entity with an alias that forms the OData V4 entity set name in the URL.' }
    ],

    assignment: {
      prompt: 'Write a modern SAP Service Definition named ZAPI_SALESORDER_O4 that exposes ZC_SalesOrder as SalesOrder and ZC_SalesOrderItem as SalesOrderItem.',
      starterCode: `* Day 8 Exercise:
* Define service ZAPI_SALESORDER_O4
* Expose SalesOrder and SalesOrderItem`,
      hints: [
        'Use: define service ZAPI_SALESORDER_O4 { ... }',
        'Use: expose ZC_SalesOrder as SalesOrder;'
      ],
      solution: `@EndUserText.label: 'Sales Order OData V4 Service'
define service ZAPI_SALESORDER_O4 {
  expose ZC_SalesOrder as SalesOrder;
  expose ZC_SalesOrderItem as SalesOrderItem;
}`
    }
  },

  // =========================================================================
  // DAY 9: REACT + RAP ODATA V4 INTEGRATION
  // =========================================================================
  {
    id: 'day-9-react-service',
    day: 9,
    title: 'Day 9: React + RAP OData V4 Service Architecture',
    subtitle: 'Build a production-grade React API service layer with X-CSRF-Token handshake and query paging',
    readTime: '22 min read',
    vlogHook: "Welcome to Day 9! Today is where frontend meets backend. You are a React developer with superpowers in Vite, Tailwind, and React hooks. How do you connect React to an enterprise SAP RAP backend? Is it just REST? Yes—with one crucial security handshake that trips up 90% of developers: the X-CSRF-Token. Let's master it.",
    layman: "Calling an SAP OData V4 endpoint from React is just like calling any REST API with fetch()! But think of SAP Gateway like an embassy: before you can submit a visa application (POST/PATCH), you must visit the front reception desk to get a visitor security badge (the X-CSRF-Token). Once you pin that badge to your shirt, you can enter any room.",
    technical: "In modern full-stack architectures, React communicates with SAP Gateway via standard HTTPS. To prevent Cross-Site Request Forgery, SAP Gateway requires an initial handshake: React sends a preliminary `HEAD` or `GET` request with header `X-CSRF-Token: Fetch` and `credentials: 'include'` (to establish the session cookie). Gateway returns the token in the response header `x-csrf-token`. For all subsequent mutating calls (POST, PATCH, DELETE), React includes `X-CSRF-Token: <token>`. In OData V4, query results reside in `data.value` and record count resides in `data['@odata.count']`.",

    deepDiveKeywords: [
      {
        name: 'The Mandatory X-CSRF-Token Handshake (HEAD / GET)',
        syntax: 'fetch(\'/sap/opu/odata4/...\', { method: \'HEAD\', headers: { \'X-CSRF-Token\': \'Fetch\' }, credentials: \'include\' })',
        laymanAnalogy: 'Getting a day pass stamp on your hand at a theme park before getting on any rides.',
        technicalDefinition: 'Cryptographic token handshake mitigating CSRF attacks. Gateway validates the session cookie and issues a transient token valid for the active user session.',
        underTheHood: 'Generated by the SAP Gateway ICF security layer. If a mutating request arrives without a valid token, Gateway returns HTTP 403 Forbidden with message "CSRF token validation failed".',
        commonPitfall: 'Forgetting `credentials: \'include\'`. Without credentials, the browser will not send cookies, and the CSRF token will be rejected on subsequent calls.',
        modernExample: `const res = await fetch(BASE_URL, { method: 'HEAD', headers: { 'X-CSRF-Token': 'Fetch' }, credentials: 'include' });\nconst token = res.headers.get('x-csrf-token');`
      },
      {
        name: 'Querying SAP RAP: Extracting data.value & @odata.count',
        syntax: 'const { value: items, \'@odata.count\': total } = await res.json();',
        laymanAnalogy: 'Opening a package directly (OData V4) instead of opening a box inside a box inside a box (OData V2).',
        technicalDefinition: 'In OData V4, collection queries place the entity array directly inside the `.value` property. Total count requested via `$count=true` is stored in `@odata.count`.',
        underTheHood: 'Standardized by the OASIS OData V4 JSON specification.',
        commonPitfall: 'Writing `data.d.results`. That was OData V2 syntax and will return `undefined` in OData V4!',
        modernExample: `const data = await res.json();\nreturn { items: data.value, total: data['@odata.count'] };`
      },
      {
        name: 'Server-Side Paging with $top, $skip, $filter, and $orderby',
        syntax: 'const params = new URLSearchParams({ $top: 25, $skip: page * 25, $count: \'true\', $orderby: \'LastName asc\' });',
        laymanAnalogy: 'Flipping through a book 25 pages at a time rather than dumping all 10,000 pages on the floor at once.',
        technicalDefinition: 'Server-side pagination pushdown in OData V4. Translates into SQL `LIMIT` and `OFFSET` inside SAP HANA.',
        underTheHood: 'Prevents out-of-memory errors on both the SAP application server and the user browser.',
        commonPitfall: 'Filtering on the client side in React after fetching 10,000 records. Always push filtering and pagination down to the SAP backend using `$filter` and `$top/$skip`!',
        modernExample: `const url = \`/Employee?\${params.toString()}\`;`
      }
    ],

    elementShowdown: {
      title: 'The Showdown: Classic RFC / BAPI Call vs React fetch() OData V4',
      subtitle: 'Why modern enterprises decouple frontends with RESTful OData V4 APIs.',
      elementA: {
        name: 'Classic RFC / BAPI Call (Proprietary)',
        syntax: `* In classic Web Dynpro or .NET connector:
CALL FUNCTION 'BAPI_EMPLOYEE_GETDATA'
  DESTINATION 'PRD_RFC'
  EXPORTING emp_id = '001'
  TABLES emp_data = lt_data.`,
        pros: ['Direct kernel binary communication in closed on-premise networks.'],
        cons: [
          'Requires proprietary SAP RFC libraries and open SAP ports (3300/3200).',
          'Tightly couples frontend to SAP ABAP internal structures.',
          'Impossible to run in cloud browsers or edge CDNs.',
          'Blocks mobile web consumption.'
        ],
        cleanCoreVerdict: 'TIGHTLY COUPLED LEGACY'
      },
      elementB: {
        name: 'Modern React fetch() OData V4',
        syntax: `// Standard Web API call from React
const res = await fetch('/sap/opu/odata4/.../Employee?$top=20', {
  headers: { 'Accept': 'application/json' },
  credentials: 'include'
});
const data = await res.json();
return data.value;`,
        pros: [
          'Uses standard HTTP/HTTPS protocols supported by every browser and device.',
          'Completely decoupled: React developers do not need SAP GUI or RFC connectors.',
          'Leverages modern browser caching, CDN delivery, and WebSockets.',
          '100% compliant with S/4HANA Clean Core.'
        ],
        cons: [
          'Requires handling CSRF token handshake for write operations.'
        ],
        cleanCoreVerdict: 'CERTIFIED CLEAN CORE (Grade A+)'
      },
      comparisonTable: [
        { feature: 'Protocol', elementA: 'Proprietary SAP RFC / DIAG protocol', elementB: 'Standard HTTPS OData V4 JSON', winner: 'React OData V4' },
        { feature: 'Client Requirements', elementA: 'SAP GUI or SAP .NET/Java RFC connector', elementB: 'Any browser, mobile app, or React client', winner: 'React OData V4' },
        { feature: 'Security Model', elementA: 'Direct SAP user credentials in RFC connection', elementB: 'OAuth2 / SAML / X-CSRF-Token handshake', winner: 'React OData V4' },
        { feature: 'Clean Core Extensibility', elementA: 'Modifies or wraps unreleased function pools', elementB: 'Consumes officially released OData V4 endpoints', winner: 'React OData V4' }
      ],
      architectAdvice: 'Always build a dedicated API service module in your React app (e.g. `employeeService.js`) that encapsulates the base URL, CSRF caching, and error parsing. Never scatter raw fetch() calls directly inside React components.'
    },

    warStory: "A retail client had a warehouse picking app built with an old Java RFC connector that frequently dropped connections on wireless forklifts, hanging background RFC sessions in SM50. We replaced the RFC connector with a decoupled React SPA communicating with a RAP OData V4 service. The React service used standard service workers for offline caching and automatic reconnects, eliminating 100% of the session hang-ups.",

    files: [
      {
        name: 'employeeService.js',
        lang: 'javascript',
        code: `// React OData V4 Service Layer
const BASE_URL = '/sap/opu/odata4/sap/zapi_employee_o4/srvd/sap/zapi_employee_o4/0001';

let cachedCsrfToken = null;

/**
 * Fetch or reuse CSRF security token
 */
export async function getCsrfToken() {
  if (cachedCsrfToken) return cachedCsrfToken;

  const res = await fetch(\`\${BASE_URL}/\`, {
    method: 'HEAD',
    headers: { 'X-CSRF-Token': 'Fetch' },
    credentials: 'include'
  });

  cachedCsrfToken = res.headers.get('x-csrf-token');
  return cachedCsrfToken;
}

/**
 * Fetch paginated employees with optional search filter
 */
export async function getEmployees({ top = 10, skip = 0, search = '' } = {}) {
  const params = new URLSearchParams({
    $top: top.toString(),
    $skip: skip.toString(),
    $count: 'true',
    $orderby: 'EmployeeId asc'
  });

  if (search) {
    params.append('$filter', \`contains(FullName, '\${search}')\`);
  }

  const res = await fetch(\`\${BASE_URL}/Employee?\${params.toString()}\`, {
    headers: { 'Accept': 'application/json' },
    credentials: 'include'
  });

  if (!res.ok) {
    throw new Error(\`Failed to fetch employees: HTTP \${res.status}\`);
  }

  const data = await res.json();
  return {
    items: data.value,
    totalCount: data['@odata.count'] || data.value.length
  };
}`
      }
    ],

    lineExplanations: [
      { line: 'headers: { \'X-CSRF-Token\': \'Fetch\' }', desc: 'Mandatory handshake asking SAP Gateway to return a cryptographic CSRF token for the active session.' },
      { line: 'return data.value;', desc: 'Standard OData V4 JSON array container. Replaces legacy OData V2 data.d.results.' },
      { line: 'data[\'@odata.count\']', desc: 'Returns exact total number of records matching query filter for pagination controls.' }
    ],

    assignment: {
      prompt: 'Write a React fetch function `fetchProducts({ category, limit })` that calls an OData V4 endpoint, filters by category using `$filter`, sets `$top`, and returns the array from `data.value`.',
      starterCode: `// Day 9 Exercise:
// Implement fetchProducts with OData V4 parameters
export async function fetchProducts({ category, limit = 20 }) {
  // Build URL with $filter and $top
  // Return items array
}`,
      hints: [
        'Use params.append(\'$filter\', `Category eq \'${category}\'`)',
        'Extract data.value from the JSON response.'
      ],
      solution: `export async function fetchProducts({ category, limit = 20 } = {}) {
  const url = new URL('/sap/opu/odata4/sap/zapi_product_o4/srvd/sap/zapi_product_o4/0001/Product', window.location.origin);
  url.searchParams.set('$top', limit.toString());
  url.searchParams.set('$count', 'true');
  if (category) {
    url.searchParams.set('$filter', \`Category eq '\${category}'\`);
  }

  const res = await fetch(url.toString(), {
    headers: { 'Accept': 'application/json' },
    credentials: 'include'
  });

  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  const data = await res.json();
  return {
    products: data.value,
    total: data['@odata.count']
  };
}`
    }
  },

  // =========================================================================
  // DAY 10: REACT CRUD FORMS, DELTA PATCH & ERROR HANDLING
  // =========================================================================
  {
    id: 'day-10-react-forms-errors',
    day: 10,
    title: 'Day 10: React CRUD Forms, Delta PATCH & Error Handling',
    subtitle: 'Perform atomic updates, send delta PATCH requests, and parse SAP backend validation messages',
    readTime: '23 min read',
    vlogHook: "Welcome to Day 10! When a user edits a customer record in your React form and changes only their phone number, what do you send to SAP? If you send an HTTP PUT with all 50 fields, you risk overwriting changes made by another department. In OData V4, we use HTTP PATCH for surgical delta updates. And when SAP validations fail, how do you display those errors cleanly in React? Let's dive in.",
    layman: "Imagine you want to paint your bedroom door red. An HTTP PUT is like demolishing the entire house and rebuilding it with a red door. An HTTP PATCH is simply walking up to the door with a paintbrush and painting only the door. If the building inspector says 'Hey, red is not allowed!', SAP sends a detailed error ticket that your React app displays right beside the paintbrush.",
    technical: "OData V4 mandates `PATCH` for updates instead of `PUT`. The request body contains only modified attributes. Concurrency requires sending `If-Match: *` or the entity ETag timestamp. When validations fail in RAP, SAP Gateway returns HTTP 400 with a structured JSON body containing `error.code`, `error.message`, and `error.details` containing each field violation mapped to target elements. React parses this structure to display inline field highlights and toast notifications.",

    deepDiveKeywords: [
      {
        name: 'Surgical Delta Updates with HTTP PATCH & If-Match',
        syntax: 'fetch(\`/Employee(\${uuid})\`, { method: \'PATCH\', headers: { \'If-Match\': \'*\' }, body: JSON.stringify({ Salary: 95000 }) })',
        laymanAnalogy: 'Updating only the modified field in an Excel spreadsheet instead of replacing the entire workbook.',
        technicalDefinition: 'PATCH performs a surgical delta update. OData V4 prohibits PUT on entity instances because PUT implies full replacement, which can wipe out server-derived or read-only fields. `If-Match` verifies that another user has not modified the record concurrently.',
        underTheHood: 'The RAP framework parses the PATCH payload and populates the `%control` structure so only modified fields are flagged for update in the transactional buffer.',
        commonPitfall: 'Sending unchanged fields in PATCH. Only send the keys and fields that the user actually edited!',
        modernExample: `await fetch(\`\${URL}(\${uuid})\`, {\n  method: 'PATCH',\n  headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf, 'If-Match': '*' },\n  body: JSON.stringify({ Salary: newSalary })\n});`
      },
      {
        name: 'Deep Parsing SAP RAP error.details Payloads',
        syntax: 'const details = errorResponse?.error?.details || [];',
        laymanAnalogy: 'Reading the detailed diagnostic report from your car mechanic instead of just seeing the "Check Engine" light.',
        technicalDefinition: 'Standardized OData V4 error payload structure. When RAP validations fail, the backend populates `reported-entity`. Gateway serializes this into `error.details` with fields `code`, `message`, `target`, and `@Common.numericSeverity`.',
        underTheHood: 'React iterates through `error.details` and maps `d.target` directly to form input state to display red borders under offending fields.',
        commonPitfall: 'Only showing `error.message` (e.g. "Validation failed") without showing the user the specific field details inside `error.details`.',
        modernExample: `details.forEach(d => setFieldError(d.target, d.message));`
      },
      {
        name: 'Translating Backend Validation Failures into React UI Field Errors',
        syntax: 'setErrorMap(prev => ({ ...prev, [d.target]: d.message }))',
        laymanAnalogy: 'Highlighting the exact form box in red with a helpful message: "Must be a valid email containing @" directly below the email input.',
        technicalDefinition: 'Connecting RAP `%element-FieldName = if_abap_behv=>mk-on` declarations with React state. Gateway puts the field name into `d.target`, allowing React to dynamically highlight inputs.',
        underTheHood: 'Enables high-fidelity user experiences identical to modern SaaS web apps.',
        commonPitfall: 'Using generic alert popups. Always attach validation messages to the corresponding input element.',
        modernExample: `<input className={errors.Salary ? 'border-red-500' : ''} />`
      }
    ],

    elementShowdown: {
      title: 'The Showdown: HTTP PUT (Full Overwrite) vs HTTP PATCH (Surgical Delta)',
      subtitle: 'Why OData V4 abandoned PUT for entity updates.',
      elementA: {
        name: 'HTTP PUT (Legacy Full Replacement)',
        syntax: `PUT /Employee('001')
Body:
{
  "EmployeeId": "001",
  "FirstName": "Jane",
  "LastName": "Doe",
  "Salary": 95000,
  "Status": "ACTIVE",
  "CreatedAt": "2024-01-01T00:00:00Z"
}`,
        pros: ['Conceptually simple: send the whole state.'],
        cons: [
          'Overwrites concurrent changes made to other fields by other users.',
          'Wastes network bandwidth re-transmitting 40 unchanged columns.',
          'Can accidentally overwrite read-only server-derived fields.',
          'Violates OData V4 best practices.'
        ],
        cleanCoreVerdict: 'DISCOURAGED IN ODATA V4'
      },
      elementB: {
        name: 'HTTP PATCH (Modern Delta Update)',
        syntax: `PATCH /Employee('001')
Headers:
  If-Match: *
Body:
{
  "Salary": 95000
}`,
        pros: [
          'Transmits only the modified attribute (minimal network payload).',
          'Respects optimistic concurrency locking.',
          'Cannot accidentally overwrite other fields.',
          'Mandatory standard in SAP RAP OData V4.'
        ],
        cons: [
          'Requires the frontend to track dirty (modified) form fields.'
        ],
        cleanCoreVerdict: 'CERTIFIED CLEAN CORE (Grade A+)'
      },
      comparisonTable: [
        { feature: 'Network Payload', elementA: 'Heavy: transmits 100% of entity fields', elementB: 'Minimal: transmits only changed attributes', winner: 'HTTP PATCH' },
        { feature: 'Concurrency Safety', elementA: 'High risk of silent overwrite collisions', elementB: 'Protected by optimistic locking and delta mapping', winner: 'HTTP PATCH' },
        { feature: 'Read-Only Fields', elementA: 'Can trigger errors trying to update uneditable fields', elementB: 'Ignores untouched fields completely', winner: 'HTTP PATCH' },
        { feature: 'OData V4 Standard', elementA: 'Disallowed or discouraged for entity sets', elementB: 'Mandatory standard update protocol', winner: 'HTTP PATCH' }
      ],
      architectAdvice: 'In your React forms, use form state libraries (or simple state trackers) to calculate `dirtyFields`. When the user clicks Save, pass only the dirty fields into your PATCH service call.'
    },

    warStory: "In a global CRM app, two customer service reps were viewing the same customer simultaneously. Rep A updated the customer's phone number and clicked Save. One second later, Rep B updated the customer's billing address and clicked Save using HTTP PUT with their stale local state. Rep B's PUT call silently overwrote Rep A's new phone number with the old one! Switching the API to HTTP PATCH with ETag validation completely eliminated the silent overwrite bug.",

    files: [
      {
        name: 'employeeCrud.js',
        lang: 'javascript',
        code: `import { getCsrfToken } from './employeeService';

const BASE_URL = '/sap/opu/odata4/sap/zapi_employee_o4/srvd/sap/zapi_employee_o4/0001/Employee';

/**
 * Update modified fields via OData V4 PATCH
 */
export async function updateEmployee(employeeUUID, changedFields, etag = '*') {
  const csrf = await getCsrfToken();

  const res = await fetch(\`\${BASE_URL}(\${employeeUUID})\`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrf,
      'If-Match': etag
    },
    credentials: 'include',
    body: JSON.stringify(changedFields)
  });

  if (!res.ok) {
    const errorBody = await res.json();
    const parsedErrors = parseSapErrors(errorBody);
    throw new Error(parsedErrors.message || 'Update failed');
  }

  return res.json();
}

/**
 * Helper to extract RAP REPORTED messages from OData V4 error payload
 */
export function parseSapErrors(errorPayload) {
  const err = errorPayload?.error;
  if (!err) return { message: 'Unknown server error', details: [] };

  const details = (err.details || []).map(d => ({
    target: d.target,
    message: d.message,
    severity: d['@Common.numericSeverity'] || 4
  }));

  return {
    message: err.message,
    details
  };
}`
      }
    ],

    lineExplanations: [
      { line: 'method: \'PATCH\'', desc: 'Sends delta updates with only the changed properties rather than full resource replacement.' },
      { line: '\'If-Match\': etag', desc: 'Concurrency protection header ensuring record was not modified by another user since reading.' },
      { line: 'const details = (err.details || []).map(...)', desc: 'Iterates through RAP reported messages returned by backend validations.' }
    ],

    assignment: {
      prompt: 'Write an async function `deleteEmployee(uuid)` that retrieves a CSRF token and sends an HTTP DELETE request to the OData V4 Employee entity URL with appropriate headers.',
      starterCode: `// Day 10 Exercise:
export async function deleteEmployee(employeeUUID) {
  // 1. Get CSRF token
  // 2. Send DELETE request with X-CSRF-Token and If-Match
  // 3. Handle non-ok response
}`,
      hints: [
        'Use method: \'DELETE\'',
        'Add header \'If-Match\': \'*\' and \'X-CSRF-Token\': csrfToken.'
      ],
      solution: `export async function deleteEmployee(employeeUUID) {
  const csrf = await getCsrfToken();
  const res = await fetch(\`/sap/opu/odata4/sap/zapi_employee_o4/srvd/sap/zapi_employee_o4/0001/Employee(\${employeeUUID})\`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': csrf,
      'If-Match': '*'
    },
    credentials: 'include'
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || \`Delete failed with HTTP \${res.status}\`);
  }
  return true;
}`
    }
  },

  // =========================================================================
  // DAY 11: EML (ENTITY MANIPULATION LANGUAGE) DEEP DIVE
  // =========================================================================
  {
    id: 'day-11-eml-deep-dive',
    day: 11,
    title: 'Day 11: EML (Entity Manipulation Language) Deep Dive',
    subtitle: 'Programmatically orchestrate RAP Business Objects with type safety and transactional guarantees',
    readTime: '22 min read',
    vlogHook: "Welcome to Day 11! In ABAP, we used to write direct database statements: 'UPDATE ztable SET status = ...'. In S/4HANA Clean Core, direct SQL updates to business tables are strictly forbidden because they bypass validations, authorizations, and change documents. How do you programmatically talk to Business Objects in ABAP? Meet EML: Entity Manipulation Language.",
    layman: "Think of EML like an internal programmatic remote control for your Business Objects. Instead of breaking into the engine room and manually turning the gears with a wrench (raw SQL UPDATE), you press the official control panel buttons (EML statements). The engine validates everything and guarantees safe operation.",
    technical: "EML is built directly into the ABAP compiler. It provides type-safe, compile-time verified statements to interact with RAP Business Objects. Core statements include `READ ENTITIES OF`, `MODIFY ENTITIES OF`, and `COMMIT ENTITIES`. When creating new rows before an actual UUID exists, `%cid` (Content ID) correlates the input row with `MAPPED` keys. Inside Behavior Pools, `IN LOCAL MODE` bypasses external authorization and feature control checks for internal intra-BO data orchestration.",

    deepDiveKeywords: [
      {
        name: 'EML as the Native Programmatic Interface to RAP BOs',
        syntax: 'READ ENTITIES OF zi_employee ... / MODIFY ENTITIES OF zi_employee ...',
        laymanAnalogy: 'Using the official SDK rather than hacking into the internal database tables.',
        technicalDefinition: 'The core language extension in ABAP 7.50+ for interacting with RAP Business Objects. Provides full syntax checking, auto-completion in ADT, and guarantees transactional consistency.',
        underTheHood: 'Interacts directly with the RAP transactional runtime buffer.',
        commonPitfall: 'Writing raw `UPDATE ztable` statements instead of using EML.',
        modernExample: `READ ENTITIES OF zi_employee ENTITY Employee ALL FIELDS WITH CORRESPONDING #( keys ) RESULT DATA(lt_data).`
      },
      {
        name: 'Correlating Transient Input with %cid (Content ID) & %tky',
        syntax: '%cid = \'NEW_EMP_01\' ... MAPPED DATA(lt_mapped)',
        laymanAnalogy: 'Giving a temporary claim ticket at a coat check: before your coat gets a permanent hanger number, you have claim ticket "NEW_1" to track it.',
        technicalDefinition: 'EML statement performing transactional modifications: `CREATE`, `UPDATE`, `DELETE`, or executing custom actions (`EXECUTE`). `%cid` (Content ID) is a mandatory temporary key used during CREATE to map transient requests to the generated UUIDs returned in the `MAPPED` table.',
        underTheHood: 'Updates the transactional buffer in memory without writing to database until COMMIT ENTITIES is executed.',
        commonPitfall: 'Forgetting `%cid` during `CREATE`. In EML, a CREATE statement without `%cid` fails syntax checks.',
        modernExample: `MODIFY ENTITIES OF zi_employee\n  ENTITY Employee\n  CREATE FIELDS ( EmployeeId Salary )\n  WITH VALUE #( ( %cid = 'EMP_NEW_1' EmployeeId = 'E100' Salary = 80000 ) )\n  MAPPED DATA(lt_mapped).`
      },
      {
        name: 'IN LOCAL MODE vs External EML Operations',
        syntax: 'READ ENTITIES OF zi_employee IN LOCAL MODE ...',
        laymanAnalogy: 'A master key for the internal maintenance crew: bypassing customer doors because you are working inside the house.',
        technicalDefinition: 'EML modifier indicating that an operation is being performed internally by the Business Object itself within its own behavior pool. Bypasses external authorization checks and dynamic feature control.',
        underTheHood: 'Informs the RAP kernel to skip `get_instance_authorizations` and `get_instance_features`.',
        commonPitfall: 'Using `IN LOCAL MODE` in external consumer classes. It should only be used inside the behavior pool of that specific BO.',
        modernExample: `MODIFY ENTITIES OF zi_employee IN LOCAL MODE ENTITY Employee UPDATE FIELDS ( Status ) ...`
      }
    ],

    elementShowdown: {
      title: 'The Showdown: Direct Open SQL UPDATE vs EML (Entity Manipulation Language)',
      subtitle: 'Why direct SQL updates violate Clean Core and destroy business logic integrity.',
      elementA: {
        name: 'Direct Open SQL UPDATE (Anti-Pattern in RAP)',
        syntax: `* ❌ DANGEROUS IN S/4HANA CLEAN CORE:
UPDATE zemp_table_db
  SET salary = 95000, status = 'ACTIVE'
  WHERE emp_id = 'E01'.
COMMIT WORK.`,
        pros: ['Takes 2 lines of code in legacy ABAP.'],
        cons: [
          'Completely bypasses all business validations on save.',
          'Bypasses determinations and timestamp updates.',
          'Bypasses draft handling and corrupts active/draft sync.',
          'Bypasses authorization checks and change document logging.',
          'Violates S/4HANA Clean Core.'
        ],
        cleanCoreVerdict: 'FORBIDDEN IN S/4HANA RAP'
      },
      elementB: {
        name: 'EML (Entity Manipulation Language)',
        syntax: `* ✅ CLEAN CORE RAP STANDARD:
MODIFY ENTITIES OF zi_employee
  ENTITY Employee
  UPDATE FIELDS ( Salary Status )
  WITH VALUE #( ( %tky = ls_key-%tky Salary = 95000 Status = 'ACTIVE' ) )
  FAILED DATA(lt_failed)
  REPORTED DATA(lt_reported).

IF lt_failed IS INITIAL.
  COMMIT ENTITIES.
ENDIF.`,
        pros: [
          'Guarantees all validations, determinations, and change logs execute.',
          'Type-safe with full Eclipse ADT syntax checks.',
          'Respects optimistic concurrency locking and draft tables.',
          'Certified for ABAP Cloud and SAP BTP.'
        ],
        cons: [
          'Requires understanding EML syntax and %tky key handling.'
        ],
        cleanCoreVerdict: 'CERTIFIED CLEAN CORE (Grade A+)'
      },
      comparisonTable: [
        { feature: 'Validations & Determinations', elementA: '❌ Completely bypassed (can corrupt database)', elementB: '✅ Always executed in proper sequence', winner: 'EML' },
        { feature: 'Draft Synchronization', elementA: '❌ Corrupts draft table state', elementB: '✅ Automatically synchronizes draft buffer', winner: 'EML' },
        { feature: 'Type Checking', elementA: 'Raw table field matching', elementB: 'Full compile-time type safety via CDS VDM', winner: 'EML' },
        { feature: 'Clean Core Status', elementA: 'Fails ATC Clean Core checks', elementB: 'Mandatory standard for all ABAP Cloud code', winner: 'EML' }
      ],
      architectAdvice: 'Never write raw `INSERT/UPDATE/DELETE ztable` statements on transactional entities. Always use EML. EML ensures your business rules remain intact whether called by a Fiori app, a React SPA, or a background batch job.'
    },

    warStory: "An enterprise financial client had a batch interface that updated customer credit ratings using direct `UPDATE zcust_table SET rating = ...`. Because it bypassed the RAP BO determinations, the customers' risk scores and credit limits were never recalculated. After 3 months, audits revealed that 4,000 high-risk customers had been extended unapproved credit lines! Refactoring the interface to use EML `MODIFY ENTITIES` ensured determinations ran automatically every time, closing the audit vulnerability.",

    files: [
      {
        name: 'zcl_eml_batch_processor.clas.abap',
        lang: 'abap',
        code: `CLASS zcl_eml_batch_processor DEFINITION
  PUBLIC FINAL CREATE PUBLIC.

  PUBLIC SECTION.
    INTERFACES if_oo_adt_classrun.
ENDCLASS.

CLASS zcl_eml_batch_processor IMPLEMENTATION.
  METHOD if_oo_adt_classrun~main.
    " 1. Create a new employee using EML with %cid
    MODIFY ENTITIES OF zi_employee
      ENTITY Employee
      CREATE FIELDS ( EmployeeId FirstName LastName DepartmentId Salary )
      WITH VALUE #(
        ( %cid         = 'CID_EMP_01'
          EmployeeId   = 'EMP901'
          FirstName    = 'Aiden'
          LastName     = 'Zhang'
          DepartmentId = 'DEPT01'
          Salary       = 95000 )
      )
      MAPPED DATA(lt_mapped)
      FAILED DATA(lt_failed)
      REPORTED DATA(lt_reported).

    IF lt_failed IS NOT INITIAL.
      out->write( 'Creation failed during interaction phase!' ).
      RETURN.
    ENDIF.

    " 2. Commit transactional buffer to database
    COMMIT ENTITIES
      RESPONSE OF zi_employee
      FAILED DATA(lt_commit_failed)
      REPORTED DATA(lt_commit_reported).

    IF lt_commit_failed IS INITIAL.
      out->write( 'Employee committed successfully!' ).
      out->write( lt_mapped-employee ).
    ENDIF.
  ENDMETHOD.
ENDCLASS.`
      }
    ],

    lineExplanations: [
      { line: 'MODIFY ENTITIES OF zi_employee ... CREATE FIELDS', desc: 'Type-safe EML statement executing transactional creation against the RAP Business Object.' },
      { line: '%cid = \'CID_EMP_01\'', desc: 'Content ID providing a correlation key between the transient input request and the returned MAPPED table.' },
      { line: 'COMMIT ENTITIES', desc: 'Executes the save sequence, committing transactional buffer changes to the HANA database.' }
    ],

    assignment: {
      prompt: 'Write an EML MODIFY statement that updates the Salary of an employee using %tky and COMMIT ENTITIES.',
      starterCode: `* Day 11 Exercise:
* Update Salary using MODIFY ENTITIES OF zi_employee
* Commit changes with COMMIT ENTITIES`,
      hints: [
        'Use: MODIFY ENTITIES OF zi_employee ENTITY Employee UPDATE FIELDS ( Salary ) WITH VALUE #( ( %tky = ls_key-%tky Salary = 110000 ) )',
        'Check lt_failed and call COMMIT ENTITIES.'
      ],
      solution: `MODIFY ENTITIES OF zi_employee
  ENTITY Employee
  UPDATE FIELDS ( Salary )
  WITH VALUE #(
    ( %tky   = ls_emp-%tky
      Salary = 105000 )
  )
  FAILED DATA(lt_failed)
  REPORTED DATA(lt_reported).

IF lt_failed IS INITIAL.
  COMMIT ENTITIES.
ENDIF.`
    }
  },

  // =========================================================================
  // DAY 12: ADVANCED RAP: SIDE EFFECTS & VIRTUAL ELEMENTS
  // =========================================================================
  {
    id: 'day-12-side-effects-virtual',
    day: 12,
    title: 'Day 12: Advanced RAP: Side Effects, Virtual Elements & Unmanaged Save',
    subtitle: 'Handle reactive UI recalculations, on-the-fly calculations, and hybrid legacy database persistence',
    readTime: '23 min read',
    vlogHook: "Welcome to Day 12! Today we enter the senior architect tier of RAP. What happens when a user changes an item quantity in React, and you need the backend to automatically push back recalculated tax, discount, and gross totals without a full page reload? In RAP, we use Side Effects and Virtual Elements. Let's see how they work.",
    layman: "Side Effects are like smart home automation: when you open the front door (change quantity), the hallway lights turn on and the thermostat adjusts (SAP automatically recalculates line item totals and pushes them back to React). Virtual Elements are like on-the-fly currency conversions: they are computed in real-time in memory without taking up storage space on your hard drive.",
    technical: "Side Effects annotations (`@Common.SideEffects`) declare reactive dependencies: when a source property or entity is modified, the framework automatically targets related fields or child entities for re-reading and UI refresh. Virtual Elements (`@ObjectModel.virtualElementCalculatedBy`) permit dynamic runtime calculation in CDS projection views via SADL exit classes (`IF_SADL_EXIT_CALC_ELEMENT_READ`). For scenarios where a Managed BO must also update legacy secondary tables, RAP provides `with additional save` and `unmanaged save`.",

    deepDiveKeywords: [
      {
        name: 'Configuring Side Effects for Reactive UI Recalculations',
        syntax: '@Common.SideEffects: { SourceProperties: [ \'Quantity\' ], TargetProperties: [ \'TotalAmount\', \'TaxAmount\' ] }',
        laymanAnalogy: 'Like React `useEffect` dependencies: when variable X changes, run calculation and refresh variables Y and Z.',
        technicalDefinition: 'OData annotation instructing the consumer to re-read target properties or target entities after a source property is updated via PATCH.',
        underTheHood: 'Gateway issues an automatic GET for the target properties immediately following the PATCH response.',
        commonPitfall: 'Targeting entire entities when only one field changed. Specify exact `TargetProperties` for faster UI responsiveness.',
        modernExample: `@Common.SideEffects: { SourceProperties: [ 'Quantity' ], TargetProperties: [ 'LineTotal' ] }`
      },
      {
        name: 'Declaring Virtual Elements in CDS with SADL Exit Classes',
        syntax: '@ObjectModel.virtualElementCalculatedBy: \'ABAP:ZCL_CALC_TAX_EXIT\' virtual TaxAmount : abap.curr(15,2);',
        laymanAnalogy: 'A virtual column in an Excel spreadsheet that computes a formula on the fly without storing raw numbers in the database file.',
        technicalDefinition: 'Transient CDS projection elements declared with keyword `virtual`. They are not stored in database tables. When the entity is read, the SADL query engine invokes an ABAP exit class implementing `IF_SADL_EXIT_CALC_ELEMENT_READ` to compute values on the fly.',
        underTheHood: 'Executed during the query execution phase before results are serialized into JSON.',
        commonPitfall: 'Attempting to filter (`$filter`) on a virtual element without implementing `IF_SADL_EXIT_FILTER_TRANSFORM`.',
        modernExample: `@ObjectModel.virtualElementCalculatedBy: 'ABAP:ZCL_CALC_DISCOUNT_EXIT'\nvirtual DiscountAmount : abap.curr(15,2);`
      },
      {
        name: 'Extending Managed RAP with Unmanaged / Additional Save',
        syntax: 'managed implementation in class zbp_i_order unique with additional save; ...',
        laymanAnalogy: 'Standard shipping plus an extra certified mail confirmation: the framework saves the main package, and you run a custom errand on the side.',
        technicalDefinition: 'Extension point in Managed RAP. Allows developers to execute custom database updates or trigger legacy BAPIs during the save sequence while keeping standard CRUD automated.',
        underTheHood: 'The behavior pool implements `save_modified` where custom EML or secondary table updates are executed.',
        commonPitfall: 'Executing COMMIT WORK inside `save_modified`. The RAP framework manages the commit boundary!',
        modernExample: `managed implementation in class zbp_i_order unique with additional save;`
      }
    ],

    elementShowdown: {
      title: 'The Showdown: Database Triggers vs RAP Side Effects & Virtual Elements',
      subtitle: 'Moving from hidden database triggers to declarative, transparent application architecture.',
      elementA: {
        name: 'Legacy Database Triggers & PBO Modules',
        syntax: `* Classic SAP GUI:
MODULE calculate_tax INPUT.
  tax = salary * '0.18'.
ENDMODULE.
* Or DB Triggers hidden in SQL catalog`,
        pros: ['None in modern enterprise architecture.'],
        cons: [
          'Hidden logic that bypasses ABAP debugger.',
          'Database triggers complicate cloud backups and replication.',
          'Does not communicate reactively with modern web frontends.'
        ],
        cleanCoreVerdict: 'OBSOLETE ANTI-PATTERN'
      },
      elementB: {
        name: 'RAP Side Effects & Virtual Elements',
        syntax: `@Common.SideEffects: {
  SourceProperties: [ 'Quantity', 'UnitPrice' ],
  TargetProperties: [ 'TotalAmount' ]
}
@ObjectModel.virtualElementCalculatedBy: 'ABAP:ZCL_CALC_DISCOUNT'
virtual DiscountAmount : abap.curr(15,2);`,
        pros: [
          'Declarative and transparent in CDS annotations.',
          'React and Fiori automatically re-fetch calculated fields.',
          'Calculated in-memory without wasting database disk storage.'
        ],
        cons: [
          'Requires SADL exit classes for complex algorithms.'
        ],
        cleanCoreVerdict: 'CERTIFIED CLEAN CORE (Grade A+)'
      },
      comparisonTable: [
        { feature: 'Transparency', elementA: 'Hidden in database catalog or procedural screens', elementB: 'Explicitly declared in CDS metadata', winner: 'RAP Side Effects' },
        { feature: 'React UI Reactivity', elementA: 'Requires manual full-page reload', elementB: 'Automatic targeted delta re-fetching', winner: 'RAP Side Effects' },
        { feature: 'Disk Space', elementA: 'Stores redundant derived values on disk', elementB: 'Computed on the fly in memory (Virtual Element)', winner: 'Virtual Elements' },
        { feature: 'Clean Core Status', elementA: 'Violates Cloud rules', elementB: 'Standard enterprise pattern', winner: 'RAP Standard' }
      ],
      architectAdvice: 'Use Determinations on Modify when a derived value must be permanently saved to the database. Use Virtual Elements when the value is purely for presentation (like age derived from birthdate, or formatted status text).'
    },

    warStory: "An insurance portal was storing 'Customer Age' directly in a database table. Over time, the ages became incorrect because birthdays passed without database records being updated! We replaced the raw column with a CDS Virtual Element that calculated age dynamically on read from `BirthDate`. The database was relieved of 500,000 redundant records and customer age was always 100% accurate.",

    files: [
      {
        name: 'ZC_SalesOrderItem.ddls.asddls',
        lang: 'cds',
        code: `@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Item Projection with Virtual Element'
define view entity ZC_SalesOrderItem
  as projection on ZI_SalesOrderItem
{
  key ItemUUID,
      OrderUUID,
      Quantity,
      UnitPrice,

      @ObjectModel.virtualElementCalculatedBy: 'ABAP:ZCL_CALC_DISCOUNT_EXIT'
      virtual DiscountAmount : abap.curr(15,2),

      /* Associated Root */
      _Order : redirected to parent ZC_SalesOrder
}`
      }
    ],

    lineExplanations: [
      { line: '@ObjectModel.virtualElementCalculatedBy: \'ABAP:...\'', desc: 'Instructs the SADL query framework to invoke an ABAP exit class to compute this field dynamically on READ.' },
      { line: 'virtual DiscountAmount : abap.curr(15,2)', desc: 'Declares a calculated virtual element that is not stored in the database.' }
    ],

    assignment: {
      prompt: 'Declare a CDS virtual element `TaxAmount` in a CDS projection view with calculation exit class ZCL_CALC_TAX_EXIT.',
      starterCode: `* Day 12 Exercise:
* Declare virtual element TaxAmount
* Link to ZCL_CALC_TAX_EXIT`,
      hints: [
        'Use: @ObjectModel.virtualElementCalculatedBy: \'ABAP:ZCL_CALC_TAX_EXIT\'',
        'Add: virtual TaxAmount : abap.curr(15,2)'
      ],
      solution: `@ObjectModel.virtualElementCalculatedBy: 'ABAP:ZCL_CALC_TAX_EXIT'
virtual TaxAmount : abap.curr(15,2),`
    }
  },

  // =========================================================================
  // DAY 13: CLEAN CORE, ABAP CLOUD & ATC GOVERNANCE
  // =========================================================================
  {
    id: 'day-13-clean-core-atc',
    day: 13,
    title: 'Day 13: Clean Core, ABAP Cloud & ATC Governance',
    subtitle: 'Enforce zero-modification extensibility, Level A Released APIs, and automated ATC code inspections',
    readTime: '21 min read',
    vlogHook: "Welcome to Day 13! If you remember only one concept from this entire 14-day masterclass, make it this: CLEAN CORE. Every CIO, VP, and Lead Architect in the SAP world is talking about Clean Core. Why? Because companies spent millions of dollars customizing classic SAP systems, and now they cannot upgrade. Today, we look at how ABAP Cloud and ATC checks enforce zero modifications.",
    layman: "Imagine you bought a brand new Tesla. In the old days, developers took out a blowtorch, cut through the engine, and soldered custom wires directly into the battery (Classic modifications). When Tesla pushed a software update, the car bricked! Clean Core means: never cut the engine. Plug your custom devices into the factory-approved USB ports (Released APIs). Now the car upgrades seamlessly every time.",
    technical: "The S/4HANA Clean Core strategy decouples custom code from the core ERP software. The technical enforcement mechanism is **ABAP for Cloud Development** (ABAP Language Version 5). In this mode, the compiler strictly forbids access to unreleased standard SAP tables (`BUT000`, `MARA`, `VBAK`, `EKKO`) and unreleased function modules. Developers must access standard SAP objects strictly through **Level A Released APIs** governed by **Release Contract C1** (System Internal Use) and **Contract C2** (Remote API). Quality is governed via the **ABAP Test Cockpit (ATC)** using Clean Core check variants.",

    deepDiveKeywords: [
      {
        name: 'The 3 Pillars of Clean Core (Upgrade Stability, Cloud Readiness, Decoupling)',
        syntax: 'Zero Modifications + Strict API Boundary + Decoupled Extension',
        laymanAnalogy: 'Building a modular kitchen: you can replace the dishwasher or oven anytime without breaking the plumbing or tearing down the walls.',
        technicalDefinition: 'The enterprise extensibility methodology ensuring that ERP upgrades do not break custom extensions. Relies on public released interfaces and developer extensibility inside the core, coupled with side-by-side apps on BTP.',
        underTheHood: 'Enforced via automated ATC check variants during transport release in the software logistics pipeline.',
        commonPitfall: 'Assuming that "custom Z tables" are enough for Clean Core. If your Z table logic reads unreleased standard tables like BUT000, it still violates Clean Core!',
        modernExample: `SELECT FROM i_businesspartner FIELDS businesspartner INTO TABLE @DATA(lt_bp).`
      },
      {
        name: 'Release Contracts: C1 (System Internal Use) vs C2 (Remote API)',
        syntax: 'Contract C1: System-Internal Use / Contract C2: Remote API',
        laymanAnalogy: 'A legal warranty from SAP: "We promise never to delete or break this CDS view entity in future upgrades."',
        technicalDefinition: 'Formal API stability contracts published by SAP. Contract C1 certifies an object for internal extension and consumption (e.g. `I_BusinessPartner`). Contract C2 certifies an object for external remote consumption (e.g. OData V4 APIs).',
        underTheHood: 'Registered in the SAP API Hub and checked automatically by the compiler.',
        commonPitfall: 'Consuming standard CDS views that have no release contract. If SAP changes them in the next feature pack, your code will break!',
        modernExample: `SELECT FROM i_businesspartner FIELDS businesspartner INTO TABLE @DATA(lt_bp).`
      },
      {
        name: 'Configuring & Running ABAP Test Cockpit (ATC) with Clean Core Variants',
        syntax: 'Run as -> ABAP Test Cockpit (Variant: ABAP_CLOUD_READINESS)',
        laymanAnalogy: 'An automated security scanner inspecting every line of code before it is allowed to board the transport truck.',
        technicalDefinition: 'The static code analysis and governance tool in SAP. ATC check variants (such as `ABAP_CLOUD_READINESS`) scan repositories for unreleased table reads, obsolete syntax, performance bottlenecks, and security flaws.',
        underTheHood: 'Integrated into transport release pipelines (SE09/SE10) and ADT. Prevents releasing transports with fatal Clean Core violations.',
        commonPitfall: 'Ignoring ATC warnings until go-live week. Integrate ATC directly into developer Eclipse ADT shortcuts (Ctrl+Shift+F9).',
        modernExample: `* In Eclipse ADT: Right Click Project -> Run As -> ABAP Test Cockpit`
      }
    ],

    elementShowdown: {
      title: 'The Showdown: Classic Modification / User Exits vs S/4HANA Clean Core',
      subtitle: 'The fundamental paradigm shift that protects SAP customers from multi-million dollar upgrade disasters.',
      elementA: {
        name: 'Classic Modifications & User Exits (Legacy R/3 & ECC)',
        syntax: `* ❌ CLASSIC DANGEROUS ECC PATTERN:
* Directly modifying SAP standard program in SE38
* Or reading unreleased core tables:
SELECT * FROM mara INTO TABLE lt_mara
  WHERE matnr = lv_matnr.
CALL FUNCTION 'BAPI_MATERIAL_SAVEDATA' ...`,
        pros: ['Allowed developers to do whatever they wanted in 2005.'],
        cons: [
          'Direct reads on unreleased tables break when SAP normalizes data structures in S/4HANA.',
          'Custom modifications require weeks of manual SPAU/SPDD remediation during every upgrade.',
          'Makes migrating to public cloud completely impossible.',
          'Voided enterprise upgrade SLAs.'
        ],
        cleanCoreVerdict: 'BLOCKED IN S/4HANA CLOUD'
      },
      elementB: {
        name: 'S/4HANA Clean Core (Level A Released APIs)',
        syntax: `* ✅ CLEAN CORE S/4HANA CLOUD PATTERN:
SELECT FROM i_product
  FIELDS product, producttype, baseunit
  WHERE product = @lv_product
  INTO TABLE @DATA(lt_clean_products).

* Extensions built via RAP Business Object Extensibility`,
        pros: [
          '100% upgrade stable: SAP guarantees Level A APIs never break across releases.',
          'Upgrades run automatically without manual code adjustments.',
          'Compatible across S/4HANA Cloud, Private Cloud, and BTP.',
          'Verified by automated ATC check suites.'
        ],
        cons: [
          'Requires developers to query released CDS views instead of raw tables.'
        ],
        cleanCoreVerdict: 'CERTIFIED CLEAN CORE (Grade A+)'
      },
      comparisonTable: [
        { feature: 'Upgrade Experience', elementA: 'Painful: months of SPAU/SPDD code fixes and testing', elementB: 'Seamless: zero code remediation required on upgrade', winner: 'Clean Core' },
        { feature: 'Data Access', elementA: 'Direct query on raw tables (MARA, BUT000, VBAK)', elementB: 'Officially released Level A CDS View Entities (I_*)', winner: 'Clean Core' },
        { feature: 'Code Governance', elementA: 'Manual peer review (often skipped)', elementB: 'Automated compiler and ATC gatekeeping', winner: 'Clean Core' },
        { feature: 'Cloud Portability', elementA: 'Tied permanently to on-premise legacy ECC', elementB: 'Runs seamlessly on SAP BTP and S/4HANA Cloud', winner: 'Clean Core' }
      ],
      architectAdvice: 'Whenever you write a SELECT statement, check if the source table is a standard SAP table. If it is, immediately replace it with its released CDS counterpart: `BUT000 -> I_BusinessPartner`, `MARA -> I_Product`, `VBAK -> I_SalesOrderTP`, `EKKO -> I_PurchaseOrderAPI01`.'
    },

    warStory: "A Fortune 100 energy client had accumulated 14,000 custom modifications and direct `SELECT * FROM BUT000` queries in their ECC 6.0 system over 18 years. When they attempted to upgrade to S/4HANA, the estimated remediation project was quoted at $12 million and 18 months! By establishing a strict Clean Core architecture rule, running automated ATC scans, and systematically refactoring to released CDS View Entities, the upgrade project was completed in 6 months for a fraction of the cost.",

    files: [
      {
        name: 'clean_core_rules.abap',
        lang: 'abap',
        code: `* ========================================================
* Clean Core Reference Guide: Classic vs Modern ABAP Cloud
* ========================================================

* 1. Accessing Business Partner Data:
* ❌ FORBIDDEN IN ABAP CLOUD:
* SELECT * FROM but000 INTO TABLE @DATA(lt_bp).

* ✅ CLEAN CORE (Released CDS View Entity I_BusinessPartner):
SELECT FROM i_businesspartner
  FIELDS businesspartner, businesspartnerfullname, createdbyuser
  WHERE businesspartnercategory = '1'
  INTO TABLE @DATA(lt_clean_bp)
  UP TO 20 ROWS.

* 2. Accessing Product Master Data:
* ❌ FORBIDDEN IN ABAP CLOUD:
* SELECT * FROM mara INTO TABLE @DATA(lt_mat).

* ✅ CLEAN CORE (Released CDS View Entity I_Product):
SELECT FROM i_product
  FIELDS product, producttype, baseunit
  INTO TABLE @DATA(lt_clean_prod)
  UP TO 20 ROWS.

* 3. Logging & Output:
* ❌ FORBIDDEN IN ABAP CLOUD:
* WRITE: / 'Processing complete'.

* ✅ CLEAN CORE:
* out->write( 'Processing complete' ).`
      }
    ],

    lineExplanations: [
      { line: 'SELECT FROM i_businesspartner FIELDS ...', desc: 'Level A released CDS view entity with Contract C1 release status. Fully upgrade-stable.' },
      { line: 'SELECT FROM i_product FIELDS ...', desc: 'Replaces direct reads of the classic MARA table in S/4HANA Cloud.' }
    ],

    assignment: {
      prompt: 'Refactor this classic query to S/4HANA Clean Core: `SELECT * FROM mara WHERE matnr = \'MAT01\' INTO TABLE lt_mat.` Use released view entity I_Product and modern ABAP SQL.',
      starterCode: `* Day 13 Exercise:
* Rewrite query on MARA using released view entity I_Product
* Select Product, ProductType, and BaseUnit into inline @DATA(lt_products)`,
      hints: [
        'Query from i_product instead of mara.',
        'Use FIELDS product, producttype, baseunit',
        'Put results into @DATA(lt_products).'
      ],
      solution: `SELECT FROM i_product
  FIELDS product, producttype, baseunit
  WHERE product = 'MAT01'
  INTO TABLE @DATA(lt_products).`
    }
  },

  // =========================================================================
  // DAY 14: FULL-STACK CAPSTONE & TECHNICAL INTERVIEW PREPARATION
  // =========================================================================
  {
    id: 'day-14-capstone-interview',
    day: 14,
    title: 'Day 14: Full-Stack Capstone, Architecture Review & Interview',
    subtitle: 'Synthesize the complete 5-layer architecture and master senior architect technical interview scenarios',
    readTime: '25 min read',
    vlogHook: "Welcome to Day 14! You made it to the Capstone Chapter. Over the past two weeks, you have transformed from a traditional developer into a full-stack SAP Architect who understands Modern ABAP expressions, CDS View Entities, RAP Managed BOs, EML, OData V4, and React UI integration. In today's final masterclass, we review the end-to-end full stack architecture and solve the toughest technical interview questions asked at top consulting firms and tech enterprises.",
    layman: "Think of this chapter as the grand architectural blueprint: connecting the foundation in the ground (SAP HANA columnar storage), the steel beam structure (CDS View Entities & RAP behavior engine), the electrical wiring (OData V4 HTTP APIs), and the luxurious penthouse interior where users live (the modern React user interface).",
    technical: "In technical architect interviews, candidates are evaluated on end-to-end coherence: why OData V4 over V2 (payload compression, delta PATCH semantics), how RAP guarantees transactional isolation via EML IN LOCAL MODE, how optimistic locking functions through ETags across the stateless web boundary, and how Clean Core guarantees multi-tenant upgrade stability. Review this complete checklist before taking your certification or interview.",

    deepDiveKeywords: [
      {
        name: 'Full-Stack Architecture: React SPA -> SAP Gateway OData V4 -> RAP BO -> HANA DB',
        syntax: 'React UI (1) -> OData V4 (2) -> CDS Projection & Interface (3) -> RAP BDEF & EML (4) -> HANA DB (5)',
        laymanAnalogy: 'A five-stage relay race where every athlete hands off the baton with zero dropped steps.',
        technicalDefinition: 'The end-to-end enterprise architecture: React manages UI state and fetches CSRF tokens; Gateway routes OData V4 JSON requests; CDS applies projections and joins; RAP executes validations and determinations; HANA persists columnar records.',
        underTheHood: 'Stateless, decoupled, and horizontally scalable.',
        commonPitfall: 'Bypassing intermediate layers (e.g. attempting to read raw tables directly from frontend).',
        modernExample: `React fetch() -> /sap/opu/odata4/... -> ZC_Employee -> ZI_Employee -> zemp_table_db`
      },
      {
        name: 'Production Deployment: Cloud Connector, BTP Destination Service, CSRF & CORS',
        syntax: 'React SPA on BTP Cloud Foundry/Kyma <-> SAP Destination Service <-> Cloud Connector <-> S/4HANA',
        laymanAnalogy: 'Building a modern sunroom extension on your house: you connect it through a clean doorway without altering the load-bearing walls.',
        technicalDefinition: 'Deploying custom applications on SAP Business Technology Platform (BTP) while connecting securely to S/4HANA via SAP Cloud Connector and Destination Service.',
        underTheHood: 'Uses mutual TLS and principal propagation to forward the user identity safely from cloud to on-premise.',
        commonPitfall: 'Opening direct firewall ports to the internal SAP system instead of using SAP Cloud Connector.',
        modernExample: `fetch('/destinations/S4HANA_DEST/sap/opu/odata4/...')`
      },
      {
        name: 'Senior Architect Interview: High-Concurrency RAP Applications with Optimistic Locking',
        syntax: 'Handling Concurrency, High Volume Paging, ETag Mismatch, and Clean Core Migrations',
        laymanAnalogy: 'Answering high-stakes case studies: how would you design an airline ticketing system that handles 100,000 ticket bookings per minute without double-booking seats?',
        technicalDefinition: 'Demonstrates deep mastery of RAP locking phases, optimistic concurrency (ETags), late numbering, and asynchronous processing.',
        underTheHood: 'Evaluates architectural judgment, system trade-offs, and Clean Core governance.',
        commonPitfall: 'Suggesting classic procedural workarounds (like lock tables or direct SQL) in an architectural interview.',
        modernExample: `Q: How do you prevent double-spending in RAP? A: Lock master on root entity + ETag master timestamp + validations on save.`
      }
    ],

    elementShowdown: {
      title: 'The Showdown: On-Premise Monolith vs Side-by-Side BTP + React Architecture',
      subtitle: 'The modern cloud architecture decoupling business logic from presentation.',
      elementA: {
        name: 'On-Premise SAP GUI Monolith (Legacy)',
        syntax: `* Everything bundled in one single server:
* - Dynpro screens
* - Business logic
* - Direct SQL
* - Background jobs`,
        pros: ['Everything is in one place.'],
        cons: [
          'High upgrade friction: upgrading one module risks breaking the entire enterprise.',
          'UI tied to Windows desktop SAP GUI client.',
          'High license and hardware footprint on core ERP.',
          'Slow release cycles (6 to 12 months per deployment).'
        ],
        cleanCoreVerdict: 'MONOLITHIC LEGACY'
      },
      elementB: {
        name: 'Side-by-Side BTP + Decoupled React (Modern)',
        syntax: `React SPA (BTP Kyma / Cloud Foundry)
   |-- HTTPS OData V4 / Destination Service
   V
S/4HANA Cloud (RAP Clean Core Backend)`,
        pros: [
          'Frontend deploys independently in minutes (CI/CD).',
          'Zero impact on S/4HANA core during frontend redesigns.',
          'Clean Core: core ERP stays 100% standard and upgrade-ready.',
          'React frontend runs on mobile, tablets, and web with high performance.'
        ],
        cons: [
          'Requires setting up SAP Destination Service and Cloud Connector.'
        ],
        cleanCoreVerdict: 'ENTERPRISE TARGET ARCHITECTURE (Grade A+)'
      },
      comparisonTable: [
        { feature: 'Frontend Release Velocity', elementA: 'Months (tied to ABAP transport release cycle)', elementB: 'Minutes (independent web CI/CD pipeline)', winner: 'Decoupled React' },
        { feature: 'Core ERP CPU Load', elementA: 'High: ERP server renders screens and layouts', elementB: 'Minimal: client-side browser rendering via React', winner: 'Decoupled React' },
        { feature: 'User Experience', elementA: 'Classic 1990s SAP GUI screens', elementB: 'Modern, responsive, mobile-friendly Tailwind UI', winner: 'Decoupled React' },
        { feature: 'Clean Core Compliance', elementA: '❌ Frequent custom table and code collisions', elementB: '✅ 100% Isolated via released OData V4 APIs', winner: 'Decoupled React' }
      ],
      architectAdvice: 'When designing new enterprise solutions, keep the core ERP clean. Expose business objects via RAP OData V4, and build user-facing web and mobile applications using React/Vite on SAP BTP or modern cloud hosting.'
    },

    warStory: "A global airline with 30,000 flight attendants needed a crew schedule bidding portal. The original plan was to build classic Web Dynpro ABAP screens directly on the S/4HANA production system, which would have overloaded the ERP database with 50,000 daily concurrent hits. Instead, we architected a decoupled React SPA hosted on SAP BTP with a RAP OData V4 backend. The React app handled client-side filtering, offline bidding, and push notifications, reducing ERP CPU overhead by 88% and delivering an award-winning user experience.",

    files: [
      {
        name: 'full_stack_architecture_summary.md',
        lang: 'markdown',
        code: `# Full-Stack Enterprise SAP RAP & React Architecture Summary

## Layer 1: React Frontend (Modern SPA)
- Modular fetch() service layer
- CSRF handshake: HEAD / GET with 'X-CSRF-Token: Fetch'
- Surgical delta updates: PATCH with 'If-Match: *'
- Error handling: parsing RAP 'error.details' for localized field messages

## Layer 2: Service Definition & Binding (OData V4)
- define service ZAPI_*
- Binding Type: OData V4 - Web API
- Paging & Filtering: $top, $skip, $filter, $orderby, $count=true

## Layer 3: CDS View Entities (Virtual Data Model)
- Interface Views (ZI_*): define root view entity on database table
- Projection Views (ZC_*): provider contract transactional_query
- Associations [0..1] and [0..*] for lazy joins

## Layer 4: RAP Behavior Definition & Implementation
- strict ( 2 ) mode
- Validations (ON SAVE) checking business logic
- Determinations (ON MODIFY / ON SAVE) deriving fields
- Bound Actions with Instance Feature Control

## Layer 5: SAP HANA & Clean Core
- ABAP Language Version 5 (Cloud)
- Level A Released APIs (I_BusinessPartner, I_Product)
- Zero direct reads on unreleased tables (BUT000, MARA)`
      }
    ],

    lineExplanations: [
      { line: 'Layer 1 -> Layer 5', desc: 'The cohesive 5-tier architecture connecting responsive React web apps to SAP S/4HANA Cloud systems.' }
    ],

    assignment: {
      prompt: 'Write a comprehensive architectural summary statement explaining why strict ( 2 ) is required in RAP Behavior Definitions and why React must use PATCH instead of PUT in OData V4.',
      starterCode: `* Day 14 Capstone Question:
* 1. Why strict ( 2 ) is required in RAP BDEF
* 2. Why React must use PATCH instead of PUT in OData V4`,
      hints: [
        'strict ( 2 ) enforces modern compiler checks and cloud readiness.',
        'PATCH sends only modified attributes whereas PUT replaces the entire entity.'
      ],
      solution: `1. strict ( 2 ) in RAP Behavior Definitions is mandatory for Clean Core & ABAP Cloud compliance because it activates the most rigorous compiler checks: explicit mapping between CDS and database tables, mandatory authorization master declarations, read-only field validation, and prevention of unreleased statements.

2. In OData V4, React must use HTTP PATCH instead of PUT for updates because PATCH performs a surgical delta update, transmitting only the modified attributes. This minimizes network payload, respects optimistic locking (ETag), and avoids unintentionally overwriting server-derived or uneditable fields.`
    }
  }
];

export const LESSONS = BASE_LESSONS.map((l) => {
  const dayAssignments = DAY_ASSIGNMENTS[l.id] || [];
  const bridge = BEGINNER_BRIDGES[l.id] || null;
  return {
    ...l,
    beginnerBridge: bridge,
    assignments: dayAssignments,
    assignment: dayAssignments[9] || dayAssignments[0] || l.assignment
  };
});

