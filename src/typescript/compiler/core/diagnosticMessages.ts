///<reference path='references.ts' />

module TypeScript {
    export interface IDiagnosticMessages {
        error_TS_0__1: DiagnosticInfo;
        warning_TS_0__1: DiagnosticInfo;

        _0__NL__1_TB__2: DiagnosticInfo;
        _0_TB__1: DiagnosticInfo;

        // Syntactic diagnostics.
        Unrecognized_escape_sequence: DiagnosticInfo;
        Unexpected_character_0: DiagnosticInfo;
        Missing_closing_quote_character: DiagnosticInfo;
        Identifier_expected: DiagnosticInfo;
        _0_keyword_expected: DiagnosticInfo;
        _0_expected: DiagnosticInfo;
        Identifier_expected__0__is_a_keyword: DiagnosticInfo;
        Automatic_semicolon_insertion_not_allowed: DiagnosticInfo;
        Unexpected_token__0_expected: DiagnosticInfo;
        Trailing_separator_not_allowed: DiagnosticInfo;
        _StarSlash__expected: DiagnosticInfo;
        _public_or_private_modifier_must_precede__static_: DiagnosticInfo;
        Unexpected_token_: DiagnosticInfo;
        A_catch_clause_variable_cannot_have_a_type_annotation: DiagnosticInfo;
        Rest_parameter_must_be_last_in_list: DiagnosticInfo;
        Parameter_cannot_have_question_mark_and_initializer: DiagnosticInfo;
        Required_parameter_cannot_follow_optional_parameter: DiagnosticInfo;
        Index_signatures_cannot_have_rest_parameters: DiagnosticInfo;
        Index_signature_parameter_cannot_have_accessibility_modifiers: DiagnosticInfo;
        Index_signature_parameter_cannot_have_a_question_mark: DiagnosticInfo;
        Index_signature_parameter_cannot_have_an_initializer: DiagnosticInfo;
        Index_signature_must_have_a_type_annotation: DiagnosticInfo;
        Index_signature_parameter_must_have_a_type_annotation: DiagnosticInfo;
        Index_signature_parameter_type_must_be__string__or__number_: DiagnosticInfo;
        _extends__clause_already_seen: DiagnosticInfo;
        _extends__clause_must_precede__implements__clause: DiagnosticInfo;
        Class_can_only_extend_single_type: DiagnosticInfo;
        _implements__clause_already_seen: DiagnosticInfo;
        Accessibility_modifier_already_seen: DiagnosticInfo;
        _0__modifier_must_precede__1__modifier: DiagnosticInfo;
        _0__modifier_already_seen: DiagnosticInfo;
        _0__modifier_cannot_appear_on_a_class_element: DiagnosticInfo;
        Interface_declaration_cannot_have__implements__clause: DiagnosticInfo;
        _super__invocation_cannot_have_type_arguments: DiagnosticInfo;
        Non_ambient_modules_cannot_use_quoted_names: DiagnosticInfo;
        Statements_are_not_allowed_in_ambient_contexts: DiagnosticInfo;
        Implementations_are_not_allowed_in_ambient_contexts: DiagnosticInfo;
        _declare__modifier_not_allowed_for_code_already_in_an_ambient_context: DiagnosticInfo;
        Initializers_are_not_allowed_in_ambient_contexts: DiagnosticInfo;
        Overload_and_ambient_signatures_cannot_specify_parameter_properties: DiagnosticInfo;
        Function_implementation_expected: DiagnosticInfo;
        Constructor_implementation_expected: DiagnosticInfo;
        Function_overload_name_must_be__0_: DiagnosticInfo;
        _0__modifier_cannot_appear_on_a_module_element: DiagnosticInfo;
        _declare__modifier_cannot_appear_on_an_interface_declaration: DiagnosticInfo;
        _declare__modifier_required_for_top_level_element: DiagnosticInfo;
        Rest_parameter_cannot_be_optional: DiagnosticInfo;
        Rest_parameter_cannot_have_initializer: DiagnosticInfo;
        _set__accessor_parameter_cannot_have_accessibility_modifier: DiagnosticInfo;
        _set__accessor_parameter_cannot_be_optional: DiagnosticInfo;
        _set__accessor_parameter_cannot_have_initializer: DiagnosticInfo;
        _set__accessor_cannot_have_rest_parameter: DiagnosticInfo;
        _get__accessor_cannot_have_parameters: DiagnosticInfo;
        Modifiers_cannot_appear_here: DiagnosticInfo;
        Accessors_are_only_available_when_targeting_EcmaScript5_and_higher: DiagnosticInfo;
        Enum_member_must_have_initializer: DiagnosticInfo;
        _module_______is_deprecated__Use__require_______instead: DiagnosticInfo;
        Export_assignments_cannot_be_used_in_internal_modules: DiagnosticInfo;
        Export_assignment_not_allowed_in_module_with_exported_element: DiagnosticInfo;
        Module_cannot_have_multiple_export_assignments: DiagnosticInfo;





        // Semantic diagnostics.
        Duplicate_identifier__0_: DiagnosticInfo;
        The_name__0__does_not_exist_in_the_current_scope: DiagnosticInfo;
        The_name__0__does_not_refer_to_a_value: DiagnosticInfo;
        Keyword__super__can_only_be_used_inside_a_class_instance_method: DiagnosticInfo;
        The_left_hand_side_of_an_assignment_expression_must_be_a_variable__property_or_indexer: DiagnosticInfo;
        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new__: DiagnosticInfo;
        Value_of_type__0__is_not_callable: DiagnosticInfo;
        Value_of_type__0__is_not_newable: DiagnosticInfo;
        Value_of_type__0__is_not_indexable_by_type__1_: DiagnosticInfo;
        Operator__0__cannot_be_applied_to_types__1__and__2_: DiagnosticInfo;
        Operator__0__cannot_be_applied_to_types__1__and__2__3: DiagnosticInfo;
        Cannot_convert__0__to__1_: DiagnosticInfo;
        Cannot_convert__0__to__1__NL__2: DiagnosticInfo;
        Expected_var__class__interface__or_module: DiagnosticInfo;
        Operator__0__cannot_be_applied_to_type__1_: DiagnosticInfo;
        Getter__0__already_declared: DiagnosticInfo;
        Setter__0__already_declared: DiagnosticInfo;
        Accessor_cannot_have_type_parameters: DiagnosticInfo;
        _set__accessor_must_have_only_one_parameter: DiagnosticInfo;
        Use_of_deprecated__bool__type__Use__boolean__instead: DiagnosticInfo;



        //Privacy error related diagnostics
        Exported_class__0__extends_private_class__1_: DiagnosticInfo;
        Exported_class__0__implements_private_interface__1_: DiagnosticInfo;
        Exported_interface__0__extends_private_interface__1_: DiagnosticInfo;
        Exported_class__0__extends_class_from_inaccessible_module__1_: DiagnosticInfo;
        Exported_class__0__implements_interface_from_inaccessible_module__1_: DiagnosticInfo;
        Exported_interface__0__extends_interface_from_inaccessible_module__1_: DiagnosticInfo;
        Public_static_property__0__of__exported_class_has_or_is_using_private_type__1_: DiagnosticInfo;
        Public_property__0__of__exported_class_has_or_is_using_private_type__1_: DiagnosticInfo;
        Property__0__of__exported_interface_has_or_is_using_private_type__1_: DiagnosticInfo;
        Exported_variable__0__has_or_is_using_private_type__1_: DiagnosticInfo;
        Public_static_property__0__of__exported_class_is_using_inaccessible_module__1_: DiagnosticInfo;
        Public_property__0__of__exported_class_is_using_inaccessible_module__1_: DiagnosticInfo;
        Property__0__of__exported_interface_is_using_inaccessible_module__1_: DiagnosticInfo;
        Exported_variable__0__is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_constructor_from_exported_class_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_public_static_property_setter_from_exported_class_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_public_property_setter_from_exported_class_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_constructor_signature_from_exported_interface_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_call_signature_from_exported_interface_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_public_static_method_from_exported_class_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_public_method_from_exported_class_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_method_from_exported_interface_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_exported_function_has_or_is_using_private_type__1_: DiagnosticInfo;
        Parameter__0__of_constructor_from_exported_class_is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_public_static_property_setter_from_exported_class_is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_public_property_setter_from_exported_class_is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_constructor_signature_from_exported_interface_is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_call_signature_from_exported_interface_is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_public_static_method_from_exported_class_is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_public_method_from_exported_class_is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_method_from_exported_interface_is_using_inaccessible_module__1_: DiagnosticInfo;
        Parameter__0__of_exported_function_is_using_inaccessible_module__1_: DiagnosticInfo;
        Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_public_method_from_exported_class_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_method_from_exported_interface_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_exported_function_has_or_is_using_private_type__0_: DiagnosticInfo;
        Return_type_of_public_static_property_getter_from_exported_class_is_using_inaccessible_module__0_: DiagnosticInfo;
        Return_type_of_public_property_getter_from_exported_class_is_using_inaccessible_module__0_: DiagnosticInfo;
        Return_type_of_constructor_signature_from_exported_interface_is_using_inaccessible_module__0_: DiagnosticInfo;
        Return_type_of_call_signature_from_exported_interface_is_using_inaccessible_module__0_: DiagnosticInfo;
        Return_type_of_index_signature_from_exported_interface_is_using_inaccessible_module__0_: DiagnosticInfo;
        Return_type_of_public_static_method_from_exported_class_is_using_inaccessible_module__0_: DiagnosticInfo;
        Return_type_of_public_method_from_exported_class_is_using_inaccessible_module__0_: DiagnosticInfo;
        Return_type_of_method_from_exported_interface_is_using_inaccessible_module__0_: DiagnosticInfo;



        _new_T____cannot_be_used_to_create_an_array__Use__new_Array_T_____instead: DiagnosticInfo;
        A_parameter_list_must_follow_a_generic_type_argument_list______expected: DiagnosticInfo;
        Multiple_constructor_implementations_are_not_allowed: DiagnosticInfo;
        Unable_to_resolve_external_module__0_: DiagnosticInfo;
        Module_cannot_be_aliased_to_a_non_module_type: DiagnosticInfo;
        A_class_may_only_extend_another_class: DiagnosticInfo;
        A_class_may_only_implement_another_class_or_interface: DiagnosticInfo;
        An_interface_may_only_extend_another_class_or_interface: DiagnosticInfo;
        An_interface_cannot_implement_another_type: DiagnosticInfo;
        Unable_to_resolve_type: DiagnosticInfo;
        Unable_to_resolve_type_of__0_: DiagnosticInfo;
        Unable_to_resolve_type_parameter_constraint: DiagnosticInfo;
        Type_parameter_constraint_cannot_be_a_primitive_type: DiagnosticInfo;
        Supplied_parameters_do_not_match_any_signature_of_call_target: DiagnosticInfo;
        Supplied_parameters_do_not_match_any_signature_of_call_target__NL__0: DiagnosticInfo;
        Invalid__new__expression: DiagnosticInfo;
        Call_signatures_used_in_a__new__expression_must_have_a__void__return_type: DiagnosticInfo;
        Could_not_select_overload_for__new__expression: DiagnosticInfo;
        Type__0__does_not_satisfy_the_constraint__1__for_type_parameter__2_: DiagnosticInfo;
        Could_not_select_overload_for__call__expression: DiagnosticInfo;
        Unable_to_invoke_type_with_no_call_signatures: DiagnosticInfo;
        Calls_to__super__are_only_valid_inside_a_class: DiagnosticInfo;
        Generic_type__0__requires_1_type_argument_s_: DiagnosticInfo;
        Type_of_conditional_expression_cannot_be_determined__Best_common_type_could_not_be_found_between__0__and__1_: DiagnosticInfo;
        Type_of_array_literal_cannot_be_determined__Best_common_type_could_not_be_found_for_array_elements: DiagnosticInfo;
        Could_not_find_enclosing_symbol_for_dotted_name__0_: DiagnosticInfo;
        The_property__0__does_not_exist_on_value_of_type__1__: DiagnosticInfo;
        Could_not_find_symbol__0_: DiagnosticInfo;
        _get__and__set__accessor_must_have_the_same_type: DiagnosticInfo;
        _this__cannot_be_referenced_in_current_location: DiagnosticInfo;
        Class__0__is_recursively_referenced_as_a_base_type_of_itself: DiagnosticInfo;
        Interface__0__is_recursively_referenced_as_a_base_type_of_itself: DiagnosticInfo;
        _super__property_access_is_permitted_only_in_a_constructor__instance_member_function__or_instance_member_accessor_of_a_derived_class: DiagnosticInfo;
        _super__cannot_be_referenced_in_non_derived_classes: DiagnosticInfo;
        A__super__call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_intialized_properties_or_has_parameter_properties: DiagnosticInfo;
        Constructors_for_derived_classes_must_contain_a__super__call: DiagnosticInfo;
        Super_calls_are_not_permitted_outside_constructors_or_in_local_functions_inside_constructors: DiagnosticInfo;
        _0_1__is_inaccessible: DiagnosticInfo;
        _this__cannot_be_referenced_within_module_bodies: DiagnosticInfo;
        _this__must_only_be_used_inside_a_function_or_script_context: DiagnosticInfo;
        Invalid__addition__expression___types_do_not_agree: DiagnosticInfo;
        The_right_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type: DiagnosticInfo;
        The_left_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type: DiagnosticInfo;
        The_type_of_a_unary_arithmetic_operation_operand_must_be_of_type__any____number__or_an_enum_type: DiagnosticInfo;
        Variable_declarations_for_for_in_expressions_cannot_contain_a_type_annotation: DiagnosticInfo;
        Variable_declarations_for_for_in_expressions_must_be_of_types__string__or__any_: DiagnosticInfo;
        The_right_operand_of_a_for_in_expression_must_be_of_type__any____an_object_type_or_a_type_parameter: DiagnosticInfo;
        The_left_hand_side_of_an__in__expression_must_be_of_types__string__or__any_: DiagnosticInfo;
        The_right_hand_side_of_an__in__expression_must_be_of_type__any___an_object_type_or_a_type_parameter: DiagnosticInfo;
        The_left_hand_side_of_an__instanceOf__expression_must_be_of_type__any___an_object_type_or_a_type_parameter: DiagnosticInfo;
        The_right_hand_side_of_an__instanceOf__expression_must_be_of_type__any__or_a_subtype_of_the__Function__interface_type: DiagnosticInfo;
        Setters_cannot_return_a_value: DiagnosticInfo;
        Tried_to_set_variable_type_to_module_type__0__: DiagnosticInfo;
        Tried_to_set_variable_type_to_uninitialized_module_type__0__: DiagnosticInfo;
        Function__0__declared_a_non_void_return_type__but_has_no_return_expression: DiagnosticInfo;
        Getters_must_return_a_value: DiagnosticInfo;
        Getter_and_setter_accessors_do_not_agree_in_visibility: DiagnosticInfo;
        Invalid_left_hand_side_of_assignment_expression: DiagnosticInfo;
        Function_declared_a_non_void_return_type__but_has_no_return_expression: DiagnosticInfo;
        Cannot_resolve_return_type_reference: DiagnosticInfo;
        Constructors_cannot_have_a_return_type_of__void_: DiagnosticInfo;
        Import_declarations_in_an_internal_module_cannot_reference_an_external_module: DiagnosticInfo;
        Class__0__declares_interface__1__but_does_not_implement_it__NL__2: DiagnosticInfo;
        Class__0__declares_class__1__but_does_not_implement_it__NL__2: DiagnosticInfo;
        The_operand_of_an_increment_or_decrement_operator_must_be_a_variable__property_or_indexer: DiagnosticInfo;
        _this__cannot_be_referenced_in_initializers_in_a_class_body: DiagnosticInfo;
        Class__0__cannot_extend_class__1__NL__2: DiagnosticInfo;
        Interface__0__cannot_extend_class__1__NL__2: DiagnosticInfo;
        Interface__0__cannot_extend_interface__1__NL__2: DiagnosticInfo;
        Duplicate_overload_signature_for__0_: DiagnosticInfo;
        Duplicate_constructor_overload_signature: DiagnosticInfo;
        Duplicate_overload_call_signature: DiagnosticInfo;
        Duplicate_overload_construct_signature: DiagnosticInfo;
        Overload_signature_is_not_compatible_with_function_definition: DiagnosticInfo;
        Overload_signature_is_not_compatible_with_function_definition__NL__0: DiagnosticInfo;
        Overload_signatures_must_all_be_public_or_private: DiagnosticInfo;
        Overload_signatures_must_all_be_exported_or_local: DiagnosticInfo;
        Overload_signatures_must_all_be_ambient_or_non_ambient: DiagnosticInfo;
        Overload_signatures_must_all_be_optional_or_required: DiagnosticInfo;
        Specialized_overload_signature_is_not_subtype_of_any_non_specialized_signature: DiagnosticInfo;
        _this__cannot_be_referenced_in_constructor_arguments: DiagnosticInfo;
        Static_member_cannot_be_accessed_off_an_instance_variable: DiagnosticInfo;
        Instance_member_cannot_be_accessed_off_a_class: DiagnosticInfo;
        Untyped_function_calls_may_not_accept_type_arguments: DiagnosticInfo;
        Non_generic_functions_may_not_accept_type_arguments: DiagnosticInfo;
        Static_methods_cannot_reference_class_type_parameters: DiagnosticInfo;
        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new___: DiagnosticInfo;
        Rest_parameters_must_be_array_types: DiagnosticInfo;
        Overload_signature_implementation_cannot_use_specialized_type: DiagnosticInfo;
        Export_assignments_may_only_be_used_in_External_modules: DiagnosticInfo;
        Export_assignments_may_only_be_made_with_acceptable_kinds: DiagnosticInfo;
        Only_public_instance_methods_of_the_base_class_are_accessible_via_the_super_keyword: DiagnosticInfo;
        Numeric_indexer_type___0___must_be_a_subtype_of_string_indexer_type___1__: DiagnosticInfo;
        Numeric_indexer_type___0___must_be_a_subtype_of_string_indexer_type___1____NL__2: DiagnosticInfo;
        All_numerically_named_properties_must_be_subtypes_of_numeric_indexer_type___0__: DiagnosticInfo;
        All_numerically_named_properties_must_be_subtypes_of_numeric_indexer_type___0____NL__1: DiagnosticInfo;
        All_named_properties_must_be_subtypes_of_string_indexer_type___0__: DiagnosticInfo;
        All_named_properties_must_be_subtypes_of_string_indexer_type___0____NL__1: DiagnosticInfo;
        Generic_type_references_must_include_all_type_arguments: DiagnosticInfo;

        Type__0__is_missing_property__1__from_type__2_: DiagnosticInfo;
        Types_of_property__0__of_types__1__and__2__are_incompatible: DiagnosticInfo;
        Types_of_property__0__of_types__1__and__2__are_incompatible__NL__3: DiagnosticInfo;
        Property__0__defined_as_private_in_type__1__is_defined_as_public_in_type__2_: DiagnosticInfo;
        Property__0__defined_as_public_in_type__1__is_defined_as_private_in_type__2_: DiagnosticInfo;
        Types__0__and__1__define_property__2__as_private: DiagnosticInfo;
        Call_signatures_of_types__0__and__1__are_incompatible: DiagnosticInfo;
        Call_signatures_of_types__0__and__1__are_incompatible__NL__2: DiagnosticInfo;
        Type__0__requires_a_call_signature__but_Type__1__lacks_one: DiagnosticInfo;
        Construct_signatures_of_types__0__and__1__are_incompatible: DiagnosticInfo;
        Construct_signatures_of_types__0__and__1__are_incompatible__NL__2: DiagnosticInfo;
        Type__0__requires_a_construct_signature__but_Type__1__lacks_one: DiagnosticInfo;
        Index_signatures_of_types__0__and__1__are_incompatible: DiagnosticInfo;
        Index_signatures_of_types__0__and__1__are_incompatible__NL__2: DiagnosticInfo;
        Call_signature_expects__0__or_fewer_parameters: DiagnosticInfo;
        Could_not_apply_type__0__to_argument__1__which_is_of_type__2_: DiagnosticInfo;
        Class__0__defines_instance_member_accessor__1___but_extended_class__2__defines_it_as_instance_member_function: DiagnosticInfo;
        Class__0__defines_instance_member_property__1___but_extended_class__2__defines_it_as_instance_member_function: DiagnosticInfo;
        Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_accessor: DiagnosticInfo;
        Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_property: DiagnosticInfo;
        Types_of_static_property__0__of_class__1__and_class__2__are_incompatible: DiagnosticInfo;
        Types_of_static_property__0__of_class__1__and_class__2__are_incompatible__NL__3: DiagnosticInfo;


        //Batch compiler diagnostics
        Current_host_does_not_support__w_atch_option: DiagnosticInfo;
        ECMAScript_target_version__0__not_supported___Using_default__1__code_generation: DiagnosticInfo;
        Module_code_generation__0__not_supported___Using_default__1__code_generation: DiagnosticInfo;
        Could_not_find_file___0_: DiagnosticInfo;
        Unknown_extension_for_file___0__Only__ts_and_d_ts_extensions_are_allowed: DiagnosticInfo;
        A_file_cannot_have_a_reference_itself: DiagnosticInfo;
        Cannot_resolve_referenced_file___0_: DiagnosticInfo;
        Cannot_resolve_imported_file___0_: DiagnosticInfo;
        Cannot_find_the_common_subdirectory_path_for_the_input_files: DiagnosticInfo;
        Cannot_compile_dynamic_modules_when_emitting_into_single_file: DiagnosticInfo;
        Emit_Error__0: DiagnosticInfo;
        Unsupported_encoding_for_file__0: DiagnosticInfo;
    }

    export var diagnosticMessages: IDiagnosticMessages = {
        error_TS_0__1: {
            category: DiagnosticCategory.NoPrefix,
            message: "error TS{0}: {1}",
            code: 0
        },

        warning_TS_0__1: {
            category: DiagnosticCategory.NoPrefix,
            message: "warning TS{0}: {1}",
            code: 1
        },

        _0__NL__1_TB__2: {
            category: DiagnosticCategory.NoPrefix,
            message: "{0}{NL}{{1}TB}{2}",
            code: 21
        },

        _0_TB__1: {
            category: DiagnosticCategory.NoPrefix,
            message: "{{0}TB}{1}",
            code: 22
        },

        // Syntactic errors start at 100.
        Unrecognized_escape_sequence: {
            category: DiagnosticCategory.Error,
            message: "Unrecognized escape sequence.",
            code: 1000
        },

        Unexpected_character_0: {
            category: DiagnosticCategory.Error,
            message: "Unexpected character {0}.",
            code: 1001
        },

        Missing_closing_quote_character: {
            category: DiagnosticCategory.Error,
            message: "Missing close quote character.",
            code: 1002
        },

        Identifier_expected: {
            category: DiagnosticCategory.Error,
            message: "Identifier expected.",
            code: 1003
        },

        _0_keyword_expected: {
            category: DiagnosticCategory.Error,
            message: "'{0}' keyword expected.",
            code: 1004
        },

        _0_expected: {
            category: DiagnosticCategory.Error,
            message: "'{0}' expected.",
            code: 1005
        },

        Identifier_expected__0__is_a_keyword: {
            category: DiagnosticCategory.Error,
            message: "Identifier expected; '{0}' is a keyword.",
            code: 1006
        },

        Automatic_semicolon_insertion_not_allowed: {
            category: DiagnosticCategory.Error,
            message: "Automatic semicolon insertion not allowed.",
            code: 1007
        },

        Unexpected_token__0_expected: {
            category: DiagnosticCategory.Error,
            message: "Unexpected token; '{0}' expected.",
            code: 1008
        },

        Trailing_separator_not_allowed: {
            category: DiagnosticCategory.Error,
            message: "Trailing separator not allowed.",
            code: 1009
        },

        _StarSlash__expected: {
            category: DiagnosticCategory.Error,
            message: "'*/' expected.",
            code: 1010
        },

        _public_or_private_modifier_must_precede__static_: {
            category: DiagnosticCategory.Error,
            message: "'public' or 'private' modifier must precede 'static'.",
            code: 1011
        },

        Unexpected_token_: {
            category: DiagnosticCategory.Error,
            message: "Unexpected token.",
            code: 1012
        },

        A_catch_clause_variable_cannot_have_a_type_annotation: {
            category: DiagnosticCategory.Error,
            message: "A catch clause variable cannot have a type annotation.",
            code: 1013
        },

        Rest_parameter_must_be_last_in_list: {
            category: DiagnosticCategory.Error,
            message: "Rest parameter must be last in list.",
            code: 1014
        },

        Parameter_cannot_have_question_mark_and_initializer: {
            category: DiagnosticCategory.Error,
            message: "Parameter cannot have question mark and initializer.",
            code: 1015
        },

        Required_parameter_cannot_follow_optional_parameter: {
            category: DiagnosticCategory.Error,
            message: "Required parameter cannot follow optional parameter.",
            code: 1016
        },

        Index_signatures_cannot_have_rest_parameters: {
            category: DiagnosticCategory.Error,
            message: "Index signatures cannot have rest parameters.",
            code: 1017
        },

        Index_signature_parameter_cannot_have_accessibility_modifiers: {
            category: DiagnosticCategory.Error,
            message: "Index signature parameter cannot have accessibility modifiers.",
            code: 1018
        },

        Index_signature_parameter_cannot_have_a_question_mark: {
            category: DiagnosticCategory.Error,
            message: "Index signature parameter cannot have a question mark.",
            code: 1019
        },

        Index_signature_parameter_cannot_have_an_initializer: {
            category: DiagnosticCategory.Error,
            message: "Index signature parameter cannot have an initializer.",
            code: 1020
        },

        Index_signature_must_have_a_type_annotation: {
            category: DiagnosticCategory.Error,
            message: "Index signature must have a type annotation.",
            code: 1021
        },

        Index_signature_parameter_must_have_a_type_annotation: {
            category: DiagnosticCategory.Error,
            message: "Index signature parameter must have a type annotation.",
            code: 1022
        },

        Index_signature_parameter_type_must_be__string__or__number_: {
            category: DiagnosticCategory.Error,
            message: "Index signature parameter type must be 'string' or 'number'.",
            code: 1023
        },

        _extends__clause_already_seen: {
            category: DiagnosticCategory.Error,
            message: "'extends' clause already seen.",
            code: 1024
        },

        _extends__clause_must_precede__implements__clause: {
            category: DiagnosticCategory.Error,
            message: "'extends' clause must precede 'implements' clause.",
            code: 1025
        },

        Class_can_only_extend_single_type: {
            category: DiagnosticCategory.Error,
            message: "Class can only extend single type.",
            code: 1026
        },

        _implements__clause_already_seen: {
            category: DiagnosticCategory.Error,
            message: "'implements' clause already seen.",
            code: 1027
        },

        Accessibility_modifier_already_seen: {
            category: DiagnosticCategory.Error,
            message: "Accessibility modifier already seen.",
            code: 1028
        },

        _0__modifier_must_precede__1__modifier: {
            category: DiagnosticCategory.Error,
            message: "'{0}' modifier must precede '{1}' modifier.",
            code: 1029
        },

        _0__modifier_already_seen: {
            category: DiagnosticCategory.Error,
            message: "'{0}' modifier already seen.",
            code: 1030
        },

        _0__modifier_cannot_appear_on_a_class_element: {
            category: DiagnosticCategory.Error,
            message: "'{0}' modifier cannot appear on a class element.",
            code: 1031
        },

        Interface_declaration_cannot_have__implements__clause: {
            category: DiagnosticCategory.Error,
            message: "Interface declaration cannot have 'implements' clause.",
            code: 1032
        },

        _super__invocation_cannot_have_type_arguments: {
            category: DiagnosticCategory.Error,
            message: "'super' invocation cannot have type arguments.",
            code: 1034
        },

        Non_ambient_modules_cannot_use_quoted_names: {
            category: DiagnosticCategory.Error,
            message: "Non ambient modules cannot use quoted names.",
            code: 1035
        },

        Statements_are_not_allowed_in_ambient_contexts: {
            category: DiagnosticCategory.Error,
            message: "Statements are not allowed in ambient contexts.",
            code: 1036
        },

        Implementations_are_not_allowed_in_ambient_contexts: {
            category: DiagnosticCategory.Error,
            message: "Implementations are not allowed in ambient contexts.",
            code: 1037
        },

        _declare__modifier_not_allowed_for_code_already_in_an_ambient_context: {
            category: DiagnosticCategory.Error,
            message: "'declare' modifier not allowed for code already in an ambient context.",
            code: 1038
        },

        Initializers_are_not_allowed_in_ambient_contexts: {
            category: DiagnosticCategory.Error,
            message: "Initializers are not allowed in ambient contexts.",
            code: 1039
        },

        Overload_and_ambient_signatures_cannot_specify_parameter_properties: {
            category: DiagnosticCategory.Error,
            message: "Overload and ambient signatures cannot specify parameter properties.",
            code: 1040
        },

        Function_implementation_expected: {
            category: DiagnosticCategory.Error,
            message: "Function implementation expected.",
            code: 1041
        },

        Constructor_implementation_expected: {
            category: DiagnosticCategory.Error,
            message: "Constructor implementation expected.",
            code: 1042
        },

        Function_overload_name_must_be__0_: {
            category: DiagnosticCategory.Error,
            message: "Function overload name must be '{0}'.",
            code: 1043
        },

        _0__modifier_cannot_appear_on_a_module_element: {
            category: DiagnosticCategory.Error,
            message: "'{0}' modifier cannot appear on a module element.",
            code: 1044
        },

        _declare__modifier_cannot_appear_on_an_interface_declaration: {
            category: DiagnosticCategory.Error,
            message: "'declare' modifier cannot appear on an interface declaration.",
            code: 1045
        },

        _declare__modifier_required_for_top_level_element: {
            category: DiagnosticCategory.Error,
            message: "'declare' modifier required for top level element.",
            code: 1046
        },

        Rest_parameter_cannot_be_optional: {
            category: DiagnosticCategory.Error,
            message: "Rest parameter cannot be optional.",
            code: 1047
        },

        Rest_parameter_cannot_have_initializer: {
            category: DiagnosticCategory.Error,
            message: "Rest parameter cannot have initializer.",
            code: 1048
        },

        _set__accessor_must_have_only_one_parameter: {
            category: DiagnosticCategory.Error,
            message: "'set' accessor must have one and only one parameter.",
            code: 1049
        },

        _set__accessor_parameter_cannot_have_accessibility_modifier: {
            category: DiagnosticCategory.Error,
            message: "'set' accessor parameter cannot have accessibility modifier.",
            code: 1050
        },

        _set__accessor_parameter_cannot_be_optional: {
            category: DiagnosticCategory.Error,
            message: "'set' accessor parameter cannot be optional.",
            code: 1051
        },

        _set__accessor_parameter_cannot_have_initializer: {
            category: DiagnosticCategory.Error,
            message: "'set' accessor parameter cannot have initializer.",
            code: 1052
        },

        _set__accessor_cannot_have_rest_parameter: {
            category: DiagnosticCategory.Error,
            message: "'set' accessor cannot have rest parameter.",
            code: 1053
        },

        _get__accessor_cannot_have_parameters: {
            category: DiagnosticCategory.Error,
            message: "'get' accessor cannot have parameters.",
            code: 1054
        },

        Modifiers_cannot_appear_here: {
            category: DiagnosticCategory.Error,
            message: "Modifiers cannot appear here.",
            code: 1055
        },

        Accessors_are_only_available_when_targeting_EcmaScript5_and_higher: {
            category: DiagnosticCategory.Error,
            message: "Accessors are only when targeting EcmaScript5 and higher.",
            code: 1056
        },

        Class_name_cannot_be__0_: {
            category: DiagnosticCategory.Error,
            message: "Class name cannot be '{0}'.",
            code: 1057
        },

        Interface_name_cannot_be__0_: {
            category: DiagnosticCategory.Error,
            message: "Interface name cannot be '{0}'.",
            code: 1058
        },

        Enum_name_cannot_be__0_: {
            category: DiagnosticCategory.Error,
            message: "Enum name cannot be '{0}'.",
            code: 1059
        },

        Module_name_cannot_be__0_: {
            category: DiagnosticCategory.Error,
            message: "Module name cannot be '{0}'.",
            code: 1060
        },

        Enum_member_must_have_initializer: {
            category: DiagnosticCategory.Error,
            message: "Enum member must have initializer.",
            code: 1061
        },

        _module_______is_deprecated__Use__require_______instead: {
            category: DiagnosticCategory.Warning,
            message: "'module(...)' is deprecated. Use 'require(...)' instead.",
            code: 1062
        },

        Export_assignments_cannot_be_used_in_internal_modules: {
            category: DiagnosticCategory.Error,
            message: "Export assignments cannot be used in internal modules.",
            code: 1063
        },

        Export_assignment_not_allowed_in_module_with_exported_element: {
            category: DiagnosticCategory.Error,
            message: "Export assignment not allowed in module with exported element.",
            code: 1064
        },

        Module_cannot_have_multiple_export_assignments: {
            category: DiagnosticCategory.Error,
            message: "Module cannot have multiple export assignments.",
            code: 1065
        },






        // Semantic errors start at 2000.
        Duplicate_identifier__0_: {
            category: DiagnosticCategory.Error,
            message: "Duplicate identifier '{0}'.",
            code: 2000
        },

        The_name__0__does_not_exist_in_the_current_scope: {
            category: DiagnosticCategory.Error,
            message: "The name '{0}' does not exist in the current scope.",
            code: 2001
        },

        The_name__0__does_not_refer_to_a_value: {
            category: DiagnosticCategory.Error,
            message: "The name '{0}' does not refer to a value.",
            code: 2002
        },

        Keyword__super__can_only_be_used_inside_a_class_instance_method: {
            category: DiagnosticCategory.Error,
            message: "Keyword 'super' can only be used inside a class instance method.",
            code: 2003
        },

        The_left_hand_side_of_an_assignment_expression_must_be_a_variable__property_or_indexer: {
            category: DiagnosticCategory.Error,
            message: "The left-hand side of an assignment expression must be a variable, property or indexer.",
            code: 2004
        },

        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new__: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not callable. Did you mean to include 'new'?",
            code: 2005
        },

        Value_of_type__0__is_not_callable: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not callable.",
            code: 2006
        },

        Value_of_type__0__is_not_newable: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not newable.",
            code: 2007
        },

        Value_of_type__0__is_not_indexable_by_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not indexable by type '{1}'.",
            code: 2008
        },

        Operator__0__cannot_be_applied_to_types__1__and__2_: {
            category: DiagnosticCategory.Error,
            message: "Operator '{0}' cannot be applied to types '{1}' and '{2}'.",
            code: 2009
        },

        Operator__0__cannot_be_applied_to_types__1__and__2__3: {
            category: DiagnosticCategory.Error,
            message: "Operator '{0}' cannot be applied to types '{1}' and '{2}': {3}",
            code: 2010
        },

        Cannot_convert__0__to__1_: {
            category: DiagnosticCategory.Error,
            message: "Cannot convert '{0}' to '{1}'.",
            code: 2011
        },

        Cannot_convert__0__to__1__NL__2: {
            category: DiagnosticCategory.Error,
            message: "Cannot convert '{0}' to '{1}':{NL}{2}",
            code: 2012
        },

        Expected_var__class__interface__or_module: {
            category: DiagnosticCategory.Error,
            message: "Expected var, class, interface, or module.",
            code: 2013
        },

        Operator__0__cannot_be_applied_to_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Operator '{0}' cannot be applied to type '{1}'.",
            code: 2014
        },

        Getter__0__already_declared: {
            category: DiagnosticCategory.Error,
            message: "Getter '{0}' already declared.",
            code: 2015
        },

        Setter__0__already_declared: {
            category: DiagnosticCategory.Error,
            message: "Setter '{0}' already declared.",
            code: 2016
        },

        Accessor_cannot_have_type_parameters: {
            category: DiagnosticCategory.Error,
            message: "Accessors cannot have type parameters.",
            code: 2017
        },

        Exported_class__0__extends_private_class__1_: {
            category: DiagnosticCategory.Error,
            message: "Exported class '{0}' extends private class '{1}'.",
            code: 2018
        },
        Exported_class__0__implements_private_interface__1_: {
            category: DiagnosticCategory.Error,
            message: "Exported class '{0}' implements private interface '{1}'.",
            code: 2019
        },
        Exported_interface__0__extends_private_interface__1_: {
            category: DiagnosticCategory.Error,
            message: "Exported interface '{0}' extends private interface '{1}'.",
            code: 2020
        },
        Exported_class__0__extends_class_from_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Exported class '{0}' extends class from inaccessible module {1}.",
            code: 2021
        },
        Exported_class__0__implements_interface_from_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Exported class '{0}' implements interface from inaccessible module {1}.",
            code: 2022
        },
        Exported_interface__0__extends_interface_from_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Exported interface '{0}' extends interface from inaccessible module {1}.",
            code: 2023
        },
        Public_static_property__0__of__exported_class_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Public static property '{0}' of exported class has or is using private type '{1}'.",
            code: 2024
        },
        Public_property__0__of__exported_class_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Public property '{0}' of exported class has or is using private type '{1}'.",
            code: 2025
        },
        Property__0__of__exported_interface_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Property '{0}' of exported interface has or is using private type '{1}'.",
            code: 2026
        },
        Exported_variable__0__has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Exported variable '{0}' has or is using private type '{1}'.",
            code: 2027
        },
        Public_static_property__0__of__exported_class_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Public static property '{0}' of exported class is using inaccessible module {1}.",
            code: 2028
        },
        Public_property__0__of__exported_class_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Public property '{0}' of exported class is using inaccessible module {1}.",
            code: 2029
        },
        Property__0__of__exported_interface_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Property '{0}' of exported interface is using inaccessible module {1}.",
            code: 2030
        },
        Exported_variable__0__is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Exported variable '{0}' is using inaccessible module {1}.",
            code: 2031
        },
        Parameter__0__of_constructor_from_exported_class_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of constructor from exported class has or is using private type '{1}'.",
            code: 2032
        },
        Parameter__0__of_public_static_property_setter_from_exported_class_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of public static property setter from exported class has or is using private type '{1}'.",
            code: 2033
        },
        Parameter__0__of_public_property_setter_from_exported_class_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of public property setter from exported class has or is using private type '{1}'.",
            code: 2034
        },
        Parameter__0__of_constructor_signature_from_exported_interface_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of constructor signature from exported interface has or is using private type '{1}'.",
            code: 2035
        },
        Parameter__0__of_call_signature_from_exported_interface_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of call signature from exported interface has or is using private type '{1}'.",
            code: 2036
        },
        Parameter__0__of_public_static_method_from_exported_class_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of public static method from exported class has or is using private type '{1}'.",
            code: 2037
        },
        Parameter__0__of_public_method_from_exported_class_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of public method from exported class has or is using private type '{1}'.",
            code: 2038
        },
        Parameter__0__of_method_from_exported_interface_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of method from exported interface has or is using private type '{1}'.",
            code: 2039
        },
        Parameter__0__of_exported_function_has_or_is_using_private_type__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of exported function has or is using private type '{1}'.",
            code: 2040
        },
        Parameter__0__of_constructor_from_exported_class_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of constructor from exported class is using inaccessible module {1}.",
            code: 2041
        },
        Parameter__0__of_public_static_property_setter_from_exported_class_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of public static property setter from exported class is using inaccessible module {1}.",
            code: 2042
        },
        Parameter__0__of_public_property_setter_from_exported_class_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of public property setter from exported class is using inaccessible module {1}.",
            code: 2043
        },
        Parameter__0__of_constructor_signature_from_exported_interface_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of constructor signature from exported interface is using inaccessible module {1}.",
            code: 2044
        },
        Parameter__0__of_call_signature_from_exported_interface_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of call signature from exported interface is using inaccessible module {1}",
            code: 2045
        },
        Parameter__0__of_public_static_method_from_exported_class_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of public static method from exported class is using inaccessible module {1}.",
            code: 2046
        },
        Parameter__0__of_public_method_from_exported_class_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of public method from exported class is using inaccessible module {1}.",
            code: 2047
        },
        Parameter__0__of_method_from_exported_interface_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of method from exported interface is using inaccessible module {1}.",
            code: 2048
        },
        Parameter__0__of_exported_function_is_using_inaccessible_module__1_: {
            category: DiagnosticCategory.Error,
            message: "Parameter '{0}' of exported function is using inaccessible module {1}.",
            code: 2049
        },
        Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of public static property getter from exported class has or is using private type '{0}'.",
            code: 2050
        },
        Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of public property getter from exported class has or is using private type '{0}'.",
            code: 2051
        },
        Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of constructor signature from exported interface has or is using private type '{0}'.",
            code: 2052
        },
        Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of call signature from exported interface has or is using private type '{0}'.",
            code: 2053
        },
        Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of index signature from exported interface has or is using private type '{0}'.",
            code: 2054
        },
        Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of public static method from exported class has or is using private type '{0}'.",
            code: 2055
        },
        Return_type_of_public_method_from_exported_class_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of public method from exported class has or is using private type '{0}'.",
            code: 2056
        },
        Return_type_of_method_from_exported_interface_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of method from exported interface has or is using private type '{0}'.",
            code: 2057
        },
        Return_type_of_exported_function_has_or_is_using_private_type__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of exported function has or is using private type '{0}'.",
            code: 2058
        },
        Return_type_of_public_static_property_getter_from_exported_class_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of public static property getter from exported class is using inaccessible module {0}.",
            code: 2059
        },
        Return_type_of_public_property_getter_from_exported_class_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of public property getter from exported class is using inaccessible module {0}.",
            code: 2060
        },
        Return_type_of_constructor_signature_from_exported_interface_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of constructor signature from exported interface is using inaccessible module {0}.",
            code: 2061
        },
        Return_type_of_call_signature_from_exported_interface_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of call signature from exported interface is using inaccessible module {0}.",
            code: 2062
        },
        Return_type_of_index_signature_from_exported_interface_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of index signature from exported interface is using inaccessible module {0}.",
            code: 2063
        },
        Return_type_of_public_static_method_from_exported_class_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of public static method from exported class is using inaccessible module {0}.",
            code: 2064
        },
        Return_type_of_public_method_from_exported_class_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of public method from exported class is using inaccessible module {0}.",
            code: 2065
        },
        Return_type_of_method_from_exported_interface_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of method from exported interface is using inaccessible module {0}.",
            code: 2066
        },
        Return_type_of_exported_function_is_using_inaccessible_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Return type of exported function is using inaccessible module {0}.",
            code: 2067
        },
        _new_T____cannot_be_used_to_create_an_array__Use__new_Array_T_____instead: {
            category: DiagnosticCategory.Error,
            message: "'new T[]' cannot be used to create an array. Use 'new Array<T>()' instead.",
            code: 2068
        },
        A_parameter_list_must_follow_a_generic_type_argument_list______expected: {
            category: DiagnosticCategory.Error,
            message: "A parameter list must follow a generic type argument list. '(' expected.",
            code: 2069
        },
        Multiple_constructor_implementations_are_not_allowed: {
            category: DiagnosticCategory.Error,
            message: "Multiple constructor implementations are not allowed.",
            code: 2070
        },
        Unable_to_resolve_external_module__0_: {
            category: DiagnosticCategory.Error,
            message: "Unable to resolve external module '{0}'.",
            code: 2071
        },
        Module_cannot_be_aliased_to_a_non_module_type: {
            category: DiagnosticCategory.Error,
            message: "Module cannot be aliased to a non-module type.",
            code: 2072
        },
        A_class_may_only_extend_another_class: {
            category: DiagnosticCategory.Error,
            message: "A class may only extend another class.",
            code: 2073
        },
        A_class_may_only_implement_another_class_or_interface: {
            category: DiagnosticCategory.Error,
            message: "A class may only implement another class or interface.",
            code: 2074
        },
        An_interface_may_only_extend_another_class_or_interface: {
            category: DiagnosticCategory.Error,
            message: "An interface may only extend another class or interface.",
            code: 2075
        },
        An_interface_cannot_implement_another_type: {
            category: DiagnosticCategory.Error,
            message: "An interface cannot implement another type.",
            code: 2076
        },
        Unable_to_resolve_type: {
            category: DiagnosticCategory.Error,
            message: "Unable to resolve type.",
            code: 2077
        },
        Unable_to_resolve_type_of__0_: {
            category: DiagnosticCategory.Error,
            message: "Unable to resolve type of '{0}'.",
            code: 2078
        },
        Unable_to_resolve_type_parameter_constraint: {
            category: DiagnosticCategory.Error,
            message: "Unable to resolve type parameter constraint.",
            code: 2079
        },
        Type_parameter_constraint_cannot_be_a_primitive_type: {
            category: DiagnosticCategory.Error,
            message: "Type parameter constraint cannot be a primitive type.",
            code: 2080
        },
        Supplied_parameters_do_not_match_any_signature_of_call_target: {
            category: DiagnosticCategory.Error,
            message: "Supplied parameters do not match any signature of call target.",
            code: 2081
        },
        Supplied_parameters_do_not_match_any_signature_of_call_target__NL__0: {
            category: DiagnosticCategory.Error,
            message: "Supplied parameters do not match any signature of call target:{NL}{0}",
            code: 2082
        },
        Invalid__new__expression: {
            category: DiagnosticCategory.Error,
            message: "Invalid 'new' expression.",
            code: 2083
        },
        Call_signatures_used_in_a__new__expression_must_have_a__void__return_type: {
            category: DiagnosticCategory.Error,
            message: "Call signatures used in a 'new' expression must have a 'void' return type.",
            code: 2084
        },
        Could_not_select_overload_for__new__expression: {
            category: DiagnosticCategory.Error,
            message: "Could not select overload for 'new' expression.",
            code: 2085
        },
        Type__0__does_not_satisfy_the_constraint__1__for_type_parameter__2_: {
            category: DiagnosticCategory.Error,
            message: "Type '{0}' does not satisfy the constraint '{1}' for type parameter '{2}'.",
            code: 2086
        },
        Could_not_select_overload_for__call__expression: {
            category: DiagnosticCategory.Error,
            message: "Could not select overload for 'call' expression.",
            code: 2087
        },
        Unable_to_invoke_type_with_no_call_signatures: {
            category: DiagnosticCategory.Error,
            message: "Unable to invoke type with no call signatures.",
            code: 2088
        },
        Calls_to__super__are_only_valid_inside_a_class: {
            category: DiagnosticCategory.Error,
            message: "Calls to 'super' are only valid inside a class.",
            code: 2089
        },
        Generic_type__0__requires_1_type_argument_s_: {
            category: DiagnosticCategory.Error,
            message: "Generic type '{0}' requires {1} type argument(s).",
            code: 2090
        },
        Type_of_conditional_expression_cannot_be_determined__Best_common_type_could_not_be_found_between__0__and__1_: {
            category: DiagnosticCategory.Error,
            message: "Type of conditional expression cannot be determined. Best common type could not be found between '{0}' and '{1}'.",
            code: 2091
        },
        Type_of_array_literal_cannot_be_determined__Best_common_type_could_not_be_found_for_array_elements: {
            category: DiagnosticCategory.Error,
            message: "Type of array literal cannot be determined. Best common type could not be found for array elements.",
            code: 2092
        },
        Could_not_find_enclosing_symbol_for_dotted_name__0_: {
            category: DiagnosticCategory.Error,
            message: "Could not find enclosing symbol for dotted name '{0}'.",
            code: 2093
        },
        The_property__0__does_not_exist_on_value_of_type__1__: {
            category: DiagnosticCategory.Error,
            message: "The property '{0}' does not exist on value of type '{1}'.",
            code: 2094
        },
        Could_not_find_symbol__0_: {
            category: DiagnosticCategory.Error,
            message: "Could not find symbol '{0}'.",
            code: 2095
        },
        _get__and__set__accessor_must_have_the_same_type: {
            category: DiagnosticCategory.Error,
            message: "'get' and 'set' accessor must have the same type.",
            code: 2096
        },
        _this__cannot_be_referenced_in_current_location: {
            category: DiagnosticCategory.Error,
            message: "'this' cannot be referenced in current location.",
            code: 2097
        },
        Use_of_deprecated__bool__type__Use__boolean__instead: {
            category: DiagnosticCategory.Warning,
            message: "Use of deprecated type 'bool'. Use 'boolean' instead.",
            code: 2098
        },
        Static_methods_cannot_reference_class_type_parameters: {
            category: DiagnosticCategory.Error,
            message: "Static methods cannot reference class type parameters.",
            code: 2099
        },
        Class__0__is_recursively_referenced_as_a_base_type_of_itself: {
            category: DiagnosticCategory.Error,
            message: "Class '{0}' is recursively referenced as a base type of itself.",
            code: 2100
        },
        Interface__0__is_recursively_referenced_as_a_base_type_of_itself: {
            category: DiagnosticCategory.Error,
            message: "Interface '{0}' is recursively referenced as a base type of itself.",
            code: 2101
        },

        _super__property_access_is_permitted_only_in_a_constructor__instance_member_function__or_instance_member_accessor_of_a_derived_class: {
            category: DiagnosticCategory.Error,
            message: "'super' property access is permitted only in a constructor, instance member function, or instance member accessor of a derived class.",
            code: 2102
        },
        _super__cannot_be_referenced_in_non_derived_classes: {
            category: DiagnosticCategory.Error,
            message: "'super' cannot be referenced in non-derived classes.",
            code: 2103
        },
        A__super__call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_intialized_properties_or_has_parameter_properties: {
            category: DiagnosticCategory.Error,
            message: "A 'super' call must be the first statement in the constructor when a class contains initialized properties or has parameter properties.",
            code: 2104
        },
        Constructors_for_derived_classes_must_contain_a__super__call: {
            category: DiagnosticCategory.Error,
            message: "Constructors for derived classes must contain a 'super' call.",
            code: 2105
        },
        Super_calls_are_not_permitted_outside_constructors_or_in_local_functions_inside_constructors: {
            category: DiagnosticCategory.Error,
            message: "Super calls are not permitted outside constructors or in local functions inside constructors.",
            code: 2106
        },
        _0_1__is_inaccessible: {
            category: DiagnosticCategory.Error,
            message: "'{0}.{1}' is inaccessible.",
            code: 2107
        },
        _this__cannot_be_referenced_within_module_bodies: {
            category: DiagnosticCategory.Error,
            message: "'this' cannot be referenced within module bodies.",
            code: 2108
        },
        _this__must_only_be_used_inside_a_function_or_script_context: {
            category: DiagnosticCategory.Error,
            message: "'this' must only be used inside a function or script context.",
            code: 2109
        },
        Invalid__addition__expression___types_do_not_agree: {
            category: DiagnosticCategory.Error,
            message: "Invalid '+' expression - types not known to support the addition operator.",
            code: 2111
        },
        The_right_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type: {
            category: DiagnosticCategory.Error,
            message: "The right-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.",
            code: 2112
        },
        The_left_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type: {
            category: DiagnosticCategory.Error,
            message: "The left-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.",
            code: 2113
        },
        The_type_of_a_unary_arithmetic_operation_operand_must_be_of_type__any____number__or_an_enum_type: {
            category: DiagnosticCategory.Error,
            message: "The type of a unary arithmetic operation operand must be of type 'any', 'number' or an enum type.",
            code: 2114
        },
        Variable_declarations_for_for_in_expressions_cannot_contain_a_type_annotation: {
            category: DiagnosticCategory.Error,
            message: "Variable declarations for for/in expressions cannot contain a type annotation.",
            code: 2115
        },
        Variable_declarations_for_for_in_expressions_must_be_of_types__string__or__any_: {
            category: DiagnosticCategory.Error,
            message: "Variable declarations for for/in expressions must be of types 'string' or 'any'.",
            code: 2116
        },
        The_right_operand_of_a_for_in_expression_must_be_of_type__any____an_object_type_or_a_type_parameter: {
            category: DiagnosticCategory.Error,
            message: "The right operand of a for/in expression must be of type 'any', an object type or a type parameter.",
            code: 2117
        },
        The_left_hand_side_of_an__in__expression_must_be_of_types__string__or__any_: {
            category: DiagnosticCategory.Error,
            message: "The left-hand side of an 'in' expression must be of types 'string' or 'any'.",
            code: 2118
        },
        The_right_hand_side_of_an__in__expression_must_be_of_type__any___an_object_type_or_a_type_parameter: {
            category: DiagnosticCategory.Error,
            message: "The right-hand side of an 'in' expression must be of type 'any', an object type or a type parameter.",
            code: 2119
        },
        The_left_hand_side_of_an__instanceOf__expression_must_be_of_type__any___an_object_type_or_a_type_parameter: {
            category: DiagnosticCategory.Error,
            message: "The left-hand side of an 'instanceOf' expression must be of type 'any', an object type or a type parameter.",
            code: 2120
        },
        The_right_hand_side_of_an__instanceOf__expression_must_be_of_type__any__or_a_subtype_of_the__Function__interface_type: {
            category: DiagnosticCategory.Error,
            message: "The right-hand side of an 'instanceOf' expression must be of type 'any' or a subtype of the 'Function' interface type.",
            code: 2121
        },
        Setters_cannot_return_a_value: {
            category: DiagnosticCategory.Error,
            message: "Setters cannot return a value.",
            code: 2122
        },
        Tried_to_set_variable_type_to_module_type__0__: {
            category: DiagnosticCategory.Error,
            message: "Tried to set variable type to container type '{0}'.",
            code: 2123
        },
        Tried_to_set_variable_type_to_uninitialized_module_type__0__: {
            category: DiagnosticCategory.Error,
            message: "Tried to set variable type to uninitialized module type '{0}'.",
            code: 2124
        },
        Function__0__declared_a_non_void_return_type__but_has_no_return_expression: {
            category: DiagnosticCategory.Error,
            message: "Function {0} declared a non-void return type, but has no return expression.",
            code: 2125
        },
        Getters_must_return_a_value: {
            category: DiagnosticCategory.Error,
            message: "Getters must return a value.",
            code: 2126
        },
        Getter_and_setter_accessors_do_not_agree_in_visibility: {
            category: DiagnosticCategory.Error,
            message: "Getter and setter accessors do not agree in visibility.",
            code: 2127
        },
        Invalid_left_hand_side_of_assignment_expression: {
            category: DiagnosticCategory.Error,
            message: "Invalid left-hand side of assignment expression.",
            code: 2130
        },
        Function_declared_a_non_void_return_type__but_has_no_return_expression: {
            category: DiagnosticCategory.Error,
            message: "Function declared a non-void return type, but has no return expression.",
            code: 2131
        },
        Cannot_resolve_return_type_reference: {
            category: DiagnosticCategory.Error,
            message: "Cannot resolve return type reference.",
            code: 2132
        },
        Constructors_cannot_have_a_return_type_of__void_: {
            category: DiagnosticCategory.Error,
            message: "Constructors cannot have a return type of 'void'.",
            code: 2133
        },
        Subsequent_variable_declarations_must_have_the_same_type___Variable__0__must_be_of_type__1___but_here_has_type___2_: {
            category: DiagnosticCategory.Error,
            message: "Subsequent variable declarations must have the same type.  Variable '{0}' must be of type '{1}', but here has type '{2}'",
            code: 2134
        },
        All_symbols_within_a__with__block_will_be_resolved_to__any__: {
            category: DiagnosticCategory.Error,
            message: "All symbols within a with block will be resolved to 'any'.",
            code: 2135
        },
        Import_declarations_in_an_internal_module_cannot_reference_an_external_module: {
            category: DiagnosticCategory.Error,
            message: "Import declarations in an internal module cannot reference an external module.",
            code: 2136
        },
        Class__0__declares_interface__1__but_does_not_implement_it__NL__2: {
            category: DiagnosticCategory.Error,
            message: "Class {0} declares interface {1} but does not implement it:{NL}{2}",
            code: 2137
        },
        Class__0__declares_class__1__but_does_not_implement_it__NL__2: {
            category: DiagnosticCategory.Error,
            message: "Class {0} declares class {1} as an implemented interface but does not implement it:{NL}{2}",
            code: 2138
        },
        The_operand_of_an_increment_or_decrement_operator_must_be_a_variable__property_or_indexer: {
            category: DiagnosticCategory.Error,
            message: "The operand of an increment or decrement operator must be a variable, property or indexer.",
            code: 2139
        },
        _this__cannot_be_referenced_in_initializers_in_a_class_body: {
            category: DiagnosticCategory.Error,
            message: "'this' cannot be referenced in initializers in a class body.",
            code: 2140
        },
        Class__0__cannot_extend_class__1__NL__2: {
            category: DiagnosticCategory.Error,
            message: "Class '{0}' cannot extend class '{1}':{NL}{2}",
            code: 2141
        },
        Interface__0__cannot_extend_class__1__NL__2: {
            category: DiagnosticCategory.Error,
            message: "Interface '{0}' cannot extend class '{1}':{NL}{2}",
            code: 2142
        },
        Interface__0__cannot_extend_interface__1__NL__2: {
            category: DiagnosticCategory.Error,
            message: "Interface '{0}' cannot extend interface '{1}':{NL}{2}",
            code: 2143
        },
        Duplicate_overload_signature_for__0_: {
            category: DiagnosticCategory.Error,
            message: "Duplicate overload signature for '{0}'.",
            code: 2144
        },
        Duplicate_constructor_overload_signature: {
            category: DiagnosticCategory.Error,
            message: "Duplicate constructor overload signature.",
            code: 2145
        },
        Duplicate_overload_call_signature: {
            category: DiagnosticCategory.Error,
            message: "Duplicate overload call signature.",
            code: 2146
        },
        Duplicate_overload_construct_signature: {
            category: DiagnosticCategory.Error,
            message: "Duplicate overload construct signature.",
            code: 2147
        },
        Overload_signature_is_not_compatible_with_function_definition: {
            category: DiagnosticCategory.Error,
            message: "Overload signature is not compatible with function definition.",
            code: 2148
        },
        Overload_signature_is_not_compatible_with_function_definition__NL__0: {
            category: DiagnosticCategory.Error,
            message: "Overload signature is not compatible with function definition:{NL}{0}",
            code: 2149
        },
        Overload_signatures_must_all_be_public_or_private: {
            category: DiagnosticCategory.Error,
            message: "Overload signatures must all be public or private.",
            code: 2150
        },
        Overload_signatures_must_all_be_exported_or_local: {
            category: DiagnosticCategory.Error,
            message: "Overload signatures must all be exported or local.",
            code: 2151
        },
        Overload_signatures_must_all_be_ambient_or_non_ambient: {
            category: DiagnosticCategory.Error,
            message: "Overload signatures must all be ambient or non-ambient.",
            code: 2152
        },
        Overload_signatures_must_all_be_optional_or_required: {
            category: DiagnosticCategory.Error,
            message: "Overload signatures must all be optional or required.",
            code: 2153
        },
        Specialized_overload_signature_is_not_subtype_of_any_non_specialized_signature: {
            category: DiagnosticCategory.Error,
            message: "Specialized overload signature is not subtype of any non-specialized signature.",
            code: 2154
        },
        _this__cannot_be_referenced_in_constructor_arguments: {
            category: DiagnosticCategory.Error,
            message: "'this' cannot be referenced in constructor arguments.",
            code: 2155
        },
        Static_member_cannot_be_accessed_off_an_instance_variable: {
            category: DiagnosticCategory.Error,
            message: "Static member cannot be accessed off an instance variable.",
            code: 2156
        },
        Instance_member_cannot_be_accessed_off_a_class: {
            category: DiagnosticCategory.Error,
            message: "Instance member cannot be accessed off a class.",
            code: 2157
        },
        Untyped_function_calls_may_not_accept_type_arguments: {
            category: DiagnosticCategory.Error,
            message: "Untyped function calls may not accept type arguments.",
            code: 2158
        },
        Non_generic_functions_may_not_accept_type_arguments: {
            category: DiagnosticCategory.Error,
            message: "Non-generic functions may not accept type arguments.",
            code: 2159
        },
        A_generic_type_may_not_reference_itself_with_its_own_type_parameters: {
            category: DiagnosticCategory.Error,
            message: "A generic type may not reference itself with a wrapped form of its own type parameters.",
            code: 2160
        },
        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new___: {
            category: DiagnosticCategory.Error,
            message: "Value of type '{0}' is not callable. Did you mean to include 'new'?",
            code: 2161
        },
        Rest_parameters_must_be_array_types: {
            category: DiagnosticCategory.Error,
            message: "Rest parameters must be array types.",
            code: 2162
        },
        Overload_signature_implementation_cannot_use_specialized_type: {
            category: DiagnosticCategory.Error,
            message: "Overload signature implementation cannot use specialized type.",
            code: 2163
        },

        Export_assignments_may_only_be_used_in_External_modules: {
            category: DiagnosticCategory.Error,
            message: "Export assignments may only be used at the top-level of external modules",
            code: 2164
        },
        Export_assignments_may_only_be_made_with_acceptable_kinds: {
            category: DiagnosticCategory.Error,
            message: "Export assignments may only be made with variables, functions, classes, interfaces, enums and internal modules",
            code: 2165
        },
        Only_public_instance_methods_of_the_base_class_are_accessible_via_the_super_keyword: {
            category: DiagnosticCategory.Error,
            message: "Only public instance methods of the base class are accessible via the super keyword",
            code: 2166
        },
        Numeric_indexer_type___0___must_be_a_subtype_of_string_indexer_type___1__: {
            category: DiagnosticCategory.Error,
            message: "Numeric indexer type '{0}' must be a subtype of string indexer type '{1}'",
            code: 2167
        },
        Numeric_indexer_type___0___must_be_a_subtype_of_string_indexer_type___1____NL__2: {
            category: DiagnosticCategory.Error,
            message: "Numeric indexer type '{0}' must be a subtype of string indexer type '{1}':{NL}{2}",
            code: 2168
        },
        All_numerically_named_properties_must_be_subtypes_of_numeric_indexer_type___0__: {
            category: DiagnosticCategory.Error,
            message: "All numerically named properties must be subtypes of numeric indexer type '{0}'",
            code: 2169
        },
        All_numerically_named_properties_must_be_subtypes_of_numeric_indexer_type___0____NL__1: {
            category: DiagnosticCategory.Error,
            message: "All numerically named properties must be subtypes of numeric indexer type '{0}':{NL}{1}",
            code: 2170
        },
        All_named_properties_must_be_subtypes_of_string_indexer_type___0__: {
            category: DiagnosticCategory.Error,
            message: "All named properties must be subtypes of string indexer type '{0}'",
            code: 2171
        },
        All_named_properties_must_be_subtypes_of_string_indexer_type___0____NL__1: {
            category: DiagnosticCategory.Error,
            message: "All named properties must be subtypes of string indexer type '{0}':{NL}{1}",
            code: 2172
        },
        Generic_type_references_must_include_all_type_arguments: {
            category: DiagnosticCategory.Error,
            message: "Generic type references must include all type arguments",
            code: 2173
        },


        Type__0__is_missing_property__1__from_type__2_: {
            category: DiagnosticCategory.NoPrefix,
            message: "Type '{0}' is missing property '{1}' from type '{2}'.",
            code: 4000
        },
        Types_of_property__0__of_types__1__and__2__are_incompatible: {
            category: DiagnosticCategory.NoPrefix,
            message: "Types of property '{0}' of types '{1}' and '{2}' are incompatible.",
            code: 4001
        },
        Types_of_property__0__of_types__1__and__2__are_incompatible__NL__3: {
            category: DiagnosticCategory.NoPrefix,
            message: "Types of property '{0}' of types '{1}' and '{2}' are incompatible:{NL}{3}",
            code: 4002
        },
        Property__0__defined_as_private_in_type__1__is_defined_as_public_in_type__2_: {
            category: DiagnosticCategory.NoPrefix,
            message: "Property '{0}' defined as private in type '{1}' is defined as public in type '{2}'.",
            code: 4003
        },
        Property__0__defined_as_public_in_type__1__is_defined_as_private_in_type__2_: {
            category: DiagnosticCategory.NoPrefix,
            message: "Property '{0}' defined as public in type '{1}' is defined as private in type '{2}'.",
            code: 4004
        },
        Types__0__and__1__define_property__2__as_private: {
            category: DiagnosticCategory.NoPrefix,
            message: "Types '{0}' and '{1}' define property '{2}' as private.",
            code: 4005
        },
        Call_signatures_of_types__0__and__1__are_incompatible: {
            category: DiagnosticCategory.NoPrefix,
            message: "Call signatures of types '{0}' and '{1}' are incompatible.",
            code: 4006
        },
        Call_signatures_of_types__0__and__1__are_incompatible__NL__2: {
            category: DiagnosticCategory.NoPrefix,
            message: "Call signatures of types '{0}' and '{1}' are incompatible:{NL}{2}",
            code: 4007
        },
        Type__0__requires_a_call_signature__but_Type__1__lacks_one: {
            category: DiagnosticCategory.NoPrefix,
            message: "Type '{0}' requires a call signature, but type '{1}' lacks one.",
            code: 4008
        },
        Construct_signatures_of_types__0__and__1__are_incompatible: {
            category: DiagnosticCategory.NoPrefix,
            message: "Construct signatures of types '{0}' and '{1}' are incompatible.",
            code: 4009
        },
        Construct_signatures_of_types__0__and__1__are_incompatible__NL__2: {
            category: DiagnosticCategory.NoPrefix,
            message: "Construct signatures of types '{0}' and '{1}' are incompatible:{NL}{2}",
            code: 40010
        },
        Type__0__requires_a_construct_signature__but_Type__1__lacks_one: {
            category: DiagnosticCategory.NoPrefix,
            message: "Type '{0}' requires a construct signature, but type '{1}' lacks one.",
            code: 4011
        },
        Index_signatures_of_types__0__and__1__are_incompatible: {
            category: DiagnosticCategory.NoPrefix,
            message: "Index signatures of types '{0}' and '{1}' are incompatible.",
            code: 4012
        },
        Index_signatures_of_types__0__and__1__are_incompatible__NL__2: {
            category: DiagnosticCategory.NoPrefix,
            message: "Index signatures of types '{0}' and '{1}' are incompatible:{NL}{2}",
            code: 4013
        },
        Call_signature_expects__0__or_fewer_parameters: {
            category: DiagnosticCategory.NoPrefix,
            message: "Call signature expects {0} or fewer parameters.",
            code: 4014
        },
        Could_not_apply_type__0__to_argument__1__which_is_of_type__2_: {
            category: DiagnosticCategory.NoPrefix,
            message: "Could not apply type'{0}' to argument {1} which is of type '{2}'.",
            code: 4015
        },
        Class__0__defines_instance_member_accessor__1___but_extended_class__2__defines_it_as_instance_member_function: {
            category: DiagnosticCategory.NoPrefix,
            message: "Class '{0}' defines instance member accessor '{1}', but extended class '{2}' defines it as instance member function.",
            code: 4016
        },
        Class__0__defines_instance_member_property__1___but_extended_class__2__defines_it_as_instance_member_function: {
            category: DiagnosticCategory.NoPrefix,
            message: "Class '{0}' defines instance member property '{1}', but extended class '{2}' defines it as instance member function.",
            code: 4017
        },
        Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_accessor: {
            category: DiagnosticCategory.NoPrefix,
            message: "Class '{0}' defines instance member function '{1}', but extended class '{2}' defines it as instance member accessor.",
            code: 4018
        },
        Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_property: {
            category: DiagnosticCategory.NoPrefix,
            message: "Class '{0}' defines instance member function '{1}', but extended class '{2}' defines it as instance member property.",
            code: 4019
        },
        Types_of_static_property__0__of_class__1__and_class__2__are_incompatible: {
            category: DiagnosticCategory.NoPrefix,
            message: "Types of static property '{0}' of class '{1}' and class '{2}' are incompatible.",
            code: 4020
        },
        Types_of_static_property__0__of_class__1__and_class__2__are_incompatible__NL__3: {
            category: DiagnosticCategory.NoPrefix,
            message: "Types of static property '{0}' of class '{1}' and class '{2}' are incompatible:{NL}{3}",
            code: 4021
        },

        Type_reference_cannot_refer_to_container__0_: {
            category: DiagnosticCategory.Error,
            message: "Type reference cannot refer to container '{0}'.",
            code: 4022
        },

        Type_reference_must_refer_to_type: {
            category: DiagnosticCategory.Error,
            message: "Type reference cannot must refer to type.",
            code: 4023
        },

        Enums_with_multiple_declarations_must_provide_an_initializer_for_the_first_enum_element: {
            category: DiagnosticCategory.Error,
            message: "Enums with multiple declarations must provide an initializer for the first enum element.",
            code: 4024
        },





        // Batch compiler errors start 5000
        Current_host_does_not_support__w_atch_option: {
            category: DiagnosticCategory.Error,
            message: "Current host does not support -w[atch] option.",
            code: 5001
        },
        ECMAScript_target_version__0__not_supported___Using_default__1__code_generation: {
            category: DiagnosticCategory.Warning,
            message: "ECMAScript target version '{0}' not supported.  Using default '{1}' code generation.",
            code: 5002
        },
        Module_code_generation__0__not_supported___Using_default__1__code_generation: {
            category: DiagnosticCategory.Warning,
            message: "Module code generation '{0}' not supported.  Using default '{1}' code generation.",
            code: 5003
        },
        Could_not_find_file___0_: {
            category: DiagnosticCategory.Error,
            message: "Could not find file: '{0}'.",
            code: 5004
        },
        Unknown_extension_for_file___0__Only__ts_and_d_ts_extensions_are_allowed: {
            category: DiagnosticCategory.Error,
            message: "Unknown extension for file: '{0}'. Only .ts and .d.ts extensions are allowed.",
            code: 5005
        },
        A_file_cannot_have_a_reference_itself: {
            category: DiagnosticCategory.Error,
            message: "A file cannot have a reference itself.",
            code: 5006
        },
        Cannot_resolve_referenced_file___0_: {
            category: DiagnosticCategory.Error,
            message: "Cannot resolve referenced file: '{0}'.",
            code: 5007
        },
        Cannot_resolve_imported_file___0_: {
            category: DiagnosticCategory.Error,
            message: "Cannot resolve imported file: '{0}'.",
            code: 5008
        },
        Cannot_find_the_common_subdirectory_path_for_the_input_files: {
            category: DiagnosticCategory.Error,
            message: "Cannot find the common subdirectory path for the input files",
            code: 5009
        },
        Cannot_compile_dynamic_modules_when_emitting_into_single_file: {
            category: DiagnosticCategory.Error,
            message: "Cannot compile dynamic modules when emitting into single file",
            code: 5010
        },
        Emit_Error__0: {
            category: DiagnosticCategory.Error,
            message: "Emit Error: {0}.",
            code: 5011
        },
        Unsupported_encoding_for_file__0: {
            category: DiagnosticCategory.Error,
            message: "Unsupported encoding for file: '{0}'.",
            code: 5013
        },
    };

    var seenCodes = [];
    for (var name in diagnosticMessages) {
        if (diagnosticMessages.hasOwnProperty(name)) {
            var diagnosticMessage = <DiagnosticInfo>diagnosticMessages[name];
            var value = seenCodes[diagnosticMessage.code];
            if (value) {
                throw new Error("Duplicate diagnostic code: " + diagnosticMessage.code);
            }

            seenCodes[diagnosticMessage.code] = diagnosticMessage;
        }
    }
}