declare module TypeScript {
    var DiagnosticCode: {
        error_TS_0_1: string;
        warning_TS_0_1: string;
        Unrecognized_escape_sequence: string;
        Unexpected_character_0: string;
        Missing_close_quote_character: string;
        Identifier_expected: string;
        _0_keyword_expected: string;
        _0_expected: string;
        Identifier_expected_0_is_a_keyword: string;
        Automatic_semicolon_insertion_not_allowed: string;
        Unexpected_token_0_expected: string;
        Trailing_separator_not_allowed: string;
        AsteriskSlash_expected: string;
        public_or_private_modifier_must_precede_static: string;
        Unexpected_token: string;
        Catch_clause_parameter_cannot_have_a_type_annotation: string;
        Rest_parameter_must_be_last_in_list: string;
        Parameter_cannot_have_question_mark_and_initializer: string;
        Required_parameter_cannot_follow_optional_parameter: string;
        Index_signatures_cannot_have_rest_parameters: string;
        Index_signature_parameter_cannot_have_accessibility_modifiers: string;
        Index_signature_parameter_cannot_have_a_question_mark: string;
        Index_signature_parameter_cannot_have_an_initializer: string;
        Index_signature_must_have_a_type_annotation: string;
        Index_signature_parameter_must_have_a_type_annotation: string;
        Index_signature_parameter_type_must_be_string_or_number: string;
        extends_clause_already_seen: string;
        extends_clause_must_precede_implements_clause: string;
        Classes_can_only_extend_a_single_class: string;
        implements_clause_already_seen: string;
        Accessibility_modifier_already_seen: string;
        _0_modifier_must_precede_1_modifier: string;
        _0_modifier_already_seen: string;
        _0_modifier_cannot_appear_on_a_class_element: string;
        Interface_declaration_cannot_have_implements_clause: string;
        super_invocation_cannot_have_type_arguments: string;
        Only_ambient_modules_can_use_quoted_names: string;
        Statements_are_not_allowed_in_ambient_contexts: string;
        Implementations_are_not_allowed_in_ambient_contexts: string;
        declare_modifier_not_allowed_for_code_already_in_an_ambient_context: string;
        Initializers_are_not_allowed_in_ambient_contexts: string;
        Parameter_property_declarations_can_only_be_used_in_constructors: string;
        Function_implementation_expected: string;
        Constructor_implementation_expected: string;
        Function_overload_name_must_be_0: string;
        _0_modifier_cannot_appear_on_a_module_element: string;
        declare_modifier_cannot_appear_on_an_interface_declaration: string;
        declare_modifier_required_for_top_level_element: string;
        Rest_parameter_cannot_be_optional: string;
        Rest_parameter_cannot_have_an_initializer: string;
        set_accessor_must_have_one_and_only_one_parameter: string;
        set_accessor_parameter_cannot_have_accessibility_modifier: string;
        set_accessor_parameter_cannot_be_optional: string;
        set_accessor_parameter_cannot_have_an_initializer: string;
        set_accessor_cannot_have_rest_parameter: string;
        get_accessor_cannot_have_parameters: string;
        Modifiers_cannot_appear_here: string;
        Accessors_are_only_available_when_targeting_ECMAScript_5_and_higher: string;
        Class_name_cannot_be_0: string;
        Interface_name_cannot_be_0: string;
        Enum_name_cannot_be_0: string;
        Module_name_cannot_be_0: string;
        Enum_member_must_have_initializer: string;
        Export_assignment_cannot_be_used_in_internal_modules: string;
        Export_assignment_not_allowed_in_module_with_exported_element: string;
        Module_cannot_have_multiple_export_assignments: string;
        Ambient_enum_elements_can_only_have_integer_literal_initializers: string;
        module_class_interface_enum_import_or_statement: string;
        constructor_function_accessor_or_variable: string;
        statement: string;
        case_or_default_clause: string;
        identifier: string;
        call_construct_index_property_or_function_signature: string;
        expression: string;
        type_name: string;
        property_or_accessor: string;
        parameter: string;
        type: string;
        type_parameter: string;
        declare_modifier_not_allowed_on_import_declaration: string;
        Function_overload_must_be_static: string;
        Function_overload_must_not_be_static: string;
        Duplicate_identifier_0: string;
        The_name_0_does_not_exist_in_the_current_scope: string;
        The_name_0_does_not_refer_to_a_value: string;
        super_can_only_be_used_inside_a_class_instance_method: string;
        The_left_hand_side_of_an_assignment_expression_must_be_a_variable_property_or_indexer: string;
        Value_of_type_0_is_not_callable_Did_you_mean_to_include_new: string;
        Value_of_type_0_is_not_callable: string;
        Value_of_type_0_is_not_newable: string;
        Value_of_type_0_is_not_indexable_by_type_1: string;
        Operator_0_cannot_be_applied_to_types_1_and_2: string;
        Operator_0_cannot_be_applied_to_types_1_and_2_3: string;
        Cannot_convert_0_to_1: string;
        Cannot_convert_0_to_1_NL_2: string;
        Expected_var_class_interface_or_module: string;
        Operator_0_cannot_be_applied_to_type_1: string;
        Getter_0_already_declared: string;
        Setter_0_already_declared: string;
        Accessors_cannot_have_type_parameters: string;
        Exported_class_0_extends_private_class_1: string;
        Exported_class_0_implements_private_interface_1: string;
        Exported_interface_0_extends_private_interface_1: string;
        Exported_class_0_extends_class_from_inaccessible_module_1: string;
        Exported_class_0_implements_interface_from_inaccessible_module_1: string;
        Exported_interface_0_extends_interface_from_inaccessible_module_1: string;
        Public_static_property_0_of_exported_class_has_or_is_using_private_type_1: string;
        Public_property_0_of_exported_class_has_or_is_using_private_type_1: string;
        Property_0_of_exported_interface_has_or_is_using_private_type_1: string;
        Exported_variable_0_has_or_is_using_private_type_1: string;
        Public_static_property_0_of_exported_class_is_using_inaccessible_module_1: string;
        Public_property_0_of_exported_class_is_using_inaccessible_module_1: string;
        Property_0_of_exported_interface_is_using_inaccessible_module_1: string;
        Exported_variable_0_is_using_inaccessible_module_1: string;
        Parameter_0_of_constructor_from_exported_class_has_or_is_using_private_type_1: string;
        Parameter_0_of_public_static_property_setter_from_exported_class_has_or_is_using_private_type_1: string;
        Parameter_0_of_public_property_setter_from_exported_class_has_or_is_using_private_type_1: string;
        Parameter_0_of_constructor_signature_from_exported_interface_has_or_is_using_private_type_1: string;
        Parameter_0_of_call_signature_from_exported_interface_has_or_is_using_private_type_1: string;
        Parameter_0_of_public_static_method_from_exported_class_has_or_is_using_private_type_1: string;
        Parameter_0_of_public_method_from_exported_class_has_or_is_using_private_type_1: string;
        Parameter_0_of_method_from_exported_interface_has_or_is_using_private_type_1: string;
        Parameter_0_of_exported_function_has_or_is_using_private_type_1: string;
        Parameter_0_of_constructor_from_exported_class_is_using_inaccessible_module_1: string;
        Parameter_0_of_public_static_property_setter_from_exported_class_is_using_inaccessible_module_1: string;
        Parameter_0_of_public_property_setter_from_exported_class_is_using_inaccessible_module_1: string;
        Parameter_0_of_constructor_signature_from_exported_interface_is_using_inaccessible_module_1: string;
        Parameter_0_of_call_signature_from_exported_interface_is_using_inaccessible_module_1: string;
        Parameter_0_of_public_static_method_from_exported_class_is_using_inaccessible_module_1: string;
        Parameter_0_of_public_method_from_exported_class_is_using_inaccessible_module_1: string;
        Parameter_0_of_method_from_exported_interface_is_using_inaccessible_module_1: string;
        Parameter_0_of_exported_function_is_using_inaccessible_module_1: string;
        Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_type_0: string;
        Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_type_0: string;
        Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_type_0: string;
        Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_type_0: string;
        Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_type_0: string;
        Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_type_0: string;
        Return_type_of_public_method_from_exported_class_has_or_is_using_private_type_0: string;
        Return_type_of_method_from_exported_interface_has_or_is_using_private_type_0: string;
        Return_type_of_exported_function_has_or_is_using_private_type_0: string;
        Return_type_of_public_static_property_getter_from_exported_class_is_using_inaccessible_module_0: string;
        Return_type_of_public_property_getter_from_exported_class_is_using_inaccessible_module_0: string;
        Return_type_of_constructor_signature_from_exported_interface_is_using_inaccessible_module_0: string;
        Return_type_of_call_signature_from_exported_interface_is_using_inaccessible_module_0: string;
        Return_type_of_index_signature_from_exported_interface_is_using_inaccessible_module_0: string;
        Return_type_of_public_static_method_from_exported_class_is_using_inaccessible_module_0: string;
        Return_type_of_public_method_from_exported_class_is_using_inaccessible_module_0: string;
        Return_type_of_method_from_exported_interface_is_using_inaccessible_module_0: string;
        Return_type_of_exported_function_is_using_inaccessible_module_0: string;
        new_T_cannot_be_used_to_create_an_array_Use_new_Array_T_instead: string;
        A_parameter_list_must_follow_a_generic_type_argument_list_expected: string;
        Multiple_constructor_implementations_are_not_allowed: string;
        Unable_to_resolve_external_module_0: string;
        Module_cannot_be_aliased_to_a_non_module_type: string;
        A_class_may_only_extend_another_class: string;
        A_class_may_only_implement_another_class_or_interface: string;
        An_interface_may_only_extend_another_class_or_interface: string;
        An_interface_cannot_implement_another_type: string;
        Unable_to_resolve_type: string;
        Unable_to_resolve_type_of_0: string;
        Unable_to_resolve_type_parameter_constraint: string;
        Type_parameter_constraint_cannot_be_a_primitive_type: string;
        Supplied_parameters_do_not_match_any_signature_of_call_target: string;
        Supplied_parameters_do_not_match_any_signature_of_call_target_NL_0: string;
        Invalid_new_expression: string;
        Call_signatures_used_in_a_new_expression_must_have_a_void_return_type: string;
        Could_not_select_overload_for_new_expression: string;
        Type_0_does_not_satisfy_the_constraint_1_for_type_parameter_2: string;
        Could_not_select_overload_for_call_expression: string;
        Cannot_invoke_an_expression_whose_type_lacks_a_call_signature: string;
        Calls_to_super_are_only_valid_inside_a_class: string;
        Generic_type_0_requires_1_type_argument_s: string;
        Type_of_conditional_expression_cannot_be_determined_Best_common_type_could_not_be_found_between_0_and_1: string;
        Type_of_array_literal_cannot_be_determined_Best_common_type_could_not_be_found_for_array_elements: string;
        Could_not_find_enclosing_symbol_for_dotted_name_0: string;
        The_property_0_does_not_exist_on_value_of_type_1: string;
        Could_not_find_symbol_0: string;
        get_and_set_accessor_must_have_the_same_type: string;
        this_cannot_be_referenced_in_current_location: string;
        Static_methods_cannot_reference_class_type_parameters: string;
        Class_0_is_recursively_referenced_as_a_base_type_of_itself: string;
        Interface_0_is_recursively_referenced_as_a_base_type_of_itself: string;
        super_property_access_is_permitted_only_in_a_constructor_instance_member_function_or_instance_member_accessor_of_a_derived_class: string;
        super_cannot_be_referenced_in_non_derived_classes: string;
        A_super_call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_initialized_properties_or_has_parameter_properties: string;
        Constructors_for_derived_classes_must_contain_a_super_call: string;
        Super_calls_are_not_permitted_outside_constructors_or_in_local_functions_inside_constructors: string;
        _0_1_is_inaccessible: string;
        this_cannot_be_referenced_within_module_bodies: string;
        Invalid_expression_types_not_known_to_support_the_addition_operator: string;
        The_right_hand_side_of_an_arithmetic_operation_must_be_of_type_any_number_or_an_enum_type: string;
        The_left_hand_side_of_an_arithmetic_operation_must_be_of_type_any_number_or_an_enum_type: string;
        The_type_of_a_unary_arithmetic_operation_operand_must_be_of_type_any_number_or_an_enum_type: string;
        Variable_declarations_of_a_for_statement_cannot_use_a_type_annotation: string;
        Variable_declarations_of_a_for_statement_must_be_of_types_string_or_any: string;
        The_right_hand_side_of_a_for_in_statement_must_be_of_type_any_an_object_type_or_a_type_parameter: string;
        The_left_hand_side_of_an_in_expression_must_be_of_types_string_or_any: string;
        The_right_hand_side_of_an_in_expression_must_be_of_type_any_an_object_type_or_a_type_parameter: string;
        The_left_hand_side_of_an_instanceof_expression_must_be_of_type_any_an_object_type_or_a_type_parameter: string;
        The_right_hand_side_of_an_instanceof_expression_must_be_of_type_any_or_a_subtype_of_the_Function_interface_type: string;
        Setters_cannot_return_a_value: string;
        Tried_to_query_type_of_uninitialized_module_0: string;
        Tried_to_set_variable_type_to_uninitialized_module_type_0: string;
        Function_0_declared_a_non_void_return_type_but_has_no_return_expression: string;
        Getters_must_return_a_value: string;
        Getter_and_setter_accessors_do_not_agree_in_visibility: string;
        Invalid_left_hand_side_of_assignment_expression: string;
        Function_declared_a_non_void_return_type_but_has_no_return_expression: string;
        Cannot_resolve_return_type_reference: string;
        Constructors_cannot_have_a_return_type_of_void: string;
        Subsequent_variable_declarations_must_have_the_same_type_Variable_0_must_be_of_type_1_but_here_has_type_2: string;
        All_symbols_within_a_with_block_will_be_resolved_to_any: string;
        Import_declarations_in_an_internal_module_cannot_reference_an_external_module: string;
        Class_0_declares_interface_1_but_does_not_implement_it_NL_2: string;
        Class_0_declares_class_1_as_an_interface_but_does_not_implement_it_NL_2: string;
        The_operand_of_an_increment_or_decrement_operator_must_be_a_variable_property_or_indexer: string;
        this_cannot_be_referenced_in_static_initializers_in_a_class_body: string;
        Class_0_cannot_extend_class_1_NL_2: string;
        Interface_0_cannot_extend_class_1_NL_2: string;
        Interface_0_cannot_extend_interface_1_NL_2: string;
        Duplicate_overload_signature_for_0: string;
        Duplicate_constructor_overload_signature: string;
        Duplicate_overload_call_signature: string;
        Duplicate_overload_construct_signature: string;
        Overload_signature_is_not_compatible_with_function_definition: string;
        Overload_signature_is_not_compatible_with_function_definition_NL_0: string;
        Overload_signatures_must_all_be_public_or_private: string;
        Overload_signatures_must_all_be_exported_or_local: string;
        Overload_signatures_must_all_be_ambient_or_non_ambient: string;
        Overload_signatures_must_all_be_optional_or_required: string;
        Specialized_overload_signature_is_not_subtype_of_any_non_specialized_signature: string;
        this_cannot_be_referenced_in_constructor_arguments: string;
        Static_member_cannot_be_accessed_off_an_instance_variable: string;
        Instance_member_cannot_be_accessed_off_a_class: string;
        Untyped_function_calls_may_not_accept_type_arguments: string;
        Non_generic_functions_may_not_accept_type_arguments: string;
        A_generic_type_may_not_reference_itself_with_a_wrapped_form_of_its_own_type_parameters: string;
        Rest_parameters_must_be_array_types: string;
        Overload_signature_implementation_cannot_use_specialized_type: string;
        Export_assignments_may_only_be_used_at_the_top_level_of_external_modules: string;
        Export_assignments_may_only_be_made_with_variables_functions_classes_interfaces_enums_and_internal_modules: string;
        Only_public_instance_methods_of_the_base_class_are_accessible_via_the_super_keyword: string;
        Numeric_indexer_type_0_must_be_a_subtype_of_string_indexer_type_1: string;
        Numeric_indexer_type_0_must_be_a_subtype_of_string_indexer_type_1_NL_2: string;
        All_numerically_named_properties_must_be_subtypes_of_numeric_indexer_type_0: string;
        All_numerically_named_properties_must_be_subtypes_of_numeric_indexer_type_0_NL_1: string;
        All_named_properties_must_be_subtypes_of_string_indexer_type_0: string;
        All_named_properties_must_be_subtypes_of_string_indexer_type_0_NL_1: string;
        Generic_type_references_must_include_all_type_arguments: string;
        Default_arguments_are_not_allowed_in_an_overload_parameter: string;
        Overloads_cannot_differ_only_by_return_type: string;
        Function_expression_declared_a_non_void_return_type_but_has_no_return_expression: string;
        Import_declaration_referencing_identifier_from_internal_module_can_only_be_made_with_variables_functions_classes_interfaces_enums_and_internal_modules: string;
        Could_not_find_symbol_0_in_module_1: string;
        Unable_to_resolve_module_reference_0: string;
        Could_not_find_module_0_in_module_1: string;
        Type_0_is_missing_property_1_from_type_2: string;
        Types_of_property_0_of_types_1_and_2_are_incompatible: string;
        Types_of_property_0_of_types_1_and_2_are_incompatible_NL_3: string;
        Property_0_defined_as_private_in_type_1_is_defined_as_public_in_type_2: string;
        Property_0_defined_as_public_in_type_1_is_defined_as_private_in_type_2: string;
        Types_0_and_1_define_property_2_as_private: string;
        Call_signatures_of_types_0_and_1_are_incompatible: string;
        Call_signatures_of_types_0_and_1_are_incompatible_NL_2: string;
        Type_0_requires_a_call_signature_but_type_1_lacks_one: string;
        Construct_signatures_of_types_0_and_1_are_incompatible: string;
        Construct_signatures_of_types_0_and_1_are_incompatible_NL_2: string;
        Type_0_requires_a_construct_signature_but_type_1_lacks_one: string;
        Index_signatures_of_types_0_and_1_are_incompatible: string;
        Index_signatures_of_types_0_and_1_are_incompatible_NL_2: string;
        Call_signature_expects_0_or_fewer_parameters: string;
        Could_not_apply_type_0_to_argument_1_which_is_of_type_2: string;
        Class_0_defines_instance_member_accessor_1_but_extended_class_2_defines_it_as_instance_member_function: string;
        Class_0_defines_instance_member_property_1_but_extended_class_2_defines_it_as_instance_member_function: string;
        Class_0_defines_instance_member_function_1_but_extended_class_2_defines_it_as_instance_member_accessor: string;
        Class_0_defines_instance_member_function_1_but_extended_class_2_defines_it_as_instance_member_property: string;
        Types_of_static_property_0_of_class_1_and_class_2_are_incompatible: string;
        Types_of_static_property_0_of_class_1_and_class_2_are_incompatible_NL_3: string;
        Type_reference_cannot_refer_to_container_0: string;
        Type_reference_must_refer_to_type: string;
        Enums_with_multiple_declarations_must_provide_an_initializer_for_the_first_enum_element: string;
        _0_overload_s: string;
        Current_host_does_not_support_0_option: string;
        ECMAScript_target_version_0_not_supported_Using_default_1_code_generation: string;
        Module_code_generation_0_not_supported: string;
        Could_not_find_file_0: string;
        A_file_cannot_have_a_reference_to_itself: string;
        Cannot_resolve_referenced_file_0: string;
        Cannot_find_the_common_subdirectory_path_for_the_input_files: string;
        Cannot_compile_external_modules_when_emitting_into_single_file: string;
        Emit_Error_0: string;
        Cannot_read_file_0_1: string;
        Unsupported_file_encoding: string;
        Locale_must_be_of_the_form_language_or_language_territory_For_example_0_or_1: string;
        Unsupported_locale_0: string;
        Execution_Failed_NL: string;
        Should_not_emit_a_type_query: string;
        Should_not_emit_a_type_reference: string;
        Invalid_call_to_up: string;
        Invalid_call_to_down: string;
        Base64_value_0_finished_with_a_continuation_bit: string;
        Key_was_already_in_table: string;
        Unknown_option_0: string;
        Expected_0_arguments_to_message_got_1_instead: string;
        Expected_the_message_0_to_have_1_arguments_but_it_had_2: string;
        Invalid_argument_0_1: string;
        Invalid_argument_0: string;
        Argument_out_of_range_0: string;
        Argument_null_0: string;
        Operation_not_implemented_properly_by_subclass: string;
        Not_yet_implemented: string;
        Invalid_operation_0: string;
        Invalid_operation: string;
        Could_not_delete_file_0: string;
        Could_not_create_directory_0: string;
        Error_while_executing_file_0: string;
        Use_of_an_external_module_requires_the_module_flag_to_be_supplied_to_the_compiler: string;
        Concatenate_and_emit_output_to_single_file_Redirect_output_structure_to_the_directory: string;
        Generates_corresponding_0_file: string;
        Specifies_the_location_where_debugger_should_locate_map_files_instead_of_generated_locations: string;
        Specifies_the_location_where_debugger_should_locate_TypeScript_files_instead_of_source_locations: string;
        Watch_input_files: string;
        Do_not_emit_comments_to_output: string;
        Skip_resolution_and_preprocessing: string;
        Specify_ECMAScript_target_version_0_default_or_1: string;
        Specify_module_code_generation_0_or_1: string;
        Print_this_message: string;
        Print_the_compiler_s_version_0: string;
        Allow_use_of_deprecated_0_keyword_when_referencing_an_external_module: string;
        Specify_locale_for_errors_and_messages_For_example_0_or_1: string;
        Syntax_0: string;
        options: string;
        file: string;
        Examples: string;
        Options: string;
        Insert_command_line_options_and_files_from_a_file: string;
        Version_0: string;
        Use_the_0_flag_to_see_options: string;
        NL_Recompiling_0: string;
        STRING: string;
        KIND: string;
        FILE_DIRECTORY: string;
        VERSION: string;
        LOCATION: string;
        This_version_of_the_Javascript_runtime_does_not_support_the_0_function: string;
        Looking_up_path_for_identifier_token_did_not_result_in_an_identifer: string;
        Unknown_rule: string;
        Invalid_line_number_0: string;
        Warn_on_expressions_and_declarations_with_an_implied_any_type: string;
        Variable_0_implicitly_has_an_any_type: string;
        Parameter_0_of_1_implicitly_has_an_any_type: string;
        Parameter_0_of_function_type_implicitly_has_an_any_type: string;
        Member_0_of_object_type_implicitly_has_an_any_type: string;
        New_expression_which_lacks_a_constructor_signature_implicitly_has_an_any_type: string;
        _0_which_lacks_return_type_annotation_implicitly_has_an_any_return_type: string;
        Function_expression_which_lacks_return_type_annotation_implicitly_has_an_any_return_type: string;
        Parameter_0_of_lambda_function_implicitly_has_an_any_type: string;
        Constructor_signature_which_lacks_return_type_annotation_implicitly_has_an_any_return_type: string;
        Lambda_Function_which_lacks_return_type_annotation_implicitly_has_an_any_return_type: string;
        Array_Literal_implicitly_has_an_any_type_from_widening: string;
    };
}
declare module TypeScript {
    enum DiagnosticCategory {
        Warning,
        Error,
        Message,
        NoPrefix,
    }
}
declare module TypeScript {
    var diagnosticInformationMap: {
        "error TS{0}: {1}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "warning TS{0}: {1}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Unrecognized escape sequence.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Unexpected character {0}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Missing close quote character.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Identifier expected.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'{0}' keyword expected.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'{0}' expected.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Identifier expected; '{0}' is a keyword.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Automatic semicolon insertion not allowed.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Unexpected token; '{0}' expected.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Trailing separator not allowed.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'*/' expected.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'public' or 'private' modifier must precede 'static'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Unexpected token.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Catch clause parameter cannot have a type annotation.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Rest parameter must be last in list.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter cannot have question mark and initializer.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Required parameter cannot follow optional parameter.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Index signatures cannot have rest parameters.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Index signature parameter cannot have accessibility modifiers.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Index signature parameter cannot have a question mark.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Index signature parameter cannot have an initializer.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Index signature must have a type annotation.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Index signature parameter must have a type annotation.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Index signature parameter type must be 'string' or 'number'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'extends' clause already seen.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'extends' clause must precede 'implements' clause.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Classes can only extend a single class.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'implements' clause already seen.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Accessibility modifier already seen.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'{0}' modifier must precede '{1}' modifier.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'{0}' modifier already seen.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'{0}' modifier cannot appear on a class element.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Interface declaration cannot have 'implements' clause.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'super' invocation cannot have type arguments.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Only ambient modules can use quoted names.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Statements are not allowed in ambient contexts.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Implementations are not allowed in ambient contexts.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'declare' modifier not allowed for code already in an ambient context.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Initializers are not allowed in ambient contexts.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter property declarations can only be used in constructors.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Function implementation expected.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Constructor implementation expected.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Function overload name must be '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'{0}' modifier cannot appear on a module element.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'declare' modifier cannot appear on an interface declaration.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'declare' modifier required for top level element.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Rest parameter cannot be optional.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Rest parameter cannot have an initializer.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'set' accessor must have one and only one parameter.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'set' accessor parameter cannot have accessibility modifier.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'set' accessor parameter cannot be optional.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'set' accessor parameter cannot have an initializer.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'set' accessor cannot have rest parameter.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'get' accessor cannot have parameters.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Modifiers cannot appear here.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Accessors are only available when targeting ECMAScript 5 and higher.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Class name cannot be '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Interface name cannot be '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Enum name cannot be '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Module name cannot be '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Enum member must have initializer.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Export assignment cannot be used in internal modules.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Export assignment not allowed in module with exported element.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Module cannot have multiple export assignments.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Ambient enum elements can only have integer literal initializers.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "module, class, interface, enum, import or statement": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "constructor, function, accessor or variable": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "statement": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "case or default clause": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "identifier": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "call, construct, index, property or function signature": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "expression": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "type name": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "property or accessor": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "parameter": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "type": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "type parameter": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'declare' modifier not allowed on import declaration.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Function overload must be static": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Function overload must not be static": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Duplicate identifier '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "The name '{0}' does not exist in the current scope.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "The name '{0}' does not refer to a value.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'super' can only be used inside a class instance method.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "The left-hand side of an assignment expression must be a variable, property or indexer.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Value of type '{0}' is not callable. Did you mean to include 'new'?": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Value of type '{0}' is not callable.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Value of type '{0}' is not newable.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Value of type '{0}' is not indexable by type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Operator '{0}' cannot be applied to types '{1}' and '{2}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Operator '{0}' cannot be applied to types '{1}' and '{2}': {3}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Cannot convert '{0}' to '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Cannot convert '{0}' to '{1}':{NL}{2}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Expected var, class, interface, or module.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Operator '{0}' cannot be applied to type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Getter '{0}' already declared.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Setter '{0}' already declared.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Accessors cannot have type parameters.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Exported class '{0}' extends private class '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Exported class '{0}' implements private interface '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Exported interface '{0}' extends private interface '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Exported class '{0}' extends class from inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Exported class '{0}' implements interface from inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Exported interface '{0}' extends interface from inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Public static property '{0}' of exported class has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Public property '{0}' of exported class has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Property '{0}' of exported interface has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Exported variable '{0}' has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Public static property '{0}' of exported class is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Public property '{0}' of exported class is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Property '{0}' of exported interface is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Exported variable '{0}' is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of constructor from exported class has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of public static property setter from exported class has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of public property setter from exported class has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of constructor signature from exported interface has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of call signature from exported interface has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of public static method from exported class has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of public method from exported class has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of method from exported interface has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of exported function has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of constructor from exported class is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of public static property setter from exported class is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of public property setter from exported class is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of constructor signature from exported interface is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of call signature from exported interface is using inaccessible module {1}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of public static method from exported class is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of public method from exported class is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of method from exported interface is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of exported function is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of public static property getter from exported class has or is using private type '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of public property getter from exported class has or is using private type '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of constructor signature from exported interface has or is using private type '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of call signature from exported interface has or is using private type '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of index signature from exported interface has or is using private type '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of public static method from exported class has or is using private type '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of public method from exported class has or is using private type '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of method from exported interface has or is using private type '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of exported function has or is using private type '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of public static property getter from exported class is using inaccessible module {0}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of public property getter from exported class is using inaccessible module {0}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of constructor signature from exported interface is using inaccessible module {0}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of call signature from exported interface is using inaccessible module {0}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of index signature from exported interface is using inaccessible module {0}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of public static method from exported class is using inaccessible module {0}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of public method from exported class is using inaccessible module {0}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of method from exported interface is using inaccessible module {0}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of exported function is using inaccessible module {0}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'new T[]' cannot be used to create an array. Use 'new Array<T>()' instead.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "A parameter list must follow a generic type argument list. '(' expected.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Multiple constructor implementations are not allowed.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Unable to resolve external module '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Module cannot be aliased to a non-module type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "A class may only extend another class.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "A class may only implement another class or interface.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "An interface may only extend another class or interface.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "An interface cannot implement another type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Unable to resolve type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Unable to resolve type of '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Unable to resolve type parameter constraint.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Type parameter constraint cannot be a primitive type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Supplied parameters do not match any signature of call target.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Supplied parameters do not match any signature of call target:{NL}{0}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Invalid 'new' expression.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Call signatures used in a 'new' expression must have a 'void' return type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Could not select overload for 'new' expression.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Type '{0}' does not satisfy the constraint '{1}' for type parameter '{2}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Could not select overload for 'call' expression.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Cannot invoke an expression whose type lacks a call signature.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Calls to 'super' are only valid inside a class.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Generic type '{0}' requires {1} type argument(s).": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Type of conditional expression cannot be determined. Best common type could not be found between '{0}' and '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Type of array literal cannot be determined. Best common type could not be found for array elements.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Could not find enclosing symbol for dotted name '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "The property '{0}' does not exist on value of type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Could not find symbol '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'get' and 'set' accessor must have the same type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'this' cannot be referenced in current location.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Static methods cannot reference class type parameters.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Class '{0}' is recursively referenced as a base type of itself.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Interface '{0}' is recursively referenced as a base type of itself.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'super' property access is permitted only in a constructor, instance member function, or instance member accessor of a derived class.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'super' cannot be referenced in non-derived classes.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "A 'super' call must be the first statement in the constructor when a class contains initialized properties or has parameter properties.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Constructors for derived classes must contain a 'super' call.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Super calls are not permitted outside constructors or in local functions inside constructors.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'{0}.{1}' is inaccessible.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'this' cannot be referenced within module bodies.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Invalid '+' expression - types not known to support the addition operator.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "The right-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "The left-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "The type of a unary arithmetic operation operand must be of type 'any', 'number' or an enum type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Variable declarations of a 'for' statement cannot use a type annotation.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Variable declarations of a 'for' statement must be of types 'string' or 'any'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "The right-hand side of a 'for...in' statement must be of type 'any', an object type or a type parameter.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "The left-hand side of an 'in' expression must be of types 'string' or 'any'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "The right-hand side of an 'in' expression must be of type 'any', an object type or a type parameter.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "The left-hand side of an 'instanceof' expression must be of type 'any', an object type or a type parameter.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "The right-hand side of an 'instanceof' expression must be of type 'any' or a subtype of the 'Function' interface type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Setters cannot return a value.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Tried to query type of uninitialized module '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Tried to set variable type to uninitialized module type '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Function '{0}' declared a non-void return type, but has no return expression.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Getters must return a value.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Getter and setter accessors do not agree in visibility.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Invalid left-hand side of assignment expression.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Function declared a non-void return type, but has no return expression.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Cannot resolve return type reference.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Constructors cannot have a return type of 'void'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Subsequent variable declarations must have the same type.  Variable '{0}' must be of type '{1}', but here has type '{2}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "All symbols within a with block will be resolved to 'any'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Import declarations in an internal module cannot reference an external module.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Class {0} declares interface {1} but does not implement it:{NL}{2}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Class {0} declares class {1} as an interface but does not implement it:{NL}{2}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "The operand of an increment or decrement operator must be a variable, property or indexer.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'this' cannot be referenced in static initializers in a class body.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Class '{0}' cannot extend class '{1}':{NL}{2}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Interface '{0}' cannot extend class '{1}':{NL}{2}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Interface '{0}' cannot extend interface '{1}':{NL}{2}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Duplicate overload signature for '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Duplicate constructor overload signature.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Duplicate overload call signature.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Duplicate overload construct signature.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Overload signature is not compatible with function definition.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Overload signature is not compatible with function definition:{NL}{0}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Overload signatures must all be public or private.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Overload signatures must all be exported or local.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Overload signatures must all be ambient or non-ambient.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Overload signatures must all be optional or required.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Specialized overload signature is not subtype of any non-specialized signature.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'this' cannot be referenced in constructor arguments.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Static member cannot be accessed off an instance variable.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Instance member cannot be accessed off a class.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Untyped function calls may not accept type arguments.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Non-generic functions may not accept type arguments.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "A generic type may not reference itself with a wrapped form of its own type parameters.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Rest parameters must be array types.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Overload signature implementation cannot use specialized type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Export assignments may only be used at the top-level of external modules.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Export assignments may only be made with variables, functions, classes, interfaces, enums and internal modules": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Only public instance methods of the base class are accessible via the 'super' keyword.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Numeric indexer type '{0}' must be a subtype of string indexer type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Numeric indexer type '{0}' must be a subtype of string indexer type '{1}':{NL}{2}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "All numerically named properties must be subtypes of numeric indexer type '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "All numerically named properties must be subtypes of numeric indexer type '{0}':{NL}{1}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "All named properties must be subtypes of string indexer type '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "All named properties must be subtypes of string indexer type '{0}':{NL}{1}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Generic type references must include all type arguments.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Default arguments are not allowed in an overload parameter.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Overloads cannot differ only by return type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Function expression declared a non-void return type, but has no return expression.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Import declaration referencing identifier from internal module can only be made with variables, functions, classes, interfaces, enums and internal modules.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Could not find symbol '{0}' in module '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Unable to resolve module reference '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Could not find module '{0}' in module '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Type '{0}' is missing property '{1}' from type '{2}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Types of property '{0}' of types '{1}' and '{2}' are incompatible.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Types of property '{0}' of types '{1}' and '{2}' are incompatible:{NL}{3}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Property '{0}' defined as private in type '{1}' is defined as public in type '{2}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Property '{0}' defined as public in type '{1}' is defined as private in type '{2}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Types '{0}' and '{1}' define property '{2}' as private.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Call signatures of types '{0}' and '{1}' are incompatible.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Call signatures of types '{0}' and '{1}' are incompatible:{NL}{2}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Type '{0}' requires a call signature, but type '{1}' lacks one.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Construct signatures of types '{0}' and '{1}' are incompatible.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Construct signatures of types '{0}' and '{1}' are incompatible:{NL}{2}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Type '{0}' requires a construct signature, but type '{1}' lacks one.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Index signatures of types '{0}' and '{1}' are incompatible.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Index signatures of types '{0}' and '{1}' are incompatible:{NL}{2}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Call signature expects {0} or fewer parameters.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Could not apply type '{0}' to argument {1} which is of type '{2}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Class '{0}' defines instance member accessor '{1}', but extended class '{2}' defines it as instance member function.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Class '{0}' defines instance member property '{1}', but extended class '{2}' defines it as instance member function.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Class '{0}' defines instance member function '{1}', but extended class '{2}' defines it as instance member accessor.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Class '{0}' defines instance member function '{1}', but extended class '{2}' defines it as instance member property.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Types of static property '{0}' of class '{1}' and class '{2}' are incompatible.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Types of static property '{0}' of class '{1}' and class '{2}' are incompatible:{NL}{3}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Type reference cannot refer to container '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Type reference must refer to type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Enums with multiple declarations must provide an initializer for the first enum element.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        " (+ {0} overload(s))": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Current host does not support '{0}' option.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "ECMAScript target version '{0}' not supported.  Using default '{1}' code generation.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Module code generation '{0}' not supported.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Could not find file: '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "A file cannot have a reference to itself.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Cannot resolve referenced file: '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Cannot find the common subdirectory path for the input files.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Cannot compile external modules when emitting into single file.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Emit Error: {0}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Cannot read file '{0}': {1}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Unsupported file encoding.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Locale must be of the form <language> or <language>-<territory>. For example '{0}' or '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Unsupported locale: '{0}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Execution Failed.{NL}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Should not emit a type query": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Should not emit a type reference": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Invalid call to 'up'": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Invalid call to 'down'": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Base64 value '{0}' finished with a continuation bit": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Key was already in table": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Unknown option '{0}'": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Expected {0} arguments to message, got {1} instead": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Expected the message '{0}' to have {1} arguments, but it had {2}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Invalid argument: {0}. {1}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Invalid argument: {0}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Argument out of range: {0}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Argument null: {0}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Operation not implemented properly by subclass.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Not yet implemented.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Invalid operation: {0}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Invalid operation.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Could not delete file '{0}'": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Could not create directory '{0}'": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Error while executing file '{0}': ": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Use of an external module requires the '--module' flag to be supplied to the compiler.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Concatenate and emit output to single file | Redirect output structure to the directory": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Generates corresponding {0} file": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Specifies the location where debugger should locate map files instead of generated locations.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Specifies the location where debugger should locate TypeScript files instead of source locations.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Watch input files": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Do not emit comments to output": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Skip resolution and preprocessing": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Specify ECMAScript target version: \"{0}\" (default), or \"{1}\"": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Specify module code generation: \"{0}\" or \"{1}\"": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Print this message": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Print the compiler's version: {0}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Allow use of deprecated \"{0}\" keyword when referencing an external module": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Specify locale for errors and messages. For example '{0}' or '{1}'": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Syntax:   {0}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "options": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "file": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Examples:": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Options:": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Insert command line options and files from a file.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Version {0}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Use the '{0}' flag to see options": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "{NL}Recompiling ({0}):": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "STRING": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "KIND": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "FILE|DIRECTORY": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "VERSION": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "LOCATION": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "This version of the Javascript runtime does not support the '{0}' function.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Looking up path for identifier token did not result in an identifer.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Unknown rule": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Invalid line number ({0})": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Warn on expressions and declarations with an implied 'any' type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Variable '{0}' implicitly has an 'any' type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of '{1}' implicitly has an 'any' type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of function type implicitly has an 'any' type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Member '{0}' of object type implicitly has an 'any' type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "\"New\" expression, which lacks a constructor signature, implicitly has an 'any' type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'{0}', which lacks return-type annotation, implicitly has an 'any' return type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Function expression, which lacks return-type annotation, implicitly has an 'any' return type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter '{0}' of lambda function implicitly has an 'any' type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Constructor signature, which lacks return-type annotation, implicitly has an 'any' return type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Lambda Function, which lacks return-type annotation, implicitly has an 'any' return type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Array Literal implicitly has an 'any' type from widening.": {
            "code": number;
            "category": DiagnosticCategory;
        };
    };
}
declare module TypeScript {
    class ArrayUtilities {
        static isArray(value: any): boolean;
        static sequenceEquals(array1: any[], array2: any[], equals: (v1: any, v2: any) => boolean): boolean;
        static contains(array: any[], value: any): boolean;
        static groupBy(array: any[], func: (v: any) => string): any;
        static min(array: any[], func: (v: any) => number): number;
        static max(array: any[], func: (v: any) => number): number;
        static last<T>(array: T[]): T;
        static firstOrDefault<T>(array: T[], func: (v: T) => boolean): T;
        static sum<T>(array: T[], func: (v: T) => number): number;
        static whereNotNull<T>(array: T[]): T[];
        static select<T, S>(values: T[], func: (v: T) => S): S[];
        static where<T>(values: T[], func: (v: T) => boolean): T[];
        static any<T>(array: T[], func: (v: T) => boolean): boolean;
        static all<T>(array: T[], func: (v: T) => boolean): boolean;
        static binarySearch(array: number[], value: number): number;
        static createArray<T>(length: number, defaultValue: any): T[];
        static grow<T>(array: T[], length: number, defaultValue: T): void;
        static copy<T>(sourceArray: T[], sourceIndex: number, destinationArray: T[], destinationIndex: number, length: number): void;
    }
}
declare module TypeScript {
    enum Constants {
        Max31BitInteger = 1073741823,
        Min31BitInteger,
    }
}
declare module TypeScript {
    class Debug {
        static assert(expression: boolean, message?: string): void;
    }
}
declare module TypeScript {
    interface DiagnosticInfo {
        category: TypeScript.DiagnosticCategory;
        message: string;
        code: number;
    }
}
declare module TypeScript {
    class Errors {
        static argument(argument: string, message?: string): Error;
        static argumentOutOfRange(argument: string): Error;
        static argumentNull(argument: string): Error;
        static abstract(): Error;
        static notYetImplemented(): Error;
        static invalidOperation(message?: string): Error;
    }
}
declare module TypeScript {
    class Hash {
        private static FNV_BASE;
        private static FNV_PRIME;
        private static computeFnv1aCharArrayHashCode(text, start, len);
        static computeSimple31BitCharArrayHashCode(key: number[], start: number, len: number): number;
        static computeSimple31BitStringHashCode(key: string): number;
        static computeMurmur2StringHashCode(key: string, seed: number): number;
        private static primes;
        static getPrime(min: number): number;
        static expandPrime(oldSize: number): number;
        static combine(value: number, currentHash: number): number;
    }
}
declare module TypeScript.Collections {
    var DefaultHashTableCapacity: number;
    class HashTable<TKey, TValue> {
        private hash;
        private entries;
        private count;
        constructor(capacity: number, hash: (k: TKey) => number);
        public set(key: TKey, value: TValue): void;
        public add(key: TKey, value: TValue): void;
        public containsKey(key: TKey): boolean;
        public get(key: TKey): TValue;
        private computeHashCode(key);
        private addOrSet(key, value, throwOnExistingEntry);
        private findEntry(key, hashCode);
        private addEntry(key, value, hashCode);
        private grow();
    }
    function createHashTable<TKey, TValue>(capacity?: number, hash?: (k: TKey) => number): HashTable<TKey, TValue>;
    function identityHashCode(value: any): number;
}
declare module TypeScript {
    var LocalizedDiagnosticMessages: any;
    function newLine(): string;
    class Diagnostic {
        private _fileName;
        private _start;
        private _length;
        private _diagnosticKey;
        private _arguments;
        constructor(fileName: string, start: number, length: number, diagnosticKey: string, arguments?: any[]);
        public toJSON(key: any): any;
        public fileName(): string;
        public start(): number;
        public length(): number;
        public diagnosticKey(): string;
        public arguments(): any[];
        /**
        * Get the text of the message in the given language.
        */
        public text(): string;
        /**
        * Get the text of the message including the error code in the given language.
        */
        public message(): string;
        /**
        * If a derived class has additional information about other referenced symbols, it can
        * expose the locations of those symbols in a general way, so they can be reported along
        * with the error.
        */
        public additionalLocations(): Location[];
        static equals(diagnostic1: Diagnostic, diagnostic2: Diagnostic): boolean;
    }
    function getDiagnosticInfoFromKey(diagnosticKey: string): DiagnosticInfo;
    function getLocalizedText(diagnosticKey: string, args: any[]): string;
    function getDiagnosticMessage(diagnosticKey: string, args: any[]): string;
}
declare class Enumerator {
    public atEnd(): boolean;
    public moveNext(): boolean;
    public item(): any;
    constructor(o: any);
}
declare module process {
    var argv: string[];
    var platform: string;
    function on(event: string, handler: (arg: any) => void): void;
    module stdout {
        function write(str: string): any;
        function on(event: string, action: () => void): void;
    }
    module stderr {
        function write(str: string): any;
        function on(event: string, action: () => void): void;
    }
    module mainModule {
        var filename: string;
    }
    function exit(exitCode?: number): any;
}
declare module TypeScript {
    var nodeMakeDirectoryTime: number;
    var nodeCreateBufferTime: number;
    var nodeWriteFileSyncTime: number;
}
declare enum ByteOrderMark {
    None = 0,
    Utf8 = 1,
    Utf16BigEndian = 2,
    Utf16LittleEndian = 3,
}
declare class FileInformation {
    public contents: string;
    public byteOrderMark: ByteOrderMark;
    constructor(contents: string, byteOrderMark: ByteOrderMark);
}
interface IEnvironment {
    readFile(path: string): FileInformation;
    writeFile(path: string, contents: string, writeByteOrderMark: boolean): void;
    deleteFile(path: string): void;
    fileExists(path: string): boolean;
    directoryExists(path: string): boolean;
    listFiles(path: string, re?: RegExp, options?: {
        recursive?: boolean;
    }): string[];
    arguments: string[];
    standardOut: ITextWriter;
    currentDirectory(): string;
    newLine: string;
}
declare var Environment: IEnvironment;
declare module TypeScript {
    class IntegerUtilities {
        static integerDivide(numerator: number, denominator: number): number;
        static integerMultiplyLow32Bits(n1: number, n2: number): number;
        static integerMultiplyHigh32Bits(n1: number, n2: number): number;
    }
}
declare module TypeScript {
    class MathPrototype {
        static max(a: number, b: number): number;
        static min(a: number, b: number): number;
    }
}
declare module TypeScript.Collections {
    var DefaultStringTableCapacity: number;
    class StringTable {
        private entries;
        private count;
        constructor(capacity: number);
        public addCharArray(key: number[], start: number, len: number): string;
        private findCharArrayEntry(key, start, len, hashCode);
        private addEntry(text, hashCode);
        private grow();
        private static textCharArrayEquals(text, array, start, length);
    }
    var DefaultStringTable: StringTable;
}
declare module TypeScript {
    class StringUtilities {
        static isString(value: any): boolean;
        static fromCharCodeArray(array: number[]): string;
        static endsWith(string: string, value: string): boolean;
        static startsWith(string: string, value: string): boolean;
        static copyTo(source: string, sourceIndex: number, destination: number[], destinationIndex: number, count: number): void;
        static repeat(value: string, count: number): string;
        static stringEquals(val1: string, val2: string): boolean;
    }
}
declare var global: any;
declare module TypeScript {
    class Timer {
        public startTime: number;
        public time: number;
        public start(): void;
        public end(): void;
    }
}
declare module TypeScript {
    enum SyntaxKind {
        None,
        List,
        SeparatedList,
        TriviaList,
        WhitespaceTrivia,
        NewLineTrivia,
        MultiLineCommentTrivia,
        SingleLineCommentTrivia,
        SkippedTokenTrivia,
        ErrorToken,
        EndOfFileToken,
        IdentifierName,
        RegularExpressionLiteral,
        NumericLiteral,
        StringLiteral,
        BreakKeyword,
        CaseKeyword,
        CatchKeyword,
        ContinueKeyword,
        DebuggerKeyword,
        DefaultKeyword,
        DeleteKeyword,
        DoKeyword,
        ElseKeyword,
        FalseKeyword,
        FinallyKeyword,
        ForKeyword,
        FunctionKeyword,
        IfKeyword,
        InKeyword,
        InstanceOfKeyword,
        NewKeyword,
        NullKeyword,
        ReturnKeyword,
        SwitchKeyword,
        ThisKeyword,
        ThrowKeyword,
        TrueKeyword,
        TryKeyword,
        TypeOfKeyword,
        VarKeyword,
        VoidKeyword,
        WhileKeyword,
        WithKeyword,
        ClassKeyword,
        ConstKeyword,
        EnumKeyword,
        ExportKeyword,
        ExtendsKeyword,
        ImportKeyword,
        SuperKeyword,
        ImplementsKeyword,
        InterfaceKeyword,
        LetKeyword,
        PackageKeyword,
        PrivateKeyword,
        ProtectedKeyword,
        PublicKeyword,
        StaticKeyword,
        YieldKeyword,
        AnyKeyword,
        BooleanKeyword,
        ConstructorKeyword,
        DeclareKeyword,
        GetKeyword,
        ModuleKeyword,
        RequireKeyword,
        NumberKeyword,
        SetKeyword,
        StringKeyword,
        OpenBraceToken,
        CloseBraceToken,
        OpenParenToken,
        CloseParenToken,
        OpenBracketToken,
        CloseBracketToken,
        DotToken,
        DotDotDotToken,
        SemicolonToken,
        CommaToken,
        LessThanToken,
        GreaterThanToken,
        LessThanEqualsToken,
        GreaterThanEqualsToken,
        EqualsEqualsToken,
        EqualsGreaterThanToken,
        ExclamationEqualsToken,
        EqualsEqualsEqualsToken,
        ExclamationEqualsEqualsToken,
        PlusToken,
        MinusToken,
        AsteriskToken,
        PercentToken,
        PlusPlusToken,
        MinusMinusToken,
        LessThanLessThanToken,
        GreaterThanGreaterThanToken,
        GreaterThanGreaterThanGreaterThanToken,
        AmpersandToken,
        BarToken,
        CaretToken,
        ExclamationToken,
        TildeToken,
        AmpersandAmpersandToken,
        BarBarToken,
        QuestionToken,
        ColonToken,
        EqualsToken,
        PlusEqualsToken,
        MinusEqualsToken,
        AsteriskEqualsToken,
        PercentEqualsToken,
        LessThanLessThanEqualsToken,
        GreaterThanGreaterThanEqualsToken,
        GreaterThanGreaterThanGreaterThanEqualsToken,
        AmpersandEqualsToken,
        BarEqualsToken,
        CaretEqualsToken,
        SlashToken,
        SlashEqualsToken,
        SourceUnit,
        QualifiedName,
        ObjectType,
        FunctionType,
        ArrayType,
        ConstructorType,
        GenericType,
        TypeQuery,
        InterfaceDeclaration,
        FunctionDeclaration,
        ModuleDeclaration,
        ClassDeclaration,
        EnumDeclaration,
        ImportDeclaration,
        ExportAssignment,
        MemberFunctionDeclaration,
        MemberVariableDeclaration,
        ConstructorDeclaration,
        GetMemberAccessorDeclaration,
        SetMemberAccessorDeclaration,
        PropertySignature,
        CallSignature,
        ConstructSignature,
        IndexSignature,
        MethodSignature,
        Block,
        IfStatement,
        VariableStatement,
        ExpressionStatement,
        ReturnStatement,
        SwitchStatement,
        BreakStatement,
        ContinueStatement,
        ForStatement,
        ForInStatement,
        EmptyStatement,
        ThrowStatement,
        WhileStatement,
        TryStatement,
        LabeledStatement,
        DoStatement,
        DebuggerStatement,
        WithStatement,
        PlusExpression,
        NegateExpression,
        BitwiseNotExpression,
        LogicalNotExpression,
        PreIncrementExpression,
        PreDecrementExpression,
        DeleteExpression,
        TypeOfExpression,
        VoidExpression,
        CommaExpression,
        AssignmentExpression,
        AddAssignmentExpression,
        SubtractAssignmentExpression,
        MultiplyAssignmentExpression,
        DivideAssignmentExpression,
        ModuloAssignmentExpression,
        AndAssignmentExpression,
        ExclusiveOrAssignmentExpression,
        OrAssignmentExpression,
        LeftShiftAssignmentExpression,
        SignedRightShiftAssignmentExpression,
        UnsignedRightShiftAssignmentExpression,
        ConditionalExpression,
        LogicalOrExpression,
        LogicalAndExpression,
        BitwiseOrExpression,
        BitwiseExclusiveOrExpression,
        BitwiseAndExpression,
        EqualsWithTypeConversionExpression,
        NotEqualsWithTypeConversionExpression,
        EqualsExpression,
        NotEqualsExpression,
        LessThanExpression,
        GreaterThanExpression,
        LessThanOrEqualExpression,
        GreaterThanOrEqualExpression,
        InstanceOfExpression,
        InExpression,
        LeftShiftExpression,
        SignedRightShiftExpression,
        UnsignedRightShiftExpression,
        MultiplyExpression,
        DivideExpression,
        ModuloExpression,
        AddExpression,
        SubtractExpression,
        PostIncrementExpression,
        PostDecrementExpression,
        MemberAccessExpression,
        InvocationExpression,
        ArrayLiteralExpression,
        ObjectLiteralExpression,
        ObjectCreationExpression,
        ParenthesizedExpression,
        ParenthesizedArrowFunctionExpression,
        SimpleArrowFunctionExpression,
        CastExpression,
        ElementAccessExpression,
        FunctionExpression,
        OmittedExpression,
        VariableDeclaration,
        VariableDeclarator,
        ArgumentList,
        ParameterList,
        TypeArgumentList,
        TypeParameterList,
        HeritageClause,
        EqualsValueClause,
        CaseSwitchClause,
        DefaultSwitchClause,
        ElseClause,
        CatchClause,
        FinallyClause,
        TypeParameter,
        Constraint,
        SimplePropertyAssignment,
        GetAccessorPropertyAssignment,
        SetAccessorPropertyAssignment,
        FunctionPropertyAssignment,
        Parameter,
        EnumElement,
        TypeAnnotation,
        ExternalModuleReference,
        ModuleNameModuleReference,
        FirstStandardKeyword,
        LastStandardKeyword,
        FirstFutureReservedKeyword,
        LastFutureReservedKeyword,
        FirstFutureReservedStrictKeyword,
        LastFutureReservedStrictKeyword,
        FirstTypeScriptKeyword,
        LastTypeScriptKeyword,
        FirstKeyword,
        LastKeyword,
        FirstToken,
        LastToken,
        FirstPunctuation,
        LastPunctuation,
        FirstFixedWidth,
        LastFixedWidth,
    }
}
declare module TypeScript.SyntaxFacts {
    function getTokenKind(text: string): TypeScript.SyntaxKind;
    function getText(kind: TypeScript.SyntaxKind): string;
    function isTokenKind(kind: TypeScript.SyntaxKind): boolean;
    function isAnyKeyword(kind: TypeScript.SyntaxKind): boolean;
    function isStandardKeyword(kind: TypeScript.SyntaxKind): boolean;
    function isFutureReservedKeyword(kind: TypeScript.SyntaxKind): boolean;
    function isFutureReservedStrictKeyword(kind: TypeScript.SyntaxKind): boolean;
    function isAnyPunctuation(kind: TypeScript.SyntaxKind): boolean;
    function isPrefixUnaryExpressionOperatorToken(tokenKind: TypeScript.SyntaxKind): boolean;
    function isBinaryExpressionOperatorToken(tokenKind: TypeScript.SyntaxKind): boolean;
    function getPrefixUnaryExpressionFromOperatorToken(tokenKind: TypeScript.SyntaxKind): TypeScript.SyntaxKind;
    function getPostfixUnaryExpressionFromOperatorToken(tokenKind: TypeScript.SyntaxKind): TypeScript.SyntaxKind;
    function getBinaryExpressionFromOperatorToken(tokenKind: TypeScript.SyntaxKind): TypeScript.SyntaxKind;
    function isAnyDivideToken(kind: TypeScript.SyntaxKind): boolean;
    function isAnyDivideOrRegularExpressionToken(kind: TypeScript.SyntaxKind): boolean;
    function isParserGenerated(kind: TypeScript.SyntaxKind): boolean;
    function isAnyBinaryExpression(kind: TypeScript.SyntaxKind): boolean;
}
declare var argumentChecks: boolean;
declare var forPrettyPrinter: boolean;
interface ITypeDefinition {
    name: string;
    baseType: string;
    interfaces?: string[];
    isAbstract?: boolean;
    children: IMemberDefinition[];
    isTypeScriptSpecific: boolean;
}
interface IMemberDefinition {
    name: string;
    type?: string;
    isToken?: boolean;
    isList?: boolean;
    isSeparatedList?: boolean;
    requiresAtLeastOneItem?: boolean;
    isOptional?: boolean;
    tokenKinds?: string[];
    isTypeScriptSpecific: boolean;
    elementType?: string;
}
declare var interfaces: {
    IMemberDeclarationSyntax: string;
    IStatementSyntax: string;
    INameSyntax: string;
    ITypeSyntax: string;
    IUnaryExpressionSyntax: string;
};
declare var definitions: ITypeDefinition[];
declare function getStringWithoutSuffix(definition: string): string;
declare function getNameWithoutSuffix(definition: ITypeDefinition): string;
declare function getType(child: IMemberDefinition): string;
declare var hasKind: boolean;
declare function pascalCase(value: string): string;
declare function camelCase(value: string): string;
declare function getSafeName(child: IMemberDefinition): string;
declare function getPropertyAccess(child: IMemberDefinition): string;
declare function generateProperties(definition: ITypeDefinition): string;
declare function generateNullChecks(definition: ITypeDefinition): string;
declare function generateIfKindCheck(child: IMemberDefinition, tokenKinds: string[], indent: string): string;
declare function generateSwitchCase(tokenKind: string, indent: string): string;
declare function generateBreakStatement(indent: string): string;
declare function generateSwitchCases(tokenKinds: string[], indent: string): string;
declare function generateDefaultCase(child: IMemberDefinition, indent: string): string;
declare function generateSwitchKindCheck(child: IMemberDefinition, tokenKinds: string[], indent: string): string;
declare function tokenKinds(child: IMemberDefinition): string[];
declare function generateKindCheck(child: IMemberDefinition): string;
declare function generateKindChecks(definition: ITypeDefinition): string;
declare function generateArgumentChecks(definition: ITypeDefinition): string;
declare function generateConstructor(definition: ITypeDefinition): string;
declare function isOptional(child: IMemberDefinition): boolean;
declare function generateFactory1Method(definition: ITypeDefinition): string;
declare function isKeywordOrPunctuation(kind: string): boolean;
declare function isDefaultConstructable(definition: ITypeDefinition): boolean;
declare function isMandatory(child: IMemberDefinition): boolean;
declare function generateFactory2Method(definition: ITypeDefinition): string;
declare function generateFactoryMethod(definition: ITypeDefinition): string;
declare function generateAcceptMethods(definition: ITypeDefinition): string;
declare function generateIsMethod(definition: ITypeDefinition): string;
declare function generateKindMethod(definition: ITypeDefinition): string;
declare function generateSlotMethods(definition: ITypeDefinition): string;
declare function generateFirstTokenMethod(definition: ITypeDefinition): string;
declare function generateLastTokenMethod(definition: ITypeDefinition): string;
declare function generateInsertChildrenIntoMethod(definition: ITypeDefinition): string;
declare function baseType(definition: ITypeDefinition): ITypeDefinition;
declare function memberDefinitionType(child: IMemberDefinition): ITypeDefinition;
declare function derivesFrom(def1: ITypeDefinition, def2: ITypeDefinition): boolean;
declare function contains(definition: ITypeDefinition, child: IMemberDefinition): boolean;
declare function childrenInAllSubclasses(definition: ITypeDefinition): IMemberDefinition[];
declare function generateAccessors(definition: ITypeDefinition): string;
declare function generateWithMethod(definition: ITypeDefinition, child: IMemberDefinition): string;
declare function generateWithMethods(definition: ITypeDefinition): string;
declare function generateTriviaMethods(definition: ITypeDefinition): string;
declare function generateUpdateMethod(definition: ITypeDefinition): string;
declare function generateIsTypeScriptSpecificMethod(definition: ITypeDefinition): string;
declare function couldBeRegularExpressionToken(child: IMemberDefinition): boolean;
declare function generateStructuralEqualsMethod(definition: ITypeDefinition): string;
declare function generateNode(definition: ITypeDefinition): string;
declare function generateNodes(): string;
declare function isInterface(name: string): boolean;
declare function isNodeOrToken(child: IMemberDefinition): boolean;
declare function generateRewriter(): string;
declare function generateToken(isFixedWidth: boolean, leading: boolean, trailing: boolean): string;
declare function generateTokens(): string;
declare function generateWalker(): string;
declare function firstEnumName(e: any, value: number);
declare function generateKeywordCondition(keywords: {
    text: string;
    kind: TypeScript.SyntaxKind;
}[], currentCharacter: number, indent: string): string;
declare function generateScannerUtilities(): string;
declare function generateVisitor(): string;
declare function generateFactory(): string;
declare var syntaxNodes: string;
declare var rewriter: string;
declare var tokens: string;
declare var walker: string;
declare var scannerUtilities: string;
declare var visitor: string;
declare var factory: string;
