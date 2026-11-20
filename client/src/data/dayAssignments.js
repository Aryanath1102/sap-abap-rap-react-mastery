/**
 * Enterprise 15-Day Masterclass: Beginner Bridges & 150 Progressive Hands-On Assignments
 * For developers new to SAP & classic ABAP (Zero-to-Hero methodology)
 * Every day has 10 assignments, with #10 being the Master Capstone synthesizing all concepts.
 */

export const DAY_ASSIGNMENTS = {
  "day-0-abap-prerequisites": [
    {
      "id": 1,
      "title": "Exercise 1: Basic Variables, Immutability & The Period Operator",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "Declare an immutable variable `lv_app_name` with value \"SAP Cloud Studio\" using `FINAL(...)` and a mutable variable `lv_version` with value 1 using `DATA(...)`. Increment `lv_version` by 1. Note: remember that every statement in ABAP ends with a period `.`. Output to console.",
      "starterCode": "\" Exercise 1: Variables & Immutability\nMETHOD if_oo_adt_classrun~main.\n  \" TODO: Declare immutable lv_app_name with FINAL\n  \" TODO: Declare mutable lv_version with DATA starting at 1\n  \" TODO: Increment lv_version by 1\n  \" TODO: Output via out->write( ... )\nENDMETHOD.",
      "hints": [
        "FINAL(lv_app_name) = 'SAP Cloud Studio'.",
        "DATA(lv_version) = 1. lv_version = lv_version + 1.",
        "out->write( |{ lv_app_name } Version { lv_version }| )."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_app_name) = 'SAP Cloud Studio'.\n  DATA(lv_version)   = 1.\n\n  lv_version = lv_version + 1.\n\n  out->write( |{ lv_app_name } Version { lv_version }| ).\nENDMETHOD."
    },
    {
      "id": 2,
      "title": "Exercise 2: Field Access with Hyphen (-) & String Templates (|...|)",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "In ABAP, structure fields are accessed with a hyphen `-` (e.g. `ls_person-first_name`). Given a structure `ls_user` with fields `first_name`, `last_name`, and `role`, use modern string templates with pipes `|...|` to format a greeting.",
      "starterCode": "\" Exercise 2: Hyphen field access and string templates\nTYPES: BEGIN OF ty_user,\n         first_name TYPE string,\n         last_name  TYPE string,\n         role       TYPE string,\n       END OF ty_user.\n\nMETHOD if_oo_adt_classrun~main.\n  FINAL(ls_user) = VALUE ty_user( first_name = 'Alex' last_name = 'Riva' role = 'Lead Architect' ).\n\n  \" TODO: Access ls_user-first_name and ls_user-role using hyphen\n  \" Format string template: |User: { ... } | && |Role: { ... }|\nENDMETHOD.",
      "hints": [
        "Notice: Use ls_user-first_name (with a hyphen), NOT ls_user.first_name.",
        "Use out->write( |User: { ls_user-first_name } { ls_user-last_name } | && |Role: { ls_user-role }| )."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  TYPES: BEGIN OF ty_user,\n           first_name TYPE string,\n           last_name  TYPE string,\n           role       TYPE string,\n         END OF ty_user.\n\n  FINAL(ls_user) = VALUE ty_user(\n    first_name = 'Alex'\n    last_name  = 'Riva'\n    role       = 'Lead Architect'\n  ).\n\n  out->write( |User: { ls_user-first_name } { ls_user-last_name } | &&\n              |Role: { ls_user-role }| ).\nENDMETHOD."
    },
    {
      "id": 3,
      "title": "Exercise 3: Control Flow with IF / ELSEIF / ELSE and CASE",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Write an `IF / ELSEIF / ELSE` check evaluating `lv_score`: >= 90 returns \"Grade A\", >= 75 returns \"Grade B\", otherwise \"Grade C\". Also write a `CASE` statement evaluating `lv_status_code` ('S' -> \"Success\", 'E' -> \"Error\", 'W' -> \"Warning\").",
      "starterCode": "\" Exercise 3: Control Flow\nMETHOD if_oo_adt_classrun~main.\n  FINAL(lv_score) = 85.\n  FINAL(lv_status_code) = 'S'.\n\n  \" TODO: IF / ELSEIF / ELSE for lv_score\n  \" TODO: CASE lv_status_code WHEN ... WHEN OTHERS ... ENDCASE\nENDMETHOD.",
      "hints": [
        "IF lv_score >= 90. ... ELSEIF lv_score >= 75. ... ELSE. ... ENDIF.",
        "CASE lv_status_code. WHEN 'S'. ... WHEN 'E'. ... WHEN OTHERS. ... ENDCASE."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_score)       = 85.\n  FINAL(lv_status_code) = 'S'.\n\n  DATA lv_grade TYPE string.\n  IF lv_score >= 90.\n    lv_grade = 'Grade A'.\n  ELSEIF lv_score >= 75.\n    lv_grade = 'Grade B'.\n  ELSE.\n    lv_grade = 'Grade C'.\n  ENDIF.\n\n  DATA lv_status_text TYPE string.\n  CASE lv_status_code.\n    WHEN 'S'.\n      lv_status_text = 'Success'.\n    WHEN 'E'.\n      lv_status_text = 'Error'.\n    WHEN OTHERS.\n      lv_status_text = 'Warning / Other'.\n  ENDCASE.\n\n  out->write( |Score: { lv_score } -> { lv_grade }| ).\n  out->write( |Status: { lv_status_code } -> { lv_status_text }| ).\nENDMETHOD."
    },
    {
      "id": 4,
      "title": "Exercise 4: Defining Structures (DTOs) with TYPES: BEGIN OF",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Define a structure type `ty_product` with fields `product_id TYPE string`, `product_name TYPE string`, and `unit_price TYPE decfloat16`. Instantiate a single structure `ls_product` and assign values.",
      "starterCode": "\" Exercise 4: Defining Structures\nMETHOD if_oo_adt_classrun~main.\n  \" TODO: Define TYPES: BEGIN OF ty_product ... END OF ty_product\n  \" TODO: Instantiate ls_product with VALUE ty_product( ... )\n  \" TODO: Output product details\nENDMETHOD.",
      "hints": [
        "TYPES: BEGIN OF ty_product, product_id TYPE string, product_name TYPE string, unit_price TYPE decfloat16, END OF ty_product.",
        "FINAL(ls_product) = VALUE ty_product( product_id = 'P100' product_name = 'Laptop' unit_price = 1200 )."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  TYPES: BEGIN OF ty_product,\n           product_id   TYPE string,\n           product_name TYPE string,\n           unit_price   TYPE decfloat16,\n         END OF ty_product.\n\n  FINAL(ls_product) = VALUE ty_product(\n    product_id   = 'P100'\n    product_name = 'Laptop'\n    unit_price   = 1200\n  ).\n\n  out->write( |Product: { ls_product-product_name } (#{ ls_product-product_id }), Price: { ls_product-unit_price }| ).\nENDMETHOD."
    },
    {
      "id": 5,
      "title": "Exercise 5: Internal Tables (Arrays) & Manual APPEND",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Define an internal table type `tt_products TYPE STANDARD TABLE OF ty_product WITH EMPTY KEY`. Create a mutable table `DATA(lt_products) TYPE tt_products`. Populate 2 rows using manual `APPEND ls_product TO lt_products`.",
      "starterCode": "\" Exercise 5: Internal Tables and APPEND\nMETHOD if_oo_adt_classrun~main.\n  \" TODO: Define tt_products\n  \" TODO: Declare DATA(lt_products) TYPE tt_products\n  \" TODO: APPEND two products\n  \" TODO: Output count using lines( lt_products )\nENDMETHOD.",
      "hints": [
        "In Java: list.add(item); In ABAP: APPEND ls_item TO lt_items.",
        "Use lines( lt_products ) to count table rows."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  TYPES: BEGIN OF ty_product,\n           product_id   TYPE string,\n           product_name TYPE string,\n           unit_price   TYPE decfloat16,\n         END OF ty_product,\n         tt_products TYPE STANDARD TABLE OF ty_product WITH EMPTY KEY.\n\n  DATA lt_products TYPE tt_products.\n\n  DATA ls_prod1 TYPE ty_product.\n  ls_prod1-product_id   = 'P01'.\n  ls_prod1-product_name = 'Monitor'.\n  ls_prod1-unit_price   = 350.\n  APPEND ls_prod1 TO lt_products.\n\n  DATA ls_prod2 TYPE ty_product.\n  ls_prod2-product_id   = 'P02'.\n  ls_prod2-product_name = 'Keyboard'.\n  ls_prod2-unit_price   = 85.\n  APPEND ls_prod2 TO lt_products.\n\n  out->write( |Total items in table: { lines( lt_products ) }| ).\n  out->write( lt_products ).\nENDMETHOD."
    },
    {
      "id": 6,
      "title": "Exercise 6: Iterating Collections with LOOP AT ... INTO ...",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Loop through an internal table `lt_products` using `LOOP AT lt_products INTO FINAL(ls_prod). ... ENDLOOP.`. Print each product line and compute total price with an accumulator.",
      "starterCode": "\" Exercise 6: LOOP AT itab INTO wa\nMETHOD if_oo_adt_classrun~main.\n  -- Given lt_products\n  -- TODO: Loop through table and accumulate total price\nENDMETHOD.",
      "hints": [
        "In Java: for (final Product p : list). In ABAP: LOOP AT lt_products INTO FINAL(ls_prod).",
        "Accumulate with lv_total = lv_total + ls_prod-unit_price."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  TYPES: BEGIN OF ty_product,\n           product_id   TYPE string,\n           product_name TYPE string,\n           unit_price   TYPE decfloat16,\n         END OF ty_product,\n         tt_products TYPE STANDARD TABLE OF ty_product WITH EMPTY KEY.\n\n  FINAL(lt_products) = VALUE tt_products(\n    ( product_id = 'P01' product_name = 'Monitor'  unit_price = 350 )\n    ( product_id = 'P02' product_name = 'Keyboard' unit_price = 85 )\n    ( product_id = 'P03' product_name = 'Mouse'    unit_price = 45 )\n  ).\n\n  DATA lv_total TYPE decfloat16 VALUE 0.\n\n  LOOP AT lt_products INTO FINAL(ls_prod).\n    lv_total = lv_total + ls_prod-unit_price.\n    out->write( |Item { ls_prod-product_id }: { ls_prod-product_name } = { ls_prod-unit_price }| ).\n  ENDLOOP.\n\n  out->write( |Total Cart Value: { lv_total }| ).\nENDMETHOD."
    },
    {
      "id": 7,
      "title": "Exercise 7: Finding Elements with READ TABLE ... WITH KEY",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Find a specific row in `lt_products` where `product_id = 'P02'` using `READ TABLE lt_products WITH KEY product_id = 'P02' INTO FINAL(ls_found).`. Check `IF sy-subrc = 0`.",
      "starterCode": "\" Exercise 7: READ TABLE search\nMETHOD if_oo_adt_classrun~main.\n  -- TODO: Search for product P02 using READ TABLE\n  -- Check IF sy-subrc = 0 (found)\nENDMETHOD.",
      "hints": [
        "READ TABLE lt_products WITH KEY product_id = 'P02' INTO FINAL(ls_found).",
        "sy-subrc = 0 means found (success), sy-subrc = 4 means not found."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  TYPES: BEGIN OF ty_product,\n           product_id   TYPE string,\n           product_name TYPE string,\n           unit_price   TYPE decfloat16,\n         END OF ty_product,\n         tt_products TYPE STANDARD TABLE OF ty_product WITH EMPTY KEY.\n\n  FINAL(lt_products) = VALUE tt_products(\n    ( product_id = 'P01' product_name = 'Monitor'  unit_price = 350 )\n    ( product_id = 'P02' product_name = 'Keyboard' unit_price = 85 )\n  ).\n\n  READ TABLE lt_products WITH KEY product_id = 'P02' INTO FINAL(ls_found).\n  IF sy-subrc = 0.\n    out->write( |Found product: { ls_found-product_name } with price { ls_found-unit_price }| ).\n  ELSE.\n    out->write( 'Product not found.' ).\n  ENDIF.\nENDMETHOD."
    },
    {
      "id": 8,
      "title": "Exercise 8: DTO Mapping with CORRESPONDING #( ... )",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "You have a rich database row type `ty_db_user` with 5 fields and a lean API response type `ty_api_user` with only 3 fields (`user_id`, `email`, `role`). Use `CORRESPONDING ty_api_user( ls_db_user )` to automatically map matching fields without manual assignment.",
      "starterCode": "\" Exercise 8: CORRESPONDING DTO mapping\nMETHOD if_oo_adt_classrun~main.\n  \" TODO: Define ty_db_user and ty_api_user\n  \" TODO: Map using CORRESPONDING ty_api_user( ls_db )\nENDMETHOD.",
      "hints": [
        "In Spring Boot: modelMapper.map(source, Target.class). In ABAP: FINAL(ls_api) = CORRESPONDING ty_api_user( ls_db ).",
        "Only fields with identical names are copied automatically!"
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  TYPES: BEGIN OF ty_db_user,\n           user_id     TYPE string,\n           email       TYPE string,\n           role        TYPE string,\n           password_hash TYPE string,\n           last_login_ip TYPE string,\n         END OF ty_db_user,\n\n         BEGIN OF ty_api_user,\n           user_id TYPE string,\n           email   TYPE string,\n           role    TYPE string,\n         END OF ty_api_user.\n\n  FINAL(ls_db) = VALUE ty_db_user(\n    user_id       = 'USR_99'\n    email         = 'developer@corp.com'\n    role          = 'ADMIN'\n    password_hash = '$2a$12$e8...'\n    last_login_ip = '192.168.1.1'\n  ).\n\n  \" Automatic field mapping:\n  FINAL(ls_api) = CORRESPONDING ty_api_user( ls_db ).\n\n  out->write( |Clean API DTO (Password excluded): { ls_api-email } ({ ls_api-role })| ).\nENDMETHOD."
    },
    {
      "id": 9,
      "title": "Exercise 9: Writing an Object-Oriented Class & Interface (~)",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 15,
      "prompt": "Write an ABAP class `zcl_math_service` implementing an interface `zif_calculator` with method `multiply( iv_a, iv_b ) RETURNING VALUE(rv_product)`. Explain why the method implementation requires the tilde `~` operator.",
      "starterCode": "\" Exercise 9: OOP and the ~ operator\nINTERFACE zif_calculator.\n  METHODS multiply\n    IMPORTING iv_a TYPE i iv_b TYPE i\n    RETURNING VALUE(rv_product) TYPE i.\nENDINTERFACE.\n\nCLASS zcl_math_service DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES zif_calculator.\nENDCLASS.\n\nCLASS zcl_math_service IMPLEMENTATION.\n  \" TODO: Implement zif_calculator~multiply\nENDCLASS.",
      "hints": [
        "In Java, you implement an interface method just by name: public int multiply(...). In ABAP, you must write METHOD zif_calculator~multiply.",
        "The tilde ~ connects the interface name to the method name to avoid collisions."
      ],
      "solution": "INTERFACE zif_calculator.\n  METHODS multiply\n    IMPORTING iv_a TYPE i iv_b TYPE i\n    RETURNING VALUE(rv_product) TYPE i.\nENDINTERFACE.\n\nCLASS zcl_math_service DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES zif_calculator.\nENDCLASS.\n\nCLASS zcl_math_service IMPLEMENTATION.\n  METHOD zif_calculator~multiply.\n    rv_product = iv_a * iv_b.\n  ENDMETHOD.\nENDCLASS."
    },
    {
      "id": 10,
      "title": "Exercise 10 (Master Capstone): The Absolute Zero-to-Hero Foundation Engine",
      "difficulty": "Master Capstone",
      "isCapstone": true,
      "estimatedMinutes": 30,
      "prompt": "THE BIG ONE (PREREQUISITE CAPSTONE):\nSynthesize all foundational core ABAP mechanics from Level 0:\n1. Define custom structure ty_student with fields: student_id, name, exam_score, attendance_pct.\n2. Define internal table type tt_students.\n3. Populate an internal table lt_students with 4 records using VALUE #( ... ).\n4. Define a lean reporting structure ty_report_card with fields: student_id, name, status_letter.\n5. Loop through lt_students:\n   - Calculate grade: IF exam_score >= 80 AND attendance_pct >= 85 -> \"PASS WITH HONORS\", ELSEIF exam_score >= 60 -> \"STANDARD PASS\", ELSE -> \"NEEDS RETAKE\".\n   - Map student details using CORRESPONDING and append to a report table lt_reports.\n6. Use READ TABLE to find student with ID 'ST01' and verify their status.\n7. Output complete formatted summary using out->write( ) and string templates.\n8. 100% Clean Core compliant, zero classic Dynpro WRITE.",
      "starterCode": "\" DAY 0 MASTER CAPSTONE: Foundation Engine\nCLASS zcl_day0_foundation DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES if_oo_adt_classrun.\n\n    \" TODO: Define types ty_student, tt_students, ty_report_card, tt_report_card\nENDCLASS.\n\nCLASS zcl_day0_foundation IMPLEMENTATION.\n  METHOD if_oo_adt_classrun~main.\n    \" TODO: Build students table, loop, grade, map with CORRESPONDING, search with READ TABLE, and print report\n  ENDMETHOD.\nENDCLASS.",
      "hints": [
        "Use CORRESPONDING ty_report_card( s ) to map matching student_id and name fields.",
        "Use IF / ELSEIF / ELSE to compute status_letter."
      ],
      "solution": "CLASS zcl_day0_foundation DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES if_oo_adt_classrun.\n\n    TYPES: BEGIN OF ty_student,\n             student_id     TYPE string,\n             name           TYPE string,\n             exam_score     TYPE i,\n             attendance_pct TYPE i,\n           END OF ty_student,\n           tt_students TYPE STANDARD TABLE OF ty_student WITH EMPTY KEY,\n\n           BEGIN OF ty_report_card,\n             student_id    TYPE string,\n             name          TYPE string,\n             status_letter TYPE string,\n           END OF ty_report_card,\n           tt_report_card TYPE STANDARD TABLE OF ty_report_card WITH EMPTY KEY.\nENDCLASS.\n\nCLASS zcl_day0_foundation IMPLEMENTATION.\n  METHOD if_oo_adt_classrun~main.\n    \" 1. Initialize dataset\n    FINAL(lt_students) = VALUE tt_students(\n      ( student_id = 'ST01' name = 'Liam Vance'    exam_score = 92 attendance_pct = 95 )\n      ( student_id = 'ST02' name = 'Zoe Campbell'  exam_score = 74 attendance_pct = 88 )\n      ( student_id = 'ST03' name = 'Noah Patel'    exam_score = 55 attendance_pct = 60 )\n      ( student_id = 'ST04' name = 'Emma Fischer'  exam_score = 85 attendance_pct = 90 )\n    ).\n\n    DATA lt_reports TYPE tt_report_card.\n\n    \" 2. Loop and process\n    LOOP AT lt_students INTO FINAL(ls_s).\n      DATA(ls_report) = CORRESPONDING ty_report_card( ls_s ).\n\n      IF ls_s-exam_score >= 80 AND ls_s-attendance_pct >= 85.\n        ls_report-status_letter = 'PASS WITH HONORS'.\n      ELSEIF ls_s-exam_score >= 60.\n        ls_report-status_letter = 'STANDARD PASS'.\n      ELSE.\n        ls_report-status_letter = 'NEEDS RETAKE'.\n      ENDIF.\n\n      APPEND ls_report TO lt_reports.\n    ENDLOOP.\n\n    \" 3. Search single record\n    READ TABLE lt_reports WITH KEY student_id = 'ST01' INTO FINAL(ls_top_student).\n    IF sy-subrc = 0.\n      out->write( |Spotlight Student: { ls_top_student-name } achieved { ls_top_student-status_letter }| ).\n    ENDIF.\n\n    out->write( |=== COMPLETE STUDENT GRADE ROSTER ===| ).\n    out->write( lt_reports ).\n  ENDMETHOD.\nENDCLASS."
    }
  ],
  "day-1-modern-abap": [
    {
      "id": 1,
      "title": "Exercise 1: Basic Immutable Variable Declaration with FINAL",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "Declare an immutable variable `lv_company_code` with value \"1000\" and an immutable variable `lv_fiscal_year` with value \"2026\" using modern ABAP 7.57+ `FINAL(...)`. Print them to the console using string templates.",
      "starterCode": "\" Exercise 1: Declare immutable variables\n\" Requirement: Use FINAL(...) instead of classic DATA statements\n\nMETHOD if_oo_adt_classrun~main.\n  \" TODO: Declare lv_company_code as '1000' immutably\n  \" TODO: Declare lv_fiscal_year as '2026' immutably\n  \" TODO: Output to console using out->write( |Company: { ... } Year: { ... }| )\nENDMETHOD.",
      "hints": [
        "Write FINAL(lv_company_code) = '1000'.",
        "Write FINAL(lv_fiscal_year) = '2026'.",
        "Use string templates with pipes: out->write( |Company: { lv_company_code } Year: { lv_fiscal_year }| )."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_company_code) = '1000'.\n  FINAL(lv_fiscal_year)   = '2026'.\n\n  out->write( |Company: { lv_company_code } Year: { lv_fiscal_year }| ).\nENDMETHOD."
    },
    {
      "id": 2,
      "title": "Exercise 2: Safe Inline Declarations with DATA vs FINAL",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Create an immutable customer ID `FINAL(lv_customer_id) = 'CUST_001'`. Then create a mutable balance `DATA(lv_balance) = 500`. Add 250 to `lv_balance`, subtract 75, and output the final balance to the console.",
      "starterCode": "\" Exercise 2: Mutable vs Immutable State\nMETHOD if_oo_adt_classrun~main.\n  \" 1. Declare immutable customer ID with FINAL\n  \" 2. Declare mutable balance starting at 500 with DATA\n  \" 3. Update balance (+250, -75)\n  \" 4. Output customer ID and balance\nENDMETHOD.",
      "hints": [
        "Declare immutable state with FINAL(lv_customer_id) = 'CUST_001'.",
        "Declare mutable state with DATA(lv_balance) = 500.",
        "Update with lv_balance = lv_balance + 250 - 75."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_customer_id) = 'CUST_001'.\n  DATA(lv_balance)     = 500.\n\n  lv_balance = lv_balance + 250.\n  lv_balance = lv_balance - 75.\n\n  out->write( |Customer { lv_customer_id } final balance: { lv_balance }| ).\nENDMETHOD."
    },
    {
      "id": 3,
      "title": "Exercise 3: Constructing Internal Tables with VALUE #( )",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Construct an internal table of products `lt_products` with at least 3 rows (fields: id, name, price) directly at inline declaration using `VALUE #( ... )` without using `APPEND`.",
      "starterCode": "\" Exercise 3: Constructing Tables Inline\nTYPES: BEGIN OF ty_product,\n         id    TYPE string,\n         name  TYPE string,\n         price TYPE decfloat16,\n       END OF ty_product,\n       tt_products TYPE STANDARD TABLE OF ty_product WITH EMPTY KEY.\n\nMETHOD if_oo_adt_classrun~main.\n  \" TODO: Construct lt_products with 3 records using VALUE tt_products( ... )\n  \" Record 1: id 'P01', name 'Laptop', price 1200\n  \" Record 2: id 'P02', name 'Monitor', price 350\n  \" Record 3: id 'P03', name 'Keyboard', price 95\n  \" Output table count with lines( lt_products )\nENDMETHOD.",
      "hints": [
        "Write DATA(lt_products) = VALUE tt_products( ( id = 'P01' name = 'Laptop' price = 1200 ) ... ).",
        "Each table row in VALUE #( ) must be wrapped in its own pair of parentheses ( ... ).",
        "Use out->write( lines( lt_products ) )."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  TYPES: BEGIN OF ty_product,\n           id    TYPE string,\n           name  TYPE string,\n           price TYPE decfloat16,\n         END OF ty_product,\n         tt_products TYPE STANDARD TABLE OF ty_product WITH EMPTY KEY.\n\n  FINAL(lt_products) = VALUE tt_products(\n    ( id = 'P01' name = 'Laptop'   price = 1200 )\n    ( id = 'P02' name = 'Monitor'  price = 350 )\n    ( id = 'P03' name = 'Keyboard' price = 95 )\n  ).\n\n  out->write( |Total products created: { lines( lt_products ) }| ).\nENDMETHOD."
    },
    {
      "id": 4,
      "title": "Exercise 4: Appending to Tables without Overwriting using BASE",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "You have an existing internal table `lt_logs` with 2 entries. Append a 3rd entry using `VALUE #( BASE lt_logs ( ... ) )` to prove that `BASE` prevents wiping the table contents.",
      "starterCode": "\" Exercise 4: Preserving Table History with BASE\nTYPES: tt_strings TYPE STANDARD TABLE OF string WITH EMPTY KEY.\n\nMETHOD if_oo_adt_classrun~main.\n  DATA(lt_logs) = VALUE tt_strings( ( 'Server Started' ) ( 'DB Connected' ) ).\n\n  \" TODO: Add 'Ready for Requests' to lt_logs using BASE without losing the first two\n  \" TODO: Output all lines to console\nENDMETHOD.",
      "hints": [
        "Write lt_logs = VALUE #( BASE lt_logs ( 'Ready for Requests' ) ).",
        "If you forget BASE, lt_logs will be overwritten and only have 1 row!"
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  TYPES tt_strings TYPE STANDARD TABLE OF string WITH EMPTY KEY.\n\n  DATA(lt_logs) = VALUE tt_strings(\n    ( 'Server Started' )\n    ( 'DB Connected' )\n  ).\n\n  lt_logs = VALUE #( BASE lt_logs ( 'Ready for Requests' ) ).\n\n  out->write( lt_logs ).\nENDMETHOD."
    },
    {
      "id": 5,
      "title": "Exercise 5: Functional Table Filtering with FOR ... WHERE",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Given a table of orders with fields `order_id`, `amount`, and `status`, use `VALUE #( FOR order IN lt_orders WHERE ( status = 'CONFIRMED' ) ... )` to extract only confirmed orders into a new table.",
      "starterCode": "\" Exercise 5: Functional Filtering\nTYPES: BEGIN OF ty_order,\n         order_id TYPE string,\n         amount   TYPE decfloat16,\n         status   TYPE string,\n       END OF ty_order,\n       tt_orders TYPE STANDARD TABLE OF ty_order WITH EMPTY KEY.\n\nMETHOD if_oo_adt_classrun~main.\n  FINAL(lt_orders) = VALUE tt_orders(\n    ( order_id = 'ORD_01' amount = 250 status = 'CONFIRMED' )\n    ( order_id = 'ORD_02' amount = 100 status = 'CANCELLED' )\n    ( order_id = 'ORD_03' amount = 890 status = 'CONFIRMED' )\n  ).\n\n  \" TODO: Extract only confirmed orders into FINAL(lt_confirmed) using FOR ... WHERE\n  \" Output count of confirmed orders\nENDMETHOD.",
      "hints": [
        "Write FINAL(lt_confirmed) = VALUE tt_orders( FOR wa IN lt_orders WHERE ( status = 'CONFIRMED' ) ( wa ) ).",
        "No LOOP AT ... APPEND is needed!"
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  TYPES: BEGIN OF ty_order,\n           order_id TYPE string,\n           amount   TYPE decfloat16,\n           status   TYPE string,\n         END OF ty_order,\n         tt_orders TYPE STANDARD TABLE OF ty_order WITH EMPTY KEY.\n\n  FINAL(lt_orders) = VALUE tt_orders(\n    ( order_id = 'ORD_01' amount = 250 status = 'CONFIRMED' )\n    ( order_id = 'ORD_02' amount = 100 status = 'CANCELLED' )\n    ( order_id = 'ORD_03' amount = 890 status = 'CONFIRMED' )\n  ).\n\n  FINAL(lt_confirmed) = VALUE tt_orders(\n    FOR wa IN lt_orders WHERE ( status = 'CONFIRMED' )\n    ( wa )\n  ).\n\n  out->write( |Confirmed Orders: { lines( lt_confirmed ) }| ).\nENDMETHOD."
    },
    {
      "id": 6,
      "title": "Exercise 6: Data Transformation with FOR ... LET ... IN",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Transform a table of prices in USD into a table of formatted line items with tax included. Use `LET lv_tax = item-price * '0.20' IN` inside the `VALUE #( FOR item IN lt_items ... )` comprehension.",
      "starterCode": "\" Exercise 6: Transformation with LET expressions\nTYPES: BEGIN OF ty_item,\n         item_id TYPE string,\n         price   TYPE decfloat16,\n       END OF ty_item,\n       tt_items TYPE STANDARD TABLE OF ty_item WITH EMPTY KEY,\n\n       BEGIN OF ty_invoice_item,\n         item_id    TYPE string,\n         net_price  TYPE decfloat16,\n         tax_amount TYPE decfloat16,\n         total      TYPE decfloat16,\n       END OF ty_invoice_item,\n       tt_invoice_items TYPE STANDARD TABLE OF ty_invoice_item WITH EMPTY KEY.\n\nMETHOD if_oo_adt_classrun~main.\n  FINAL(lt_items) = VALUE tt_items(\n    ( item_id = 'A1' price = 100 )\n    ( item_id = 'B2' price = 250 )\n  ).\n\n  \" TODO: Construct FINAL(lt_invoice) using FOR ... LET lv_tax = item-price * '0.20' IN ( ... )\nENDMETHOD.",
      "hints": [
        "Syntax: FOR item IN lt_items LET lv_tax = item-price * '0.20' IN ( item_id = item-item_id net_price = item-price tax_amount = lv_tax total = item-price + lv_tax )"
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  TYPES: BEGIN OF ty_item,\n           item_id TYPE string,\n           price   TYPE decfloat16,\n         END OF ty_item,\n         tt_items TYPE STANDARD TABLE OF ty_item WITH EMPTY KEY,\n\n         BEGIN OF ty_invoice_item,\n           item_id    TYPE string,\n           net_price  TYPE decfloat16,\n           tax_amount TYPE decfloat16,\n           total      TYPE decfloat16,\n         END OF ty_invoice_item,\n         tt_invoice_items TYPE STANDARD TABLE OF ty_invoice_item WITH EMPTY KEY.\n\n  FINAL(lt_items) = VALUE tt_items(\n    ( item_id = 'A1' price = 100 )\n    ( item_id = 'B2' price = 250 )\n  ).\n\n  FINAL(lt_invoice) = VALUE tt_invoice_items(\n    FOR item IN lt_items\n    LET lv_tax = item-price * '0.20'\n    IN ( item_id    = item-item_id\n         net_price  = item-price\n         tax_amount = lv_tax\n         total      = item-price + lv_tax )\n  ).\n\n  out->write( lt_invoice ).\nENDMETHOD."
    },
    {
      "id": 7,
      "title": "Exercise 7: Conditional Branching with COND #( )",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Write a conditional expression `COND string( ... )` that evaluates a customer's credit score: >= 750 returns \"Tier 1: VIP\", >= 600 returns \"Tier 2: Standard\", otherwise \"Tier 3: Pre-payment Required\".",
      "starterCode": "\" Exercise 7: Modern Conditional Expressions\nMETHOD if_oo_adt_classrun~main.\n  FINAL(lv_credit_score) = 720.\n\n  \" TODO: Evaluate lv_credit_score using COND string( ... )\n  \" Store result in FINAL(lv_tier_label)\n  \" Output result\nENDMETHOD.",
      "hints": [
        "Use COND string( WHEN lv_credit_score >= 750 THEN 'Tier 1: VIP' WHEN lv_credit_score >= 600 THEN 'Tier 2: Standard' ELSE 'Tier 3: Pre-payment Required' )."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_credit_score) = 720.\n\n  FINAL(lv_tier_label) = COND string(\n    WHEN lv_credit_score >= 750 THEN 'Tier 1: VIP'\n    WHEN lv_credit_score >= 600 THEN 'Tier 2: Standard'\n    ELSE 'Tier 3: Pre-payment Required'\n  ).\n\n  out->write( |Customer Credit Tier: { lv_tier_label }| ).\nENDMETHOD."
    },
    {
      "id": 8,
      "title": "Exercise 8: Strict Enumeration Mapping with SWITCH #( )",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Map single-character flight status codes ('N' -> \"New\", 'B' -> \"Booked\", 'X' -> \"Cancelled\") into full English strings using `SWITCH string( ... )` with `THROW cx_sy_itab_line_not_found( )` or fallback `ELSE \"Unknown Status\"`.",
      "starterCode": "\" Exercise 8: SWITCH constructor expression\nMETHOD if_oo_adt_classrun~main.\n  FINAL(lv_code) = 'B'.\n\n  \" TODO: Map lv_code using SWITCH string( lv_code ... )\n  \" Output full status\nENDMETHOD.",
      "hints": [
        "Write SWITCH string( lv_code WHEN 'N' THEN 'New' WHEN 'B' THEN 'Booked' WHEN 'X' THEN 'Cancelled' ELSE 'Unknown Status' )."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_code) = 'B'.\n\n  FINAL(lv_status_text) = SWITCH string( lv_code\n    WHEN 'N' THEN 'New'\n    WHEN 'B' THEN 'Booked'\n    WHEN 'X' THEN 'Cancelled'\n    ELSE 'Unknown Status'\n  ).\n\n  out->write( |Flight Status: { lv_status_text }| ).\nENDMETHOD."
    },
    {
      "id": 9,
      "title": "Exercise 9: Declarative Aggregation with REDUCE #( )",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 15,
      "prompt": "Given a table of employee bonus amounts, compute the total bonus sum and the average bonus in a single declarative block using `REDUCE decfloat16( ... )` without any `LOOP` or `APPEND`.",
      "starterCode": "\" Exercise 9: REDUCE Table Aggregation\nTYPES: tt_amounts TYPE STANDARD TABLE OF decfloat16 WITH EMPTY KEY.\n\nMETHOD if_oo_adt_classrun~main.\n  FINAL(lt_bonuses) = VALUE tt_amounts( ( 1500 ) ( 3200 ) ( 4500 ) ( 2800 ) ).\n\n  \" TODO: Calculate total sum using REDUCE decfloat16( INIT sum = 0 FOR val IN lt_bonuses NEXT sum = sum + val )\n  \" TODO: Calculate average with COND\n  \" Output sum and average\nENDMETHOD.",
      "hints": [
        "Syntax: REDUCE decfloat16( INIT sum = CONV decfloat16( 0 ) FOR b IN lt_bonuses NEXT sum = sum + b )",
        "Calculate average: sum / lines( lt_bonuses )"
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  TYPES tt_amounts TYPE STANDARD TABLE OF decfloat16 WITH EMPTY KEY.\n\n  FINAL(lt_bonuses) = VALUE tt_amounts( ( 1500 ) ( 3200 ) ( 4500 ) ( 2800 ) ).\n\n  FINAL(lv_total) = REDUCE decfloat16(\n    INIT sum = CONV decfloat16( 0 )\n    FOR b IN lt_bonuses\n    NEXT sum = sum + b\n  ).\n\n  FINAL(lv_count) = lines( lt_bonuses ).\n  FINAL(lv_avg)   = COND decfloat16( WHEN lv_count > 0 THEN lv_total / lv_count ELSE 0 ).\n\n  out->write( |Total Bonuses: { lv_total }, Average Bonus: { lv_avg }| ).\nENDMETHOD."
    },
    {
      "id": 10,
      "title": "Exercise 10 (Master Capstone): Enterprise High-Volume Payroll & Sales Reconciliation Engine",
      "difficulty": "Master Capstone",
      "isCapstone": true,
      "estimatedMinutes": 30,
      "prompt": "THE BIG ONE (COMPREHENSIVE CHAPTER 1 CAPSTONE):\nSynthesize all Chapter 1 concepts into an Enterprise Reconciliation Engine:\n1. Input table `lt_sales_reps` containing: `rep_id`, `name`, `region`, `quarterly_sales`, `is_active`.\n2. Filter active reps who achieved sales > 100,000 using `FOR ... WHERE`.\n3. Compute their commission tier using `COND`:\n   - Sales >= 250,000 -> 15% commission + 'Diamond Club'\n   - Sales >= 150,000 -> 10% commission + 'Gold Club'\n   - Otherwise -> 5% commission + 'Silver Club'\n4. Map regional code ('NA' -> 'North America', 'EU' -> 'Europe', 'AP' -> 'Asia Pacific') using `SWITCH`.\n5. Aggregate total qualified commissions and average sales using `REDUCE`.\n6. Enforce 100% Clean Core: all variables must be declared with `FINAL`, 0 classic WRITE statements, 0 LOOP/APPEND, and output via `out->write( )`.",
      "starterCode": "\" DAY 1 MASTER CAPSTONE: High-Volume Sales & Commission Engine\nCLASS zcl_day1_capstone DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES if_oo_adt_classrun.\n\n    TYPES: BEGIN OF ty_rep,\n             rep_id          TYPE string,\n             name            TYPE string,\n             region          TYPE string,\n             quarterly_sales TYPE decfloat16,\n             is_active       TYPE abap_bool,\n           END OF ty_rep,\n           tt_reps TYPE STANDARD TABLE OF ty_rep WITH EMPTY KEY,\n\n           BEGIN OF ty_commission_report,\n             rep_id          TYPE string,\n             name            TYPE string,\n             region_name     TYPE string,\n             sales           TYPE decfloat16,\n             commission_rate TYPE decfloat16,\n             commission_amt  TYPE decfloat16,\n             club_tier       TYPE string,\n           END OF ty_commission_report,\n           tt_commission_report TYPE STANDARD TABLE OF ty_commission_report WITH EMPTY KEY.\nENDCLASS.\n\nCLASS zcl_day1_capstone IMPLEMENTATION.\n  METHOD if_oo_adt_classrun~main.\n    \" 1. Initialize test dataset\n    FINAL(lt_reps) = VALUE tt_reps(\n      ( rep_id = 'R101' name = 'Sarah Chen'    region = 'NA' quarterly_sales = 320000 is_active = abap_true )\n      ( rep_id = 'R102' name = 'Marcus Weber'  region = 'EU' quarterly_sales = 180000 is_active = abap_true )\n      ( rep_id = 'R103' name = 'Kenji Sato'    region = 'AP' quarterly_sales = 95000  is_active = abap_true )\n      ( rep_id = 'R104' name = 'Elena Rossi'   region = 'EU' quarterly_sales = 290000 is_active = abap_false )\n      ( rep_id = 'R105' name = 'David Miller'  region = 'NA' quarterly_sales = 140000 is_active = abap_true )\n    ).\n\n    \" TODO: Build FINAL(lt_report) using FOR ... WHERE ( is_active = abap_true AND quarterly_sales > 100000 )\n    \" Apply COND for rate and club tier, SWITCH for region\n    \" Compute total commission using REDUCE\n    \" Output results via out->write( )\n  ENDMETHOD.\nENDCLASS.",
      "hints": [
        "In FOR ... LET lv_rate = COND #( ... ) lv_comm = rep-quarterly_sales * lv_rate IN ( ... )",
        "Use SWITCH string( rep-region WHEN 'NA' THEN 'North America' ... )",
        "Compute total commission with REDUCE decfloat16( INIT sum = CONV decfloat16( 0 ) FOR line IN lt_report NEXT sum = sum + line-commission_amt )"
      ],
      "solution": "CLASS zcl_day1_capstone DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES if_oo_adt_classrun.\n\n    TYPES: BEGIN OF ty_rep,\n             rep_id          TYPE string,\n             name            TYPE string,\n             region          TYPE string,\n             quarterly_sales TYPE decfloat16,\n             is_active       TYPE abap_bool,\n           END OF ty_rep,\n           tt_reps TYPE STANDARD TABLE OF ty_rep WITH EMPTY KEY,\n\n           BEGIN OF ty_commission_report,\n             rep_id          TYPE string,\n             name            TYPE string,\n             region_name     TYPE string,\n             sales           TYPE decfloat16,\n             commission_rate TYPE decfloat16,\n             commission_amt  TYPE decfloat16,\n             club_tier       TYPE string,\n           END OF ty_commission_report,\n           tt_commission_report TYPE STANDARD TABLE OF ty_commission_report WITH EMPTY KEY.\nENDCLASS.\n\nCLASS zcl_day1_capstone IMPLEMENTATION.\n  METHOD if_oo_adt_classrun~main.\n    FINAL(lt_reps) = VALUE tt_reps(\n      ( rep_id = 'R101' name = 'Sarah Chen'   region = 'NA' quarterly_sales = 320000 is_active = abap_true )\n      ( rep_id = 'R102' name = 'Marcus Weber' region = 'EU' quarterly_sales = 180000 is_active = abap_true )\n      ( rep_id = 'R103' name = 'Kenji Sato'   region = 'AP' quarterly_sales = 95000  is_active = abap_true )\n      ( rep_id = 'R104' name = 'Elena Rossi'  region = 'EU' quarterly_sales = 290000 is_active = abap_false )\n      ( rep_id = 'R105' name = 'David Miller' region = 'NA' quarterly_sales = 140000 is_active = abap_true )\n    ).\n\n    FINAL(lt_report) = VALUE tt_commission_report(\n      FOR rep IN lt_reps\n      WHERE ( is_active = abap_true AND quarterly_sales > 100000 )\n      LET lv_rate = COND decfloat16(\n            WHEN rep-quarterly_sales >= 250000 THEN '0.15'\n            WHEN rep-quarterly_sales >= 150000 THEN '0.10'\n            ELSE '0.05' )\n          lv_tier = COND string(\n            WHEN rep-quarterly_sales >= 250000 THEN 'Diamond Club'\n            WHEN rep-quarterly_sales >= 150000 THEN 'Gold Club'\n            ELSE 'Silver Club' )\n          lv_region_desc = SWITCH string( rep-region\n            WHEN 'NA' THEN 'North America'\n            WHEN 'EU' THEN 'Europe'\n            WHEN 'AP' THEN 'Asia Pacific'\n            ELSE 'Global Other' )\n      IN ( rep_id          = rep-rep_id\n           name            = rep-name\n           region_name     = lv_region_desc\n           sales           = rep-quarterly_sales\n           commission_rate = lv_rate\n           commission_amt  = rep-quarterly_sales * lv_rate\n           club_tier       = lv_tier )\n    ).\n\n    FINAL(lv_total_comm) = REDUCE decfloat16(\n      INIT sum = CONV decfloat16( 0 )\n      FOR item IN lt_report\n      NEXT sum = sum + item-commission_amt\n    ).\n\n    FINAL(lv_avg_sales) = COND decfloat16(\n      WHEN lines( lt_report ) > 0\n      THEN REDUCE decfloat16( INIT s = CONV decfloat16( 0 ) FOR it IN lt_report NEXT s = s + it-sales ) / lines( lt_report )\n      ELSE 0\n    ).\n\n    out->write( |=== SAP CLEAN CORE COMMISSION REPORT ===| ).\n    out->write( lt_report ).\n    out->write( |Total Commission Paid: { lv_total_comm }| ).\n    out->write( |Average Sales of Qualifying Reps: { lv_avg_sales }| ).\n  ENDMETHOD.\nENDCLASS."
    }
  ],
  "day-2-oop-abap": [
    {
      "id": 1,
      "title": "Exercise 1: Basic Class Definition & Public Method",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "Define a class `zcl_tax_calculator` with a public method `calculate_tax` that accepts `iv_amount TYPE decfloat16` and returns `rv_tax TYPE decfloat16` (tax rate is 18%).",
      "starterCode": "\" Exercise 1: Class Definition & Method\nCLASS zcl_tax_calculator DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    \" TODO: Declare calculate_tax method\nENDCLASS.\n\nCLASS zcl_tax_calculator IMPLEMENTATION.\n  \" TODO: Implement calculate_tax (tax = amount * 0.18)\nENDCLASS.",
      "hints": [
        "In PUBLIC SECTION: METHODS calculate_tax IMPORTING iv_amount TYPE decfloat16 RETURNING VALUE(rv_tax) TYPE decfloat16.",
        "In IMPLEMENTATION: rv_tax = iv_amount * '0.18'."
      ],
      "solution": "CLASS zcl_tax_calculator DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    METHODS calculate_tax\n      IMPORTING iv_amount TYPE decfloat16\n      RETURNING VALUE(rv_tax) TYPE decfloat16.\nENDCLASS.\n\nCLASS zcl_tax_calculator IMPLEMENTATION.\n  METHOD calculate_tax.\n    rv_tax = iv_amount * '0.18'.\n  ENDMETHOD.\nENDCLASS."
    },
    {
      "id": 2,
      "title": "Exercise 2: Class Constructor & Instance Attributes",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Add a constructor to `zcl_tax_calculator` that receives a configurable tax rate `iv_rate TYPE decfloat16` and stores it in private attribute `mv_rate`.",
      "starterCode": "\" Exercise 2: Class Constructor\nCLASS zcl_tax_calculator DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    METHODS constructor IMPORTING iv_rate TYPE decfloat16.\n    METHODS calculate_tax IMPORTING iv_amount TYPE decfloat16 RETURNING VALUE(rv_tax) TYPE decfloat16.\n  PRIVATE SECTION.\n    \" TODO: Declare mv_rate attribute\nENDCLASS.\n\nCLASS zcl_tax_calculator IMPLEMENTATION.\n  \" TODO: Implement constructor and calculate_tax\nENDCLASS.",
      "hints": [
        "mv_rate TYPE decfloat16 in PRIVATE SECTION.",
        "In constructor: mv_rate = iv_rate.",
        "In calculate_tax: rv_tax = iv_amount * mv_rate."
      ],
      "solution": "CLASS zcl_tax_calculator DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    METHODS constructor IMPORTING iv_rate TYPE decfloat16.\n    METHODS calculate_tax\n      IMPORTING iv_amount TYPE decfloat16\n      RETURNING VALUE(rv_tax) TYPE decfloat16.\n  PRIVATE SECTION.\n    DATA mv_rate TYPE decfloat16.\nENDCLASS.\n\nCLASS zcl_tax_calculator IMPLEMENTATION.\n  METHOD constructor.\n    mv_rate = iv_rate.\n  ENDMETHOD.\n\n  METHOD calculate_tax.\n    rv_tax = iv_amount * mv_rate.\n  ENDMETHOD.\nENDCLASS."
    },
    {
      "id": 3,
      "title": "Exercise 3: Class-Based Exception Definition (CX_STATIC_CHECK)",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Create a custom exception class `zcx_invalid_amount` inheriting from `cx_static_check`. Raise this exception in `calculate_tax` if `iv_amount <= 0`.",
      "starterCode": "\" Exercise 3: Custom Exception\nCLASS zcx_invalid_amount DEFINITION INHERITING FROM cx_static_check.\nENDCLASS.\nCLASS zcx_invalid_amount IMPLEMENTATION.\nENDCLASS.\n\n\" TODO: Update calculate_tax to RAISING zcx_invalid_amount and RAISE EXCEPTION TYPE zcx_invalid_amount IF iv_amount <= 0",
      "hints": [
        "Add RAISING zcx_invalid_amount to the method signature.",
        "IF iv_amount <= 0. RAISE EXCEPTION TYPE zcx_invalid_amount. ENDIF."
      ],
      "solution": "CLASS zcx_invalid_amount DEFINITION INHERITING FROM cx_static_check.\nENDCLASS.\nCLASS zcx_invalid_amount IMPLEMENTATION.\nENDCLASS.\n\nCLASS zcl_tax_calculator DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    METHODS calculate_tax\n      IMPORTING iv_amount TYPE decfloat16\n      RETURNING VALUE(rv_tax) TYPE decfloat16\n      RAISING   zcx_invalid_amount.\nENDCLASS.\n\nCLASS zcl_tax_calculator IMPLEMENTATION.\n  METHOD calculate_tax.\n    IF iv_amount <= 0.\n      RAISE EXCEPTION TYPE zcx_invalid_amount.\n    ENDIF.\n    rv_tax = iv_amount * '0.18'.\n  ENDMETHOD.\nENDCLASS."
    },
    {
      "id": 4,
      "title": "Exercise 4: TRY ... CATCH Handling & Error Logging",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Instantiate `zcl_tax_calculator` and invoke `calculate_tax( -50 )` inside a `TRY ... CATCH zcx_invalid_amount INTO DATA(lx_error)` block. Output an error message when caught.",
      "starterCode": "\" Exercise 4: TRY/CATCH error handling\nMETHOD if_oo_adt_classrun~main.\n  FINAL(lo_calc) = NEW zcl_tax_calculator( ).\n\n  \" TODO: Wrap calculate_tax( -50 ) inside TRY ... CATCH zcx_invalid_amount INTO DATA(lx_err)\n  \" Output: out->write( 'Caught expected negative amount error' )\nENDMETHOD.",
      "hints": [
        "TRY. lo_calc->calculate_tax( -50 ). CATCH zcx_invalid_amount INTO DATA(lx_err). out->write( 'Error caught successfully' ). ENDTRY."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  FINAL(lo_calc) = NEW zcl_tax_calculator( ).\n\n  TRY.\n      FINAL(lv_tax) = lo_calc->calculate_tax( -50 ).\n      out->write( |Tax: { lv_tax }| ).\n    CATCH zcx_invalid_amount INTO DATA(lx_err).\n      out->write( |Caught expected error: Invalid amount supplied.| ).\n  ENDTRY.\nENDMETHOD."
    },
    {
      "id": 5,
      "title": "Exercise 5: Interface Segregation (zif_discount_strategy)",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Define an interface `zif_discount_strategy` with method `apply_discount`. Create two implementations: `zcl_vip_discount` (20% off) and `zcl_standard_discount` (5% off).",
      "starterCode": "\" Exercise 5: Interface Polymorphism\nINTERFACE zif_discount_strategy.\n  \" TODO: Declare apply_discount IMPORTING iv_price RETURNING VALUE(rv_price)\nENDINTERFACE.\n\n\" TODO: Implement zcl_vip_discount and zcl_standard_discount",
      "hints": [
        "INTERFACE: METHODS apply_discount IMPORTING iv_price TYPE decfloat16 RETURNING VALUE(rv_price) TYPE decfloat16.",
        "In class: INTERFACES zif_discount_strategy.",
        "In implementation: METHOD zif_discount_strategy~apply_discount."
      ],
      "solution": "INTERFACE zif_discount_strategy.\n  METHODS apply_discount\n    IMPORTING iv_price TYPE decfloat16\n    RETURNING VALUE(rv_price) TYPE decfloat16.\nENDINTERFACE.\n\nCLASS zcl_vip_discount DEFINITION CREATE PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES zif_discount_strategy.\nENDCLASS.\n\nCLASS zcl_vip_discount IMPLEMENTATION.\n  METHOD zif_discount_strategy~apply_discount.\n    rv_price = iv_price * '0.80'.\n  ENDMETHOD.\nENDCLASS.\n\nCLASS zcl_standard_discount DEFINITION CREATE PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES zif_discount_strategy.\nENDCLASS.\n\nCLASS zcl_standard_discount IMPLEMENTATION.\n  METHOD zif_discount_strategy~apply_discount.\n    rv_price = iv_price * '0.95'.\n  ENDMETHOD.\nENDCLASS."
    },
    {
      "id": 6,
      "title": "Exercise 6: Modern String Templates & Formatting (|...{ ... }...|)",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Format an invoice line item using string templates with embedded expressions: customer name, currency symbol, amount with 2 decimal places, and date formatted as ISO.",
      "starterCode": "\" Exercise 6: String Templates\nMETHOD if_oo_adt_classrun~main.\n  FINAL(lv_customer) = 'Global Corp'.\n  FINAL(lv_amount)   = CONV decfloat16( '1234567.89' ).\n  FINAL(lv_date)     = cl_abap_context_info=>get_system_date( ).\n\n  \" TODO: Build formatted string template with pipes | ... |\n  \" Output using out->write( )\nENDMETHOD.",
      "hints": [
        "Write |Customer: { lv_customer } | && |Amount: { lv_amount NUMBER = USER } | && |Date: { lv_date DATE = ISO }|"
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_customer) = 'Global Corp'.\n  FINAL(lv_amount)   = CONV decfloat16( '1234567.89' ).\n  FINAL(lv_date)     = cl_abap_context_info=>get_system_date( ).\n\n  FINAL(lv_formatted) = |Invoice for: { lv_customer } | &&\n                        |Total: { lv_amount NUMBER = USER } USD | &&\n                        |Created On: { lv_date DATE = ISO }|.\n\n  out->write( lv_formatted ).\nENDMETHOD."
    },
    {
      "id": 7,
      "title": "Exercise 7: Writing Your First ABAP Unit Test (assert_equals)",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Write an ABAP Unit test class `ltcl_tax_test` with method `test_normal_tax` verifying that `calculate_tax( 100 )` equals `18` using `cl_abap_unit_assert=>assert_equals`.",
      "starterCode": "\" Exercise 7: First ABAP Unit Test\nCLASS ltcl_tax_test DEFINITION FINAL FOR TESTING\n  DURATION SHORT\n  RISK LEVEL HARMLESS.\n  PRIVATE SECTION.\n    METHODS test_normal_tax FOR TESTING.\nENDCLASS.\n\nCLASS ltcl_tax_test IMPLEMENTATION.\n  \" TODO: Instantiate zcl_tax_calculator, call calculate_tax( 100 ), assert equals 18\nENDCLASS.",
      "hints": [
        "Call cl_abap_unit_assert=>assert_equals( exp = CONV decfloat16( 18 ) act = lv_act msg = 'Tax calculation mismatch' )."
      ],
      "solution": "CLASS ltcl_tax_test DEFINITION FINAL FOR TESTING\n  DURATION SHORT\n  RISK LEVEL HARMLESS.\n  PRIVATE SECTION.\n    METHODS test_normal_tax FOR TESTING.\nENDCLASS.\n\nCLASS ltcl_tax_test IMPLEMENTATION.\n  METHOD test_normal_tax.\n    FINAL(lo_cut) = NEW zcl_tax_calculator( ).\n    FINAL(lv_act) = lo_cut->calculate_tax( 100 ).\n\n    cl_abap_unit_assert=>assert_equals(\n      act = lv_act\n      exp = CONV decfloat16( 18 )\n      msg = 'Tax for 100 at 18% should be exactly 18'\n    ).\n  ENDMETHOD.\nENDCLASS."
    },
    {
      "id": 8,
      "title": "Exercise 8: ABAP Unit Test Fixtures (SETUP & TEARDOWN)",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Implement `SETUP` and `TEARDOWN` methods in an ABAP Unit test class to instantiate and clean up the Class Under Test (CUT) before and after each test execution.",
      "starterCode": "\" Exercise 8: Test Fixtures\nCLASS ltcl_fixture_test DEFINITION FINAL FOR TESTING DURATION SHORT RISK LEVEL HARMLESS.\n  PRIVATE SECTION.\n    DATA mo_cut TYPE REF TO zcl_tax_calculator.\n    METHODS setup.\n    METHODS teardown.\n    METHODS test_calculation FOR TESTING.\nENDCLASS.\n\nCLASS ltcl_fixture_test IMPLEMENTATION.\n  \" TODO: Implement setup, teardown, test_calculation\nENDCLASS.",
      "hints": [
        "In setup: mo_cut = NEW zcl_tax_calculator( ).",
        "In teardown: CLEAR mo_cut.",
        "In test: use mo_cut->calculate_tax( ... )"
      ],
      "solution": "CLASS ltcl_fixture_test DEFINITION FINAL FOR TESTING DURATION SHORT RISK LEVEL HARMLESS.\n  PRIVATE SECTION.\n    DATA mo_cut TYPE REF TO zcl_tax_calculator.\n    METHODS setup.\n    METHODS teardown.\n    METHODS test_calculation FOR TESTING.\nENDCLASS.\n\nCLASS ltcl_fixture_test IMPLEMENTATION.\n  METHOD setup.\n    mo_cut = NEW zcl_tax_calculator( ).\n  ENDMETHOD.\n\n  METHOD teardown.\n    CLEAR mo_cut.\n  ENDMETHOD.\n\n  METHOD test_calculation.\n    FINAL(lv_result) = mo_cut->calculate_tax( 200 ).\n    cl_abap_unit_assert=>assert_equals( act = lv_result exp = CONV decfloat16( 36 ) ).\n  ENDMETHOD.\nENDCLASS."
    },
    {
      "id": 9,
      "title": "Exercise 9: Testing Negative Scenarios (assert_bound & fail)",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 15,
      "prompt": "Write an ABAP Unit test `test_negative_amount_raises` that calls `calculate_tax( -10 )`, asserts that `zcx_invalid_amount` is thrown, and calls `cl_abap_unit_assert=>fail` if no exception occurs.",
      "starterCode": "\" Exercise 9: Negative Scenario Testing\nCLASS ltcl_exception_test DEFINITION FINAL FOR TESTING DURATION SHORT RISK LEVEL HARMLESS.\n  PRIVATE SECTION.\n    METHODS test_negative_amount_raises FOR TESTING.\nENDCLASS.\n\nCLASS ltcl_exception_test IMPLEMENTATION.\n  \" TODO: Verify that negative amount raises zcx_invalid_amount\nENDCLASS.",
      "hints": [
        "TRY. lo_cut->calculate_tax( -10 ). cl_abap_unit_assert=>fail( 'Expected exception not raised' ). CATCH zcx_invalid_amount. \" Success ENDTRY."
      ],
      "solution": "CLASS ltcl_exception_test DEFINITION FINAL FOR TESTING DURATION SHORT RISK LEVEL HARMLESS.\n  PRIVATE SECTION.\n    METHODS test_negative_amount_raises FOR TESTING.\nENDCLASS.\n\nCLASS ltcl_exception_test IMPLEMENTATION.\n  METHOD test_negative_amount_raises.\n    FINAL(lo_cut) = NEW zcl_tax_calculator( ).\n    TRY.\n        lo_cut->calculate_tax( -10 ).\n        cl_abap_unit_assert=>fail( 'calculate_tax must raise zcx_invalid_amount for negative input' ).\n      CATCH zcx_invalid_amount.\n        \" Test passed: expected exception caught\n    ENDTRY.\n  ENDMETHOD.\nENDCLASS."
    },
    {
      "id": 10,
      "title": "Exercise 10 (Master Capstone): Bank Account Transaction & Ledger Processor with 100% ABAP Unit Suite",
      "difficulty": "Master Capstone",
      "isCapstone": true,
      "estimatedMinutes": 30,
      "prompt": "THE BIG ONE (COMPREHENSIVE CHAPTER 2 CAPSTONE):\nDesign and test an Enterprise Bank Account Transaction Processor:\n1. Custom Exception `zcx_insufficient_funds` inheriting from `cx_static_check` with attribute `mv_deficit`.\n2. Interface `zif_bank_account` with methods:\n   - `deposit( iv_amount )`\n   - `withdraw( iv_amount ) RAISING zcx_insufficient_funds`\n   - `get_balance( ) RETURNING VALUE(rv_balance)`\n3. Class `zcl_checking_account` implementing `zif_bank_account` with an overdraft limit (overdraft is up to -500).\n4. Full ABAP Unit Test Suite (`ltcl_bank_test`) testing:\n   - Initial balance is zero.\n   - Successful deposit increments balance.\n   - Normal withdrawal succeeds.\n   - Withdrawal beyond overdraft limit raises `zcx_insufficient_funds` with correct deficit.\n5. 100% Clean Core, immutable variables where appropriate, no classic WRITE.",
      "starterCode": "\" DAY 2 MASTER CAPSTONE: Bank Account & Unit Test Suite\nCLASS zcx_insufficient_funds DEFINITION INHERITING FROM cx_static_check.\n  PUBLIC SECTION.\n    DATA mv_deficit TYPE decfloat16.\n    METHODS constructor IMPORTING iv_deficit TYPE decfloat16 OPTIONAL.\nENDCLASS.\nCLASS zcx_insufficient_funds IMPLEMENTATION.\n  METHOD constructor.\n    super->constructor( ).\n    mv_deficit = iv_deficit.\n  ENDMETHOD.\nENDCLASS.\n\nINTERFACE zif_bank_account.\n  METHODS deposit  IMPORTING iv_amount TYPE decfloat16.\n  METHODS withdraw IMPORTING iv_amount TYPE decfloat16 RAISING zcx_insufficient_funds.\n  METHODS get_balance RETURNING VALUE(rv_balance) TYPE decfloat16.\nENDINTERFACE.\n\n\" TODO: Implement zcl_checking_account and ltcl_bank_test",
      "hints": [
        "In withdraw: IF mv_balance - iv_amount < -500. RAISE EXCEPTION TYPE zcx_insufficient_funds EXPORTING iv_deficit = iv_amount - ( mv_balance + 500 ). ENDIF.",
        "In test class: assert_equals for balances, TRY...CATCH with fail() for overdraft."
      ],
      "solution": "CLASS zcx_insufficient_funds DEFINITION INHERITING FROM cx_static_check.\n  PUBLIC SECTION.\n    DATA mv_deficit TYPE decfloat16.\n    METHODS constructor IMPORTING iv_deficit TYPE decfloat16 OPTIONAL.\nENDCLASS.\nCLASS zcx_insufficient_funds IMPLEMENTATION.\n  METHOD constructor.\n    super->constructor( ).\n    mv_deficit = iv_deficit.\n  ENDMETHOD.\nENDCLASS.\n\nINTERFACE zif_bank_account.\n  METHODS deposit  IMPORTING iv_amount TYPE decfloat16.\n  METHODS withdraw IMPORTING iv_amount TYPE decfloat16 RAISING zcx_insufficient_funds.\n  METHODS get_balance RETURNING VALUE(rv_balance) TYPE decfloat16.\nENDINTERFACE.\n\nCLASS zcl_checking_account DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES zif_bank_account.\n  PRIVATE SECTION.\n    DATA mv_balance TYPE decfloat16 VALUE 0.\nENDCLASS.\n\nCLASS zcl_checking_account IMPLEMENTATION.\n  METHOD zif_bank_account~deposit.\n    mv_balance = mv_balance + iv_amount.\n  ENDMETHOD.\n\n  METHOD zif_bank_account~withdraw.\n    IF mv_balance - iv_amount < -500.\n      FINAL(lv_shortage) = iv_amount - ( mv_balance + 500 ).\n      RAISE EXCEPTION TYPE zcx_insufficient_funds\n        EXPORTING iv_deficit = lv_shortage.\n    ENDIF.\n    mv_balance = mv_balance - iv_amount.\n  ENDMETHOD.\n\n  METHOD zif_bank_account~get_balance.\n    rv_balance = mv_balance.\n  ENDMETHOD.\nENDCLASS.\n\nCLASS ltcl_bank_test DEFINITION FINAL FOR TESTING DURATION SHORT RISK LEVEL HARMLESS.\n  PRIVATE SECTION.\n    DATA mo_account TYPE REF TO zif_bank_account.\n    METHODS setup.\n    METHODS test_deposit_and_withdraw FOR TESTING.\n    METHODS test_overdraft_exceeded   FOR TESTING.\nENDCLASS.\n\nCLASS ltcl_bank_test IMPLEMENTATION.\n  METHOD setup.\n    mo_account = NEW zcl_checking_account( ).\n  ENDMETHOD.\n\n  METHOD test_deposit_and_withdraw.\n    mo_account->deposit( 1000 ).\n    TRY.\n        mo_account->withdraw( 400 ).\n        cl_abap_unit_assert=>assert_equals( act = mo_account->get_balance( ) exp = CONV decfloat16( 600 ) ).\n      CATCH zcx_insufficient_funds.\n        cl_abap_unit_assert=>fail( 'Withdrawal within balance should not raise error' ).\n    ENDTRY.\n  ENDMETHOD.\n\n  METHOD test_overdraft_exceeded.\n    TRY.\n        mo_account->withdraw( 600 ). \" Exceeds 0 + 500 overdraft by 100\n        cl_abap_unit_assert=>fail( 'Should have raised zcx_insufficient_funds' ).\n      CATCH zcx_insufficient_funds INTO FINAL(lx_err).\n        cl_abap_unit_assert=>assert_equals( act = lx_err->mv_deficit exp = CONV decfloat16( 100 ) ).\n    ENDTRY.\n  ENDMETHOD.\nENDCLASS."
    }
  ],
  "day-3-cds-entities": [
    {
      "id": 1,
      "title": "Exercise 1: Basic CDS View Entity Declaration",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "Write a modern CDS View Entity `ZI_CustomerBasic` selecting `customer_id`, `first_name`, and `city` from database table `/dmo/customer`.",
      "starterCode": "@EndUserText.label: 'Customer Basic View'\n@AccessControl.authorizationCheck: #NOT_REQUIRED\ndefine view entity ZI_CustomerBasic\n  -- TODO: select from /dmo/customer { ... }",
      "hints": [
        "Use define view entity ZI_CustomerBasic as select from /dmo/customer { key customer_id, first_name, city }"
      ],
      "solution": "@EndUserText.label: 'Customer Basic View'\n@AccessControl.authorizationCheck: #NOT_REQUIRED\ndefine view entity ZI_CustomerBasic\n  as select from /dmo/customer\n{\n  key customer_id as CustomerID,\n      first_name  as FirstName,\n      last_name   as LastName,\n      city        as City\n}"
    },
    {
      "id": 2,
      "title": "Exercise 2: Field Aliasing & Type Casting in CDS",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "In a CDS view on `/dmo/travel`, alias `travel_id` to `TravelID` and cast `total_price` to currency type using `cast( total_price as abap.curr( 16, 2 ) ) as TotalPrice`.",
      "starterCode": "define view entity ZI_TravelCasting\n  as select from /dmo/travel\n{\n  -- TODO: Alias travel_id and cast total_price\n}",
      "hints": [
        "cast( total_price as abap.curr( 16, 2 ) ) as TotalPrice, currency_code as CurrencyCode"
      ],
      "solution": "@EndUserText.label: 'Travel with Explicit Casting'\n@AccessControl.authorizationCheck: #NOT_REQUIRED\ndefine view entity ZI_TravelCasting\n  as select from /dmo/travel\n{\n  key travel_id                                  as TravelID,\n      description                                as Description,\n      @Semantics.amount.currencyCode: 'CurrencyCode'\n      cast( total_price as abap.curr( 16, 2 ) )  as TotalPrice,\n      currency_code                              as CurrencyCode\n}"
    },
    {
      "id": 3,
      "title": "Exercise 3: Case Expressions in CDS",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Add a calculated field `TravelStatusText` to a CDS view using a `case status when 'B' then 'Booked' when 'P' then 'Planned' else 'Cancelled' end`.",
      "starterCode": "define view entity ZI_TravelStatus\n  as select from /dmo/travel\n{\n  key travel_id as TravelID,\n      status    as RawStatus,\n      -- TODO: Add case expression for TravelStatusText\n}",
      "hints": [
        "case status when 'B' then 'Booked' when 'P' then 'Planned' else 'Cancelled' end as TravelStatusText"
      ],
      "solution": "@EndUserText.label: 'Travel Status Classification'\n@AccessControl.authorizationCheck: #NOT_REQUIRED\ndefine view entity ZI_TravelStatus\n  as select from /dmo/travel\n{\n  key travel_id as TravelID,\n      status    as RawStatus,\n      case status\n        when 'B' then 'Booked'\n        when 'P' then 'Planned'\n        when 'N' then 'New'\n        else 'Cancelled'\n      end       as TravelStatusText\n}"
    },
    {
      "id": 4,
      "title": "Exercise 4: Modeling 1-to-N Associations in CDS",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Define an association `association [0..*] to /dmo/booking as _Booking on $projection.TravelID = _Booking.travel_id` in `ZI_TravelWithBookings`. Expose `_Booking` in the select list.",
      "starterCode": "define view entity ZI_TravelWithBookings\n  as select from /dmo/travel\n  -- TODO: Define association to /dmo/booking\n{\n  key travel_id as TravelID,\n      description as Description,\n      -- TODO: Expose _Booking\n}",
      "hints": [
        "association [0..*] to /dmo/booking as _Booking on $projection.TravelID = _Booking.travel_id",
        "In select list: _Booking"
      ],
      "solution": "@EndUserText.label: 'Travel with Lazy Booking Association'\n@AccessControl.authorizationCheck: #NOT_REQUIRED\ndefine view entity ZI_TravelWithBookings\n  as select from /dmo/travel\n  association [0..*] to /dmo/booking as _Booking\n    on $projection.TravelID = _Booking.travel_id\n{\n  key travel_id as TravelID,\n      description as Description,\n      _Booking\n}"
    },
    {
      "id": 5,
      "title": "Exercise 5: To-1 Association with Cardinality [0..1]",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Add an association to the Customer master view `association [0..1] to /dmo/customer as _Customer on $projection.CustomerID = _Customer.customer_id`.",
      "starterCode": "define view entity ZI_TravelCustomerAssoc\n  as select from /dmo/travel\n  -- TODO: Define association [0..1] to customer\n{\n  key travel_id   as TravelID,\n      customer_id as CustomerID,\n      -- TODO: Expose _Customer\n}",
      "hints": [
        "association [0..1] to /dmo/customer as _Customer on $projection.CustomerID = _Customer.customer_id"
      ],
      "solution": "@EndUserText.label: 'Travel Customer Relation'\n@AccessControl.authorizationCheck: #NOT_REQUIRED\ndefine view entity ZI_TravelCustomerAssoc\n  as select from /dmo/travel\n  association [0..1] to /dmo/customer as _Customer\n    on $projection.CustomerID = _Customer.customer_id\n{\n  key travel_id   as TravelID,\n      customer_id as CustomerID,\n      _Customer\n}"
    },
    {
      "id": 6,
      "title": "Exercise 6: Navigating Association Attributes in CDS",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Instead of exposing the entire `_Customer` association, navigate it inline to fetch `_Customer.last_name as CustomerLastName` and `_Customer.city as CustomerCity`.",
      "starterCode": "define view entity ZI_TravelCustomerFlat\n  as select from /dmo/travel\n  association [0..1] to /dmo/customer as _Customer\n    on $projection.CustomerID = _Customer.customer_id\n{\n  key travel_id   as TravelID,\n      customer_id as CustomerID,\n      -- TODO: Navigate _Customer.last_name and _Customer.city\n}",
      "hints": [
        "Write _Customer.last_name as CustomerLastName, _Customer.city as CustomerCity"
      ],
      "solution": "@EndUserText.label: 'Travel with Navigated Customer Fields'\n@AccessControl.authorizationCheck: #NOT_REQUIRED\ndefine view entity ZI_TravelCustomerFlat\n  as select from /dmo/travel\n  association [0..1] to /dmo/customer as _Customer\n    on $projection.CustomerID = _Customer.customer_id\n{\n  key travel_id             as TravelID,\n      customer_id           as CustomerID,\n      _Customer.last_name   as CustomerLastName,\n      _Customer.city        as CustomerCity\n}"
    },
    {
      "id": 7,
      "title": "Exercise 7: Aggregations and Group By in CDS Views",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Create an aggregated CDS view `ZI_CustomerTravelStats` grouping by `customer_id` and calculating `count( * ) as TotalTrips` and `sum( total_price ) as TotalSpent`.",
      "starterCode": "define view entity ZI_CustomerTravelStats\n  as select from /dmo/travel\n{\n  -- TODO: Group by customer_id and compute count and sum\n}",
      "hints": [
        "select from /dmo/travel { key customer_id as CustomerID, count( * ) as TotalTrips, sum( total_price ) as TotalSpent } group by customer_id"
      ],
      "solution": "@EndUserText.label: 'Aggregated Customer Spend Analytics'\n@AccessControl.authorizationCheck: #NOT_REQUIRED\ndefine view entity ZI_CustomerTravelStats\n  as select from /dmo/travel\n{\n  key customer_id                 as CustomerID,\n      currency_code               as CurrencyCode,\n      count( * )                  as TotalTrips,\n      @Semantics.amount.currencyCode: 'CurrencyCode'\n      sum( total_price )          as TotalSpent\n}\ngroup by\n  customer_id,\n  currency_code"
    },
    {
      "id": 8,
      "title": "Exercise 8: Consumption View Projection (ZC_*)",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Create a VDM Consumption View `ZC_Travel` projecting fields from Interface View `ZI_Travel`. Add UI annotations like `@UI.lineItem` and `@UI.selectionField`.",
      "starterCode": "@EndUserText.label: 'Travel Consumption View'\ndefine root view entity ZC_Travel\n  as projection on ZI_Travel\n{\n  -- TODO: Project fields and add UI annotations\n}",
      "hints": [
        "as projection on ZI_Travel { key TravelID, @UI.lineItem: [{ position: 10 }] Description, ... }"
      ],
      "solution": "@EndUserText.label: 'Travel Consumption View'\n@AccessControl.authorizationCheck: #NOT_REQUIRED\n@Metadata.allowExtensions: true\ndefine root view entity ZC_Travel\n  as projection on ZI_Travel\n{\n  key TravelID,\n      @UI.lineItem: [{ position: 10 }]\n      @UI.selectionField: [{ position: 10 }]\n      AgencyID,\n      @UI.lineItem: [{ position: 20 }]\n      CustomerID,\n      @UI.lineItem: [{ position: 30 }]\n      BeginDate,\n      @UI.lineItem: [{ position: 40 }]\n      EndDate,\n      TotalPrice,\n      CurrencyCode,\n      _Booking : redirected to composition child ZC_Booking\n}"
    },
    {
      "id": 9,
      "title": "Exercise 9: Access Control & Row-Level Security (DCL)",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 15,
      "prompt": "Write a Data Control Language (DCL) specification `DEFINE ROLE` enforcing that users can only read travels where `AgencyID` matches their authorized authorization object `S_AGENCY`.",
      "starterCode": "@EndUserText.label: 'Row-Level Authorization for Travel'\n@MappingRole: true\ndefine role ZI_Travel_Auth {\n  grant select on ZI_Travel\n  where\n    -- TODO: Add authorization check condition\n}",
      "hints": [
        "( AgencyID ) = aspect pfcg_auth( S_AGENCY, AGENCY_ID, ACTVT = '03' )"
      ],
      "solution": "@EndUserText.label: 'Row-Level Authorization for Travel'\n@MappingRole: true\ndefine role ZI_Travel_Auth {\n  grant select on ZI_Travel\n  where\n    ( AgencyID ) = aspect pfcg_auth( S_AGENCY, AGENCY_ID, ACTVT = '03' );\n}"
    },
    {
      "id": 10,
      "title": "Exercise 10 (Master Capstone): Multi-Tier Virtual Data Model (VDM) for Global Logistics Tracking",
      "difficulty": "Master Capstone",
      "isCapstone": true,
      "estimatedMinutes": 30,
      "prompt": "THE BIG ONE (COMPREHENSIVE CHAPTER 3 CAPSTONE):\nConstruct a production-ready Multi-Tier Virtual Data Model (VDM) for a Global Shipment & Fleet Tracking system:\n1. Interface View Entity `ZI_Shipment`:\n   - Select from shipment database table `zshipment_db`.\n   - Fields: `shipment_uuid` (key), `tracking_number`, `origin_hub`, `dest_hub`, `gross_weight`, `weight_uom`, `status_code`.\n   - Calculated status description using `case status_code`.\n   - Association `[0..1]` to Carrier master `ZI_Carrier` on carrier ID.\n   - Composition `[0..*]` of Child View Entity `ZI_ShipmentItem`.\n2. Consumption Projection View `ZC_Shipment`:\n   - Project fields with UI annotations (`@UI.lineItem`, `@UI.headerInfo`).\n   - Redirect association `_ShipmentItem` to `ZC_ShipmentItem`.\n   - Expose carrier name by navigating `_Carrier.CarrierName`.\n3. Strict Clean Core & HANA pushdown compliance.",
      "starterCode": "\" DAY 3 MASTER CAPSTONE: Multi-Tier Logistics VDM\n@EndUserText.label: 'Shipment Interface View'\n@AccessControl.authorizationCheck: #CHECK\ndefine root view entity ZI_Shipment\n  as select from zshipment_db\n  -- TODO: Associations, calculations, composition\n{\n  key shipment_uuid as ShipmentUUID,\n      -- TODO: Project fields and expose associations\n}",
      "hints": [
        "Use composition [0..*] of ZI_ShipmentItem as _Items",
        "In projection: _Items : redirected to composition child ZC_ShipmentItem"
      ],
      "solution": "@EndUserText.label: 'Shipment Interface View'\n@AccessControl.authorizationCheck: #NOT_REQUIRED\ndefine root view entity ZI_Shipment\n  as select from zshipment_db\n  composition [0..*] of ZI_ShipmentItem as _Items\n  association [0..1] to ZI_Carrier      as _Carrier on $projection.CarrierID = _Carrier.CarrierID\n{\n  key shipment_uuid                         as ShipmentUUID,\n      tracking_number                       as TrackingNumber,\n      carrier_id                            as CarrierID,\n      origin_hub                            as OriginHub,\n      dest_hub                              as DestinationHub,\n      @Semantics.quantity.unitOfMeasure: 'WeightUoM'\n      gross_weight                          as GrossWeight,\n      weight_uom                            as WeightUoM,\n      status_code                           as StatusCode,\n      case status_code\n        when 'IP' then 'In Transit'\n        when 'DL' then 'Delivered'\n        when 'EX' then 'Customs Exception'\n        else 'Pending Pickup'\n      end                                   as StatusText,\n      _Items,\n      _Carrier\n}\n\n/* --- Consumption Layer Projection --- */\n@EndUserText.label: 'Shipment Consumption Projection'\n@AccessControl.authorizationCheck: #NOT_REQUIRED\n@UI.headerInfo: { typeName: 'Shipment', typeNamePlural: 'Shipments' }\ndefine root view entity ZC_Shipment\n  as projection on ZI_Shipment\n{\n  @UI.facet: [{ id: 'General', type: #IDENTIFICATION_REFERENCE, label: 'Shipment Overview' }]\n  key ShipmentUUID,\n      @UI.lineItem: [{ position: 10 }]\n      TrackingNumber,\n      @UI.lineItem: [{ position: 20 }]\n      _Carrier.CarrierName as CarrierName,\n      @UI.lineItem: [{ position: 30 }]\n      OriginHub,\n      @UI.lineItem: [{ position: 40 }]\n      DestinationHub,\n      @UI.lineItem: [{ position: 50 }]\n      GrossWeight,\n      WeightUoM,\n      @UI.lineItem: [{ position: 60, criticality: 'StatusCode' }]\n      StatusText,\n      _Items : redirected to composition child ZC_ShipmentItem\n}"
    }
  ],
  "day-4-rap-managed": [
    {
      "id": 1,
      "title": "Exercise 1: Root CDS View Entity Declaration",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "Declare a root CDS view entity `ZI_Travel_M` with `define root view entity` on persistence table `/dmo/travel_m`. Include `travel_uuid` as the key.",
      "starterCode": "-- Exercise 1: Root View Entity\ndefine root view entity ZI_Travel_M\n  -- TODO: select from /dmo/travel_m",
      "hints": [
        "Use define root view entity ZI_Travel_M as select from /dmo/travel_m { key travel_uuid as TravelUUID, ... }"
      ],
      "solution": "@EndUserText.label: 'Travel Root View Entity'\n@AccessControl.authorizationCheck: #NOT_REQUIRED\ndefine root view entity ZI_Travel_M\n  as select from /dmo/travel_m\n{\n  key travel_uuid as TravelUUID,\n      travel_id   as TravelID,\n      agency_id   as AgencyID,\n      customer_id as CustomerID,\n      overall_status as OverallStatus\n}"
    },
    {
      "id": 2,
      "title": "Exercise 2: Child Entity with Association to Parent",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Create a child CDS view entity `ZI_Booking_M` with `association to parent ZI_Travel_M as _Travel on $projection.TravelUUID = _Travel.TravelUUID`.",
      "starterCode": "-- Exercise 2: Composition Child Entity\ndefine view entity ZI_Booking_M\n  as select from /dmo/booking_m\n  -- TODO: Add association to parent",
      "hints": [
        "association to parent ZI_Travel_M as _Travel on $projection.TravelUUID = _Travel.TravelUUID"
      ],
      "solution": "@EndUserText.label: 'Booking Child Entity'\n@AccessControl.authorizationCheck: #NOT_REQUIRED\ndefine view entity ZI_Booking_M\n  as select from /dmo/booking_m\n  association to parent ZI_Travel_M as _Travel\n    on $projection.TravelUUID = _Travel.TravelUUID\n{\n  key booking_uuid as BookingUUID,\n      travel_uuid  as TravelUUID,\n      booking_id   as BookingID,\n      customer_id  as CustomerID,\n      _Travel\n}"
    },
    {
      "id": 3,
      "title": "Exercise 3: Declaring Managed BDEF Header",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Create a Behavior Definition (BDEF) header for `ZI_Travel_M` with `managed implementation in class zbp_i_travel_m unique; strict ( 2 );`.",
      "starterCode": "-- Exercise 3: BDEF Header\nmanaged implementation in class zbp_i_travel_m unique;\n-- TODO: Add strict mode",
      "hints": [
        "managed implementation in class zbp_i_travel_m unique; strict ( 2 ); define behavior for ZI_Travel_M ..."
      ],
      "solution": "managed implementation in class zbp_i_travel_m unique;\nstrict ( 2 );\n\ndefine behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\nlock master\nauthorization master ( instance )\netag master LocalLastChangedAt\n{\n  create;\n  update;\n  delete;\n}"
    },
    {
      "id": 4,
      "title": "Exercise 4: Enabling Standard CRUD Operations",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "In a BDEF definition for `ZI_Order_M`, explicitly expose `create;`, `update;`, and `delete;` operations.",
      "starterCode": "define behavior for ZI_Order_M alias Order\npersistent table zorder_db\nlock master\n{\n  -- TODO: Enable standard CRUD\n}",
      "hints": [
        "Write create; update; delete; inside the curly braces."
      ],
      "solution": "define behavior for ZI_Order_M alias Order\npersistent table zorder_db\nlock master\nauthorization master ( instance )\netag master LastChangedAt\n{\n  create;\n  update;\n  delete;\n}"
    },
    {
      "id": 5,
      "title": "Exercise 5: Managed Automatic UUID Key Generation",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Configure the root primary key `TravelUUID` in BDEF to be auto-generated by the framework using `field ( readonly, numbering : managed ) TravelUUID;`.",
      "starterCode": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\nlock master\n{\n  -- TODO: Configure managed numbering for TravelUUID\n}",
      "hints": [
        "field ( readonly, numbering : managed ) TravelUUID;"
      ],
      "solution": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\nlock master\n{\n  field ( readonly, numbering : managed ) TravelUUID;\n  field ( readonly ) TravelID;\n  create;\n  update;\n  delete;\n}"
    },
    {
      "id": 6,
      "title": "Exercise 6: Lock Master & Dependent Declarations",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Declare `lock master` on root entity Travel, and `lock dependent by _Travel` on child entity Booking in the BDEF.",
      "starterCode": "-- Exercise 6: Concurrency Locking\ndefine behavior for ZI_Travel_M alias Travel\n-- TODO: Set lock master\n{ ... }\n\ndefine behavior for ZI_Booking_M alias Booking\n-- TODO: Set lock dependent\n{ ... }",
      "hints": [
        "Travel: lock master; Booking: lock dependent by _Travel"
      ],
      "solution": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\nlock master\n{\n  create; update; delete;\n  association _Booking { create; }\n}\n\ndefine behavior for ZI_Booking_M alias Booking\npersistent table /dmo/booking_m\nlock dependent by _Travel\n{\n  update; delete;\n  association _Travel;\n}"
    },
    {
      "id": 7,
      "title": "Exercise 7: Optimistic Locking with ETag Master",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Configure `etag master LocalLastChangedAt` on Travel, and `etag dependent by _Travel` on child Booking to protect against concurrent overwrites.",
      "starterCode": "-- Exercise 7: ETag Concurrency\ndefine behavior for ZI_Travel_M alias Travel\n-- TODO: etag master\n{ ... }\ndefine behavior for ZI_Booking_M alias Booking\n-- TODO: etag dependent\n{ ... }",
      "hints": [
        "Travel: etag master LocalLastChangedAt; Booking: etag dependent by _Travel"
      ],
      "solution": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\nlock master\netag master LocalLastChangedAt\n{\n  create; update; delete;\n}\n\ndefine behavior for ZI_Booking_M alias Booking\npersistent table /dmo/booking_m\nlock dependent by _Travel\netag dependent by _Travel\n{\n  update; delete;\n}"
    },
    {
      "id": 8,
      "title": "Exercise 8: Create-by-Association Mapping",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "In root entity Travel, expose Create-by-Association to bookings: `association _Booking { create; }`.",
      "starterCode": "define behavior for ZI_Travel_M alias Travel\n{\n  create; update; delete;\n  -- TODO: Expose create by association to _Booking\n}",
      "hints": [
        "Write association _Booking { create; }"
      ],
      "solution": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\nlock master\netag master LocalLastChangedAt\n{\n  create;\n  update;\n  delete;\n  association _Booking { create; }\n}"
    },
    {
      "id": 9,
      "title": "Exercise 9: Explicit Field Mapping in BDEF",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 15,
      "prompt": "Add `mapping for /dmo/travel_m` in BDEF to cleanly map CDS CamelCase field names to ABAP database snake_case field names.",
      "starterCode": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\n{\n  -- TODO: mapping for /dmo/travel_m\n}",
      "hints": [
        "mapping for /dmo/travel_m { TravelUUID = travel_uuid; AgencyID = agency_id; ... }"
      ],
      "solution": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\nlock master\n{\n  create; update; delete;\n  mapping for /dmo/travel_m\n  {\n    TravelUUID      = travel_uuid;\n    TravelID        = travel_id;\n    AgencyID        = agency_id;\n    CustomerID      = customer_id;\n    OverallStatus   = overall_status;\n    LocalLastChangedAt = local_last_changed_at;\n  }\n}"
    },
    {
      "id": 10,
      "title": "Exercise 10 (Master Capstone): Complete Managed RAP Business Object for Multi-Tenant Hotel Booking",
      "difficulty": "Master Capstone",
      "isCapstone": true,
      "estimatedMinutes": 30,
      "prompt": "THE BIG ONE (COMPREHENSIVE CHAPTER 4 CAPSTONE):\nDesign a full Managed Business Object for a Multi-Tenant Hotel Reservation system:\n1. Root Entity `ZI_Hotel_M` with child `ZI_HotelRoom_M`.\n2. Behavior Definition with `strict ( 2 );`:\n   - Unique behavior pool implementation class.\n   - Managed numbering for HotelUUID and RoomUUID.\n   - Standard CRUD: create, update, delete.\n   - Lock master on Hotel, lock dependent on Room.\n   - ETag master on Hotel timestamp, ETag dependent on Room.\n   - Create-by-association on Hotel for `_Rooms`.\n   - Comprehensive field mapping block for database persistence tables.",
      "starterCode": "\" DAY 4 MASTER CAPSTONE: Hotel Reservation Managed BO\nmanaged implementation in class zbp_i_hotel_m unique;\nstrict ( 2 );\n\n-- TODO: Define behavior for ZI_Hotel_M and ZI_HotelRoom_M",
      "hints": [
        "Ensure both entities have mapping blocks and child has lock dependent by _Hotel"
      ],
      "solution": "managed implementation in class zbp_i_hotel_m unique;\nstrict ( 2 );\n\ndefine behavior for ZI_Hotel_M alias Hotel\npersistent table zhotel_db\nlock master\nauthorization master ( instance )\netag master LocalLastChangedAt\n{\n  field ( readonly, numbering : managed ) HotelUUID;\n  field ( readonly ) CreatedAt, CreatedBy, LocalLastChangedAt;\n  field ( mandatory ) HotelName, City, CountryCode;\n\n  create;\n  update;\n  delete;\n\n  association _Rooms { create; }\n\n  mapping for zhotel_db\n  {\n    HotelUUID          = hotel_uuid;\n    HotelName          = hotel_name;\n    City               = city;\n    CountryCode        = country_code;\n    Rating             = rating;\n    CreatedAt          = created_at;\n    CreatedBy          = created_by;\n    LocalLastChangedAt = local_last_changed_at;\n  }\n}\n\ndefine behavior for ZI_HotelRoom_M alias Room\npersistent table zroom_db\nlock dependent by _Hotel\nauthorization dependent by _Hotel\netag dependent by _Hotel\n{\n  field ( readonly, numbering : managed ) RoomUUID;\n  field ( readonly ) HotelUUID;\n  field ( mandatory ) RoomNumber, RoomType, PricePerNight;\n\n  update;\n  delete;\n\n  association _Hotel;\n\n  mapping for zroom_db\n  {\n    RoomUUID      = room_uuid;\n    HotelUUID     = hotel_uuid;\n    RoomNumber    = room_number;\n    RoomType      = room_type;\n    PricePerNight = price_per_night;\n    CurrencyCode  = currency_code;\n  }\n}"
    }
  ],
  "day-5-bdef-validations": [
    {
      "id": 1,
      "title": "Exercise 1: Declaring a Determination in BDEF",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "In BDEF for `ZI_Travel_M`, declare a determination `setStatusToOpen on modify { create; }` that triggers only when a new travel is created.",
      "starterCode": "define behavior for ZI_Travel_M alias Travel\n{\n  -- TODO: Declare determination setStatusToOpen on modify { create; }\n}",
      "hints": [
        "determination setStatusToOpen on modify { create; }"
      ],
      "solution": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\nlock master\n{\n  create; update; delete;\n  determination setStatusToOpen on modify { create; }\n}"
    },
    {
      "id": 2,
      "title": "Exercise 2: Declaring a Validation in BDEF",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "Declare a validation `validateDates on save { field BeginDate, EndDate; create; update; }` in the BDEF.",
      "starterCode": "define behavior for ZI_Travel_M alias Travel\n{\n  -- TODO: Declare validation validateDates\n}",
      "hints": [
        "validation validateDates on save { field BeginDate, EndDate; create; update; }"
      ],
      "solution": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\nlock master\n{\n  create; update; delete;\n  validation validateDates on save { field BeginDate, EndDate; create; update; }\n}"
    },
    {
      "id": 3,
      "title": "Exercise 3: Behavior Pool Local Handler Class Structure",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Write the class definition skeleton for Local Handler Class `lhc_travel` inheriting from `cl_abap_behavior_handler` containing the declaration for `validateDates`.",
      "starterCode": "\" Exercise 3: Behavior Handler Class\nCLASS lhc_travel DEFINITION INHERITING FROM cl_abap_behavior_handler.\n  PRIVATE SECTION.\n    \" TODO: METHODS validateDates FOR VALIDATION Travel~validateDates IMPORTING keys FOR Travel.\nENDCLASS.",
      "hints": [
        "METHODS validateDates FOR VALIDATION Travel~validateDates IMPORTING keys FOR Travel."
      ],
      "solution": "CLASS lhc_travel DEFINITION INHERITING FROM cl_abap_behavior_handler.\n  PRIVATE SECTION.\n    METHODS validateDates FOR VALIDATION Travel~validateDates\n      IMPORTING keys FOR Travel.\nENDCLASS.\n\nCLASS lhc_travel IMPLEMENTATION.\n  METHOD validateDates.\n  ENDMETHOD.\nENDCLASS."
    },
    {
      "id": 4,
      "title": "Exercise 4: Reading Buffer via EML in Local Mode",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Inside validation method `validateDates`, use `READ ENTITIES OF ZI_Travel_M IN LOCAL MODE` to read `BeginDate` and `EndDate` for all incoming `keys`.",
      "starterCode": "METHOD validateDates.\n  \" TODO: Read BeginDate and EndDate into FINAL(lt_travels) using EML in local mode\nENDMETHOD.",
      "hints": [
        "READ ENTITIES OF ZI_Travel_M IN LOCAL MODE ENTITY Travel FIELDS ( BeginDate EndDate ) WITH CORRESPONDING #( keys ) RESULT FINAL(lt_travels)."
      ],
      "solution": "METHOD validateDates.\n  READ ENTITIES OF ZI_Travel_M IN LOCAL MODE\n    ENTITY Travel\n    FIELDS ( BeginDate EndDate )\n    WITH CORRESPONDING #( keys )\n    RESULT FINAL(lt_travels).\nENDMETHOD."
    },
    {
      "id": 5,
      "title": "Exercise 5: Populating Failed and Reported Tables",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "In `validateDates`, loop over `lt_travels`. If `EndDate < BeginDate`, append `%tky` to `failed-travel` and append an error message to `reported-travel`.",
      "starterCode": "METHOD validateDates.\n  \" ... lt_travels fetched ...\n  LOOP AT lt_travels INTO FINAL(ls_travel).\n    \" TODO: If EndDate < BeginDate, report error and fail key\n  ENDLOOP.\nENDMETHOD.",
      "hints": [
        "APPEND VALUE #( %tky = ls_travel-%tky ) TO failed-travel.",
        "APPEND VALUE #( %tky = ls_travel-%tky %msg = ... ) TO reported-travel."
      ],
      "solution": "METHOD validateDates.\n  READ ENTITIES OF ZI_Travel_M IN LOCAL MODE\n    ENTITY Travel\n    FIELDS ( BeginDate EndDate )\n    WITH CORRESPONDING #( keys )\n    RESULT FINAL(lt_travels).\n\n  LOOP AT lt_travels INTO FINAL(ls_travel).\n    IF ls_travel-EndDate < ls_travel-BeginDate.\n      APPEND VALUE #( %tky = ls_travel-%tky ) TO failed-travel.\n      APPEND VALUE #(\n        %tky = ls_travel-%tky\n        %msg = new_message_with_text(\n                 severity = if_abap_behv_message=>severity-error\n                 text     = 'End date must be on or after begin date' )\n      ) TO reported-travel.\n    ENDIF.\n  ENDLOOP.\nENDMETHOD."
    },
    {
      "id": 6,
      "title": "Exercise 6: Implementing Determination Defaulting Logic",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Implement determination `setStatusToOpen`. Use EML `MODIFY ENTITIES OF ZI_Travel_M IN LOCAL MODE` to set `OverallStatus = 'O'` (Open) for incoming keys.",
      "starterCode": "METHOD setStatusToOpen.\n  \" TODO: Update OverallStatus to 'O' using MODIFY ENTITIES IN LOCAL MODE\nENDMETHOD.",
      "hints": [
        "MODIFY ENTITIES OF ZI_Travel_M IN LOCAL MODE ENTITY Travel UPDATE FIELDS ( OverallStatus ) WITH VALUE #( FOR key IN keys ( %tky = key-%tky OverallStatus = 'O' ) )."
      ],
      "solution": "METHOD setStatusToOpen.\n  MODIFY ENTITIES OF ZI_Travel_M IN LOCAL MODE\n    ENTITY Travel\n    UPDATE FIELDS ( OverallStatus )\n    WITH VALUE #( FOR key IN keys (\n      %tky          = key-%tky\n      OverallStatus = 'O'\n    ) ).\nENDMETHOD."
    },
    {
      "id": 7,
      "title": "Exercise 7: Determination Calculating Parent Total from Children",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 15,
      "prompt": "Implement a determination `calculateTotalPrice` on child Booking that reads all siblings and updates `TotalPrice` on the parent Travel.",
      "starterCode": "METHOD calculateTotalPrice.\n  \" TODO: Calculate parent travel total when bookings change\nENDMETHOD.",
      "hints": [
        "Read parent travel keys via READ BY \\_Travel, read all bookings via READ BY \\_Booking, sum with REDUCE, and update parent with MODIFY."
      ],
      "solution": "METHOD calculateTotalPrice.\n  READ ENTITIES OF ZI_Travel_M IN LOCAL MODE\n    ENTITY Booking BY \\_Travel\n    FIELDS ( TravelUUID )\n    WITH CORRESPONDING #( keys )\n    RESULT FINAL(lt_travels).\n\n  READ ENTITIES OF ZI_Travel_M IN LOCAL MODE\n    ENTITY Travel BY \\_Booking\n    FIELDS ( FlightPrice CurrencyCode )\n    WITH CORRESPONDING #( lt_travels )\n    RESULT FINAL(lt_all_bookings).\n\n  LOOP AT lt_travels INTO FINAL(ls_travel).\n    FINAL(lv_sum) = REDUCE decfloat16(\n      INIT s = CONV decfloat16( 0 )\n      FOR b IN lt_all_bookings WHERE ( TravelUUID = ls_travel-TravelUUID )\n      NEXT s = s + b-FlightPrice\n    ).\n\n    MODIFY ENTITIES OF ZI_Travel_M IN LOCAL MODE\n      ENTITY Travel\n      UPDATE FIELDS ( TotalPrice )\n      WITH VALUE #( ( %tky = ls_travel-%tky TotalPrice = lv_sum ) ).\n  ENDLOOP.\nENDMETHOD."
    },
    {
      "id": 8,
      "title": "Exercise 8: Customer Existence Validation with Read-Only DB Check",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Write validation `validateCustomer`. Verify that `CustomerID` exists in released CDS view `I_Customer`. Fail validation if customer does not exist.",
      "starterCode": "METHOD validateCustomer.\n  \" TODO: Check CustomerID against I_Customer\nENDMETHOD.",
      "hints": [
        "SELECT FROM i_customer FIELDS customer WHERE customer = @ls_travel-CustomerID INTO @FINAL(lv_found)."
      ],
      "solution": "METHOD validateCustomer.\n  READ ENTITIES OF ZI_Travel_M IN LOCAL MODE\n    ENTITY Travel\n    FIELDS ( CustomerID )\n    WITH CORRESPONDING #( keys )\n    RESULT FINAL(lt_travels).\n\n  LOOP AT lt_travels INTO FINAL(ls_travel).\n    SELECT SINGLE FROM i_customer\n      FIELDS customer\n      WHERE customer = @ls_travel-CustomerID\n      INTO @FINAL(lv_cust).\n\n    IF sy-subrc <> 0.\n      APPEND VALUE #( %tky = ls_travel-%tky ) TO failed-travel.\n      APPEND VALUE #(\n        %tky = ls_travel-%tky\n        %msg = new_message_with_text(\n                 severity = if_abap_behv_message=>severity-error\n                 text     = |Customer { ls_travel-CustomerID } is invalid or does not exist.| )\n      ) TO reported-travel.\n    ENDIF.\n  ENDLOOP.\nENDMETHOD."
    },
    {
      "id": 9,
      "title": "Exercise 9: State Area Messaging to Clear Old Errors",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "When reporting messages in RAP validations, specify `%state_area` so that previously resolved errors are automatically cleared from the UI.",
      "starterCode": "\" Exercise 9: %state_area error management\nAPPEND VALUE #(\n  %tky        = ls_travel-%tky\n  %state_area = 'VALIDATE_DATES'\n  -- TODO: complete error clear / message entry\n) TO reported-travel.",
      "hints": [
        "First append an empty message with %state_area = 'VALIDATE_DATES' to clear, then if invalid append with %msg."
      ],
      "solution": "METHOD validateDates.\n  READ ENTITIES OF ZI_Travel_M IN LOCAL MODE\n    ENTITY Travel FIELDS ( BeginDate EndDate )\n    WITH CORRESPONDING #( keys )\n    RESULT FINAL(lt_travels).\n\n  LOOP AT lt_travels INTO FINAL(ls_travel).\n    \" 1. Clear previous state area messages\n    APPEND VALUE #( %tky = ls_travel-%tky %state_area = 'VALIDATE_DATES' ) TO reported-travel.\n\n    \" 2. Re-validate\n    IF ls_travel-EndDate < ls_travel-BeginDate.\n      APPEND VALUE #( %tky = ls_travel-%tky ) TO failed-travel.\n      APPEND VALUE #(\n        %tky        = ls_travel-%tky\n        %state_area = 'VALIDATE_DATES'\n        %msg        = new_message_with_text(\n                        severity = if_abap_behv_message=>severity-error\n                        text     = 'End date must be greater than begin date' )\n      ) TO reported-travel.\n    ENDIF.\n  ENDLOOP.\nENDMETHOD."
    },
    {
      "id": 10,
      "title": "Exercise 10 (Master Capstone): Enterprise Financial Invoice Validation & Discount Engine",
      "difficulty": "Master Capstone",
      "isCapstone": true,
      "estimatedMinutes": 30,
      "prompt": "THE BIG ONE (COMPREHENSIVE CHAPTER 5 CAPSTONE):\nImplement an End-to-End Enterprise Invoice Validation and Volume Discount Engine:\n1. BDEF definitions for `ZI_Invoice_M`:\n   - Determination `applyVolumeDiscount on modify { field NetAmount; }`.\n   - Validation `validateDueDate on save { field IssueDate, DueDate; }`.\n   - Validation `validateVatRegistration on save { field CustomerTaxID; }`.\n2. Behavior Handler Class Implementation (`lhc_invoice`):\n   - `validateDueDate`: Verifies `DueDate` is at least 14 days after `IssueDate`. Fails key and reports clear message with `%state_area`.\n   - `validateVatRegistration`: Verifies `CustomerTaxID` is not initial and matches syntax prefix 'EU' or 'US'.\n   - `applyVolumeDiscount`: If `NetAmount > 50000`, automatically deducts a 10% volume discount and updates `DiscountAmount` and `FinalAmount` using EML `MODIFY ENTITIES IN LOCAL MODE`.\n3. 100% Clean Core compliant, no transactional buffer corruption.",
      "starterCode": "\" DAY 5 MASTER CAPSTONE: Financial Invoice Rules Engine\nCLASS lhc_invoice DEFINITION INHERITING FROM cl_abap_behavior_handler.\n  PRIVATE SECTION.\n    METHODS validateDueDate          FOR VALIDATION Invoice~validateDueDate IMPORTING keys FOR Invoice.\n    METHODS validateVatRegistration  FOR VALIDATION Invoice~validateVatRegistration IMPORTING keys FOR Invoice.\n    METHODS applyVolumeDiscount      FOR DETERMINATION Invoice~applyVolumeDiscount IMPORTING keys FOR Invoice.\nENDCLASS.\n\nCLASS lhc_invoice IMPLEMENTATION.\n  -- TODO: Implement all 3 methods\nENDCLASS.",
      "hints": [
        "Calculate due date delta: ls_inv-DueDate - ls_inv-IssueDate < 14",
        "Use EML MODIFY ENTITIES for discount"
      ],
      "solution": "CLASS lhc_invoice DEFINITION INHERITING FROM cl_abap_behavior_handler.\n  PRIVATE SECTION.\n    METHODS validateDueDate         FOR VALIDATION Invoice~validateDueDate IMPORTING keys FOR Invoice.\n    METHODS validateVatRegistration FOR VALIDATION Invoice~validateVatRegistration IMPORTING keys FOR Invoice.\n    METHODS applyVolumeDiscount     FOR DETERMINATION Invoice~applyVolumeDiscount IMPORTING keys FOR Invoice.\nENDCLASS.\n\nCLASS lhc_invoice IMPLEMENTATION.\n  METHOD validateDueDate.\n    READ ENTITIES OF ZI_Invoice_M IN LOCAL MODE\n      ENTITY Invoice\n      FIELDS ( IssueDate DueDate )\n      WITH CORRESPONDING #( keys )\n      RESULT FINAL(lt_invoices).\n\n    LOOP AT lt_invoices INTO FINAL(ls_inv).\n      APPEND VALUE #( %tky = ls_inv-%tky %state_area = 'DUE_DATE' ) TO reported-invoice.\n      IF ls_inv-DueDate - ls_inv-IssueDate < 14.\n        APPEND VALUE #( %tky = ls_inv-%tky ) TO failed-invoice.\n        APPEND VALUE #(\n          %tky        = ls_inv-%tky\n          %state_area = 'DUE_DATE'\n          %msg        = new_message_with_text(\n                          severity = if_abap_behv_message=>severity-error\n                          text     = 'Payment terms violation: Due date must be at least 14 days after issue date.' )\n        ) TO reported-invoice.\n      ENDIF.\n    ENDLOOP.\n  ENDMETHOD.\n\n  METHOD validateVatRegistration.\n    READ ENTITIES OF ZI_Invoice_M IN LOCAL MODE\n      ENTITY Invoice\n      FIELDS ( CustomerTaxID )\n      WITH CORRESPONDING #( keys )\n      RESULT FINAL(lt_invoices).\n\n    LOOP AT lt_invoices INTO FINAL(ls_inv).\n      APPEND VALUE #( %tky = ls_inv-%tky %state_area = 'TAX_ID' ) TO reported-invoice.\n      IF ls_inv-CustomerTaxID IS INITIAL OR NOT ( ls_inv-CustomerTaxID CP 'EU*' OR ls_inv-CustomerTaxID CP 'US*' ).\n        APPEND VALUE #( %tky = ls_inv-%tky ) TO failed-invoice.\n        APPEND VALUE #(\n          %tky        = ls_inv-%tky\n          %state_area = 'TAX_ID'\n          %msg        = new_message_with_text(\n                          severity = if_abap_behv_message=>severity-error\n                          text     = 'Invalid Tax Registration: Must begin with valid jurisdiction prefix (EU or US).' )\n        ) TO reported-invoice.\n      ENDIF.\n    ENDLOOP.\n  ENDMETHOD.\n\n  METHOD applyVolumeDiscount.\n    READ ENTITIES OF ZI_Invoice_M IN LOCAL MODE\n      ENTITY Invoice\n      FIELDS ( NetAmount )\n      WITH CORRESPONDING #( keys )\n      RESULT FINAL(lt_invoices).\n\n    MODIFY ENTITIES OF ZI_Invoice_M IN LOCAL MODE\n      ENTITY Invoice\n      UPDATE FIELDS ( DiscountAmount FinalAmount )\n      WITH VALUE #(\n        FOR inv IN lt_invoices\n        LET lv_discount = COND decfloat16( WHEN inv-NetAmount > 50000 THEN inv-NetAmount * '0.10' ELSE 0 )\n            lv_final    = inv-NetAmount - lv_discount\n        IN ( %tky           = inv-%tky\n             DiscountAmount = lv_discount\n             FinalAmount    = lv_final )\n      ).\n  ENDMETHOD.\nENDCLASS."
    }
  ],
  "day-6-actions-auth": [
    {
      "id": 1,
      "title": "Exercise 1: Declaring an Instance Action in BDEF",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "In BDEF for `ZI_Travel_M`, declare an instance action `acceptTravel result [1] $self;` that accepts a travel and returns the updated entity.",
      "starterCode": "define behavior for ZI_Travel_M alias Travel\n{\n  -- TODO: Declare instance action acceptTravel\n}",
      "hints": [
        "action acceptTravel result [1] $self;"
      ],
      "solution": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\nlock master\n{\n  create; update; delete;\n  action acceptTravel result [1] $self;\n}"
    },
    {
      "id": 2,
      "title": "Exercise 2: Action with Dynamic Feature Control",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "Add dynamic feature control to the action declaration: `action ( features : instance ) acceptTravel result [1] $self;`.",
      "starterCode": "define behavior for ZI_Travel_M alias Travel\n{\n  -- TODO: Add features : instance to acceptTravel\n}",
      "hints": [
        "action ( features : instance ) acceptTravel result [1] $self;"
      ],
      "solution": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\nlock master\n{\n  create; update; delete;\n  action ( features : instance ) acceptTravel result [1] $self;\n  action ( features : instance ) rejectTravel result [1] $self;\n}"
    },
    {
      "id": 3,
      "title": "Exercise 3: Implementing Action Logic in Local Handler",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Implement `acceptTravel` in `lhc_travel`. Update `OverallStatus = 'A'` (Accepted) using EML `MODIFY ENTITIES IN LOCAL MODE`, read the result, and populate `result`.",
      "starterCode": "METHOD acceptTravel.\n  \" TODO: Set OverallStatus = 'A' and return updated entity in result\nENDMETHOD.",
      "hints": [
        "Use MODIFY ENTITIES ... UPDATE FIELDS ( OverallStatus ) WITH ...",
        "READ ENTITIES ... RESULT FINAL(lt_travels)",
        "result = VALUE #( FOR t IN lt_travels ( %tky = t-%tky %param = t ) )"
      ],
      "solution": "METHOD acceptTravel.\n  MODIFY ENTITIES OF ZI_Travel_M IN LOCAL MODE\n    ENTITY Travel\n    UPDATE FIELDS ( OverallStatus )\n    WITH VALUE #( FOR key IN keys ( %tky = key-%tky OverallStatus = 'A' ) ).\n\n  READ ENTITIES OF ZI_Travel_M IN LOCAL MODE\n    ENTITY Travel\n    ALL FIELDS WITH CORRESPONDING #( keys )\n    RESULT FINAL(lt_travels).\n\n  result = VALUE #( FOR travel IN lt_travels ( %tky = travel-%tky %param = travel ) ).\nENDMETHOD."
    },
    {
      "id": 4,
      "title": "Exercise 4: Implementing Dynamic Feature Control (get_instance_features)",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Implement `get_instance_features`. If `OverallStatus = 'A'`, disable action `acceptTravel` (%features-%action-acceptTravel = if_abap_behv=>fc-o-disabled). If `OverallStatus = 'X'`, disable `rejectTravel`.",
      "starterCode": "METHOD get_instance_features.\n  \" TODO: Read OverallStatus and set %features-%action-acceptTravel accordingly\nENDMETHOD.",
      "hints": [
        "Use if_abap_behv=>fc-o-disabled to disable and if_abap_behv=>fc-o-enabled to enable."
      ],
      "solution": "METHOD get_instance_features.\n  READ ENTITIES OF ZI_Travel_M IN LOCAL MODE\n    ENTITY Travel\n    FIELDS ( OverallStatus )\n    WITH CORRESPONDING #( keys )\n    RESULT FINAL(lt_travels).\n\n  result = VALUE #(\n    FOR travel IN lt_travels\n    ( %tky                    = travel-%tky\n      %action-acceptTravel    = COND #( WHEN travel-OverallStatus = 'A'\n                                        THEN if_abap_behv=>fc-o-disabled\n                                        ELSE if_abap_behv=>fc-o-enabled )\n      %action-rejectTravel    = COND #( WHEN travel-OverallStatus = 'X'\n                                        THEN if_abap_behv=>fc-o-disabled\n                                        ELSE if_abap_behv=>fc-o-enabled ) )\n  ).\nENDMETHOD."
    },
    {
      "id": 5,
      "title": "Exercise 5: Dynamic Field Control (Read-only after Approval)",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "In `get_instance_features`, make `BookingFee` read-only (%field-BookingFee = if_abap_behv=>fc-f-read_only) if `OverallStatus = 'A'`.",
      "starterCode": "\" Exercise 5: Field control in get_instance_features\n%field-BookingFee = COND #( WHEN travel-OverallStatus = 'A' THEN ... )",
      "hints": [
        "%field-BookingFee = COND #( WHEN travel-OverallStatus = 'A' THEN if_abap_behv=>fc-f-read_only ELSE if_abap_behv=>fc-f-unrestricted )"
      ],
      "solution": "METHOD get_instance_features.\n  READ ENTITIES OF ZI_Travel_M IN LOCAL MODE\n    ENTITY Travel\n    FIELDS ( OverallStatus )\n    WITH CORRESPONDING #( keys )\n    RESULT FINAL(lt_travels).\n\n  result = VALUE #(\n    FOR travel IN lt_travels\n    ( %tky               = travel-%tky\n      %field-BookingFee  = COND #( WHEN travel-OverallStatus = 'A'\n                                   THEN if_abap_behv=>fc-f-read_only\n                                   ELSE if_abap_behv=>fc-f-unrestricted ) )\n  ).\nENDMETHOD."
    },
    {
      "id": 6,
      "title": "Exercise 6: Factory Action (Cloning an Entity)",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Declare factory action `factory action copyTravel [1];` in BDEF to clone an existing travel record with a new UUID.",
      "starterCode": "define behavior for ZI_Travel_M alias Travel\n{\n  -- TODO: Declare factory action copyTravel\n}",
      "hints": [
        "factory action copyTravel [1];"
      ],
      "solution": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\nlock master\n{\n  create; update; delete;\n  factory action copyTravel [1];\n}"
    },
    {
      "id": 7,
      "title": "Exercise 7: Master Authorization Declaration in BDEF",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Declare `authorization master ( global, instance )` on entity Travel in the BDEF.",
      "starterCode": "define behavior for ZI_Travel_M alias Travel\n-- TODO: Declare global and instance authorization\n{ ... }",
      "hints": [
        "authorization master ( global, instance )"
      ],
      "solution": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\nlock master\nauthorization master ( global, instance )\netag master LocalLastChangedAt\n{\n  create; update; delete;\n}"
    },
    {
      "id": 8,
      "title": "Exercise 8: Implementing Global Authorization Check",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Implement `get_global_authorizations`. Verify if current user is authorized to create travels using authority-check object `S_TABU_DIS` or role check.",
      "starterCode": "METHOD get_global_authorizations.\n  \" TODO: Verify create authorization\nENDMETHOD.",
      "hints": [
        "result-%create = if_abap_behv=>auth-allowed or auth-unauthorized"
      ],
      "solution": "METHOD get_global_authorizations.\n  IF requested_authorizations-%create = if_abap_behv=>mk-on.\n    AUTHORITY-CHECK OBJECT 'S_TABU_DIS'\n      ID 'ACTVT' FIELD '02'.\n\n    result-%create = COND #( WHEN sy-subrc = 0\n                             THEN if_abap_behv=>auth-allowed\n                             ELSE if_abap_behv=>auth-unauthorized ).\n  ENDIF.\nENDMETHOD."
    },
    {
      "id": 9,
      "title": "Exercise 9: Implementing Instance-Level Spending Limit Authorization",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 15,
      "prompt": "Implement `get_instance_authorizations`. If `TotalPrice > 100000`, verify if the user has supervisor authority (`S_TRAVEL_SUP`). Otherwise deny update authorization.",
      "starterCode": "METHOD get_instance_authorizations.\n  \" TODO: Read TotalPrice and check supervisor permission\nENDMETHOD.",
      "hints": [
        "Check TotalPrice > 100000. If so, authority check S_TRAVEL_SUP. If sy-subrc <> 0, set %update = if_abap_behv=>auth-unauthorized."
      ],
      "solution": "METHOD get_instance_authorizations.\n  READ ENTITIES OF ZI_Travel_M IN LOCAL MODE\n    ENTITY Travel\n    FIELDS ( TotalPrice )\n    WITH CORRESPONDING #( keys )\n    RESULT FINAL(lt_travels).\n\n  LOOP AT lt_travels INTO FINAL(ls_travel).\n    DATA(lv_auth) = if_abap_behv=>auth-allowed.\n    IF ls_travel-TotalPrice > 100000.\n      AUTHORITY-CHECK OBJECT 'S_TRAVEL_SUP'\n        ID 'ACTVT' FIELD '02'.\n      IF sy-subrc <> 0.\n        lv_auth = if_abap_behv=>auth-unauthorized.\n      ENDIF.\n    ENDIF.\n\n    APPEND VALUE #(\n      %tky    = ls_travel-%tky\n      %update = lv_auth\n      %delete = lv_auth\n    ) TO result.\n  ENDLOOP.\nENDMETHOD."
    },
    {
      "id": 10,
      "title": "Exercise 10 (Master Capstone): Purchase Requisition Multi-Level Approval & Delegation Workflow",
      "difficulty": "Master Capstone",
      "isCapstone": true,
      "estimatedMinutes": 30,
      "prompt": "THE BIG ONE (COMPREHENSIVE CHAPTER 6 CAPSTONE):\nDesign an Enterprise Requisition Approval & Security Engine:\n1. BDEF for `ZI_Requisition_M`:\n   - Instance actions: `approveRequisition result [1] $self;`, `rejectRequisition result [1] $self;`\n   - Dynamic feature control on both actions.\n   - Master authorization: `authorization master ( global, instance )`.\n2. Behavior Handler Class:\n   - `get_instance_features`:\n     * If Status is 'APPROVED' or 'REJECTED': both actions disabled, RequisitionAmount field made read-only.\n     * If Status is 'PENDING': both actions enabled.\n   - `get_instance_authorizations`:\n     * If RequisitionAmount > 50,000, verify approval authorization object `M_EINK_FRG`. If unauthorized, set `%action-approveRequisition = auth-unauthorized`.\n   - `approveRequisition`:\n     * Changes Status to 'APPROVED', sets ApproverID to current user (`cl_abap_context_info=>get_user_technical_name( )`), and returns updated entity.\n3. 100% Clean Core compliant, full error reporting.",
      "starterCode": "\" DAY 6 MASTER CAPSTONE: Purchase Requisition Approval Workflow\nCLASS lhc_requisition DEFINITION INHERITING FROM cl_abap_behavior_handler.\n  PRIVATE SECTION.\n    METHODS get_instance_features       FOR INSTANCE FEATURES IMPORTING keys REQUEST requested_features FOR Requisition RESULT result.\n    METHODS get_instance_authorizations FOR INSTANCE AUTHORIZATION IMPORTING keys REQUEST requested_authorizations FOR Requisition RESULT result.\n    METHODS approveRequisition          FOR MODIFY IMPORTING keys FOR ACTION Requisition~approveRequisition RESULT result.\nENDCLASS.\n\nCLASS lhc_requisition IMPLEMENTATION.\n  -- TODO: Implement feature control, authorization, and approval action\nENDCLASS.",
      "hints": [
        "Use cl_abap_context_info=>get_user_technical_name() to get current approver username"
      ],
      "solution": "CLASS lhc_requisition DEFINITION INHERITING FROM cl_abap_behavior_handler.\n  PRIVATE SECTION.\n    METHODS get_instance_features       FOR INSTANCE FEATURES IMPORTING keys REQUEST requested_features FOR Requisition RESULT result.\n    METHODS get_instance_authorizations FOR INSTANCE AUTHORIZATION IMPORTING keys REQUEST requested_authorizations FOR Requisition RESULT result.\n    METHODS approveRequisition          FOR MODIFY IMPORTING keys FOR ACTION Requisition~approveRequisition RESULT result.\nENDCLASS.\n\nCLASS lhc_requisition IMPLEMENTATION.\n  METHOD get_instance_features.\n    READ ENTITIES OF ZI_Requisition_M IN LOCAL MODE\n      ENTITY Requisition\n      FIELDS ( Status RequisitionAmount )\n      WITH CORRESPONDING #( keys )\n      RESULT FINAL(lt_reqs).\n\n    result = VALUE #(\n      FOR req IN lt_reqs\n      LET lv_is_processed = COND #( WHEN req-Status = 'APPROVED' OR req-Status = 'REJECTED' THEN abap_true ELSE abap_false )\n      IN ( %tky                       = req-%tky\n           %action-approveRequisition = COND #( WHEN lv_is_processed = abap_true THEN if_abap_behv=>fc-o-disabled ELSE if_abap_behv=>fc-o-enabled )\n           %action-rejectRequisition  = COND #( WHEN lv_is_processed = abap_true THEN if_abap_behv=>fc-o-disabled ELSE if_abap_behv=>fc-o-enabled )\n           %field-RequisitionAmount   = COND #( WHEN lv_is_processed = abap_true THEN if_abap_behv=>fc-f-read_only ELSE if_abap_behv=>fc-f-unrestricted ) )\n    ).\n  ENDMETHOD.\n\n  METHOD get_instance_authorizations.\n    READ ENTITIES OF ZI_Requisition_M IN LOCAL MODE\n      ENTITY Requisition\n      FIELDS ( RequisitionAmount )\n      WITH CORRESPONDING #( keys )\n      RESULT FINAL(lt_reqs).\n\n    LOOP AT lt_reqs INTO FINAL(ls_req).\n      DATA(lv_approve_auth) = if_abap_behv=>auth-allowed.\n      IF ls_req-RequisitionAmount > 50000.\n        AUTHORITY-CHECK OBJECT 'M_EINK_FRG'\n          ID 'ACTVT' FIELD '02'.\n        IF sy-subrc <> 0.\n          lv_approve_auth = if_abap_behv=>auth-unauthorized.\n        ENDIF.\n      ENDIF.\n\n      APPEND VALUE #(\n        %tky                       = ls_req-%tky\n        %action-approveRequisition = lv_approve_auth\n      ) TO result.\n    ENDLOOP.\n  ENDMETHOD.\n\n  METHOD approveRequisition.\n    FINAL(lv_user) = cl_abap_context_info=>get_user_technical_name( ).\n\n    MODIFY ENTITIES OF ZI_Requisition_M IN LOCAL MODE\n      ENTITY Requisition\n      UPDATE FIELDS ( Status ApproverID )\n      WITH VALUE #( FOR k IN keys (\n        %tky       = k-%tky\n        Status     = 'APPROVED'\n        ApproverID = lv_user\n      ) ).\n\n    READ ENTITIES OF ZI_Requisition_M IN LOCAL MODE\n      ENTITY Requisition\n      ALL FIELDS WITH CORRESPONDING #( keys )\n      RESULT FINAL(lt_updated).\n\n    result = VALUE #( FOR r IN lt_updated ( %tky = r-%tky %param = r ) ).\n  ENDMETHOD.\nENDCLASS."
    }
  ],
  "day-7-draft-handling": [
    {
      "id": 1,
      "title": "Exercise 1: Enabling Draft in BDEF Header",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "Add `with draft;` to a managed BDEF declaration for `ZI_Travel_M`.",
      "starterCode": "managed implementation in class zbp_i_travel_m unique;\nstrict ( 2 );\n-- TODO: Enable draft",
      "hints": [
        "managed implementation in class zbp_i_travel_m unique; strict ( 2 ); with draft;"
      ],
      "solution": "managed implementation in class zbp_i_travel_m unique;\nstrict ( 2 );\nwith draft;\n\ndefine behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\ndraft table /dmo/travel_md\nlock master total etag LastChangedAt\netag master LocalLastChangedAt\n{\n  create; update; delete;\n}"
    },
    {
      "id": 2,
      "title": "Exercise 2: Declaring Draft Table in Entity",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "In entity Travel, specify `draft table ztravel_d` alongside `persistent table ztravel_db`.",
      "starterCode": "define behavior for ZI_Travel_M alias Travel\npersistent table ztravel_db\n-- TODO: Add draft table ztravel_d",
      "hints": [
        "draft table ztravel_d"
      ],
      "solution": "define behavior for ZI_Travel_M alias Travel\npersistent table ztravel_db\ndraft table ztravel_d\nlock master total etag LastChangedAt\netag master LocalLastChangedAt\n{\n  create; update; delete;\n}"
    },
    {
      "id": 3,
      "title": "Exercise 3: Declaring Standard Draft Actions in BDEF",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Declare the standard draft actions in BDEF: `draft action Edit;`, `draft action Activate;`, `draft action Discard;`, `draft action Resume;`.",
      "starterCode": "define behavior for ZI_Travel_M alias Travel\n{\n  create; update; delete;\n  -- TODO: Declare draft actions Edit, Activate, Discard, Resume\n}",
      "hints": [
        "draft action Edit; draft action Activate optimized; draft action Discard; draft action Resume;"
      ],
      "solution": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\ndraft table /dmo/travel_md\nlock master total etag LastChangedAt\netag master LocalLastChangedAt\n{\n  create; update; delete;\n  draft action Edit;\n  draft action Activate optimized;\n  draft action Discard;\n  draft action Resume;\n}"
    },
    {
      "id": 4,
      "title": "Exercise 4: Draft Determine Action Prepare",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Declare `draft determine action Prepare { validation validateDates; validation validateCustomer; }` to enforce that validations run prior to draft activation.",
      "starterCode": "-- Exercise 4: Draft Prepare\ndraft determine action Prepare\n{\n  -- TODO: Bind validations validateDates and validateCustomer\n}",
      "hints": [
        "draft determine action Prepare { validation validateDates; validation validateCustomer; }"
      ],
      "solution": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\ndraft table /dmo/travel_md\nlock master total etag LastChangedAt\netag master LocalLastChangedAt\n{\n  create; update; delete;\n  draft action Edit;\n  draft action Activate optimized;\n  draft action Discard;\n  draft action Resume;\n  draft determine action Prepare\n  {\n    validation validateDates;\n    validation validateCustomer;\n  }\n}"
    },
    {
      "id": 5,
      "title": "Exercise 5: Total ETag vs Local ETag",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "In a draft-enabled BDEF, configure `lock master total etag LastChangedAt` and `etag master LocalLastChangedAt`. Explain in comments why both are required.",
      "starterCode": "-- Exercise 5: Total vs Local ETag\ndefine behavior for ZI_Contract_M alias Contract\npersistent table zcontract_db\ndraft table zcontract_d\n-- TODO: Set lock master total etag and etag master",
      "hints": [
        "Total ETag checks if active instance changed in DB while user was editing draft. Local ETag manages optimistic concurrency in OData."
      ],
      "solution": "\" Total ETag protects against background updates on active DB record while draft is open\n\" Local ETag protects against concurrent edits on the draft itself\ndefine behavior for ZI_Contract_M alias Contract\npersistent table zcontract_db\ndraft table zcontract_d\nlock master total etag LastChangedAt\netag master LocalLastChangedAt\n{\n  create; update; delete;\n  draft action Edit;\n  draft action Activate optimized;\n  draft action Discard;\n  draft action Resume;\n}"
    },
    {
      "id": 6,
      "title": "Exercise 6: Draft Child Composition Tree Mapping",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Enable draft on child entity `ZI_Booking_M` with `draft table zbooking_d` and `lock dependent by _Travel`. Expose `association _Booking { create; with draft; }` on parent.",
      "starterCode": "-- Exercise 6: Draft Child Composition\ndefine behavior for ZI_Travel_M alias Travel\n{\n  -- TODO: Expose draft association to _Booking\n}\n\ndefine behavior for ZI_Booking_M alias Booking\n-- TODO: Add draft table and lock dependent\n{ ... }",
      "hints": [
        "In parent: association _Booking { create; with draft; }",
        "In child: draft table zbooking_d lock dependent by _Travel"
      ],
      "solution": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\ndraft table /dmo/travel_md\nlock master total etag LastChangedAt\netag master LocalLastChangedAt\n{\n  create; update; delete;\n  association _Booking { create; with draft; }\n}\n\ndefine behavior for ZI_Booking_M alias Booking\npersistent table /dmo/booking_m\ndraft table /dmo/booking_md\nlock dependent by _Travel\netag dependent by _Travel\n{\n  update; delete;\n  association _Travel { with draft; }\n}"
    },
    {
      "id": 7,
      "title": "Exercise 7: Inspecting %is_draft in Validations",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "In validation `validateCustomer`, inspect `%is_draft` on the incoming key. Only enforce strict credit score checks if `%is_draft = if_abap_behv=>mk-off` (during final activation).",
      "starterCode": "METHOD validateCustomer.\n  LOOP AT keys INTO FINAL(key).\n    \" TODO: Check key-%is_draft\n  ENDLOOP.\nENDMETHOD.",
      "hints": [
        "IF key-%is_draft = if_abap_behv=>mk-off. \" Final save to active DB ENDIF."
      ],
      "solution": "METHOD validateCustomer.\n  READ ENTITIES OF ZI_Travel_M IN LOCAL MODE\n    ENTITY Travel\n    FIELDS ( CustomerID )\n    WITH CORRESPONDING #( keys )\n    RESULT FINAL(lt_travels).\n\n  LOOP AT lt_travels INTO FINAL(ls_travel).\n    \" Allow drafts to save with warnings, but block final active save if customer invalid\n    IF ls_travel-%is_draft = if_abap_behv=>mk-off.\n      SELECT SINGLE FROM i_customer FIELDS customer WHERE customer = @ls_travel-CustomerID INTO @FINAL(lv_found).\n      IF sy-subrc <> 0.\n        APPEND VALUE #( %tky = ls_travel-%tky ) TO failed-travel.\n        APPEND VALUE #(\n          %tky = ls_travel-%tky\n          %msg = new_message_with_text( severity = if_abap_behv_message=>severity-error text = 'Active save rejected: Customer does not exist.' )\n        ) TO reported-travel.\n      ENDIF.\n    ENDIF.\n  ENDLOOP.\nENDMETHOD."
    },
    {
      "id": 8,
      "title": "Exercise 8: Handling HTTP 412 Concurrency Conflicts in React Client",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "In a client JavaScript function, handle an HTTP 412 response from SAP RAP OData V4 by displaying a \"Conflict: Another user updated this record. Reloading latest data...\" toast notification.",
      "starterCode": "// Exercise 8: Handling ETag Concurrency Conflict (HTTP 412)\nasync function updateTravel(travelId, data, etag) {\n  try {\n    // TODO: Send PATCH request with If-Match: etag header\n  } catch (error) {\n    // TODO: Handle 412 status code\n  }\n}",
      "hints": [
        "Check if error.response && error.response.status === 412"
      ],
      "solution": "async function updateTravel(travelId, patchData, currentEtag) {\n  try {\n    const response = await fetch(`/sap/opu/odata4/dmo/ui_travel/srvd/dmo/travel/0001/Travel('${travelId}')`, {\n      method: 'PATCH',\n      headers: {\n        'Content-Type': 'application/json',\n        'If-Match': currentEtag\n      },\n      body: JSON.stringify(patchData)\n    });\n\n    if (response.status === 412) {\n      throw new Error('CONCURRENCY_CONFLICT: Another user updated this record. Please refresh to load the latest data.');\n    }\n\n    return await response.json();\n  } catch (err) {\n    console.error('Update failed:', err.message);\n    throw err;\n  }\n}"
    },
    {
      "id": 9,
      "title": "Exercise 9: Draft Administration Fields Mapping",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Map the standard draft administrative fields in BDEF: `DraftEntityCreationDateTime`, `DraftEntityLastChangeDateTime`, `DraftAdministrativeDataUUID`, and `DraftEntityOperationCode`.",
      "starterCode": "-- Exercise 9: Draft Admin Data Fields\n-- Draft table database mapping definition\nmapping for ztravel_d\n{\n  -- TODO: Map draft admin fields\n}",
      "hints": [
        "Draft admin fields are included automatically in the generated draft table structure"
      ],
      "solution": "mapping for ztravel_d\n{\n  TravelUUID                     = travel_uuid;\n  TravelID                       = travel_id;\n  AgencyID                       = agency_id;\n  CustomerID                     = customer_id;\n  DraftEntityCreationDateTime    = draft_creation_time;\n  DraftEntityLastChangeDateTime  = draft_last_change_time;\n  DraftAdministrativeDataUUID    = draft_admin_uuid;\n  DraftEntityOperationCode       = draft_operation_code;\n}"
    },
    {
      "id": 10,
      "title": "Exercise 10 (Master Capstone): Draft-Enabled Global Supply Chain Contract Authoring Engine",
      "difficulty": "Master Capstone",
      "isCapstone": true,
      "estimatedMinutes": 30,
      "prompt": "THE BIG ONE (COMPREHENSIVE CHAPTER 7 CAPSTONE):\nDesign an Enterprise Draft-Enabled Contract Lifecycle Management Engine:\n1. Multi-level Composition: Root `ZI_Contract_M` with child items `ZI_ContractItem_M`.\n2. BDEF with Draft Architecture:\n   - `with draft;`\n   - Draft tables `zcontract_d` and `zcontract_item_d`.\n   - Lock master with `total etag LastChangedAt` and `etag master LocalLastChangedAt`.\n   - Complete Draft Actions: `Edit`, `Activate optimized`, `Discard`, `Resume`.\n   - `draft determine action Prepare`:\n     * Validation `validateContractDates`: Verifies contract duration is between 30 days and 5 years.\n     * Validation `validateTotalValue`: Verifies total value > 0.\n   - Child entity composition: `association _Items { create; with draft; }`.\n3. Behavior Handler Implementation:\n   - Implement `validateContractDates` with `%is_draft` awareness (allows incomplete drafts, but strictly blocks final activation if duration is invalid).\n4. 100% Clean Core compliant.",
      "starterCode": "\" DAY 7 MASTER CAPSTONE: Draft-Enabled Supply Chain Contracts\nmanaged implementation in class zbp_i_contract_m unique;\nstrict ( 2 );\nwith draft;\n\n-- TODO: Complete BDEF and Behavior Handler Class",
      "hints": [
        "Ensure draft table is specified on both parent and child, and prepare action contains both validations"
      ],
      "solution": "managed implementation in class zbp_i_contract_m unique;\nstrict ( 2 );\nwith draft;\n\ndefine behavior for ZI_Contract_M alias Contract\npersistent table zcontract_db\ndraft table zcontract_d\nlock master total etag LastChangedAt\netag master LocalLastChangedAt\nauthorization master ( instance )\n{\n  field ( readonly, numbering : managed ) ContractUUID;\n  field ( readonly ) CreatedAt, CreatedBy, LastChangedAt, LocalLastChangedAt;\n  field ( mandatory ) VendorID, StartDate, EndDate, TargetValue;\n\n  create;\n  update;\n  delete;\n\n  draft action Edit;\n  draft action Activate optimized;\n  draft action Discard;\n  draft action Resume;\n\n  draft determine action Prepare\n  {\n    validation validateContractDates;\n    validation validateTargetValue;\n  }\n\n  association _Items { create; with draft; }\n}\n\ndefine behavior for ZI_ContractItem_M alias Item\npersistent table zcontract_item_db\ndraft table zcontract_item_d\nlock dependent by _Contract\netag dependent by _Contract\n{\n  field ( readonly, numbering : managed ) ItemUUID;\n  field ( readonly ) ContractUUID;\n  field ( mandatory ) MaterialNumber, Quantity, UnitPrice;\n\n  update;\n  delete;\n\n  association _Contract { with draft; }\n}\n\n/* --- Behavior Handler Class Implementation --- */\nCLASS lhc_contract DEFINITION INHERITING FROM cl_abap_behavior_handler.\n  PRIVATE SECTION.\n    METHODS validateContractDates FOR VALIDATION Contract~validateContractDates IMPORTING keys FOR Contract.\n    METHODS validateTargetValue   FOR VALIDATION Contract~validateTargetValue   IMPORTING keys FOR Contract.\nENDCLASS.\n\nCLASS lhc_contract IMPLEMENTATION.\n  METHOD validateContractDates.\n    READ ENTITIES OF ZI_Contract_M IN LOCAL MODE\n      ENTITY Contract\n      FIELDS ( StartDate EndDate )\n      WITH CORRESPONDING #( keys )\n      RESULT FINAL(lt_contracts).\n\n    LOOP AT lt_contracts INTO FINAL(ls_c).\n      APPEND VALUE #( %tky = ls_c-%tky %state_area = 'CONTRACT_DATES' ) TO reported-contract.\n      FINAL(lv_days) = ls_c-EndDate - ls_c-StartDate.\n\n      \" Enforce strict duration rule only on final active activation\n      IF ls_c-%is_draft = if_abap_behv=>mk-off AND ( lv_days < 30 OR lv_days > 1825 ).\n        APPEND VALUE #( %tky = ls_c-%tky ) TO failed-contract.\n        APPEND VALUE #(\n          %tky        = ls_c-%tky\n          %state_area = 'CONTRACT_DATES'\n          %msg        = new_message_with_text(\n                          severity = if_abap_behv_message=>severity-error\n                          text     = 'Contract duration must be between 30 days and 5 years.' )\n        ) TO reported-contract.\n      ENDIF.\n    ENDLOOP.\n  ENDMETHOD.\n\n  METHOD validateTargetValue.\n    READ ENTITIES OF ZI_Contract_M IN LOCAL MODE\n      ENTITY Contract\n      FIELDS ( TargetValue )\n      WITH CORRESPONDING #( keys )\n      RESULT FINAL(lt_contracts).\n\n    LOOP AT lt_contracts INTO FINAL(ls_c).\n      APPEND VALUE #( %tky = ls_c-%tky %state_area = 'TARGET_VAL' ) TO reported-contract.\n      IF ls_c-%is_draft = if_abap_behv=>mk-off AND ls_c-TargetValue <= 0.\n        APPEND VALUE #( %tky = ls_c-%tky ) TO failed-contract.\n        APPEND VALUE #(\n          %tky        = ls_c-%tky\n          %state_area = 'TARGET_VAL'\n          %msg        = new_message_with_text(\n                          severity = if_abap_behv_message=>severity-error\n                          text     = 'Target value must be strictly greater than zero.' )\n        ) TO reported-contract.\n      ENDIF.\n    ENDLOOP.\n  ENDMETHOD.\nENDCLASS."
    }
  ],
  "day-8-odata-v4": [
    {
      "id": 1,
      "title": "Exercise 1: Creating a Service Definition in CDS",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "Write a Service Definition `ZUI_TRAVEL_UIV4` exposing `ZC_Travel` with alias `Travel`.",
      "starterCode": "@EndUserText.label: 'Travel OData V4 Service'\ndefine service ZUI_TRAVEL_UIV4 {\n  -- TODO: Expose ZC_Travel as Travel\n}",
      "hints": [
        "expose ZC_Travel as Travel;"
      ],
      "solution": "@EndUserText.label: 'Travel OData V4 Service'\ndefine service ZUI_TRAVEL_UIV4 {\n  expose ZC_Travel as Travel;\n}"
    },
    {
      "id": 2,
      "title": "Exercise 2: Exposing Multi-Tier Entities and Value Helps",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Expand `ZUI_TRAVEL_UIV4` to expose child `ZC_Booking as Booking` and master value-help views `ZI_Customer as Customer` and `I_Currency as Currency`.",
      "starterCode": "define service ZUI_TRAVEL_UIV4 {\n  expose ZC_Travel as Travel;\n  -- TODO: Expose Booking, Customer, and Currency\n}",
      "hints": [
        "expose ZC_Booking as Booking; expose ZI_Customer as Customer; expose I_Currency as Currency;"
      ],
      "solution": "@EndUserText.label: 'Travel Full Service with Value Helps'\ndefine service ZUI_TRAVEL_UIV4 {\n  expose ZC_Travel   as Travel;\n  expose ZC_Booking  as Booking;\n  expose ZI_Customer as Customer;\n  expose I_Currency  as Currency;\n}"
    },
    {
      "id": 3,
      "title": "Exercise 3: Inspecting OData V4 Metadata ($metadata)",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Write a curl command to inspect the OData V4 `$metadata` document of service `ZUI_TRAVEL_UIV4` hosted on SAP BTP / S/4HANA.",
      "starterCode": "# Exercise 3: Inspecting $metadata\n# TODO: Write curl command targeting /sap/opu/odata4/sap/zui_travel_uiv4/srvd/sap/zui_travel_uiv4/0001/$metadata",
      "hints": [
        "curl -s -u user:pass \"https://host/sap/opu/odata4/sap/zui_travel_uiv4/srvd/sap/zui_travel_uiv4/0001/\\$metadata\""
      ],
      "solution": "curl -X GET \"https://sandbox.api.sap.com/sap/opu/odata4/sap/zui_travel_uiv4/srvd/sap/zui_travel_uiv4/0001/$metadata\" \\\n  -H \"Accept: application/xml\" \\\n  -H \"APIKey: your-btp-api-key\""
    },
    {
      "id": 4,
      "title": "Exercise 4: OData V4 URL Filtering ($filter and $select)",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Formulate an OData V4 query URL to retrieve `TravelID`, `CustomerID`, and `TotalPrice` for all travels where `TotalPrice ge 5000` and `OverallStatus eq 'A'`.",
      "starterCode": "// Exercise 4: OData V4 Query URL\nconst baseUrl = '/sap/opu/odata4/sap/zui_travel_uiv4/srvd/sap/zui_travel_uiv4/0001/Travel';\n// TODO: Append $select and $filter query parameters",
      "hints": [
        "Use $select=TravelID,CustomerID,TotalPrice and $filter=TotalPrice ge 5000 and OverallStatus eq 'A'"
      ],
      "solution": "const baseUrl = '/sap/opu/odata4/sap/zui_travel_uiv4/srvd/sap/zui_travel_uiv4/0001/Travel';\nconst queryString = '?$select=TravelID,CustomerID,TotalPrice&$filter=TotalPrice ge 5000 and OverallStatus eq 'A'';\nconst fullUrl = `${baseUrl}${queryString}`;"
    },
    {
      "id": 5,
      "title": "Exercise 5: Pagination with $top and $skip",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Write a JavaScript helper function `getPaginatedUrl(pageIndex, pageSize)` that returns an OData V4 URL using `$top` and `$skip` (0-indexed).",
      "starterCode": "// Exercise 5: OData V4 Pagination\nfunction getPaginatedUrl(pageIndex, pageSize) {\n  // TODO: calculate skip and return ?\\$top=...&\\$skip=...\n}",
      "hints": [
        "const skip = pageIndex * pageSize; return `?$top=${pageSize}&$skip=${skip}&$count=true`;"
      ],
      "solution": "function getPaginatedUrl(pageIndex, pageSize) {\n  const skip = pageIndex * pageSize;\n  return `/sap/opu/odata4/sap/zui_travel_uiv4/srvd/sap/zui_travel_uiv4/0001/Travel?$top=${pageSize}&$skip=${skip}&$count=true`;\n}"
    },
    {
      "id": 6,
      "title": "Exercise 6: Deep Expansion with $expand",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Write an OData V4 query URL that fetches a single Travel with its child `_Booking` entities expanded and ordered by `FlightDate desc`.",
      "starterCode": "// Exercise 6: Deep Expansion\n// TODO: Build URL for Travel('1001') with $expand=_Booking($orderby=FlightDate desc)",
      "hints": [
        "/Travel(TravelUUID=...,IsActiveEntity=true)?$expand=_Booking($orderby=FlightDate desc)"
      ],
      "solution": "const travelUUID = 'a89f-1234-5678';\nconst url = `/sap/opu/odata4/sap/zui_travel_uiv4/srvd/sap/zui_travel_uiv4/0001/Travel(TravelUUID=${travelUUID},IsActiveEntity=true)?$expand=_Booking($orderby=FlightDate desc)`;"
    },
    {
      "id": 7,
      "title": "Exercise 7: Sorting and Null Precedence ($orderby)",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Formulate an OData V4 query sorting travels primarily by `BeginDate desc` and secondarily by `TotalPrice asc`.",
      "starterCode": "// Exercise 7: Sorting\nconst url = '/Travel' + // TODO: append $orderby",
      "hints": [
        "?$orderby=BeginDate desc,TotalPrice asc"
      ],
      "solution": "const url = '/sap/opu/odata4/sap/zui_travel_uiv4/srvd/sap/zui_travel_uiv4/0001/Travel?$orderby=BeginDate desc,TotalPrice asc';"
    },
    {
      "id": 8,
      "title": "Exercise 8: Invoking an Action via OData V4 POST",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Write a JavaScript fetch call to invoke the bound action `acceptTravel` on Travel key `1001` via OData V4.",
      "starterCode": "// Exercise 8: Action execution via OData V4\nasync function callAcceptTravel(travelUUID) {\n  // TODO: POST to /Travel(TravelUUID=...)/com.sap.gateway.srvd...acceptTravel\n}",
      "hints": [
        "POST with empty body {} and x-csrf-token header to the action bound URL"
      ],
      "solution": "async function callAcceptTravel(travelUUID, csrfToken) {\n  const url = `/sap/opu/odata4/sap/zui_travel_uiv4/srvd/sap/zui_travel_uiv4/0001/Travel(TravelUUID=${travelUUID},IsActiveEntity=true)/com.sap.gateway.srvd.zui_travel_uiv4.v0001.acceptTravel`;\n  const response = await fetch(url, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json',\n      'x-csrf-token': csrfToken\n    },\n    body: JSON.stringify({})\n  });\n  return await response.json();\n}"
    },
    {
      "id": 9,
      "title": "Exercise 9: OData V4 Batch Processing ($batch) Specification",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 15,
      "prompt": "Explain the structure of an OData V4 multipart `$batch` request containing two PATCH operations in a single changeset.",
      "starterCode": "/* Exercise 9: OData V4 $batch request payload\nContent-Type: multipart/mixed; boundary=batch_123\n\n--batch_123\n-- TODO: write changeset block with two PATCH requests\n--batch_123--\n*/",
      "hints": [
        "Each changeset has Content-Type: multipart/mixed; boundary=changeset_abc"
      ],
      "solution": "/* OData V4 Multipart Batch Format */\n// POST /sap/opu/odata4/sap/zui_travel_uiv4/srvd/sap/zui_travel_uiv4/0001/$batch\n// Headers: Content-Type: multipart/mixed; boundary=batch_boundary\n\n--batch_boundary\nContent-Type: multipart/mixed; boundary=changeset_boundary\n\n--changeset_boundary\nContent-Type: application/http\nContent-Transfer-Encoding: binary\n\nPATCH Travel(TravelUUID=uuid-1,IsActiveEntity=true) HTTP/1.1\nContent-Type: application/json\nIf-Match: W/\"20261120\"\n\n{ \"OverallStatus\": \"A\" }\n\n--changeset_boundary\nContent-Type: application/http\nContent-Transfer-Encoding: binary\n\nPATCH Travel(TravelUUID=uuid-2,IsActiveEntity=true) HTTP/1.1\nContent-Type: application/json\nIf-Match: W/\"20261120\"\n\n{ \"OverallStatus\": \"A\" }\n\n--changeset_boundary--\n--batch_boundary--"
    },
    {
      "id": 10,
      "title": "Exercise 10 (Master Capstone): Enterprise Multi-Entity OData V4 RESTful Gateway",
      "difficulty": "Master Capstone",
      "isCapstone": true,
      "estimatedMinutes": 30,
      "prompt": "THE BIG ONE (COMPREHENSIVE CHAPTER 8 CAPSTONE):\nDesign an Enterprise OData V4 Gateway Architecture for a Global Sales & Delivery platform:\n1. CDS Service Definition `ZUI_SALES_GATEWAY_V4`:\n   - Expose root Sales Order `ZC_SalesOrder as SalesOrder`.\n   - Expose child Sales Order Items `ZC_SalesOrderItem as SalesOrderItem`.\n   - Expose Delivery Schedule `ZC_DeliverySchedule as DeliverySchedule`.\n   - Expose Customer and Product master value-helps.\n2. Formulate 4 production curl / fetch API integration test requests:\n   - Query 1: Filter active orders created in 2026 with gross amount > 25,000, expanded with line items.\n   - Query 2: Retrieve paginated items (page 3, 20 items per page) sorted by DeliveryDate.\n   - Query 3: Execute bound custom action `releaseForShipping`.\n   - Query 4: Delta PATCH updating ShippingInstructions with ETag validation.\n3. Clean Core & OData V4 specification certified.",
      "starterCode": "\" DAY 8 MASTER CAPSTONE: Enterprise OData V4 Gateway\n@EndUserText.label: 'Sales & Delivery Enterprise Gateway'\ndefine service ZUI_SALES_GATEWAY_V4 {\n  -- TODO: Expose business entities and value-helps\n}\n\n/* API Integration Test Suite (JavaScript / curl) */\n// TODO: Document queries 1 through 4",
      "hints": [
        "Use clean aliases: SalesOrder, SalesOrderItem, DeliverySchedule"
      ],
      "solution": "@EndUserText.label: 'Sales & Delivery Enterprise Gateway'\ndefine service ZUI_SALES_GATEWAY_V4 {\n  expose ZC_SalesOrder        as SalesOrder;\n  expose ZC_SalesOrderItem    as SalesOrderItem;\n  expose ZC_DeliverySchedule  as DeliverySchedule;\n  expose ZI_Customer          as Customer;\n  expose ZI_Product           as Product;\n}\n\n/* =========================================================================\n   ENTERPRISE ODATA V4 API INTEGRATION TEST SUITE\n========================================================================= */\n\n// 1. Filter Orders > 25k created in 2026 with Items Expanded:\n// GET /SalesOrder?$filter=CreationDate ge 2026-01-01 and GrossAmount gt 25000&$expand=_Item($select=ItemNumber,Material,Quantity,NetPrice)\n\n// 2. Server-side Paginated Schedule (Page 3, 20 rows/page, sorted by DeliveryDate):\n// GET /DeliverySchedule?$top=20&$skip=40&$count=true&$orderby=DeliveryDate asc\n\n// 3. Trigger Bound Custom Action:\n// POST /SalesOrder(OrderUUID=d92a-4321,IsActiveEntity=true)/com.sap.gateway.srvd.zui_sales_gateway_v4.v0001.releaseForShipping\n// Headers: x-csrf-token: <token>, Content-Type: application/json\n// Body: {}\n\n// 4. Concurrency-Safe Delta PATCH:\n// PATCH /SalesOrder(OrderUUID=d92a-4321,IsActiveEntity=true)\n// Headers: If-Match: W/\"etag-value\", Content-Type: application/json\n// Body: { \"ShippingInstructions\": \"Expedite delivery via air freight\" }"
    }
  ],
  "day-9-react-service": [
    {
      "id": 1,
      "title": "Exercise 1: Vite Proxy Configuration for SAP Backend",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "Write the `server.proxy` block in `vite.config.js` to route all `/sap` API calls to `https://s4hana-sandbox.corp:44300` with `changeOrigin: true` and `secure: false`.",
      "starterCode": "// Exercise 1: vite.config.js proxy\nimport { defineConfig } from 'vite';\n\nexport default defineConfig({\n  server: {\n    // TODO: Configure proxy for /sap\n  }\n});",
      "hints": [
        "proxy: { '/sap': { target: 'https://s4hana-sandbox.corp:44300', changeOrigin: true, secure: false } }"
      ],
      "solution": "import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    proxy: {\n      '/sap': {\n        target: 'https://s4hana-sandbox.corp:44300',\n        changeOrigin: true,\n        secure: false\n      }\n    }\n  }\n});"
    },
    {
      "id": 2,
      "title": "Exercise 2: Axios Client with Credential & Header Defaults",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Create an Axios instance `sapApiClient` with `baseURL: '/sap/opu/odata4/sap/zui_travel_uiv4/srvd/sap/zui_travel_uiv4/0001'`, `withCredentials: true`, and default JSON headers.",
      "starterCode": "// Exercise 2: Axios SAP Client\nimport axios from 'axios';\n\n// TODO: Create and export sapApiClient",
      "hints": [
        "axios.create({ baseURL: ..., withCredentials: true, headers: { 'Accept': 'application/json' } })"
      ],
      "solution": "import axios from 'axios';\n\nexport const sapApiClient = axios.create({\n  baseURL: '/sap/opu/odata4/sap/zui_travel_uiv4/srvd/sap/zui_travel_uiv4/0001',\n  withCredentials: true,\n  headers: {\n    'Accept': 'application/json',\n    'Content-Type': 'application/json'\n  }\n});"
    },
    {
      "id": 3,
      "title": "Exercise 3: X-CSRF-Token Handshake Implementation",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Write an async function `fetchCsrfToken()` that sends a `HEAD` or `GET` request with header `x-csrf-token: fetch`, extracts `response.headers['x-csrf-token']`, and stores it.",
      "starterCode": "// Exercise 3: CSRF Handshake\nlet cachedToken = null;\n\nexport async function fetchCsrfToken() {\n  // TODO: Send GET with x-csrf-token: fetch and return token\n}",
      "hints": [
        "const res = await sapApiClient.get('/', { headers: { 'x-csrf-token': 'fetch' } }); return res.headers['x-csrf-token'];"
      ],
      "solution": "let cachedToken = null;\n\nexport async function fetchCsrfToken() {\n  if (cachedToken) return cachedToken;\n\n  const response = await sapApiClient.get('/', {\n    headers: { 'x-csrf-token': 'fetch' }\n  });\n\n  cachedToken = response.headers['x-csrf-token'] || response.headers['X-CSRF-TOKEN'];\n  return cachedToken;\n}"
    },
    {
      "id": 4,
      "title": "Exercise 4: Axios Request Interceptor for CSRF Injection",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Attach an Axios request interceptor to `sapApiClient` that automatically attaches the CSRF token to any mutating HTTP method (`POST`, `PUT`, `PATCH`, `DELETE`).",
      "starterCode": "// Exercise 4: Request Interceptor\nsapApiClient.interceptors.request.use(async (config) => {\n  // TODO: If method is mutating, fetch and attach x-csrf-token\n  return config;\n});",
      "hints": [
        "const mutating = ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase());"
      ],
      "solution": "sapApiClient.interceptors.request.use(async (config) => {\n  const method = config.method?.toLowerCase();\n  if (['post', 'put', 'patch', 'delete'].includes(method)) {\n    const token = await fetchCsrfToken();\n    if (token) {\n      config.headers['x-csrf-token'] = token;\n    }\n  }\n  return config;\n});"
    },
    {
      "id": 5,
      "title": "Exercise 5: Building OData V4 Query Strings in JavaScript",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Write a utility function `buildODataQuery({ select, filter, top, skip, orderby })` that safely constructs the URL query string.",
      "starterCode": "// Exercise 5: Query String Builder\nexport function buildODataQuery(params) {\n  // TODO: Return query string starting with ?\n}",
      "hints": [
        "const q = []; if (params.top) q.push(`$top=${params.top}`); return q.length ? `?${q.join('&')}` : '';"
      ],
      "solution": "export function buildODataQuery({ select, filter, top, skip, orderby } = {}) {\n  const parts = [];\n  if (select && select.length) parts.push(`$select=${select.join(',')}`);\n  if (filter) parts.push(`$filter=${encodeURIComponent(filter)}`);\n  if (top !== undefined) parts.push(`$top=${top}`);\n  if (skip !== undefined) parts.push(`$skip=${skip}`);\n  if (orderby) parts.push(`$orderby=${encodeURIComponent(orderby)}`);\n  return parts.length ? `?${parts.join('&')}` : '';\n}"
    },
    {
      "id": 6,
      "title": "Exercise 6: Fetching and Unwrapping OData V4 Collections",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Write an async function `getTravels(queryParams)` that fetches `/Travel`, unwraps `response.data.value`, and extracts total count from `@odata.count`.",
      "starterCode": "// Exercise 6: Fetch Travels\nexport async function getTravels(queryParams) {\n  // TODO: Fetch and return { items: data.value, totalCount: data['@odata.count'] }\n}",
      "hints": [
        "const res = await sapApiClient.get(`/Travel${query}`); return { items: res.data.value, totalCount: res.data['@odata.count'] };"
      ],
      "solution": "export async function getTravels(queryParams = {}) {\n  const query = buildODataQuery(queryParams);\n  const response = await sapApiClient.get(`/Travel${query}`);\n  return {\n    items: response.data.value || [],\n    totalCount: response.data['@odata.count'] || response.data.value?.length || 0\n  };\n}"
    },
    {
      "id": 7,
      "title": "Exercise 7: React Custom Hook (useODataEntity)",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 15,
      "prompt": "Write a React custom hook `useODataEntity(entityName, queryParams)` that manages `data`, `loading`, `error`, and `refetch` state.",
      "starterCode": "// Exercise 7: React Custom Hook\nimport { useState, useEffect } from 'react';\n\nexport function useODataEntity(entityName, queryParams) {\n  // TODO: Implement loading, data, error state\n}",
      "hints": [
        "Fetch in useEffect, catch errors, return { data, loading, error, refetch }"
      ],
      "solution": "import { useState, useEffect, useCallback } from 'react';\nimport { sapApiClient } from './apiClient';\nimport { buildODataQuery } from './queryBuilder';\n\nexport function useODataEntity(entityName, queryParams = {}) {\n  const [data, setData] = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  const fetchData = useCallback(async () => {\n    setLoading(true);\n    setError(null);\n    try {\n      const q = buildODataQuery(queryParams);\n      const res = await sapApiClient.get(`/${entityName}${q}`);\n      setData(res.data.value || res.data);\n    } catch (err) {\n      setError(err.message || 'Error fetching data');\n    } finally {\n      setLoading(false);\n    }\n  }, [entityName, JSON.stringify(queryParams)]);\n\n  useEffect(() => {\n    fetchData();\n  }, [fetchData]);\n\n  return { data, loading, error, refetch: fetchData };\n}"
    },
    {
      "id": 8,
      "title": "Exercise 8: Handling CSRF Token Expiration (Auto-Refresh)",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Add an Axios response interceptor that detects HTTP 403 with `x-csrf-token: Required`, fetches a fresh token, and automatically retries the failed request once.",
      "starterCode": "// Exercise 8: CSRF Auto-Refresh Interceptor\nsapApiClient.interceptors.response.use(\n  (res) => res,\n  async (err) => {\n    // TODO: If 403 and CSRF expired, refresh token and retry\n  }\n);",
      "hints": [
        "Check if err.response?.status === 403. Reset cachedToken = null. Get fresh token and retry with err.config."
      ],
      "solution": "sapApiClient.interceptors.response.use(\n  (response) => response,\n  async (error) => {\n    const originalRequest = error.config;\n    if (error.response?.status === 403 && !originalRequest._retry) {\n      originalRequest._retry = true;\n      cachedToken = null; // Invalidate old token\n      const freshToken = await fetchCsrfToken();\n      originalRequest.headers['x-csrf-token'] = freshToken;\n      return sapApiClient(originalRequest);\n    }\n    return Promise.reject(error);\n  }\n);"
    },
    {
      "id": 9,
      "title": "Exercise 9: Unit Testing React OData Client with Vitest & MSW",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 15,
      "prompt": "Write a Vitest unit test mocking `/Travel` with Mock Service Worker (MSW) and verifying that `getTravels` returns the expected array.",
      "starterCode": "// Exercise 9: Vitest OData Client Test\nimport { describe, it, expect } from 'vitest';\nimport { getTravels } from './travelService';\n\ndescribe('getTravels', () => {\n  it('unwraps OData V4 value array', async () => {\n    // TODO: test getTravels()\n  });\n});",
      "hints": [
        "Use mock data { value: [{ TravelID: '1' }] } and assert length === 1"
      ],
      "solution": "import { describe, it, expect, vi } from 'vitest';\nimport { sapApiClient } from './apiClient';\nimport { getTravels } from './travelService';\n\ndescribe('getTravels service test', () => {\n  it('unwraps OData V4 value array correctly', async () => {\n    vi.spyOn(sapApiClient, 'get').mockResolvedValueOnce({\n      data: {\n        value: [\n          { TravelUUID: 'uuid-1', TravelID: '00000001', TotalPrice: 1500 }\n        ],\n        '@odata.count': 1\n      }\n    });\n\n    const result = await getTravels();\n    expect(result.items).toHaveLength(1);\n    expect(result.items[0].TravelID).toBe('00000001');\n    expect(result.totalCount).toBe(1);\n  });\n});"
    },
    {
      "id": 10,
      "title": "Exercise 10 (Master Capstone): Complete React Enterprise Client Connector for SAP RAP OData V4",
      "difficulty": "Master Capstone",
      "isCapstone": true,
      "estimatedMinutes": 30,
      "prompt": "THE BIG ONE (COMPREHENSIVE CHAPTER 9 CAPSTONE):\nBuild a production-grade TypeScript/JavaScript React Client Architecture for SAP RAP OData V4:\n1. Resilient Axios client:\n   - Configurable baseURL and withCredentials.\n   - Dynamic CSRF token acquisition with auto-refresh retry on 403.\n   - Request timeout (10s) and correlation ID header injection.\n2. OData V4 Query Builder supporting `$filter`, `$select`, `$expand`, `$top`, `$skip`, and `$orderby`.\n3. Generic CRUD service operations:\n   - `fetchCollection(entity, query)`\n   - `fetchSingle(entity, key, expand)`\n   - `createEntity(entity, payload)`\n   - `patchEntity(entity, key, deltaPayload, etag)`\n   - `executeAction(entity, key, actionName, params)`\n4. Custom React Hook `useODataCollection` with pagination, loading, error, and optimistic updates.\n5. 100% type-safe, error-handled Clean Core client.",
      "starterCode": "\" DAY 9 MASTER CAPSTONE: React Enterprise OData V4 Connector\n// TODO: Implement full client module with CSRF handshake, query builder, and React hook",
      "hints": [
        "Combine interceptors, unwrap data.value, and handle ETag If-Match in patchEntity"
      ],
      "solution": "import axios from 'axios';\nimport { useState, useEffect, useCallback } from 'react';\n\n// 1. Resilient Axios Instance\nexport const sapClient = axios.create({\n  baseURL: '/sap/opu/odata4/sap/zui_travel_uiv4/srvd/sap/zui_travel_uiv4/0001',\n  withCredentials: true,\n  timeout: 10000,\n  headers: {\n    'Accept': 'application/json',\n    'Content-Type': 'application/json'\n  }\n});\n\nlet csrfToken = null;\n\nasync function getCsrfToken() {\n  if (csrfToken) return csrfToken;\n  const res = await sapClient.get('/', { headers: { 'x-csrf-token': 'fetch' } });\n  csrfToken = res.headers['x-csrf-token'] || res.headers['X-CSRF-TOKEN'];\n  return csrfToken;\n}\n\nsapClient.interceptors.request.use(async (config) => {\n  const method = config.method?.toLowerCase();\n  if (['post', 'patch', 'put', 'delete'].includes(method)) {\n    const token = await getCsrfToken();\n    if (token) config.headers['x-csrf-token'] = token;\n  }\n  return config;\n});\n\nsapClient.interceptors.response.use(\n  res => res,\n  async error => {\n    if (error.response?.status === 403 && !error.config._retry) {\n      error.config._retry = true;\n      csrfToken = null;\n      const newToken = await getCsrfToken();\n      error.config.headers['x-csrf-token'] = newToken;\n      return sapClient(error.config);\n    }\n    return Promise.reject(error);\n  }\n);\n\n// 2. Generic OData Operations\nexport const ODataService = {\n  async fetchList(entity, query = '') {\n    const res = await sapClient.get(`/${entity}${query}`);\n    return { items: res.data.value || [], count: res.data['@odata.count'] };\n  },\n  async create(entity, payload) {\n    const res = await sapClient.post(`/${entity}`, payload);\n    return res.data;\n  },\n  async patch(entity, key, delta, etag) {\n    const headers = etag ? { 'If-Match': etag } : {};\n    const res = await sapClient.patch(`/${entity}(${key})`, delta, { headers });\n    return res.data;\n  },\n  async executeAction(entity, key, actionName, params = {}) {\n    const url = `/${entity}(${key})/${actionName}`;\n    const res = await sapClient.post(url, params);\n    return res.data;\n  }\n};\n\n// 3. React Hook\nexport function useODataCollection(entity, queryString = '') {\n  const [data, setData] = useState([]);\n  const [count, setCount] = useState(0);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  const load = useCallback(async () => {\n    setLoading(true);\n    try {\n      const res = await ODataService.fetchList(entity, queryString);\n      setData(res.items);\n      setCount(res.count);\n    } catch (err) {\n      setError(err.message || 'Fetch failed');\n    } finally {\n      setLoading(false);\n    }\n  }, [entity, queryString]);\n\n  useEffect(() => { load(); }, [load]);\n  return { data, count, loading, error, refetch: load };\n}"
    }
  ],
  "day-10-react-forms-errors": [
    {
      "id": 1,
      "title": "Exercise 1: Controlled Form Input with Validation Feedback",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "Create a controlled React text input for `customerEmail` with live validation displaying an error message if the input does not contain `@`.",
      "starterCode": "// Exercise 1: Controlled Input\nimport React, { useState } from 'react';\n\nexport function EmailInput() {\n  const [email, setEmail] = useState('');\n  // TODO: validate and render input with error message\n}",
      "hints": [
        "const isInvalid = email.length > 0 && !email.includes('@');"
      ],
      "solution": "import React, { useState } from 'react';\n\nexport function EmailInput() {\n  const [email, setEmail] = useState('');\n  const isInvalid = email.length > 0 && !email.includes('@');\n\n  return (\n    <div className=\"space-y-1\">\n      <label className=\"text-xs font-semibold text-slate-700\">Customer Email:</label>\n      <input\n        type=\"email\"\n        value={email}\n        onChange={(e) => setEmail(e.target.value)}\n        className={`px-3 py-2 border rounded-xl text-xs w-full ${isInvalid ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}\n        placeholder=\"user@example.com\"\n      />\n      {isInvalid && <p className=\"text-[11px] text-red-600\">Please enter a valid email address.</p>}\n    </div>\n  );\n}"
    },
    {
      "id": 2,
      "title": "Exercise 2: Computing Delta Changes (Diff Engine)",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Write a pure JavaScript function `getDeltaChanges(initialData, currentData)` that returns an object containing ONLY the keys that were modified.",
      "starterCode": "// Exercise 2: Delta calculation\nexport function getDeltaChanges(initialData, currentData) {\n  // TODO: Return object with only changed fields\n}",
      "hints": [
        "Loop over Object.keys(currentData) and compare with initialData[k]"
      ],
      "solution": "export function getDeltaChanges(initialData, currentData) {\n  const delta = {};\n  for (const key of Object.keys(currentData)) {\n    if (currentData[key] !== initialData[key]) {\n      delta[key] = currentData[key];\n    }\n  }\n  return delta;\n}"
    },
    {
      "id": 3,
      "title": "Exercise 3: Sending Delta PATCH Request with ETag",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Write an async function `patchTravel(uuid, delta, etag)` that executes an HTTP `PATCH` request with the `If-Match` header to update the entity.",
      "starterCode": "// Exercise 3: Delta PATCH\nexport async function patchTravel(uuid, delta, etag) {\n  // TODO: Send PATCH request with If-Match: etag\n}",
      "hints": [
        "Use headers: { 'If-Match': etag, 'Content-Type': 'application/json' }"
      ],
      "solution": "export async function patchTravel(uuid, delta, etag) {\n  const response = await fetch(`/sap/opu/odata4/sap/zui_travel_uiv4/srvd/sap/zui_travel_uiv4/0001/Travel(TravelUUID=${uuid},IsActiveEntity=true)`, {\n    method: 'PATCH',\n    headers: {\n      'Content-Type': 'application/json',\n      'If-Match': etag\n    },\n    body: JSON.stringify(delta)\n  });\n\n  if (!response.ok) {\n    const errorJson = await response.json();\n    throw errorJson;\n  }\n\n  return await response.json();\n}"
    },
    {
      "id": 4,
      "title": "Exercise 4: Parsing SAP Backend Error Payloads",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Write a parser function `parseSapErrors(errorResponse)` that handles standard SAP OData V4 error JSON structures and returns an array of user-friendly error strings.",
      "starterCode": "// Exercise 4: Parse SAP Error JSON\nexport function parseSapErrors(errorResponse) {\n  // TODO: Extract message from error.message, error.details, or innererror\n}",
      "hints": [
        "Check errorResponse?.error?.message and errorResponse?.error?.details"
      ],
      "solution": "export function parseSapErrors(errorResponse) {\n  const errors = [];\n  const err = errorResponse?.error || errorResponse;\n\n  if (err?.message) {\n    errors.push(err.message);\n  }\n\n  if (Array.isArray(err?.details)) {\n    for (const d of err.details) {\n      if (d.message) errors.push(d.message);\n    }\n  }\n\n  return errors.length ? errors : ['An unexpected error occurred while saving to SAP.'];\n}"
    },
    {
      "id": 5,
      "title": "Exercise 5: Mapping SAP Backend Errors to Form Input Targets",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Write a function `mapErrorsToFields(sapErrorDetails)` that inspects `target` properties (e.g. `target: \"BeginDate\"`) and returns an object `{ BeginDate: \"End date before begin date\" }`.",
      "starterCode": "// Exercise 5: Field Error Mapping\nexport function mapErrorsToFields(sapErrorDetails) {\n  // TODO: Map target field to error message\n}",
      "hints": [
        "const map = {}; details.forEach(d => { if (d.target) map[d.target] = d.message; }); return map;"
      ],
      "solution": "export function mapErrorsToFields(sapErrorDetails = []) {\n  const fieldErrors = {};\n  if (!Array.isArray(sapErrorDetails)) return fieldErrors;\n\n  for (const detail of sapErrorDetails) {\n    if (detail.target) {\n      // Handle targets like 'Travel/BeginDate' or plain 'BeginDate'\n      const cleanField = detail.target.split('/').pop();\n      fieldErrors[cleanField] = detail.message;\n    }\n  }\n  return fieldErrors;\n}"
    },
    {
      "id": 6,
      "title": "Exercise 6: Submitting New Entity via OData V4 POST",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Create an async function `createTravel(formData)` that validates required fields on the client before issuing a `POST` request to `/Travel`.",
      "starterCode": "// Exercise 6: Create Travel\nexport async function createTravel(formData) {\n  // TODO: Validate required fields (CustomerID, BeginDate, EndDate) and POST\n}",
      "hints": [
        "Throw Error if CustomerID is missing, then POST JSON"
      ],
      "solution": "export async function createTravel(formData) {\n  if (!formData.CustomerID) throw new Error('Customer ID is required.');\n  if (!formData.BeginDate) throw new Error('Begin Date is required.');\n\n  const res = await fetch('/sap/opu/odata4/sap/zui_travel_uiv4/srvd/sap/zui_travel_uiv4/0001/Travel', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(formData)\n  });\n\n  if (!res.ok) throw await res.json();\n  return await res.json();\n}"
    },
    {
      "id": 7,
      "title": "Exercise 7: Optimistic UI Updates with Rollback on Failure",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "In a React component, optimistically toggle a travel's status in local state before the PATCH request completes, and roll back if the server rejects the update.",
      "starterCode": "// Exercise 7: Optimistic Update\nasync function handleStatusToggle(travelId, newStatus) {\n  const prevItems = [...items];\n  // TODO: Optimistically update items, call API, rollback on catch\n}",
      "hints": [
        "setItems(items.map(t => t.id === travelId ? { ...t, status: newStatus } : t))",
        "In catch: setItems(prevItems)"
      ],
      "solution": "async function handleStatusToggle(travelId, newStatus) {\n  const previousState = [...items];\n\n  // 1. Optimistic UI update\n  setItems(prev => prev.map(item =>\n    item.TravelID === travelId ? { ...item, OverallStatus: newStatus } : item\n  ));\n\n  try {\n    // 2. Call server\n    await patchTravel(travelId, { OverallStatus: newStatus });\n  } catch (err) {\n    // 3. Rollback on failure\n    setItems(previousState);\n    alert('Failed to update status on SAP backend: ' + err.message);\n  }\n}"
    },
    {
      "id": 8,
      "title": "Exercise 8: Modal Confirmation for Deletion",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Implement a reusable React confirmation modal that prompts \"Are you sure you want to delete Travel #{id}?\" before executing an HTTP `DELETE`.",
      "starterCode": "// Exercise 8: Delete Modal\nexport function DeleteConfirmModal({ isOpen, travelId, onConfirm, onCancel }) {\n  if (!isOpen) return null;\n  // TODO: Render confirmation UI with Cancel and Delete buttons\n}",
      "hints": [
        "Render modal overlay with fixed inset-0 z-50"
      ],
      "solution": "export function DeleteConfirmModal({ isOpen, travelId, onConfirm, onCancel }) {\n  if (!isOpen) return null;\n\n  return (\n    <div className=\"fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4\">\n      <div className=\"bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl\">\n        <h3 className=\"text-sm font-bold text-slate-900\">Confirm Deletion</h3>\n        <p className=\"text-xs text-slate-600\">Are you sure you want to permanently delete Travel #{travelId}? This cannot be undone.</p>\n        <div className=\"flex justify-end gap-2 pt-2\">\n          <button onClick={onCancel} className=\"px-3 py-1.5 text-xs rounded-xl bg-slate-100 hover:bg-slate-200\">Cancel</button>\n          <button onClick={onConfirm} className=\"px-3 py-1.5 text-xs rounded-xl bg-red-600 text-white font-bold hover:bg-red-500\">Delete</button>\n        </div>\n      </div>\n    </div>\n  );\n}"
    },
    {
      "id": 9,
      "title": "Exercise 9: Handling Currency and Date Conversions",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Write helper functions to convert between SAP ISO dates (`YYYY-MM-DD`) and HTML date input formats, and to format currency amounts for display.",
      "starterCode": "// Exercise 9: Date and Currency Helpers\nexport function formatSapDate(isoDateString) { ... }\nexport function formatCurrency(amount, currencyCode) { ... }",
      "hints": [
        "Use Intl.NumberFormat for currency"
      ],
      "solution": "export function formatSapDate(isoDateString) {\n  if (!isoDateString) return '';\n  const [year, month, day] = isoDateString.split('-');\n  return `${month}/${day}/${year}`;\n}\n\nexport function formatCurrency(amount, currencyCode = 'USD') {\n  return new Intl.NumberFormat('en-US', {\n    style: 'currency',\n    currency: currencyCode\n  }).format(amount || 0);\n}"
    },
    {
      "id": 10,
      "title": "Exercise 10 (Master Capstone): Full-Fledged React Enterprise Travel Booking CRUD Workspace",
      "difficulty": "Master Capstone",
      "isCapstone": true,
      "estimatedMinutes": 30,
      "prompt": "THE BIG ONE (COMPREHENSIVE CHAPTER 10 CAPSTONE):\nBuild a complete React Master-Detail CRUD Workspace component for SAP RAP Travel Bookings:\n1. Master List View:\n   - Displays table of travels (ID, Customer, Dates, Price, Status).\n   - Search bar filtering by CustomerID or Description.\n   - Status badge with color coding (Green for 'A', Blue for 'O', Red for 'X').\n2. Detail Drawer / Modal:\n   - Form inputs for Description, CustomerID, BeginDate, EndDate, TotalPrice.\n   - Live delta calculation: only sends modified fields via `PATCH` with `If-Match: etag`.\n3. Error Management:\n   - Captures SAP OData V4 errors and displays field-level validation borders (red outline on invalid fields).\n   - Global alert banner for general messages.\n4. Optimistic UI updates with rollback on network failure.\n5. 100% accessible, responsive, and Clean Core compliant.",
      "starterCode": "\" DAY 10 MASTER CAPSTONE: React Enterprise Travel CRUD Workspace\n// TODO: Implement full React Master-Detail CRUD Workspace with Delta PATCH and Error Handlers",
      "hints": [
        "Store initialData and formData in state to compute delta changes on submit"
      ],
      "solution": "import React, { useState } from 'react';\n\nexport function TravelCrudWorkspace({ initialTravels = [] }) {\n  const [travels, setTravels] = useState(initialTravels);\n  const [selectedTravel, setSelectedTravel] = useState(null);\n  const [formData, setFormData] = useState({});\n  const [fieldErrors, setFieldErrors] = useState({});\n  const [globalError, setGlobalError] = useState(null);\n  const [saving, setSaving] = useState(false);\n\n  const handleSelect = (travel) => {\n    setSelectedTravel(travel);\n    setFormData({ ...travel });\n    setFieldErrors({});\n    setGlobalError(null);\n  };\n\n  const handleSave = async () => {\n    setSaving(true);\n    setFieldErrors({});\n    setGlobalError(null);\n\n    // Compute delta diff\n    const delta = {};\n    for (const k of Object.keys(formData)) {\n      if (formData[k] !== selectedTravel[k]) delta[k] = formData[k];\n    }\n\n    if (Object.keys(delta).length === 0) {\n      setSaving(false);\n      setSelectedTravel(null);\n      return;\n    }\n\n    // Optimistic update\n    const previousState = [...travels];\n    setTravels(prev => prev.map(t => t.TravelUUID === selectedTravel.TravelUUID ? { ...t, ...delta } : t));\n\n    try {\n      const res = await fetch(`/sap/opu/odata4/sap/zui_travel_uiv4/srvd/sap/zui_travel_uiv4/0001/Travel(TravelUUID=${selectedTravel.TravelUUID},IsActiveEntity=true)`, {\n        method: 'PATCH',\n        headers: {\n          'Content-Type': 'application/json',\n          'If-Match': selectedTravel.LocalLastChangedAt || '*'\n        },\n        body: JSON.stringify(delta)\n      });\n\n      if (!res.ok) {\n        const errorJson = await res.json();\n        throw errorJson;\n      }\n\n      setSelectedTravel(null);\n    } catch (err) {\n      setTravels(previousState); // Rollback\n      setGlobalError(err?.error?.message || 'Update failed');\n      if (err?.error?.details) {\n        const errors = {};\n        err.error.details.forEach(d => { if (d.target) errors[d.target] = d.message; });\n        setFieldErrors(errors);\n      }\n    } finally {\n      setSaving(false);\n    }\n  };\n\n  return (\n    <div className=\"p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-6\">\n      <div className=\"flex justify-between items-center\">\n        <h2 className=\"text-base font-bold text-slate-900\">SAP RAP Travel Master-Detail Studio</h2>\n        <span className=\"text-xs font-mono text-slate-500\">{travels.length} records</span>\n      </div>\n\n      {globalError && (\n        <div className=\"p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700\">\n          <strong>SAP Error:</strong> {globalError}\n        </div>\n      )}\n\n      {/* Master List */}\n      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-3\">\n        {travels.map(t => (\n          <div\n            key={t.TravelUUID}\n            onClick={() => handleSelect(t)}\n            className=\"p-4 bg-white rounded-2xl border border-slate-200 hover:border-sky-500 cursor-pointer transition space-y-1 shadow-xs\"\n          >\n            <div className=\"flex justify-between text-xs font-bold\">\n              <span>Travel #{t.TravelID}</span>\n              <span className={`px-2 py-0.5 rounded text-[10px] ${t.OverallStatus === 'A' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}`}>\n                {t.OverallStatus === 'A' ? 'Accepted' : 'Open'}\n              </span>\n            </div>\n            <p className=\"text-xs text-slate-600\">{t.Description}</p>\n            <p className=\"text-xs font-mono text-slate-500\">{t.TotalPrice} {t.CurrencyCode}</p>\n          </div>\n        ))}\n      </div>\n\n      {/* Edit Drawer Modal */}\n      {selectedTravel && (\n        <div className=\"fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4\">\n          <div className=\"bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl\">\n            <h3 className=\"text-sm font-bold text-slate-900\">Edit Travel #{selectedTravel.TravelID}</h3>\n            <div className=\"space-y-3\">\n              <div>\n                <label className=\"text-[11px] font-semibold text-slate-600\">Description</label>\n                <input\n                  type=\"text\"\n                  value={formData.Description || ''}\n                  onChange={e => setFormData({ ...formData, Description: e.target.value })}\n                  className={`w-full text-xs p-2.5 rounded-xl border ${fieldErrors.Description ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}\n                />\n                {fieldErrors.Description && <p className=\"text-[10px] text-red-600 mt-0.5\">{fieldErrors.Description}</p>}\n              </div>\n\n              <div>\n                <label className=\"text-[11px] font-semibold text-slate-600\">Total Price</label>\n                <input\n                  type=\"number\"\n                  value={formData.TotalPrice || ''}\n                  onChange={e => setFormData({ ...formData, TotalPrice: Number(e.target.value) })}\n                  className=\"w-full text-xs p-2.5 rounded-xl border border-slate-300\"\n                />\n              </div>\n            </div>\n\n            <div className=\"flex justify-end gap-2 pt-2\">\n              <button onClick={() => setSelectedTravel(null)} className=\"px-3 py-2 text-xs rounded-xl bg-slate-100 hover:bg-slate-200\">Cancel</button>\n              <button onClick={handleSave} disabled={saving} className=\"px-4 py-2 text-xs rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-500\">\n                {saving ? 'Saving to SAP...' : 'Save Delta PATCH'}\n              </button>\n            </div>\n          </div>\n        </div>\n      )}\n    </div>\n  );\n}"
    }
  ],
  "day-11-eml-deep-dive": [
    {
      "id": 1,
      "title": "Exercise 1: Basic EML READ ENTITIES OF with Explicit FIELDS",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "Write an EML `READ ENTITIES OF /dmo/i_travel_m` query to read `BeginDate` and `EndDate` for a specific travel key into `RESULT FINAL(lt_travel)`.",
      "starterCode": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_uuid) = 'A1B2C3D4E5F6'.\n  -- TODO: READ ENTITIES OF /dmo/i_travel_m ENTITY Travel FIELDS ( BeginDate EndDate ) ...\nENDMETHOD.",
      "hints": [
        "READ ENTITIES OF /dmo/i_travel_m ENTITY Travel FIELDS ( BeginDate EndDate ) WITH VALUE #( ( travel_uuid = lv_uuid ) ) RESULT FINAL(lt_travel)."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_uuid) = 'A1B2C3D4E5F6'.\n\n  READ ENTITIES OF /dmo/i_travel_m\n    ENTITY Travel\n    FIELDS ( BeginDate EndDate OverallStatus )\n    WITH VALUE #( ( travel_uuid = lv_uuid ) )\n    RESULT FINAL(lt_travel)\n    FAILED FINAL(lt_failed).\n\n  out->write( lt_travel ).\nENDMETHOD."
    },
    {
      "id": 2,
      "title": "Exercise 2: Reading Child Entities By Association",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Use EML `READ ENTITIES OF /dmo/i_travel_m ENTITY Travel BY \\_Booking` to read all child bookings for travel key `lv_uuid`.",
      "starterCode": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_uuid) = 'A1B2C3D4E5F6'.\n  -- TODO: Read bookings by association \\_Booking\nENDMETHOD.",
      "hints": [
        "READ ENTITIES OF /dmo/i_travel_m ENTITY Travel BY \\_Booking ALL FIELDS WITH VALUE #( ( travel_uuid = lv_uuid ) ) RESULT FINAL(lt_bookings)."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_uuid) = 'A1B2C3D4E5F6'.\n\n  READ ENTITIES OF /dmo/i_travel_m\n    ENTITY Travel BY \\_Booking\n    ALL FIELDS\n    WITH VALUE #( ( travel_uuid = lv_uuid ) )\n    RESULT FINAL(lt_bookings)\n    FAILED FINAL(lt_failed).\n\n  out->write( lt_bookings ).\nENDMETHOD."
    },
    {
      "id": 3,
      "title": "Exercise 3: EML MODIFY ENTITIES (Update Fields)",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Write an EML `MODIFY ENTITIES OF /dmo/i_travel_m` query updating `Description = 'Executive Summer Retreat'` on travel key `lv_uuid`.",
      "starterCode": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_uuid) = 'A1B2C3D4E5F6'.\n  -- TODO: MODIFY ENTITIES OF /dmo/i_travel_m ENTITY Travel UPDATE FIELDS ( Description ) ...\nENDMETHOD.",
      "hints": [
        "MODIFY ENTITIES OF /dmo/i_travel_m ENTITY Travel UPDATE FIELDS ( Description ) WITH VALUE #( ( travel_uuid = lv_uuid Description = '...' ) ) FAILED FINAL(lt_failed)."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_uuid) = 'A1B2C3D4E5F6'.\n\n  MODIFY ENTITIES OF /dmo/i_travel_m\n    ENTITY Travel\n    UPDATE FIELDS ( Description )\n    WITH VALUE #( ( travel_uuid = lv_uuid Description = 'Executive Summer Retreat' ) )\n    FAILED FINAL(lt_failed)\n    REPORTED FINAL(lt_reported).\n\n  COMMIT ENTITIES.\n  out->write( 'Travel updated successfully via EML.' ).\nENDMETHOD."
    },
    {
      "id": 4,
      "title": "Exercise 4: EML Create-by-Association (Travel -> Booking)",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Use EML `MODIFY ENTITIES OF ... CREATE BY \\_Booking` to insert a new booking under an existing travel record.",
      "starterCode": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_uuid) = 'A1B2C3D4E5F6'.\n  -- TODO: Create booking by association \\_Booking\nENDMETHOD.",
      "hints": [
        "ENTITY Travel CREATE BY \\_Booking FIELDS ( CustomerID CarrierID FlightDate FlightPrice CurrencyCode ) WITH VALUE #( ( travel_uuid = lv_uuid %target = VALUE #( ( ... ) ) ) )"
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_uuid) = 'A1B2C3D4E5F6'.\n\n  MODIFY ENTITIES OF /dmo/i_travel_m\n    ENTITY Travel\n    CREATE BY \\_Booking\n    FIELDS ( CustomerID CarrierID ConnectionID FlightDate FlightPrice CurrencyCode )\n    WITH VALUE #( (\n      travel_uuid = lv_uuid\n      %target     = VALUE #( (\n        CustomerID   = '000001'\n        CarrierID    = 'LH'\n        ConnectionID = '0400'\n        FlightDate   = cl_abap_context_info=>get_system_date( ) + 30\n        FlightPrice  = 650\n        CurrencyCode = 'EUR'\n      ) )\n    ) )\n    MAPPED FINAL(lt_mapped)\n    FAILED FINAL(lt_failed).\n\n  COMMIT ENTITIES.\n  out->write( lt_mapped ).\nENDMETHOD."
    },
    {
      "id": 5,
      "title": "Exercise 5: Executing Custom Action via EML",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Trigger the custom instance action `acceptTravel` via EML using `MODIFY ENTITIES OF /dmo/i_travel_m ENTITY Travel EXECUTE acceptTravel FROM ...`.",
      "starterCode": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_uuid) = 'A1B2C3D4E5F6'.\n  -- TODO: EXECUTE acceptTravel action via EML\nENDMETHOD.",
      "hints": [
        "ENTITY Travel EXECUTE acceptTravel FROM VALUE #( ( travel_uuid = lv_uuid ) ) RESULT FINAL(lt_res)"
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_uuid) = 'A1B2C3D4E5F6'.\n\n  MODIFY ENTITIES OF /dmo/i_travel_m\n    ENTITY Travel\n    EXECUTE acceptTravel\n    FROM VALUE #( ( travel_uuid = lv_uuid ) )\n    RESULT FINAL(lt_result)\n    FAILED FINAL(lt_failed)\n    REPORTED FINAL(lt_reported).\n\n  COMMIT ENTITIES.\n  out->write( lt_result ).\nENDMETHOD."
    },
    {
      "id": 6,
      "title": "Exercise 6: Inspecting Failed and Reported in EML",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Write logic that inspects `lt_failed-travel` and formats error messages from `lt_reported-travel` into console text.",
      "starterCode": "METHOD if_oo_adt_classrun~main.\n  -- Given lt_failed and lt_reported from an EML call\n  -- TODO: If lt_failed is not empty, loop over lt_reported and output messages\nENDMETHOD.",
      "hints": [
        "IF lt_failed IS NOT INITIAL. LOOP AT lt_reported-travel INTO FINAL(r). out->write( r-%msg->if_message~get_text( ) ). ENDLOOP. ENDIF."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  \" Check failed keys and output reported messages\n  IF lt_failed-travel IS NOT INITIAL.\n    out->write( |EML execution failed for { lines( lt_failed-travel ) } entity keys.| ).\n    LOOP AT lt_reported-travel INTO FINAL(ls_rep).\n      IF ls_rep-%msg IS BOUND.\n        out->write( |Error: { ls_rep-%msg->if_message~get_text( ) }| ).\n      ENDIF.\n    ENDLOOP.\n  ENDIF.\nENDMETHOD."
    },
    {
      "id": 7,
      "title": "Exercise 7: Using %control Structure in EML Updates",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "In dynamic EML, use the `%control` flag structure to selectively specify which fields to update at runtime.",
      "starterCode": "METHOD if_oo_adt_classrun~main.\n  -- TODO: UPDATE with %control-( Description = if_abap_behv=>mk-on )\nENDMETHOD.",
      "hints": [
        "%control-Description = if_abap_behv=>mk-on"
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  FINAL(lv_uuid) = 'A1B2C3D4E5F6'.\n\n  MODIFY ENTITIES OF /dmo/i_travel_m\n    ENTITY Travel\n    UPDATE FROM VALUE #( (\n      travel_uuid          = lv_uuid\n      Description          = 'Selective update via %control'\n      %control-Description = if_abap_behv=>mk-on\n    ) )\n    FAILED FINAL(lt_failed).\n\n  COMMIT ENTITIES.\nENDMETHOD."
    },
    {
      "id": 8,
      "title": "Exercise 8: Mass Batch Modification (100+ Records)",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 15,
      "prompt": "Given an internal table of 100 travel UUIDs, build an EML `MODIFY ENTITIES` statement using `VALUE #( FOR u IN lt_uuids ( ... ) )` to batch-update all of them in a single call.",
      "starterCode": "METHOD if_oo_adt_classrun~main.\n  -- Given lt_uuids\n  -- TODO: Batch update OverallStatus = 'A' for all UUIDs in single EML call\nENDMETHOD.",
      "hints": [
        "WITH VALUE #( FOR u IN lt_uuids ( travel_uuid = u OverallStatus = 'A' ) )"
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  TYPES tt_uuids TYPE STANDARD TABLE OF sysuuid_x16 WITH EMPTY KEY.\n  FINAL(lt_uuids) = VALUE tt_uuids( ( '1111111111111111' ) ( '2222222222222222' ) ).\n\n  MODIFY ENTITIES OF /dmo/i_travel_m\n    ENTITY Travel\n    UPDATE FIELDS ( OverallStatus )\n    WITH VALUE #( FOR u IN lt_uuids (\n      travel_uuid   = u\n      OverallStatus = 'A'\n    ) )\n    FAILED FINAL(lt_failed)\n    REPORTED FINAL(lt_reported).\n\n  COMMIT ENTITIES.\n  out->write( |Batch updated { lines( lt_uuids ) } records in a single transactional roundtrip.| ).\nENDMETHOD."
    },
    {
      "id": 9,
      "title": "Exercise 9: Transactional Rollback with ROLLBACK ENTITIES",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Demonstrate calling `ROLLBACK ENTITIES` when an EML batch operation encounters partial failures, reverting all buffered changes cleanly.",
      "starterCode": "METHOD if_oo_adt_classrun~main.\n  -- TODO: Execute EML modify, check if failed is initial, else ROLLBACK ENTITIES\nENDMETHOD.",
      "hints": [
        "IF lt_failed IS INITIAL. COMMIT ENTITIES. ELSE. ROLLBACK ENTITIES. out->write( 'Rolled back' ). ENDIF."
      ],
      "solution": "METHOD if_oo_adt_classrun~main.\n  MODIFY ENTITIES OF /dmo/i_travel_m\n    ENTITY Travel\n    UPDATE FIELDS ( Description )\n    WITH VALUE #( ( travel_uuid = 'INVALID_KEY' Description = 'Bad Key' ) )\n    FAILED FINAL(lt_failed).\n\n  IF lt_failed-travel IS INITIAL.\n    COMMIT ENTITIES.\n    out->write( 'Commit successful.' ).\n  ELSE.\n    ROLLBACK ENTITIES.\n    out->write( 'Transaction rolled back safely. Zero database corruption.' ).\n  ENDIF.\nENDMETHOD."
    },
    {
      "id": 10,
      "title": "Exercise 10 (Master Capstone): Automated Mass Order Re-allocation & Pricing Engine",
      "difficulty": "Master Capstone",
      "isCapstone": true,
      "estimatedMinutes": 30,
      "prompt": "THE BIG ONE (COMPREHENSIVE CHAPTER 11 CAPSTONE):\nImplement an Enterprise Batch Order Orchestration Class:\n1. Console class `zcl_mass_order_allocator` implementing `if_oo_adt_classrun`.\n2. EML Read Operations:\n   - Read all pending orders from `/dmo/i_travel_m` where `OverallStatus = 'O'`.\n   - Read all associated bookings via `\\_Booking`.\n3. Business Rule Processing:\n   - If total bookings > 3, apply a 15% VIP discount by updating `TotalPrice` via EML.\n   - If `BeginDate` is within next 7 days, trigger action `acceptTravel` via EML.\n4. Batch Mutation & Commit:\n   - Execute all updates in a single bulk EML `MODIFY ENTITIES` call.\n   - Inspect `failed` and `reported` tables. If any order fails, log specific error message and rollback affected items.\n   - Commit surviving transactions via `COMMIT ENTITIES`.\n5. 100% Clean Core compliant, zero direct table writes.",
      "starterCode": "\" DAY 11 MASTER CAPSTONE: Automated Mass Order Allocator\nCLASS zcl_mass_order_allocator DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES if_oo_adt_classrun.\nENDCLASS.\n\nCLASS zcl_mass_order_allocator IMPLEMENTATION.\n  METHOD if_oo_adt_classrun~main.\n    -- TODO: Implement end-to-end EML batch orchestrator\n  ENDMETHOD.\nENDCLASS.",
      "hints": [
        "Combine READ ENTITIES BY \\_Booking, REDUCE or FOR to build update table, and execute acceptTravel"
      ],
      "solution": "CLASS zcl_mass_order_allocator DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES if_oo_adt_classrun.\nENDCLASS.\n\nCLASS zcl_mass_order_allocator IMPLEMENTATION.\n  METHOD if_oo_adt_classrun~main.\n    out->write( '=== STARTING MASS EML ORCHESTRATION ENGINE ===' ).\n\n    \" 1. Query open travels\n    SELECT FROM /dmo/i_travel_m\n      FIELDS travel_uuid, BeginDate, TotalPrice, CurrencyCode\n      WHERE OverallStatus = 'O'\n      INTO TABLE @FINAL(lt_open_travels)\n      UP TO 50 ROWS.\n\n    IF lt_open_travels IS INITIAL.\n      out->write( 'No open travels found to process.' ).\n      RETURN;\n    ENDIF.\n\n    \" 2. Read associated bookings via EML\n    READ ENTITIES OF /dmo/i_travel_m\n      ENTITY Travel BY \\_Booking\n      FIELDS ( BookingUUID FlightPrice )\n      WITH VALUE #( FOR t IN lt_open_travels ( travel_uuid = t-travel_uuid ) )\n      RESULT FINAL(lt_bookings).\n\n    \" 3. Build batch discount update list for travels with > 3 bookings\n    FINAL(lt_discount_updates) = VALUE /dmo/t_travel_m(\n      FOR t IN lt_open_travels\n      LET lv_booking_count = lines( FILTER #( lt_bookings WHERE ( travel_uuid = t-travel_uuid ) ) )\n      WHERE ( lv_booking_count > 3 )\n      ( travel_uuid = t-travel_uuid\n        TotalPrice  = t-TotalPrice * '0.85'\n        %control-TotalPrice = if_abap_behv=>mk-on )\n    ).\n\n    IF lt_discount_updates IS NOT INITIAL.\n      MODIFY ENTITIES OF /dmo/i_travel_m\n        ENTITY Travel\n        UPDATE FROM lt_discount_updates\n        FAILED FINAL(lt_disc_failed)\n        REPORTED FINAL(lt_disc_reported).\n\n      out->write( |Applied volume discount to { lines( lt_discount_updates ) } bulk travels.| ).\n    ENDIF.\n\n    \" 4. Trigger acceptTravel for travels starting within 7 days\n    FINAL(lv_today) = cl_abap_context_info=>get_system_date( ).\n    FINAL(lt_urgent_travels) = VALUE /dmo/t_travel_keys(\n      FOR t IN lt_open_travels\n      WHERE ( t-BeginDate <= lv_today + 7 )\n      ( travel_uuid = t-travel_uuid )\n    ).\n\n    IF lt_urgent_travels IS NOT INITIAL.\n      MODIFY ENTITIES OF /dmo/i_travel_m\n        ENTITY Travel\n        EXECUTE acceptTravel\n        FROM lt_urgent_travels\n        RESULT FINAL(lt_act_result)\n        FAILED FINAL(lt_act_failed)\n        REPORTED FINAL(lt_act_reported).\n\n      out->write( |Auto-accepted { lines( lt_act_result ) } urgent travels starting within 7 days.| ).\n    ENDIF.\n\n    COMMIT ENTITIES.\n    out->write( '=== EML BATCH ORCHESTRATION COMPLETED CLEANLY ===' ).\n  ENDMETHOD.\nENDCLASS."
    }
  ],
  "day-12-side-effects-virtual": [
    {
      "id": 1,
      "title": "Exercise 1: Declaring Virtual Element in CDS Projection",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "Add a virtual element `DaysUntilFlight` to `ZC_Travel` using `@ObjectModel.virtualElementCalculatedBy: 'ABAP:ZCL_CALC_FLIGHT_DAYS'`.",
      "starterCode": "define root view entity ZC_Travel\n  as projection on ZI_Travel\n{\n  key TravelUUID,\n      BeginDate,\n      -- TODO: Add virtual element DaysUntilFlight\n}",
      "hints": [
        "@ObjectModel.virtualElementCalculatedBy: 'ABAP:ZCL_CALC_FLIGHT_DAYS' virtual DaysUntilFlight : abap.int4,"
      ],
      "solution": "define root view entity ZC_Travel\n  as projection on ZI_Travel\n{\n  key TravelUUID,\n      BeginDate,\n      @EndUserText.label: 'Days Until Departure'\n      @ObjectModel.virtualElementCalculatedBy: 'ABAP:ZCL_CALC_FLIGHT_DAYS'\n      virtual DaysUntilFlight : abap.int4\n}"
    },
    {
      "id": 2,
      "title": "Exercise 2: Implementing SADL Calculation Class",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Create class `zcl_calc_flight_days` implementing `if_sadl_exit_calc_element_read`. Calculate `DaysUntilFlight = BeginDate - current_date`.",
      "starterCode": "CLASS zcl_calc_flight_days DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES if_sadl_exit_calc_element_read.\nENDCLASS.\n\nCLASS zcl_calc_flight_days IMPLEMENTATION.\n  -- TODO: Implement calculate method\nENDCLASS.",
      "hints": [
        "In calculate: loop over ct_calculated_data, compute BeginDate - system_date, assign to DaysUntilFlight."
      ],
      "solution": "CLASS zcl_calc_flight_days DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES if_sadl_exit_calc_element_read.\nENDCLASS.\n\nCLASS zcl_calc_flight_days IMPLEMENTATION.\n  METHOD if_sadl_exit_calc_element_read~get_calculation_info.\n    \" Request BeginDate from database if not already selected\n    IF line_exists( it_requested_calc_elements[ table_line = 'DAYSUNTILFLIGHT' ] ).\n      INSERT CONV string( 'BEGINDATE' ) INTO TABLE et_requested_orig_elements.\n    ENDIF.\n  ENDMETHOD.\n\n  METHOD if_sadl_exit_calc_element_read~calculate.\n    DATA lt_travels TYPE STANDARD TABLE OF zc_travel WITH DEFAULT KEY.\n    lt_travels = CORRESPONDING #( it_original_data ).\n    FINAL(lv_today) = cl_abap_context_info=>get_system_date( ).\n\n    LOOP AT lt_travels ASSIGNING FIELD-SYMBOL(<ls_travel>).\n      <ls_travel>-DaysUntilFlight = <ls_travel>-BeginDate - lv_today.\n    ENDLOOP.\n\n    ct_calculated_data = CORRESPONDING #( lt_travels ).\n  ENDMETHOD.\nENDCLASS."
    },
    {
      "id": 3,
      "title": "Exercise 3: Declaring Field Side Effects in BDEF",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "In BDEF for `ZC_Travel`, declare that changing `BookingFee` causes a side effect recalculating `TotalPrice`: `side effects { field BookingFee affects field TotalPrice; }`.",
      "starterCode": "define behavior for ZC_Travel alias Travel\n{\n  -- TODO: Declare side effects for BookingFee -> TotalPrice\n}",
      "hints": [
        "side effects { field BookingFee affects field TotalPrice; }"
      ],
      "solution": "define behavior for ZC_Travel alias Travel\n{\n  use create;\n  use update;\n  use delete;\n\n  side effects\n  {\n    field BookingFee affects field TotalPrice;\n  }\n}"
    },
    {
      "id": 4,
      "title": "Exercise 4: Side Effects Refreshing Child Composition Items",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Declare a side effect where executing action `recalculateDiscounts` on the root Travel entity automatically refreshes the child composition `_Booking`.",
      "starterCode": "side effects\n{\n  -- TODO: action recalculateDiscounts affects entity _Booking\n}",
      "hints": [
        "action recalculateDiscounts affects entity _Booking;"
      ],
      "solution": "side effects\n{\n  action recalculateDiscounts affects entity _Booking;\n  field DiscountCode affects entity _Booking;\n}"
    },
    {
      "id": 5,
      "title": "Exercise 5: Declaring Unmanaged Save in BDEF",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "In a managed BDEF header, specify `with unmanaged save` to take full custom control of the final database commit phase.",
      "starterCode": "managed implementation in class zbp_i_travel_m unique;\nstrict ( 2 );\n-- TODO: Add with unmanaged save",
      "hints": [
        "managed implementation in class zbp_i_travel_m unique; strict ( 2 ); with unmanaged save;"
      ],
      "solution": "managed implementation in class zbp_i_travel_m unique;\nstrict ( 2 );\nwith unmanaged save;\n\ndefine behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\nlock master\n{\n  create; update; delete;\n}"
    },
    {
      "id": 6,
      "title": "Exercise 6: Implementing save_modified in Behavior Saver",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "In Local Saver class `lsc_travel`, implement `save_modified`. Loop over `create-travel` and insert records into an external audit table `zaudit_log`.",
      "starterCode": "CLASS lsc_travel DEFINITION INHERITING FROM cl_abap_behavior_saver.\n  PROTECTED SECTION.\n    METHODS save_modified REDEFINITION.\nENDCLASS.\n\nCLASS lsc_travel IMPLEMENTATION.\n  -- TODO: Implement save_modified\nENDCLASS.",
      "hints": [
        "LOOP AT create-travel INTO FINAL(c). INSERT zaudit_log VALUES ( ... ). ENDLOOP."
      ],
      "solution": "CLASS lsc_travel DEFINITION INHERITING FROM cl_abap_behavior_saver.\n  PROTECTED SECTION.\n    METHODS save_modified REDEFINITION.\nENDCLASS.\n\nCLASS lsc_travel IMPLEMENTATION.\n  METHOD save_modified.\n    IF create-travel IS NOT INITIAL.\n      INSERT zaudit_log FROM TABLE @( VALUE #(\n        FOR c IN create-travel\n        ( log_uuid    = cl_system_uuid=>create_uuid_x16_static( )\n          action      = 'CREATE'\n          entity_key  = c-travel_uuid\n          timestamp   = cl_abap_context_info=>get_system_date_time( ) )\n      ) ).\n    ENDIF.\n  ENDMETHOD.\nENDCLASS."
    },
    {
      "id": 7,
      "title": "Exercise 7: Wrapping Legacy BAPIs in save_modified",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 15,
      "prompt": "Inside `save_modified`, write logic that calls a legacy procurement BAPI `BAPI_PO_CREATE1` for newly created purchase orders, capturing errors in the saver.",
      "starterCode": "METHOD save_modified.\n  -- Given create-purchaseorder\n  -- TODO: Call legacy BAPI for each created PO\nENDMETHOD.",
      "hints": [
        "In unmanaged save, call legacy BAPI and convert return table messages"
      ],
      "solution": "METHOD save_modified.\n  DATA lt_return TYPE STANDARD TABLE OF bapiret2.\n\n  LOOP AT create-purchaseorder INTO FINAL(ls_po).\n    CALL FUNCTION 'BAPI_PO_CREATE1'\n      TABLES\n        return = lt_return.\n\n    IF line_exists( lt_return[ type = 'E' ] ).\n      \" Record saver failure\n    ENDIF.\n  ENDLOOP.\nENDMETHOD."
    },
    {
      "id": 8,
      "title": "Exercise 8: Clean Early vs Late Numbering in RAP",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Compare Early Numbering (`early numbering`) vs Late Numbering (`late numbering`) in BDEF and explain when each is architecturally required.",
      "starterCode": "/* Exercise 8: Numbering Comparison\n-- TODO: Explain Early vs Late Numbering in comments\n*/",
      "hints": [
        "Early numbering is assigned immediately when draft is created. Late numbering is assigned during adjust_numbers right before commit."
      ],
      "solution": "/* ARCHITECTURAL COMPARISON: EARLY VS LATE NUMBERING\n1. Early Numbering (early numbering in BDEF):\n   - Primary key is generated immediately upon creation (e.g. UUID).\n   - Mandatory for draft-enabled applications so child entities can link to parent.\n\n2. Late Numbering (late numbering in BDEF):\n   - Business human-readable number (e.g. Purchase Order 4500001234) is drawn from a continuous number range.\n   - Drawn during adjust_numbers in the save sequence right before database commit.\n   - Prevents gaps in legal accounting number ranges if the user discards a draft. */"
    },
    {
      "id": 9,
      "title": "Exercise 9: Event Publishing from RAP Business Objects",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Declare a business event in BDEF: `event TravelCancelled parameter ZD_TravelCancelEvent;` that fires when travel status transitions to cancelled.",
      "starterCode": "define behavior for ZI_Travel_M alias Travel\n{\n  -- TODO: Declare business event TravelCancelled\n}",
      "hints": [
        "event TravelCancelled parameter ZD_TravelCancelEvent;"
      ],
      "solution": "define behavior for ZI_Travel_M alias Travel\npersistent table /dmo/travel_m\nlock master\n{\n  create; update; delete;\n  event TravelCancelled parameter ZD_TravelCancelEvent;\n}"
    },
    {
      "id": 10,
      "title": "Exercise 10 (Master Capstone): Hybrid Enterprise Asset Maintenance Tracker",
      "difficulty": "Master Capstone",
      "isCapstone": true,
      "estimatedMinutes": 30,
      "prompt": "THE BIG ONE (COMPREHENSIVE CHAPTER 12 CAPSTONE):\nDesign an Advanced Enterprise Asset Tracking & Preventive Maintenance System:\n1. CDS Projection `ZC_Equipment`:\n   - Virtual element `HealthIndex` calculated by SADL class `ZCL_CALC_EQUIPMENT_HEALTH` (computes score 0-100 based on operating hours and temperature).\n2. Behavior Definition with Side Effects:\n   - Changing `OperatingHours` automatically triggers side effect recalculating `HealthIndex` and `NextServiceDueDate`.\n3. Behavior Saver with Unmanaged Save:\n   - Local Saver class implementing `save_modified`.\n   - When equipment health drops below 30, automatically dispatches an external event to SAP Event Mesh / Audit Log without blocking the core HANA database commit.\n4. 100% Clean Core compliant.",
      "starterCode": "\" DAY 12 MASTER CAPSTONE: Hybrid Asset Maintenance Tracker\n-- TODO: Complete CDS Projection, BDEF Side Effects, and Behavior Saver",
      "hints": [
        "Combine @ObjectModel.virtualElementCalculatedBy, BDEF side effects, and save_modified"
      ],
      "solution": "/* 1. CDS View Projection with Virtual Element */\n@EndUserText.label: 'Equipment Asset Projection'\ndefine root view entity ZC_Equipment\n  as projection on ZI_Equipment\n{\n  key EquipmentUUID,\n      EquipmentName,\n      OperatingHours,\n      OperatingTemp,\n      NextServiceDueDate,\n      @ObjectModel.virtualElementCalculatedBy: 'ABAP:ZCL_CALC_EQUIPMENT_HEALTH'\n      virtual HealthIndex : abap.int4\n}\n\n/* 2. BDEF with Reactive Side Effects */\ndefine behavior for ZC_Equipment alias Equipment\n{\n  use create;\n  use update;\n  use delete;\n\n  side effects\n  {\n    field OperatingHours affects field NextServiceDueDate, field HealthIndex;\n    field OperatingTemp  affects field HealthIndex;\n  }\n}\n\n/* 3. Behavior Saver Class for Audit / Event Publishing */\nCLASS lsc_equipment DEFINITION INHERITING FROM cl_abap_behavior_saver.\n  PROTECTED SECTION.\n    METHODS save_modified REDEFINITION.\nENDCLASS.\n\nCLASS lsc_equipment IMPLEMENTATION.\n  METHOD save_modified.\n    IF update-equipment IS NOT INITIAL.\n      \" Emit telemetry event to audit log\n      INSERT zaudit_equipment FROM TABLE @( VALUE #(\n        FOR eq IN update-equipment\n        ( log_id       = cl_system_uuid=>create_uuid_x16_static( )\n          equipment_id = eq-EquipmentUUID\n          hours        = eq-OperatingHours\n          logged_at    = cl_abap_context_info=>get_system_date_time( ) )\n      ) ).\n    ENDIF.\n  ENDMETHOD.\nENDCLASS."
    }
  ],
  "day-13-clean-core-atc": [
    {
      "id": 1,
      "title": "Exercise 1: Understanding ABAP Language Version 5",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "List 5 classic ABAP statements that trigger immediate syntax errors in ABAP Cloud (Language Version 5).",
      "starterCode": "/* Exercise 1: Banned statements in ABAP Cloud\n1. ...\n2. ...\n3. ...\n4. ...\n5. ... */",
      "hints": [
        "WRITE, TABLES, CALL SCREEN, OCCURS 0, SELECT * FROM mara"
      ],
      "solution": "/* FIVE STATEMENTS STRICTLY FORBIDDEN IN ABAP CLOUD:\n1. WRITE: Classic Dynpro screen output (replaced by out->write() in ADT or OData V4).\n2. TABLES: Obsolete global table work areas (replaced by explicit typed local structures).\n3. CALL SCREEN / LEAVE TO SCREEN: Classic SAP GUI Dynpro screens (replaced by Fiori / React).\n4. Direct reads on unreleased tables: SELECT * FROM MARA/BUT000 (replaced by CDS View Entities).\n5. CALL FUNCTION without released C1 contract (replaced by RAP Business Objects or released APIs). */"
    },
    {
      "id": 2,
      "title": "Exercise 2: Checking Released API Contract (C1)",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "How do you check if an SAP CDS View or Class is released for Clean Core in Eclipse ADT?",
      "starterCode": "/* Exercise 2: Released API Verification in ADT\n-- TODO: Explain how to check C1 contract in comments */",
      "hints": [
        "Open object in ADT -> Properties tab -> API State -> Use in Cloud Development (Contract C1)"
      ],
      "solution": "/* In Eclipse ADT:\n1. Open the CDS View or ABAP Class (e.g. I_BusinessPartner).\n2. Look at the \"Properties\" view in the bottom tab pane.\n3. Select \"API State\".\n4. Check for \"Use in Cloud Development\" with Release State: RELEASED (Contract C1).\nIf C1 is not present, using this object in ABAP Cloud will trigger a fatal ATC error. */"
    },
    {
      "id": 3,
      "title": "Exercise 3: Replacing Unreleased Table Read (BUT000 -> I_BusinessPartner)",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Refactor a legacy `SELECT * FROM but000` query into modern ABAP Cloud querying released CDS view `I_BusinessPartner`.",
      "starterCode": "\" Exercise 3: Refactor legacy query\n\" LEGACY: SELECT * FROM but000 WHERE partner = @lv_id INTO @DATA(ls_bp).\n\" TODO: Rewrite using modern ABAP SQL and released CDS view I_BusinessPartner",
      "hints": [
        "SELECT SINGLE FROM i_businesspartner FIELDS businesspartner, businesspartnerfullname WHERE businesspartner = @lv_id INTO @FINAL(ls_bp)."
      ],
      "solution": "SELECT SINGLE FROM i_businesspartner\n  FIELDS businesspartner, businesspartnerfullname, businesspartnercategory\n  WHERE businesspartner = @lv_id\n  INTO @FINAL(ls_bp)."
    },
    {
      "id": 4,
      "title": "Exercise 4: Replacing Classic Dynpro Screen with Console Output",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Refactor a procedural program using `WRITE: / 'Order:', lv_order.` into a Clean Core class implementing `if_oo_adt_classrun`.",
      "starterCode": "\" Exercise 4: Eliminate classic WRITE\nCLASS zcl_clean_reporter DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  -- TODO: Implement if_oo_adt_classrun\nENDCLASS.",
      "hints": [
        "INTERFACES if_oo_adt_classrun. In main: out->write( |Order: { lv_order }| )."
      ],
      "solution": "CLASS zcl_clean_reporter DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES if_oo_adt_classrun.\nENDCLASS.\n\nCLASS zcl_clean_reporter IMPLEMENTATION.\n  METHOD if_oo_adt_classrun~main.\n    FINAL(lv_order) = '4500009876'.\n    out->write( |Order: { lv_order }| ).\n  ENDMETHOD.\nENDCLASS."
    },
    {
      "id": 5,
      "title": "Exercise 5: Replacing sy-subrc Checks with Class Exceptions",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Replace legacy `CALL FUNCTION ... EXCEPTIONS not_found = 1` and `IF sy-subrc <> 0` with modern class-based exception handling `TRY ... CATCH cx_not_found`.",
      "starterCode": "\" Exercise 5: Exception modernization\n\" TODO: Show before and after",
      "hints": [
        "Use TRY. lo_service->get_data( ). CATCH cx_not_found INTO FINAL(lx_err). out->write( lx_err->get_text( ) ). ENDTRY."
      ],
      "solution": "\" Modern Clean Core Exception Handling:\nTRY.\n    FINAL(ls_data) = lo_service->fetch_customer( iv_id = lv_cust_id ).\n    out->write( ls_data ).\n  CATCH cx_customer_not_found INTO FINAL(lx_err).\n    out->write( |Customer not found: { lx_err->get_text( ) }| ).\nENDTRY."
    },
    {
      "id": 6,
      "title": "Exercise 6: Configuring ATC Variant in Eclipse ADT",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "How do you run the ABAP Test Cockpit (ATC) on your package in ADT to verify 100% Clean Core compliance?",
      "starterCode": "/* Exercise 6: ATC Execution Guide\n-- TODO: Document steps to run ATC in ADT */",
      "hints": [
        "Right click package -> Run As -> ABAP Test Cockpit with check variant ABAP_CLOUD_DEVELOPMENT"
      ],
      "solution": "/* ATC Execution Guide for Clean Core:\n1. In Eclipse ADT Project Explorer, right-click your development package (e.g. Z_MY_RAP_PACKAGE).\n2. Navigate to: Run As -> ABAP Test Cockpit.\n3. Select Check Variant: ABAP_CLOUD_DEVELOPMENT_DEFAULT.\n4. Review ATC Results pane:\n   - Severity ERROR: Blocks transport release; must be resolved.\n   - Severity WARNING: Review for Clean Core compliance. */"
    },
    {
      "id": 7,
      "title": "Exercise 7: On-Stack vs Side-by-Side Extensibility Strategy",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Formulate an architectural decision matrix explaining when to build an On-Stack RAP extension vs a Side-by-Side extension on SAP BTP / Cloud Foundry.",
      "starterCode": "/* Exercise 7: Extensibility Matrix\n-- TODO: Formulate On-Stack vs Side-by-Side criteria */",
      "hints": [
        "On-stack is best for tight data coupling and high-volume transactions in the same DB. Side-by-side is best for decoupling, multi-system integration, and external users."
      ],
      "solution": "/* EXTENSIBILITY DECISION MATRIX:\n1. On-Stack Extensibility (Embedded RAP in S/4HANA Cloud):\n   - Best when logic requires high-speed access to millions of internal ERP records without network latency.\n   - Core transactional processes (posting journal entries, MRP calculations).\n\n2. Side-by-Side Extensibility (SAP BTP / React / Node.js):\n   - Best when app serves external partners/suppliers who should NOT have direct login to core ERP.\n   - Heavy compute / AI workloads (image processing, LLMs) that should not consume ERP HANA memory.\n   - Integrates multiple heterogeneous backends (SAP + Salesforce + AWS). */"
    },
    {
      "id": 8,
      "title": "Exercise 8: Clean Core Quick Fixes in Eclipse ADT",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Explain how the ADT Quick Fix (Ctrl + 1) engine automates migrating legacy statements to modern Clean Core equivalents.",
      "starterCode": "/* Exercise 8: Quick Fixes in ADT\n-- TODO: Document Quick Fix capabilities */",
      "hints": [
        "Pressing Ctrl+1 on DATA declarations automatically converts single-use variables to FINAL(var)"
      ],
      "solution": "/* ADT Quick Fix (Ctrl+1) Capabilities in ABAP Cloud:\n1. \"Use FINAL instead of DATA\": Automatically rewrites mutable declarations to immutable FINAL.\n2. \"Convert to View Entity\": Refactors legacy DEFINE VIEW to DEFINE VIEW ENTITY.\n3. \"Generate draft table\": Creates draft table DDIC definition with all required admin fields automatically.\n4. \"Add strict ( 2 )\": Injects missing compiler pragmas and mandatory declarations into BDEF. */"
    },
    {
      "id": 9,
      "title": "Exercise 9: Custom Code Migration Strategy from ECC 6.0",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Outline the 4-step Custom Code Migration Worklist (CCM) strategy for modernizing a legacy ECC 6.0 system to Clean Core S/4HANA.",
      "starterCode": "/* Exercise 9: 4-Step Migration Strategy\nStep 1: ...\nStep 2: ...\nStep 3: ...\nStep 4: ... */",
      "hints": [
        "1. Scope & Retire unused code, 2. Run SAP Readiness Check, 3. Semi-automated Quick Fixes, 4. Redesign with RAP & OData V4"
      ],
      "solution": "/* 4-STEP CUSTOM CODE MIGRATION WORKLIST:\nStep 1: Scoping & Usage Analysis (ST03N / CCLM)\n  - Identify and delete dead/unused custom code (typically 40-60% of legacy custom code is obsolete).\n\nStep 2: Static Analysis (Custom Code Migration App / ATC)\n  - Run remote ATC check using S4HANA_READINESS check variant to find obsolete tables and syntax.\n\nStep 3: Automated Quick Fixes\n  - Batch-apply Eclipse ADT Quick Fixes for syntax updates (comma separation, host variables, ORDER BY).\n\nStep 4: Architectural Refactoring to RAP & Clean Core\n  - Wrap required custom logic into CDS View Entities and RAP Business Objects exposed via OData V4. */"
    },
    {
      "id": 10,
      "title": "Exercise 10 (Master Capstone): Legacy ECC 6.0 Custom Report Modernization & Clean Core Certification",
      "difficulty": "Master Capstone",
      "isCapstone": true,
      "estimatedMinutes": 30,
      "prompt": "THE BIG ONE (COMPREHENSIVE CHAPTER 13 CAPSTONE):\nTake a notorious 1998 legacy procedural report and refactor it into a 100% Clean Core compliant ABAP Cloud Architecture:\nLegacy code contained:\n- `TABLES: mara, vbak.`\n- `DATA: it_orders LIKE TABLE OF vbak WITH HEADER LINE.`\n- `SELECT * FROM vbak INTO TABLE it_orders WHERE erdat >= '20240101'.`\n- Nested `LOOP AT it_orders ... WRITE: / it_orders-vbeln.`\nModern Clean Core Replacement:\n1. CDS View Entity `ZI_SalesOrderClean`:\n   - Queries released CDS view `I_SalesOrderTP` (not raw table VBAK).\n   - Projects fields `SalesOrder`, `CreationDate`, `TotalNetAmount`, `TransactionCurrency`.\n2. Clean Core Console Runner `ZCL_CLEAN_SALES_REPORTER`:\n   - Implements `if_oo_adt_classrun`.\n   - Uses modern Open SQL with `@` host variables and comma separation.\n   - Computes total order revenue using modern `REDUCE`.\n   - Formats and outputs using `out->write( )`.\n   - 0 classic WRITE, 0 TABLES, 0 unreleased standard tables, 100% ATC Clean Core pass.",
      "starterCode": "\" DAY 13 MASTER CAPSTONE: Legacy Report Modernization\n-- TODO: Write ZI_SalesOrderClean CDS view and ZCL_CLEAN_SALES_REPORTER class",
      "hints": [
        "Select from i_salesordertp and use REDUCE in console runner"
      ],
      "solution": "/* 1. Modern Released CDS View Entity */\n@EndUserText.label: 'Clean Core Sales Order View'\n@AccessControl.authorizationCheck: #NOT_REQUIRED\ndefine view entity ZI_SalesOrderClean\n  as select from i_salesordertp\n{\n  key SalesOrder,\n      CreationDate,\n      @Semantics.amount.currencyCode: 'TransactionCurrency'\n      TotalNetAmount,\n      TransactionCurrency\n}\n\n/* 2. Modern Clean Core Console Runner */\nCLASS zcl_clean_sales_reporter DEFINITION PUBLIC FINAL CREATE PUBLIC.\n  PUBLIC SECTION.\n    INTERFACES if_oo_adt_classrun.\nENDCLASS.\n\nCLASS zcl_clean_sales_reporter IMPLEMENTATION.\n  METHOD if_oo_adt_classrun~main.\n    FINAL(lv_start_date) = CONV d( '20240101' ).\n\n    SELECT FROM zi_salesorderclean\n      FIELDS SalesOrder, CreationDate, TotalNetAmount, TransactionCurrency\n      WHERE CreationDate >= @lv_start_date\n      INTO TABLE @DATA(lt_orders)\n      UP TO 100 ROWS.\n\n    IF lt_orders IS INITIAL.\n      out->write( 'No orders found since 2024-01-01.' ).\n      RETURN;\n    ENDIF.\n\n    FINAL(lv_total_revenue) = REDUCE decfloat16(\n      INIT sum = CONV decfloat16( 0 )\n      FOR o IN lt_orders\n      NEXT sum = sum + o-TotalNetAmount\n    ).\n\n    out->write( |=== SAP CLEAN CORE SALES AUDIT REPORT ===| ).\n    out->write( |Total Qualifying Orders: { lines( lt_orders ) }| ).\n    out->write( |Total Aggregate Revenue: { lv_total_revenue }| ).\n    out->write( lt_orders ).\n  ENDMETHOD.\nENDCLASS."
    }
  ],
  "day-14-capstone-interview": [
    {
      "id": 1,
      "title": "Exercise 1: Architectural Layering Diagramming",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 5,
      "prompt": "List and describe the 5 distinct layers of a modern SAP RAP + React enterprise full-stack application.",
      "starterCode": "/* Exercise 1: The 5 Layers of RAP + React\nLayer 1: ...\nLayer 2: ...\nLayer 3: ...\nLayer 4: ...\nLayer 5: ... */",
      "hints": [
        "1. Database Tables, 2. CDS View Entities, 3. RAP BDEF, 4. Service Definition & Binding (OData V4), 5. React Frontend Client"
      ],
      "solution": "/* THE 5 TIERS OF SAP RAP + REACT ARCHITECTURE:\n1. Persistence Layer: Native database tables (transparent tables with UUID keys and timestamps).\n2. Data Modeling Layer: CDS View Entities (pushing joins, calculations, and associations into HANA).\n3. Business Behavior Layer: RAP Behavior Definition (BDEF) & Local Handler Classes (CRUD, validations, actions).\n4. Service Exposure Layer: Service Definition & OData V4 Service Binding (REST API generation).\n5. Presentation Layer: Modern React + Vite frontend (consuming OData V4 via HTTP PATCH and CSRF handshake). */"
    },
    {
      "id": 2,
      "title": "Exercise 2: Explaining Managed vs Unmanaged to a CTO",
      "difficulty": "Warm-up",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "Write a 1-paragraph executive summary explaining to an Enterprise CTO why your team should choose Managed RAP over Unmanaged RAP for new projects.",
      "starterCode": "/* Exercise 2: Executive Pitch - Managed vs Unmanaged RAP\n-- TODO: Write executive justification */",
      "hints": [
        "Managed RAP eliminates 80% of code because the framework automatically handles buffering, inserts, updates, deletes, and locks."
      ],
      "solution": "/* Executive Summary for CTO:\n\"For greenfield cloud applications, Managed RAP is the gold standard because it eliminates approximately 80% of custom backend boilerplate code. The SAP RAP framework automatically handles the transactional buffer, database inserts, updates, deletes, draft autosaving, and optimistic concurrency locking. Unmanaged RAP should be reserved strictly for legacy wrapping scenarios where you must route updates through legacy 20-year-old BAPIs or external third-party transactional engines.\" */"
    },
    {
      "id": 3,
      "title": "Exercise 3: Defending Clean Core Against \"Why Can't We Modify Standard SAP?\"",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "A senior client stakeholder asks: \"In the past, we modified SAP standard code in 1 hour. Why are you forcing us to use Clean Core and released APIs?\" Formulate your defense.",
      "starterCode": "/* Exercise 3: Defending Clean Core\n-- TODO: Formulate the business and technical defense of Clean Core */",
      "hints": [
        "Focus on Total Cost of Ownership (TCO), automatic bi-annual upgrades, and eliminating upgrade multi-month regression testing."
      ],
      "solution": "/* Defense of Clean Core Architecture:\n\"Modifying standard SAP code in 1 hour creates technical debt that costs hundreds of thousands of dollars during every subsequent upgrade. When you modify standard code, SAP can no longer update your cloud system automatically—every upgrade requires months of painful code regression testing and manual remediation. By enforcing Clean Core and building decoupled extensions using stable C1 Released APIs and RAP, the core ERP system stays pristine. SAP can apply automated cloud upgrades seamlessly with zero downtime and zero broken custom code.\" */"
    },
    {
      "id": 4,
      "title": "Exercise 4: Concurrency & Lock Escalation Architecture",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Explain the exact sequence of events when two users concurrently edit the same Travel draft and try to activate it at the same moment.",
      "starterCode": "/* Exercise 4: Concurrent Activation Sequence\nStep 1: ...\nStep 2: ...\nStep 3: ... */",
      "hints": [
        "User A activates first -> updates DB and increments Total ETag. User B attempts activation -> Total ETag mismatch -> HTTP 412 Precondition Failed."
      ],
      "solution": "/* CONCURRENT ACTIVATION SEQUENCE:\n1. User A and User B both load the same active record and create separate drafts. Both drafts record the initial Total ETag (e.g. hash_1).\n2. User A clicks Activate: The RAP framework checks the Total ETag against the active database row. It matches! User A's changes are committed to the DB, and the active row's LastChangedAt timestamp is updated to hash_2.\n3. User B clicks Activate: The RAP framework inspects User B's draft Total ETag (hash_1) against the live database record (hash_2).\n4. ETag Mismatch Detected: Activation is immediately aborted. SAP returns an HTTP 412 Precondition Failed response. User B's draft is preserved, and the UI displays: \"The record was updated by another user. Please review changes before re-activating.\" */"
    },
    {
      "id": 5,
      "title": "Exercise 5: Explaining strict ( 2 ) Compiler Enforcements",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 8,
      "prompt": "List 4 compiler checks enforced when `strict ( 2 );` is specified in a Behavior Definition.",
      "starterCode": "/* Exercise 5: strict ( 2 ) rules\n1. ...\n2. ...\n3. ...\n4. ... */",
      "hints": [
        "Mandatory authorization master, mandatory ETag declaration, explicit field characteristics, read-only key specifications."
      ],
      "solution": "/* COMPILER ENFORCEMENTS IN strict ( 2 ):\n1. Mandatory Authorization Master: Every entity must declare authorization master or dependent.\n2. Mandatory ETag Declaration: Every entity must declare an etag master or dependent.\n3. Explicit Field Characteristics: Fields cannot have ambiguous characteristics; read-only and mandatory attributes must be explicit.\n4. Total ETag for Draft: Draft-enabled entities must declare a total etag on the root entity. */"
    },
    {
      "id": 6,
      "title": "Exercise 6: OData V2 vs OData V4 Comparison for React Engineers",
      "difficulty": "Core",
      "isCapstone": false,
      "estimatedMinutes": 10,
      "prompt": "Compare OData V2 vs OData V4 across payload size, batching, navigation, and frontend compatibility.",
      "starterCode": "/* Exercise 6: OData V2 vs V4 Comparison\n-- TODO: Formulate comparison table */",
      "hints": [
        "OData V4 has 60% leaner JSON payloads, standard $expand with nested queries, and native multipart batch."
      ],
      "solution": "/* ODATA V2 VS ODATA V4 COMPARISON:\n1. Payload Footprint: OData V2 wrapped every record in verbose __metadata XML/JSON envelopes. OData V4 produces clean, lightweight standard JSON (up to 60% bandwidth savings).\n2. Query Navigation: OData V4 supports deep nested query options inside expands: $expand=_Booking($filter=Price gt 500;$orderby=FlightDate).\n3. Batch Processing: OData V4 simplifies multipart changesets and supports asynchronous batch operations.\n4. React Integration: OData V4 clean JSON directly maps to TypeScript interfaces and modern state managers without complex deserialization adapters. */"
    },
    {
      "id": 7,
      "title": "Exercise 7: Production Incident Troubleshooting (ETag Timeout)",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "In production, users report: \"When saving a travel from React, the system frequently returns HTTP 412 even when no other user was editing.\" What is the root cause and fix?",
      "starterCode": "/* Exercise 7: Troubleshooting 412 False Alarms\n-- TODO: Diagnose root cause and solution */",
      "hints": [
        "A background determination was modifying LastChangedAt during intermediate roundtrips, or client was caching stale ETag."
      ],
      "solution": "/* ROOT CAUSE DIAGNOSIS & REMEDIATION:\nRoot Cause:\nA background Determination (e.g. calculateTotalPrice) was modifying the parent Travel entity and updating LocalLastChangedAt on the server, but the React client did not update its local cached ETag after the calculation roundtrip. When the user subsequently clicked Save, the client sent the old stale ETag!\n\nArchitectural Fix:\n1. Ensure the React client updates its local ETag whenever any action or determination returns an updated entity header.\n2. In BDEF, verify that determinations do not update the ETag master field unnecessarily. */"
    },
    {
      "id": 8,
      "title": "Exercise 8: HANA SQL Pushdown & Anti-Pattern Analysis",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 12,
      "prompt": "Identify 3 classic anti-patterns that kill SAP HANA performance and how CDS View Entities solve them.",
      "starterCode": "/* Exercise 8: HANA Performance Anti-Patterns\n1. ...\n2. ...\n3. ... */",
      "hints": [
        "SELECT * in loops, filtering in ABAP memory instead of WHERE clause, and nested subroutines instead of joins."
      ],
      "solution": "/* 3 CRITICAL HANA PERFORMANCE ANTI-PATTERNS & SOLUTIONS:\n1. \"SELECT in LOOP\": Executing SQL inside a loop causes hundreds of database network context-switches.\n   -> Solution: CDS View Entity with associations or single modern Open SQL join with pushdown.\n2. \"Data Dumping to App Server\": Reading 500,000 rows into an internal table to sum a column in ABAP memory.\n   -> Solution: CDS View Entity with sum() and group by, executing in HANA column-store RAM.\n3. \"Unbuffered Direct Reads\": Repeatedly querying static configuration tables without caching.\n   -> Solution: Released CDS View Entities with @AbapCatalog.viewEnhancementCategory and caching. */"
    },
    {
      "id": 9,
      "title": "Exercise 9: Whiteboard Architecture - Multi-Cloud Deployment",
      "difficulty": "Advanced",
      "isCapstone": false,
      "estimatedMinutes": 15,
      "prompt": "Draw and document the cloud topology for: React SPA hosted on AWS S3/CloudFront connecting to SAP S/4HANA Cloud via SAP Cloud Connector & BTP Destination.",
      "starterCode": "/* Exercise 9: Multi-Cloud Network Topology\n-- TODO: Document network flow from browser to HANA */",
      "hints": [
        "Browser -> CloudFront/S3 -> BTP Destination Service -> Cloud Connector -> S/4HANA OData V4"
      ],
      "solution": "/* MULTI-CLOUD HYBRID TOPOLOGY:\n1. Client Tier: React Single-Page Application (SPA) served globally via AWS CloudFront CDN and S3.\n2. Gateway / Security Tier: SAP BTP App Router & Destination Service:\n   - Authenticates user via SAML 2.0 / Corporate Identity Provider (Azure AD / Okta).\n   - Manages principal propagation (OAuth 2.0 JWT).\n3. Connectivity Tier: SAP Cloud Connector:\n   - Secure TLS reverse tunnel establishing connectivity from cloud to on-premise S/4HANA without opening inbound firewall ports.\n4. Backend Tier: SAP S/4HANA Cloud RAP Runtime:\n   - Exposes OData V4 Business Services executing directly on SAP HANA in-memory database. */"
    },
    {
      "id": 10,
      "title": "Exercise 10 (Master Capstone): The Complete Enterprise Masterpiece: Global Autonomous Procurement Platform",
      "difficulty": "Master Capstone",
      "isCapstone": true,
      "estimatedMinutes": 40,
      "prompt": "THE ULTIMATE MASTERPIECE CAPSTONE (THE ENTIRE 14-DAY CURRICULUM SYNTHESIZED):\nDesign, specify, and code the complete end-to-end architecture for an Enterprise Autonomous Procurement & Contract Platform:\n1. Persistence & CDS Layer:\n   - Root View Entity `ZI_ProcurementOrder_M` with child items `ZI_ProcurementItem_M`.\n   - Associated Supplier master view `ZI_Supplier`.\n   - Calculated risk index using CDS `case` expressions.\n2. Managed RAP Behavior Definition:\n   - `with draft;`, `strict ( 2 );`, `numbering : managed`.\n   - Lock master with total etag, etag master.\n   - Determinations: `calculateOrderTotal on modify`, `assignInitialWorkflowStatus on modify { create; }`.\n   - Validations: `validateDeliveryDate on save`, `validateSupplierActive on save`.\n   - Actions: `approveOrder ( features : instance ) result [1] $self;`, `delegateApproval parameter ZD_DelegateParam`.\n   - Dynamic feature control & spending limit authorization.\n3. Behavior Pool Implementation:\n   - Full Local Handler Class with date validation, total computation using EML, and feature control.\n4. Service Exposure:\n   - Service Definition `ZUI_PROCUREMENT_V4` exposing entities.\n   - OData V4 Service Binding.\n5. React Client Implementation:\n   - Complete React component managing Draft auto-save, delta PATCH, CSRF token handling, and field error mapping.\n6. 100% Clean Core, ABAP Cloud Language Version 5 certified.",
      "starterCode": "\" DAY 14 ULTIMATE MASTER CAPSTONE: Global Autonomous Procurement Platform\n-- TODO: Synthesize the full multi-tier architecture across CDS, RAP BDEF, Behavior Handler, and React Client",
      "hints": [
        "Bring together all the patterns mastered over the 14 days into one cohesive enterprise solution!"
      ],
      "solution": "/* =========================================================================\n   1. CDS DATA MODELING LAYER: ROOT VIEW ENTITY WITH DRAFT COMPOSITION\n========================================================================= */\n@EndUserText.label: 'Procurement Order Root Entity'\n@AccessControl.authorizationCheck: #NOT_REQUIRED\ndefine root view entity ZI_ProcurementOrder_M\n  as select from zproc_order_db\n  composition [0..*] of ZI_ProcurementItem_M as _Items\n  association [0..1] to ZI_Supplier          as _Supplier on $projection.SupplierID = _Supplier.SupplierID\n{\n  key order_uuid          as OrderUUID,\n      order_id            as OrderID,\n      supplier_id         as SupplierID,\n      order_status        as OrderStatus,\n      creation_date       as CreationDate,\n      delivery_date       as DeliveryDate,\n      @Semantics.amount.currencyCode: 'CurrencyCode'\n      total_amount        as TotalAmount,\n      currency_code       as CurrencyCode,\n      local_last_changed  as LocalLastChangedAt,\n      last_changed        as LastChangedAt,\n      _Items,\n      _Supplier\n}\n\n/* =========================================================================\n   2. RAP BEHAVIOR DEFINITION (BDEF): MANAGED WITH DRAFT & STRICT 2\n========================================================================= */\nmanaged implementation in class zbp_i_proc_order_m unique;\nstrict ( 2 );\nwith draft;\n\ndefine behavior for ZI_ProcurementOrder_M alias ProcurementOrder\npersistent table zproc_order_db\ndraft table zproc_order_d\nlock master total etag LastChangedAt\netag master LocalLastChangedAt\nauthorization master ( instance )\n{\n  field ( readonly, numbering : managed ) OrderUUID;\n  field ( readonly ) OrderID, CreationDate, TotalAmount, LocalLastChangedAt, LastChangedAt;\n  field ( mandatory ) SupplierID, DeliveryDate, CurrencyCode;\n\n  create;\n  update;\n  delete;\n\n  draft action Edit;\n  draft action Activate optimized;\n  draft action Discard;\n  draft action Resume;\n\n  draft determine action Prepare\n  {\n    validation validateDeliveryDate;\n    validation validateSupplierActive;\n  }\n\n  determination calculateOrderTotal on modify { field CurrencyCode; }\n  determination assignInitialStatus on modify { create; }\n\n  validation validateDeliveryDate    on save { field DeliveryDate; }\n  validation validateSupplierActive  on save { field SupplierID; }\n\n  action ( features : instance ) approveOrder result [1] $self;\n\n  association _Items { create; with draft; }\n}\n\n/* =========================================================================\n   3. BEHAVIOR HANDLER IMPLEMENTATION (ABAP CLOUD)\n========================================================================= */\nCLASS lhc_order DEFINITION INHERITING FROM cl_abap_behavior_handler.\n  PRIVATE SECTION.\n    METHODS get_instance_features FOR INSTANCE FEATURES IMPORTING keys REQUEST requested_features FOR ProcurementOrder RESULT result.\n    METHODS approveOrder          FOR MODIFY IMPORTING keys FOR ACTION ProcurementOrder~approveOrder RESULT result.\n    METHODS validateDeliveryDate  FOR VALIDATION ProcurementOrder~validateDeliveryDate IMPORTING keys FOR ProcurementOrder.\n    METHODS assignInitialStatus   FOR DETERMINATION ProcurementOrder~assignInitialStatus IMPORTING keys FOR ProcurementOrder.\nENDCLASS.\n\nCLASS lhc_order IMPLEMENTATION.\n  METHOD get_instance_features.\n    READ ENTITIES OF ZI_ProcurementOrder_M IN LOCAL MODE\n      ENTITY ProcurementOrder FIELDS ( OrderStatus )\n      WITH CORRESPONDING #( keys ) RESULT FINAL(lt_orders).\n\n    result = VALUE #( FOR o IN lt_orders (\n      %tky                 = o-%tky\n      %action-approveOrder = COND #( WHEN o-OrderStatus = 'APPROVED' THEN if_abap_behv=>fc-o-disabled ELSE if_abap_behv=>fc-o-enabled )\n    ) ).\n  ENDMETHOD.\n\n  METHOD approveOrder.\n    MODIFY ENTITIES OF ZI_ProcurementOrder_M IN LOCAL MODE\n      ENTITY ProcurementOrder UPDATE FIELDS ( OrderStatus )\n      WITH VALUE #( FOR k IN keys ( %tky = k-%tky OrderStatus = 'APPROVED' ) ).\n\n    READ ENTITIES OF ZI_ProcurementOrder_M IN LOCAL MODE\n      ENTITY ProcurementOrder ALL FIELDS WITH CORRESPONDING #( keys )\n      RESULT FINAL(lt_res).\n    result = VALUE #( FOR r IN lt_res ( %tky = r-%tky %param = r ) ).\n  ENDMETHOD.\n\n  METHOD validateDeliveryDate.\n    READ ENTITIES OF ZI_ProcurementOrder_M IN LOCAL MODE\n      ENTITY ProcurementOrder FIELDS ( CreationDate DeliveryDate )\n      WITH CORRESPONDING #( keys ) RESULT FINAL(lt_orders).\n\n    LOOP AT lt_orders INTO FINAL(ls_o).\n      APPEND VALUE #( %tky = ls_o-%tky %state_area = 'DELIVERY_DATE' ) TO reported-procurementorder.\n      IF ls_o-DeliveryDate < cl_abap_context_info=>get_system_date( ).\n        APPEND VALUE #( %tky = ls_o-%tky ) TO failed-procurementorder.\n        APPEND VALUE #(\n          %tky        = ls_o-%tky\n          %state_area = 'DELIVERY_DATE'\n          %msg        = new_message_with_text( severity = if_abap_behv_message=>severity-error text = 'Delivery date cannot be in the past.' )\n        ) TO reported-procurementorder.\n      ENDIF.\n    ENDLOOP.\n  ENDMETHOD.\n\n  METHOD assignInitialStatus.\n    MODIFY ENTITIES OF ZI_ProcurementOrder_M IN LOCAL MODE\n      ENTITY ProcurementOrder UPDATE FIELDS ( OrderStatus CreationDate )\n      WITH VALUE #( FOR k IN keys (\n        %tky         = k-%tky\n        OrderStatus  = 'NEW'\n        CreationDate = cl_abap_context_info=>get_system_date( )\n      ) ).\n  ENDMETHOD.\nENDCLASS.\n\n/* =========================================================================\n   4. SERVICE DEFINITION: EXPOSURE TO ODATA V4\n========================================================================= */\n@EndUserText.label: 'Procurement OData V4 Service'\ndefine service ZUI_PROCUREMENT_V4 {\n  expose ZI_ProcurementOrder_M as ProcurementOrder;\n  expose ZI_ProcurementItem_M  as ProcurementItem;\n  expose ZI_Supplier           as Supplier;\n}\n\n/* =========================================================================\n   5. REACT CLIENT FRONTEND: REACT 18 + ODATA V4 DELTA PATCH & CSRF\n========================================================================= */\nimport React, { useState, useEffect } from 'react';\n\nexport function ProcurementApp() {\n  const [orders, setOrders] = useState([]);\n  const [activeOrder, setActiveOrder] = useState(null);\n\n  useEffect(() => {\n    fetch('/sap/opu/odata4/sap/zui_procurement_v4/srvd/sap/zui_procurement_v4/0001/ProcurementOrder?$expand=_Items')\n      .then(r => r.json())\n      .then(d => setOrders(d.value || []));\n  }, []);\n\n  const handleApprove = async (uuid, etag) => {\n    await fetch(`/sap/opu/odata4/sap/zui_procurement_v4/srvd/sap/zui_procurement_v4/0001/ProcurementOrder(OrderUUID=${uuid},IsActiveEntity=true)/com.sap.gateway.srvd.zui_procurement_v4.v0001.approveOrder`, {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json', 'If-Match': etag },\n      body: JSON.stringify({})\n    });\n    setOrders(prev => prev.map(o => o.OrderUUID === uuid ? { ...o, OrderStatus: 'APPROVED' } : o));\n  };\n\n  return (\n    <div className=\"p-8 bg-slate-50 min-h-screen\">\n      <h1 className=\"text-xl font-bold mb-4\">Autonomous Procurement Studio</h1>\n      <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">\n        {orders.map(o => (\n          <div key={o.OrderUUID} className=\"p-4 bg-white rounded-2xl border border-slate-200 shadow-xs\">\n            <div className=\"flex justify-between font-bold\">\n              <span>Order #{o.OrderID}</span>\n              <span className={`px-2 py-0.5 rounded text-xs ${o.OrderStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}`}>{o.OrderStatus}</span>\n            </div>\n            <p className=\"text-xs text-slate-500 mt-1\">Delivery: {o.DeliveryDate}</p>\n            <p className=\"text-xs font-mono font-bold mt-2\">{o.TotalAmount} {o.CurrencyCode}</p>\n            {o.OrderStatus !== 'APPROVED' && (\n              <button onClick={() => handleApprove(o.OrderUUID, o.LocalLastChangedAt)} className=\"mt-3 px-3 py-1.5 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-500\">\n                Approve Order\n              </button>\n            )}\n          </div>\n        ))}\n      </div>\n    </div>\n  );\n}"
    }
  ]
};

export const BEGINNER_BRIDGES = {
  "day-0-abap-prerequisites": {
    "title": "Zero-to-Hero Fast Track: Modern ABAP Fundamentals for Java & JS Engineers",
    "summary": "Welcome to your prerequisite booster! In modern full-stack development, you already understand variables, loops, arrays, objects, and classes in Java (Spring Boot) or JavaScript (Express.js). In ABAP, the core logic is 100% identical—only the punctuation is different! Once you understand the period `.`, the hyphen `-`, structures, internal tables, and the tilde `~`, you will be able to read and write any modern ABAP and RAP code with complete confidence.",
    "whyClassicWasHard": "Classic 1990s ABAP used monolithic procedural reports, untyped tables, and Dynpro screens. Modern ABAP Cloud is strictly object-oriented, type-safe, and runs directly on the SAP HANA in-memory database.",
    "jargonBuster": [
      {
        "term": ".",
        "translation": "Period ending every ABAP statement",
        "modernEquivalent": "Semicolon ; in Java / JavaScript / C#"
      },
      {
        "term": "-",
        "translation": "Field accessor in structures (ls_user-name)",
        "modernEquivalent": "Dot accessor (user.name) in Java / JS"
      },
      {
        "term": "TYPES: BEGIN OF ...",
        "translation": "Structure / Record type definition",
        "modernEquivalent": "class UserDTO { ... } or interface User { ... }"
      },
      {
        "term": "TYPE TABLE OF ...",
        "translation": "Internal table (in-memory array/list)",
        "modernEquivalent": "List<UserDTO> in Java or User[] in TypeScript"
      },
      {
        "term": "APPEND wa TO itab",
        "translation": "Push a record into a table",
        "modernEquivalent": "list.add(item) in Java or array.push(item) in JS"
      },
      {
        "term": "LOOP AT itab INTO wa",
        "translation": "Iterate through table rows",
        "modernEquivalent": "for (final User u : list) or for (const u of list)"
      },
      {
        "term": "CORRESPONDING #( ... )",
        "translation": "Automatic DTO mapper for matching fields",
        "modernEquivalent": "modelMapper.map() in Spring Boot or { ...source } in JS"
      },
      {
        "term": "~",
        "translation": "Interface method resolution operator",
        "modernEquivalent": "@Override in Java / interface implementation"
      },
      {
        "term": "out->write( ... )",
        "translation": "Console output in Eclipse ADT",
        "modernEquivalent": "System.out.println() in Java or console.log() in JS"
      }
    ],
    "proTips": [
      "Rule 1: Always put a period '.' at the end of every ABAP statement.",
      "Rule 2: To access a field inside a structure, use a hyphen: ls_employee-salary.",
      "Rule 3: Use FINAL(var) by default for immutability; reserve DATA(var) for counters and accumulators."
    ]
  },
  "day-1-modern-abap": {
    "title": "Zero-to-Hero Bridge: If You Come From JavaScript, Python, or SQL",
    "summary": "In traditional web development, you use modern ES6+ features like `const` (immutable variables), `map()`, `filter()`, `reduce()`, and ternary operators `condition ? val1 : val2`. Day 1 gives you the exact same modern functional powers in modern ABAP: `FINAL` is your `const`, `VALUE #( FOR ... )` is your `.map()`, `WHERE` is your `.filter()`, and `REDUCE #( )` is your `.reduce()`.",
    "whyClassicWasHard": "In 1995 ABAP, developers had to declare every variable at the top of the program in a 50-line list, write manual `LOOP AT itab INTO wa ... APPEND wa TO target ... ENDLOOP` for simple filters, and use mutable global state. Modern ABAP 7.50+ / 7.57+ eliminates all of that with functional constructor expressions.",
    "jargonBuster": [
      {
        "term": "FINAL(var)",
        "translation": "Immutable variable declaration",
        "modernEquivalent": "const var = ... in JS/TS or val in Kotlin"
      },
      {
        "term": "DATA(var)",
        "translation": "Mutable inline variable",
        "modernEquivalent": "let var = ... in JS/TS or var in Go/C#"
      },
      {
        "term": "VALUE #( ... )",
        "translation": "Constructor expression for objects & internal tables",
        "modernEquivalent": "[ { ... }, { ... } ] or new Array() / object literal"
      },
      {
        "term": "BASE itab",
        "translation": "Spread existing records into a new collection",
        "modernEquivalent": "[...existingTable, newRecord] (spread operator)"
      },
      {
        "term": "REDUCE #( ... )",
        "translation": "Fold / accumulate an entire table into a single value",
        "modernEquivalent": "array.reduce((acc, curr) => acc + curr, 0)"
      },
      {
        "term": "IF_OO_ADT_CLASSRUN",
        "translation": "Interface to run a class directly in the console",
        "modernEquivalent": "main() entrypoint or console.log runner"
      }
    ],
    "proTips": [
      "Never declare variables at the top of a method. Declare them inline at the exact spot they are used.",
      "If a variable is only assigned once, use FINAL(var). The compiler will optimize it in CPU cache.",
      "Always use @host_variables when passing ABAP variables into SQL queries (e.g. WHERE status = @lv_status)."
    ]
  },
  "day-2-oop-abap": {
    "title": "Zero-to-Hero Bridge: If You Come From TypeScript, Java, or C#",
    "summary": "In modern OOP (Java/TypeScript/C#), everything is classes, interfaces, dependency injection, try/catch exceptions, and automated testing (Jest, JUnit). Classic 1990s ABAP used procedural scripts (\"reports\"), global variables, and subroutines (PERFORM/FORM). Today, ABAP Cloud is 100% strict Object-Oriented. A class has DEFINITION and IMPLEMENTATION blocks, interfaces start with `zif_`, and unit tests use ABAP Unit (`cl_abap_unit_assert`).",
    "whyClassicWasHard": "Old SAP code relied on PERFORM subroutines where data types were untyped, errors were returned as sy-subrc integer error codes (which developers forgot to check!), and automated testing did not exist. In modern ABAP, classes throw typed exceptions (`CX_STATIC_CHECK`) and every method has strict unit test coverage.",
    "jargonBuster": [
      {
        "term": "CLASS ... DEFINITION / IMPLEMENTATION",
        "translation": "Class header & body",
        "modernEquivalent": "TypeScript interface/header file (.d.ts) + class body (.ts)"
      },
      {
        "term": "INTERFACES zif_name",
        "translation": "Implements an interface",
        "modernEquivalent": "class Service implements IService"
      },
      {
        "term": "CX_STATIC_CHECK",
        "translation": "Checked Exception class",
        "modernEquivalent": "throw new CustomError() in TS / checked Exception in Java"
      },
      {
        "term": "cl_abap_unit_assert",
        "translation": "Unit testing assertions library",
        "modernEquivalent": "expect(...) in Jest or Assert.AreEqual in JUnit"
      },
      {
        "term": "FOR TESTING",
        "translation": "Test class annotation",
        "modernEquivalent": "@Test / describe(...) block in modern testing frameworks"
      }
    ],
    "proTips": [
      "Always write ABAP Unit tests in local test classes with FOR TESTING. They run instantly in Eclipse ADT or CI/CD.",
      "Use class-based exceptions instead of numeric sy-subrc codes for clean error propagation.",
      "Keep public interfaces minimal; encapsulate helper logic in PRIVATE SECTION."
    ]
  },
  "day-3-cds-entities": {
    "title": "Zero-to-Hero Bridge: If You Come From SQL, Prisma, or GraphQL",
    "summary": "In modern relational database design, you create SQL views and define schemas (like Prisma or GraphQL schemas) with relationships (`hasMany`, `belongsTo`). In SAP, Core Data Services (CDS) is that exact declarative modeling language. A CDS View Entity compiles directly into a native SAP HANA in-memory calculation view. It runs at hardware speed inside HANA RAM, not in application server memory!",
    "whyClassicWasHard": "Classic SAP forced developers to write 500-line ABAP programs that downloaded millions of raw rows into application server RAM, looped over them line-by-line, and joined them in memory. CDS pushes all joins, aggregations, and business calculations directly into the SAP HANA database engine.",
    "jargonBuster": [
      {
        "term": "DEFINE VIEW ENTITY",
        "translation": "Modern database view",
        "modernEquivalent": "CREATE VIEW v_name AS SELECT ... or Prisma model view"
      },
      {
        "term": "ASSOCIATION [0..*] TO Target",
        "translation": "Lazy relational join",
        "modernEquivalent": "Prisma relation field or GraphQL resolver"
      },
      {
        "term": "_Booking",
        "translation": "Exposed association name (starts with underscore by convention)",
        "modernEquivalent": "user.orders (navigational property)"
      },
      {
        "term": "VDM (Virtual Data Model)",
        "translation": "Architectural layering standard",
        "modernEquivalent": "Basic (Raw table schema) -> Composite (Joined views) -> Consumption (API/UI view)"
      },
      {
        "term": "@AccessControl.authorizationCheck",
        "translation": "Row-Level Security (RLS) annotation",
        "modernEquivalent": "Supabase RLS or PostgreSQL row security policy"
      }
    ],
    "proTips": [
      "Always use DEFINE VIEW ENTITY, never the obsolete DEFINE VIEW (which created legacy DDIC artifacts).",
      "Prefix association names with an underscore (e.g. _Carrier, _Customer) to make navigational properties clear.",
      "Use cast( ) and case expressions in CDS so the HANA database handles calculation pushdown."
    ]
  },
  "day-4-rap-managed": {
    "title": "Zero-to-Hero Bridge: If You Come From Prisma, Django, Rails, or NestJS",
    "summary": "In modern web frameworks, an ORM model handles table schema + CRUD operations (create, read, update, delete) + database transactions automatically. In SAP RAP, a \"Managed Business Object\" is that exact ORM engine! You write a CDS View Entity for the data structure and a Behavior Definition (BDEF) for behavior. The RAP runtime framework automatically writes all the SQL INSERTs, UPDATEs, DELETEs, and lock concurrency behind the scenes for you!",
    "whyClassicWasHard": "In 1990s SAP, there was no managed ORM. Developers had to write custom BAPIs, maintain complex global memory buffers, manually call ENQUEUE/DEQUEUE locks, and manually write `COMMIT WORK AND WAIT` which frequently caused table deadlocks and race conditions. Managed RAP handles the entire transactional buffer automatically.",
    "jargonBuster": [
      {
        "term": "Managed BO",
        "translation": "Framework-managed transactional lifecycle",
        "modernEquivalent": "Prisma / TypeORM / ActiveRecord automatic CRUD"
      },
      {
        "term": "BDEF (Behavior Definition)",
        "translation": "Controller & rules definition",
        "modernEquivalent": "Model controller routes + schema validation rules"
      },
      {
        "term": "strict ( 2 );",
        "translation": "Modern compiler strict mode",
        "modernEquivalent": "\"use strict\" / TypeScript strict: true"
      },
      {
        "term": "numbering : managed",
        "translation": "Auto-generated primary keys",
        "modernEquivalent": "@default(uuid()) or AUTO_INCREMENT"
      },
      {
        "term": "lock master",
        "translation": "Root entity concurrency lock owner",
        "modernEquivalent": "Row-level database transaction lock"
      },
      {
        "term": "etag master",
        "translation": "Optimistic locking timestamp / hash",
        "modernEquivalent": "HTTP ETag or @version field in ORM"
      }
    ],
    "proTips": [
      "Always specify strict ( 2 ); at the top of your BDEF. It is mandatory for S/4HANA Cloud and Clean Core.",
      "Never use classic COMMIT WORK inside managed BO handlers; RAP handles transactional commit automatically.",
      "Use managed numbering with UUID keys to eliminate manual number range bottleneck issues."
    ]
  },
  "day-5-bdef-validations": {
    "title": "Zero-to-Hero Bridge: If You Come From Express, NestJS, or Spring Boot",
    "summary": "In traditional backend engineering, when a user saves a form, you have \"Lifecycle Hooks\" / \"Middlewares\": 1. Automatic field calculation (e.g. `preSave` hooks computing tax or generating order IDs) and 2. Schema validation (e.g. Joi, Zod, or class-validator rejecting invalid dates). In SAP RAP: Determinations are your automatic calculation hooks, and Validations are your schema validators!",
    "whyClassicWasHard": "In classic SAP, validation logic was scattered randomly across Dynpro screen PAI modules, user exits, and BAPI wrappers. If someone bypassed the screen, the validation never ran! In RAP, Determinations and Validations are part of the core Business Object engine, so they execute identically whether called from React, Fiori, mobile, or an automated batch script.",
    "jargonBuster": [
      {
        "term": "Determination",
        "translation": "Automatic side-effect calculation hook",
        "modernEquivalent": "preSave hook / middleware calculating default values"
      },
      {
        "term": "Validation",
        "translation": "Business rule validator",
        "modernEquivalent": "Zod / Joi validation middleware rejecting bad inputs"
      },
      {
        "term": "on modify",
        "translation": "Trigger hook when fields are changed in buffer",
        "modernEquivalent": "onChange / beforeUpdate event"
      },
      {
        "term": "on save",
        "translation": "Trigger hook at commit time before database write",
        "modernEquivalent": "beforeCommit hook"
      },
      {
        "term": "failed table",
        "translation": "Table holding failed entity keys",
        "modernEquivalent": "HTTP 400 Bad Request error object"
      },
      {
        "term": "reported table",
        "translation": "Table holding user-facing error messages",
        "modernEquivalent": "response.json({ errors: [ ... ] })"
      }
    ],
    "proTips": [
      "Validations must never modify the transactional buffer! Only check data and record keys in `failed` and messages in `reported`.",
      "Determinations calculate defaults and totals using EML `MODIFY ENTITIES`.",
      "Always use `IN LOCAL MODE` when reading or modifying entities inside behavior handlers."
    ]
  },
  "day-6-actions-auth": {
    "title": "Zero-to-Hero Bridge: If You Come From REST APIs, Stripe, or Auth0",
    "summary": "In modern REST APIs, you have custom action endpoints (like `POST /orders/123/approve` or `POST /flights/456/cancel`) and permission checks (RBAC / JWT role verification). In SAP RAP: Actions are your custom business operations! Dynamic Feature Control is how you dynamically disable buttons (e.g. disabling the \"Approve\" button if the order is already approved). And RAP Authorization is how you enforce user roles and spending limits.",
    "whyClassicWasHard": "Classic SAP forced developers to write complex PFCG role checks inside screen PBO modules and use hardcoded status codes. If you clicked a button, the entire Dynpro screen flickered and reloaded. In RAP, Dynamic Feature Control sends UI flags directly over OData V4 JSON, so React or Fiori buttons disable and enable in real-time.",
    "jargonBuster": [
      {
        "term": "action ( features : instance ) name",
        "translation": "Custom business operation on an entity",
        "modernEquivalent": "Custom REST POST endpoint (e.g. /invoices/{id}/pay)"
      },
      {
        "term": "factory action",
        "translation": "Operation that creates and returns a brand new entity",
        "modernEquivalent": "Factory method creating deep copy / clone"
      },
      {
        "term": "get_instance_features",
        "translation": "Dynamic button / field enabling hook",
        "modernEquivalent": "Feature flags / permissions determining disabled={true/false}"
      },
      {
        "term": "authorization master ( instance )",
        "translation": "Instance-level permission check",
        "modernEquivalent": "Role-Based Access Control (RBAC) middleware verifying user authority"
      },
      {
        "term": "result [1] $self",
        "translation": "Action returns the modified entity itself",
        "modernEquivalent": "res.status(200).json(updatedRecord)"
      }
    ],
    "proTips": [
      "Always declare features: instance on actions that depend on current status (e.g. you cannot cancel an already cancelled travel).",
      "In get_instance_features, return %features-%action = if_abap_behv=>fc-o-disabled to gray out buttons.",
      "Keep authorization checks fast and clean; check global authorization first before doing heavy database instance checks."
    ]
  },
  "day-7-draft-handling": {
    "title": "Zero-to-Hero Bridge: If You Come From Google Docs, Notion, or Medium",
    "summary": "When writing a document in Google Docs or Medium, you don't click \"Save\" every 3 seconds. The server silently autosaves your edits into a \"Draft\" workspace. If your laptop battery dies or your internet cuts out, your draft is waiting right where you left it. When you are finally ready, you click \"Publish\" (Activate). In SAP RAP: Draft Handling does this exact enterprise autosave! Draft changes are stored in a dedicated draft table without contaminating the real live production business tables until you click Activate.",
    "whyClassicWasHard": "In classic SAP, user transactions locked database tables for hours. If a user went to lunch with an open SAP GUI screen, nobody else in the company could edit that purchase order! With RAP Draft, edits are autosaved without holding database locks. Concurrency is managed via optimistic ETags.",
    "jargonBuster": [
      {
        "term": "with draft;",
        "translation": "Enables enterprise autosave in BDEF",
        "modernEquivalent": "Auto-save draft document system"
      },
      {
        "term": "draft table ztable_d",
        "translation": "Shadow table storing work-in-progress edits",
        "modernEquivalent": "drafts collection / staging table"
      },
      {
        "term": "Edit / Activate / Discard",
        "translation": "Draft lifecycle operations",
        "modernEquivalent": "Open draft -> Publish to Production -> Delete draft"
      },
      {
        "term": "draft determine action Prepare",
        "translation": "Pre-flight validation hook before publishing",
        "modernEquivalent": "Pre-publish schema & business rule validation check"
      },
      {
        "term": "HTTP 412 Precondition Failed",
        "translation": "Concurrency conflict error",
        "modernEquivalent": "Git merge conflict / ETag mismatch between users"
      }
    ],
    "proTips": [
      "Always declare draft determine action Prepare in BDEF so validations run before draft data is activated into production.",
      "The draft table structure is auto-generated by Eclipse ADT using Quick Fix (Ctrl+1) on the BDEF.",
      "Never read from draft tables directly in standard queries; always read CDS view entities."
    ]
  },
  "day-8-odata-v4": {
    "title": "Zero-to-Hero Bridge: If You Come From Swagger / OpenAPI / REST",
    "summary": "In modern web development, you write a backend API router and document it with OpenAPI / Swagger (e.g. `GET /api/v1/travels`). In SAP RAP, a \"Service Definition\" is your API schema where you pick which entities to expose. A \"Service Binding\" is where you choose the protocol (OData V4 - UI or OData V4 - Web API). The framework automatically exposes a full RESTful JSON API with automatic pagination (`$skip`, `$top`), sorting (`$orderby`), filtering (`$filter`), and schema documentation (`$metadata`)!",
    "whyClassicWasHard": "In classic SAP, exposing a table as an API required transaction `/IWFND/GW_CLIENT`, creating 10 SE80 classes, manually mapping every XML node, and writing manual pagination math. OData V4 in RAP is completely declarative in two 5-line files and produces clean JSON.",
    "jargonBuster": [
      {
        "term": "DEFINE SERVICE name",
        "translation": "API exposure list",
        "modernEquivalent": "Swagger / OpenAPI route specification"
      },
      {
        "term": "OData V4 - UI",
        "translation": "Stateful protocol optimized for frontend apps",
        "modernEquivalent": "Full interactive UI API with draft session support"
      },
      {
        "term": "OData V4 - Web API",
        "translation": "Stateless REST API for external microservices",
        "modernEquivalent": "Standard public REST API (Stripe/GitHub style)"
      },
      {
        "term": "$metadata",
        "translation": "Machine-readable schema XML/JSON",
        "modernEquivalent": "openapi.json / GraphQL introspective schema"
      },
      {
        "term": "Fiori Preview",
        "translation": "Instant test UI generated in Eclipse ADT",
        "modernEquivalent": "Swagger UI \"Try it out\" interactive web sandbox"
      }
    ],
    "proTips": [
      "Always use OData V4 over legacy OData V2. OData V4 has 60% smaller JSON payloads and supports batching.",
      "Use clean business aliases when exposing: `expose ZC_Travel as Travel;` instead of raw CDS names.",
      "Test your API immediately using Fiori Preview in Eclipse ADT by double clicking the Service Binding."
    ]
  },
  "day-9-react-service": {
    "title": "Zero-to-Hero Bridge: If You Come From React, Vite, or Next.js",
    "summary": "You already know how to fetch data in React using `useEffect`, `useState`, Axios, or React Query. In an enterprise SAP RAP landscape, the frontend is often a modern React + Vite application. The only special difference between SAP and standard REST is: 1. CSRF Token Handshake (SAP requires fetching an `x-csrf-token` on a GET request before allowing POST/PATCH/DELETE), 2. Cookie/Session management, and 3. OData V4 JSON response unwrapping (`response.data.value`).",
    "whyClassicWasHard": "Classic SAP forced everyone to use SAP GUI or monolithic Web Dynpro. Today, SAP provides standard OData V4 services so developers can build ultra-fast, beautiful React / Tailwind web applications that talk directly to SAP S/4HANA Cloud.",
    "jargonBuster": [
      {
        "term": "x-csrf-token",
        "translation": "Cross-Site Request Forgery security token",
        "modernEquivalent": "CSRF protection token header in Express / Django"
      },
      {
        "term": "Vite Proxy",
        "translation": "Dev server proxy to avoid CORS errors",
        "modernEquivalent": "vite.config.js server.proxy target"
      },
      {
        "term": "response.data.value",
        "translation": "OData V4 collection wrapper",
        "modernEquivalent": "res.data.items or res.data.results"
      },
      {
        "term": "useODataEntity",
        "translation": "Custom React hook for data fetching",
        "modernEquivalent": "useQuery() in TanStack Query / React Query"
      }
    ],
    "proTips": [
      "Always fetch x-csrf-token with header x-csrf-token: fetch on your first GET request and cache it in memory.",
      "Use Vite dev proxy (/sap -> http://your-sap-system:8000) during development to avoid CORS issues completely.",
      "Unwrap array responses from data.value; individual entity reads return data directly."
    ]
  },
  "day-10-react-forms-errors": {
    "title": "Zero-to-Hero Bridge: If You Come From React Hook Form, Formik, or Redux",
    "summary": "In modern React forms, you don't want to send the entire 80-field user object back to the database when the user only changed their phone number. That wastes bandwidth and triggers false concurrency conflicts. Instead, you send a \"Delta PATCH\" (only sending `{ \"phoneNumber\": \"...\" }`). In SAP RAP, HTTP PATCH with an ETag `If-Match` header guarantees that you only update what changed and nobody else overwrote the data while you were typing!",
    "whyClassicWasHard": "Old SAP systems used full-table overwrites: if two users edited different fields on the same order, whoever saved last silently wiped out the first user's changes! With React Delta PATCH + RAP ETag optimistic locking, the second user gets a gentle warning: \"Another user changed this order. Review changes before saving.\"",
    "jargonBuster": [
      {
        "term": "Delta PATCH",
        "translation": "Sending only modified fields",
        "modernEquivalent": "HTTP PATCH with JSON diff"
      },
      {
        "term": "If-Match: W/\"etag\"",
        "translation": "Optimistic locking header",
        "modernEquivalent": "Compare-and-swap concurrency check"
      },
      {
        "term": "innererror.errordetails",
        "translation": "SAP backend error structure",
        "modernEquivalent": "Field-level validation error map { field: errorMsg }"
      },
      {
        "term": "Controlled Input",
        "translation": "React input bound to state",
        "modernEquivalent": "<input value={state} onChange={...} />"
      }
    ],
    "proTips": [
      "Always compute delta diff: const delta = Object.keys(current).filter(k => current[k] !== original[k]).",
      "Extract SAP backend error messages from err.response.data.error.details or innererror.errordetails.",
      "Never use HTTP PUT for updates in RAP; RAP OData V4 strictly expects HTTP PATCH for delta updates."
    ]
  },
  "day-11-eml-deep-dive": {
    "title": "Zero-to-Hero Bridge: If You Come From Prisma, TypeORM, or Entity Framework",
    "summary": "In traditional web apps, you query and mutate database models using ORM methods like `prisma.order.findMany({ select: { id, total } })` or `db.order.update({ where: { id }, data: { status: \"Shipped\" } })`. In SAP RAP, Entity Manipulation Language (EML) is the built-in ORM query language! Instead of raw SQL, you write `READ ENTITIES OF ...` and `MODIFY ENTITIES OF ...`. EML automatically executes all validations, determinations, feature control, and authorizations defined on the entity.",
    "whyClassicWasHard": "In classic SAP, developers called raw SQL `UPDATE sflight SET seatsocc = ...` directly. This was catastrophic because it bypassed all business logic, never sent confirmation emails, never calculated tax, and left database tables in inconsistent states. EML guarantees that all business rules are always executed.",
    "jargonBuster": [
      {
        "term": "READ ENTITIES OF ...",
        "translation": "ORM Read query",
        "modernEquivalent": "db.entity.findUnique() / findMany()"
      },
      {
        "term": "MODIFY ENTITIES OF ...",
        "translation": "ORM Mutation (Create, Update, Delete)",
        "modernEquivalent": "db.entity.update() / create() / delete()"
      },
      {
        "term": "IN LOCAL MODE",
        "translation": "Bypass authorization & features during internal logic",
        "modernEquivalent": "Admin bypass / sudo mode inside internal service handlers"
      },
      {
        "term": "COMMIT ENTITIES",
        "translation": "Save all buffer changes to the database",
        "modernEquivalent": "db.transaction.commit()"
      },
      {
        "term": "result, failed, reported, mapped",
        "translation": "Standard EML response output tables",
        "modernEquivalent": "{ data, errors, createdKeys } in API responses"
      }
    ],
    "proTips": [
      "Always check the `failed` table after calling EML MODIFY ENTITIES to catch business rule rejections.",
      "Inside behavior handler methods, always use IN LOCAL MODE so your internal validation or determination does not fail its own authorization check.",
      "Use COMMIT ENTITIES only in external consumption programs (like console runners or APIs); never inside a behavior implementation class."
    ]
  },
  "day-12-side-effects-virtual": {
    "title": "Zero-to-Hero Bridge: If You Come From WebSockets, GraphQL Computed Fields, or Microservices",
    "summary": "In modern web apps, you have 1. Computed / Virtual Fields (fields that are calculated on-the-fly in code, not stored in the DB, like `user.fullName` or `account.ageInDays`) and 2. Real-time Side Effects (when you change item quantity in a shopping cart, the UI instantly recalculates tax and shipping without refreshing the page). In SAP RAP: Virtual Elements are your on-the-fly computed fields, and BDEF Side Effects tell the UI framework exactly which fields to re-fetch when an input changes!",
    "whyClassicWasHard": "In classic SAP, developers had to write manual screen loops and trigger PBO/PAI cycles to recalculate totals, causing massive screen flickering. With RAP Side Effects, the framework automatically dispatches delta updates over OData V4.",
    "jargonBuster": [
      {
        "term": "Virtual Element",
        "translation": "On-the-fly computed field calculated in ABAP",
        "modernEquivalent": "Computed property / getter function in TypeScript/Prisma"
      },
      {
        "term": "Side Effects",
        "translation": "UI auto-refresh dependency rules in BDEF",
        "modernEquivalent": "Reactive state dependency array / triggers"
      },
      {
        "term": "with unmanaged save",
        "translation": "Hook to write to non-standard or external databases",
        "modernEquivalent": "Custom DB driver / external API sync hook"
      },
      {
        "term": "IF_SADL_EXIT_CALC_ELEMENT_READ",
        "translation": "Interface for virtual element calculation",
        "modernEquivalent": "Virtual field resolver class in GraphQL"
      }
    ],
    "proTips": [
      "Use virtual elements strictly for transient UI calculations; never store temporary transient data in database tables.",
      "Specify exact field-to-field side effects in BDEF to avoid re-fetching the entire entity when one field changes.",
      "Use unmanaged save when you must update an external cloud service (like SAP Event Mesh or an audit log) inside the transactional commit phase."
    ]
  },
  "day-13-clean-core-atc": {
    "title": "Zero-to-Hero Bridge: If You Come From Semantic Versioning, Kubernetes, or Clean Architecture",
    "summary": "In modern cloud computing, you never hack or monkey-patch the Linux kernel or modify Docker core files; you write decoupled microservices using official public APIs. In legacy SAP, companies hired developers to modify standard SAP source code (core modifications). The result? Upgrading SAP took 2 years and cost millions of dollars! \"Clean Core\" is SAP's modern architecture rule: standard SAP core code is completely locked and read-only. You build on top of official, stable Released APIs (C1 contract) using ABAP Cloud, so SAP can upgrade the underlying cloud system automatically every 6 months without breaking your custom apps.",
    "whyClassicWasHard": "Classic developers directly queried unreleased internal tables (like `MARA`, `VBAK`, `BSEG`). When SAP upgraded, column names and database structures changed, breaking thousands of custom reports. Clean Core enforces that all database reads use stable CDS View Entities (like `I_Product` and `I_SalesOrder`).",
    "jargonBuster": [
      {
        "term": "Clean Core",
        "translation": "Zero modifications to standard SAP core",
        "modernEquivalent": "Decoupled cloud extensions using public stable APIs"
      },
      {
        "term": "ABAP Cloud (Language Version 5)",
        "translation": "Strict cloud-ready dialect of ABAP",
        "modernEquivalent": "Modern TypeScript / Go with obsolete legacy APIs removed"
      },
      {
        "term": "Release Contract C1",
        "translation": "API stability guarantee from SAP",
        "modernEquivalent": "Semantic Versioning (SemVer) backward compatibility promise"
      },
      {
        "term": "ABAP Test Cockpit (ATC)",
        "translation": "Automated static code analyzer",
        "modernEquivalent": "ESLint + SonarQube in CI/CD pipeline"
      },
      {
        "term": "On-Stack Extensibility",
        "translation": "Custom ABAP code running directly in BTP / S/4HANA",
        "modernEquivalent": "Cloud-native embedded microservice"
      }
    ],
    "proTips": [
      "Always set ABAP Language Version to \"ABAP for Cloud Development\" in your package properties.",
      "Run ATC check variant ABAP_CLOUD_DEVELOPMENT before committing any transport.",
      "Replace direct queries on BUT000 with I_BusinessPartner, MARA with I_Product, and VBAK with I_SalesOrder."
    ]
  },
  "day-14-capstone-interview": {
    "title": "Zero-to-Hero Bridge: If You Are Preparing For an Architect Interview or CTO Presentation",
    "summary": "Congratulations on reaching the final day! Day 14 ties together the complete end-to-end full-stack puzzle: from database tables -> CDS View Entities -> RAP Behavior Definitions -> OData V4 exposure -> React Frontend. You will practice the exact questions and architectural whiteboard challenges asked by SAP CTOs, Enterprise Architects, and Big 4 Technical Interviewers.",
    "whyClassicWasHard": "Traditional SAP interviews quizzed candidates on memorizing obscure transaction codes (SE11, SE38, SM30, ST05). Modern SAP Cloud Architect interviews focus on clean architecture, draft concurrency, ETag conflict resolution, API governance, and decoupled React microfrontends.",
    "jargonBuster": [
      {
        "term": "Full-Stack RAP Architecture",
        "translation": "Complete 5-tier system stack",
        "modernEquivalent": "DB -> ORM -> Business Logic -> REST API -> React UI"
      },
      {
        "term": "Managed vs Unmanaged BO",
        "translation": "Framework CRUD vs Custom CRUD",
        "modernEquivalent": "High-level ORM vs raw custom DB repository"
      },
      {
        "term": "Optimistic Concurrency",
        "translation": "ETag conflict prevention",
        "modernEquivalent": "Conditional HTTP requests with If-Match"
      },
      {
        "term": "Clean Core Audit",
        "translation": "Upgrade-readiness certification",
        "modernEquivalent": "Zero tech-debt / cloud-native compliance review"
      }
    ],
    "proTips": [
      "In an interview, always explain the \"Why\" before the \"How\": explain why Clean Core saves millions during S/4HANA upgrades.",
      "Draw the 5 layers clearly: Database Table -> CDS View Entities -> RAP BDEF -> Service Binding (OData V4) -> React Client.",
      "Emphasize that Managed RAP eliminates 80% of boilerplate SQL and transactional lock management."
    ]
  }
};

export default {
  DAY_ASSIGNMENTS,
  BEGINNER_BRIDGES
};
