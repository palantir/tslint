declare var require: any;
declare var module: any;
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
        Parameter_property_declarations_cannot_be_used_in_an_ambient_context: string;
        Parameter_property_declarations_cannot_be_used_in_a_constructor_overload: string;
        Invalid_reference_directive_syntax: string;
        Octal_literals_are_not_available_when_targeting_ECMAScript_5_and_higher: string;
        Accessors_are_not_allowed_in_ambient_contexts: string;
        _0_modifier_cannot_appear_on_a_constructor_declaration: string;
        _0_modifier_cannot_appear_on_a_parameter: string;
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
        Type_of_array_literal_cannot_be_determined_Best_common_type_could_not_be_found_for_array_elements: string;
        Could_not_find_enclosing_symbol_for_dotted_name_0: string;
        The_property_0_does_not_exist_on_value_of_type_1: string;
        Could_not_find_symbol_0: string;
        get_and_set_accessor_must_have_the_same_type: string;
        this_cannot_be_referenced_in_current_location: string;
        Static_methods_cannot_reference_class_type_parameters: string;
        Class_0_is_recursively_referenced_as_a_base_type_of_itself: string;
        Interface_0_is_recursively_referenced_as_a_base_type_of_itself: string;
        super_property_access_is_permitted_only_in_a_constructor_member_function_or_member_accessor_of_a_derived_class: string;
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
        The_left_hand_side_of_an_in_expression_must_be_of_types_any_string_or_number: string;
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
        Overload_signatures_must_all_be_exported_or_not_exported: string;
        Overload_signatures_must_all_be_ambient_or_non_ambient: string;
        Overload_signatures_must_all_be_optional_or_required: string;
        Specialized_overload_signature_is_not_subtype_of_any_non_specialized_signature: string;
        this_cannot_be_referenced_in_constructor_arguments: string;
        Instance_member_cannot_be_accessed_off_a_class: string;
        Untyped_function_calls_may_not_accept_type_arguments: string;
        Non_generic_functions_may_not_accept_type_arguments: string;
        A_generic_type_may_not_reference_itself_with_a_wrapped_form_of_its_own_type_parameters: string;
        Rest_parameters_must_be_array_types: string;
        Overload_signature_implementation_cannot_use_specialized_type: string;
        Export_assignments_may_only_be_used_at_the_top_level_of_external_modules: string;
        Export_assignments_may_only_be_made_with_variables_functions_classes_interfaces_enums_and_internal_modules: string;
        Only_public_methods_of_the_base_class_are_accessible_via_the_super_keyword: string;
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
        Exported_import_declaration_0_is_assigned_value_with_type_that_has_or_is_using_private_type_1: string;
        Exported_import_declaration_0_is_assigned_value_with_type_that_is_using_inaccessible_module_1: string;
        Exported_import_declaration_0_is_assigned_type_that_has_or_is_using_private_type_1: string;
        Exported_import_declaration_0_is_assigned_type_that_is_using_inaccessible_module_1: string;
        Exported_import_declaration_0_is_assigned_container_that_is_or_is_using_inaccessible_module_1: string;
        Type_reference_0_in_extends_clause_does_not_reference_constructor_function_for_1: string;
        Internal_module_reference_0_in_import_declaration_does_not_reference_module_instance_for_1: string;
        Module_0_cannot_merge_with_previous_declaration_of_1_in_a_different_file_2: string;
        Interface_0_cannot_simultaneously_extend_types_1_and_2_NL_3: string;
        Initializer_of_parameter_0_cannot_reference_identifier_1_declared_after_it: string;
        Ambient_external_module_declaration_cannot_be_reopened: string;
        All_declarations_of_merged_declaration_0_must_be_exported_or_not_exported: string;
        super_cannot_be_referenced_in_constructor_arguments: string;
        Return_type_of_constructor_signature_must_be_assignable_to_the_instance_type_of_the_class: string;
        Ambient_external_module_declaration_must_be_defined_in_global_context: string;
        Ambient_external_module_declaration_cannot_specify_relative_module_name: string;
        Import_declaration_in_an_ambient_external_module_declaration_cannot_reference_external_module_through_relative_external_module_name: string;
        Could_not_find_the_best_common_type_of_types_of_all_return_statement_expressions: string;
        Import_declaration_cannot_refer_to_external_module_reference_when_noResolve_option_is_set: string;
        Duplicate_identifier_this_Compiler_uses_variable_declaration_this_to_capture_this_reference: string;
        continue_statement_can_only_be_used_within_an_enclosing_iteration_statement: string;
        break_statement_can_only_be_used_within_an_enclosing_iteration_or_switch_statement: string;
        Jump_target_not_found: string;
        Jump_target_cannot_cross_function_boundary: string;
        Duplicate_identifier_super_Compiler_uses_super_to_capture_base_class_reference: string;
        Expression_resolves_to_variable_declaration_this_that_compiler_uses_to_capture_this_reference: string;
        Expression_resolves_to_super_that_compiler_uses_to_capture_base_class_reference: string;
        TypeParameter_0_of_constructor_signature_from_exported_interface_has_or_is_using_private_type_1: string;
        TypeParameter_0_of_call_signature_from_exported_interface_has_or_is_using_private_type_1: string;
        TypeParameter_0_of_public_static_method_from_exported_class_has_or_is_using_private_type_1: string;
        TypeParameter_0_of_public_method_from_exported_class_has_or_is_using_private_type_1: string;
        TypeParameter_0_of_method_from_exported_interface_has_or_is_using_private_type_1: string;
        TypeParameter_0_of_exported_function_has_or_is_using_private_type_1: string;
        TypeParameter_0_of_constructor_signature_from_exported_interface_is_using_inaccessible_module_1: string;
        TypeParameter_0_of_call_signature_from_exported_interface_is_using_inaccessible_module_1: string;
        TypeParameter_0_of_public_static_method_from_exported_class_is_using_inaccessible_module_1: string;
        TypeParameter_0_of_public_method_from_exported_class_is_using_inaccessible_module_1: string;
        TypeParameter_0_of_method_from_exported_interface_is_using_inaccessible_module_1: string;
        TypeParameter_0_of_exported_function_is_using_inaccessible_module_1: string;
        TypeParameter_0_of_exported_class_has_or_is_using_private_type_1: string;
        TypeParameter_0_of_exported_interface_has_or_is_using_private_type_1: string;
        TypeParameter_0_of_exported_class_is_using_inaccessible_module_1: string;
        TypeParameter_0_of_exported_interface_is_using_inaccessible_module_1: string;
        Duplicate_identifier_i_Compiler_uses_i_to_initialize_rest_parameter: string;
        Duplicate_identifier_arguments_Compiler_uses_arguments_to_initialize_rest_parameters: string;
        Type_of_conditional_0_must_be_identical_to_1_or_2: string;
        Type_of_conditional_0_must_be_identical_to_1_2_or_3: string;
        Duplicate_identifier_0_Compiler_reserves_name_1_in_top_level_scope_of_an_external_module: string;
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
        Variable_declaration_cannot_have_the_same_name_as_an_import_declaration: string;
        Signature_expected_0_type_arguments_got_1_instead: string;
        Property_0_defined_as_optional_in_type_1_but_is_required_in_type_2: string;
        Types_0_and_1_originating_in_inifinitely_expanding_type_reference_do_not_refer_to_same_named_type: string;
        Types_0_and_1_originating_in_inifinitely_expanding_type_reference_have_incompatible_type_arguments: string;
        Types_0_and_1_originating_in_inifinitely_expanding_type_reference_have_incompatible_type_arguments_NL_2: string;
        Types_of_property_0_of_types_1_and_2_are_not_identical: string;
        Types_of_string_indexer_of_types_0_and_1_are_not_identical: string;
        Types_of_number_indexer_of_types_0_and_1_are_not_identical: string;
        Type_of_number_indexer_in_type_0_is_not_a_subtype_of_string_indexer_type_in_type_1_NL_2: string;
        Type_of_property_0_in_type_1_is_not_a_subtype_of_string_indexer_type_in_type_2_NL_3: string;
        Type_of_property_0_in_type_1_is_not_a_subtype_of_number_indexer_type_in_type_2_NL_3: string;
        Current_host_does_not_support_0_option: string;
        ECMAScript_target_version_0_not_supported_Specify_a_valid_target_version_1_default_or_2: string;
        Module_code_generation_0_not_supported: string;
        Could_not_find_file_0: string;
        A_file_cannot_have_a_reference_to_itself: string;
        Cannot_resolve_referenced_file_0: string;
        Cannot_find_the_common_subdirectory_path_for_the_input_files: string;
        Emit_Error_0: string;
        Cannot_read_file_0_1: string;
        Unsupported_file_encoding: string;
        Locale_must_be_of_the_form_language_or_language_territory_For_example_0_or_1: string;
        Unsupported_locale_0: string;
        Execution_Failed_NL: string;
        Invalid_call_to_up: string;
        Invalid_call_to_down: string;
        Base64_value_0_finished_with_a_continuation_bit: string;
        Unknown_option_0: string;
        Expected_0_arguments_to_message_got_1_instead: string;
        Expected_the_message_0_to_have_1_arguments_but_it_had_2: string;
        Could_not_delete_file_0: string;
        Could_not_create_directory_0: string;
        Error_while_executing_file_0: string;
        Cannot_compile_external_modules_unless_the_module_flag_is_provided: string;
        Option_mapRoot_cannot_be_specified_without_specifying_sourcemap_option: string;
        Option_sourceRoot_cannot_be_specified_without_specifying_sourcemap_option: string;
        Options_mapRoot_and_sourceRoot_cannot_be_specified_without_specifying_sourcemap_option: string;
        Option_0_specified_without_1: string;
        codepage_option_not_supported_on_current_platform: string;
        Concatenate_and_emit_output_to_single_file: string;
        Generates_corresponding_0_file: string;
        Specifies_the_location_where_debugger_should_locate_map_files_instead_of_generated_locations: string;
        Specifies_the_location_where_debugger_should_locate_TypeScript_files_instead_of_source_locations: string;
        Watch_input_files: string;
        Redirect_output_structure_to_the_directory: string;
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
        file1: string;
        Examples: string;
        Options: string;
        Insert_command_line_options_and_files_from_a_file: string;
        Version_0: string;
        Use_the_0_flag_to_see_options: string;
        NL_Recompiling_0: string;
        STRING: string;
        KIND: string;
        file2: string;
        VERSION: string;
        LOCATION: string;
        DIRECTORY: string;
        NUMBER: string;
        Specify_the_codepage_to_use_when_opening_source_files: string;
        This_version_of_the_Javascript_runtime_does_not_support_the_0_function: string;
        Unknown_rule: string;
        Invalid_line_number_0: string;
        Warn_on_expressions_and_declarations_with_an_implied_any_type: string;
        Variable_0_implicitly_has_an_any_type: string;
        Parameter_0_of_1_implicitly_has_an_any_type: string;
        Parameter_0_of_function_type_implicitly_has_an_any_type: string;
        Member_0_of_object_type_implicitly_has_an_any_type: string;
        new_expression_which_lacks_a_constructor_signature_implicitly_has_an_any_type: string;
        _0_which_lacks_return_type_annotation_implicitly_has_an_any_return_type: string;
        Function_expression_which_lacks_return_type_annotation_implicitly_has_an_any_return_type: string;
        Parameter_0_of_lambda_function_implicitly_has_an_any_type: string;
        Constructor_signature_which_lacks_return_type_annotation_implicitly_has_an_any_return_type: string;
        Lambda_Function_which_lacks_return_type_annotation_implicitly_has_an_any_return_type: string;
        Array_Literal_implicitly_has_an_any_type_from_widening: string;
        _0_which_lacks_get_accessor_and_parameter_type_annotation_on_set_accessor_implicitly_has_an_any_type: string;
    };
}
declare module TypeScript {
    enum DiagnosticCategory {
        Warning = 0,
        Error = 1,
        Message = 2,
        NoPrefix = 3,
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
        "Function overload must be static.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Function overload must not be static.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter property declarations cannot be used in an ambient context.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Parameter property declarations cannot be used in a constructor overload.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Invalid 'reference' directive syntax.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Octal literals are not available when targeting ECMAScript 5 and higher.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Accessors are not allowed in ambient contexts.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'{0}' modifier cannot appear on a constructor declaration.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'{0}' modifier cannot appear on a parameter.": {
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
        "'super' property access is permitted only in a constructor, member function, or member accessor of a derived class.": {
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
        "The left-hand side of an 'in' expression must be of types 'any', 'string' or 'number'.": {
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
        "Overload signatures must all be exported or not exported.": {
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
        "Export assignments may only be made with variables, functions, classes, interfaces, enums and internal modules.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Only public methods of the base class are accessible via the 'super' keyword.": {
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
        "Exported import declaration '{0}' is assigned value with type that has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Exported import declaration '{0}' is assigned value with type that is using inaccessible module '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Exported import declaration '{0}' is assigned type that has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Exported import declaration '{0}' is assigned type that is using inaccessible module '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Exported import declaration '{0}' is assigned container that is or is using inaccessible module '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Type reference '{0}' in extends clause does not reference constructor function for '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Internal module reference '{0}' in import declaration does not reference module instance for '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Module '{0}' cannot merge with previous declaration of '{1}' in a different file '{2}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Interface '{0}' cannot simultaneously extend types '{1}' and '{2}':{NL}{3}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Initializer of parameter '{0}' cannot reference identifier '{1}' declared after it.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Ambient external module declaration cannot be reopened.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "All declarations of merged declaration '{0}' must be exported or not exported.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'super' cannot be referenced in constructor arguments.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Return type of constructor signature must be assignable to the instance type of the class.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Ambient external module declaration must be defined in global context.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Ambient external module declaration cannot specify relative module name.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Import declaration in an ambient external module declaration cannot reference external module through relative external module name.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Could not find the best common type of types of all return statement expressions.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Import declaration cannot refer to external module reference when --noResolve option is set.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Duplicate identifier '_this'. Compiler uses variable declaration '_this' to capture 'this' reference.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'continue' statement can only be used within an enclosing iteration statement.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'break' statement can only be used within an enclosing iteration or switch statement.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Jump target not found.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Jump target cannot cross function boundary.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Duplicate identifier '_super'. Compiler uses '_super' to capture base class reference.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Expression resolves to variable declaration '_this' that compiler uses to capture 'this' reference.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Expression resolves to '_super' that compiler uses to capture base class reference.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "TypeParameter '{0}' of constructor signature from exported interface has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "TypeParameter '{0}' of call signature from exported interface has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "TypeParameter '{0}' of public static method from exported class has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "TypeParameter '{0}' of public method from exported class has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "TypeParameter '{0}' of method from exported interface has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "TypeParameter '{0}' of exported function has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "TypeParameter '{0}' of constructor signature from exported interface is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "TypeParameter '{0}' of call signature from exported interface is using inaccessible module {1}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "TypeParameter '{0}' of public static method from exported class is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "TypeParameter '{0}' of public method from exported class is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "TypeParameter '{0}' of method from exported interface is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "TypeParameter '{0}' of exported function is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "TypeParameter '{0}' of exported class has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "TypeParameter '{0}' of exported interface has or is using private type '{1}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "TypeParameter '{0}' of exported class is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "TypeParameter '{0}' of exported interface is using inaccessible module {1}.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Duplicate identifier '_i'. Compiler uses '_i' to initialize rest parameter.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Duplicate identifier 'arguments'. Compiler uses 'arguments' to initialize rest parameters.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Type of conditional '{0}' must be identical to '{1}' or '{2}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Type of conditional '{0}' must be identical to '{1}', '{2}' or '{3}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Duplicate identifier '{0}'. Compiler reserves name '{1}' in top level scope of an external module.": {
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
        "Variable declaration cannot have the same name as an import declaration.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Signature expected {0} type arguments, got {1} instead.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Property '{0}' defined as optional in type '{1}', but is required in type '{2}'.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Types '{0}' and '{1}' originating in inifinitely expanding type reference do not refer to same named type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Types '{0}' and '{1}' originating in inifinitely expanding type reference have incompatible type arguments.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Types '{0}' and '{1}' originating in inifinitely expanding type reference have incompatible type arguments:{NL}{2}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Types of property '{0}' of types '{1}' and '{2}' are not identical.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Types of string indexer of types '{0}' and '{1}' are not identical.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Types of number indexer of types '{0}' and '{1}' are not identical.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Type of number indexer in type '{0}' is not a subtype of string indexer type in type '{1}'.{NL}{2}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Type of property '{0}' in type '{1}' is not a subtype of string indexer type in type '{2}'.{NL}{3}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Type of property '{0}' in type '{1}' is not a subtype of number indexer type in type '{2}'.{NL}{3}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Current host does not support '{0}' option.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "ECMAScript target version '{0}' not supported.  Specify a valid target version: '{1}' (default), or '{2}'": {
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
        "Invalid call to 'up'": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Invalid call to 'down'": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Base64 value '{0}' finished with a continuation bit.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Unknown option '{0}'": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Expected {0} arguments to message, got {1} instead.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Expected the message '{0}' to have {1} arguments, but it had {2}": {
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
        "Cannot compile external modules unless the '--module' flag is provided.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Option mapRoot cannot be specified without specifying sourcemap option.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Option sourceRoot cannot be specified without specifying sourcemap option.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Options mapRoot and sourceRoot cannot be specified without specifying sourcemap option.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Option '{0}' specified without '{1}'": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "'codepage' option not supported on current platform.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Concatenate and emit output to single file.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Generates corresponding {0} file.": {
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
        "Watch input files.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Redirect output structure to the directory.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Do not emit comments to output.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Skip resolution and preprocessing.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Specify ECMAScript target version: '{0}' (default), or '{1}'": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Specify module code generation: '{0}' or '{1}'": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Print this message.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Print the compiler's version: {0}": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Allow use of deprecated '{0}' keyword when referencing an external module.": {
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
        "file1": {
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
        "Use the '{0}' flag to see options.": {
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
        "file2": {
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
        "DIRECTORY": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "NUMBER": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Specify the codepage to use when opening source files.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "This version of the Javascript runtime does not support the '{0}' function.": {
            "code": number;
            "category": DiagnosticCategory;
        };
        "Unknown rule.": {
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
        "'new' expression, which lacks a constructor signature, implicitly has an 'any' type.": {
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
        "'{0}', which lacks 'get' accessor and parameter type annotation on 'set' accessor, implicitly has an 'any' type.": {
            "code": number;
            "category": DiagnosticCategory;
        };
    };
}
declare module TypeScript {
    class ArrayUtilities {
        static isArray(value: any): boolean;
        static sequenceEquals<T>(array1: T[], array2: T[], equals: (v1: T, v2: T) => boolean): boolean;
        static contains<T>(array: T[], value: T): boolean;
        static groupBy(array: any[], func: (v: any) => string): any;
        static distinct<T>(array: T[], equalsFn?: (a: T, b: T) => boolean): T[];
        static min<T>(array: T[], func: (v: T) => number): number;
        static max<T>(array: T[], func: (v: T) => number): number;
        static last<T>(array: T[]): T;
        static lastOrDefault<T>(array: T[], predicate: (v: T, index: number) => boolean): T;
        static firstOrDefault<T>(array: T[], func: (v: T, index: number) => boolean): T;
        static first<T>(array: T[], func?: (v: T, index: number) => boolean): T;
        static sum<T>(array: T[], func: (v: T) => number): number;
        static select<T, S>(values: T[], func: (v: T) => S): S[];
        static where<T>(values: T[], func: (v: T) => boolean): T[];
        static any<T>(array: T[], func: (v: T) => boolean): boolean;
        static all<T>(array: T[], func: (v: T) => boolean): boolean;
        static binarySearch(array: number[], value: number): number;
        static createArray<T>(length: number, defaultValue: any): T[];
        static grow<T>(array: T[], length: number, defaultValue: T): void;
        static copy<T>(sourceArray: T[], sourceIndex: number, destinationArray: T[], destinationIndex: number, length: number): void;
        static indexOf<T>(array: T[], predicate: (v: T) => boolean): number;
    }
}
declare module TypeScript {
    interface IBitVector {
        valueAt(index: number): boolean;
        setValueAt(index: number, value: boolean): void;
        release(): void;
    }
    module BitVector {
        function getBitVector(allowUndefinedValues: boolean): IBitVector;
    }
}
declare module TypeScript {
    interface IBitMatrix {
        valueAt(x: number, y: number): boolean;
        setValueAt(x: number, y: number, value: boolean): void;
        release(): void;
    }
    module BitMatrix {
        function getBitMatrix(allowUndefinedValues: boolean): IBitMatrix;
    }
}
declare module TypeScript {
    enum Constants {
        Max31BitInteger = 1073741823,
        Min31BitInteger = -1073741824,
    }
}
declare module TypeScript {
    enum AssertionLevel {
        None = 0,
        Normal = 1,
        Aggressive = 2,
        VeryAggressive = 3,
    }
    class Debug {
        private static currentAssertionLevel;
        static shouldAssert(level: AssertionLevel): boolean;
        static assert(expression: any, message?: string, verboseDebugInfo?: () => string): void;
        static fail(message?: string): void;
    }
}
declare module TypeScript {
    var LocalizedDiagnosticMessages: any;
    class Diagnostic {
        private _fileName;
        private _lineMap;
        private _start;
        private _length;
        private _diagnosticKey;
        private _arguments;
        constructor(fileName: string, lineMap: TypeScript.LineMap, start: number, length: number, diagnosticKey: string, arguments?: any[]);
        public toJSON(key: any): any;
        public fileName(): string;
        public line(): number;
        public character(): number;
        public start(): number;
        public length(): number;
        public diagnosticKey(): string;
        public arguments(): any[];
        public text(): string;
        public message(): string;
        public additionalLocations(): Location[];
        static equals(diagnostic1: Diagnostic, diagnostic2: Diagnostic): boolean;
        public info(): TypeScript.DiagnosticInfo;
    }
    function newLine(): string;
    function getLocalizedText(diagnosticKey: string, args: any[]): string;
    function getDiagnosticMessage(diagnosticKey: string, args: any[]): string;
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
declare var Buffer: new(str: string, encoding?: string) => any;
declare module TypeScript {
    var nodeMakeDirectoryTime: number;
    var nodeCreateBufferTime: number;
    var nodeWriteFileSyncTime: number;
    enum ByteOrderMark {
        None = 0,
        Utf8 = 1,
        Utf16BigEndian = 2,
        Utf16LittleEndian = 3,
    }
    class FileInformation {
        public contents: string;
        public byteOrderMark: ByteOrderMark;
        constructor(contents: string, byteOrderMark: ByteOrderMark);
    }
    interface IEnvironment {
        supportsCodePage(): boolean;
        readFile(path: string, codepage: number): FileInformation;
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
    var Environment: IEnvironment;
}
declare module TypeScript {
    module IntegerUtilities {
        function integerDivide(numerator: number, denominator: number): number;
        function integerMultiplyLow32Bits(n1: number, n2: number): number;
        function integerMultiplyHigh32Bits(n1: number, n2: number): number;
        function isInteger(text: string): boolean;
        function isHexInteger(text: string): boolean;
    }
}
declare module TypeScript {
    interface Iterator<T> {
        moveNext(): boolean;
        current(): T;
    }
}
declare module TypeScript {
    interface ILineAndCharacter {
        line: number;
        character: number;
    }
}
declare module TypeScript {
    class LineMap {
        private _computeLineStarts;
        private length;
        static empty: LineMap;
        private _lineStarts;
        constructor(_computeLineStarts: () => number[], length: number);
        public toJSON(key: any): {
            lineStarts: number[];
            length: number;
        };
        public equals(other: LineMap): boolean;
        public lineStarts(): number[];
        public lineCount(): number;
        public getPosition(line: number, character: number): number;
        public getLineNumberFromPosition(position: number): number;
        public getLineStartPosition(lineNumber: number): number;
        public fillLineAndCharacterFromPosition(position: number, lineAndCharacter: TypeScript.ILineAndCharacter): void;
        public getLineAndCharacterFromPosition(position: number): TypeScript.LineAndCharacter;
    }
}
declare module TypeScript {
    class LineAndCharacter {
        private _line;
        private _character;
        constructor(line: number, character: number);
        public line(): number;
        public character(): number;
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
    enum CharacterCodes {
        nullCharacter = 0,
        maxAsciiCharacter = 127,
        lineFeed = 10,
        carriageReturn = 13,
        lineSeparator = 8232,
        paragraphSeparator = 8233,
        nextLine = 133,
        space = 32,
        nonBreakingSpace = 160,
        enQuad = 8192,
        emQuad = 8193,
        enSpace = 8194,
        emSpace = 8195,
        threePerEmSpace = 8196,
        fourPerEmSpace = 8197,
        sixPerEmSpace = 8198,
        figureSpace = 8199,
        punctuationSpace = 8200,
        thinSpace = 8201,
        hairSpace = 8202,
        zeroWidthSpace = 8203,
        narrowNoBreakSpace = 8239,
        ideographicSpace = 12288,
        _ = 95,
        $ = 36,
        _0 = 48,
        _7 = 55,
        _9 = 57,
        a = 97,
        b = 98,
        c = 99,
        d = 100,
        e = 101,
        f = 102,
        g = 103,
        h = 104,
        i = 105,
        k = 107,
        l = 108,
        m = 109,
        n = 110,
        o = 111,
        p = 112,
        q = 113,
        r = 114,
        s = 115,
        t = 116,
        u = 117,
        v = 118,
        w = 119,
        x = 120,
        y = 121,
        z = 122,
        A = 65,
        E = 69,
        F = 70,
        X = 88,
        Z = 90,
        ampersand = 38,
        asterisk = 42,
        at = 64,
        backslash = 92,
        bar = 124,
        caret = 94,
        closeBrace = 125,
        closeBracket = 93,
        closeParen = 41,
        colon = 58,
        comma = 44,
        dot = 46,
        doubleQuote = 34,
        equals = 61,
        exclamation = 33,
        greaterThan = 62,
        lessThan = 60,
        minus = 45,
        openBrace = 123,
        openBracket = 91,
        openParen = 40,
        percent = 37,
        plus = 43,
        question = 63,
        semicolon = 59,
        singleQuote = 39,
        slash = 47,
        tilde = 126,
        backspace = 8,
        formFeed = 12,
        byteOrderMark = 65279,
        tab = 9,
        verticalTab = 11,
    }
}
declare module TypeScript {
    interface IScriptSnapshot {
        getText(start: number, end: number): string;
        getLength(): number;
        getLineStartPositions(): number[];
        getTextChangeRangeSinceVersion(scriptVersion: number): TypeScript.TextChangeRange;
    }
    module ScriptSnapshot {
        function fromString(text: string): IScriptSnapshot;
    }
}
declare module TypeScript {
    interface ISimpleText {
        length(): number;
        copyTo(sourceIndex: number, destination: number[], destinationIndex: number, count: number): void;
        substr(start: number, length: number, intern: boolean): string;
        subText(span: TypeScript.TextSpan): ISimpleText;
        charCodeAt(index: number): number;
        lineMap(): TypeScript.LineMap;
    }
    interface IText extends ISimpleText {
        lineCount(): number;
        lines(): TypeScript.ITextLine[];
        charCodeAt(position: number): number;
        getLineFromLineNumber(lineNumber: number): TypeScript.ITextLine;
        getLineFromPosition(position: number): TypeScript.ITextLine;
        getLineNumberFromPosition(position: number): number;
        getLinePosition(position: number): TypeScript.LineAndCharacter;
        toString(span?: TypeScript.TextSpan): string;
    }
}
declare module TypeScript {
    interface ITextLine {
        start(): number;
        end(): number;
        endIncludingLineBreak(): number;
        extent(): TypeScript.TextSpan;
        extentIncludingLineBreak(): TypeScript.TextSpan;
        toString(): string;
        lineNumber(): number;
    }
}
declare module TypeScript {
    module LineMap1 {
        function fromSimpleText(text: TypeScript.ISimpleText): TypeScript.LineMap;
        function fromScriptSnapshot(scriptSnapshot: TypeScript.IScriptSnapshot): TypeScript.LineMap;
        function fromString(text: string): TypeScript.LineMap;
    }
}
declare module TypeScript.TextFactory {
    function createText(value: string): TypeScript.IText;
}
declare module TypeScript.SimpleText {
    function fromString(value: string): TypeScript.ISimpleText;
    function fromScriptSnapshot(scriptSnapshot: TypeScript.IScriptSnapshot): TypeScript.ISimpleText;
}
declare module TypeScript.TextUtilities {
    interface ICharacterSequence {
        charCodeAt(index: number): number;
        length: number;
    }
    function parseLineStarts(text: ICharacterSequence): number[];
    function getLengthOfLineBreakSlow(text: ICharacterSequence, index: number, c: number): number;
    function getLengthOfLineBreak(text: ICharacterSequence, index: number): number;
    function isAnyLineBreakCharacter(c: number): boolean;
}
declare module TypeScript {
    class TextSpan {
        private _start;
        private _length;
        constructor(start: number, length: number);
        public start(): number;
        public length(): number;
        public end(): number;
        public isEmpty(): boolean;
        public containsPosition(position: number): boolean;
        public containsTextSpan(span: TextSpan): boolean;
        public overlapsWith(span: TextSpan): boolean;
        public overlap(span: TextSpan): TextSpan;
        public intersectsWithTextSpan(span: TextSpan): boolean;
        public intersectsWith(start: number, length: number): boolean;
        public intersectsWithPosition(position: number): boolean;
        public intersection(span: TextSpan): TextSpan;
        static fromBounds(start: number, end: number): TextSpan;
    }
}
declare module TypeScript {
    class TextChangeRange {
        static unchanged: TextChangeRange;
        private _span;
        private _newLength;
        constructor(span: TypeScript.TextSpan, newLength: number);
        public span(): TypeScript.TextSpan;
        public newLength(): number;
        public newSpan(): TypeScript.TextSpan;
        public isUnchanged(): boolean;
        static collapseChangesFromSingleVersion(changes: TextChangeRange[]): TextChangeRange;
        static collapseChangesAcrossMultipleVersions(changes: TextChangeRange[]): TextChangeRange;
    }
}
declare module TypeScript {
    class CharacterInfo {
        static isDecimalDigit(c: number): boolean;
        static isOctalDigit(c: number): boolean;
        static isHexDigit(c: number): boolean;
        static hexValue(c: number): number;
        static isWhitespace(ch: number): boolean;
        static isLineTerminator(ch: number): boolean;
    }
}
declare module TypeScript {
    enum SyntaxConstants {
        TriviaNewLineMask = 1,
        TriviaCommentMask = 2,
        TriviaFullWidthShift = 2,
        NodeDataComputed = 1,
        NodeIncrementallyUnusableMask = 2,
        NodeParsedInStrictModeMask = 4,
        NodeFullWidthShift = 3,
        IsVariableWidthKeyword,
    }
}
declare class FormattingOptions {
    public useTabs: boolean;
    public spacesPerTab: number;
    public indentSpaces: number;
    public newLineCharacter: string;
    constructor(useTabs: boolean, spacesPerTab: number, indentSpaces: number, newLineCharacter: string);
    static defaultOptions: FormattingOptions;
}
declare module TypeScript.Indentation {
    function columnForEndOfToken(token: TypeScript.ISyntaxToken, syntaxInformationMap: TypeScript.SyntaxInformationMap, options: FormattingOptions): number;
    function columnForStartOfToken(token: TypeScript.ISyntaxToken, syntaxInformationMap: TypeScript.SyntaxInformationMap, options: FormattingOptions): number;
    function columnForStartOfFirstTokenInLineContainingToken(token: TypeScript.ISyntaxToken, syntaxInformationMap: TypeScript.SyntaxInformationMap, options: FormattingOptions): number;
    function columnForPositionInString(input: string, position: number, options: FormattingOptions): number;
    function indentationString(column: number, options: FormattingOptions): string;
    function indentationTrivia(column: number, options: FormattingOptions): TypeScript.ISyntaxTrivia;
    function firstNonWhitespacePosition(value: string): number;
}
declare module TypeScript {
    enum LanguageVersion {
        EcmaScript3 = 0,
        EcmaScript5 = 1,
    }
}
declare module TypeScript {
    class ParseOptions {
        private _languageVersion;
        private _allowAutomaticSemicolonInsertion;
        constructor(languageVersion: TypeScript.LanguageVersion, allowAutomaticSemicolonInsertion: boolean);
        public toJSON(key: any): {
            allowAutomaticSemicolonInsertion: boolean;
        };
        public languageVersion(): TypeScript.LanguageVersion;
        public allowAutomaticSemicolonInsertion(): boolean;
    }
}
declare module TypeScript {
    class PositionedElement {
        private _parent;
        private _element;
        private _fullStart;
        constructor(parent: PositionedElement, element: TypeScript.ISyntaxElement, fullStart: number);
        static create(parent: PositionedElement, element: TypeScript.ISyntaxElement, fullStart: number): PositionedElement;
        public parent(): PositionedElement;
        public parentElement(): TypeScript.ISyntaxElement;
        public element(): TypeScript.ISyntaxElement;
        public kind(): TypeScript.SyntaxKind;
        public childIndex(child: TypeScript.ISyntaxElement): number;
        public childCount(): number;
        public childAt(index: number): PositionedElement;
        public childStart(child: TypeScript.ISyntaxElement): number;
        public childEnd(child: TypeScript.ISyntaxElement): number;
        public childStartAt(index: number): number;
        public childEndAt(index: number): number;
        public getPositionedChild(child: TypeScript.ISyntaxElement): PositionedElement;
        public fullStart(): number;
        public fullEnd(): number;
        public fullWidth(): number;
        public start(): number;
        public end(): number;
        public root(): PositionedNode;
        public containingNode(): PositionedNode;
    }
    class PositionedNodeOrToken extends PositionedElement {
        constructor(parent: PositionedElement, nodeOrToken: TypeScript.ISyntaxNodeOrToken, fullStart: number);
        public nodeOrToken(): TypeScript.ISyntaxNodeOrToken;
    }
    class PositionedNode extends PositionedNodeOrToken {
        constructor(parent: PositionedElement, node: TypeScript.SyntaxNode, fullStart: number);
        public node(): TypeScript.SyntaxNode;
    }
    class PositionedToken extends PositionedNodeOrToken {
        constructor(parent: PositionedElement, token: TypeScript.ISyntaxToken, fullStart: number);
        public token(): TypeScript.ISyntaxToken;
        public previousToken(includeSkippedTokens?: boolean): PositionedToken;
        public nextToken(includeSkippedTokens?: boolean): PositionedToken;
    }
    class PositionedList extends PositionedElement {
        constructor(parent: PositionedElement, list: TypeScript.ISyntaxList, fullStart: number);
        public list(): TypeScript.ISyntaxList;
    }
    class PositionedSeparatedList extends PositionedElement {
        constructor(parent: PositionedElement, list: TypeScript.ISeparatedSyntaxList, fullStart: number);
        public list(): TypeScript.ISeparatedSyntaxList;
    }
    class PositionedSkippedToken extends PositionedToken {
        private _parentToken;
        constructor(parentToken: PositionedToken, token: TypeScript.ISyntaxToken, fullStart: number);
        public parentToken(): PositionedToken;
        public previousToken(includeSkippedTokens?: boolean): PositionedToken;
        public nextToken(includeSkippedTokens?: boolean): PositionedToken;
    }
}
declare module TypeScript {
    enum SyntaxKind {
        None = 0,
        List = 1,
        SeparatedList = 2,
        TriviaList = 3,
        WhitespaceTrivia = 4,
        NewLineTrivia = 5,
        MultiLineCommentTrivia = 6,
        SingleLineCommentTrivia = 7,
        SkippedTokenTrivia = 8,
        ErrorToken = 9,
        EndOfFileToken = 10,
        IdentifierName = 11,
        RegularExpressionLiteral = 12,
        NumericLiteral = 13,
        StringLiteral = 14,
        BreakKeyword = 15,
        CaseKeyword = 16,
        CatchKeyword = 17,
        ContinueKeyword = 18,
        DebuggerKeyword = 19,
        DefaultKeyword = 20,
        DeleteKeyword = 21,
        DoKeyword = 22,
        ElseKeyword = 23,
        FalseKeyword = 24,
        FinallyKeyword = 25,
        ForKeyword = 26,
        FunctionKeyword = 27,
        IfKeyword = 28,
        InKeyword = 29,
        InstanceOfKeyword = 30,
        NewKeyword = 31,
        NullKeyword = 32,
        ReturnKeyword = 33,
        SwitchKeyword = 34,
        ThisKeyword = 35,
        ThrowKeyword = 36,
        TrueKeyword = 37,
        TryKeyword = 38,
        TypeOfKeyword = 39,
        VarKeyword = 40,
        VoidKeyword = 41,
        WhileKeyword = 42,
        WithKeyword = 43,
        ClassKeyword = 44,
        ConstKeyword = 45,
        EnumKeyword = 46,
        ExportKeyword = 47,
        ExtendsKeyword = 48,
        ImportKeyword = 49,
        SuperKeyword = 50,
        ImplementsKeyword = 51,
        InterfaceKeyword = 52,
        LetKeyword = 53,
        PackageKeyword = 54,
        PrivateKeyword = 55,
        ProtectedKeyword = 56,
        PublicKeyword = 57,
        StaticKeyword = 58,
        YieldKeyword = 59,
        AnyKeyword = 60,
        BooleanKeyword = 61,
        ConstructorKeyword = 62,
        DeclareKeyword = 63,
        GetKeyword = 64,
        ModuleKeyword = 65,
        RequireKeyword = 66,
        NumberKeyword = 67,
        SetKeyword = 68,
        StringKeyword = 69,
        OpenBraceToken = 70,
        CloseBraceToken = 71,
        OpenParenToken = 72,
        CloseParenToken = 73,
        OpenBracketToken = 74,
        CloseBracketToken = 75,
        DotToken = 76,
        DotDotDotToken = 77,
        SemicolonToken = 78,
        CommaToken = 79,
        LessThanToken = 80,
        GreaterThanToken = 81,
        LessThanEqualsToken = 82,
        GreaterThanEqualsToken = 83,
        EqualsEqualsToken = 84,
        EqualsGreaterThanToken = 85,
        ExclamationEqualsToken = 86,
        EqualsEqualsEqualsToken = 87,
        ExclamationEqualsEqualsToken = 88,
        PlusToken = 89,
        MinusToken = 90,
        AsteriskToken = 91,
        PercentToken = 92,
        PlusPlusToken = 93,
        MinusMinusToken = 94,
        LessThanLessThanToken = 95,
        GreaterThanGreaterThanToken = 96,
        GreaterThanGreaterThanGreaterThanToken = 97,
        AmpersandToken = 98,
        BarToken = 99,
        CaretToken = 100,
        ExclamationToken = 101,
        TildeToken = 102,
        AmpersandAmpersandToken = 103,
        BarBarToken = 104,
        QuestionToken = 105,
        ColonToken = 106,
        EqualsToken = 107,
        PlusEqualsToken = 108,
        MinusEqualsToken = 109,
        AsteriskEqualsToken = 110,
        PercentEqualsToken = 111,
        LessThanLessThanEqualsToken = 112,
        GreaterThanGreaterThanEqualsToken = 113,
        GreaterThanGreaterThanGreaterThanEqualsToken = 114,
        AmpersandEqualsToken = 115,
        BarEqualsToken = 116,
        CaretEqualsToken = 117,
        SlashToken = 118,
        SlashEqualsToken = 119,
        SourceUnit = 120,
        QualifiedName = 121,
        ObjectType = 122,
        FunctionType = 123,
        ArrayType = 124,
        ConstructorType = 125,
        GenericType = 126,
        TypeQuery = 127,
        InterfaceDeclaration = 128,
        FunctionDeclaration = 129,
        ModuleDeclaration = 130,
        ClassDeclaration = 131,
        EnumDeclaration = 132,
        ImportDeclaration = 133,
        ExportAssignment = 134,
        MemberFunctionDeclaration = 135,
        MemberVariableDeclaration = 136,
        ConstructorDeclaration = 137,
        IndexMemberDeclaration = 138,
        GetAccessor = 139,
        SetAccessor = 140,
        PropertySignature = 141,
        CallSignature = 142,
        ConstructSignature = 143,
        IndexSignature = 144,
        MethodSignature = 145,
        Block = 146,
        IfStatement = 147,
        VariableStatement = 148,
        ExpressionStatement = 149,
        ReturnStatement = 150,
        SwitchStatement = 151,
        BreakStatement = 152,
        ContinueStatement = 153,
        ForStatement = 154,
        ForInStatement = 155,
        EmptyStatement = 156,
        ThrowStatement = 157,
        WhileStatement = 158,
        TryStatement = 159,
        LabeledStatement = 160,
        DoStatement = 161,
        DebuggerStatement = 162,
        WithStatement = 163,
        PlusExpression = 164,
        NegateExpression = 165,
        BitwiseNotExpression = 166,
        LogicalNotExpression = 167,
        PreIncrementExpression = 168,
        PreDecrementExpression = 169,
        DeleteExpression = 170,
        TypeOfExpression = 171,
        VoidExpression = 172,
        CommaExpression = 173,
        AssignmentExpression = 174,
        AddAssignmentExpression = 175,
        SubtractAssignmentExpression = 176,
        MultiplyAssignmentExpression = 177,
        DivideAssignmentExpression = 178,
        ModuloAssignmentExpression = 179,
        AndAssignmentExpression = 180,
        ExclusiveOrAssignmentExpression = 181,
        OrAssignmentExpression = 182,
        LeftShiftAssignmentExpression = 183,
        SignedRightShiftAssignmentExpression = 184,
        UnsignedRightShiftAssignmentExpression = 185,
        ConditionalExpression = 186,
        LogicalOrExpression = 187,
        LogicalAndExpression = 188,
        BitwiseOrExpression = 189,
        BitwiseExclusiveOrExpression = 190,
        BitwiseAndExpression = 191,
        EqualsWithTypeConversionExpression = 192,
        NotEqualsWithTypeConversionExpression = 193,
        EqualsExpression = 194,
        NotEqualsExpression = 195,
        LessThanExpression = 196,
        GreaterThanExpression = 197,
        LessThanOrEqualExpression = 198,
        GreaterThanOrEqualExpression = 199,
        InstanceOfExpression = 200,
        InExpression = 201,
        LeftShiftExpression = 202,
        SignedRightShiftExpression = 203,
        UnsignedRightShiftExpression = 204,
        MultiplyExpression = 205,
        DivideExpression = 206,
        ModuloExpression = 207,
        AddExpression = 208,
        SubtractExpression = 209,
        PostIncrementExpression = 210,
        PostDecrementExpression = 211,
        MemberAccessExpression = 212,
        InvocationExpression = 213,
        ArrayLiteralExpression = 214,
        ObjectLiteralExpression = 215,
        ObjectCreationExpression = 216,
        ParenthesizedExpression = 217,
        ParenthesizedArrowFunctionExpression = 218,
        SimpleArrowFunctionExpression = 219,
        CastExpression = 220,
        ElementAccessExpression = 221,
        FunctionExpression = 222,
        OmittedExpression = 223,
        VariableDeclaration = 224,
        VariableDeclarator = 225,
        ArgumentList = 226,
        ParameterList = 227,
        TypeArgumentList = 228,
        TypeParameterList = 229,
        ExtendsHeritageClause = 230,
        ImplementsHeritageClause = 231,
        EqualsValueClause = 232,
        CaseSwitchClause = 233,
        DefaultSwitchClause = 234,
        ElseClause = 235,
        CatchClause = 236,
        FinallyClause = 237,
        TypeParameter = 238,
        Constraint = 239,
        SimplePropertyAssignment = 240,
        FunctionPropertyAssignment = 241,
        Parameter = 242,
        EnumElement = 243,
        TypeAnnotation = 244,
        ExternalModuleReference = 245,
        ModuleNameModuleReference = 246,
        Last,
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
        FirstTrivia,
        LastTrivia,
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
    function getOperatorTokenFromBinaryExpression(tokenKind: TypeScript.SyntaxKind): TypeScript.SyntaxKind;
    function isAnyDivideToken(kind: TypeScript.SyntaxKind): boolean;
    function isAnyDivideOrRegularExpressionToken(kind: TypeScript.SyntaxKind): boolean;
}
declare module TypeScript {
    class Scanner implements TypeScript.ISlidingWindowSource {
        private slidingWindow;
        private fileName;
        private text;
        private _languageVersion;
        constructor(fileName: string, text: TypeScript.ISimpleText, languageVersion: TypeScript.LanguageVersion, window?: number[]);
        public languageVersion(): TypeScript.LanguageVersion;
        public fetchMoreItems(argument: any, sourceIndex: number, window: number[], destinationIndex: number, spaceAvailable: number): number;
        private currentCharCode();
        public absoluteIndex(): number;
        public setAbsoluteIndex(index: number): void;
        public scan(diagnostics: TypeScript.Diagnostic[], allowRegularExpression: boolean): TypeScript.ISyntaxToken;
        private createToken(fullStart, leadingTriviaInfo, start, kind, end, trailingTriviaInfo, isVariableWidthKeyword);
        private static triviaWindow;
        static scanTrivia(text: TypeScript.ISimpleText, start: number, length: number, isTrailing: boolean): TypeScript.ISyntaxTriviaList;
        private scanTrivia(underlyingText, underlyingTextStart, isTrailing);
        private scanTriviaInfo(diagnostics, isTrailing);
        private isNewLineCharacter(ch);
        private scanWhitespaceTrivia(underlyingText, underlyingTextStart);
        private scanSingleLineCommentTrivia(underlyingText, underlyingTextStart);
        private scanSingleLineCommentTriviaLength();
        private scanMultiLineCommentTrivia(underlyingText, underlyingTextStart);
        private scanMultiLineCommentTriviaLength(diagnostics);
        private scanLineTerminatorSequenceTrivia(ch);
        private scanLineTerminatorSequenceLength(ch);
        private scanSyntaxToken(diagnostics, allowRegularExpression);
        private isIdentifierStart(interpretedChar);
        private isIdentifierPart(interpretedChar);
        private tryFastScanIdentifierOrKeyword(firstCharacter);
        private slowScanIdentifierOrKeyword(diagnostics);
        private scanNumericLiteral(diagnostics);
        private isOctalNumericLiteral();
        private scanOctalNumericLiteral(diagnostics);
        private scanDecimalDigits();
        private scanDecimalNumericLiteral();
        private scanHexNumericLiteral();
        private isHexNumericLiteral();
        private advanceAndSetTokenKind(kind);
        private scanLessThanToken();
        private scanBarToken();
        private scanCaretToken();
        private scanAmpersandToken();
        private scanPercentToken();
        private scanMinusToken();
        private scanPlusToken();
        private scanAsteriskToken();
        private scanEqualsToken();
        private isDotPrefixedNumericLiteral();
        private scanDotToken(diagnostics);
        private scanSlashToken(allowRegularExpression);
        private tryScanRegularExpressionToken();
        private scanExclamationToken();
        private scanDefaultCharacter(character, diagnostics);
        private getErrorMessageText(text);
        private skipEscapeSequence(diagnostics);
        private scanStringLiteral(diagnostics);
        private isUnicodeEscape(character);
        private peekCharOrUnicodeEscape();
        private peekUnicodeOrHexEscape();
        private scanCharOrUnicodeEscape(errors);
        private scanUnicodeOrHexEscape(errors);
        public substring(start: number, end: number, intern: boolean): string;
        private createIllegalEscapeDiagnostic(start, end);
        static isValidIdentifier(text: TypeScript.ISimpleText, languageVersion: TypeScript.LanguageVersion): boolean;
    }
}
declare module TypeScript {
    class ScannerUtilities {
        static identifierKind(array: number[], startIndex: number, length: number): TypeScript.SyntaxKind;
    }
}
declare module TypeScript {
    interface ISeparatedSyntaxList extends TypeScript.ISyntaxElement {
        childAt(index: number): TypeScript.ISyntaxNodeOrToken;
        toArray(): TypeScript.ISyntaxNodeOrToken[];
        toNonSeparatorArray(): TypeScript.ISyntaxNodeOrToken[];
        separatorCount(): number;
        separatorAt(index: number): TypeScript.ISyntaxToken;
        nonSeparatorCount(): number;
        nonSeparatorAt(index: number): TypeScript.ISyntaxNodeOrToken;
        insertChildrenInto(array: TypeScript.ISyntaxElement[], index: number): void;
    }
}
declare module TypeScript.Syntax {
    var emptySeparatedList: TypeScript.ISeparatedSyntaxList;
    function separatedList(nodes: TypeScript.ISyntaxNodeOrToken[]): TypeScript.ISeparatedSyntaxList;
}
declare module TypeScript {
    interface ISlidingWindowSource {
        fetchMoreItems(argument: any, sourceIndex: number, window: any[], destinationIndex: number, spaceAvailable: number): number;
    }
    class SlidingWindow {
        private source;
        public window: any[];
        private defaultValue;
        private sourceLength;
        public windowCount: number;
        public windowAbsoluteStartIndex: number;
        public currentRelativeItemIndex: number;
        private _pinCount;
        private firstPinnedAbsoluteIndex;
        constructor(source: ISlidingWindowSource, window: any[], defaultValue: any, sourceLength?: number);
        private windowAbsoluteEndIndex();
        private addMoreItemsToWindow(argument);
        private tryShiftOrGrowWindow();
        public absoluteIndex(): number;
        public isAtEndOfSource(): boolean;
        public getAndPinAbsoluteIndex(): number;
        public releaseAndUnpinAbsoluteIndex(absoluteIndex: number): void;
        public rewindToPinnedIndex(absoluteIndex: number): void;
        public currentItem(argument: any): any;
        public peekItemN(n: number): any;
        public moveToNextItem(): void;
        public disgardAllItemsFromCurrentIndexOnwards(): void;
        public setAbsoluteIndex(absoluteIndex: number): void;
        public pinCount(): number;
    }
}
declare module TypeScript {
}
declare module TypeScript.Syntax {
    function emptySourceUnit(): TypeScript.SourceUnitSyntax;
    function getStandaloneExpression(positionedToken: TypeScript.PositionedToken): TypeScript.PositionedNodeOrToken;
    function isInModuleOrTypeContext(positionedToken: TypeScript.PositionedToken): boolean;
    function isInTypeOnlyContext(positionedToken: TypeScript.PositionedToken): boolean;
    function childOffset(parent: TypeScript.ISyntaxElement, child: TypeScript.ISyntaxElement): number;
    function childOffsetAt(parent: TypeScript.ISyntaxElement, index: number): number;
    function childIndex(parent: TypeScript.ISyntaxElement, child: TypeScript.ISyntaxElement): number;
    function nodeStructuralEquals(node1: TypeScript.SyntaxNode, node2: TypeScript.SyntaxNode): boolean;
    function nodeOrTokenStructuralEquals(node1: TypeScript.ISyntaxNodeOrToken, node2: TypeScript.ISyntaxNodeOrToken): boolean;
    function tokenStructuralEquals(token1: TypeScript.ISyntaxToken, token2: TypeScript.ISyntaxToken): boolean;
    function triviaListStructuralEquals(triviaList1: TypeScript.ISyntaxTriviaList, triviaList2: TypeScript.ISyntaxTriviaList): boolean;
    function triviaStructuralEquals(trivia1: TypeScript.ISyntaxTrivia, trivia2: TypeScript.ISyntaxTrivia): boolean;
    function listStructuralEquals(list1: TypeScript.ISyntaxList, list2: TypeScript.ISyntaxList): boolean;
    function separatedListStructuralEquals(list1: TypeScript.ISeparatedSyntaxList, list2: TypeScript.ISeparatedSyntaxList): boolean;
    function elementStructuralEquals(element1: TypeScript.ISyntaxElement, element2: TypeScript.ISyntaxElement): boolean;
    function identifierName(text: string, info?: TypeScript.ITokenInfo): TypeScript.ISyntaxToken;
    function trueExpression(): TypeScript.IUnaryExpressionSyntax;
    function falseExpression(): TypeScript.IUnaryExpressionSyntax;
    function numericLiteralExpression(text: string): TypeScript.IUnaryExpressionSyntax;
    function stringLiteralExpression(text: string): TypeScript.IUnaryExpressionSyntax;
    function isSuperInvocationExpression(node: TypeScript.IExpressionSyntax): boolean;
    function isSuperInvocationExpressionStatement(node: TypeScript.SyntaxNode): boolean;
    function isSuperMemberAccessExpression(node: TypeScript.IExpressionSyntax): boolean;
    function isSuperMemberAccessInvocationExpression(node: TypeScript.SyntaxNode): boolean;
    function assignmentExpression(left: TypeScript.IExpressionSyntax, token: TypeScript.ISyntaxToken, right: TypeScript.IExpressionSyntax): TypeScript.BinaryExpressionSyntax;
    function nodeHasSkippedOrMissingTokens(node: TypeScript.SyntaxNode): boolean;
    function isUnterminatedStringLiteral(token: TypeScript.ISyntaxToken): boolean;
    function isUnterminatedMultilineCommentTrivia(trivia: TypeScript.ISyntaxTrivia): boolean;
    function isEntirelyInsideCommentTrivia(trivia: TypeScript.ISyntaxTrivia, fullStart: number, position: number): boolean;
    function isEntirelyInsideComment(sourceUnit: TypeScript.SourceUnitSyntax, position: number): boolean;
    function isEntirelyInStringOrRegularExpressionLiteral(sourceUnit: TypeScript.SourceUnitSyntax, position: number): boolean;
    function findSkippedTokenInLeadingTriviaList(positionedToken: TypeScript.PositionedToken, position: number): TypeScript.PositionedSkippedToken;
    function findSkippedTokenInTrailingTriviaList(positionedToken: TypeScript.PositionedToken, position: number): TypeScript.PositionedSkippedToken;
    function findSkippedTokenInPositionedToken(positionedToken: TypeScript.PositionedToken, position: number): TypeScript.PositionedSkippedToken;
    function findSkippedTokenOnLeft(positionedToken: TypeScript.PositionedToken, position: number): TypeScript.PositionedSkippedToken;
    function getAncestorOfKind(positionedToken: TypeScript.PositionedElement, kind: TypeScript.SyntaxKind): TypeScript.PositionedElement;
    function hasAncestorOfKind(positionedToken: TypeScript.PositionedElement, kind: TypeScript.SyntaxKind): boolean;
    function isIntegerLiteral(expression: TypeScript.IExpressionSyntax): boolean;
}
declare module TypeScript {
    interface ISyntaxElement {
        kind(): TypeScript.SyntaxKind;
        isNode(): boolean;
        isToken(): boolean;
        isList(): boolean;
        isSeparatedList(): boolean;
        childCount(): number;
        childAt(index: number): ISyntaxElement;
        isTypeScriptSpecific(): boolean;
        isIncrementallyUnusable(): boolean;
        fullWidth(): number;
        width(): number;
        fullText(): string;
        leadingTrivia(): TypeScript.ISyntaxTriviaList;
        trailingTrivia(): TypeScript.ISyntaxTriviaList;
        leadingTriviaWidth(): number;
        trailingTriviaWidth(): number;
        firstToken(): TypeScript.ISyntaxToken;
        lastToken(): TypeScript.ISyntaxToken;
        collectTextElements(elements: string[]): void;
    }
    interface ISyntaxNode extends TypeScript.ISyntaxNodeOrToken {
    }
    interface IModuleReferenceSyntax extends ISyntaxNode {
        isModuleReference(): boolean;
    }
    interface IModuleElementSyntax extends ISyntaxNode {
    }
    interface IStatementSyntax extends IModuleElementSyntax {
        isStatement(): boolean;
    }
    interface IIterationStatementSyntax extends IStatementSyntax {
        isIterationStatement(): boolean;
    }
    interface ITypeMemberSyntax extends ISyntaxNode {
    }
    interface IClassElementSyntax extends ISyntaxNode {
    }
    interface IMemberDeclarationSyntax extends IClassElementSyntax {
    }
    interface IPropertyAssignmentSyntax extends IClassElementSyntax {
    }
    interface ISwitchClauseSyntax extends ISyntaxNode {
        isSwitchClause(): boolean;
        statements: TypeScript.ISyntaxList;
    }
    interface IExpressionSyntax extends TypeScript.ISyntaxNodeOrToken {
        isExpression(): boolean;
        withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): IExpressionSyntax;
        withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): IExpressionSyntax;
    }
    interface IUnaryExpressionSyntax extends IExpressionSyntax {
        isUnaryExpression(): boolean;
    }
    interface IArrowFunctionExpressionSyntax extends IUnaryExpressionSyntax {
        isArrowFunctionExpression(): boolean;
        equalsGreaterThanToken: TypeScript.ISyntaxToken;
        block: TypeScript.BlockSyntax;
        expression: IExpressionSyntax;
    }
    interface IPostfixExpressionSyntax extends IUnaryExpressionSyntax {
        isPostfixExpression(): boolean;
    }
    interface IMemberExpressionSyntax extends IPostfixExpressionSyntax {
        isMemberExpression(): boolean;
    }
    interface IPrimaryExpressionSyntax extends IMemberExpressionSyntax {
        isPrimaryExpression(): boolean;
    }
    interface ITypeSyntax extends TypeScript.ISyntaxNodeOrToken {
    }
    interface INameSyntax extends ITypeSyntax {
    }
}
declare module TypeScript.Syntax {
    interface IFactory {
        sourceUnit(moduleElements: TypeScript.ISyntaxList, endOfFileToken: TypeScript.ISyntaxToken): TypeScript.SourceUnitSyntax;
        externalModuleReference(requireKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, stringLiteral: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ExternalModuleReferenceSyntax;
        moduleNameModuleReference(moduleName: TypeScript.INameSyntax): TypeScript.ModuleNameModuleReferenceSyntax;
        importDeclaration(modifiers: TypeScript.ISyntaxList, importKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, moduleReference: TypeScript.IModuleReferenceSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ImportDeclarationSyntax;
        exportAssignment(exportKeyword: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ExportAssignmentSyntax;
        classDeclaration(modifiers: TypeScript.ISyntaxList, classKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, openBraceToken: TypeScript.ISyntaxToken, classElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ClassDeclarationSyntax;
        interfaceDeclaration(modifiers: TypeScript.ISyntaxList, interfaceKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, body: TypeScript.ObjectTypeSyntax): TypeScript.InterfaceDeclarationSyntax;
        heritageClause(kind: TypeScript.SyntaxKind, extendsOrImplementsKeyword: TypeScript.ISyntaxToken, typeNames: TypeScript.ISeparatedSyntaxList): TypeScript.HeritageClauseSyntax;
        moduleDeclaration(modifiers: TypeScript.ISyntaxList, moduleKeyword: TypeScript.ISyntaxToken, name: TypeScript.INameSyntax, stringLiteral: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, moduleElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ModuleDeclarationSyntax;
        functionDeclaration(modifiers: TypeScript.ISyntaxList, functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.FunctionDeclarationSyntax;
        variableStatement(modifiers: TypeScript.ISyntaxList, variableDeclaration: TypeScript.VariableDeclarationSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.VariableStatementSyntax;
        variableDeclaration(varKeyword: TypeScript.ISyntaxToken, variableDeclarators: TypeScript.ISeparatedSyntaxList): TypeScript.VariableDeclarationSyntax;
        variableDeclarator(propertyName: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.VariableDeclaratorSyntax;
        equalsValueClause(equalsToken: TypeScript.ISyntaxToken, value: TypeScript.IExpressionSyntax): TypeScript.EqualsValueClauseSyntax;
        prefixUnaryExpression(kind: TypeScript.SyntaxKind, operatorToken: TypeScript.ISyntaxToken, operand: TypeScript.IUnaryExpressionSyntax): TypeScript.PrefixUnaryExpressionSyntax;
        arrayLiteralExpression(openBracketToken: TypeScript.ISyntaxToken, expressions: TypeScript.ISeparatedSyntaxList, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ArrayLiteralExpressionSyntax;
        omittedExpression(): TypeScript.OmittedExpressionSyntax;
        parenthesizedExpression(openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ParenthesizedExpressionSyntax;
        simpleArrowFunctionExpression(identifier: TypeScript.ISyntaxToken, equalsGreaterThanToken: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax, expression: TypeScript.IExpressionSyntax): TypeScript.SimpleArrowFunctionExpressionSyntax;
        parenthesizedArrowFunctionExpression(callSignature: TypeScript.CallSignatureSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax, expression: TypeScript.IExpressionSyntax): TypeScript.ParenthesizedArrowFunctionExpressionSyntax;
        qualifiedName(left: TypeScript.INameSyntax, dotToken: TypeScript.ISyntaxToken, right: TypeScript.ISyntaxToken): TypeScript.QualifiedNameSyntax;
        typeArgumentList(lessThanToken: TypeScript.ISyntaxToken, typeArguments: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken): TypeScript.TypeArgumentListSyntax;
        constructorType(newKeyword: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.ConstructorTypeSyntax;
        functionType(typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.FunctionTypeSyntax;
        objectType(openBraceToken: TypeScript.ISyntaxToken, typeMembers: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ObjectTypeSyntax;
        arrayType(type: TypeScript.ITypeSyntax, openBracketToken: TypeScript.ISyntaxToken, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ArrayTypeSyntax;
        genericType(name: TypeScript.INameSyntax, typeArgumentList: TypeScript.TypeArgumentListSyntax): TypeScript.GenericTypeSyntax;
        typeQuery(typeOfKeyword: TypeScript.ISyntaxToken, name: TypeScript.INameSyntax): TypeScript.TypeQuerySyntax;
        typeAnnotation(colonToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.TypeAnnotationSyntax;
        block(openBraceToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.BlockSyntax;
        parameter(dotDotDotToken: TypeScript.ISyntaxToken, modifiers: TypeScript.ISyntaxList, identifier: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.ParameterSyntax;
        memberAccessExpression(expression: TypeScript.IExpressionSyntax, dotToken: TypeScript.ISyntaxToken, name: TypeScript.ISyntaxToken): TypeScript.MemberAccessExpressionSyntax;
        postfixUnaryExpression(kind: TypeScript.SyntaxKind, operand: TypeScript.IMemberExpressionSyntax, operatorToken: TypeScript.ISyntaxToken): TypeScript.PostfixUnaryExpressionSyntax;
        elementAccessExpression(expression: TypeScript.IExpressionSyntax, openBracketToken: TypeScript.ISyntaxToken, argumentExpression: TypeScript.IExpressionSyntax, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ElementAccessExpressionSyntax;
        invocationExpression(expression: TypeScript.IMemberExpressionSyntax, argumentList: TypeScript.ArgumentListSyntax): TypeScript.InvocationExpressionSyntax;
        argumentList(typeArgumentList: TypeScript.TypeArgumentListSyntax, openParenToken: TypeScript.ISyntaxToken, arguments: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ArgumentListSyntax;
        binaryExpression(kind: TypeScript.SyntaxKind, left: TypeScript.IExpressionSyntax, operatorToken: TypeScript.ISyntaxToken, right: TypeScript.IExpressionSyntax): TypeScript.BinaryExpressionSyntax;
        conditionalExpression(condition: TypeScript.IExpressionSyntax, questionToken: TypeScript.ISyntaxToken, whenTrue: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, whenFalse: TypeScript.IExpressionSyntax): TypeScript.ConditionalExpressionSyntax;
        constructSignature(newKeyword: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax): TypeScript.ConstructSignatureSyntax;
        methodSignature(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax): TypeScript.MethodSignatureSyntax;
        indexSignature(openBracketToken: TypeScript.ISyntaxToken, parameter: TypeScript.ParameterSyntax, closeBracketToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.IndexSignatureSyntax;
        propertySignature(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.PropertySignatureSyntax;
        callSignature(typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.CallSignatureSyntax;
        parameterList(openParenToken: TypeScript.ISyntaxToken, parameters: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ParameterListSyntax;
        typeParameterList(lessThanToken: TypeScript.ISyntaxToken, typeParameters: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken): TypeScript.TypeParameterListSyntax;
        typeParameter(identifier: TypeScript.ISyntaxToken, constraint: TypeScript.ConstraintSyntax): TypeScript.TypeParameterSyntax;
        constraint(extendsKeyword: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.ConstraintSyntax;
        elseClause(elseKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ElseClauseSyntax;
        ifStatement(ifKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, elseClause: TypeScript.ElseClauseSyntax): TypeScript.IfStatementSyntax;
        expressionStatement(expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ExpressionStatementSyntax;
        constructorDeclaration(modifiers: TypeScript.ISyntaxList, constructorKeyword: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ConstructorDeclarationSyntax;
        memberFunctionDeclaration(modifiers: TypeScript.ISyntaxList, propertyName: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.MemberFunctionDeclarationSyntax;
        getAccessor(modifiers: TypeScript.ISyntaxList, getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, typeAnnotation: TypeScript.TypeAnnotationSyntax, block: TypeScript.BlockSyntax): TypeScript.GetAccessorSyntax;
        setAccessor(modifiers: TypeScript.ISyntaxList, setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, block: TypeScript.BlockSyntax): TypeScript.SetAccessorSyntax;
        memberVariableDeclaration(modifiers: TypeScript.ISyntaxList, variableDeclarator: TypeScript.VariableDeclaratorSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.MemberVariableDeclarationSyntax;
        indexMemberDeclaration(modifiers: TypeScript.ISyntaxList, indexSignature: TypeScript.IndexSignatureSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.IndexMemberDeclarationSyntax;
        throwStatement(throwKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ThrowStatementSyntax;
        returnStatement(returnKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ReturnStatementSyntax;
        objectCreationExpression(newKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IMemberExpressionSyntax, argumentList: TypeScript.ArgumentListSyntax): TypeScript.ObjectCreationExpressionSyntax;
        switchStatement(switchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, switchClauses: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.SwitchStatementSyntax;
        caseSwitchClause(caseKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList): TypeScript.CaseSwitchClauseSyntax;
        defaultSwitchClause(defaultKeyword: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList): TypeScript.DefaultSwitchClauseSyntax;
        breakStatement(breakKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.BreakStatementSyntax;
        continueStatement(continueKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ContinueStatementSyntax;
        forStatement(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: TypeScript.VariableDeclarationSyntax, initializer: TypeScript.IExpressionSyntax, firstSemicolonToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, secondSemicolonToken: TypeScript.ISyntaxToken, incrementor: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ForStatementSyntax;
        forInStatement(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: TypeScript.VariableDeclarationSyntax, left: TypeScript.IExpressionSyntax, inKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ForInStatementSyntax;
        whileStatement(whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.WhileStatementSyntax;
        withStatement(withKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.WithStatementSyntax;
        enumDeclaration(modifiers: TypeScript.ISyntaxList, enumKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, enumElements: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.EnumDeclarationSyntax;
        enumElement(propertyName: TypeScript.ISyntaxToken, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.EnumElementSyntax;
        castExpression(lessThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, greaterThanToken: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): TypeScript.CastExpressionSyntax;
        objectLiteralExpression(openBraceToken: TypeScript.ISyntaxToken, propertyAssignments: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ObjectLiteralExpressionSyntax;
        simplePropertyAssignment(propertyName: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): TypeScript.SimplePropertyAssignmentSyntax;
        functionPropertyAssignment(propertyName: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax): TypeScript.FunctionPropertyAssignmentSyntax;
        functionExpression(functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax): TypeScript.FunctionExpressionSyntax;
        emptyStatement(semicolonToken: TypeScript.ISyntaxToken): TypeScript.EmptyStatementSyntax;
        tryStatement(tryKeyword: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax, catchClause: TypeScript.CatchClauseSyntax, finallyClause: TypeScript.FinallyClauseSyntax): TypeScript.TryStatementSyntax;
        catchClause(catchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, closeParenToken: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax): TypeScript.CatchClauseSyntax;
        finallyClause(finallyKeyword: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax): TypeScript.FinallyClauseSyntax;
        labeledStatement(identifier: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.LabeledStatementSyntax;
        doStatement(doKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.DoStatementSyntax;
        typeOfExpression(typeOfKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): TypeScript.TypeOfExpressionSyntax;
        deleteExpression(deleteKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): TypeScript.DeleteExpressionSyntax;
        voidExpression(voidKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): TypeScript.VoidExpressionSyntax;
        debuggerStatement(debuggerKeyword: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.DebuggerStatementSyntax;
    }
    class NormalModeFactory implements IFactory {
        public sourceUnit(moduleElements: TypeScript.ISyntaxList, endOfFileToken: TypeScript.ISyntaxToken): TypeScript.SourceUnitSyntax;
        public externalModuleReference(requireKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, stringLiteral: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ExternalModuleReferenceSyntax;
        public moduleNameModuleReference(moduleName: TypeScript.INameSyntax): TypeScript.ModuleNameModuleReferenceSyntax;
        public importDeclaration(modifiers: TypeScript.ISyntaxList, importKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, moduleReference: TypeScript.IModuleReferenceSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ImportDeclarationSyntax;
        public exportAssignment(exportKeyword: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ExportAssignmentSyntax;
        public classDeclaration(modifiers: TypeScript.ISyntaxList, classKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, openBraceToken: TypeScript.ISyntaxToken, classElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ClassDeclarationSyntax;
        public interfaceDeclaration(modifiers: TypeScript.ISyntaxList, interfaceKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, body: TypeScript.ObjectTypeSyntax): TypeScript.InterfaceDeclarationSyntax;
        public heritageClause(kind: TypeScript.SyntaxKind, extendsOrImplementsKeyword: TypeScript.ISyntaxToken, typeNames: TypeScript.ISeparatedSyntaxList): TypeScript.HeritageClauseSyntax;
        public moduleDeclaration(modifiers: TypeScript.ISyntaxList, moduleKeyword: TypeScript.ISyntaxToken, name: TypeScript.INameSyntax, stringLiteral: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, moduleElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ModuleDeclarationSyntax;
        public functionDeclaration(modifiers: TypeScript.ISyntaxList, functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.FunctionDeclarationSyntax;
        public variableStatement(modifiers: TypeScript.ISyntaxList, variableDeclaration: TypeScript.VariableDeclarationSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.VariableStatementSyntax;
        public variableDeclaration(varKeyword: TypeScript.ISyntaxToken, variableDeclarators: TypeScript.ISeparatedSyntaxList): TypeScript.VariableDeclarationSyntax;
        public variableDeclarator(propertyName: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.VariableDeclaratorSyntax;
        public equalsValueClause(equalsToken: TypeScript.ISyntaxToken, value: TypeScript.IExpressionSyntax): TypeScript.EqualsValueClauseSyntax;
        public prefixUnaryExpression(kind: TypeScript.SyntaxKind, operatorToken: TypeScript.ISyntaxToken, operand: TypeScript.IUnaryExpressionSyntax): TypeScript.PrefixUnaryExpressionSyntax;
        public arrayLiteralExpression(openBracketToken: TypeScript.ISyntaxToken, expressions: TypeScript.ISeparatedSyntaxList, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ArrayLiteralExpressionSyntax;
        public omittedExpression(): TypeScript.OmittedExpressionSyntax;
        public parenthesizedExpression(openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ParenthesizedExpressionSyntax;
        public simpleArrowFunctionExpression(identifier: TypeScript.ISyntaxToken, equalsGreaterThanToken: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax, expression: TypeScript.IExpressionSyntax): TypeScript.SimpleArrowFunctionExpressionSyntax;
        public parenthesizedArrowFunctionExpression(callSignature: TypeScript.CallSignatureSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax, expression: TypeScript.IExpressionSyntax): TypeScript.ParenthesizedArrowFunctionExpressionSyntax;
        public qualifiedName(left: TypeScript.INameSyntax, dotToken: TypeScript.ISyntaxToken, right: TypeScript.ISyntaxToken): TypeScript.QualifiedNameSyntax;
        public typeArgumentList(lessThanToken: TypeScript.ISyntaxToken, typeArguments: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken): TypeScript.TypeArgumentListSyntax;
        public constructorType(newKeyword: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.ConstructorTypeSyntax;
        public functionType(typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.FunctionTypeSyntax;
        public objectType(openBraceToken: TypeScript.ISyntaxToken, typeMembers: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ObjectTypeSyntax;
        public arrayType(type: TypeScript.ITypeSyntax, openBracketToken: TypeScript.ISyntaxToken, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ArrayTypeSyntax;
        public genericType(name: TypeScript.INameSyntax, typeArgumentList: TypeScript.TypeArgumentListSyntax): TypeScript.GenericTypeSyntax;
        public typeQuery(typeOfKeyword: TypeScript.ISyntaxToken, name: TypeScript.INameSyntax): TypeScript.TypeQuerySyntax;
        public typeAnnotation(colonToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.TypeAnnotationSyntax;
        public block(openBraceToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.BlockSyntax;
        public parameter(dotDotDotToken: TypeScript.ISyntaxToken, modifiers: TypeScript.ISyntaxList, identifier: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.ParameterSyntax;
        public memberAccessExpression(expression: TypeScript.IExpressionSyntax, dotToken: TypeScript.ISyntaxToken, name: TypeScript.ISyntaxToken): TypeScript.MemberAccessExpressionSyntax;
        public postfixUnaryExpression(kind: TypeScript.SyntaxKind, operand: TypeScript.IMemberExpressionSyntax, operatorToken: TypeScript.ISyntaxToken): TypeScript.PostfixUnaryExpressionSyntax;
        public elementAccessExpression(expression: TypeScript.IExpressionSyntax, openBracketToken: TypeScript.ISyntaxToken, argumentExpression: TypeScript.IExpressionSyntax, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ElementAccessExpressionSyntax;
        public invocationExpression(expression: TypeScript.IMemberExpressionSyntax, argumentList: TypeScript.ArgumentListSyntax): TypeScript.InvocationExpressionSyntax;
        public argumentList(typeArgumentList: TypeScript.TypeArgumentListSyntax, openParenToken: TypeScript.ISyntaxToken, _arguments: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ArgumentListSyntax;
        public binaryExpression(kind: TypeScript.SyntaxKind, left: TypeScript.IExpressionSyntax, operatorToken: TypeScript.ISyntaxToken, right: TypeScript.IExpressionSyntax): TypeScript.BinaryExpressionSyntax;
        public conditionalExpression(condition: TypeScript.IExpressionSyntax, questionToken: TypeScript.ISyntaxToken, whenTrue: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, whenFalse: TypeScript.IExpressionSyntax): TypeScript.ConditionalExpressionSyntax;
        public constructSignature(newKeyword: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax): TypeScript.ConstructSignatureSyntax;
        public methodSignature(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax): TypeScript.MethodSignatureSyntax;
        public indexSignature(openBracketToken: TypeScript.ISyntaxToken, parameter: TypeScript.ParameterSyntax, closeBracketToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.IndexSignatureSyntax;
        public propertySignature(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.PropertySignatureSyntax;
        public callSignature(typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.CallSignatureSyntax;
        public parameterList(openParenToken: TypeScript.ISyntaxToken, parameters: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ParameterListSyntax;
        public typeParameterList(lessThanToken: TypeScript.ISyntaxToken, typeParameters: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken): TypeScript.TypeParameterListSyntax;
        public typeParameter(identifier: TypeScript.ISyntaxToken, constraint: TypeScript.ConstraintSyntax): TypeScript.TypeParameterSyntax;
        public constraint(extendsKeyword: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.ConstraintSyntax;
        public elseClause(elseKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ElseClauseSyntax;
        public ifStatement(ifKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, elseClause: TypeScript.ElseClauseSyntax): TypeScript.IfStatementSyntax;
        public expressionStatement(expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ExpressionStatementSyntax;
        public constructorDeclaration(modifiers: TypeScript.ISyntaxList, constructorKeyword: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ConstructorDeclarationSyntax;
        public memberFunctionDeclaration(modifiers: TypeScript.ISyntaxList, propertyName: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.MemberFunctionDeclarationSyntax;
        public getAccessor(modifiers: TypeScript.ISyntaxList, getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, typeAnnotation: TypeScript.TypeAnnotationSyntax, block: TypeScript.BlockSyntax): TypeScript.GetAccessorSyntax;
        public setAccessor(modifiers: TypeScript.ISyntaxList, setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, block: TypeScript.BlockSyntax): TypeScript.SetAccessorSyntax;
        public memberVariableDeclaration(modifiers: TypeScript.ISyntaxList, variableDeclarator: TypeScript.VariableDeclaratorSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.MemberVariableDeclarationSyntax;
        public indexMemberDeclaration(modifiers: TypeScript.ISyntaxList, indexSignature: TypeScript.IndexSignatureSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.IndexMemberDeclarationSyntax;
        public throwStatement(throwKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ThrowStatementSyntax;
        public returnStatement(returnKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ReturnStatementSyntax;
        public objectCreationExpression(newKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IMemberExpressionSyntax, argumentList: TypeScript.ArgumentListSyntax): TypeScript.ObjectCreationExpressionSyntax;
        public switchStatement(switchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, switchClauses: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.SwitchStatementSyntax;
        public caseSwitchClause(caseKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList): TypeScript.CaseSwitchClauseSyntax;
        public defaultSwitchClause(defaultKeyword: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList): TypeScript.DefaultSwitchClauseSyntax;
        public breakStatement(breakKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.BreakStatementSyntax;
        public continueStatement(continueKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ContinueStatementSyntax;
        public forStatement(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: TypeScript.VariableDeclarationSyntax, initializer: TypeScript.IExpressionSyntax, firstSemicolonToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, secondSemicolonToken: TypeScript.ISyntaxToken, incrementor: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ForStatementSyntax;
        public forInStatement(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: TypeScript.VariableDeclarationSyntax, left: TypeScript.IExpressionSyntax, inKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ForInStatementSyntax;
        public whileStatement(whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.WhileStatementSyntax;
        public withStatement(withKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.WithStatementSyntax;
        public enumDeclaration(modifiers: TypeScript.ISyntaxList, enumKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, enumElements: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.EnumDeclarationSyntax;
        public enumElement(propertyName: TypeScript.ISyntaxToken, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.EnumElementSyntax;
        public castExpression(lessThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, greaterThanToken: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): TypeScript.CastExpressionSyntax;
        public objectLiteralExpression(openBraceToken: TypeScript.ISyntaxToken, propertyAssignments: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ObjectLiteralExpressionSyntax;
        public simplePropertyAssignment(propertyName: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): TypeScript.SimplePropertyAssignmentSyntax;
        public functionPropertyAssignment(propertyName: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax): TypeScript.FunctionPropertyAssignmentSyntax;
        public functionExpression(functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax): TypeScript.FunctionExpressionSyntax;
        public emptyStatement(semicolonToken: TypeScript.ISyntaxToken): TypeScript.EmptyStatementSyntax;
        public tryStatement(tryKeyword: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax, catchClause: TypeScript.CatchClauseSyntax, finallyClause: TypeScript.FinallyClauseSyntax): TypeScript.TryStatementSyntax;
        public catchClause(catchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, closeParenToken: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax): TypeScript.CatchClauseSyntax;
        public finallyClause(finallyKeyword: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax): TypeScript.FinallyClauseSyntax;
        public labeledStatement(identifier: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.LabeledStatementSyntax;
        public doStatement(doKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.DoStatementSyntax;
        public typeOfExpression(typeOfKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): TypeScript.TypeOfExpressionSyntax;
        public deleteExpression(deleteKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): TypeScript.DeleteExpressionSyntax;
        public voidExpression(voidKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): TypeScript.VoidExpressionSyntax;
        public debuggerStatement(debuggerKeyword: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.DebuggerStatementSyntax;
    }
    class StrictModeFactory implements IFactory {
        public sourceUnit(moduleElements: TypeScript.ISyntaxList, endOfFileToken: TypeScript.ISyntaxToken): TypeScript.SourceUnitSyntax;
        public externalModuleReference(requireKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, stringLiteral: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ExternalModuleReferenceSyntax;
        public moduleNameModuleReference(moduleName: TypeScript.INameSyntax): TypeScript.ModuleNameModuleReferenceSyntax;
        public importDeclaration(modifiers: TypeScript.ISyntaxList, importKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, moduleReference: TypeScript.IModuleReferenceSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ImportDeclarationSyntax;
        public exportAssignment(exportKeyword: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ExportAssignmentSyntax;
        public classDeclaration(modifiers: TypeScript.ISyntaxList, classKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, openBraceToken: TypeScript.ISyntaxToken, classElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ClassDeclarationSyntax;
        public interfaceDeclaration(modifiers: TypeScript.ISyntaxList, interfaceKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, body: TypeScript.ObjectTypeSyntax): TypeScript.InterfaceDeclarationSyntax;
        public heritageClause(kind: TypeScript.SyntaxKind, extendsOrImplementsKeyword: TypeScript.ISyntaxToken, typeNames: TypeScript.ISeparatedSyntaxList): TypeScript.HeritageClauseSyntax;
        public moduleDeclaration(modifiers: TypeScript.ISyntaxList, moduleKeyword: TypeScript.ISyntaxToken, name: TypeScript.INameSyntax, stringLiteral: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, moduleElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ModuleDeclarationSyntax;
        public functionDeclaration(modifiers: TypeScript.ISyntaxList, functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.FunctionDeclarationSyntax;
        public variableStatement(modifiers: TypeScript.ISyntaxList, variableDeclaration: TypeScript.VariableDeclarationSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.VariableStatementSyntax;
        public variableDeclaration(varKeyword: TypeScript.ISyntaxToken, variableDeclarators: TypeScript.ISeparatedSyntaxList): TypeScript.VariableDeclarationSyntax;
        public variableDeclarator(propertyName: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.VariableDeclaratorSyntax;
        public equalsValueClause(equalsToken: TypeScript.ISyntaxToken, value: TypeScript.IExpressionSyntax): TypeScript.EqualsValueClauseSyntax;
        public prefixUnaryExpression(kind: TypeScript.SyntaxKind, operatorToken: TypeScript.ISyntaxToken, operand: TypeScript.IUnaryExpressionSyntax): TypeScript.PrefixUnaryExpressionSyntax;
        public arrayLiteralExpression(openBracketToken: TypeScript.ISyntaxToken, expressions: TypeScript.ISeparatedSyntaxList, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ArrayLiteralExpressionSyntax;
        public omittedExpression(): TypeScript.OmittedExpressionSyntax;
        public parenthesizedExpression(openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ParenthesizedExpressionSyntax;
        public simpleArrowFunctionExpression(identifier: TypeScript.ISyntaxToken, equalsGreaterThanToken: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax, expression: TypeScript.IExpressionSyntax): TypeScript.SimpleArrowFunctionExpressionSyntax;
        public parenthesizedArrowFunctionExpression(callSignature: TypeScript.CallSignatureSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax, expression: TypeScript.IExpressionSyntax): TypeScript.ParenthesizedArrowFunctionExpressionSyntax;
        public qualifiedName(left: TypeScript.INameSyntax, dotToken: TypeScript.ISyntaxToken, right: TypeScript.ISyntaxToken): TypeScript.QualifiedNameSyntax;
        public typeArgumentList(lessThanToken: TypeScript.ISyntaxToken, typeArguments: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken): TypeScript.TypeArgumentListSyntax;
        public constructorType(newKeyword: TypeScript.ISyntaxToken, typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.ConstructorTypeSyntax;
        public functionType(typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.FunctionTypeSyntax;
        public objectType(openBraceToken: TypeScript.ISyntaxToken, typeMembers: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ObjectTypeSyntax;
        public arrayType(type: TypeScript.ITypeSyntax, openBracketToken: TypeScript.ISyntaxToken, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ArrayTypeSyntax;
        public genericType(name: TypeScript.INameSyntax, typeArgumentList: TypeScript.TypeArgumentListSyntax): TypeScript.GenericTypeSyntax;
        public typeQuery(typeOfKeyword: TypeScript.ISyntaxToken, name: TypeScript.INameSyntax): TypeScript.TypeQuerySyntax;
        public typeAnnotation(colonToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.TypeAnnotationSyntax;
        public block(openBraceToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.BlockSyntax;
        public parameter(dotDotDotToken: TypeScript.ISyntaxToken, modifiers: TypeScript.ISyntaxList, identifier: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.ParameterSyntax;
        public memberAccessExpression(expression: TypeScript.IExpressionSyntax, dotToken: TypeScript.ISyntaxToken, name: TypeScript.ISyntaxToken): TypeScript.MemberAccessExpressionSyntax;
        public postfixUnaryExpression(kind: TypeScript.SyntaxKind, operand: TypeScript.IMemberExpressionSyntax, operatorToken: TypeScript.ISyntaxToken): TypeScript.PostfixUnaryExpressionSyntax;
        public elementAccessExpression(expression: TypeScript.IExpressionSyntax, openBracketToken: TypeScript.ISyntaxToken, argumentExpression: TypeScript.IExpressionSyntax, closeBracketToken: TypeScript.ISyntaxToken): TypeScript.ElementAccessExpressionSyntax;
        public invocationExpression(expression: TypeScript.IMemberExpressionSyntax, argumentList: TypeScript.ArgumentListSyntax): TypeScript.InvocationExpressionSyntax;
        public argumentList(typeArgumentList: TypeScript.TypeArgumentListSyntax, openParenToken: TypeScript.ISyntaxToken, _arguments: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ArgumentListSyntax;
        public binaryExpression(kind: TypeScript.SyntaxKind, left: TypeScript.IExpressionSyntax, operatorToken: TypeScript.ISyntaxToken, right: TypeScript.IExpressionSyntax): TypeScript.BinaryExpressionSyntax;
        public conditionalExpression(condition: TypeScript.IExpressionSyntax, questionToken: TypeScript.ISyntaxToken, whenTrue: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, whenFalse: TypeScript.IExpressionSyntax): TypeScript.ConditionalExpressionSyntax;
        public constructSignature(newKeyword: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax): TypeScript.ConstructSignatureSyntax;
        public methodSignature(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax): TypeScript.MethodSignatureSyntax;
        public indexSignature(openBracketToken: TypeScript.ISyntaxToken, parameter: TypeScript.ParameterSyntax, closeBracketToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.IndexSignatureSyntax;
        public propertySignature(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.PropertySignatureSyntax;
        public callSignature(typeParameterList: TypeScript.TypeParameterListSyntax, parameterList: TypeScript.ParameterListSyntax, typeAnnotation: TypeScript.TypeAnnotationSyntax): TypeScript.CallSignatureSyntax;
        public parameterList(openParenToken: TypeScript.ISyntaxToken, parameters: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken): TypeScript.ParameterListSyntax;
        public typeParameterList(lessThanToken: TypeScript.ISyntaxToken, typeParameters: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken): TypeScript.TypeParameterListSyntax;
        public typeParameter(identifier: TypeScript.ISyntaxToken, constraint: TypeScript.ConstraintSyntax): TypeScript.TypeParameterSyntax;
        public constraint(extendsKeyword: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeScript.ConstraintSyntax;
        public elseClause(elseKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ElseClauseSyntax;
        public ifStatement(ifKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, elseClause: TypeScript.ElseClauseSyntax): TypeScript.IfStatementSyntax;
        public expressionStatement(expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ExpressionStatementSyntax;
        public constructorDeclaration(modifiers: TypeScript.ISyntaxList, constructorKeyword: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ConstructorDeclarationSyntax;
        public memberFunctionDeclaration(modifiers: TypeScript.ISyntaxList, propertyName: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.MemberFunctionDeclarationSyntax;
        public getAccessor(modifiers: TypeScript.ISyntaxList, getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, typeAnnotation: TypeScript.TypeAnnotationSyntax, block: TypeScript.BlockSyntax): TypeScript.GetAccessorSyntax;
        public setAccessor(modifiers: TypeScript.ISyntaxList, setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: TypeScript.ParameterListSyntax, block: TypeScript.BlockSyntax): TypeScript.SetAccessorSyntax;
        public memberVariableDeclaration(modifiers: TypeScript.ISyntaxList, variableDeclarator: TypeScript.VariableDeclaratorSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.MemberVariableDeclarationSyntax;
        public indexMemberDeclaration(modifiers: TypeScript.ISyntaxList, indexSignature: TypeScript.IndexSignatureSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.IndexMemberDeclarationSyntax;
        public throwStatement(throwKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ThrowStatementSyntax;
        public returnStatement(returnKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ReturnStatementSyntax;
        public objectCreationExpression(newKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IMemberExpressionSyntax, argumentList: TypeScript.ArgumentListSyntax): TypeScript.ObjectCreationExpressionSyntax;
        public switchStatement(switchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, switchClauses: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.SwitchStatementSyntax;
        public caseSwitchClause(caseKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList): TypeScript.CaseSwitchClauseSyntax;
        public defaultSwitchClause(defaultKeyword: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList): TypeScript.DefaultSwitchClauseSyntax;
        public breakStatement(breakKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.BreakStatementSyntax;
        public continueStatement(continueKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.ContinueStatementSyntax;
        public forStatement(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: TypeScript.VariableDeclarationSyntax, initializer: TypeScript.IExpressionSyntax, firstSemicolonToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, secondSemicolonToken: TypeScript.ISyntaxToken, incrementor: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ForStatementSyntax;
        public forInStatement(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: TypeScript.VariableDeclarationSyntax, left: TypeScript.IExpressionSyntax, inKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.ForInStatementSyntax;
        public whileStatement(whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.WhileStatementSyntax;
        public withStatement(withKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.WithStatementSyntax;
        public enumDeclaration(modifiers: TypeScript.ISyntaxList, enumKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, enumElements: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.EnumDeclarationSyntax;
        public enumElement(propertyName: TypeScript.ISyntaxToken, equalsValueClause: TypeScript.EqualsValueClauseSyntax): TypeScript.EnumElementSyntax;
        public castExpression(lessThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, greaterThanToken: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): TypeScript.CastExpressionSyntax;
        public objectLiteralExpression(openBraceToken: TypeScript.ISyntaxToken, propertyAssignments: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): TypeScript.ObjectLiteralExpressionSyntax;
        public simplePropertyAssignment(propertyName: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): TypeScript.SimplePropertyAssignmentSyntax;
        public functionPropertyAssignment(propertyName: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax): TypeScript.FunctionPropertyAssignmentSyntax;
        public functionExpression(functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: TypeScript.CallSignatureSyntax, block: TypeScript.BlockSyntax): TypeScript.FunctionExpressionSyntax;
        public emptyStatement(semicolonToken: TypeScript.ISyntaxToken): TypeScript.EmptyStatementSyntax;
        public tryStatement(tryKeyword: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax, catchClause: TypeScript.CatchClauseSyntax, finallyClause: TypeScript.FinallyClauseSyntax): TypeScript.TryStatementSyntax;
        public catchClause(catchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeAnnotation: TypeScript.TypeAnnotationSyntax, closeParenToken: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax): TypeScript.CatchClauseSyntax;
        public finallyClause(finallyKeyword: TypeScript.ISyntaxToken, block: TypeScript.BlockSyntax): TypeScript.FinallyClauseSyntax;
        public labeledStatement(identifier: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): TypeScript.LabeledStatementSyntax;
        public doStatement(doKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.DoStatementSyntax;
        public typeOfExpression(typeOfKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): TypeScript.TypeOfExpressionSyntax;
        public deleteExpression(deleteKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): TypeScript.DeleteExpressionSyntax;
        public voidExpression(voidKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): TypeScript.VoidExpressionSyntax;
        public debuggerStatement(debuggerKeyword: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): TypeScript.DebuggerStatementSyntax;
    }
    var normalModeFactory: IFactory;
    var strictModeFactory: IFactory;
}
declare module TypeScript.SyntaxFacts {
    function isDirectivePrologueElement(node: TypeScript.ISyntaxNodeOrToken): boolean;
    function isUseStrictDirective(node: TypeScript.ISyntaxNodeOrToken): boolean;
    function isIdentifierNameOrAnyKeyword(token: TypeScript.ISyntaxToken): boolean;
}
declare module TypeScript {
    interface ISyntaxList extends TypeScript.ISyntaxElement {
        childAt(index: number): TypeScript.ISyntaxNodeOrToken;
        toArray(): TypeScript.ISyntaxNodeOrToken[];
        insertChildrenInto(array: TypeScript.ISyntaxElement[], index: number): void;
    }
}
declare module TypeScript.Syntax {
    class EmptySyntaxList implements TypeScript.ISyntaxList {
        public kind(): TypeScript.SyntaxKind;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public toJSON(key: any): any;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxNodeOrToken;
        public toArray(): TypeScript.ISyntaxNodeOrToken[];
        public collectTextElements(elements: string[]): void;
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public fullWidth(): number;
        public width(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public leadingTriviaWidth(): number;
        public trailingTriviaWidth(): number;
        public fullText(): string;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public findTokenInternal(parent: TypeScript.PositionedElement, position: number, fullStart: number): TypeScript.PositionedToken;
        public insertChildrenInto(array: TypeScript.ISyntaxElement[], index: number): void;
    }
    var emptyList: TypeScript.ISyntaxList;
    function list(nodes: TypeScript.ISyntaxNodeOrToken[]): TypeScript.ISyntaxList;
}
declare module TypeScript {
    class SyntaxNode implements TypeScript.ISyntaxNodeOrToken {
        private _data;
        constructor(parsedInStrictMode: boolean);
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public insertChildrenInto(array: TypeScript.ISyntaxElement[], index: number): void;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public toJSON(key: any): any;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public fullText(): string;
        public collectTextElements(elements: string[]): void;
        public replaceToken(token1: TypeScript.ISyntaxToken, token2: TypeScript.ISyntaxToken): SyntaxNode;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): SyntaxNode;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): SyntaxNode;
        public hasLeadingTrivia(): boolean;
        public hasTrailingTrivia(): boolean;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public parsedInStrictMode(): boolean;
        public fullWidth(): number;
        private computeData();
        private data();
        public findToken(position: number, includeSkippedTokens?: boolean): TypeScript.PositionedToken;
        private tryGetEndOfFileAt(position);
        private findTokenInternal(parent, position, fullStart);
        public findTokenOnLeft(position: number, includeSkippedTokens?: boolean): TypeScript.PositionedToken;
        public findCompleteTokenOnLeft(position: number, includeSkippedTokens?: boolean): TypeScript.PositionedToken;
        public isModuleElement(): boolean;
        public isClassElement(): boolean;
        public isTypeMember(): boolean;
        public isStatement(): boolean;
        public isExpression(): boolean;
        public isSwitchClause(): boolean;
        public structuralEquals(node: SyntaxNode): boolean;
        public width(): number;
        public leadingTriviaWidth(): number;
        public trailingTriviaWidth(): number;
    }
}
declare module TypeScript {
    interface ISyntaxNodeOrToken extends TypeScript.ISyntaxElement {
        withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): ISyntaxNodeOrToken;
        withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): ISyntaxNodeOrToken;
        accept(visitor: TypeScript.ISyntaxVisitor): any;
    }
}
declare module TypeScript {
    class SourceUnitSyntax extends TypeScript.SyntaxNode {
        public moduleElements: TypeScript.ISyntaxList;
        public endOfFileToken: TypeScript.ISyntaxToken;
        constructor(moduleElements: TypeScript.ISyntaxList, endOfFileToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(moduleElements: TypeScript.ISyntaxList, endOfFileToken: TypeScript.ISyntaxToken): SourceUnitSyntax;
        static create(endOfFileToken: TypeScript.ISyntaxToken): SourceUnitSyntax;
        static create1(endOfFileToken: TypeScript.ISyntaxToken): SourceUnitSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): SourceUnitSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): SourceUnitSyntax;
        public withModuleElements(moduleElements: TypeScript.ISyntaxList): SourceUnitSyntax;
        public withModuleElement(moduleElement: TypeScript.IModuleElementSyntax): SourceUnitSyntax;
        public withEndOfFileToken(endOfFileToken: TypeScript.ISyntaxToken): SourceUnitSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ExternalModuleReferenceSyntax extends TypeScript.SyntaxNode implements TypeScript.IModuleReferenceSyntax {
        public requireKeyword: TypeScript.ISyntaxToken;
        public openParenToken: TypeScript.ISyntaxToken;
        public stringLiteral: TypeScript.ISyntaxToken;
        public closeParenToken: TypeScript.ISyntaxToken;
        constructor(requireKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, stringLiteral: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isModuleReference(): boolean;
        public update(requireKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, stringLiteral: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken): ExternalModuleReferenceSyntax;
        static create1(stringLiteral: TypeScript.ISyntaxToken): ExternalModuleReferenceSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ExternalModuleReferenceSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ExternalModuleReferenceSyntax;
        public withRequireKeyword(requireKeyword: TypeScript.ISyntaxToken): ExternalModuleReferenceSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): ExternalModuleReferenceSyntax;
        public withStringLiteral(stringLiteral: TypeScript.ISyntaxToken): ExternalModuleReferenceSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): ExternalModuleReferenceSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ModuleNameModuleReferenceSyntax extends TypeScript.SyntaxNode implements TypeScript.IModuleReferenceSyntax {
        public moduleName: TypeScript.INameSyntax;
        constructor(moduleName: TypeScript.INameSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isModuleReference(): boolean;
        public update(moduleName: TypeScript.INameSyntax): ModuleNameModuleReferenceSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ModuleNameModuleReferenceSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ModuleNameModuleReferenceSyntax;
        public withModuleName(moduleName: TypeScript.INameSyntax): ModuleNameModuleReferenceSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ImportDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IModuleElementSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public importKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public equalsToken: TypeScript.ISyntaxToken;
        public moduleReference: TypeScript.IModuleReferenceSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, importKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, moduleReference: TypeScript.IModuleReferenceSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isModuleElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, importKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, moduleReference: TypeScript.IModuleReferenceSyntax, semicolonToken: TypeScript.ISyntaxToken): ImportDeclarationSyntax;
        static create(importKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, moduleReference: TypeScript.IModuleReferenceSyntax, semicolonToken: TypeScript.ISyntaxToken): ImportDeclarationSyntax;
        static create1(identifier: TypeScript.ISyntaxToken, moduleReference: TypeScript.IModuleReferenceSyntax): ImportDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ImportDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ImportDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): ImportDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): ImportDeclarationSyntax;
        public withImportKeyword(importKeyword: TypeScript.ISyntaxToken): ImportDeclarationSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): ImportDeclarationSyntax;
        public withEqualsToken(equalsToken: TypeScript.ISyntaxToken): ImportDeclarationSyntax;
        public withModuleReference(moduleReference: TypeScript.IModuleReferenceSyntax): ImportDeclarationSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): ImportDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ExportAssignmentSyntax extends TypeScript.SyntaxNode implements TypeScript.IModuleElementSyntax {
        public exportKeyword: TypeScript.ISyntaxToken;
        public equalsToken: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(exportKeyword: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isModuleElement(): boolean;
        public update(exportKeyword: TypeScript.ISyntaxToken, equalsToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): ExportAssignmentSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): ExportAssignmentSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ExportAssignmentSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ExportAssignmentSyntax;
        public withExportKeyword(exportKeyword: TypeScript.ISyntaxToken): ExportAssignmentSyntax;
        public withEqualsToken(equalsToken: TypeScript.ISyntaxToken): ExportAssignmentSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): ExportAssignmentSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): ExportAssignmentSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ClassDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IModuleElementSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public classKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public typeParameterList: TypeParameterListSyntax;
        public heritageClauses: TypeScript.ISyntaxList;
        public openBraceToken: TypeScript.ISyntaxToken;
        public classElements: TypeScript.ISyntaxList;
        public closeBraceToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, classKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, openBraceToken: TypeScript.ISyntaxToken, classElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isModuleElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, classKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, openBraceToken: TypeScript.ISyntaxToken, classElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): ClassDeclarationSyntax;
        static create(classKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, closeBraceToken: TypeScript.ISyntaxToken): ClassDeclarationSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): ClassDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ClassDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ClassDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): ClassDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): ClassDeclarationSyntax;
        public withClassKeyword(classKeyword: TypeScript.ISyntaxToken): ClassDeclarationSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): ClassDeclarationSyntax;
        public withTypeParameterList(typeParameterList: TypeParameterListSyntax): ClassDeclarationSyntax;
        public withHeritageClauses(heritageClauses: TypeScript.ISyntaxList): ClassDeclarationSyntax;
        public withHeritageClause(heritageClause: HeritageClauseSyntax): ClassDeclarationSyntax;
        public withOpenBraceToken(openBraceToken: TypeScript.ISyntaxToken): ClassDeclarationSyntax;
        public withClassElements(classElements: TypeScript.ISyntaxList): ClassDeclarationSyntax;
        public withClassElement(classElement: TypeScript.IClassElementSyntax): ClassDeclarationSyntax;
        public withCloseBraceToken(closeBraceToken: TypeScript.ISyntaxToken): ClassDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class InterfaceDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IModuleElementSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public interfaceKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public typeParameterList: TypeParameterListSyntax;
        public heritageClauses: TypeScript.ISyntaxList;
        public body: ObjectTypeSyntax;
        constructor(modifiers: TypeScript.ISyntaxList, interfaceKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, body: ObjectTypeSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isModuleElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, interfaceKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: TypeScript.ISyntaxList, body: ObjectTypeSyntax): InterfaceDeclarationSyntax;
        static create(interfaceKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, body: ObjectTypeSyntax): InterfaceDeclarationSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): InterfaceDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): InterfaceDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): InterfaceDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): InterfaceDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): InterfaceDeclarationSyntax;
        public withInterfaceKeyword(interfaceKeyword: TypeScript.ISyntaxToken): InterfaceDeclarationSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): InterfaceDeclarationSyntax;
        public withTypeParameterList(typeParameterList: TypeParameterListSyntax): InterfaceDeclarationSyntax;
        public withHeritageClauses(heritageClauses: TypeScript.ISyntaxList): InterfaceDeclarationSyntax;
        public withHeritageClause(heritageClause: HeritageClauseSyntax): InterfaceDeclarationSyntax;
        public withBody(body: ObjectTypeSyntax): InterfaceDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class HeritageClauseSyntax extends TypeScript.SyntaxNode {
        public extendsOrImplementsKeyword: TypeScript.ISyntaxToken;
        public typeNames: TypeScript.ISeparatedSyntaxList;
        private _kind;
        constructor(kind: TypeScript.SyntaxKind, extendsOrImplementsKeyword: TypeScript.ISyntaxToken, typeNames: TypeScript.ISeparatedSyntaxList, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public kind(): TypeScript.SyntaxKind;
        public update(kind: TypeScript.SyntaxKind, extendsOrImplementsKeyword: TypeScript.ISyntaxToken, typeNames: TypeScript.ISeparatedSyntaxList): HeritageClauseSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): HeritageClauseSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): HeritageClauseSyntax;
        public withKind(kind: TypeScript.SyntaxKind): HeritageClauseSyntax;
        public withExtendsOrImplementsKeyword(extendsOrImplementsKeyword: TypeScript.ISyntaxToken): HeritageClauseSyntax;
        public withTypeNames(typeNames: TypeScript.ISeparatedSyntaxList): HeritageClauseSyntax;
        public withTypeName(typeName: TypeScript.INameSyntax): HeritageClauseSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ModuleDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IModuleElementSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public moduleKeyword: TypeScript.ISyntaxToken;
        public name: TypeScript.INameSyntax;
        public stringLiteral: TypeScript.ISyntaxToken;
        public openBraceToken: TypeScript.ISyntaxToken;
        public moduleElements: TypeScript.ISyntaxList;
        public closeBraceToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, moduleKeyword: TypeScript.ISyntaxToken, name: TypeScript.INameSyntax, stringLiteral: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, moduleElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isModuleElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, moduleKeyword: TypeScript.ISyntaxToken, name: TypeScript.INameSyntax, stringLiteral: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, moduleElements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): ModuleDeclarationSyntax;
        static create(moduleKeyword: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, closeBraceToken: TypeScript.ISyntaxToken): ModuleDeclarationSyntax;
        static create1(): ModuleDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ModuleDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ModuleDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): ModuleDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): ModuleDeclarationSyntax;
        public withModuleKeyword(moduleKeyword: TypeScript.ISyntaxToken): ModuleDeclarationSyntax;
        public withName(name: TypeScript.INameSyntax): ModuleDeclarationSyntax;
        public withStringLiteral(stringLiteral: TypeScript.ISyntaxToken): ModuleDeclarationSyntax;
        public withOpenBraceToken(openBraceToken: TypeScript.ISyntaxToken): ModuleDeclarationSyntax;
        public withModuleElements(moduleElements: TypeScript.ISyntaxList): ModuleDeclarationSyntax;
        public withModuleElement(moduleElement: TypeScript.IModuleElementSyntax): ModuleDeclarationSyntax;
        public withCloseBraceToken(closeBraceToken: TypeScript.ISyntaxToken): ModuleDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class FunctionDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public functionKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public callSignature: CallSignatureSyntax;
        public block: BlockSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): FunctionDeclarationSyntax;
        static create(functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax): FunctionDeclarationSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): FunctionDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): FunctionDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): FunctionDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): FunctionDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): FunctionDeclarationSyntax;
        public withFunctionKeyword(functionKeyword: TypeScript.ISyntaxToken): FunctionDeclarationSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): FunctionDeclarationSyntax;
        public withCallSignature(callSignature: CallSignatureSyntax): FunctionDeclarationSyntax;
        public withBlock(block: BlockSyntax): FunctionDeclarationSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): FunctionDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class VariableStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public variableDeclaration: VariableDeclarationSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, variableDeclaration: VariableDeclarationSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, variableDeclaration: VariableDeclarationSyntax, semicolonToken: TypeScript.ISyntaxToken): VariableStatementSyntax;
        static create(variableDeclaration: VariableDeclarationSyntax, semicolonToken: TypeScript.ISyntaxToken): VariableStatementSyntax;
        static create1(variableDeclaration: VariableDeclarationSyntax): VariableStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): VariableStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): VariableStatementSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): VariableStatementSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): VariableStatementSyntax;
        public withVariableDeclaration(variableDeclaration: VariableDeclarationSyntax): VariableStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): VariableStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class VariableDeclarationSyntax extends TypeScript.SyntaxNode {
        public varKeyword: TypeScript.ISyntaxToken;
        public variableDeclarators: TypeScript.ISeparatedSyntaxList;
        constructor(varKeyword: TypeScript.ISyntaxToken, variableDeclarators: TypeScript.ISeparatedSyntaxList, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(varKeyword: TypeScript.ISyntaxToken, variableDeclarators: TypeScript.ISeparatedSyntaxList): VariableDeclarationSyntax;
        static create1(variableDeclarators: TypeScript.ISeparatedSyntaxList): VariableDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): VariableDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): VariableDeclarationSyntax;
        public withVarKeyword(varKeyword: TypeScript.ISyntaxToken): VariableDeclarationSyntax;
        public withVariableDeclarators(variableDeclarators: TypeScript.ISeparatedSyntaxList): VariableDeclarationSyntax;
        public withVariableDeclarator(variableDeclarator: VariableDeclaratorSyntax): VariableDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class VariableDeclaratorSyntax extends TypeScript.SyntaxNode {
        public propertyName: TypeScript.ISyntaxToken;
        public typeAnnotation: TypeAnnotationSyntax;
        public equalsValueClause: EqualsValueClauseSyntax;
        constructor(propertyName: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(propertyName: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax;
        static create(propertyName: TypeScript.ISyntaxToken): VariableDeclaratorSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken): VariableDeclaratorSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): VariableDeclaratorSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): VariableDeclaratorSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): VariableDeclaratorSyntax;
        public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): VariableDeclaratorSyntax;
        public withEqualsValueClause(equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class EqualsValueClauseSyntax extends TypeScript.SyntaxNode {
        public equalsToken: TypeScript.ISyntaxToken;
        public value: TypeScript.IExpressionSyntax;
        constructor(equalsToken: TypeScript.ISyntaxToken, value: TypeScript.IExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(equalsToken: TypeScript.ISyntaxToken, value: TypeScript.IExpressionSyntax): EqualsValueClauseSyntax;
        static create1(value: TypeScript.IExpressionSyntax): EqualsValueClauseSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): EqualsValueClauseSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): EqualsValueClauseSyntax;
        public withEqualsToken(equalsToken: TypeScript.ISyntaxToken): EqualsValueClauseSyntax;
        public withValue(value: TypeScript.IExpressionSyntax): EqualsValueClauseSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class PrefixUnaryExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public operatorToken: TypeScript.ISyntaxToken;
        public operand: TypeScript.IUnaryExpressionSyntax;
        private _kind;
        constructor(kind: TypeScript.SyntaxKind, operatorToken: TypeScript.ISyntaxToken, operand: TypeScript.IUnaryExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public update(kind: TypeScript.SyntaxKind, operatorToken: TypeScript.ISyntaxToken, operand: TypeScript.IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): PrefixUnaryExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): PrefixUnaryExpressionSyntax;
        public withKind(kind: TypeScript.SyntaxKind): PrefixUnaryExpressionSyntax;
        public withOperatorToken(operatorToken: TypeScript.ISyntaxToken): PrefixUnaryExpressionSyntax;
        public withOperand(operand: TypeScript.IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ArrayLiteralExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IPrimaryExpressionSyntax {
        public openBracketToken: TypeScript.ISyntaxToken;
        public expressions: TypeScript.ISeparatedSyntaxList;
        public closeBracketToken: TypeScript.ISyntaxToken;
        constructor(openBracketToken: TypeScript.ISyntaxToken, expressions: TypeScript.ISeparatedSyntaxList, closeBracketToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isPrimaryExpression(): boolean;
        public isMemberExpression(): boolean;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(openBracketToken: TypeScript.ISyntaxToken, expressions: TypeScript.ISeparatedSyntaxList, closeBracketToken: TypeScript.ISyntaxToken): ArrayLiteralExpressionSyntax;
        static create(openBracketToken: TypeScript.ISyntaxToken, closeBracketToken: TypeScript.ISyntaxToken): ArrayLiteralExpressionSyntax;
        static create1(): ArrayLiteralExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ArrayLiteralExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ArrayLiteralExpressionSyntax;
        public withOpenBracketToken(openBracketToken: TypeScript.ISyntaxToken): ArrayLiteralExpressionSyntax;
        public withExpressions(expressions: TypeScript.ISeparatedSyntaxList): ArrayLiteralExpressionSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): ArrayLiteralExpressionSyntax;
        public withCloseBracketToken(closeBracketToken: TypeScript.ISyntaxToken): ArrayLiteralExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class OmittedExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IExpressionSyntax {
        constructor(parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isExpression(): boolean;
        public update(): OmittedExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): OmittedExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): OmittedExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ParenthesizedExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IPrimaryExpressionSyntax {
        public openParenToken: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        public closeParenToken: TypeScript.ISyntaxToken;
        constructor(openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isPrimaryExpression(): boolean;
        public isMemberExpression(): boolean;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken): ParenthesizedExpressionSyntax;
        static create1(expression: TypeScript.IExpressionSyntax): ParenthesizedExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ParenthesizedExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ParenthesizedExpressionSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): ParenthesizedExpressionSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): ParenthesizedExpressionSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): ParenthesizedExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class SimpleArrowFunctionExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IArrowFunctionExpressionSyntax {
        public identifier: TypeScript.ISyntaxToken;
        public equalsGreaterThanToken: TypeScript.ISyntaxToken;
        public block: BlockSyntax;
        public expression: TypeScript.IExpressionSyntax;
        constructor(identifier: TypeScript.ISyntaxToken, equalsGreaterThanToken: TypeScript.ISyntaxToken, block: BlockSyntax, expression: TypeScript.IExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isArrowFunctionExpression(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(identifier: TypeScript.ISyntaxToken, equalsGreaterThanToken: TypeScript.ISyntaxToken, block: BlockSyntax, expression: TypeScript.IExpressionSyntax): SimpleArrowFunctionExpressionSyntax;
        static create(identifier: TypeScript.ISyntaxToken, equalsGreaterThanToken: TypeScript.ISyntaxToken): SimpleArrowFunctionExpressionSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): SimpleArrowFunctionExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): SimpleArrowFunctionExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): SimpleArrowFunctionExpressionSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): SimpleArrowFunctionExpressionSyntax;
        public withEqualsGreaterThanToken(equalsGreaterThanToken: TypeScript.ISyntaxToken): SimpleArrowFunctionExpressionSyntax;
        public withBlock(block: BlockSyntax): SimpleArrowFunctionExpressionSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): SimpleArrowFunctionExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ParenthesizedArrowFunctionExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IArrowFunctionExpressionSyntax {
        public callSignature: CallSignatureSyntax;
        public equalsGreaterThanToken: TypeScript.ISyntaxToken;
        public block: BlockSyntax;
        public expression: TypeScript.IExpressionSyntax;
        constructor(callSignature: CallSignatureSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, block: BlockSyntax, expression: TypeScript.IExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isArrowFunctionExpression(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(callSignature: CallSignatureSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, block: BlockSyntax, expression: TypeScript.IExpressionSyntax): ParenthesizedArrowFunctionExpressionSyntax;
        static create(callSignature: CallSignatureSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken): ParenthesizedArrowFunctionExpressionSyntax;
        static create1(): ParenthesizedArrowFunctionExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ParenthesizedArrowFunctionExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ParenthesizedArrowFunctionExpressionSyntax;
        public withCallSignature(callSignature: CallSignatureSyntax): ParenthesizedArrowFunctionExpressionSyntax;
        public withEqualsGreaterThanToken(equalsGreaterThanToken: TypeScript.ISyntaxToken): ParenthesizedArrowFunctionExpressionSyntax;
        public withBlock(block: BlockSyntax): ParenthesizedArrowFunctionExpressionSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): ParenthesizedArrowFunctionExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class QualifiedNameSyntax extends TypeScript.SyntaxNode implements TypeScript.INameSyntax {
        public left: TypeScript.INameSyntax;
        public dotToken: TypeScript.ISyntaxToken;
        public right: TypeScript.ISyntaxToken;
        constructor(left: TypeScript.INameSyntax, dotToken: TypeScript.ISyntaxToken, right: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isName(): boolean;
        public isType(): boolean;
        public update(left: TypeScript.INameSyntax, dotToken: TypeScript.ISyntaxToken, right: TypeScript.ISyntaxToken): QualifiedNameSyntax;
        static create1(left: TypeScript.INameSyntax, right: TypeScript.ISyntaxToken): QualifiedNameSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): QualifiedNameSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): QualifiedNameSyntax;
        public withLeft(left: TypeScript.INameSyntax): QualifiedNameSyntax;
        public withDotToken(dotToken: TypeScript.ISyntaxToken): QualifiedNameSyntax;
        public withRight(right: TypeScript.ISyntaxToken): QualifiedNameSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class TypeArgumentListSyntax extends TypeScript.SyntaxNode {
        public lessThanToken: TypeScript.ISyntaxToken;
        public typeArguments: TypeScript.ISeparatedSyntaxList;
        public greaterThanToken: TypeScript.ISyntaxToken;
        constructor(lessThanToken: TypeScript.ISyntaxToken, typeArguments: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(lessThanToken: TypeScript.ISyntaxToken, typeArguments: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken): TypeArgumentListSyntax;
        static create(lessThanToken: TypeScript.ISyntaxToken, greaterThanToken: TypeScript.ISyntaxToken): TypeArgumentListSyntax;
        static create1(): TypeArgumentListSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeArgumentListSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeArgumentListSyntax;
        public withLessThanToken(lessThanToken: TypeScript.ISyntaxToken): TypeArgumentListSyntax;
        public withTypeArguments(typeArguments: TypeScript.ISeparatedSyntaxList): TypeArgumentListSyntax;
        public withTypeArgument(typeArgument: TypeScript.ITypeSyntax): TypeArgumentListSyntax;
        public withGreaterThanToken(greaterThanToken: TypeScript.ISyntaxToken): TypeArgumentListSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ConstructorTypeSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeSyntax {
        public newKeyword: TypeScript.ISyntaxToken;
        public typeParameterList: TypeParameterListSyntax;
        public parameterList: ParameterListSyntax;
        public equalsGreaterThanToken: TypeScript.ISyntaxToken;
        public type: TypeScript.ITypeSyntax;
        constructor(newKeyword: TypeScript.ISyntaxToken, typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isType(): boolean;
        public update(newKeyword: TypeScript.ISyntaxToken, typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): ConstructorTypeSyntax;
        static create(newKeyword: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): ConstructorTypeSyntax;
        static create1(type: TypeScript.ITypeSyntax): ConstructorTypeSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConstructorTypeSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConstructorTypeSyntax;
        public withNewKeyword(newKeyword: TypeScript.ISyntaxToken): ConstructorTypeSyntax;
        public withTypeParameterList(typeParameterList: TypeParameterListSyntax): ConstructorTypeSyntax;
        public withParameterList(parameterList: ParameterListSyntax): ConstructorTypeSyntax;
        public withEqualsGreaterThanToken(equalsGreaterThanToken: TypeScript.ISyntaxToken): ConstructorTypeSyntax;
        public withType(type: TypeScript.ITypeSyntax): ConstructorTypeSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class FunctionTypeSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeSyntax {
        public typeParameterList: TypeParameterListSyntax;
        public parameterList: ParameterListSyntax;
        public equalsGreaterThanToken: TypeScript.ISyntaxToken;
        public type: TypeScript.ITypeSyntax;
        constructor(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isType(): boolean;
        public update(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): FunctionTypeSyntax;
        static create(parameterList: ParameterListSyntax, equalsGreaterThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): FunctionTypeSyntax;
        static create1(type: TypeScript.ITypeSyntax): FunctionTypeSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): FunctionTypeSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): FunctionTypeSyntax;
        public withTypeParameterList(typeParameterList: TypeParameterListSyntax): FunctionTypeSyntax;
        public withParameterList(parameterList: ParameterListSyntax): FunctionTypeSyntax;
        public withEqualsGreaterThanToken(equalsGreaterThanToken: TypeScript.ISyntaxToken): FunctionTypeSyntax;
        public withType(type: TypeScript.ITypeSyntax): FunctionTypeSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ObjectTypeSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeSyntax {
        public openBraceToken: TypeScript.ISyntaxToken;
        public typeMembers: TypeScript.ISeparatedSyntaxList;
        public closeBraceToken: TypeScript.ISyntaxToken;
        constructor(openBraceToken: TypeScript.ISyntaxToken, typeMembers: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isType(): boolean;
        public update(openBraceToken: TypeScript.ISyntaxToken, typeMembers: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): ObjectTypeSyntax;
        static create(openBraceToken: TypeScript.ISyntaxToken, closeBraceToken: TypeScript.ISyntaxToken): ObjectTypeSyntax;
        static create1(): ObjectTypeSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ObjectTypeSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ObjectTypeSyntax;
        public withOpenBraceToken(openBraceToken: TypeScript.ISyntaxToken): ObjectTypeSyntax;
        public withTypeMembers(typeMembers: TypeScript.ISeparatedSyntaxList): ObjectTypeSyntax;
        public withTypeMember(typeMember: TypeScript.ITypeMemberSyntax): ObjectTypeSyntax;
        public withCloseBraceToken(closeBraceToken: TypeScript.ISyntaxToken): ObjectTypeSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ArrayTypeSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeSyntax {
        public type: TypeScript.ITypeSyntax;
        public openBracketToken: TypeScript.ISyntaxToken;
        public closeBracketToken: TypeScript.ISyntaxToken;
        constructor(type: TypeScript.ITypeSyntax, openBracketToken: TypeScript.ISyntaxToken, closeBracketToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isType(): boolean;
        public update(type: TypeScript.ITypeSyntax, openBracketToken: TypeScript.ISyntaxToken, closeBracketToken: TypeScript.ISyntaxToken): ArrayTypeSyntax;
        static create1(type: TypeScript.ITypeSyntax): ArrayTypeSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ArrayTypeSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ArrayTypeSyntax;
        public withType(type: TypeScript.ITypeSyntax): ArrayTypeSyntax;
        public withOpenBracketToken(openBracketToken: TypeScript.ISyntaxToken): ArrayTypeSyntax;
        public withCloseBracketToken(closeBracketToken: TypeScript.ISyntaxToken): ArrayTypeSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class GenericTypeSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeSyntax {
        public name: TypeScript.INameSyntax;
        public typeArgumentList: TypeArgumentListSyntax;
        constructor(name: TypeScript.INameSyntax, typeArgumentList: TypeArgumentListSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isType(): boolean;
        public update(name: TypeScript.INameSyntax, typeArgumentList: TypeArgumentListSyntax): GenericTypeSyntax;
        static create1(name: TypeScript.INameSyntax): GenericTypeSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): GenericTypeSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): GenericTypeSyntax;
        public withName(name: TypeScript.INameSyntax): GenericTypeSyntax;
        public withTypeArgumentList(typeArgumentList: TypeArgumentListSyntax): GenericTypeSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class TypeQuerySyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeSyntax {
        public typeOfKeyword: TypeScript.ISyntaxToken;
        public name: TypeScript.INameSyntax;
        constructor(typeOfKeyword: TypeScript.ISyntaxToken, name: TypeScript.INameSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isType(): boolean;
        public update(typeOfKeyword: TypeScript.ISyntaxToken, name: TypeScript.INameSyntax): TypeQuerySyntax;
        static create1(name: TypeScript.INameSyntax): TypeQuerySyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeQuerySyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeQuerySyntax;
        public withTypeOfKeyword(typeOfKeyword: TypeScript.ISyntaxToken): TypeQuerySyntax;
        public withName(name: TypeScript.INameSyntax): TypeQuerySyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class TypeAnnotationSyntax extends TypeScript.SyntaxNode {
        public colonToken: TypeScript.ISyntaxToken;
        public type: TypeScript.ITypeSyntax;
        constructor(colonToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(colonToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): TypeAnnotationSyntax;
        static create1(type: TypeScript.ITypeSyntax): TypeAnnotationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeAnnotationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeAnnotationSyntax;
        public withColonToken(colonToken: TypeScript.ISyntaxToken): TypeAnnotationSyntax;
        public withType(type: TypeScript.ITypeSyntax): TypeAnnotationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class BlockSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public openBraceToken: TypeScript.ISyntaxToken;
        public statements: TypeScript.ISyntaxList;
        public closeBraceToken: TypeScript.ISyntaxToken;
        constructor(openBraceToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(openBraceToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): BlockSyntax;
        static create(openBraceToken: TypeScript.ISyntaxToken, closeBraceToken: TypeScript.ISyntaxToken): BlockSyntax;
        static create1(): BlockSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): BlockSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): BlockSyntax;
        public withOpenBraceToken(openBraceToken: TypeScript.ISyntaxToken): BlockSyntax;
        public withStatements(statements: TypeScript.ISyntaxList): BlockSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): BlockSyntax;
        public withCloseBraceToken(closeBraceToken: TypeScript.ISyntaxToken): BlockSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ParameterSyntax extends TypeScript.SyntaxNode {
        public dotDotDotToken: TypeScript.ISyntaxToken;
        public modifiers: TypeScript.ISyntaxList;
        public identifier: TypeScript.ISyntaxToken;
        public questionToken: TypeScript.ISyntaxToken;
        public typeAnnotation: TypeAnnotationSyntax;
        public equalsValueClause: EqualsValueClauseSyntax;
        constructor(dotDotDotToken: TypeScript.ISyntaxToken, modifiers: TypeScript.ISyntaxList, identifier: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(dotDotDotToken: TypeScript.ISyntaxToken, modifiers: TypeScript.ISyntaxList, identifier: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax;
        static create(identifier: TypeScript.ISyntaxToken): ParameterSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): ParameterSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ParameterSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ParameterSyntax;
        public withDotDotDotToken(dotDotDotToken: TypeScript.ISyntaxToken): ParameterSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): ParameterSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): ParameterSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): ParameterSyntax;
        public withQuestionToken(questionToken: TypeScript.ISyntaxToken): ParameterSyntax;
        public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): ParameterSyntax;
        public withEqualsValueClause(equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class MemberAccessExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IMemberExpressionSyntax {
        public expression: TypeScript.IExpressionSyntax;
        public dotToken: TypeScript.ISyntaxToken;
        public name: TypeScript.ISyntaxToken;
        constructor(expression: TypeScript.IExpressionSyntax, dotToken: TypeScript.ISyntaxToken, name: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isMemberExpression(): boolean;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(expression: TypeScript.IExpressionSyntax, dotToken: TypeScript.ISyntaxToken, name: TypeScript.ISyntaxToken): MemberAccessExpressionSyntax;
        static create1(expression: TypeScript.IExpressionSyntax, name: TypeScript.ISyntaxToken): MemberAccessExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): MemberAccessExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): MemberAccessExpressionSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): MemberAccessExpressionSyntax;
        public withDotToken(dotToken: TypeScript.ISyntaxToken): MemberAccessExpressionSyntax;
        public withName(name: TypeScript.ISyntaxToken): MemberAccessExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class PostfixUnaryExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IPostfixExpressionSyntax {
        public operand: TypeScript.IMemberExpressionSyntax;
        public operatorToken: TypeScript.ISyntaxToken;
        private _kind;
        constructor(kind: TypeScript.SyntaxKind, operand: TypeScript.IMemberExpressionSyntax, operatorToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public update(kind: TypeScript.SyntaxKind, operand: TypeScript.IMemberExpressionSyntax, operatorToken: TypeScript.ISyntaxToken): PostfixUnaryExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): PostfixUnaryExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): PostfixUnaryExpressionSyntax;
        public withKind(kind: TypeScript.SyntaxKind): PostfixUnaryExpressionSyntax;
        public withOperand(operand: TypeScript.IMemberExpressionSyntax): PostfixUnaryExpressionSyntax;
        public withOperatorToken(operatorToken: TypeScript.ISyntaxToken): PostfixUnaryExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ElementAccessExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IMemberExpressionSyntax {
        public expression: TypeScript.IExpressionSyntax;
        public openBracketToken: TypeScript.ISyntaxToken;
        public argumentExpression: TypeScript.IExpressionSyntax;
        public closeBracketToken: TypeScript.ISyntaxToken;
        constructor(expression: TypeScript.IExpressionSyntax, openBracketToken: TypeScript.ISyntaxToken, argumentExpression: TypeScript.IExpressionSyntax, closeBracketToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isMemberExpression(): boolean;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(expression: TypeScript.IExpressionSyntax, openBracketToken: TypeScript.ISyntaxToken, argumentExpression: TypeScript.IExpressionSyntax, closeBracketToken: TypeScript.ISyntaxToken): ElementAccessExpressionSyntax;
        static create1(expression: TypeScript.IExpressionSyntax, argumentExpression: TypeScript.IExpressionSyntax): ElementAccessExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ElementAccessExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ElementAccessExpressionSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): ElementAccessExpressionSyntax;
        public withOpenBracketToken(openBracketToken: TypeScript.ISyntaxToken): ElementAccessExpressionSyntax;
        public withArgumentExpression(argumentExpression: TypeScript.IExpressionSyntax): ElementAccessExpressionSyntax;
        public withCloseBracketToken(closeBracketToken: TypeScript.ISyntaxToken): ElementAccessExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class InvocationExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IMemberExpressionSyntax {
        public expression: TypeScript.IMemberExpressionSyntax;
        public argumentList: ArgumentListSyntax;
        constructor(expression: TypeScript.IMemberExpressionSyntax, argumentList: ArgumentListSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isMemberExpression(): boolean;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(expression: TypeScript.IMemberExpressionSyntax, argumentList: ArgumentListSyntax): InvocationExpressionSyntax;
        static create1(expression: TypeScript.IMemberExpressionSyntax): InvocationExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): InvocationExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): InvocationExpressionSyntax;
        public withExpression(expression: TypeScript.IMemberExpressionSyntax): InvocationExpressionSyntax;
        public withArgumentList(argumentList: ArgumentListSyntax): InvocationExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ArgumentListSyntax extends TypeScript.SyntaxNode {
        public typeArgumentList: TypeArgumentListSyntax;
        public openParenToken: TypeScript.ISyntaxToken;
        public arguments: TypeScript.ISeparatedSyntaxList;
        public closeParenToken: TypeScript.ISyntaxToken;
        constructor(typeArgumentList: TypeArgumentListSyntax, openParenToken: TypeScript.ISyntaxToken, arguments: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(typeArgumentList: TypeArgumentListSyntax, openParenToken: TypeScript.ISyntaxToken, _arguments: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken): ArgumentListSyntax;
        static create(openParenToken: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken): ArgumentListSyntax;
        static create1(): ArgumentListSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ArgumentListSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ArgumentListSyntax;
        public withTypeArgumentList(typeArgumentList: TypeArgumentListSyntax): ArgumentListSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): ArgumentListSyntax;
        public withArguments(_arguments: TypeScript.ISeparatedSyntaxList): ArgumentListSyntax;
        public withArgument(_argument: TypeScript.IExpressionSyntax): ArgumentListSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): ArgumentListSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class BinaryExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IExpressionSyntax {
        public left: TypeScript.IExpressionSyntax;
        public operatorToken: TypeScript.ISyntaxToken;
        public right: TypeScript.IExpressionSyntax;
        private _kind;
        constructor(kind: TypeScript.SyntaxKind, left: TypeScript.IExpressionSyntax, operatorToken: TypeScript.ISyntaxToken, right: TypeScript.IExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isExpression(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public update(kind: TypeScript.SyntaxKind, left: TypeScript.IExpressionSyntax, operatorToken: TypeScript.ISyntaxToken, right: TypeScript.IExpressionSyntax): BinaryExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): BinaryExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): BinaryExpressionSyntax;
        public withKind(kind: TypeScript.SyntaxKind): BinaryExpressionSyntax;
        public withLeft(left: TypeScript.IExpressionSyntax): BinaryExpressionSyntax;
        public withOperatorToken(operatorToken: TypeScript.ISyntaxToken): BinaryExpressionSyntax;
        public withRight(right: TypeScript.IExpressionSyntax): BinaryExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ConditionalExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IExpressionSyntax {
        public condition: TypeScript.IExpressionSyntax;
        public questionToken: TypeScript.ISyntaxToken;
        public whenTrue: TypeScript.IExpressionSyntax;
        public colonToken: TypeScript.ISyntaxToken;
        public whenFalse: TypeScript.IExpressionSyntax;
        constructor(condition: TypeScript.IExpressionSyntax, questionToken: TypeScript.ISyntaxToken, whenTrue: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, whenFalse: TypeScript.IExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isExpression(): boolean;
        public update(condition: TypeScript.IExpressionSyntax, questionToken: TypeScript.ISyntaxToken, whenTrue: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, whenFalse: TypeScript.IExpressionSyntax): ConditionalExpressionSyntax;
        static create1(condition: TypeScript.IExpressionSyntax, whenTrue: TypeScript.IExpressionSyntax, whenFalse: TypeScript.IExpressionSyntax): ConditionalExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConditionalExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConditionalExpressionSyntax;
        public withCondition(condition: TypeScript.IExpressionSyntax): ConditionalExpressionSyntax;
        public withQuestionToken(questionToken: TypeScript.ISyntaxToken): ConditionalExpressionSyntax;
        public withWhenTrue(whenTrue: TypeScript.IExpressionSyntax): ConditionalExpressionSyntax;
        public withColonToken(colonToken: TypeScript.ISyntaxToken): ConditionalExpressionSyntax;
        public withWhenFalse(whenFalse: TypeScript.IExpressionSyntax): ConditionalExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ConstructSignatureSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeMemberSyntax {
        public newKeyword: TypeScript.ISyntaxToken;
        public callSignature: CallSignatureSyntax;
        constructor(newKeyword: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isTypeMember(): boolean;
        public update(newKeyword: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax): ConstructSignatureSyntax;
        static create1(): ConstructSignatureSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConstructSignatureSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConstructSignatureSyntax;
        public withNewKeyword(newKeyword: TypeScript.ISyntaxToken): ConstructSignatureSyntax;
        public withCallSignature(callSignature: CallSignatureSyntax): ConstructSignatureSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class MethodSignatureSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeMemberSyntax {
        public propertyName: TypeScript.ISyntaxToken;
        public questionToken: TypeScript.ISyntaxToken;
        public callSignature: CallSignatureSyntax;
        constructor(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isTypeMember(): boolean;
        public update(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax): MethodSignatureSyntax;
        static create(propertyName: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax): MethodSignatureSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken): MethodSignatureSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): MethodSignatureSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): MethodSignatureSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): MethodSignatureSyntax;
        public withQuestionToken(questionToken: TypeScript.ISyntaxToken): MethodSignatureSyntax;
        public withCallSignature(callSignature: CallSignatureSyntax): MethodSignatureSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class IndexSignatureSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeMemberSyntax {
        public openBracketToken: TypeScript.ISyntaxToken;
        public parameter: ParameterSyntax;
        public closeBracketToken: TypeScript.ISyntaxToken;
        public typeAnnotation: TypeAnnotationSyntax;
        constructor(openBracketToken: TypeScript.ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isTypeMember(): boolean;
        public update(openBracketToken: TypeScript.ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax;
        static create(openBracketToken: TypeScript.ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: TypeScript.ISyntaxToken): IndexSignatureSyntax;
        static create1(parameter: ParameterSyntax): IndexSignatureSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): IndexSignatureSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): IndexSignatureSyntax;
        public withOpenBracketToken(openBracketToken: TypeScript.ISyntaxToken): IndexSignatureSyntax;
        public withParameter(parameter: ParameterSyntax): IndexSignatureSyntax;
        public withCloseBracketToken(closeBracketToken: TypeScript.ISyntaxToken): IndexSignatureSyntax;
        public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class PropertySignatureSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeMemberSyntax {
        public propertyName: TypeScript.ISyntaxToken;
        public questionToken: TypeScript.ISyntaxToken;
        public typeAnnotation: TypeAnnotationSyntax;
        constructor(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isTypeMember(): boolean;
        public update(propertyName: TypeScript.ISyntaxToken, questionToken: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax;
        static create(propertyName: TypeScript.ISyntaxToken): PropertySignatureSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken): PropertySignatureSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): PropertySignatureSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): PropertySignatureSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): PropertySignatureSyntax;
        public withQuestionToken(questionToken: TypeScript.ISyntaxToken): PropertySignatureSyntax;
        public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class CallSignatureSyntax extends TypeScript.SyntaxNode implements TypeScript.ITypeMemberSyntax {
        public typeParameterList: TypeParameterListSyntax;
        public parameterList: ParameterListSyntax;
        public typeAnnotation: TypeAnnotationSyntax;
        constructor(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isTypeMember(): boolean;
        public update(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax;
        static create(parameterList: ParameterListSyntax): CallSignatureSyntax;
        static create1(): CallSignatureSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): CallSignatureSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): CallSignatureSyntax;
        public withTypeParameterList(typeParameterList: TypeParameterListSyntax): CallSignatureSyntax;
        public withParameterList(parameterList: ParameterListSyntax): CallSignatureSyntax;
        public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ParameterListSyntax extends TypeScript.SyntaxNode {
        public openParenToken: TypeScript.ISyntaxToken;
        public parameters: TypeScript.ISeparatedSyntaxList;
        public closeParenToken: TypeScript.ISyntaxToken;
        constructor(openParenToken: TypeScript.ISyntaxToken, parameters: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(openParenToken: TypeScript.ISyntaxToken, parameters: TypeScript.ISeparatedSyntaxList, closeParenToken: TypeScript.ISyntaxToken): ParameterListSyntax;
        static create(openParenToken: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken): ParameterListSyntax;
        static create1(): ParameterListSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ParameterListSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ParameterListSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): ParameterListSyntax;
        public withParameters(parameters: TypeScript.ISeparatedSyntaxList): ParameterListSyntax;
        public withParameter(parameter: ParameterSyntax): ParameterListSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): ParameterListSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class TypeParameterListSyntax extends TypeScript.SyntaxNode {
        public lessThanToken: TypeScript.ISyntaxToken;
        public typeParameters: TypeScript.ISeparatedSyntaxList;
        public greaterThanToken: TypeScript.ISyntaxToken;
        constructor(lessThanToken: TypeScript.ISyntaxToken, typeParameters: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(lessThanToken: TypeScript.ISyntaxToken, typeParameters: TypeScript.ISeparatedSyntaxList, greaterThanToken: TypeScript.ISyntaxToken): TypeParameterListSyntax;
        static create(lessThanToken: TypeScript.ISyntaxToken, greaterThanToken: TypeScript.ISyntaxToken): TypeParameterListSyntax;
        static create1(): TypeParameterListSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeParameterListSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeParameterListSyntax;
        public withLessThanToken(lessThanToken: TypeScript.ISyntaxToken): TypeParameterListSyntax;
        public withTypeParameters(typeParameters: TypeScript.ISeparatedSyntaxList): TypeParameterListSyntax;
        public withTypeParameter(typeParameter: TypeParameterSyntax): TypeParameterListSyntax;
        public withGreaterThanToken(greaterThanToken: TypeScript.ISyntaxToken): TypeParameterListSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class TypeParameterSyntax extends TypeScript.SyntaxNode {
        public identifier: TypeScript.ISyntaxToken;
        public constraint: ConstraintSyntax;
        constructor(identifier: TypeScript.ISyntaxToken, constraint: ConstraintSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(identifier: TypeScript.ISyntaxToken, constraint: ConstraintSyntax): TypeParameterSyntax;
        static create(identifier: TypeScript.ISyntaxToken): TypeParameterSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): TypeParameterSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeParameterSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeParameterSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): TypeParameterSyntax;
        public withConstraint(constraint: ConstraintSyntax): TypeParameterSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ConstraintSyntax extends TypeScript.SyntaxNode {
        public extendsKeyword: TypeScript.ISyntaxToken;
        public type: TypeScript.ITypeSyntax;
        constructor(extendsKeyword: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(extendsKeyword: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax): ConstraintSyntax;
        static create1(type: TypeScript.ITypeSyntax): ConstraintSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConstraintSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConstraintSyntax;
        public withExtendsKeyword(extendsKeyword: TypeScript.ISyntaxToken): ConstraintSyntax;
        public withType(type: TypeScript.ITypeSyntax): ConstraintSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ElseClauseSyntax extends TypeScript.SyntaxNode {
        public elseKeyword: TypeScript.ISyntaxToken;
        public statement: TypeScript.IStatementSyntax;
        constructor(elseKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(elseKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): ElseClauseSyntax;
        static create1(statement: TypeScript.IStatementSyntax): ElseClauseSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ElseClauseSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ElseClauseSyntax;
        public withElseKeyword(elseKeyword: TypeScript.ISyntaxToken): ElseClauseSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): ElseClauseSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class IfStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public ifKeyword: TypeScript.ISyntaxToken;
        public openParenToken: TypeScript.ISyntaxToken;
        public condition: TypeScript.IExpressionSyntax;
        public closeParenToken: TypeScript.ISyntaxToken;
        public statement: TypeScript.IStatementSyntax;
        public elseClause: ElseClauseSyntax;
        constructor(ifKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, elseClause: ElseClauseSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(ifKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, elseClause: ElseClauseSyntax): IfStatementSyntax;
        static create(ifKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): IfStatementSyntax;
        static create1(condition: TypeScript.IExpressionSyntax, statement: TypeScript.IStatementSyntax): IfStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): IfStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): IfStatementSyntax;
        public withIfKeyword(ifKeyword: TypeScript.ISyntaxToken): IfStatementSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): IfStatementSyntax;
        public withCondition(condition: TypeScript.IExpressionSyntax): IfStatementSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): IfStatementSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): IfStatementSyntax;
        public withElseClause(elseClause: ElseClauseSyntax): IfStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ExpressionStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public expression: TypeScript.IExpressionSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): ExpressionStatementSyntax;
        static create1(expression: TypeScript.IExpressionSyntax): ExpressionStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ExpressionStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ExpressionStatementSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): ExpressionStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): ExpressionStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ConstructorDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IClassElementSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public constructorKeyword: TypeScript.ISyntaxToken;
        public parameterList: ParameterListSyntax;
        public block: BlockSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, constructorKeyword: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isClassElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, constructorKeyword: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): ConstructorDeclarationSyntax;
        static create(constructorKeyword: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax): ConstructorDeclarationSyntax;
        static create1(): ConstructorDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConstructorDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ConstructorDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): ConstructorDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): ConstructorDeclarationSyntax;
        public withConstructorKeyword(constructorKeyword: TypeScript.ISyntaxToken): ConstructorDeclarationSyntax;
        public withParameterList(parameterList: ParameterListSyntax): ConstructorDeclarationSyntax;
        public withBlock(block: BlockSyntax): ConstructorDeclarationSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): ConstructorDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class MemberFunctionDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IMemberDeclarationSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public propertyName: TypeScript.ISyntaxToken;
        public callSignature: CallSignatureSyntax;
        public block: BlockSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, propertyName: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isMemberDeclaration(): boolean;
        public isClassElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, propertyName: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: TypeScript.ISyntaxToken): MemberFunctionDeclarationSyntax;
        static create(propertyName: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax): MemberFunctionDeclarationSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken): MemberFunctionDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): MemberFunctionDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): MemberFunctionDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): MemberFunctionDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): MemberFunctionDeclarationSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): MemberFunctionDeclarationSyntax;
        public withCallSignature(callSignature: CallSignatureSyntax): MemberFunctionDeclarationSyntax;
        public withBlock(block: BlockSyntax): MemberFunctionDeclarationSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): MemberFunctionDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class GetAccessorSyntax extends TypeScript.SyntaxNode implements TypeScript.IMemberDeclarationSyntax, TypeScript.IPropertyAssignmentSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public getKeyword: TypeScript.ISyntaxToken;
        public propertyName: TypeScript.ISyntaxToken;
        public parameterList: ParameterListSyntax;
        public typeAnnotation: TypeAnnotationSyntax;
        public block: BlockSyntax;
        constructor(modifiers: TypeScript.ISyntaxList, getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, block: BlockSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isMemberDeclaration(): boolean;
        public isPropertyAssignment(): boolean;
        public isClassElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, block: BlockSyntax): GetAccessorSyntax;
        static create(getKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): GetAccessorSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken): GetAccessorSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): GetAccessorSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): GetAccessorSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): GetAccessorSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): GetAccessorSyntax;
        public withGetKeyword(getKeyword: TypeScript.ISyntaxToken): GetAccessorSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): GetAccessorSyntax;
        public withParameterList(parameterList: ParameterListSyntax): GetAccessorSyntax;
        public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): GetAccessorSyntax;
        public withBlock(block: BlockSyntax): GetAccessorSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class SetAccessorSyntax extends TypeScript.SyntaxNode implements TypeScript.IMemberDeclarationSyntax, TypeScript.IPropertyAssignmentSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public setKeyword: TypeScript.ISyntaxToken;
        public propertyName: TypeScript.ISyntaxToken;
        public parameterList: ParameterListSyntax;
        public block: BlockSyntax;
        constructor(modifiers: TypeScript.ISyntaxList, setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isMemberDeclaration(): boolean;
        public isPropertyAssignment(): boolean;
        public isClassElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): SetAccessorSyntax;
        static create(setKeyword: TypeScript.ISyntaxToken, propertyName: TypeScript.ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): SetAccessorSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken): SetAccessorSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): SetAccessorSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): SetAccessorSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): SetAccessorSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): SetAccessorSyntax;
        public withSetKeyword(setKeyword: TypeScript.ISyntaxToken): SetAccessorSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): SetAccessorSyntax;
        public withParameterList(parameterList: ParameterListSyntax): SetAccessorSyntax;
        public withBlock(block: BlockSyntax): SetAccessorSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class MemberVariableDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IMemberDeclarationSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public variableDeclarator: VariableDeclaratorSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, variableDeclarator: VariableDeclaratorSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isMemberDeclaration(): boolean;
        public isClassElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, variableDeclarator: VariableDeclaratorSyntax, semicolonToken: TypeScript.ISyntaxToken): MemberVariableDeclarationSyntax;
        static create(variableDeclarator: VariableDeclaratorSyntax, semicolonToken: TypeScript.ISyntaxToken): MemberVariableDeclarationSyntax;
        static create1(variableDeclarator: VariableDeclaratorSyntax): MemberVariableDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): MemberVariableDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): MemberVariableDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): MemberVariableDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): MemberVariableDeclarationSyntax;
        public withVariableDeclarator(variableDeclarator: VariableDeclaratorSyntax): MemberVariableDeclarationSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): MemberVariableDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class IndexMemberDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IClassElementSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public indexSignature: IndexSignatureSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, indexSignature: IndexSignatureSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isClassElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, indexSignature: IndexSignatureSyntax, semicolonToken: TypeScript.ISyntaxToken): IndexMemberDeclarationSyntax;
        static create(indexSignature: IndexSignatureSyntax, semicolonToken: TypeScript.ISyntaxToken): IndexMemberDeclarationSyntax;
        static create1(indexSignature: IndexSignatureSyntax): IndexMemberDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): IndexMemberDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): IndexMemberDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): IndexMemberDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): IndexMemberDeclarationSyntax;
        public withIndexSignature(indexSignature: IndexSignatureSyntax): IndexMemberDeclarationSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): IndexMemberDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ThrowStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public throwKeyword: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(throwKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(throwKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): ThrowStatementSyntax;
        static create1(expression: TypeScript.IExpressionSyntax): ThrowStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ThrowStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ThrowStatementSyntax;
        public withThrowKeyword(throwKeyword: TypeScript.ISyntaxToken): ThrowStatementSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): ThrowStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): ThrowStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ReturnStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public returnKeyword: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(returnKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(returnKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, semicolonToken: TypeScript.ISyntaxToken): ReturnStatementSyntax;
        static create(returnKeyword: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): ReturnStatementSyntax;
        static create1(): ReturnStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ReturnStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ReturnStatementSyntax;
        public withReturnKeyword(returnKeyword: TypeScript.ISyntaxToken): ReturnStatementSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): ReturnStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): ReturnStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ObjectCreationExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IMemberExpressionSyntax {
        public newKeyword: TypeScript.ISyntaxToken;
        public expression: TypeScript.IMemberExpressionSyntax;
        public argumentList: ArgumentListSyntax;
        constructor(newKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IMemberExpressionSyntax, argumentList: ArgumentListSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isMemberExpression(): boolean;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(newKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IMemberExpressionSyntax, argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax;
        static create(newKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IMemberExpressionSyntax): ObjectCreationExpressionSyntax;
        static create1(expression: TypeScript.IMemberExpressionSyntax): ObjectCreationExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ObjectCreationExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ObjectCreationExpressionSyntax;
        public withNewKeyword(newKeyword: TypeScript.ISyntaxToken): ObjectCreationExpressionSyntax;
        public withExpression(expression: TypeScript.IMemberExpressionSyntax): ObjectCreationExpressionSyntax;
        public withArgumentList(argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class SwitchStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public switchKeyword: TypeScript.ISyntaxToken;
        public openParenToken: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        public closeParenToken: TypeScript.ISyntaxToken;
        public openBraceToken: TypeScript.ISyntaxToken;
        public switchClauses: TypeScript.ISyntaxList;
        public closeBraceToken: TypeScript.ISyntaxToken;
        constructor(switchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, switchClauses: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(switchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, switchClauses: TypeScript.ISyntaxList, closeBraceToken: TypeScript.ISyntaxToken): SwitchStatementSyntax;
        static create(switchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, closeBraceToken: TypeScript.ISyntaxToken): SwitchStatementSyntax;
        static create1(expression: TypeScript.IExpressionSyntax): SwitchStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): SwitchStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): SwitchStatementSyntax;
        public withSwitchKeyword(switchKeyword: TypeScript.ISyntaxToken): SwitchStatementSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): SwitchStatementSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): SwitchStatementSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): SwitchStatementSyntax;
        public withOpenBraceToken(openBraceToken: TypeScript.ISyntaxToken): SwitchStatementSyntax;
        public withSwitchClauses(switchClauses: TypeScript.ISyntaxList): SwitchStatementSyntax;
        public withSwitchClause(switchClause: TypeScript.ISwitchClauseSyntax): SwitchStatementSyntax;
        public withCloseBraceToken(closeBraceToken: TypeScript.ISyntaxToken): SwitchStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class CaseSwitchClauseSyntax extends TypeScript.SyntaxNode implements TypeScript.ISwitchClauseSyntax {
        public caseKeyword: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        public colonToken: TypeScript.ISyntaxToken;
        public statements: TypeScript.ISyntaxList;
        constructor(caseKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isSwitchClause(): boolean;
        public update(caseKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList): CaseSwitchClauseSyntax;
        static create(caseKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, colonToken: TypeScript.ISyntaxToken): CaseSwitchClauseSyntax;
        static create1(expression: TypeScript.IExpressionSyntax): CaseSwitchClauseSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): CaseSwitchClauseSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): CaseSwitchClauseSyntax;
        public withCaseKeyword(caseKeyword: TypeScript.ISyntaxToken): CaseSwitchClauseSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): CaseSwitchClauseSyntax;
        public withColonToken(colonToken: TypeScript.ISyntaxToken): CaseSwitchClauseSyntax;
        public withStatements(statements: TypeScript.ISyntaxList): CaseSwitchClauseSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): CaseSwitchClauseSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class DefaultSwitchClauseSyntax extends TypeScript.SyntaxNode implements TypeScript.ISwitchClauseSyntax {
        public defaultKeyword: TypeScript.ISyntaxToken;
        public colonToken: TypeScript.ISyntaxToken;
        public statements: TypeScript.ISyntaxList;
        constructor(defaultKeyword: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isSwitchClause(): boolean;
        public update(defaultKeyword: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statements: TypeScript.ISyntaxList): DefaultSwitchClauseSyntax;
        static create(defaultKeyword: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken): DefaultSwitchClauseSyntax;
        static create1(): DefaultSwitchClauseSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): DefaultSwitchClauseSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): DefaultSwitchClauseSyntax;
        public withDefaultKeyword(defaultKeyword: TypeScript.ISyntaxToken): DefaultSwitchClauseSyntax;
        public withColonToken(colonToken: TypeScript.ISyntaxToken): DefaultSwitchClauseSyntax;
        public withStatements(statements: TypeScript.ISyntaxList): DefaultSwitchClauseSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): DefaultSwitchClauseSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class BreakStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public breakKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(breakKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(breakKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): BreakStatementSyntax;
        static create(breakKeyword: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): BreakStatementSyntax;
        static create1(): BreakStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): BreakStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): BreakStatementSyntax;
        public withBreakKeyword(breakKeyword: TypeScript.ISyntaxToken): BreakStatementSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): BreakStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): BreakStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ContinueStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public continueKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(continueKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(continueKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): ContinueStatementSyntax;
        static create(continueKeyword: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): ContinueStatementSyntax;
        static create1(): ContinueStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ContinueStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ContinueStatementSyntax;
        public withContinueKeyword(continueKeyword: TypeScript.ISyntaxToken): ContinueStatementSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): ContinueStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): ContinueStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ForStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IIterationStatementSyntax {
        public forKeyword: TypeScript.ISyntaxToken;
        public openParenToken: TypeScript.ISyntaxToken;
        public variableDeclaration: VariableDeclarationSyntax;
        public initializer: TypeScript.IExpressionSyntax;
        public firstSemicolonToken: TypeScript.ISyntaxToken;
        public condition: TypeScript.IExpressionSyntax;
        public secondSemicolonToken: TypeScript.ISyntaxToken;
        public incrementor: TypeScript.IExpressionSyntax;
        public closeParenToken: TypeScript.ISyntaxToken;
        public statement: TypeScript.IStatementSyntax;
        constructor(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, initializer: TypeScript.IExpressionSyntax, firstSemicolonToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, secondSemicolonToken: TypeScript.ISyntaxToken, incrementor: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isIterationStatement(): boolean;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, initializer: TypeScript.IExpressionSyntax, firstSemicolonToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, secondSemicolonToken: TypeScript.ISyntaxToken, incrementor: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): ForStatementSyntax;
        static create(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, firstSemicolonToken: TypeScript.ISyntaxToken, secondSemicolonToken: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): ForStatementSyntax;
        static create1(statement: TypeScript.IStatementSyntax): ForStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ForStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ForStatementSyntax;
        public withForKeyword(forKeyword: TypeScript.ISyntaxToken): ForStatementSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): ForStatementSyntax;
        public withVariableDeclaration(variableDeclaration: VariableDeclarationSyntax): ForStatementSyntax;
        public withInitializer(initializer: TypeScript.IExpressionSyntax): ForStatementSyntax;
        public withFirstSemicolonToken(firstSemicolonToken: TypeScript.ISyntaxToken): ForStatementSyntax;
        public withCondition(condition: TypeScript.IExpressionSyntax): ForStatementSyntax;
        public withSecondSemicolonToken(secondSemicolonToken: TypeScript.ISyntaxToken): ForStatementSyntax;
        public withIncrementor(incrementor: TypeScript.IExpressionSyntax): ForStatementSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): ForStatementSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): ForStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ForInStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IIterationStatementSyntax {
        public forKeyword: TypeScript.ISyntaxToken;
        public openParenToken: TypeScript.ISyntaxToken;
        public variableDeclaration: VariableDeclarationSyntax;
        public left: TypeScript.IExpressionSyntax;
        public inKeyword: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        public closeParenToken: TypeScript.ISyntaxToken;
        public statement: TypeScript.IStatementSyntax;
        constructor(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, left: TypeScript.IExpressionSyntax, inKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isIterationStatement(): boolean;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, left: TypeScript.IExpressionSyntax, inKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): ForInStatementSyntax;
        static create(forKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, inKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): ForInStatementSyntax;
        static create1(expression: TypeScript.IExpressionSyntax, statement: TypeScript.IStatementSyntax): ForInStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ForInStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ForInStatementSyntax;
        public withForKeyword(forKeyword: TypeScript.ISyntaxToken): ForInStatementSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): ForInStatementSyntax;
        public withVariableDeclaration(variableDeclaration: VariableDeclarationSyntax): ForInStatementSyntax;
        public withLeft(left: TypeScript.IExpressionSyntax): ForInStatementSyntax;
        public withInKeyword(inKeyword: TypeScript.ISyntaxToken): ForInStatementSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): ForInStatementSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): ForInStatementSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): ForInStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class WhileStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IIterationStatementSyntax {
        public whileKeyword: TypeScript.ISyntaxToken;
        public openParenToken: TypeScript.ISyntaxToken;
        public condition: TypeScript.IExpressionSyntax;
        public closeParenToken: TypeScript.ISyntaxToken;
        public statement: TypeScript.IStatementSyntax;
        constructor(whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isIterationStatement(): boolean;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): WhileStatementSyntax;
        static create1(condition: TypeScript.IExpressionSyntax, statement: TypeScript.IStatementSyntax): WhileStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): WhileStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): WhileStatementSyntax;
        public withWhileKeyword(whileKeyword: TypeScript.ISyntaxToken): WhileStatementSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): WhileStatementSyntax;
        public withCondition(condition: TypeScript.IExpressionSyntax): WhileStatementSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): WhileStatementSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): WhileStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class WithStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public withKeyword: TypeScript.ISyntaxToken;
        public openParenToken: TypeScript.ISyntaxToken;
        public condition: TypeScript.IExpressionSyntax;
        public closeParenToken: TypeScript.ISyntaxToken;
        public statement: TypeScript.IStatementSyntax;
        constructor(withKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(withKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): WithStatementSyntax;
        static create1(condition: TypeScript.IExpressionSyntax, statement: TypeScript.IStatementSyntax): WithStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): WithStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): WithStatementSyntax;
        public withWithKeyword(withKeyword: TypeScript.ISyntaxToken): WithStatementSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): WithStatementSyntax;
        public withCondition(condition: TypeScript.IExpressionSyntax): WithStatementSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): WithStatementSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): WithStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class EnumDeclarationSyntax extends TypeScript.SyntaxNode implements TypeScript.IModuleElementSyntax {
        public modifiers: TypeScript.ISyntaxList;
        public enumKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public openBraceToken: TypeScript.ISyntaxToken;
        public enumElements: TypeScript.ISeparatedSyntaxList;
        public closeBraceToken: TypeScript.ISyntaxToken;
        constructor(modifiers: TypeScript.ISyntaxList, enumKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, enumElements: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isModuleElement(): boolean;
        public update(modifiers: TypeScript.ISyntaxList, enumKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, enumElements: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): EnumDeclarationSyntax;
        static create(enumKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, openBraceToken: TypeScript.ISyntaxToken, closeBraceToken: TypeScript.ISyntaxToken): EnumDeclarationSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): EnumDeclarationSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): EnumDeclarationSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): EnumDeclarationSyntax;
        public withModifiers(modifiers: TypeScript.ISyntaxList): EnumDeclarationSyntax;
        public withModifier(modifier: TypeScript.ISyntaxToken): EnumDeclarationSyntax;
        public withEnumKeyword(enumKeyword: TypeScript.ISyntaxToken): EnumDeclarationSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): EnumDeclarationSyntax;
        public withOpenBraceToken(openBraceToken: TypeScript.ISyntaxToken): EnumDeclarationSyntax;
        public withEnumElements(enumElements: TypeScript.ISeparatedSyntaxList): EnumDeclarationSyntax;
        public withEnumElement(enumElement: EnumElementSyntax): EnumDeclarationSyntax;
        public withCloseBraceToken(closeBraceToken: TypeScript.ISyntaxToken): EnumDeclarationSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class EnumElementSyntax extends TypeScript.SyntaxNode {
        public propertyName: TypeScript.ISyntaxToken;
        public equalsValueClause: EqualsValueClauseSyntax;
        constructor(propertyName: TypeScript.ISyntaxToken, equalsValueClause: EqualsValueClauseSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(propertyName: TypeScript.ISyntaxToken, equalsValueClause: EqualsValueClauseSyntax): EnumElementSyntax;
        static create(propertyName: TypeScript.ISyntaxToken): EnumElementSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken): EnumElementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): EnumElementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): EnumElementSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): EnumElementSyntax;
        public withEqualsValueClause(equalsValueClause: EqualsValueClauseSyntax): EnumElementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class CastExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public lessThanToken: TypeScript.ISyntaxToken;
        public type: TypeScript.ITypeSyntax;
        public greaterThanToken: TypeScript.ISyntaxToken;
        public expression: TypeScript.IUnaryExpressionSyntax;
        constructor(lessThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, greaterThanToken: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(lessThanToken: TypeScript.ISyntaxToken, type: TypeScript.ITypeSyntax, greaterThanToken: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): CastExpressionSyntax;
        static create1(type: TypeScript.ITypeSyntax, expression: TypeScript.IUnaryExpressionSyntax): CastExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): CastExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): CastExpressionSyntax;
        public withLessThanToken(lessThanToken: TypeScript.ISyntaxToken): CastExpressionSyntax;
        public withType(type: TypeScript.ITypeSyntax): CastExpressionSyntax;
        public withGreaterThanToken(greaterThanToken: TypeScript.ISyntaxToken): CastExpressionSyntax;
        public withExpression(expression: TypeScript.IUnaryExpressionSyntax): CastExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class ObjectLiteralExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IPrimaryExpressionSyntax {
        public openBraceToken: TypeScript.ISyntaxToken;
        public propertyAssignments: TypeScript.ISeparatedSyntaxList;
        public closeBraceToken: TypeScript.ISyntaxToken;
        constructor(openBraceToken: TypeScript.ISyntaxToken, propertyAssignments: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isPrimaryExpression(): boolean;
        public isMemberExpression(): boolean;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(openBraceToken: TypeScript.ISyntaxToken, propertyAssignments: TypeScript.ISeparatedSyntaxList, closeBraceToken: TypeScript.ISyntaxToken): ObjectLiteralExpressionSyntax;
        static create(openBraceToken: TypeScript.ISyntaxToken, closeBraceToken: TypeScript.ISyntaxToken): ObjectLiteralExpressionSyntax;
        static create1(): ObjectLiteralExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): ObjectLiteralExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): ObjectLiteralExpressionSyntax;
        public withOpenBraceToken(openBraceToken: TypeScript.ISyntaxToken): ObjectLiteralExpressionSyntax;
        public withPropertyAssignments(propertyAssignments: TypeScript.ISeparatedSyntaxList): ObjectLiteralExpressionSyntax;
        public withPropertyAssignment(propertyAssignment: TypeScript.IPropertyAssignmentSyntax): ObjectLiteralExpressionSyntax;
        public withCloseBraceToken(closeBraceToken: TypeScript.ISyntaxToken): ObjectLiteralExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class SimplePropertyAssignmentSyntax extends TypeScript.SyntaxNode implements TypeScript.IPropertyAssignmentSyntax {
        public propertyName: TypeScript.ISyntaxToken;
        public colonToken: TypeScript.ISyntaxToken;
        public expression: TypeScript.IExpressionSyntax;
        constructor(propertyName: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isPropertyAssignment(): boolean;
        public update(propertyName: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): SimplePropertyAssignmentSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken, expression: TypeScript.IExpressionSyntax): SimplePropertyAssignmentSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): SimplePropertyAssignmentSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): SimplePropertyAssignmentSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): SimplePropertyAssignmentSyntax;
        public withColonToken(colonToken: TypeScript.ISyntaxToken): SimplePropertyAssignmentSyntax;
        public withExpression(expression: TypeScript.IExpressionSyntax): SimplePropertyAssignmentSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class FunctionPropertyAssignmentSyntax extends TypeScript.SyntaxNode implements TypeScript.IPropertyAssignmentSyntax {
        public propertyName: TypeScript.ISyntaxToken;
        public callSignature: CallSignatureSyntax;
        public block: BlockSyntax;
        constructor(propertyName: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isPropertyAssignment(): boolean;
        public update(propertyName: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionPropertyAssignmentSyntax;
        static create1(propertyName: TypeScript.ISyntaxToken): FunctionPropertyAssignmentSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): FunctionPropertyAssignmentSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): FunctionPropertyAssignmentSyntax;
        public withPropertyName(propertyName: TypeScript.ISyntaxToken): FunctionPropertyAssignmentSyntax;
        public withCallSignature(callSignature: CallSignatureSyntax): FunctionPropertyAssignmentSyntax;
        public withBlock(block: BlockSyntax): FunctionPropertyAssignmentSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class FunctionExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IPrimaryExpressionSyntax {
        public functionKeyword: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public callSignature: CallSignatureSyntax;
        public block: BlockSyntax;
        constructor(functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isPrimaryExpression(): boolean;
        public isMemberExpression(): boolean;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(functionKeyword: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionExpressionSyntax;
        static create(functionKeyword: TypeScript.ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionExpressionSyntax;
        static create1(): FunctionExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): FunctionExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): FunctionExpressionSyntax;
        public withFunctionKeyword(functionKeyword: TypeScript.ISyntaxToken): FunctionExpressionSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): FunctionExpressionSyntax;
        public withCallSignature(callSignature: CallSignatureSyntax): FunctionExpressionSyntax;
        public withBlock(block: BlockSyntax): FunctionExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class EmptyStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(semicolonToken: TypeScript.ISyntaxToken): EmptyStatementSyntax;
        static create1(): EmptyStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): EmptyStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): EmptyStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): EmptyStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class TryStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public tryKeyword: TypeScript.ISyntaxToken;
        public block: BlockSyntax;
        public catchClause: CatchClauseSyntax;
        public finallyClause: FinallyClauseSyntax;
        constructor(tryKeyword: TypeScript.ISyntaxToken, block: BlockSyntax, catchClause: CatchClauseSyntax, finallyClause: FinallyClauseSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(tryKeyword: TypeScript.ISyntaxToken, block: BlockSyntax, catchClause: CatchClauseSyntax, finallyClause: FinallyClauseSyntax): TryStatementSyntax;
        static create(tryKeyword: TypeScript.ISyntaxToken, block: BlockSyntax): TryStatementSyntax;
        static create1(): TryStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): TryStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): TryStatementSyntax;
        public withTryKeyword(tryKeyword: TypeScript.ISyntaxToken): TryStatementSyntax;
        public withBlock(block: BlockSyntax): TryStatementSyntax;
        public withCatchClause(catchClause: CatchClauseSyntax): TryStatementSyntax;
        public withFinallyClause(finallyClause: FinallyClauseSyntax): TryStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class CatchClauseSyntax extends TypeScript.SyntaxNode {
        public catchKeyword: TypeScript.ISyntaxToken;
        public openParenToken: TypeScript.ISyntaxToken;
        public identifier: TypeScript.ISyntaxToken;
        public typeAnnotation: TypeAnnotationSyntax;
        public closeParenToken: TypeScript.ISyntaxToken;
        public block: BlockSyntax;
        constructor(catchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, closeParenToken: TypeScript.ISyntaxToken, block: BlockSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(catchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, closeParenToken: TypeScript.ISyntaxToken, block: BlockSyntax): CatchClauseSyntax;
        static create(catchKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, identifier: TypeScript.ISyntaxToken, closeParenToken: TypeScript.ISyntaxToken, block: BlockSyntax): CatchClauseSyntax;
        static create1(identifier: TypeScript.ISyntaxToken): CatchClauseSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): CatchClauseSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): CatchClauseSyntax;
        public withCatchKeyword(catchKeyword: TypeScript.ISyntaxToken): CatchClauseSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): CatchClauseSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): CatchClauseSyntax;
        public withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): CatchClauseSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): CatchClauseSyntax;
        public withBlock(block: BlockSyntax): CatchClauseSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class FinallyClauseSyntax extends TypeScript.SyntaxNode {
        public finallyKeyword: TypeScript.ISyntaxToken;
        public block: BlockSyntax;
        constructor(finallyKeyword: TypeScript.ISyntaxToken, block: BlockSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public update(finallyKeyword: TypeScript.ISyntaxToken, block: BlockSyntax): FinallyClauseSyntax;
        static create1(): FinallyClauseSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): FinallyClauseSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): FinallyClauseSyntax;
        public withFinallyKeyword(finallyKeyword: TypeScript.ISyntaxToken): FinallyClauseSyntax;
        public withBlock(block: BlockSyntax): FinallyClauseSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class LabeledStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public identifier: TypeScript.ISyntaxToken;
        public colonToken: TypeScript.ISyntaxToken;
        public statement: TypeScript.IStatementSyntax;
        constructor(identifier: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(identifier: TypeScript.ISyntaxToken, colonToken: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): LabeledStatementSyntax;
        static create1(identifier: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax): LabeledStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): LabeledStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): LabeledStatementSyntax;
        public withIdentifier(identifier: TypeScript.ISyntaxToken): LabeledStatementSyntax;
        public withColonToken(colonToken: TypeScript.ISyntaxToken): LabeledStatementSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): LabeledStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class DoStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IIterationStatementSyntax {
        public doKeyword: TypeScript.ISyntaxToken;
        public statement: TypeScript.IStatementSyntax;
        public whileKeyword: TypeScript.ISyntaxToken;
        public openParenToken: TypeScript.ISyntaxToken;
        public condition: TypeScript.IExpressionSyntax;
        public closeParenToken: TypeScript.ISyntaxToken;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(doKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isIterationStatement(): boolean;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(doKeyword: TypeScript.ISyntaxToken, statement: TypeScript.IStatementSyntax, whileKeyword: TypeScript.ISyntaxToken, openParenToken: TypeScript.ISyntaxToken, condition: TypeScript.IExpressionSyntax, closeParenToken: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): DoStatementSyntax;
        static create1(statement: TypeScript.IStatementSyntax, condition: TypeScript.IExpressionSyntax): DoStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): DoStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): DoStatementSyntax;
        public withDoKeyword(doKeyword: TypeScript.ISyntaxToken): DoStatementSyntax;
        public withStatement(statement: TypeScript.IStatementSyntax): DoStatementSyntax;
        public withWhileKeyword(whileKeyword: TypeScript.ISyntaxToken): DoStatementSyntax;
        public withOpenParenToken(openParenToken: TypeScript.ISyntaxToken): DoStatementSyntax;
        public withCondition(condition: TypeScript.IExpressionSyntax): DoStatementSyntax;
        public withCloseParenToken(closeParenToken: TypeScript.ISyntaxToken): DoStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): DoStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class TypeOfExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public typeOfKeyword: TypeScript.ISyntaxToken;
        public expression: TypeScript.IUnaryExpressionSyntax;
        constructor(typeOfKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(typeOfKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): TypeOfExpressionSyntax;
        static create1(expression: TypeScript.IUnaryExpressionSyntax): TypeOfExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeOfExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): TypeOfExpressionSyntax;
        public withTypeOfKeyword(typeOfKeyword: TypeScript.ISyntaxToken): TypeOfExpressionSyntax;
        public withExpression(expression: TypeScript.IUnaryExpressionSyntax): TypeOfExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class DeleteExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public deleteKeyword: TypeScript.ISyntaxToken;
        public expression: TypeScript.IUnaryExpressionSyntax;
        constructor(deleteKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(deleteKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): DeleteExpressionSyntax;
        static create1(expression: TypeScript.IUnaryExpressionSyntax): DeleteExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): DeleteExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): DeleteExpressionSyntax;
        public withDeleteKeyword(deleteKeyword: TypeScript.ISyntaxToken): DeleteExpressionSyntax;
        public withExpression(expression: TypeScript.IUnaryExpressionSyntax): DeleteExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class VoidExpressionSyntax extends TypeScript.SyntaxNode implements TypeScript.IUnaryExpressionSyntax {
        public voidKeyword: TypeScript.ISyntaxToken;
        public expression: TypeScript.IUnaryExpressionSyntax;
        constructor(voidKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isUnaryExpression(): boolean;
        public isExpression(): boolean;
        public update(voidKeyword: TypeScript.ISyntaxToken, expression: TypeScript.IUnaryExpressionSyntax): VoidExpressionSyntax;
        static create1(expression: TypeScript.IUnaryExpressionSyntax): VoidExpressionSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): VoidExpressionSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): VoidExpressionSyntax;
        public withVoidKeyword(voidKeyword: TypeScript.ISyntaxToken): VoidExpressionSyntax;
        public withExpression(expression: TypeScript.IUnaryExpressionSyntax): VoidExpressionSyntax;
        public isTypeScriptSpecific(): boolean;
    }
    class DebuggerStatementSyntax extends TypeScript.SyntaxNode implements TypeScript.IStatementSyntax {
        public debuggerKeyword: TypeScript.ISyntaxToken;
        public semicolonToken: TypeScript.ISyntaxToken;
        constructor(debuggerKeyword: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken, parsedInStrictMode: boolean);
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(slot: number): TypeScript.ISyntaxElement;
        public isStatement(): boolean;
        public isModuleElement(): boolean;
        public update(debuggerKeyword: TypeScript.ISyntaxToken, semicolonToken: TypeScript.ISyntaxToken): DebuggerStatementSyntax;
        static create1(): DebuggerStatementSyntax;
        public withLeadingTrivia(trivia: TypeScript.ISyntaxTriviaList): DebuggerStatementSyntax;
        public withTrailingTrivia(trivia: TypeScript.ISyntaxTriviaList): DebuggerStatementSyntax;
        public withDebuggerKeyword(debuggerKeyword: TypeScript.ISyntaxToken): DebuggerStatementSyntax;
        public withSemicolonToken(semicolonToken: TypeScript.ISyntaxToken): DebuggerStatementSyntax;
        public isTypeScriptSpecific(): boolean;
    }
}
declare module TypeScript {
    class SyntaxRewriter implements TypeScript.ISyntaxVisitor {
        public visitToken(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxToken;
        public visitNode(node: TypeScript.SyntaxNode): TypeScript.SyntaxNode;
        public visitNodeOrToken(node: TypeScript.ISyntaxNodeOrToken): TypeScript.ISyntaxNodeOrToken;
        public visitList(list: TypeScript.ISyntaxList): TypeScript.ISyntaxList;
        public visitSeparatedList(list: TypeScript.ISeparatedSyntaxList): TypeScript.ISeparatedSyntaxList;
        public visitSourceUnit(node: TypeScript.SourceUnitSyntax): any;
        public visitExternalModuleReference(node: TypeScript.ExternalModuleReferenceSyntax): any;
        public visitModuleNameModuleReference(node: TypeScript.ModuleNameModuleReferenceSyntax): any;
        public visitImportDeclaration(node: TypeScript.ImportDeclarationSyntax): any;
        public visitExportAssignment(node: TypeScript.ExportAssignmentSyntax): any;
        public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): any;
        public visitInterfaceDeclaration(node: TypeScript.InterfaceDeclarationSyntax): any;
        public visitHeritageClause(node: TypeScript.HeritageClauseSyntax): any;
        public visitModuleDeclaration(node: TypeScript.ModuleDeclarationSyntax): any;
        public visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): any;
        public visitVariableStatement(node: TypeScript.VariableStatementSyntax): any;
        public visitVariableDeclaration(node: TypeScript.VariableDeclarationSyntax): any;
        public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): any;
        public visitEqualsValueClause(node: TypeScript.EqualsValueClauseSyntax): any;
        public visitPrefixUnaryExpression(node: TypeScript.PrefixUnaryExpressionSyntax): any;
        public visitArrayLiteralExpression(node: TypeScript.ArrayLiteralExpressionSyntax): any;
        public visitOmittedExpression(node: TypeScript.OmittedExpressionSyntax): any;
        public visitParenthesizedExpression(node: TypeScript.ParenthesizedExpressionSyntax): any;
        public visitSimpleArrowFunctionExpression(node: TypeScript.SimpleArrowFunctionExpressionSyntax): any;
        public visitParenthesizedArrowFunctionExpression(node: TypeScript.ParenthesizedArrowFunctionExpressionSyntax): any;
        public visitQualifiedName(node: TypeScript.QualifiedNameSyntax): any;
        public visitTypeArgumentList(node: TypeScript.TypeArgumentListSyntax): any;
        public visitConstructorType(node: TypeScript.ConstructorTypeSyntax): any;
        public visitFunctionType(node: TypeScript.FunctionTypeSyntax): any;
        public visitObjectType(node: TypeScript.ObjectTypeSyntax): any;
        public visitArrayType(node: TypeScript.ArrayTypeSyntax): any;
        public visitGenericType(node: TypeScript.GenericTypeSyntax): any;
        public visitTypeQuery(node: TypeScript.TypeQuerySyntax): any;
        public visitTypeAnnotation(node: TypeScript.TypeAnnotationSyntax): any;
        public visitBlock(node: TypeScript.BlockSyntax): any;
        public visitParameter(node: TypeScript.ParameterSyntax): any;
        public visitMemberAccessExpression(node: TypeScript.MemberAccessExpressionSyntax): any;
        public visitPostfixUnaryExpression(node: TypeScript.PostfixUnaryExpressionSyntax): any;
        public visitElementAccessExpression(node: TypeScript.ElementAccessExpressionSyntax): any;
        public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax): any;
        public visitArgumentList(node: TypeScript.ArgumentListSyntax): any;
        public visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax): any;
        public visitConditionalExpression(node: TypeScript.ConditionalExpressionSyntax): any;
        public visitConstructSignature(node: TypeScript.ConstructSignatureSyntax): any;
        public visitMethodSignature(node: TypeScript.MethodSignatureSyntax): any;
        public visitIndexSignature(node: TypeScript.IndexSignatureSyntax): any;
        public visitPropertySignature(node: TypeScript.PropertySignatureSyntax): any;
        public visitCallSignature(node: TypeScript.CallSignatureSyntax): any;
        public visitParameterList(node: TypeScript.ParameterListSyntax): any;
        public visitTypeParameterList(node: TypeScript.TypeParameterListSyntax): any;
        public visitTypeParameter(node: TypeScript.TypeParameterSyntax): any;
        public visitConstraint(node: TypeScript.ConstraintSyntax): any;
        public visitElseClause(node: TypeScript.ElseClauseSyntax): any;
        public visitIfStatement(node: TypeScript.IfStatementSyntax): any;
        public visitExpressionStatement(node: TypeScript.ExpressionStatementSyntax): any;
        public visitConstructorDeclaration(node: TypeScript.ConstructorDeclarationSyntax): any;
        public visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): any;
        public visitGetAccessor(node: TypeScript.GetAccessorSyntax): any;
        public visitSetAccessor(node: TypeScript.SetAccessorSyntax): any;
        public visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): any;
        public visitIndexMemberDeclaration(node: TypeScript.IndexMemberDeclarationSyntax): any;
        public visitThrowStatement(node: TypeScript.ThrowStatementSyntax): any;
        public visitReturnStatement(node: TypeScript.ReturnStatementSyntax): any;
        public visitObjectCreationExpression(node: TypeScript.ObjectCreationExpressionSyntax): any;
        public visitSwitchStatement(node: TypeScript.SwitchStatementSyntax): any;
        public visitCaseSwitchClause(node: TypeScript.CaseSwitchClauseSyntax): any;
        public visitDefaultSwitchClause(node: TypeScript.DefaultSwitchClauseSyntax): any;
        public visitBreakStatement(node: TypeScript.BreakStatementSyntax): any;
        public visitContinueStatement(node: TypeScript.ContinueStatementSyntax): any;
        public visitForStatement(node: TypeScript.ForStatementSyntax): any;
        public visitForInStatement(node: TypeScript.ForInStatementSyntax): any;
        public visitWhileStatement(node: TypeScript.WhileStatementSyntax): any;
        public visitWithStatement(node: TypeScript.WithStatementSyntax): any;
        public visitEnumDeclaration(node: TypeScript.EnumDeclarationSyntax): any;
        public visitEnumElement(node: TypeScript.EnumElementSyntax): any;
        public visitCastExpression(node: TypeScript.CastExpressionSyntax): any;
        public visitObjectLiteralExpression(node: TypeScript.ObjectLiteralExpressionSyntax): any;
        public visitSimplePropertyAssignment(node: TypeScript.SimplePropertyAssignmentSyntax): any;
        public visitFunctionPropertyAssignment(node: TypeScript.FunctionPropertyAssignmentSyntax): any;
        public visitFunctionExpression(node: TypeScript.FunctionExpressionSyntax): any;
        public visitEmptyStatement(node: TypeScript.EmptyStatementSyntax): any;
        public visitTryStatement(node: TypeScript.TryStatementSyntax): any;
        public visitCatchClause(node: TypeScript.CatchClauseSyntax): any;
        public visitFinallyClause(node: TypeScript.FinallyClauseSyntax): any;
        public visitLabeledStatement(node: TypeScript.LabeledStatementSyntax): any;
        public visitDoStatement(node: TypeScript.DoStatementSyntax): any;
        public visitTypeOfExpression(node: TypeScript.TypeOfExpressionSyntax): any;
        public visitDeleteExpression(node: TypeScript.DeleteExpressionSyntax): any;
        public visitVoidExpression(node: TypeScript.VoidExpressionSyntax): any;
        public visitDebuggerStatement(node: TypeScript.DebuggerStatementSyntax): any;
    }
}
declare module TypeScript {
    class SyntaxDedenter extends TypeScript.SyntaxRewriter {
        private dedentationAmount;
        private minimumIndent;
        private options;
        private lastTriviaWasNewLine;
        constructor(dedentFirstToken: boolean, dedentationAmount: number, minimumIndent: number, options: FormattingOptions);
        private abort();
        private isAborted();
        public visitToken(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxToken;
        private dedentTriviaList(triviaList);
        private dedentSegment(segment, hasFollowingNewLineTrivia);
        private dedentWhitespace(trivia, hasFollowingNewLineTrivia);
        private dedentMultiLineComment(trivia);
        static dedentNode(node: TypeScript.ISyntaxNode, dedentFirstToken: boolean, dedentAmount: number, minimumIndent: number, options: FormattingOptions): TypeScript.ISyntaxNode;
    }
}
declare module TypeScript {
    class SyntaxIndenter extends TypeScript.SyntaxRewriter {
        private indentationAmount;
        private options;
        private lastTriviaWasNewLine;
        private indentationTrivia;
        constructor(indentFirstToken: boolean, indentationAmount: number, options: FormattingOptions);
        public visitToken(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxToken;
        public indentTriviaList(triviaList: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxTriviaList;
        private indentSegment(segment);
        private indentWhitespace(trivia, indentThisTrivia, result);
        private indentSingleLineOrSkippedText(trivia, indentThisTrivia, result);
        private indentMultiLineComment(trivia, indentThisTrivia, result);
        static indentNode(node: TypeScript.ISyntaxNode, indentFirstToken: boolean, indentAmount: number, options: FormattingOptions): TypeScript.SyntaxNode;
        static indentNodes(nodes: TypeScript.SyntaxNode[], indentFirstToken: boolean, indentAmount: number, options: FormattingOptions): TypeScript.SyntaxNode[];
    }
}
declare module TypeScript.Syntax {
    class VariableWidthTokenWithNoTrivia implements TypeScript.ISyntaxToken {
        private _sourceText;
        private _fullStart;
        public tokenKind: TypeScript.SyntaxKind;
        private _textOrWidth;
        constructor(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, textOrWidth: any);
        public clone(): TypeScript.ISyntaxToken;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxElement;
        public fullWidth(): number;
        private start();
        private end();
        public width(): number;
        public text(): string;
        public fullText(): string;
        public value(): any;
        public valueText(): string;
        public hasLeadingTrivia(): boolean;
        public hasLeadingComment(): boolean;
        public hasLeadingNewLine(): boolean;
        public hasLeadingSkippedText(): boolean;
        public leadingTriviaWidth(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasTrailingTrivia(): boolean;
        public hasTrailingComment(): boolean;
        public hasTrailingNewLine(): boolean;
        public hasTrailingSkippedText(): boolean;
        public trailingTriviaWidth(): number;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasSkippedToken(): boolean;
        public toJSON(key: any): any;
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        private realize();
        public collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        public withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public isExpression(): boolean;
        public isPrimaryExpression(): boolean;
        public isMemberExpression(): boolean;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
    }
    class VariableWidthTokenWithLeadingTrivia implements TypeScript.ISyntaxToken {
        private _sourceText;
        private _fullStart;
        public tokenKind: TypeScript.SyntaxKind;
        private _leadingTriviaInfo;
        private _textOrWidth;
        constructor(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, leadingTriviaInfo: number, textOrWidth: any);
        public clone(): TypeScript.ISyntaxToken;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxElement;
        public fullWidth(): number;
        private start();
        private end();
        public width(): number;
        public text(): string;
        public fullText(): string;
        public value(): any;
        public valueText(): string;
        public hasLeadingTrivia(): boolean;
        public hasLeadingComment(): boolean;
        public hasLeadingNewLine(): boolean;
        public hasLeadingSkippedText(): boolean;
        public leadingTriviaWidth(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasTrailingTrivia(): boolean;
        public hasTrailingComment(): boolean;
        public hasTrailingNewLine(): boolean;
        public hasTrailingSkippedText(): boolean;
        public trailingTriviaWidth(): number;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasSkippedToken(): boolean;
        public toJSON(key: any): any;
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        private realize();
        public collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        public withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public isExpression(): boolean;
        public isPrimaryExpression(): boolean;
        public isMemberExpression(): boolean;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
    }
    class VariableWidthTokenWithTrailingTrivia implements TypeScript.ISyntaxToken {
        private _sourceText;
        private _fullStart;
        public tokenKind: TypeScript.SyntaxKind;
        private _textOrWidth;
        private _trailingTriviaInfo;
        constructor(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, textOrWidth: any, trailingTriviaInfo: number);
        public clone(): TypeScript.ISyntaxToken;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxElement;
        public fullWidth(): number;
        private start();
        private end();
        public width(): number;
        public text(): string;
        public fullText(): string;
        public value(): any;
        public valueText(): string;
        public hasLeadingTrivia(): boolean;
        public hasLeadingComment(): boolean;
        public hasLeadingNewLine(): boolean;
        public hasLeadingSkippedText(): boolean;
        public leadingTriviaWidth(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasTrailingTrivia(): boolean;
        public hasTrailingComment(): boolean;
        public hasTrailingNewLine(): boolean;
        public hasTrailingSkippedText(): boolean;
        public trailingTriviaWidth(): number;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasSkippedToken(): boolean;
        public toJSON(key: any): any;
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        private realize();
        public collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        public withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public isExpression(): boolean;
        public isPrimaryExpression(): boolean;
        public isMemberExpression(): boolean;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
    }
    class VariableWidthTokenWithLeadingAndTrailingTrivia implements TypeScript.ISyntaxToken {
        private _sourceText;
        private _fullStart;
        public tokenKind: TypeScript.SyntaxKind;
        private _leadingTriviaInfo;
        private _textOrWidth;
        private _trailingTriviaInfo;
        constructor(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, leadingTriviaInfo: number, textOrWidth: any, trailingTriviaInfo: number);
        public clone(): TypeScript.ISyntaxToken;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxElement;
        public fullWidth(): number;
        private start();
        private end();
        public width(): number;
        public text(): string;
        public fullText(): string;
        public value(): any;
        public valueText(): string;
        public hasLeadingTrivia(): boolean;
        public hasLeadingComment(): boolean;
        public hasLeadingNewLine(): boolean;
        public hasLeadingSkippedText(): boolean;
        public leadingTriviaWidth(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasTrailingTrivia(): boolean;
        public hasTrailingComment(): boolean;
        public hasTrailingNewLine(): boolean;
        public hasTrailingSkippedText(): boolean;
        public trailingTriviaWidth(): number;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasSkippedToken(): boolean;
        public toJSON(key: any): any;
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        private realize();
        public collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        public withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public isExpression(): boolean;
        public isPrimaryExpression(): boolean;
        public isMemberExpression(): boolean;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
    }
    class FixedWidthTokenWithNoTrivia implements TypeScript.ISyntaxToken {
        public tokenKind: TypeScript.SyntaxKind;
        constructor(kind: TypeScript.SyntaxKind);
        public clone(): TypeScript.ISyntaxToken;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxElement;
        public fullWidth(): number;
        public width(): number;
        public text(): string;
        public fullText(): string;
        public value(): any;
        public valueText(): string;
        public hasLeadingTrivia(): boolean;
        public hasLeadingComment(): boolean;
        public hasLeadingNewLine(): boolean;
        public hasLeadingSkippedText(): boolean;
        public leadingTriviaWidth(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasTrailingTrivia(): boolean;
        public hasTrailingComment(): boolean;
        public hasTrailingNewLine(): boolean;
        public hasTrailingSkippedText(): boolean;
        public trailingTriviaWidth(): number;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasSkippedToken(): boolean;
        public toJSON(key: any): any;
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        private realize();
        public collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        public withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public isExpression(): boolean;
        public isPrimaryExpression(): boolean;
        public isMemberExpression(): boolean;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
    }
    class FixedWidthTokenWithLeadingTrivia implements TypeScript.ISyntaxToken {
        private _sourceText;
        private _fullStart;
        public tokenKind: TypeScript.SyntaxKind;
        private _leadingTriviaInfo;
        constructor(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, leadingTriviaInfo: number);
        public clone(): TypeScript.ISyntaxToken;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxElement;
        public fullWidth(): number;
        private start();
        private end();
        public width(): number;
        public text(): string;
        public fullText(): string;
        public value(): any;
        public valueText(): string;
        public hasLeadingTrivia(): boolean;
        public hasLeadingComment(): boolean;
        public hasLeadingNewLine(): boolean;
        public hasLeadingSkippedText(): boolean;
        public leadingTriviaWidth(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasTrailingTrivia(): boolean;
        public hasTrailingComment(): boolean;
        public hasTrailingNewLine(): boolean;
        public hasTrailingSkippedText(): boolean;
        public trailingTriviaWidth(): number;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasSkippedToken(): boolean;
        public toJSON(key: any): any;
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        private realize();
        public collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        public withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public isExpression(): boolean;
        public isPrimaryExpression(): boolean;
        public isMemberExpression(): boolean;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
    }
    class FixedWidthTokenWithTrailingTrivia implements TypeScript.ISyntaxToken {
        private _sourceText;
        private _fullStart;
        public tokenKind: TypeScript.SyntaxKind;
        private _trailingTriviaInfo;
        constructor(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, trailingTriviaInfo: number);
        public clone(): TypeScript.ISyntaxToken;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxElement;
        public fullWidth(): number;
        private start();
        private end();
        public width(): number;
        public text(): string;
        public fullText(): string;
        public value(): any;
        public valueText(): string;
        public hasLeadingTrivia(): boolean;
        public hasLeadingComment(): boolean;
        public hasLeadingNewLine(): boolean;
        public hasLeadingSkippedText(): boolean;
        public leadingTriviaWidth(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasTrailingTrivia(): boolean;
        public hasTrailingComment(): boolean;
        public hasTrailingNewLine(): boolean;
        public hasTrailingSkippedText(): boolean;
        public trailingTriviaWidth(): number;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasSkippedToken(): boolean;
        public toJSON(key: any): any;
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        private realize();
        public collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        public withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public isExpression(): boolean;
        public isPrimaryExpression(): boolean;
        public isMemberExpression(): boolean;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
    }
    class FixedWidthTokenWithLeadingAndTrailingTrivia implements TypeScript.ISyntaxToken {
        private _sourceText;
        private _fullStart;
        public tokenKind: TypeScript.SyntaxKind;
        private _leadingTriviaInfo;
        private _trailingTriviaInfo;
        constructor(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, leadingTriviaInfo: number, trailingTriviaInfo: number);
        public clone(): TypeScript.ISyntaxToken;
        public isNode(): boolean;
        public isToken(): boolean;
        public isList(): boolean;
        public isSeparatedList(): boolean;
        public kind(): TypeScript.SyntaxKind;
        public childCount(): number;
        public childAt(index: number): TypeScript.ISyntaxElement;
        public fullWidth(): number;
        private start();
        private end();
        public width(): number;
        public text(): string;
        public fullText(): string;
        public value(): any;
        public valueText(): string;
        public hasLeadingTrivia(): boolean;
        public hasLeadingComment(): boolean;
        public hasLeadingNewLine(): boolean;
        public hasLeadingSkippedText(): boolean;
        public leadingTriviaWidth(): number;
        public leadingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasTrailingTrivia(): boolean;
        public hasTrailingComment(): boolean;
        public hasTrailingNewLine(): boolean;
        public hasTrailingSkippedText(): boolean;
        public trailingTriviaWidth(): number;
        public trailingTrivia(): TypeScript.ISyntaxTriviaList;
        public hasSkippedToken(): boolean;
        public toJSON(key: any): any;
        public firstToken(): TypeScript.ISyntaxToken;
        public lastToken(): TypeScript.ISyntaxToken;
        public isTypeScriptSpecific(): boolean;
        public isIncrementallyUnusable(): boolean;
        public accept(visitor: TypeScript.ISyntaxVisitor): any;
        private realize();
        public collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        public withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): TypeScript.ISyntaxToken;
        public isExpression(): boolean;
        public isPrimaryExpression(): boolean;
        public isMemberExpression(): boolean;
        public isPostfixExpression(): boolean;
        public isUnaryExpression(): boolean;
    }
    function fixedWidthToken(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, leadingTriviaInfo: number, trailingTriviaInfo: number): TypeScript.ISyntaxToken;
    function variableWidthToken(sourceText: TypeScript.ISimpleText, fullStart: number, kind: TypeScript.SyntaxKind, leadingTriviaInfo: number, width: number, trailingTriviaInfo: number): TypeScript.ISyntaxToken;
}
declare module TypeScript {
    interface ISyntaxToken extends TypeScript.ISyntaxNodeOrToken, TypeScript.INameSyntax, TypeScript.IPrimaryExpressionSyntax {
        tokenKind: TypeScript.SyntaxKind;
        text(): string;
        value(): any;
        valueText(): string;
        hasLeadingTrivia(): boolean;
        hasLeadingComment(): boolean;
        hasLeadingNewLine(): boolean;
        hasLeadingSkippedText(): boolean;
        hasTrailingTrivia(): boolean;
        hasTrailingComment(): boolean;
        hasTrailingNewLine(): boolean;
        hasTrailingSkippedText(): boolean;
        hasSkippedToken(): boolean;
        leadingTrivia(): TypeScript.ISyntaxTriviaList;
        trailingTrivia(): TypeScript.ISyntaxTriviaList;
        withLeadingTrivia(leadingTrivia: TypeScript.ISyntaxTriviaList): ISyntaxToken;
        withTrailingTrivia(trailingTrivia: TypeScript.ISyntaxTriviaList): ISyntaxToken;
        clone(): ISyntaxToken;
    }
    interface ITokenInfo {
        leadingTrivia?: TypeScript.ISyntaxTrivia[];
        text?: string;
        trailingTrivia?: TypeScript.ISyntaxTrivia[];
    }
}
declare module TypeScript.Syntax {
    function isExpression(token: TypeScript.ISyntaxToken): boolean;
    function realizeToken(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxToken;
    function convertToIdentifierName(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxToken;
    function tokenToJSON(token: TypeScript.ISyntaxToken): any;
    function value(token: TypeScript.ISyntaxToken): any;
    function massageEscapes(text: string): string;
    function valueText(token: TypeScript.ISyntaxToken): string;
    function emptyToken(kind: TypeScript.SyntaxKind): TypeScript.ISyntaxToken;
    function token(kind: TypeScript.SyntaxKind, info?: TypeScript.ITokenInfo): TypeScript.ISyntaxToken;
    function identifier(text: string, info?: TypeScript.ITokenInfo): TypeScript.ISyntaxToken;
}
declare module TypeScript {
    class SyntaxTokenReplacer extends TypeScript.SyntaxRewriter {
        private token1;
        private token2;
        constructor(token1: TypeScript.ISyntaxToken, token2: TypeScript.ISyntaxToken);
        public visitToken(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxToken;
        public visitNode(node: TypeScript.SyntaxNode): TypeScript.SyntaxNode;
        public visitList(list: TypeScript.ISyntaxList): TypeScript.ISyntaxList;
        public visitSeparatedList(list: TypeScript.ISeparatedSyntaxList): TypeScript.ISeparatedSyntaxList;
    }
}
declare module TypeScript {
    interface ISyntaxTrivia {
        kind(): TypeScript.SyntaxKind;
        isWhitespace(): boolean;
        isComment(): boolean;
        isNewLine(): boolean;
        isSkippedToken(): boolean;
        fullWidth(): number;
        fullText(): string;
        skippedToken(): TypeScript.ISyntaxToken;
    }
}
declare module TypeScript.Syntax {
    function deferredTrivia(kind: TypeScript.SyntaxKind, text: TypeScript.ISimpleText, fullStart: number, fullWidth: number): TypeScript.ISyntaxTrivia;
    function trivia(kind: TypeScript.SyntaxKind, text: string): TypeScript.ISyntaxTrivia;
    function skippedTokenTrivia(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxTrivia;
    function spaces(count: number): TypeScript.ISyntaxTrivia;
    function whitespace(text: string): TypeScript.ISyntaxTrivia;
    function multiLineComment(text: string): TypeScript.ISyntaxTrivia;
    function singleLineComment(text: string): TypeScript.ISyntaxTrivia;
    var spaceTrivia: TypeScript.ISyntaxTrivia;
    var lineFeedTrivia: TypeScript.ISyntaxTrivia;
    var carriageReturnTrivia: TypeScript.ISyntaxTrivia;
    var carriageReturnLineFeedTrivia: TypeScript.ISyntaxTrivia;
    function splitMultiLineCommentTriviaIntoMultipleLines(trivia: TypeScript.ISyntaxTrivia): string[];
}
declare module TypeScript {
    interface ISyntaxTriviaList {
        count(): number;
        syntaxTriviaAt(index: number): TypeScript.ISyntaxTrivia;
        fullWidth(): number;
        fullText(): string;
        hasComment(): boolean;
        hasNewLine(): boolean;
        hasSkippedToken(): boolean;
        last(): TypeScript.ISyntaxTrivia;
        toArray(): TypeScript.ISyntaxTrivia[];
        concat(trivia: ISyntaxTriviaList): ISyntaxTriviaList;
        collectTextElements(elements: string[]): void;
    }
}
declare module TypeScript.Syntax {
    var emptyTriviaList: TypeScript.ISyntaxTriviaList;
    function triviaList(trivia: TypeScript.ISyntaxTrivia[]): TypeScript.ISyntaxTriviaList;
    var spaceTriviaList: TypeScript.ISyntaxTriviaList;
}
declare module TypeScript {
    class SyntaxUtilities {
        static isAngleBracket(positionedElement: TypeScript.PositionedElement): boolean;
        static getToken(list: TypeScript.ISyntaxList, kind: TypeScript.SyntaxKind): TypeScript.ISyntaxToken;
        static containsToken(list: TypeScript.ISyntaxList, kind: TypeScript.SyntaxKind): boolean;
        static hasExportKeyword(moduleElement: TypeScript.IModuleElementSyntax): boolean;
        static getExportKeyword(moduleElement: TypeScript.IModuleElementSyntax): TypeScript.ISyntaxToken;
        static isAmbientDeclarationSyntax(positionNode: TypeScript.PositionedNode): boolean;
    }
}
declare module TypeScript {
    interface ISyntaxVisitor {
        visitToken(token: TypeScript.ISyntaxToken): any;
        visitSourceUnit(node: TypeScript.SourceUnitSyntax): any;
        visitExternalModuleReference(node: TypeScript.ExternalModuleReferenceSyntax): any;
        visitModuleNameModuleReference(node: TypeScript.ModuleNameModuleReferenceSyntax): any;
        visitImportDeclaration(node: TypeScript.ImportDeclarationSyntax): any;
        visitExportAssignment(node: TypeScript.ExportAssignmentSyntax): any;
        visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): any;
        visitInterfaceDeclaration(node: TypeScript.InterfaceDeclarationSyntax): any;
        visitHeritageClause(node: TypeScript.HeritageClauseSyntax): any;
        visitModuleDeclaration(node: TypeScript.ModuleDeclarationSyntax): any;
        visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): any;
        visitVariableStatement(node: TypeScript.VariableStatementSyntax): any;
        visitVariableDeclaration(node: TypeScript.VariableDeclarationSyntax): any;
        visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): any;
        visitEqualsValueClause(node: TypeScript.EqualsValueClauseSyntax): any;
        visitPrefixUnaryExpression(node: TypeScript.PrefixUnaryExpressionSyntax): any;
        visitArrayLiteralExpression(node: TypeScript.ArrayLiteralExpressionSyntax): any;
        visitOmittedExpression(node: TypeScript.OmittedExpressionSyntax): any;
        visitParenthesizedExpression(node: TypeScript.ParenthesizedExpressionSyntax): any;
        visitSimpleArrowFunctionExpression(node: TypeScript.SimpleArrowFunctionExpressionSyntax): any;
        visitParenthesizedArrowFunctionExpression(node: TypeScript.ParenthesizedArrowFunctionExpressionSyntax): any;
        visitQualifiedName(node: TypeScript.QualifiedNameSyntax): any;
        visitTypeArgumentList(node: TypeScript.TypeArgumentListSyntax): any;
        visitConstructorType(node: TypeScript.ConstructorTypeSyntax): any;
        visitFunctionType(node: TypeScript.FunctionTypeSyntax): any;
        visitObjectType(node: TypeScript.ObjectTypeSyntax): any;
        visitArrayType(node: TypeScript.ArrayTypeSyntax): any;
        visitGenericType(node: TypeScript.GenericTypeSyntax): any;
        visitTypeQuery(node: TypeScript.TypeQuerySyntax): any;
        visitTypeAnnotation(node: TypeScript.TypeAnnotationSyntax): any;
        visitBlock(node: TypeScript.BlockSyntax): any;
        visitParameter(node: TypeScript.ParameterSyntax): any;
        visitMemberAccessExpression(node: TypeScript.MemberAccessExpressionSyntax): any;
        visitPostfixUnaryExpression(node: TypeScript.PostfixUnaryExpressionSyntax): any;
        visitElementAccessExpression(node: TypeScript.ElementAccessExpressionSyntax): any;
        visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax): any;
        visitArgumentList(node: TypeScript.ArgumentListSyntax): any;
        visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax): any;
        visitConditionalExpression(node: TypeScript.ConditionalExpressionSyntax): any;
        visitConstructSignature(node: TypeScript.ConstructSignatureSyntax): any;
        visitMethodSignature(node: TypeScript.MethodSignatureSyntax): any;
        visitIndexSignature(node: TypeScript.IndexSignatureSyntax): any;
        visitPropertySignature(node: TypeScript.PropertySignatureSyntax): any;
        visitCallSignature(node: TypeScript.CallSignatureSyntax): any;
        visitParameterList(node: TypeScript.ParameterListSyntax): any;
        visitTypeParameterList(node: TypeScript.TypeParameterListSyntax): any;
        visitTypeParameter(node: TypeScript.TypeParameterSyntax): any;
        visitConstraint(node: TypeScript.ConstraintSyntax): any;
        visitElseClause(node: TypeScript.ElseClauseSyntax): any;
        visitIfStatement(node: TypeScript.IfStatementSyntax): any;
        visitExpressionStatement(node: TypeScript.ExpressionStatementSyntax): any;
        visitConstructorDeclaration(node: TypeScript.ConstructorDeclarationSyntax): any;
        visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): any;
        visitGetAccessor(node: TypeScript.GetAccessorSyntax): any;
        visitSetAccessor(node: TypeScript.SetAccessorSyntax): any;
        visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): any;
        visitIndexMemberDeclaration(node: TypeScript.IndexMemberDeclarationSyntax): any;
        visitThrowStatement(node: TypeScript.ThrowStatementSyntax): any;
        visitReturnStatement(node: TypeScript.ReturnStatementSyntax): any;
        visitObjectCreationExpression(node: TypeScript.ObjectCreationExpressionSyntax): any;
        visitSwitchStatement(node: TypeScript.SwitchStatementSyntax): any;
        visitCaseSwitchClause(node: TypeScript.CaseSwitchClauseSyntax): any;
        visitDefaultSwitchClause(node: TypeScript.DefaultSwitchClauseSyntax): any;
        visitBreakStatement(node: TypeScript.BreakStatementSyntax): any;
        visitContinueStatement(node: TypeScript.ContinueStatementSyntax): any;
        visitForStatement(node: TypeScript.ForStatementSyntax): any;
        visitForInStatement(node: TypeScript.ForInStatementSyntax): any;
        visitWhileStatement(node: TypeScript.WhileStatementSyntax): any;
        visitWithStatement(node: TypeScript.WithStatementSyntax): any;
        visitEnumDeclaration(node: TypeScript.EnumDeclarationSyntax): any;
        visitEnumElement(node: TypeScript.EnumElementSyntax): any;
        visitCastExpression(node: TypeScript.CastExpressionSyntax): any;
        visitObjectLiteralExpression(node: TypeScript.ObjectLiteralExpressionSyntax): any;
        visitSimplePropertyAssignment(node: TypeScript.SimplePropertyAssignmentSyntax): any;
        visitFunctionPropertyAssignment(node: TypeScript.FunctionPropertyAssignmentSyntax): any;
        visitFunctionExpression(node: TypeScript.FunctionExpressionSyntax): any;
        visitEmptyStatement(node: TypeScript.EmptyStatementSyntax): any;
        visitTryStatement(node: TypeScript.TryStatementSyntax): any;
        visitCatchClause(node: TypeScript.CatchClauseSyntax): any;
        visitFinallyClause(node: TypeScript.FinallyClauseSyntax): any;
        visitLabeledStatement(node: TypeScript.LabeledStatementSyntax): any;
        visitDoStatement(node: TypeScript.DoStatementSyntax): any;
        visitTypeOfExpression(node: TypeScript.TypeOfExpressionSyntax): any;
        visitDeleteExpression(node: TypeScript.DeleteExpressionSyntax): any;
        visitVoidExpression(node: TypeScript.VoidExpressionSyntax): any;
        visitDebuggerStatement(node: TypeScript.DebuggerStatementSyntax): any;
    }
    class SyntaxVisitor implements ISyntaxVisitor {
        public defaultVisit(node: TypeScript.ISyntaxNodeOrToken): any;
        public visitToken(token: TypeScript.ISyntaxToken): any;
        public visitSourceUnit(node: TypeScript.SourceUnitSyntax): any;
        public visitExternalModuleReference(node: TypeScript.ExternalModuleReferenceSyntax): any;
        public visitModuleNameModuleReference(node: TypeScript.ModuleNameModuleReferenceSyntax): any;
        public visitImportDeclaration(node: TypeScript.ImportDeclarationSyntax): any;
        public visitExportAssignment(node: TypeScript.ExportAssignmentSyntax): any;
        public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): any;
        public visitInterfaceDeclaration(node: TypeScript.InterfaceDeclarationSyntax): any;
        public visitHeritageClause(node: TypeScript.HeritageClauseSyntax): any;
        public visitModuleDeclaration(node: TypeScript.ModuleDeclarationSyntax): any;
        public visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): any;
        public visitVariableStatement(node: TypeScript.VariableStatementSyntax): any;
        public visitVariableDeclaration(node: TypeScript.VariableDeclarationSyntax): any;
        public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): any;
        public visitEqualsValueClause(node: TypeScript.EqualsValueClauseSyntax): any;
        public visitPrefixUnaryExpression(node: TypeScript.PrefixUnaryExpressionSyntax): any;
        public visitArrayLiteralExpression(node: TypeScript.ArrayLiteralExpressionSyntax): any;
        public visitOmittedExpression(node: TypeScript.OmittedExpressionSyntax): any;
        public visitParenthesizedExpression(node: TypeScript.ParenthesizedExpressionSyntax): any;
        public visitSimpleArrowFunctionExpression(node: TypeScript.SimpleArrowFunctionExpressionSyntax): any;
        public visitParenthesizedArrowFunctionExpression(node: TypeScript.ParenthesizedArrowFunctionExpressionSyntax): any;
        public visitQualifiedName(node: TypeScript.QualifiedNameSyntax): any;
        public visitTypeArgumentList(node: TypeScript.TypeArgumentListSyntax): any;
        public visitConstructorType(node: TypeScript.ConstructorTypeSyntax): any;
        public visitFunctionType(node: TypeScript.FunctionTypeSyntax): any;
        public visitObjectType(node: TypeScript.ObjectTypeSyntax): any;
        public visitArrayType(node: TypeScript.ArrayTypeSyntax): any;
        public visitGenericType(node: TypeScript.GenericTypeSyntax): any;
        public visitTypeQuery(node: TypeScript.TypeQuerySyntax): any;
        public visitTypeAnnotation(node: TypeScript.TypeAnnotationSyntax): any;
        public visitBlock(node: TypeScript.BlockSyntax): any;
        public visitParameter(node: TypeScript.ParameterSyntax): any;
        public visitMemberAccessExpression(node: TypeScript.MemberAccessExpressionSyntax): any;
        public visitPostfixUnaryExpression(node: TypeScript.PostfixUnaryExpressionSyntax): any;
        public visitElementAccessExpression(node: TypeScript.ElementAccessExpressionSyntax): any;
        public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax): any;
        public visitArgumentList(node: TypeScript.ArgumentListSyntax): any;
        public visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax): any;
        public visitConditionalExpression(node: TypeScript.ConditionalExpressionSyntax): any;
        public visitConstructSignature(node: TypeScript.ConstructSignatureSyntax): any;
        public visitMethodSignature(node: TypeScript.MethodSignatureSyntax): any;
        public visitIndexSignature(node: TypeScript.IndexSignatureSyntax): any;
        public visitPropertySignature(node: TypeScript.PropertySignatureSyntax): any;
        public visitCallSignature(node: TypeScript.CallSignatureSyntax): any;
        public visitParameterList(node: TypeScript.ParameterListSyntax): any;
        public visitTypeParameterList(node: TypeScript.TypeParameterListSyntax): any;
        public visitTypeParameter(node: TypeScript.TypeParameterSyntax): any;
        public visitConstraint(node: TypeScript.ConstraintSyntax): any;
        public visitElseClause(node: TypeScript.ElseClauseSyntax): any;
        public visitIfStatement(node: TypeScript.IfStatementSyntax): any;
        public visitExpressionStatement(node: TypeScript.ExpressionStatementSyntax): any;
        public visitConstructorDeclaration(node: TypeScript.ConstructorDeclarationSyntax): any;
        public visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): any;
        public visitGetAccessor(node: TypeScript.GetAccessorSyntax): any;
        public visitSetAccessor(node: TypeScript.SetAccessorSyntax): any;
        public visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): any;
        public visitIndexMemberDeclaration(node: TypeScript.IndexMemberDeclarationSyntax): any;
        public visitThrowStatement(node: TypeScript.ThrowStatementSyntax): any;
        public visitReturnStatement(node: TypeScript.ReturnStatementSyntax): any;
        public visitObjectCreationExpression(node: TypeScript.ObjectCreationExpressionSyntax): any;
        public visitSwitchStatement(node: TypeScript.SwitchStatementSyntax): any;
        public visitCaseSwitchClause(node: TypeScript.CaseSwitchClauseSyntax): any;
        public visitDefaultSwitchClause(node: TypeScript.DefaultSwitchClauseSyntax): any;
        public visitBreakStatement(node: TypeScript.BreakStatementSyntax): any;
        public visitContinueStatement(node: TypeScript.ContinueStatementSyntax): any;
        public visitForStatement(node: TypeScript.ForStatementSyntax): any;
        public visitForInStatement(node: TypeScript.ForInStatementSyntax): any;
        public visitWhileStatement(node: TypeScript.WhileStatementSyntax): any;
        public visitWithStatement(node: TypeScript.WithStatementSyntax): any;
        public visitEnumDeclaration(node: TypeScript.EnumDeclarationSyntax): any;
        public visitEnumElement(node: TypeScript.EnumElementSyntax): any;
        public visitCastExpression(node: TypeScript.CastExpressionSyntax): any;
        public visitObjectLiteralExpression(node: TypeScript.ObjectLiteralExpressionSyntax): any;
        public visitSimplePropertyAssignment(node: TypeScript.SimplePropertyAssignmentSyntax): any;
        public visitFunctionPropertyAssignment(node: TypeScript.FunctionPropertyAssignmentSyntax): any;
        public visitFunctionExpression(node: TypeScript.FunctionExpressionSyntax): any;
        public visitEmptyStatement(node: TypeScript.EmptyStatementSyntax): any;
        public visitTryStatement(node: TypeScript.TryStatementSyntax): any;
        public visitCatchClause(node: TypeScript.CatchClauseSyntax): any;
        public visitFinallyClause(node: TypeScript.FinallyClauseSyntax): any;
        public visitLabeledStatement(node: TypeScript.LabeledStatementSyntax): any;
        public visitDoStatement(node: TypeScript.DoStatementSyntax): any;
        public visitTypeOfExpression(node: TypeScript.TypeOfExpressionSyntax): any;
        public visitDeleteExpression(node: TypeScript.DeleteExpressionSyntax): any;
        public visitVoidExpression(node: TypeScript.VoidExpressionSyntax): any;
        public visitDebuggerStatement(node: TypeScript.DebuggerStatementSyntax): any;
    }
}
declare module TypeScript {
    class SyntaxWalker implements TypeScript.ISyntaxVisitor {
        public visitToken(token: TypeScript.ISyntaxToken): void;
        public visitNode(node: TypeScript.SyntaxNode): void;
        public visitNodeOrToken(nodeOrToken: TypeScript.ISyntaxNodeOrToken): void;
        private visitOptionalToken(token);
        public visitOptionalNode(node: TypeScript.SyntaxNode): void;
        public visitOptionalNodeOrToken(nodeOrToken: TypeScript.ISyntaxNodeOrToken): void;
        public visitList(list: TypeScript.ISyntaxList): void;
        public visitSeparatedList(list: TypeScript.ISeparatedSyntaxList): void;
        public visitSourceUnit(node: TypeScript.SourceUnitSyntax): void;
        public visitExternalModuleReference(node: TypeScript.ExternalModuleReferenceSyntax): void;
        public visitModuleNameModuleReference(node: TypeScript.ModuleNameModuleReferenceSyntax): void;
        public visitImportDeclaration(node: TypeScript.ImportDeclarationSyntax): void;
        public visitExportAssignment(node: TypeScript.ExportAssignmentSyntax): void;
        public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): void;
        public visitInterfaceDeclaration(node: TypeScript.InterfaceDeclarationSyntax): void;
        public visitHeritageClause(node: TypeScript.HeritageClauseSyntax): void;
        public visitModuleDeclaration(node: TypeScript.ModuleDeclarationSyntax): void;
        public visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): void;
        public visitVariableStatement(node: TypeScript.VariableStatementSyntax): void;
        public visitVariableDeclaration(node: TypeScript.VariableDeclarationSyntax): void;
        public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void;
        public visitEqualsValueClause(node: TypeScript.EqualsValueClauseSyntax): void;
        public visitPrefixUnaryExpression(node: TypeScript.PrefixUnaryExpressionSyntax): void;
        public visitArrayLiteralExpression(node: TypeScript.ArrayLiteralExpressionSyntax): void;
        public visitOmittedExpression(node: TypeScript.OmittedExpressionSyntax): void;
        public visitParenthesizedExpression(node: TypeScript.ParenthesizedExpressionSyntax): void;
        public visitSimpleArrowFunctionExpression(node: TypeScript.SimpleArrowFunctionExpressionSyntax): void;
        public visitParenthesizedArrowFunctionExpression(node: TypeScript.ParenthesizedArrowFunctionExpressionSyntax): void;
        public visitQualifiedName(node: TypeScript.QualifiedNameSyntax): void;
        public visitTypeArgumentList(node: TypeScript.TypeArgumentListSyntax): void;
        public visitConstructorType(node: TypeScript.ConstructorTypeSyntax): void;
        public visitFunctionType(node: TypeScript.FunctionTypeSyntax): void;
        public visitObjectType(node: TypeScript.ObjectTypeSyntax): void;
        public visitArrayType(node: TypeScript.ArrayTypeSyntax): void;
        public visitGenericType(node: TypeScript.GenericTypeSyntax): void;
        public visitTypeQuery(node: TypeScript.TypeQuerySyntax): void;
        public visitTypeAnnotation(node: TypeScript.TypeAnnotationSyntax): void;
        public visitBlock(node: TypeScript.BlockSyntax): void;
        public visitParameter(node: TypeScript.ParameterSyntax): void;
        public visitMemberAccessExpression(node: TypeScript.MemberAccessExpressionSyntax): void;
        public visitPostfixUnaryExpression(node: TypeScript.PostfixUnaryExpressionSyntax): void;
        public visitElementAccessExpression(node: TypeScript.ElementAccessExpressionSyntax): void;
        public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax): void;
        public visitArgumentList(node: TypeScript.ArgumentListSyntax): void;
        public visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax): void;
        public visitConditionalExpression(node: TypeScript.ConditionalExpressionSyntax): void;
        public visitConstructSignature(node: TypeScript.ConstructSignatureSyntax): void;
        public visitMethodSignature(node: TypeScript.MethodSignatureSyntax): void;
        public visitIndexSignature(node: TypeScript.IndexSignatureSyntax): void;
        public visitPropertySignature(node: TypeScript.PropertySignatureSyntax): void;
        public visitCallSignature(node: TypeScript.CallSignatureSyntax): void;
        public visitParameterList(node: TypeScript.ParameterListSyntax): void;
        public visitTypeParameterList(node: TypeScript.TypeParameterListSyntax): void;
        public visitTypeParameter(node: TypeScript.TypeParameterSyntax): void;
        public visitConstraint(node: TypeScript.ConstraintSyntax): void;
        public visitElseClause(node: TypeScript.ElseClauseSyntax): void;
        public visitIfStatement(node: TypeScript.IfStatementSyntax): void;
        public visitExpressionStatement(node: TypeScript.ExpressionStatementSyntax): void;
        public visitConstructorDeclaration(node: TypeScript.ConstructorDeclarationSyntax): void;
        public visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): void;
        public visitGetAccessor(node: TypeScript.GetAccessorSyntax): void;
        public visitSetAccessor(node: TypeScript.SetAccessorSyntax): void;
        public visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): void;
        public visitIndexMemberDeclaration(node: TypeScript.IndexMemberDeclarationSyntax): void;
        public visitThrowStatement(node: TypeScript.ThrowStatementSyntax): void;
        public visitReturnStatement(node: TypeScript.ReturnStatementSyntax): void;
        public visitObjectCreationExpression(node: TypeScript.ObjectCreationExpressionSyntax): void;
        public visitSwitchStatement(node: TypeScript.SwitchStatementSyntax): void;
        public visitCaseSwitchClause(node: TypeScript.CaseSwitchClauseSyntax): void;
        public visitDefaultSwitchClause(node: TypeScript.DefaultSwitchClauseSyntax): void;
        public visitBreakStatement(node: TypeScript.BreakStatementSyntax): void;
        public visitContinueStatement(node: TypeScript.ContinueStatementSyntax): void;
        public visitForStatement(node: TypeScript.ForStatementSyntax): void;
        public visitForInStatement(node: TypeScript.ForInStatementSyntax): void;
        public visitWhileStatement(node: TypeScript.WhileStatementSyntax): void;
        public visitWithStatement(node: TypeScript.WithStatementSyntax): void;
        public visitEnumDeclaration(node: TypeScript.EnumDeclarationSyntax): void;
        public visitEnumElement(node: TypeScript.EnumElementSyntax): void;
        public visitCastExpression(node: TypeScript.CastExpressionSyntax): void;
        public visitObjectLiteralExpression(node: TypeScript.ObjectLiteralExpressionSyntax): void;
        public visitSimplePropertyAssignment(node: TypeScript.SimplePropertyAssignmentSyntax): void;
        public visitFunctionPropertyAssignment(node: TypeScript.FunctionPropertyAssignmentSyntax): void;
        public visitFunctionExpression(node: TypeScript.FunctionExpressionSyntax): void;
        public visitEmptyStatement(node: TypeScript.EmptyStatementSyntax): void;
        public visitTryStatement(node: TypeScript.TryStatementSyntax): void;
        public visitCatchClause(node: TypeScript.CatchClauseSyntax): void;
        public visitFinallyClause(node: TypeScript.FinallyClauseSyntax): void;
        public visitLabeledStatement(node: TypeScript.LabeledStatementSyntax): void;
        public visitDoStatement(node: TypeScript.DoStatementSyntax): void;
        public visitTypeOfExpression(node: TypeScript.TypeOfExpressionSyntax): void;
        public visitDeleteExpression(node: TypeScript.DeleteExpressionSyntax): void;
        public visitVoidExpression(node: TypeScript.VoidExpressionSyntax): void;
        public visitDebuggerStatement(node: TypeScript.DebuggerStatementSyntax): void;
    }
}
declare module TypeScript {
    class PositionTrackingWalker extends TypeScript.SyntaxWalker {
        private _position;
        public visitToken(token: TypeScript.ISyntaxToken): void;
        public position(): number;
        public skip(element: TypeScript.ISyntaxElement): void;
    }
}
declare module TypeScript {
    interface ITokenInformation {
        previousToken: TypeScript.ISyntaxToken;
        nextToken: TypeScript.ISyntaxToken;
    }
    class SyntaxInformationMap extends TypeScript.SyntaxWalker {
        private trackParents;
        private trackPreviousToken;
        private tokenToInformation;
        private elementToPosition;
        private _previousToken;
        private _previousTokenInformation;
        private _currentPosition;
        private _elementToParent;
        private _parentStack;
        constructor(trackParents: boolean, trackPreviousToken: boolean);
        static create(node: TypeScript.SyntaxNode, trackParents: boolean, trackPreviousToken: boolean): SyntaxInformationMap;
        public visitNode(node: TypeScript.SyntaxNode): void;
        public visitToken(token: TypeScript.ISyntaxToken): void;
        public parent(element: TypeScript.ISyntaxElement): TypeScript.SyntaxNode;
        public fullStart(element: TypeScript.ISyntaxElement): number;
        public start(element: TypeScript.ISyntaxElement): number;
        public end(element: TypeScript.ISyntaxElement): number;
        public previousToken(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxToken;
        public tokenInformation(token: TypeScript.ISyntaxToken): ITokenInformation;
        public firstTokenInLineContainingToken(token: TypeScript.ISyntaxToken): TypeScript.ISyntaxToken;
        public isFirstTokenInLine(token: TypeScript.ISyntaxToken): boolean;
        private isFirstTokenInLineWorker(information);
    }
}
declare module TypeScript {
    class SyntaxNodeInvariantsChecker extends TypeScript.SyntaxWalker {
        private tokenTable;
        static checkInvariants(node: TypeScript.SyntaxNode): void;
        public visitToken(token: TypeScript.ISyntaxToken): void;
    }
}
declare module TypeScript {
    class DepthLimitedWalker extends TypeScript.PositionTrackingWalker {
        private _depth;
        private _maximumDepth;
        constructor(maximumDepth: number);
        public visitNode(node: TypeScript.SyntaxNode): void;
    }
}
declare module TypeScript.Parser {
    function parse(fileName: string, text: TypeScript.ISimpleText, isDeclaration: boolean, options: TypeScript.ParseOptions): TypeScript.SyntaxTree;
    function incrementalParse(oldSyntaxTree: TypeScript.SyntaxTree, textChangeRange: TypeScript.TextChangeRange, newText: TypeScript.ISimpleText): TypeScript.SyntaxTree;
}
declare module TypeScript {
    class Unicode {
        static unicodeES3IdentifierStart: number[];
        static unicodeES3IdentifierPart: number[];
        static unicodeES5IdentifierStart: number[];
        static unicodeES5IdentifierPart: number[];
        static lookupInUnicodeMap(code: number, map: number[]): boolean;
        static isIdentifierStart(code: number, languageVersion: TypeScript.LanguageVersion): boolean;
        static isIdentifierPart(code: number, languageVersion: TypeScript.LanguageVersion): boolean;
    }
}
declare module TypeScript {
    class SyntaxTree {
        private _sourceUnit;
        private _isDeclaration;
        private _parserDiagnostics;
        private _allDiagnostics;
        private _fileName;
        private _lineMap;
        private _parseOptions;
        constructor(sourceUnit: TypeScript.SourceUnitSyntax, isDeclaration: boolean, diagnostics: TypeScript.Diagnostic[], fileName: string, lineMap: TypeScript.LineMap, parseOtions: TypeScript.ParseOptions);
        public toJSON(key: any): any;
        public sourceUnit(): TypeScript.SourceUnitSyntax;
        public isDeclaration(): boolean;
        private computeDiagnostics();
        public diagnostics(): TypeScript.Diagnostic[];
        public fileName(): string;
        public lineMap(): TypeScript.LineMap;
        public parseOptions(): TypeScript.ParseOptions;
        public structuralEquals(tree: SyntaxTree): boolean;
    }
}
declare module Lint {
    interface IOptions {
        ruleArguments?: any[];
        ruleName: string;
        disabledIntervals: IDisabledInterval[];
    }
    interface IDisabledInterval {
        startPosition: number;
        endPosition: number;
    }
    interface Rule {
        getOptions(): IOptions;
        isEnabled(): boolean;
        apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[];
        applyWithWalker(walker: Lint.RuleWalker): RuleFailure[];
    }
    class RuleFailurePosition {
        private position;
        private lineAndCharacter;
        constructor(position: number, lineAndCharacter: TypeScript.LineAndCharacter);
        public getPosition(): number;
        public getLineAndCharacter(): TypeScript.LineAndCharacter;
        public toJson(): {
            position: number;
            line: number;
            character: number;
        };
        public equals(ruleFailurePosition: RuleFailurePosition): boolean;
    }
    class RuleFailure {
        private fileName;
        private startPosition;
        private endPosition;
        private failure;
        private ruleName;
        constructor(syntaxTree: TypeScript.SyntaxTree, start: number, end: number, failure: string, ruleName: string);
        public getFileName(): string;
        public getRuleName(): string;
        public getStartPosition(): RuleFailurePosition;
        public getEndPosition(): RuleFailurePosition;
        public getFailure(): string;
        public toJson(): any;
        public equals(ruleFailure: RuleFailure): boolean;
        private createFailurePosition(syntaxTree, position);
    }
}
declare module Lint {
    class RuleWalker extends TypeScript.PositionTrackingWalker {
        private limit;
        private options;
        private failures;
        private syntaxTree;
        private disabledIntervals;
        private ruleName;
        constructor(syntaxTree: TypeScript.SyntaxTree, options: Lint.IOptions);
        public getSyntaxTree(): TypeScript.SyntaxTree;
        public getFailures(): Lint.RuleFailure[];
        public positionAfter(...elements: TypeScript.ISyntaxElement[]): number;
        public getOptions(): any;
        public hasOption(option: string): boolean;
        public createFailure(start: number, width: number, failure: string): Lint.RuleFailure;
        public addFailure(failure: Lint.RuleFailure): void;
        private existsFailure(failure);
    }
}
declare module Lint {
    interface IEnableDisablePosition {
        isEnabled: boolean;
        position: number;
    }
    function loadRules(ruleConfiguration: {
        [name: string]: any;
    }, enableDisableRuleMap: {
        [rulename: string]: IEnableDisablePosition[];
    }, rulesDirectory?: string): Rule[];
    function findRule(name: string, rulesDirectory?: string): any;
}
declare module Lint.Configuration {
    function findConfiguration(configFile: string): any;
}
declare module Lint {
    interface Formatter {
        format(failures: Lint.RuleFailure[]): string;
    }
}
declare module Lint {
    function findFormatter(name: string, formattersDirectory?: string): any;
}
declare module Lint {
    class EnableDisableRulesWalker extends Lint.RuleWalker {
        public enableDisableRuleMap: {
            [rulename: string]: Lint.IEnableDisablePosition[];
        };
        public visitToken(token: TypeScript.ISyntaxToken): void;
        private findSwitchesInTrivia(triviaList, startingPosition);
    }
}
declare module TypeScript {
    module CompilerDiagnostics {
        var debug: boolean;
        interface IDiagnosticWriter {
            Alert(output: string): void;
        }
        var diagnosticWriter: IDiagnosticWriter;
        var analysisPass: number;
        function Alert(output: string): void;
        function debugPrint(s: string): void;
        function assert(condition: boolean, s: string): void;
    }
    interface ILogger {
        information(): boolean;
        debug(): boolean;
        warning(): boolean;
        error(): boolean;
        fatal(): boolean;
        log(s: string): void;
    }
    class NullLogger implements ILogger {
        public information(): boolean;
        public debug(): boolean;
        public warning(): boolean;
        public error(): boolean;
        public fatal(): boolean;
        public log(s: string): void;
    }
    function timeFunction(logger: ILogger, funcDescription: string, func: () => any): any;
}
declare module TypeScript {
    class Document {
        private _compiler;
        private _semanticInfoChain;
        public fileName: string;
        public referencedFiles: string[];
        private _scriptSnapshot;
        public byteOrderMark: TypeScript.ByteOrderMark;
        public version: number;
        public isOpen: boolean;
        private _syntaxTree;
        private _topLevelDecl;
        private _diagnostics;
        private _bloomFilter;
        private _sourceUnit;
        private _lineMap;
        private _declASTMap;
        private _astDeclMap;
        private _isExternalModule;
        private _amdDependencies;
        constructor(_compiler: TypeScript.TypeScriptCompiler, _semanticInfoChain: TypeScript.SemanticInfoChain, fileName: string, referencedFiles: string[], _scriptSnapshot: TypeScript.IScriptSnapshot, byteOrderMark: TypeScript.ByteOrderMark, version: number, isOpen: boolean, _syntaxTree: TypeScript.SyntaxTree, _topLevelDecl: TypeScript.PullDecl);
        public invalidate(): void;
        public isDeclareFile(): boolean;
        private cacheSyntaxTreeInfo(syntaxTree);
        private getLeadingComments(node);
        private getAmdDependency(comment);
        private hasImplicitImport(sourceUnitLeadingComments);
        private getImplicitImport(comment);
        private hasTopLevelImportOrExport(node);
        public sourceUnit(): TypeScript.SourceUnit;
        public diagnostics(): TypeScript.Diagnostic[];
        public lineMap(): TypeScript.LineMap;
        public isExternalModule(): boolean;
        public amdDependencies(): string[];
        public syntaxTree(): TypeScript.SyntaxTree;
        public bloomFilter(): TypeScript.BloomFilter;
        public emitToOwnOutputFile(): boolean;
        public update(scriptSnapshot: TypeScript.IScriptSnapshot, version: number, isOpen: boolean, textChangeRange: TypeScript.TextChangeRange): Document;
        static create(compiler: TypeScript.TypeScriptCompiler, semanticInfoChain: TypeScript.SemanticInfoChain, fileName: string, scriptSnapshot: TypeScript.IScriptSnapshot, byteOrderMark: TypeScript.ByteOrderMark, version: number, isOpen: boolean, referencedFiles: string[]): Document;
        public topLevelDecl(): TypeScript.PullDecl;
        public _getDeclForAST(ast: TypeScript.AST): TypeScript.PullDecl;
        public getEnclosingDecl(ast: TypeScript.AST): TypeScript.PullDecl;
        public _setDeclForAST(ast: TypeScript.AST, decl: TypeScript.PullDecl): void;
        public _getASTForDecl(decl: TypeScript.PullDecl): TypeScript.AST;
        public _setASTForDecl(decl: TypeScript.PullDecl, ast: TypeScript.AST): void;
    }
}
declare module TypeScript {
    function hasFlag(val: number, flag: number): boolean;
    enum TypeRelationshipFlags {
        SuccessfulComparison = 0,
        RequiredPropertyIsMissing,
        IncompatibleSignatures,
        SourceSignatureHasTooManyParameters = 3,
        IncompatibleReturnTypes,
        IncompatiblePropertyTypes,
        IncompatibleParameterTypes,
        InconsistantPropertyAccesibility,
    }
    enum ModuleGenTarget {
        Unspecified = 0,
        Synchronous = 1,
        Asynchronous = 2,
    }
}
declare module TypeScript {
    interface IIndexable<T> {
        [s: string]: T;
    }
    function createIntrinsicsObject<T>(): IIndexable<T>;
    interface IHashTable<T> {
        getAllKeys(): string[];
        add(key: string, data: T): boolean;
        addOrUpdate(key: string, data: T): boolean;
        map(fn: (k: string, value: T, context: any) => void, context: any): void;
        every(fn: (k: string, value: T, context: any) => void, context: any): boolean;
        some(fn: (k: string, value: T, context: any) => void, context: any): boolean;
        count(): number;
        lookup(key: string): T;
    }
    class StringHashTable<T> implements IHashTable<T> {
        private itemCount;
        private table;
        public getAllKeys(): string[];
        public add(key: string, data: T): boolean;
        public addOrUpdate(key: string, data: T): boolean;
        public map(fn: (k: string, value: T, context: any) => void, context: any): void;
        public every(fn: (k: string, value: T, context: any) => void, context: any): boolean;
        public some(fn: (k: string, value: T, context: any) => void, context: any): boolean;
        public count(): number;
        public lookup(key: string): T;
        public remove(key: string): void;
    }
    class IdentiferNameHashTable<T> extends StringHashTable<T> {
        public getAllKeys(): string[];
        public add(key: string, data: T): boolean;
        public addOrUpdate(key: string, data: T): boolean;
        public map(fn: (k: string, value: T, context: any) => void, context: any): void;
        public every(fn: (k: string, value: T, context: any) => void, context: any): boolean;
        public some(fn: (k: string, value: any, context: any) => void, context: any): boolean;
        public lookup(key: string): T;
    }
}
declare module TypeScript {
    interface IASTSpan {
        _start: number;
        _end: number;
        start(): number;
        end(): number;
    }
    class ASTSpan implements IASTSpan {
        public _start: number;
        public _end: number;
        constructor(_start: number, _end: number);
        public start(): number;
        public end(): number;
    }
    function structuralEqualsNotIncludingPosition(ast1: AST, ast2: AST): boolean;
    function structuralEqualsIncludingPosition(ast1: AST, ast2: AST): boolean;
    class AST implements IASTSpan {
        public parent: AST;
        public _start: number;
        public _end: number;
        public _trailingTriviaWidth: number;
        private _astID;
        private _preComments;
        private _postComments;
        constructor();
        public syntaxID(): number;
        public start(): number;
        public end(): number;
        public trailingTriviaWidth(): number;
        public fileName(): string;
        public kind(): TypeScript.SyntaxKind;
        public preComments(): Comment[];
        public postComments(): Comment[];
        public setPreComments(comments: Comment[]): void;
        public setPostComments(comments: Comment[]): void;
        public width(): number;
        public structuralEquals(ast: AST, includingPosition: boolean): boolean;
    }
    interface IASTToken extends AST {
        text(): string;
        valueText(): string;
    }
    class ISyntaxList2 extends AST {
        private _fileName;
        private members;
        constructor(_fileName: string, members: AST[]);
        public childCount(): number;
        public childAt(index: number): AST;
        public fileName(): string;
        public kind(): TypeScript.SyntaxKind;
        public firstOrDefault(func: (v: AST, index: number) => boolean): AST;
        public lastOrDefault(func: (v: AST, index: number) => boolean): AST;
        public any(func: (v: AST) => boolean): boolean;
        public structuralEquals(ast: ISyntaxList2, includingPosition: boolean): boolean;
    }
    class ISeparatedSyntaxList2 extends AST {
        private _fileName;
        private members;
        private _separatorCount;
        constructor(_fileName: string, members: AST[], _separatorCount: number);
        public nonSeparatorCount(): number;
        public separatorCount(): number;
        public nonSeparatorAt(index: number): AST;
        public nonSeparatorIndexOf(ast: AST): number;
        public fileName(): string;
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ISeparatedSyntaxList2, includingPosition: boolean): boolean;
    }
    class SourceUnit extends AST {
        public moduleElements: ISyntaxList2;
        private _fileName;
        constructor(moduleElements: ISyntaxList2, _fileName: string);
        public fileName(): string;
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: SourceUnit, includingPosition: boolean): boolean;
    }
    class Identifier extends AST implements IASTToken {
        private _text;
        private _valueText;
        constructor(_text: string);
        public text(): string;
        public valueText(): string;
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: Identifier, includingPosition: boolean): boolean;
    }
    class LiteralExpression extends AST {
        private _nodeType;
        private _text;
        private _valueText;
        constructor(_nodeType: TypeScript.SyntaxKind, _text: string, _valueText: string);
        public text(): string;
        public valueText(): string;
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ParenthesizedExpression, includingPosition: boolean): boolean;
    }
    class ThisExpression extends AST implements IASTToken {
        private _text;
        private _valueText;
        constructor(_text: string, _valueText: string);
        public text(): string;
        public valueText(): string;
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ParenthesizedExpression, includingPosition: boolean): boolean;
    }
    class SuperExpression extends AST implements IASTToken {
        private _text;
        private _valueText;
        constructor(_text: string, _valueText: string);
        public text(): string;
        public valueText(): string;
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ParenthesizedExpression, includingPosition: boolean): boolean;
    }
    class NumericLiteral extends AST implements IASTToken {
        private _value;
        private _text;
        private _valueText;
        constructor(_value: number, _text: string, _valueText: string);
        public text(): string;
        public valueText(): string;
        public value(): any;
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: NumericLiteral, includingPosition: boolean): boolean;
    }
    class RegularExpressionLiteral extends AST implements IASTToken {
        private _text;
        private _valueText;
        constructor(_text: string, _valueText: string);
        public text(): string;
        public valueText(): string;
        public kind(): TypeScript.SyntaxKind;
    }
    class StringLiteral extends AST implements IASTToken {
        private _text;
        private _valueText;
        constructor(_text: string, _valueText: string);
        public text(): string;
        public valueText(): string;
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: StringLiteral, includingPosition: boolean): boolean;
    }
    class TypeAnnotation extends AST {
        public type: AST;
        constructor(type: AST);
        public kind(): TypeScript.SyntaxKind;
    }
    class BuiltInType extends AST implements IASTToken {
        private _nodeType;
        private _text;
        private _valueText;
        constructor(_nodeType: TypeScript.SyntaxKind, _text: string, _valueText: string);
        public text(): string;
        public valueText(): string;
        public kind(): TypeScript.SyntaxKind;
    }
    class ExternalModuleReference extends AST {
        public stringLiteral: StringLiteral;
        constructor(stringLiteral: StringLiteral);
        public kind(): TypeScript.SyntaxKind;
    }
    class ModuleNameModuleReference extends AST {
        public moduleName: AST;
        constructor(moduleName: AST);
        public kind(): TypeScript.SyntaxKind;
    }
    class ImportDeclaration extends AST {
        public modifiers: TypeScript.PullElementFlags[];
        public identifier: Identifier;
        public moduleReference: AST;
        constructor(modifiers: TypeScript.PullElementFlags[], identifier: Identifier, moduleReference: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ImportDeclaration, includingPosition: boolean): boolean;
    }
    class ExportAssignment extends AST {
        public identifier: Identifier;
        constructor(identifier: Identifier);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ExportAssignment, includingPosition: boolean): boolean;
    }
    class TypeParameterList extends AST {
        public typeParameters: ISeparatedSyntaxList2;
        constructor(typeParameters: ISeparatedSyntaxList2);
        public kind(): TypeScript.SyntaxKind;
    }
    class ClassDeclaration extends AST {
        public modifiers: TypeScript.PullElementFlags[];
        public identifier: Identifier;
        public typeParameterList: TypeParameterList;
        public heritageClauses: ISyntaxList2;
        public classElements: ISyntaxList2;
        public closeBraceToken: ASTSpan;
        constructor(modifiers: TypeScript.PullElementFlags[], identifier: Identifier, typeParameterList: TypeParameterList, heritageClauses: ISyntaxList2, classElements: ISyntaxList2, closeBraceToken: ASTSpan);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ClassDeclaration, includingPosition: boolean): boolean;
    }
    class InterfaceDeclaration extends AST {
        public modifiers: TypeScript.PullElementFlags[];
        public identifier: Identifier;
        public typeParameterList: TypeParameterList;
        public heritageClauses: ISyntaxList2;
        public body: ObjectType;
        constructor(modifiers: TypeScript.PullElementFlags[], identifier: Identifier, typeParameterList: TypeParameterList, heritageClauses: ISyntaxList2, body: ObjectType);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: InterfaceDeclaration, includingPosition: boolean): boolean;
    }
    class HeritageClause extends AST {
        private _nodeType;
        public typeNames: ISeparatedSyntaxList2;
        constructor(_nodeType: TypeScript.SyntaxKind, typeNames: ISeparatedSyntaxList2);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: HeritageClause, includingPosition: boolean): boolean;
    }
    class ModuleDeclaration extends AST {
        public modifiers: TypeScript.PullElementFlags[];
        public name: AST;
        public stringLiteral: StringLiteral;
        public moduleElements: ISyntaxList2;
        public endingToken: ASTSpan;
        constructor(modifiers: TypeScript.PullElementFlags[], name: AST, stringLiteral: StringLiteral, moduleElements: ISyntaxList2, endingToken: ASTSpan);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ModuleDeclaration, includingPosition: boolean): boolean;
    }
    class FunctionDeclaration extends AST {
        public modifiers: TypeScript.PullElementFlags[];
        public identifier: Identifier;
        public callSignature: CallSignature;
        public block: Block;
        constructor(modifiers: TypeScript.PullElementFlags[], identifier: Identifier, callSignature: CallSignature, block: Block);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: FunctionDeclaration, includingPosition: boolean): boolean;
    }
    class VariableStatement extends AST {
        public modifiers: TypeScript.PullElementFlags[];
        public declaration: VariableDeclaration;
        constructor(modifiers: TypeScript.PullElementFlags[], declaration: VariableDeclaration);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: VariableStatement, includingPosition: boolean): boolean;
    }
    class VariableDeclaration extends AST {
        public declarators: ISeparatedSyntaxList2;
        constructor(declarators: ISeparatedSyntaxList2);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: VariableDeclaration, includingPosition: boolean): boolean;
    }
    class VariableDeclarator extends AST {
        public propertyName: IASTToken;
        public typeAnnotation: TypeAnnotation;
        public equalsValueClause: EqualsValueClause;
        constructor(propertyName: IASTToken, typeAnnotation: TypeAnnotation, equalsValueClause: EqualsValueClause);
        public kind(): TypeScript.SyntaxKind;
    }
    class EqualsValueClause extends AST {
        public value: AST;
        constructor(value: AST);
        public kind(): TypeScript.SyntaxKind;
    }
    class PrefixUnaryExpression extends AST {
        private _nodeType;
        public operand: AST;
        constructor(_nodeType: TypeScript.SyntaxKind, operand: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: PrefixUnaryExpression, includingPosition: boolean): boolean;
    }
    class ArrayLiteralExpression extends AST {
        public expressions: ISeparatedSyntaxList2;
        constructor(expressions: ISeparatedSyntaxList2);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ArrayLiteralExpression, includingPosition: boolean): boolean;
    }
    class OmittedExpression extends AST {
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: CatchClause, includingPosition: boolean): boolean;
    }
    class ParenthesizedExpression extends AST {
        public openParenTrailingComments: Comment[];
        public expression: AST;
        constructor(openParenTrailingComments: Comment[], expression: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ParenthesizedExpression, includingPosition: boolean): boolean;
    }
    interface ICallExpression extends IASTSpan {
        expression: AST;
        argumentList: ArgumentList;
    }
    class SimpleArrowFunctionExpression extends AST {
        public identifier: Identifier;
        public block: Block;
        public expression: AST;
        constructor(identifier: Identifier, block: Block, expression: AST);
        public kind(): TypeScript.SyntaxKind;
    }
    class ParenthesizedArrowFunctionExpression extends AST {
        public callSignature: CallSignature;
        public block: Block;
        public expression: AST;
        constructor(callSignature: CallSignature, block: Block, expression: AST);
        public kind(): TypeScript.SyntaxKind;
    }
    class QualifiedName extends AST {
        public left: AST;
        public right: Identifier;
        constructor(left: AST, right: Identifier);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: QualifiedName, includingPosition: boolean): boolean;
    }
    class ParameterList extends AST {
        public openParenTrailingComments: Comment[];
        public parameters: ISeparatedSyntaxList2;
        constructor(openParenTrailingComments: Comment[], parameters: ISeparatedSyntaxList2);
        public kind(): TypeScript.SyntaxKind;
    }
    class ConstructorType extends AST {
        public typeParameterList: TypeParameterList;
        public parameterList: ParameterList;
        public type: AST;
        constructor(typeParameterList: TypeParameterList, parameterList: ParameterList, type: AST);
        public kind(): TypeScript.SyntaxKind;
    }
    class FunctionType extends AST {
        public typeParameterList: TypeParameterList;
        public parameterList: ParameterList;
        public type: AST;
        constructor(typeParameterList: TypeParameterList, parameterList: ParameterList, type: AST);
        public kind(): TypeScript.SyntaxKind;
    }
    class ObjectType extends AST {
        public typeMembers: ISeparatedSyntaxList2;
        constructor(typeMembers: ISeparatedSyntaxList2);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ObjectType, includingPosition: boolean): boolean;
    }
    class ArrayType extends AST {
        public type: AST;
        constructor(type: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ArrayType, includingPosition: boolean): boolean;
    }
    class TypeArgumentList extends AST {
        public typeArguments: ISeparatedSyntaxList2;
        constructor(typeArguments: ISeparatedSyntaxList2);
        public kind(): TypeScript.SyntaxKind;
    }
    class GenericType extends AST {
        public name: AST;
        public typeArgumentList: TypeArgumentList;
        constructor(name: AST, typeArgumentList: TypeArgumentList);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: GenericType, includingPosition: boolean): boolean;
    }
    class TypeQuery extends AST {
        public name: AST;
        constructor(name: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: TypeQuery, includingPosition: boolean): boolean;
    }
    class Block extends AST {
        public statements: ISyntaxList2;
        public closeBraceLeadingComments: Comment[];
        public closeBraceToken: IASTSpan;
        constructor(statements: ISyntaxList2, closeBraceLeadingComments: Comment[], closeBraceToken: IASTSpan);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: Block, includingPosition: boolean): boolean;
    }
    class Parameter extends AST {
        public dotDotDotToken: ASTSpan;
        public modifiers: TypeScript.PullElementFlags[];
        public identifier: Identifier;
        public questionToken: ASTSpan;
        public typeAnnotation: TypeAnnotation;
        public equalsValueClause: EqualsValueClause;
        constructor(dotDotDotToken: ASTSpan, modifiers: TypeScript.PullElementFlags[], identifier: Identifier, questionToken: ASTSpan, typeAnnotation: TypeAnnotation, equalsValueClause: EqualsValueClause);
        public kind(): TypeScript.SyntaxKind;
    }
    class MemberAccessExpression extends AST {
        public expression: AST;
        public name: Identifier;
        constructor(expression: AST, name: Identifier);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: MemberAccessExpression, includingPosition: boolean): boolean;
    }
    class PostfixUnaryExpression extends AST {
        private _nodeType;
        public operand: AST;
        constructor(_nodeType: TypeScript.SyntaxKind, operand: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: PostfixUnaryExpression, includingPosition: boolean): boolean;
    }
    class ElementAccessExpression extends AST {
        public expression: AST;
        public argumentExpression: AST;
        constructor(expression: AST, argumentExpression: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ElementAccessExpression, includingPosition: boolean): boolean;
    }
    class InvocationExpression extends AST implements ICallExpression {
        public expression: AST;
        public argumentList: ArgumentList;
        constructor(expression: AST, argumentList: ArgumentList);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: InvocationExpression, includingPosition: boolean): boolean;
    }
    class ArgumentList extends AST {
        public typeArgumentList: TypeArgumentList;
        public arguments: ISeparatedSyntaxList2;
        public closeParenToken: ASTSpan;
        constructor(typeArgumentList: TypeArgumentList, arguments: ISeparatedSyntaxList2, closeParenToken: ASTSpan);
        public kind(): TypeScript.SyntaxKind;
    }
    class BinaryExpression extends AST {
        private _nodeType;
        public left: AST;
        public right: AST;
        constructor(_nodeType: TypeScript.SyntaxKind, left: AST, right: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: BinaryExpression, includingPosition: boolean): boolean;
    }
    class ConditionalExpression extends AST {
        public condition: AST;
        public whenTrue: AST;
        public whenFalse: AST;
        constructor(condition: AST, whenTrue: AST, whenFalse: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ConditionalExpression, includingPosition: boolean): boolean;
    }
    class ConstructSignature extends AST {
        public callSignature: CallSignature;
        constructor(callSignature: CallSignature);
        public kind(): TypeScript.SyntaxKind;
    }
    class MethodSignature extends AST {
        public propertyName: IASTToken;
        public questionToken: ASTSpan;
        public callSignature: CallSignature;
        constructor(propertyName: IASTToken, questionToken: ASTSpan, callSignature: CallSignature);
        public kind(): TypeScript.SyntaxKind;
    }
    class IndexSignature extends AST {
        public parameter: Parameter;
        public typeAnnotation: TypeAnnotation;
        constructor(parameter: Parameter, typeAnnotation: TypeAnnotation);
        public kind(): TypeScript.SyntaxKind;
    }
    class PropertySignature extends AST {
        public propertyName: IASTToken;
        public questionToken: ASTSpan;
        public typeAnnotation: TypeAnnotation;
        constructor(propertyName: IASTToken, questionToken: ASTSpan, typeAnnotation: TypeAnnotation);
        public kind(): TypeScript.SyntaxKind;
    }
    class CallSignature extends AST {
        public typeParameterList: TypeParameterList;
        public parameterList: ParameterList;
        public typeAnnotation: TypeAnnotation;
        constructor(typeParameterList: TypeParameterList, parameterList: ParameterList, typeAnnotation: TypeAnnotation);
        public kind(): TypeScript.SyntaxKind;
    }
    class TypeParameter extends AST {
        public identifier: Identifier;
        public constraint: Constraint;
        constructor(identifier: Identifier, constraint: Constraint);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: TypeParameter, includingPosition: boolean): boolean;
    }
    class Constraint extends AST {
        public type: AST;
        constructor(type: AST);
        public kind(): TypeScript.SyntaxKind;
    }
    class ElseClause extends AST {
        public statement: AST;
        constructor(statement: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ElseClause, includingPosition: boolean): boolean;
    }
    class IfStatement extends AST {
        public condition: AST;
        public statement: AST;
        public elseClause: ElseClause;
        constructor(condition: AST, statement: AST, elseClause: ElseClause);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: IfStatement, includingPosition: boolean): boolean;
    }
    class ExpressionStatement extends AST {
        public expression: AST;
        constructor(expression: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ExpressionStatement, includingPosition: boolean): boolean;
    }
    class ConstructorDeclaration extends AST {
        public parameterList: ParameterList;
        public block: Block;
        constructor(parameterList: ParameterList, block: Block);
        public kind(): TypeScript.SyntaxKind;
    }
    class MemberFunctionDeclaration extends AST {
        public modifiers: TypeScript.PullElementFlags[];
        public propertyName: IASTToken;
        public callSignature: CallSignature;
        public block: Block;
        constructor(modifiers: TypeScript.PullElementFlags[], propertyName: IASTToken, callSignature: CallSignature, block: Block);
        public kind(): TypeScript.SyntaxKind;
    }
    class GetAccessor extends AST {
        public modifiers: TypeScript.PullElementFlags[];
        public propertyName: IASTToken;
        public parameterList: ParameterList;
        public typeAnnotation: TypeAnnotation;
        public block: Block;
        constructor(modifiers: TypeScript.PullElementFlags[], propertyName: IASTToken, parameterList: ParameterList, typeAnnotation: TypeAnnotation, block: Block);
        public kind(): TypeScript.SyntaxKind;
    }
    class SetAccessor extends AST {
        public modifiers: TypeScript.PullElementFlags[];
        public propertyName: IASTToken;
        public parameterList: ParameterList;
        public block: Block;
        constructor(modifiers: TypeScript.PullElementFlags[], propertyName: IASTToken, parameterList: ParameterList, block: Block);
        public kind(): TypeScript.SyntaxKind;
    }
    class MemberVariableDeclaration extends AST {
        public modifiers: TypeScript.PullElementFlags[];
        public variableDeclarator: VariableDeclarator;
        constructor(modifiers: TypeScript.PullElementFlags[], variableDeclarator: VariableDeclarator);
        public kind(): TypeScript.SyntaxKind;
    }
    class IndexMemberDeclaration extends AST {
        public indexSignature: IndexSignature;
        constructor(indexSignature: IndexSignature);
        public kind(): TypeScript.SyntaxKind;
    }
    class ThrowStatement extends AST {
        public expression: AST;
        constructor(expression: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ThrowStatement, includingPosition: boolean): boolean;
    }
    class ReturnStatement extends AST {
        public expression: AST;
        constructor(expression: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ReturnStatement, includingPosition: boolean): boolean;
    }
    class ObjectCreationExpression extends AST implements ICallExpression {
        public expression: AST;
        public argumentList: ArgumentList;
        constructor(expression: AST, argumentList: ArgumentList);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ObjectCreationExpression, includingPosition: boolean): boolean;
    }
    class SwitchStatement extends AST {
        public expression: AST;
        public closeParenToken: ASTSpan;
        public switchClauses: ISyntaxList2;
        constructor(expression: AST, closeParenToken: ASTSpan, switchClauses: ISyntaxList2);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: SwitchStatement, includingPosition: boolean): boolean;
    }
    class CaseSwitchClause extends AST {
        public expression: AST;
        public statements: ISyntaxList2;
        constructor(expression: AST, statements: ISyntaxList2);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: CaseSwitchClause, includingPosition: boolean): boolean;
    }
    class DefaultSwitchClause extends AST {
        public statements: ISyntaxList2;
        constructor(statements: ISyntaxList2);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: DefaultSwitchClause, includingPosition: boolean): boolean;
    }
    class BreakStatement extends AST {
        public identifier: Identifier;
        constructor(identifier: Identifier);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: BreakStatement, includingPosition: boolean): boolean;
    }
    class ContinueStatement extends AST {
        public identifier: Identifier;
        constructor(identifier: Identifier);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ContinueStatement, includingPosition: boolean): boolean;
    }
    class ForStatement extends AST {
        public variableDeclaration: VariableDeclaration;
        public initializer: AST;
        public condition: AST;
        public incrementor: AST;
        public statement: AST;
        constructor(variableDeclaration: VariableDeclaration, initializer: AST, condition: AST, incrementor: AST, statement: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ForStatement, includingPosition: boolean): boolean;
    }
    class ForInStatement extends AST {
        public variableDeclaration: VariableDeclaration;
        public left: AST;
        public expression: AST;
        public statement: AST;
        constructor(variableDeclaration: VariableDeclaration, left: AST, expression: AST, statement: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ForInStatement, includingPosition: boolean): boolean;
    }
    class WhileStatement extends AST {
        public condition: AST;
        public statement: AST;
        constructor(condition: AST, statement: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: WhileStatement, includingPosition: boolean): boolean;
    }
    class WithStatement extends AST {
        public condition: AST;
        public statement: AST;
        constructor(condition: AST, statement: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: WithStatement, includingPosition: boolean): boolean;
    }
    class EnumDeclaration extends AST {
        public modifiers: TypeScript.PullElementFlags[];
        public identifier: Identifier;
        public enumElements: ISeparatedSyntaxList2;
        constructor(modifiers: TypeScript.PullElementFlags[], identifier: Identifier, enumElements: ISeparatedSyntaxList2);
        public kind(): TypeScript.SyntaxKind;
    }
    class EnumElement extends AST {
        public propertyName: IASTToken;
        public equalsValueClause: EqualsValueClause;
        constructor(propertyName: IASTToken, equalsValueClause: EqualsValueClause);
        public kind(): TypeScript.SyntaxKind;
    }
    class CastExpression extends AST {
        public type: AST;
        public expression: AST;
        constructor(type: AST, expression: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: CastExpression, includingPosition: boolean): boolean;
    }
    class ObjectLiteralExpression extends AST {
        public propertyAssignments: ISeparatedSyntaxList2;
        constructor(propertyAssignments: ISeparatedSyntaxList2);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: ObjectLiteralExpression, includingPosition: boolean): boolean;
    }
    class SimplePropertyAssignment extends AST {
        public propertyName: Identifier;
        public expression: AST;
        constructor(propertyName: Identifier, expression: AST);
        public kind(): TypeScript.SyntaxKind;
    }
    class FunctionPropertyAssignment extends AST {
        public propertyName: Identifier;
        public callSignature: CallSignature;
        public block: Block;
        constructor(propertyName: Identifier, callSignature: CallSignature, block: Block);
        public kind(): TypeScript.SyntaxKind;
    }
    class FunctionExpression extends AST {
        public identifier: Identifier;
        public callSignature: CallSignature;
        public block: Block;
        constructor(identifier: Identifier, callSignature: CallSignature, block: Block);
        public kind(): TypeScript.SyntaxKind;
    }
    class EmptyStatement extends AST {
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: CatchClause, includingPosition: boolean): boolean;
    }
    class TryStatement extends AST {
        public block: Block;
        public catchClause: CatchClause;
        public finallyClause: FinallyClause;
        constructor(block: Block, catchClause: CatchClause, finallyClause: FinallyClause);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: TryStatement, includingPosition: boolean): boolean;
    }
    class CatchClause extends AST {
        public identifier: Identifier;
        public typeAnnotation: TypeAnnotation;
        public block: Block;
        constructor(identifier: Identifier, typeAnnotation: TypeAnnotation, block: Block);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: CatchClause, includingPosition: boolean): boolean;
    }
    class FinallyClause extends AST {
        public block: Block;
        constructor(block: Block);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: CatchClause, includingPosition: boolean): boolean;
    }
    class LabeledStatement extends AST {
        public identifier: Identifier;
        public statement: AST;
        constructor(identifier: Identifier, statement: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: LabeledStatement, includingPosition: boolean): boolean;
    }
    class DoStatement extends AST {
        public statement: AST;
        public whileKeyword: ASTSpan;
        public condition: AST;
        constructor(statement: AST, whileKeyword: ASTSpan, condition: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: DoStatement, includingPosition: boolean): boolean;
    }
    class TypeOfExpression extends AST {
        public expression: AST;
        constructor(expression: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: TypeOfExpression, includingPosition: boolean): boolean;
    }
    class DeleteExpression extends AST {
        public expression: AST;
        constructor(expression: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: DeleteExpression, includingPosition: boolean): boolean;
    }
    class VoidExpression extends AST {
        public expression: AST;
        constructor(expression: AST);
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: VoidExpression, includingPosition: boolean): boolean;
    }
    class DebuggerStatement extends AST {
        public kind(): TypeScript.SyntaxKind;
    }
    class Comment {
        private _trivia;
        public endsLine: boolean;
        public _start: number;
        public _end: number;
        constructor(_trivia: TypeScript.ISyntaxTrivia, endsLine: boolean, _start: number, _end: number);
        public start(): number;
        public end(): number;
        public fullText(): string;
        public kind(): TypeScript.SyntaxKind;
        public structuralEquals(ast: Comment, includingPosition: boolean): boolean;
    }
    function diagnosticFromDecl(decl: PullDecl, diagnosticKey: string, arguments?: any[]): Diagnostic;
}
declare module TypeScript {
    function scriptIsElided(sourceUnit: SourceUnit): boolean;
    function moduleIsElided(declaration: ModuleDeclaration): boolean;
    function enumIsElided(declaration: EnumDeclaration): boolean;
    function importDeclarationIsElided(importDeclAST: ImportDeclaration, semanticInfoChain: SemanticInfoChain, compilationSettings?: ImmutableCompilationSettings): boolean;
    function isValidAstNode(ast: IASTSpan): boolean;
    function getAstAtPosition(script: AST, pos: number, useTrailingTriviaAsLimChar?: boolean, forceInclusive?: boolean): AST;
    function getExtendsHeritageClause(clauses: ISyntaxList2): HeritageClause;
    function getImplementsHeritageClause(clauses: ISyntaxList2): HeritageClause;
    function isCallExpression(ast: AST): boolean;
    function isCallExpressionTarget(ast: AST): boolean;
    function isDeclarationASTOrDeclarationNameAST(ast: AST): boolean;
    function isNameOfFunction(ast: AST): boolean;
    function isNameOfMemberFunction(ast: AST): boolean;
    function isNameOfMemberAccessExpression(ast: AST): boolean;
    function isRightSideOfQualifiedName(ast: AST): boolean;
    interface IParameters {
        length: number;
        lastParameterIsRest(): boolean;
        ast: TypeScript.AST;
        astAt(index: number): TypeScript.AST;
        identifierAt(index: number): TypeScript.Identifier;
        typeAt(index: number): TypeScript.AST;
        initializerAt(index: number): TypeScript.EqualsValueClause;
        isOptionalAt(index: number): boolean;
    }
    module Parameters {
        function fromIdentifier(id: TypeScript.Identifier): IParameters;
        function fromParameter(parameter: TypeScript.Parameter): IParameters;
        function fromParameterList(list: TypeScript.ParameterList): IParameters;
    }
    function isDeclarationAST(ast: AST): boolean;
    function docComments(ast: AST): Comment[];
    function getParameterList(ast: AST): ParameterList;
    function getType(ast: AST): AST;
    function getVariableDeclaratorModifiers(variableDeclarator: VariableDeclarator): PullElementFlags[];
    function isIntegerLiteralAST(expression: AST): boolean;
    function getEnclosingModuleDeclaration(ast: AST): ModuleDeclaration;
    function isLastNameOfModule(ast: ModuleDeclaration, astName: AST): boolean;
    function isAnyNameOfModule(ast: ModuleDeclaration, astName: AST): boolean;
}
declare module TypeScript {
    class AstWalkOptions {
        public goChildren: boolean;
        public stopWalking: boolean;
    }
    interface IAstWalker {
        options: AstWalkOptions;
        state: any;
    }
    class AstWalkerFactory {
        public walk(ast: TypeScript.AST, pre: (ast: TypeScript.AST, walker: IAstWalker) => void, post?: (ast: TypeScript.AST, walker: IAstWalker) => void, state?: any): void;
        public simpleWalk(ast: TypeScript.AST, pre: (ast: TypeScript.AST, state: any) => void, post?: (ast: TypeScript.AST, state: any) => void, state?: any): void;
    }
    function getAstWalkerFactory(): AstWalkerFactory;
}
declare module TypeScript {
    class Base64VLQFormat {
        static encode(inValue: number): string;
        static decode(inString: string): {
            value: number;
            rest: string;
        };
    }
}
declare module TypeScript {
    class SourceMapPosition {
        public sourceLine: number;
        public sourceColumn: number;
        public emittedLine: number;
        public emittedColumn: number;
    }
    class SourceMapping {
        public start: SourceMapPosition;
        public end: SourceMapPosition;
        public nameIndex: number;
        public childMappings: SourceMapping[];
    }
    class SourceMapEntry {
        public emittedFile: string;
        public emittedLine: number;
        public emittedColumn: number;
        public sourceFile: string;
        public sourceLine: number;
        public sourceColumn: number;
        public sourceName: string;
        constructor(emittedFile: string, emittedLine: number, emittedColumn: number, sourceFile: string, sourceLine: number, sourceColumn: number, sourceName: string);
    }
    class SourceMapper {
        private jsFile;
        private sourceMapOut;
        static MapFileExtension: string;
        private jsFileName;
        private sourceMapPath;
        private sourceMapDirectory;
        private sourceRoot;
        public names: string[];
        private mappingLevel;
        private tsFilePaths;
        private allSourceMappings;
        public currentMappings: SourceMapping[][];
        public currentNameIndex: number[];
        private sourceMapEntries;
        constructor(jsFile: TypeScript.TextWriter, sourceMapOut: TypeScript.TextWriter, document: TypeScript.Document, jsFilePath: string, emitOptions: TypeScript.EmitOptions, resolvePath: (path: string) => string);
        public getOutputFile(): TypeScript.OutputFile;
        public increaseMappingLevel(ast: TypeScript.IASTSpan): void;
        public decreaseMappingLevel(ast: TypeScript.IASTSpan): void;
        public setNewSourceFile(document: TypeScript.Document, emitOptions: TypeScript.EmitOptions): void;
        private setSourceMapOptions(document, jsFilePath, emitOptions, resolvePath);
        private setNewSourceFilePath(document, emitOptions);
        public emitSourceMapping(): void;
    }
}
declare module TypeScript {
    enum EmitContainer {
        Prog = 0,
        Module = 1,
        DynamicModule = 2,
        Class = 3,
        Constructor = 4,
        Function = 5,
        Args = 6,
        Interface = 7,
    }
    class EmitState {
        public column: number;
        public line: number;
        public container: EmitContainer;
        constructor();
    }
    class EmitOptions {
        public resolvePath: (path: string) => string;
        private _diagnostic;
        private _settings;
        private _commonDirectoryPath;
        private _sharedOutputFile;
        private _sourceRootDirectory;
        private _sourceMapRootDirectory;
        private _outputDirectory;
        public diagnostic(): TypeScript.Diagnostic;
        public commonDirectoryPath(): string;
        public sharedOutputFile(): string;
        public sourceRootDirectory(): string;
        public sourceMapRootDirectory(): string;
        public outputDirectory(): string;
        public compilationSettings(): TypeScript.ImmutableCompilationSettings;
        constructor(compiler: TypeScript.TypeScriptCompiler, resolvePath: (path: string) => string);
        private determineCommonDirectoryPath(compiler);
    }
    class Indenter {
        static indentStep: number;
        static indentStepString: string;
        static indentStrings: string[];
        public indentAmt: number;
        public increaseIndent(): void;
        public decreaseIndent(): void;
        public getIndent(): string;
    }
    function lastParameterIsRest(parameterList: ParameterList): boolean;
    class Emitter {
        public emittingFileName: string;
        public outfile: TypeScript.TextWriter;
        public emitOptions: EmitOptions;
        private semanticInfoChain;
        public globalThisCapturePrologueEmitted: boolean;
        public extendsPrologueEmitted: boolean;
        public thisClassNode: TypeScript.ClassDeclaration;
        public inArrowFunction: boolean;
        public moduleName: string;
        public emitState: EmitState;
        public indenter: Indenter;
        public sourceMapper: TypeScript.SourceMapper;
        public captureThisStmtString: string;
        private currentVariableDeclaration;
        private declStack;
        private exportAssignmentIdentifier;
        private inWithBlock;
        public document: TypeScript.Document;
        private copyrightElement;
        constructor(emittingFileName: string, outfile: TypeScript.TextWriter, emitOptions: EmitOptions, semanticInfoChain: TypeScript.SemanticInfoChain);
        private pushDecl(decl);
        private popDecl(decl);
        private getEnclosingDecl();
        public setExportAssignmentIdentifier(id: string): void;
        public getExportAssignmentIdentifier(): string;
        public setDocument(document: TypeScript.Document): void;
        public shouldEmitImportDeclaration(importDeclAST: TypeScript.ImportDeclaration): boolean;
        public emitImportDeclaration(importDeclAST: TypeScript.ImportDeclaration): void;
        public createSourceMapper(document: TypeScript.Document, jsFileName: string, jsFile: TypeScript.TextWriter, sourceMapOut: TypeScript.TextWriter, resolvePath: (path: string) => string): void;
        public setSourceMapperNewSourceFile(document: TypeScript.Document): void;
        private updateLineAndColumn(s);
        public writeToOutputWithSourceMapRecord(s: string, astSpan: TypeScript.IASTSpan): void;
        public writeToOutput(s: string): void;
        public writeLineToOutput(s: string, force?: boolean): void;
        public writeCaptureThisStatement(ast: TypeScript.AST): void;
        public setContainer(c: number): number;
        private getIndentString();
        public emitIndent(): void;
        public emitComment(comment: TypeScript.Comment, trailing: boolean, first: boolean): void;
        public emitComments(ast: TypeScript.AST, pre: boolean, onlyPinnedOrTripleSlashComments?: boolean): void;
        private isPinnedOrTripleSlash(comment);
        public emitCommentsArray(comments: TypeScript.Comment[], trailing: boolean): void;
        public emitObjectLiteralExpression(objectLiteral: TypeScript.ObjectLiteralExpression): void;
        public emitArrayLiteralExpression(arrayLiteral: TypeScript.ArrayLiteralExpression): void;
        public emitObjectCreationExpression(objectCreationExpression: TypeScript.ObjectCreationExpression): void;
        public getConstantDecl(dotExpr: TypeScript.MemberAccessExpression): TypeScript.PullEnumElementDecl;
        public tryEmitConstant(dotExpr: TypeScript.MemberAccessExpression): boolean;
        public emitInvocationExpression(callNode: TypeScript.InvocationExpression): void;
        private emitParameterList(list);
        private emitFunctionParameters(parameters);
        private emitFunctionBodyStatements(name, funcDecl, parameterList, block, bodyExpression);
        private emitDefaultValueAssignments(parameters);
        private emitRestParameterInitializer(parameters);
        private getImportDecls(fileName);
        public getModuleImportAndDependencyList(sourceUnit: TypeScript.SourceUnit): {
            importList: string;
            dependencyList: string;
        };
        public shouldCaptureThis(ast: TypeScript.AST): boolean;
        public emitEnum(moduleDecl: TypeScript.EnumDeclaration): void;
        private getModuleDeclToVerifyChildNameCollision(moduleDecl, changeNameIfAnyDeclarationInContext);
        private hasChildNameCollision(moduleName, childDecls);
        private getModuleName(moduleDecl, changeNameIfAnyDeclarationInContext?);
        private emitModuleDeclarationWorker(moduleDecl);
        public emitSingleModuleDeclaration(moduleDecl: TypeScript.ModuleDeclaration, moduleName: TypeScript.IASTToken): void;
        public emitEnumElement(varDecl: TypeScript.EnumElement): void;
        public emitElementAccessExpression(expression: TypeScript.ElementAccessExpression): void;
        public emitSimpleArrowFunctionExpression(arrowFunction: TypeScript.SimpleArrowFunctionExpression): void;
        public emitParenthesizedArrowFunctionExpression(arrowFunction: TypeScript.ParenthesizedArrowFunctionExpression): void;
        private emitAnyArrowFunctionExpression(arrowFunction, funcName, parameters, block, expression);
        public emitConstructor(funcDecl: TypeScript.ConstructorDeclaration): void;
        public emitGetAccessor(accessor: TypeScript.GetAccessor): void;
        public emitSetAccessor(accessor: TypeScript.SetAccessor): void;
        public emitFunctionExpression(funcDecl: TypeScript.FunctionExpression): void;
        public emitFunction(funcDecl: TypeScript.FunctionDeclaration): void;
        public emitAmbientVarDecl(varDecl: TypeScript.VariableDeclarator): void;
        public emitVarDeclVar(): void;
        public emitVariableDeclaration(declaration: TypeScript.VariableDeclaration): void;
        private emitMemberVariableDeclaration(varDecl);
        public emitVariableDeclarator(varDecl: TypeScript.VariableDeclarator): void;
        private symbolIsUsedInItsEnclosingContainer(symbol, dynamic?);
        private getPotentialDeclPathInfoForEmit(pullSymbol);
        private emitDottedNameFromDeclPath(declPath, startingIndex, lastIndex);
        private emitSymbolContainerNameInEnclosingContext(pullSymbol);
        private getSymbolForEmit(ast);
        public emitName(name: TypeScript.Identifier, addThis: boolean): void;
        public recordSourceMappingNameStart(name: string): void;
        public recordSourceMappingNameEnd(): void;
        public recordSourceMappingStart(ast: TypeScript.IASTSpan): void;
        public recordSourceMappingEnd(ast: TypeScript.IASTSpan): void;
        public getOutputFiles(): TypeScript.OutputFile[];
        private emitParameterPropertyAndMemberVariableAssignments();
        private isOnSameLine(pos1, pos2);
        private emitCommaSeparatedList(parent, list, buffer, preserveNewLines);
        public emitList(list: TypeScript.ISyntaxList2, useNewLineSeparator?: boolean, startInclusive?: number, endExclusive?: number): void;
        public emitSeparatedList(list: TypeScript.ISeparatedSyntaxList2, useNewLineSeparator?: boolean, startInclusive?: number, endExclusive?: number): void;
        private isDirectivePrologueElement(node);
        public emitSpaceBetweenConstructs(node1: TypeScript.AST, node2: TypeScript.AST): void;
        private getCopyrightComments();
        private emitPossibleCopyrightHeaders(script);
        public emitScriptElements(sourceUnit: TypeScript.SourceUnit): void;
        public emitConstructorStatements(funcDecl: TypeScript.ConstructorDeclaration): void;
        public emitJavascript(ast: TypeScript.AST, startLine: boolean): void;
        public emitAccessorMemberDeclaration(funcDecl: TypeScript.AST, name: TypeScript.IASTToken, className: string, isProto: boolean): void;
        private emitAccessorBody(funcDecl, parameterList, block);
        public emitClass(classDecl: TypeScript.ClassDeclaration): void;
        private emitClassMembers(classDecl);
        private emitClassMemberFunctionDeclaration(classDecl, funcDecl);
        private requiresExtendsBlock(moduleElements);
        public emitPrologue(sourceUnit: TypeScript.SourceUnit): void;
        public emitThis(): void;
        public emitBlockOrStatement(node: TypeScript.AST): void;
        public emitLiteralExpression(expression: TypeScript.LiteralExpression): void;
        public emitThisExpression(expression: TypeScript.ThisExpression): void;
        public emitSuperExpression(expression: TypeScript.SuperExpression): void;
        public emitParenthesizedExpression(parenthesizedExpression: TypeScript.ParenthesizedExpression): void;
        public emitCastExpression(expression: TypeScript.CastExpression): void;
        public emitPrefixUnaryExpression(expression: TypeScript.PrefixUnaryExpression): void;
        public emitPostfixUnaryExpression(expression: TypeScript.PostfixUnaryExpression): void;
        public emitTypeOfExpression(expression: TypeScript.TypeOfExpression): void;
        public emitDeleteExpression(expression: TypeScript.DeleteExpression): void;
        public emitVoidExpression(expression: TypeScript.VoidExpression): void;
        private canEmitDottedNameMemberAccessExpression(expression);
        private emitDottedNameMemberAccessExpressionWorker(expression, potentialPath, startingIndex, lastIndex);
        private emitDottedNameMemberAccessExpressionRecurse(expression, potentialPath, startingIndex, lastIndex);
        private emitDottedNameMemberAccessExpression(expression);
        public emitMemberAccessExpression(expression: TypeScript.MemberAccessExpression): void;
        public emitQualifiedName(name: TypeScript.QualifiedName): void;
        public emitBinaryExpression(expression: TypeScript.BinaryExpression): void;
        public emitSimplePropertyAssignment(property: TypeScript.SimplePropertyAssignment): void;
        public emitFunctionPropertyAssignment(funcProp: TypeScript.FunctionPropertyAssignment): void;
        public emitConditionalExpression(expression: TypeScript.ConditionalExpression): void;
        public emitThrowStatement(statement: TypeScript.ThrowStatement): void;
        public emitExpressionStatement(statement: TypeScript.ExpressionStatement): void;
        public emitLabeledStatement(statement: TypeScript.LabeledStatement): void;
        public emitBlock(block: TypeScript.Block): void;
        public emitBreakStatement(jump: TypeScript.BreakStatement): void;
        public emitContinueStatement(jump: TypeScript.ContinueStatement): void;
        public emitWhileStatement(statement: TypeScript.WhileStatement): void;
        public emitDoStatement(statement: TypeScript.DoStatement): void;
        public emitIfStatement(statement: TypeScript.IfStatement): void;
        public emitElseClause(elseClause: TypeScript.ElseClause): void;
        public emitReturnStatement(statement: TypeScript.ReturnStatement): void;
        public emitForInStatement(statement: TypeScript.ForInStatement): void;
        public emitForStatement(statement: TypeScript.ForStatement): void;
        public emitWithStatement(statement: TypeScript.WithStatement): void;
        public emitSwitchStatement(statement: TypeScript.SwitchStatement): void;
        public emitCaseSwitchClause(clause: TypeScript.CaseSwitchClause): void;
        private emitSwitchClauseBody(body);
        public emitDefaultSwitchClause(clause: TypeScript.DefaultSwitchClause): void;
        public emitTryStatement(statement: TypeScript.TryStatement): void;
        public emitCatchClause(clause: TypeScript.CatchClause): void;
        public emitFinallyClause(clause: TypeScript.FinallyClause): void;
        public emitDebuggerStatement(statement: TypeScript.DebuggerStatement): void;
        public emitNumericLiteral(literal: TypeScript.NumericLiteral): void;
        public emitRegularExpressionLiteral(literal: TypeScript.RegularExpressionLiteral): void;
        public emitStringLiteral(literal: TypeScript.StringLiteral): void;
        public emitEqualsValueClause(clause: TypeScript.EqualsValueClause): void;
        public emitParameter(parameter: TypeScript.Parameter): void;
        public emitConstructorDeclaration(declaration: TypeScript.ConstructorDeclaration): void;
        public shouldEmitFunctionDeclaration(declaration: TypeScript.FunctionDeclaration): boolean;
        public emitFunctionDeclaration(declaration: TypeScript.FunctionDeclaration): void;
        private emitSourceUnit(sourceUnit);
        public shouldEmitEnumDeclaration(declaration: TypeScript.EnumDeclaration): boolean;
        public emitEnumDeclaration(declaration: TypeScript.EnumDeclaration): void;
        public shouldEmitModuleDeclaration(declaration: TypeScript.ModuleDeclaration): boolean;
        private emitModuleDeclaration(declaration);
        public shouldEmitClassDeclaration(declaration: TypeScript.ClassDeclaration): boolean;
        public emitClassDeclaration(declaration: TypeScript.ClassDeclaration): void;
        public shouldEmitInterfaceDeclaration(declaration: TypeScript.InterfaceDeclaration): boolean;
        public emitInterfaceDeclaration(declaration: TypeScript.InterfaceDeclaration): void;
        private firstVariableDeclarator(statement);
        private isNotAmbientOrHasInitializer(variableStatement);
        public shouldEmitVariableStatement(statement: TypeScript.VariableStatement): boolean;
        public emitVariableStatement(statement: TypeScript.VariableStatement): void;
        public emitGenericType(type: TypeScript.GenericType): void;
        private shouldEmit(ast);
        private emit(ast);
        private emitWorker(ast);
    }
    function getLastConstructor(classDecl: ClassDeclaration): ConstructorDeclaration;
    function getTrimmedTextLines(comment: Comment): string[];
}
declare module TypeScript {
    class MemberName {
        public prefix: string;
        public suffix: string;
        public isString(): boolean;
        public isArray(): boolean;
        public isMarker(): boolean;
        public toString(): string;
        static memberNameToString(memberName: MemberName, markerInfo?: number[], markerBaseLength?: number): string;
        static create(text: string): MemberName;
        static create(entry: MemberName, prefix: string, suffix: string): MemberName;
    }
    class MemberNameString extends MemberName {
        public text: string;
        constructor(text: string);
        public isString(): boolean;
    }
    class MemberNameArray extends MemberName {
        public delim: string;
        public entries: MemberName[];
        public isArray(): boolean;
        public add(entry: MemberName): void;
        public addAll(entries: MemberName[]): void;
        constructor();
    }
}
declare module TypeScript {
    function stripStartAndEndQuotes(str: string): string;
    function isSingleQuoted(str: string): boolean;
    function isDoubleQuoted(str: string): boolean;
    function isQuoted(str: string): boolean;
    function quoteStr(str: string): string;
    function switchToForwardSlashes(path: string): string;
    function trimModName(modName: string): string;
    function getDeclareFilePath(fname: string): string;
    function isTSFile(fname: string): boolean;
    function isDTSFile(fname: string): boolean;
    function getPrettyName(modPath: string, quote?: boolean, treatAsFileName?: boolean): any;
    function getPathComponents(path: string): string[];
    function getRelativePathToFixedPath(fixedModFilePath: string, absoluteModPath: string, isAbsoultePathURL?: boolean): string;
    function changePathToDTS(modPath: string): string;
    function isRelative(path: string): boolean;
    function isRooted(path: string): boolean;
    function getRootFilePath(outFname: string): string;
    function filePathComponents(fullPath: string): string[];
    function filePath(fullPath: string): string;
    function convertToDirectoryPath(dirPath: string): string;
    function normalizePath(path: string): string;
}
declare module TypeScript {
    interface IFileReference extends TypeScript.ILineAndCharacter {
        path: string;
        isResident: boolean;
        position: number;
        length: number;
    }
}
declare module TypeScript {
    interface IPreProcessedFileInfo {
        referencedFiles: TypeScript.IFileReference[];
        importedFiles: TypeScript.IFileReference[];
        diagnostics: TypeScript.Diagnostic[];
        isLibFile: boolean;
    }
    var tripleSlashReferenceRegExp: RegExp;
    function preProcessFile(fileName: string, sourceText: IScriptSnapshot, readImportFiles?: boolean): IPreProcessedFileInfo;
    function getParseOptions(settings: ImmutableCompilationSettings): ParseOptions;
    function getReferencedFiles(fileName: string, sourceText: IScriptSnapshot): IFileReference[];
}
declare module TypeScript {
    interface IResolvedFile {
        path: string;
        referencedFiles: string[];
        importedFiles: string[];
    }
    interface IReferenceResolverHost {
        getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot;
        resolveRelativePath(path: string, directory: string): string;
        fileExists(path: string): boolean;
        directoryExists(path: string): boolean;
        getParentDirectory(path: string): string;
    }
    class ReferenceResolutionResult {
        public resolvedFiles: IResolvedFile[];
        public diagnostics: TypeScript.Diagnostic[];
        public seenNoDefaultLibTag: boolean;
    }
    class ReferenceResolver {
        private useCaseSensitiveFileResolution;
        private inputFileNames;
        private host;
        private visited;
        constructor(inputFileNames: string[], host: IReferenceResolverHost, useCaseSensitiveFileResolution: boolean);
        static resolve(inputFileNames: string[], host: IReferenceResolverHost, useCaseSensitiveFileResolution: boolean): ReferenceResolutionResult;
        public resolveInputFiles(): ReferenceResolutionResult;
        private resolveIncludedFile(path, referenceLocation, resolutionResult);
        private resolveImportedFile(path, referenceLocation, resolutionResult);
        private resolveFile(normalizedPath, resolutionResult);
        private getNormalizedFilePath(path, parentFilePath);
        private getUniqueFileId(filePath);
        private recordVisitedFile(filePath);
        private isVisited(filePath);
        private isSameFile(filePath1, filePath2);
    }
}
declare module TypeScript {
    class TextWriter {
        private name;
        private writeByteOrderMark;
        private outputFileType;
        private contents;
        public onNewLine: boolean;
        constructor(name: string, writeByteOrderMark: boolean, outputFileType: TypeScript.OutputFileType);
        public Write(s: string): void;
        public WriteLine(s: string): void;
        public Close(): void;
        public getOutputFile(): TypeScript.OutputFile;
    }
    class DeclarationEmitter {
        private emittingFileName;
        public document: TypeScript.Document;
        private compiler;
        private emitOptions;
        private semanticInfoChain;
        private declFile;
        private indenter;
        private emittedReferencePaths;
        constructor(emittingFileName: string, document: TypeScript.Document, compiler: TypeScript.TypeScriptCompiler, emitOptions: TypeScript.EmitOptions, semanticInfoChain: TypeScript.SemanticInfoChain);
        public getOutputFile(): TypeScript.OutputFile;
        public emitDeclarations(sourceUnit: TypeScript.SourceUnit): void;
        private emitDeclarationsForList(list);
        private emitSeparatedList(list);
        private emitDeclarationsForAST(ast);
        private getIndentString(declIndent?);
        private emitIndent();
        private canEmitDeclarations(declAST);
        private getDeclFlagsString(pullDecl, typeString);
        private emitDeclFlags(declarationAST, typeString);
        private emitTypeNamesMember(memberName, emitIndent?);
        private emitTypeSignature(ast, type);
        private emitComment(comment);
        private emitDeclarationComments(ast, endLine?);
        private writeDeclarationComments(declComments, endLine?);
        private emitTypeOfVariableDeclaratorOrParameter(boundDecl);
        private emitPropertySignature(varDecl);
        private emitVariableDeclarator(varDecl, isFirstVarInList, isLastVarInList);
        private emitClassElementModifiers(modifiers);
        private emitDeclarationsForMemberVariableDeclaration(varDecl);
        private emitDeclarationsForVariableStatement(variableStatement);
        private emitDeclarationsForVariableDeclaration(variableDeclaration);
        private emitArgDecl(argDecl, id, isOptional, isPrivate);
        private isOverloadedCallSignature(funcDecl);
        private emitDeclarationsForConstructorDeclaration(funcDecl);
        private emitParameterList(isPrivate, parameterList);
        private emitParameters(isPrivate, parameterList);
        private emitMemberFunctionDeclaration(funcDecl);
        private emitCallSignature(funcDecl);
        private emitConstructSignature(funcDecl);
        private emitMethodSignature(funcDecl);
        private emitDeclarationsForFunctionDeclaration(funcDecl);
        private emitIndexMemberDeclaration(funcDecl);
        private emitIndexSignature(funcDecl);
        private emitBaseList(bases, useExtendsList);
        private emitAccessorDeclarationComments(funcDecl);
        private emitDeclarationsForGetAccessor(funcDecl);
        private emitDeclarationsForSetAccessor(funcDecl);
        private emitMemberAccessorDeclaration(funcDecl, modifiers, name);
        private emitClassMembersFromConstructorDefinition(funcDecl);
        private emitDeclarationsForClassDeclaration(classDecl);
        private emitHeritageClauses(clauses);
        private emitHeritageClause(clause);
        private getEnclosingContainer(ast);
        private emitTypeParameters(typeParams, funcSignature?);
        private emitDeclarationsForInterfaceDeclaration(interfaceDecl);
        private emitDeclarationsForImportDeclaration(importDeclAST);
        public getFullName(name: TypeScript.AST): string;
        private emitDeclarationsForEnumDeclaration(moduleDecl);
        private emitDeclarationsForModuleDeclaration(moduleDecl);
        private emitDeclarationsForExportAssignment(ast);
        private resolveScriptReference(document, reference);
        private emitReferencePaths(sourceUnit);
        private emitDeclarationsForSourceUnit(sourceUnit);
    }
}
declare module TypeScript {
    class BloomFilter {
        private bitArray;
        private hashFunctionCount;
        static falsePositiveProbability: number;
        constructor(expectedCount: number);
        static computeM(expectedCount: number): number;
        static computeK(expectedCount: number): number;
        private computeHash(key, seed);
        public addKeys(keys: TypeScript.IIndexable<any>): void;
        public add(value: string): void;
        public probablyContains(value: string): boolean;
        public isEquivalent(filter: BloomFilter): boolean;
        static isEquivalent(array1: boolean[], array2: boolean[]): boolean;
    }
}
declare module TypeScript {
    class IdentifierWalker extends TypeScript.SyntaxWalker {
        public list: TypeScript.IIndexable<boolean>;
        constructor(list: TypeScript.IIndexable<boolean>);
        public visitToken(token: TypeScript.ISyntaxToken): void;
    }
}
declare module TypeScript {
    class CompilationSettings {
        public propagateEnumConstants: boolean;
        public removeComments: boolean;
        public watch: boolean;
        public noResolve: boolean;
        public allowAutomaticSemicolonInsertion: boolean;
        public noImplicitAny: boolean;
        public noLib: boolean;
        public codeGenTarget: TypeScript.LanguageVersion;
        public moduleGenTarget: TypeScript.ModuleGenTarget;
        public outFileOption: string;
        public outDirOption: string;
        public mapSourceFiles: boolean;
        public mapRoot: string;
        public sourceRoot: string;
        public generateDeclarationFiles: boolean;
        public useCaseSensitiveFileResolution: boolean;
        public gatherDiagnostics: boolean;
        public codepage: number;
    }
    class ImmutableCompilationSettings {
        private static _defaultSettings;
        private _propagateEnumConstants;
        private _removeComments;
        private _watch;
        private _noResolve;
        private _allowAutomaticSemicolonInsertion;
        private _noImplicitAny;
        private _noLib;
        private _codeGenTarget;
        private _moduleGenTarget;
        private _outFileOption;
        private _outDirOption;
        private _mapSourceFiles;
        private _mapRoot;
        private _sourceRoot;
        private _generateDeclarationFiles;
        private _useCaseSensitiveFileResolution;
        private _gatherDiagnostics;
        private _codepage;
        public propagateEnumConstants(): boolean;
        public removeComments(): boolean;
        public watch(): boolean;
        public noResolve(): boolean;
        public allowAutomaticSemicolonInsertion(): boolean;
        public noImplicitAny(): boolean;
        public noLib(): boolean;
        public codeGenTarget(): TypeScript.LanguageVersion;
        public moduleGenTarget(): TypeScript.ModuleGenTarget;
        public outFileOption(): string;
        public outDirOption(): string;
        public mapSourceFiles(): boolean;
        public mapRoot(): string;
        public sourceRoot(): string;
        public generateDeclarationFiles(): boolean;
        public useCaseSensitiveFileResolution(): boolean;
        public gatherDiagnostics(): boolean;
        public codepage(): number;
        constructor(propagateEnumConstants: boolean, removeComments: boolean, watch: boolean, noResolve: boolean, allowAutomaticSemicolonInsertion: boolean, noImplicitAny: boolean, noLib: boolean, codeGenTarget: TypeScript.LanguageVersion, moduleGenTarget: TypeScript.ModuleGenTarget, outFileOption: string, outDirOption: string, mapSourceFiles: boolean, mapRoot: string, sourceRoot: string, generateDeclarationFiles: boolean, useCaseSensitiveFileResolution: boolean, gatherDiagnostics: boolean, codepage: number);
        static defaultSettings(): ImmutableCompilationSettings;
        static fromCompilationSettings(settings: CompilationSettings): ImmutableCompilationSettings;
        public toCompilationSettings(): any;
    }
}
declare module TypeScript {
    enum PullElementFlags {
        None = 0,
        Exported = 1,
        Private,
        Public,
        Ambient,
        Static,
        Optional,
        Signature,
        Enum,
        ArrowFunction,
        ClassConstructorVariable,
        InitializedModule,
        InitializedDynamicModule,
        MustCaptureThis,
        DeclaredInAWithBlock,
        HasReturnStatement,
        PropertyParameter,
        IsAnnotatedWithAny,
        HasDefaultArgs,
        ConstructorParameter,
        ImplicitVariable,
        SomeInitializedModule,
    }
    function hasModifier(modifiers: PullElementFlags[], flag: PullElementFlags): boolean;
    enum PullElementKind {
        None = 0,
        Global = 0,
        Script,
        Primitive,
        Container,
        Class,
        Interface,
        DynamicModule,
        Enum,
        TypeAlias,
        ObjectLiteral,
        Variable,
        CatchVariable,
        Parameter,
        Property,
        TypeParameter,
        Function,
        ConstructorMethod,
        Method,
        FunctionExpression,
        GetAccessor,
        SetAccessor,
        CallSignature,
        ConstructSignature,
        IndexSignature,
        ObjectType,
        FunctionType,
        ConstructorType,
        EnumMember,
        WithBlock,
        CatchBlock,
        All,
        SomeFunction,
        SomeValue,
        SomeType,
        AcceptableAlias,
        SomeContainer,
        SomeSignature,
        SomeTypeReference,
        SomeInstantiatableType,
    }
}
declare module TypeScript {
    var pullDeclID: number;
    class PullDecl {
        public kind: TypeScript.PullElementKind;
        public name: string;
        private declDisplayName;
        public declID: number;
        public flags: TypeScript.PullElementFlags;
        private span;
        private declGroups;
        private childDecls;
        private typeParameters;
        private synthesizedValDecl;
        public childDeclTypeCache: TypeScript.IIndexable<PullDecl[]>;
        public childDeclValueCache: TypeScript.IIndexable<PullDecl[]>;
        public childDeclNamespaceCache: TypeScript.IIndexable<PullDecl[]>;
        public childDeclTypeParameterCache: TypeScript.IIndexable<PullDecl[]>;
        constructor(declName: string, displayName: string, kind: TypeScript.PullElementKind, declFlags: TypeScript.PullElementFlags, span: TypeScript.TextSpan);
        public fileName(): string;
        public getParentPath(): PullDecl[];
        public getParentDecl(): PullDecl;
        public semanticInfoChain(): TypeScript.SemanticInfoChain;
        public isExternalModule(): boolean;
        public getEnclosingDecl(): PullDecl;
        public _getEnclosingDeclFromParentDecl(): PullDecl;
        public getDisplayName(): string;
        public setSymbol(symbol: TypeScript.PullSymbol): void;
        public ensureSymbolIsBound(bindSignatureSymbol?: boolean): void;
        public getSymbol(): TypeScript.PullSymbol;
        public hasSymbol(): boolean;
        public setSignatureSymbol(signatureSymbol: TypeScript.PullSignatureSymbol): void;
        public getSignatureSymbol(): TypeScript.PullSignatureSymbol;
        public hasSignatureSymbol(): boolean;
        public setFlags(flags: TypeScript.PullElementFlags): void;
        public setFlag(flags: TypeScript.PullElementFlags): void;
        public getSpan(): TypeScript.TextSpan;
        public setValueDecl(valDecl: PullDecl): void;
        public getValueDecl(): PullDecl;
        public isEqual(other: PullDecl): boolean;
        private getChildDeclCache(declKind);
        public addChildDecl(childDecl: PullDecl): void;
        public searchChildDecls(declName: string, searchKind: TypeScript.PullElementKind): PullDecl[];
        public getChildDecls(): PullDecl[];
        public getTypeParameters(): PullDecl[];
        public addVariableDeclToGroup(decl: PullDecl): void;
        public getVariableDeclGroups(): PullDecl[][];
        public hasBeenBound(): boolean;
        public isSynthesized(): boolean;
        public ast(): TypeScript.AST;
    }
    class RootPullDecl extends PullDecl {
        private _semanticInfoChain;
        private _isExternalModule;
        private _fileName;
        constructor(name: string, fileName: string, kind: TypeScript.PullElementKind, declFlags: TypeScript.PullElementFlags, span: TypeScript.TextSpan, semanticInfoChain: TypeScript.SemanticInfoChain, isExternalModule: boolean);
        public fileName(): string;
        public getParentPath(): PullDecl[];
        public getParentDecl(): PullDecl;
        public semanticInfoChain(): TypeScript.SemanticInfoChain;
        public isExternalModule(): boolean;
        public getEnclosingDecl(): RootPullDecl;
    }
    class NormalPullDecl extends PullDecl {
        private parentDecl;
        private parentPath;
        constructor(declName: string, displayName: string, kind: TypeScript.PullElementKind, declFlags: TypeScript.PullElementFlags, parentDecl: PullDecl, span: TypeScript.TextSpan, addToParent?: boolean);
        public fileName(): string;
        public getParentDecl(): PullDecl;
        public getParentPath(): PullDecl[];
        public semanticInfoChain(): TypeScript.SemanticInfoChain;
        public isExternalModule(): boolean;
        public getEnclosingDecl(): PullDecl;
    }
    class PullEnumElementDecl extends NormalPullDecl {
        public constantValue: number;
        constructor(declName: string, displayName: string, parentDecl: PullDecl, span: TypeScript.TextSpan);
    }
    class PullFunctionExpressionDecl extends NormalPullDecl {
        private functionExpressionName;
        constructor(expressionName: string, declFlags: TypeScript.PullElementFlags, parentDecl: PullDecl, span: TypeScript.TextSpan, displayName?: string);
        public getFunctionExpressionName(): string;
    }
    class PullSynthesizedDecl extends NormalPullDecl {
        private _semanticInfoChain;
        constructor(declName: string, displayName: string, kind: TypeScript.PullElementKind, declFlags: TypeScript.PullElementFlags, parentDecl: PullDecl, span: TypeScript.TextSpan, semanticInfoChain: TypeScript.SemanticInfoChain);
        public semanticInfoChain(): TypeScript.SemanticInfoChain;
        public isSynthesized(): boolean;
    }
    class PullDeclGroup {
        public name: string;
        private _decls;
        constructor(name: string);
        public addDecl(decl: PullDecl): void;
        public getDecls(): PullDecl[];
    }
}
declare module TypeScript {
    var pullSymbolID: number;
    var globalTyvarID: number;
    var sentinelEmptyArray: any[];
    class PullSymbol {
        public pullSymbolID: number;
        public name: string;
        public kind: TypeScript.PullElementKind;
        private _container;
        public type: PullTypeSymbol;
        private _declarations;
        public isResolved: boolean;
        public isOptional: boolean;
        public inResolution: boolean;
        private isSynthesized;
        public isVarArg: boolean;
        private rootSymbol;
        private _enclosingSignature;
        private _docComments;
        public isPrinting: boolean;
        public isAny(): boolean;
        public isType(): boolean;
        public isTypeReference(): boolean;
        public isSignature(): boolean;
        public isArrayNamedTypeReference(): boolean;
        public isPrimitive(): boolean;
        public isAccessor(): boolean;
        public isError(): boolean;
        public isInterface(): boolean;
        public isMethod(): boolean;
        public isProperty(): boolean;
        public isAlias(): boolean;
        public isContainer(): boolean;
        constructor(name: string, declKind: TypeScript.PullElementKind);
        private findAliasedType(scopeSymbol, skipScopeSymbolAliasesLookIn?, lookIntoOnlyExportedAlias?, aliasSymbols?, visitedScopeDeclarations?);
        public getExternalAliasedSymbols(scopeSymbol: PullSymbol): PullTypeAliasSymbol[];
        private isExternalModuleReferenceAlias(aliasSymbol);
        private getExportedInternalAliasSymbol(scopeSymbol);
        public getAliasSymbolName(scopeSymbol: PullSymbol, aliasNameGetter: (symbol: PullTypeAliasSymbol) => string, aliasPartsNameGetter: (symbol: PullTypeAliasSymbol) => string, skipInternalAlias?: boolean): string;
        public _getResolver(): TypeScript.PullTypeResolver;
        public _resolveDeclaredSymbol(): PullSymbol;
        public getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        public getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, skipInternalAliasName?: boolean): string;
        public getIsSpecialized(): boolean;
        public getRootSymbol(): PullSymbol;
        public setRootSymbol(symbol: PullSymbol): void;
        public setIsSynthesized(value?: boolean): void;
        public getIsSynthesized(): boolean;
        public setEnclosingSignature(signature: PullSignatureSymbol): void;
        public getEnclosingSignature(): PullSignatureSymbol;
        public addDeclaration(decl: TypeScript.PullDecl): void;
        public getDeclarations(): TypeScript.PullDecl[];
        public hasDeclaration(decl: TypeScript.PullDecl): boolean;
        public setContainer(containerSymbol: PullTypeSymbol): void;
        public getContainer(): PullTypeSymbol;
        public setResolved(): void;
        public startResolving(): void;
        public setUnresolved(): void;
        public anyDeclHasFlag(flag: TypeScript.PullElementFlags): boolean;
        public allDeclsHaveFlag(flag: TypeScript.PullElementFlags): boolean;
        public pathToRoot(): PullSymbol[];
        public findCommonAncestorPath(b: PullSymbol): PullSymbol[];
        public toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        public getNamePartForFullName(): string;
        public fullName(scopeSymbol?: PullSymbol): string;
        public getScopedName(scopeSymbol?: PullSymbol, skipTypeParametersInName?: boolean, useConstraintInName?: boolean, skipInternalAliasName?: boolean): string;
        public getScopedNameEx(scopeSymbol?: PullSymbol, skipTypeParametersInName?: boolean, useConstraintInName?: boolean, getPrettyTypeName?: boolean, getTypeParamMarkerInfo?: boolean, skipInternalAliasName?: boolean): TypeScript.MemberName;
        public getTypeName(scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean): string;
        public getTypeNameEx(scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean): TypeScript.MemberName;
        private getTypeNameForFunctionSignature(prefix, scopeSymbol?, getPrettyTypeName?);
        public getNameAndTypeName(scopeSymbol?: PullSymbol): string;
        public getNameAndTypeNameEx(scopeSymbol?: PullSymbol): TypeScript.MemberName;
        static getTypeParameterString(typars: PullTypeSymbol[], scopeSymbol?: PullSymbol, useContraintInName?: boolean): string;
        static getTypeParameterStringEx(typeParameters: PullTypeSymbol[], scopeSymbol?: PullSymbol, getTypeParamMarkerInfo?: boolean, useContraintInName?: boolean): TypeScript.MemberNameArray;
        static getIsExternallyVisible(symbol: PullSymbol, fromIsExternallyVisibleSymbol: PullSymbol, inIsExternallyVisibleSymbols: PullSymbol[]): boolean;
        public isExternallyVisible(inIsExternallyVisibleSymbols?: PullSymbol[]): boolean;
        private getDocCommentsOfDecl(decl);
        private getDocCommentArray(symbol);
        private static getDefaultConstructorSymbolForDocComments(classSymbol);
        private getDocCommentText(comments);
        private getDocCommentTextValue(comment);
        public docComments(useConstructorAsClass?: boolean): string;
        private getParameterDocCommentText(param, fncDocComments);
        private cleanJSDocComment(content, spacesToRemove?);
        private consumeLeadingSpace(line, startIndex, maxSpacesToRemove?);
        private isSpaceChar(line, index);
        private cleanDocCommentLine(line, jsDocStyleComment, jsDocLineSpaceToRemove?);
    }
    class PullSignatureSymbol extends PullSymbol {
        private _memberTypeParameterNameCache;
        private _stringConstantOverload;
        public parameters: PullSymbol[];
        public typeParameters: PullTypeParameterSymbol[];
        public returnType: PullTypeSymbol;
        public functionType: PullTypeSymbol;
        public hasOptionalParam: boolean;
        public nonOptionalParamCount: number;
        public hasVarArgs: boolean;
        public hasAGenericParameter: boolean;
        public hasBeenChecked: boolean;
        public inWrapCheck: boolean;
        constructor(kind: TypeScript.PullElementKind);
        public isDefinition(): boolean;
        public isGeneric(): boolean;
        public addParameter(parameter: PullSymbol, isOptional?: boolean): void;
        public addTypeParameter(typeParameter: PullTypeParameterSymbol): void;
        public getTypeParameters(): PullTypeParameterSymbol[];
        public findTypeParameter(name: string): PullTypeParameterSymbol;
        public isStringConstantOverloadSignature(): boolean;
        static getSignatureTypeMemberName(candidateSignature: PullSignatureSymbol, signatures: PullSignatureSymbol[], scopeSymbol: PullSymbol): TypeScript.MemberNameArray;
        static getSignaturesTypeNameEx(signatures: PullSignatureSymbol[], prefix: string, shortform: boolean, brackets: boolean, scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean, candidateSignature?: PullSignatureSymbol): TypeScript.MemberName[];
        public toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        public getSignatureTypeNameEx(prefix: string, shortform: boolean, brackets: boolean, scopeSymbol?: PullSymbol, getParamMarkerInfo?: boolean, getTypeParamMarkerInfo?: boolean): TypeScript.MemberNameArray;
        public wrapsSomeTypeParameter(typeParameterArgumentMap: PullTypeSymbol[]): boolean;
        public wrapsSomeNestedTypeIntoInfiniteExpansion(typeBeingWrapped: PullTypeSymbol, isCheckingTypeArgumentList: boolean, knownWrapMap: TypeScript.IBitMatrix): boolean;
    }
    class PullTypeSymbol extends PullSymbol {
        private _members;
        private _enclosedMemberTypes;
        private _enclosedMemberContainers;
        private _typeParameters;
        private _specializedVersionsOfThisType;
        private _arrayVersionOfThisType;
        private _implementedTypes;
        private _extendedTypes;
        private _typesThatExplicitlyImplementThisType;
        private _typesThatExtendThisType;
        private _callSignatures;
        private _allCallSignatures;
        private _constructSignatures;
        private _indexSignatures;
        private _allIndexSignatures;
        private _memberNameCache;
        private _enclosedTypeNameCache;
        private _enclosedContainerCache;
        private _typeParameterNameCache;
        private _containedNonMemberNameCache;
        private _containedNonMemberTypeNameCache;
        private _containedNonMemberContainerCache;
        private _simpleInstantiationCache;
        private _complexInstantiationCache;
        private _hasGenericSignature;
        private _hasGenericMember;
        private _hasBaseTypeConflict;
        private _knownBaseTypeCount;
        private _associatedContainerTypeSymbol;
        private _constructorMethod;
        private _hasDefaultConstructor;
        private _functionSymbol;
        private _inMemberTypeNameEx;
        public inSymbolPrivacyCheck: boolean;
        public inWrapCheck: boolean;
        public typeReference: TypeScript.PullTypeReferenceSymbol;
        constructor(name: string, kind: TypeScript.PullElementKind);
        private _isArrayNamedTypeReference;
        public isArrayNamedTypeReference(): boolean;
        private computeIsArrayNamedTypeReference();
        public isType(): boolean;
        public isClass(): boolean;
        public isFunction(): boolean;
        public isConstructor(): boolean;
        public isTypeParameter(): boolean;
        public isTypeVariable(): boolean;
        public isError(): boolean;
        public isEnum(): boolean;
        public getTypeParameterArgumentMap(): PullTypeSymbol[];
        public isObject(): boolean;
        public getKnownBaseTypeCount(): number;
        public resetKnownBaseTypeCount(): void;
        public incrementKnownBaseCount(): void;
        public setHasBaseTypeConflict(): void;
        public hasBaseTypeConflict(): boolean;
        public hasMembers(): boolean;
        public setHasGenericSignature(): void;
        public getHasGenericSignature(): boolean;
        public setHasGenericMember(): void;
        public getHasGenericMember(): boolean;
        public setAssociatedContainerType(type: PullTypeSymbol): void;
        public getAssociatedContainerType(): PullTypeSymbol;
        public getArrayType(): PullTypeSymbol;
        public getElementType(): PullTypeSymbol;
        public setArrayType(arrayType: PullTypeSymbol): void;
        public getFunctionSymbol(): PullSymbol;
        public setFunctionSymbol(symbol: PullSymbol): void;
        public findContainedNonMember(name: string): PullSymbol;
        public findContainedNonMemberType(typeName: string, kind?: TypeScript.PullElementKind): PullTypeSymbol;
        public findContainedNonMemberContainer(containerName: string, kind?: TypeScript.PullElementKind): PullTypeSymbol;
        public addMember(memberSymbol: PullSymbol): void;
        public addEnclosedMemberType(enclosedType: PullTypeSymbol): void;
        public addEnclosedMemberContainer(enclosedContainer: PullTypeSymbol): void;
        public addEnclosedNonMember(enclosedNonMember: PullSymbol): void;
        public addEnclosedNonMemberType(enclosedNonMemberType: PullTypeSymbol): void;
        public addEnclosedNonMemberContainer(enclosedNonMemberContainer: PullTypeSymbol): void;
        public addTypeParameter(typeParameter: PullTypeParameterSymbol): void;
        public addConstructorTypeParameter(typeParameter: PullTypeParameterSymbol): void;
        public getMembers(): PullSymbol[];
        public setHasDefaultConstructor(hasOne?: boolean): void;
        public getHasDefaultConstructor(): boolean;
        public getConstructorMethod(): PullSymbol;
        public setConstructorMethod(constructorMethod: PullSymbol): void;
        public getTypeParameters(): PullTypeParameterSymbol[];
        public isGeneric(): boolean;
        private canUseSimpleInstantiationCache(substitutingTypes);
        public addSpecialization(specializedVersionOfThisType: PullTypeSymbol, substitutingTypes: PullTypeSymbol[]): void;
        public getSpecialization(substitutingTypes: PullTypeSymbol[]): PullTypeSymbol;
        public getKnownSpecializations(): PullTypeSymbol[];
        public getTypeArguments(): PullTypeSymbol[];
        public getTypeArgumentsOrTypeParameters(): PullTypeSymbol[];
        public addCallSignature(callSignature: PullSignatureSymbol): void;
        public addConstructSignature(constructSignature: PullSignatureSymbol): void;
        public addIndexSignature(indexSignature: PullSignatureSymbol): void;
        private addUnhiddenSignaturesFromBaseType(derivedTypeSignatures, baseTypeSignatures, signaturesBeingAggregated);
        public hasOwnCallSignatures(): boolean;
        public getCallSignatures(): PullSignatureSymbol[];
        public hasOwnConstructSignatures(): boolean;
        public getConstructSignatures(): PullSignatureSymbol[];
        public hasOwnIndexSignatures(): boolean;
        public getOwnIndexSignatures(): PullSignatureSymbol[];
        public getIndexSignatures(): PullSignatureSymbol[];
        public addImplementedType(implementedType: PullTypeSymbol): void;
        public getImplementedTypes(): PullTypeSymbol[];
        public addExtendedType(extendedType: PullTypeSymbol): void;
        public getExtendedTypes(): PullTypeSymbol[];
        public addTypeThatExtendsThisType(type: PullTypeSymbol): void;
        public getTypesThatExtendThisType(): PullTypeSymbol[];
        public addTypeThatExplicitlyImplementsThisType(type: PullTypeSymbol): void;
        public getTypesThatExplicitlyImplementThisType(): PullTypeSymbol[];
        public hasBase(potentialBase: PullTypeSymbol, visited?: PullSymbol[]): boolean;
        public isValidBaseKind(baseType: PullTypeSymbol, isExtendedType: boolean): boolean;
        public findMember(name: string, lookInParent: boolean): PullSymbol;
        public findNestedType(name: string, kind?: TypeScript.PullElementKind): PullTypeSymbol;
        public findNestedContainer(name: string, kind?: TypeScript.PullElementKind): PullTypeSymbol;
        public getAllMembers(searchDeclKind: TypeScript.PullElementKind, memberVisiblity: GetAllMembersVisiblity): PullSymbol[];
        public findTypeParameter(name: string): PullTypeParameterSymbol;
        public setResolved(): void;
        public getNamePartForFullName(): string;
        public getScopedName(scopeSymbol?: PullSymbol, skipTypeParametersInName?: boolean, useConstraintInName?: boolean, skipInternalAliasName?: boolean): string;
        public isNamedTypeSymbol(): boolean;
        public toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        public getScopedNameEx(scopeSymbol?: PullSymbol, skipTypeParametersInName?: boolean, useConstraintInName?: boolean, getPrettyTypeName?: boolean, getTypeParamMarkerInfo?: boolean, skipInternalAliasName?: boolean): TypeScript.MemberName;
        public hasOnlyOverloadCallSignatures(): boolean;
        public getTypeOfSymbol(): PullSymbol;
        private getMemberTypeNameEx(topLevel, scopeSymbol?, getPrettyTypeName?);
        public getGenerativeTypeClassification(enclosingType: PullTypeSymbol): TypeScript.GenerativeTypeClassification;
        public wrapsSomeTypeParameter(typeParameterArgumentMap: TypeScript.CandidateInferenceInfo[]): boolean;
        public wrapsSomeTypeParameter(typeParameterArgumentMap: PullTypeSymbol[]): boolean;
        public wrapsSomeNestedTypeIntoInfiniteExpansion(typeBeingWrapped: PullTypeSymbol): boolean;
        private isTypeEquivalentToRootSymbol();
        private isTypeBeingWrapped(typeBeingWrapped);
        private anyRootTypeBeingWrapped(typeBeingWrapped);
        public _wrapsSomeNestedTypeIntoInfiniteExpansionRecurse(typeBeingWrapped: PullTypeSymbol, isCheckingTypeArgumentList: boolean, knownWrapMap: TypeScript.IBitMatrix): boolean;
        private _wrapsSomeNestedTypeIntoInfiniteExpansionWorker(typeBeingWrapped, isCheckingTypeArgumentList, knownWrapMap);
    }
    class PullPrimitiveTypeSymbol extends PullTypeSymbol {
        constructor(name: string);
        public isAny(): boolean;
        public isStringConstant(): boolean;
        public setUnresolved(): void;
    }
    class PullStringConstantTypeSymbol extends PullPrimitiveTypeSymbol {
        constructor(name: string);
        public isStringConstant(): boolean;
    }
    class PullErrorTypeSymbol extends PullPrimitiveTypeSymbol {
        private anyType;
        constructor(anyType: PullTypeSymbol, name: string);
        public isError(): boolean;
        public getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        public getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, skipInternalAliasName?: boolean): string;
        public toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
    }
    class PullContainerSymbol extends PullTypeSymbol {
        public instanceSymbol: PullSymbol;
        private assignedValue;
        private assignedType;
        private assignedContainer;
        constructor(name: string, kind: TypeScript.PullElementKind);
        public isContainer(): boolean;
        public setInstanceSymbol(symbol: PullSymbol): void;
        public getInstanceSymbol(): PullSymbol;
        public setExportAssignedValueSymbol(symbol: PullSymbol): void;
        public getExportAssignedValueSymbol(): PullSymbol;
        public setExportAssignedTypeSymbol(type: PullTypeSymbol): void;
        public getExportAssignedTypeSymbol(): PullTypeSymbol;
        public setExportAssignedContainerSymbol(container: PullContainerSymbol): void;
        public getExportAssignedContainerSymbol(): PullContainerSymbol;
        public hasExportAssignment(): boolean;
        static usedAsSymbol(containerSymbol: PullSymbol, symbol: PullSymbol): boolean;
        public getInstanceType(): PullTypeSymbol;
    }
    class PullTypeAliasSymbol extends PullTypeSymbol {
        private _assignedValue;
        private _assignedType;
        private _assignedContainer;
        private _isUsedAsValue;
        private _typeUsedExternally;
        private retrievingExportAssignment;
        constructor(name: string);
        public typeUsedExternally(): boolean;
        public isUsedAsValue(): boolean;
        public setTypeUsedExternally(value: boolean): void;
        public setIsUsedAsValue(value: boolean): void;
        public assignedValue(): PullSymbol;
        public assignedType(): PullTypeSymbol;
        public assignedContainer(): PullContainerSymbol;
        public isAlias(): boolean;
        public isContainer(): boolean;
        public setAssignedValueSymbol(symbol: PullSymbol): void;
        public getExportAssignedValueSymbol(): PullSymbol;
        public setAssignedTypeSymbol(type: PullTypeSymbol): void;
        public getExportAssignedTypeSymbol(): PullTypeSymbol;
        public setAssignedContainerSymbol(container: PullContainerSymbol): void;
        public getExportAssignedContainerSymbol(): PullContainerSymbol;
        public getMembers(): PullSymbol[];
        public getCallSignatures(): PullSignatureSymbol[];
        public getConstructSignatures(): PullSignatureSymbol[];
        public getIndexSignatures(): PullSignatureSymbol[];
        public findMember(name: string): PullSymbol;
        public findNestedType(name: string): PullTypeSymbol;
        public findNestedContainer(name: string): PullTypeSymbol;
        public getAllMembers(searchDeclKind: TypeScript.PullElementKind, memberVisibility: GetAllMembersVisiblity): PullSymbol[];
    }
    class PullDefinitionSignatureSymbol extends PullSignatureSymbol {
        public isDefinition(): boolean;
    }
    class PullTypeParameterSymbol extends PullTypeSymbol {
        private _isFunctionTypeParameter;
        private _constraint;
        constructor(name: string, _isFunctionTypeParameter: boolean);
        public isTypeParameter(): boolean;
        public isFunctionTypeParameter(): boolean;
        public setConstraint(constraintType: PullTypeSymbol): void;
        public getConstraint(): PullTypeSymbol;
        public getCallSignatures(): PullSignatureSymbol[];
        public getConstructSignatures(): PullSignatureSymbol[];
        public getIndexSignatures(): PullSignatureSymbol[];
        public isGeneric(): boolean;
        public fullName(scopeSymbol?: PullSymbol): string;
        public getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        public getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, skipInternalAliasName?: boolean): string;
        public isExternallyVisible(inIsExternallyVisibleSymbols?: PullSymbol[]): boolean;
    }
    class PullAccessorSymbol extends PullSymbol {
        private _getterSymbol;
        private _setterSymbol;
        constructor(name: string);
        public isAccessor(): boolean;
        public setSetter(setter: PullSymbol): void;
        public getSetter(): PullSymbol;
        public setGetter(getter: PullSymbol): void;
        public getGetter(): PullSymbol;
    }
    function getIDForTypeSubstitutions(types: PullTypeSymbol[]): string;
    enum GetAllMembersVisiblity {
        all = 0,
        internallyVisible = 1,
        externallyVisible = 2,
    }
}
declare module TypeScript {
    class CandidateInferenceInfo {
        public typeParameter: TypeScript.PullTypeParameterSymbol;
        public isFixed: boolean;
        public inferenceCandidates: TypeScript.PullTypeSymbol[];
        public addCandidate(candidate: TypeScript.PullTypeSymbol): void;
    }
    class ArgumentInferenceContext {
        public inferenceCache: TypeScript.IBitMatrix;
        public candidateCache: CandidateInferenceInfo[];
        public fixedParameterTypes: TypeScript.PullTypeSymbol[];
        public resolver: TypeScript.PullTypeResolver;
        public argumentASTs: TypeScript.ISeparatedSyntaxList2;
        constructor(resolver: TypeScript.PullTypeResolver, argumentASTs: TypeScript.ISeparatedSyntaxList2);
        constructor(resolver: TypeScript.PullTypeResolver, fixedParameterTypes: TypeScript.PullTypeSymbol[]);
        public alreadyRelatingTypes(objectType: TypeScript.PullTypeSymbol, parameterType: TypeScript.PullTypeSymbol): boolean;
        public resetRelationshipCache(): void;
        public addInferenceRoot(param: TypeScript.PullTypeParameterSymbol): void;
        public getInferenceInfo(param: TypeScript.PullTypeParameterSymbol): CandidateInferenceInfo;
        public addCandidateForInference(param: TypeScript.PullTypeParameterSymbol, candidate: TypeScript.PullTypeSymbol, fix: boolean): void;
        public getInferenceArgumentCount(): number;
        public getArgumentTypeSymbolAtIndex(i: number, context: PullTypeResolutionContext): TypeScript.PullTypeSymbol;
        public getInferenceCandidates(): TypeScript.PullTypeSymbol[][];
        public inferArgumentTypes(resolver: TypeScript.PullTypeResolver, context: PullTypeResolutionContext): {
            results: {
                param: TypeScript.PullTypeParameterSymbol;
                type: TypeScript.PullTypeSymbol;
            }[];
            unfit: boolean;
        };
    }
    class PullContextualTypeContext {
        public contextualType: TypeScript.PullTypeSymbol;
        public provisional: boolean;
        public substitutions: TypeScript.PullTypeSymbol[];
        public provisionallyTypedSymbols: TypeScript.PullSymbol[];
        public hasProvisionalErrors: boolean;
        private astSymbolMap;
        constructor(contextualType: TypeScript.PullTypeSymbol, provisional: boolean, substitutions: TypeScript.PullTypeSymbol[]);
        public recordProvisionallyTypedSymbol(symbol: TypeScript.PullSymbol): void;
        public invalidateProvisionallyTypedSymbols(): void;
        public setSymbolForAST(ast: TypeScript.AST, symbol: TypeScript.PullSymbol): void;
        public getSymbolForAST(ast: TypeScript.AST): TypeScript.PullSymbol;
    }
    class PullTypeResolutionContext {
        private resolver;
        public inTypeCheck: boolean;
        public fileName: string;
        private contextStack;
        private typeCheckedNodes;
        constructor(resolver: TypeScript.PullTypeResolver, inTypeCheck?: boolean, fileName?: string);
        public setTypeChecked(ast: TypeScript.AST): void;
        public canTypeCheckAST(ast: TypeScript.AST): boolean;
        public pushContextualType(type: TypeScript.PullTypeSymbol, provisional: boolean, substitutions: TypeScript.PullTypeSymbol[]): void;
        public popContextualType(): PullContextualTypeContext;
        public hasProvisionalErrors(): boolean;
        public findSubstitution(type: TypeScript.PullTypeSymbol): TypeScript.PullTypeSymbol;
        public getContextualType(): TypeScript.PullTypeSymbol;
        public inProvisionalResolution(): boolean;
        private inBaseTypeResolution;
        public isInBaseTypeResolution(): boolean;
        public startBaseTypeResolution(): boolean;
        public doneBaseTypeResolution(wasInBaseTypeResolution: boolean): void;
        public setTypeInContext(symbol: TypeScript.PullSymbol, type: TypeScript.PullTypeSymbol): void;
        public postDiagnostic(diagnostic: TypeScript.Diagnostic): void;
        public typeCheck(): boolean;
        public setSymbolForAST(ast: TypeScript.AST, symbol: TypeScript.PullSymbol): void;
        public getSymbolForAST(ast: TypeScript.AST): TypeScript.PullSymbol;
    }
}
declare module TypeScript {
    interface IPullTypeCollection {
        getLength(): number;
        getTypeAtIndex(index: number): TypeScript.PullTypeSymbol;
    }
    class PullAdditionalCallResolutionData {
        public targetSymbol: TypeScript.PullSymbol;
        public resolvedSignatures: TypeScript.PullSignatureSymbol[];
        public candidateSignature: TypeScript.PullSignatureSymbol;
        public actualParametersContextTypeSymbols: TypeScript.PullTypeSymbol[];
        public diagnosticsFromOverloadResolution: TypeScript.Diagnostic[];
    }
    class PullAdditionalObjectLiteralResolutionData {
        public membersContextTypeSymbols: TypeScript.PullTypeSymbol[];
    }
    class PullTypeResolver {
        private compilationSettings;
        public semanticInfoChain: TypeScript.SemanticInfoChain;
        private _cachedArrayInterfaceType;
        private _cachedNumberInterfaceType;
        private _cachedStringInterfaceType;
        private _cachedBooleanInterfaceType;
        private _cachedObjectInterfaceType;
        private _cachedFunctionInterfaceType;
        private _cachedIArgumentsInterfaceType;
        private _cachedRegExpInterfaceType;
        private _cachedAnyTypeArgs;
        private typeCheckCallBacks;
        private postTypeCheckWorkitems;
        private _cachedFunctionArgumentsSymbol;
        private assignableCache;
        private subtypeCache;
        private identicalCache;
        constructor(compilationSettings: TypeScript.ImmutableCompilationSettings, semanticInfoChain: TypeScript.SemanticInfoChain);
        private cachedArrayInterfaceType();
        public getArrayNamedType(): TypeScript.PullTypeSymbol;
        private cachedNumberInterfaceType();
        private cachedStringInterfaceType();
        private cachedBooleanInterfaceType();
        private cachedObjectInterfaceType();
        private cachedFunctionInterfaceType();
        private cachedIArgumentsInterfaceType();
        private cachedRegExpInterfaceType();
        private cachedFunctionArgumentsSymbol();
        private setTypeChecked(ast, context);
        private canTypeCheckAST(ast, context);
        private setSymbolForAST(ast, symbol, context);
        private getSymbolForAST(ast, context);
        public getASTForDecl(decl: TypeScript.PullDecl): TypeScript.AST;
        public getNewErrorTypeSymbol(name?: string): TypeScript.PullErrorTypeSymbol;
        public getEnclosingDecl(decl: TypeScript.PullDecl): TypeScript.PullDecl;
        private getExportedMemberSymbol(symbol, parent);
        private getMemberSymbol(symbolName, declSearchKind, parent);
        private getSymbolFromDeclPath(symbolName, declPath, declSearchKind);
        private getVisibleDeclsFromDeclPath(declPath, declSearchKind);
        private addFilteredDecls(decls, declSearchKind, result);
        public getVisibleDecls(enclosingDecl: TypeScript.PullDecl): TypeScript.PullDecl[];
        public getVisibleContextSymbols(enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): TypeScript.PullSymbol[];
        public getVisibleMembersFromExpression(expression: TypeScript.AST, enclosingDecl: TypeScript.PullDecl, context: TypeScript.PullTypeResolutionContext): TypeScript.PullSymbol[];
        private isAnyOrEquivalent(type);
        private resolveExternalModuleReference(idText, currentFileName);
        public resolveDeclaredSymbol(symbol: TypeScript.PullSymbol, context?: TypeScript.PullTypeResolutionContext): TypeScript.PullSymbol;
        private resolveDeclaredSymbolWorker(symbol, context);
        private resolveOtherDeclarations(astName, context);
        private resolveSourceUnit(sourceUnit, context);
        private typeCheckSourceUnit(sourceUnit, context);
        private resolveEnumDeclaration(ast, context);
        private typeCheckEnumDeclaration(ast, context);
        private postTypeCheckEnumDeclaration(ast, context);
        private resolveModuleDeclaration(ast, context);
        private ensureAllSymbolsAreBound(containerSymbol);
        private resolveModuleSymbol(containerSymbol, context, moduleDeclAST, moduleDeclNameAST, sourceUnitAST);
        private resolveFirstExportAssignmentStatement(moduleElements, context);
        private resolveSingleModuleDeclaration(ast, astName, context);
        private typeCheckModuleDeclaration(ast, context);
        private typeCheckSingleModuleDeclaration(ast, astName, context);
        private postTypeCheckModuleDeclaration(ast, context);
        private isTypeRefWithoutTypeArgs(term);
        public createInstantiatedType(type: TypeScript.PullTypeSymbol, typeArguments: TypeScript.PullTypeSymbol[]): TypeScript.PullTypeSymbol;
        private resolveReferenceTypeDeclaration(classOrInterface, name, heritageClauses, context);
        private resolveClassDeclaration(classDeclAST, context);
        private typeCheckTypeParametersOfTypeDeclaration(classOrInterface, context);
        private typeCheckClassDeclaration(classDeclAST, context);
        private postTypeCheckClassDeclaration(classDeclAST, context);
        private resolveTypeSymbolSignatures(typeSymbol, context);
        private resolveInterfaceDeclaration(interfaceDeclAST, context);
        private typeCheckInterfaceDeclaration(interfaceDeclAST, context);
        private filterSymbol(symbol, kind, enclosingDecl, context);
        private getMemberSymbolOfKind(symbolName, kind, pullTypeSymbol, enclosingDecl, context);
        private resolveIdentifierOfInternalModuleReference(importDecl, identifier, moduleSymbol, enclosingDecl, context);
        private resolveModuleReference(importDecl, moduleNameExpr, enclosingDecl, context, declPath);
        private resolveInternalModuleReference(importStatementAST, context);
        private resolveImportDeclaration(importStatementAST, context);
        private typeCheckImportDeclaration(importStatementAST, context);
        private postTypeCheckImportDeclaration(importStatementAST, context);
        private resolveExportAssignmentStatement(exportAssignmentAST, context);
        private resolveAnyFunctionTypeSignature(funcDeclAST, typeParameters, parameterList, returnTypeAnnotation, context);
        private resolveFunctionTypeSignatureParameter(argDeclAST, signature, enclosingDecl, context);
        private resolveFunctionExpressionParameter(argDeclAST, id, typeExpr, equalsValueClause, contextParam, enclosingDecl, context);
        private checkNameForCompilerGeneratedDeclarationCollision(astWithName, isDeclaration, name, context, immediateThisCheck?);
        private hasRestParameterCodeGen(someFunctionDecl);
        private checkArgumentsCollides(ast, context);
        private checkIndexOfRestArgumentInitializationCollides(ast, context);
        private checkExternalModuleRequireExportsCollides(ast, name, context);
        private resolveObjectTypeTypeReference(objectType, context);
        private typeCheckObjectTypeTypeReference(objectType, context);
        private resolveTypeAnnotation(typeAnnotation, context);
        public resolveTypeReference(typeRef: TypeScript.AST, context: TypeScript.PullTypeResolutionContext): TypeScript.PullTypeSymbol;
        private computeTypeReferenceSymbol(term, context);
        private genericTypeIsUsedWithoutRequiredTypeArguments(typeSymbol, term, context);
        private resolveMemberVariableDeclaration(varDecl, context);
        private resolvePropertySignature(varDecl, context);
        private resolveVariableDeclarator(varDecl, context);
        private resolveParameterList(list, context);
        private resolveParameter(parameter, context);
        private getEnumTypeSymbol(enumElement, context);
        private resolveEnumElement(enumElement, context);
        private typeCheckEnumElement(enumElement, context);
        private resolveEqualsValueClause(clause, isContextuallyTyped, context);
        private resolveVariableDeclaratorOrParameterOrEnumElement(varDeclOrParameter, modifiers, name, typeExpr, init, context);
        private resolveAndTypeCheckVariableDeclarationTypeExpr(varDeclOrParameter, name, typeExpr, context);
        private resolveAndTypeCheckVariableDeclaratorOrParameterInitExpr(varDeclOrParameter, name, typeExpr, init, context, typeExprSymbol);
        private typeCheckPropertySignature(varDecl, context);
        private typeCheckMemberVariableDeclaration(varDecl, context);
        private typeCheckVariableDeclarator(varDecl, context);
        private typeCheckParameter(parameter, context);
        private typeCheckVariableDeclaratorOrParameterOrEnumElement(varDeclOrParameter, modifiers, name, typeExpr, init, context);
        private isForInVariableDeclarator(ast);
        private checkSuperCaptureVariableCollides(superAST, isDeclaration, context);
        private checkThisCaptureVariableCollides(_thisAST, isDeclaration, context);
        private postTypeCheckVariableDeclaratorOrParameter(varDeclOrParameter, context);
        private resolveTypeParameterDeclaration(typeParameterAST, context);
        private typeCheckTypeParameterDeclaration(typeParameterAST, context);
        private resolveConstraint(constraint, context);
        private resolveFunctionBodyReturnTypes(funcDeclAST, block, bodyExpression, signature, useContextualType, enclosingDecl, context);
        private typeCheckConstructorDeclaration(funcDeclAST, context);
        private constructorHasSuperCall(constructorDecl);
        private typeCheckFunctionExpression(funcDecl, context);
        private typeCheckCallSignature(funcDecl, context);
        private typeCheckConstructSignature(funcDecl, context);
        private typeCheckFunctionDeclaration(funcDeclAST, isStatic, name, typeParameters, parameters, returnTypeAnnotation, block, context);
        private typeCheckIndexSignature(funcDeclAST, context);
        private postTypeCheckFunctionDeclaration(funcDeclAST, context);
        private resolveReturnTypeAnnotationOfFunctionDeclaration(funcDeclAST, returnTypeAnnotation, context);
        private resolveMemberFunctionDeclaration(funcDecl, context);
        private resolveCallSignature(funcDecl, context);
        private resolveConstructSignature(funcDecl, context);
        private resolveMethodSignature(funcDecl, context);
        private resolveAnyFunctionDeclaration(funcDecl, context);
        private resolveFunctionExpression(funcDecl, isContextuallyTyped, context);
        private resolveSimpleArrowFunctionExpression(funcDecl, isContextuallyTyped, context);
        private resolveParenthesizedArrowFunctionExpression(funcDecl, isContextuallyTyped, context);
        private getEnclosingClassDeclaration(ast);
        private resolveConstructorDeclaration(funcDeclAST, context);
        private resolveIndexMemberDeclaration(ast, context);
        private resolveIndexSignature(funcDeclAST, context);
        private resolveFunctionDeclaration(funcDeclAST, isStatic, name, typeParameters, parameterList, returnTypeAnnotation, block, context);
        private resolveGetterReturnTypeAnnotation(getterFunctionDeclarationAst, enclosingDecl, context);
        private resolveSetterArgumentTypeAnnotation(setterFunctionDeclarationAst, enclosingDecl, context);
        private resolveAccessorDeclaration(funcDeclAst, context);
        private typeCheckAccessorDeclaration(funcDeclAst, context);
        private resolveGetAccessorDeclaration(funcDeclAST, parameters, returnTypeAnnotation, block, setterAnnotatedType, context);
        private checkIfGetterAndSetterTypeMatch(funcDeclAST, context);
        private typeCheckGetAccessorDeclaration(funcDeclAST, context);
        static hasSetAccessorParameterTypeAnnotation(setAccessor: TypeScript.SetAccessor): boolean;
        private resolveSetAccessorDeclaration(funcDeclAST, parameterList, context);
        private typeCheckSetAccessorDeclaration(funcDeclAST, context);
        private resolveList(list, context);
        private resolveSeparatedList(list, context);
        private resolveVoidExpression(ast, context);
        private resolveLogicalOperation(ast, context);
        private typeCheckLogicalOperation(binex, context);
        private resolveLogicalNotExpression(ast, context);
        private resolveUnaryArithmeticOperation(ast, context);
        private resolvePostfixUnaryExpression(ast, context);
        private isAnyOrNumberOrEnum(type);
        private typeCheckUnaryArithmeticOperation(unaryExpression, context);
        private typeCheckPostfixUnaryExpression(unaryExpression, context);
        private resolveBinaryArithmeticExpression(binaryExpression, context);
        private typeCheckBinaryArithmeticExpression(binaryExpression, context);
        private resolveTypeOfExpression(ast, context);
        private resolveThrowStatement(ast, context);
        private resolveDeleteExpression(ast, context);
        private resolveInstanceOfExpression(ast, context);
        private typeCheckInstanceOfExpression(binaryExpression, context);
        private resolveCommaExpression(commaExpression, context);
        private resolveInExpression(ast, context);
        private typeCheckInExpression(binaryExpression, context);
        private resolveForStatement(ast, context);
        private resolveForInStatement(forInStatement, context);
        private typeCheckForInStatement(forInStatement, context);
        private resolveWhileStatement(ast, context);
        private typeCheckWhileStatement(ast, context);
        private resolveDoStatement(ast, context);
        private typeCheckDoStatement(ast, context);
        private resolveIfStatement(ast, context);
        private typeCheckIfStatement(ast, context);
        private resolveElseClause(ast, context);
        private typeCheckElseClause(ast, context);
        private resolveBlock(ast, context);
        private resolveVariableStatement(ast, context);
        private resolveVariableDeclarationList(ast, context);
        private resolveWithStatement(ast, context);
        private typeCheckWithStatement(ast, context);
        private resolveTryStatement(ast, context);
        private typeCheckTryStatement(ast, context);
        private resolveCatchClause(ast, context);
        private typeCheckCatchClause(ast, context);
        private resolveFinallyClause(ast, context);
        private typeCheckFinallyClause(ast, context);
        private getEnclosingFunctionDeclaration(ast);
        private resolveReturnExpression(expression, enclosingFunction, context);
        private typeCheckReturnExpression(expression, expressionType, enclosingFunction, context);
        private resolveReturnStatement(returnAST, context);
        private resolveSwitchStatement(ast, context);
        private typeCheckSwitchStatement(ast, context);
        private resolveLabeledStatement(ast, context);
        private typeCheckLabeledStatement(ast, context);
        private labelIsOnContinuableConstruct(statement);
        private resolveContinueStatement(ast, context);
        private isIterationStatement(ast);
        private isAnyFunctionExpressionOrDeclaration(ast);
        private inSwitchStatement(ast);
        private inIterationStatement(ast);
        private getEnclosingLabels(ast, breakable, crossFunctions);
        private typeCheckContinueStatement(ast, context);
        private resolveBreakStatement(ast, context);
        private typeCheckBreakStatement(ast, context);
        public resolveAST(ast: TypeScript.AST, isContextuallyTyped: boolean, context: TypeScript.PullTypeResolutionContext): TypeScript.PullSymbol;
        private typeCheckAST(ast, isContextuallyTyped, context);
        private processPostTypeCheckWorkItems(context);
        private postTypeCheck(ast, context);
        private resolveRegularExpressionLiteral();
        private postTypeCheckNameExpression(nameAST, context);
        private typeCheckNameExpression(nameAST, context);
        private resolveNameExpression(nameAST, context);
        private isSomeFunctionScope(declPath);
        private computeNameExpression(nameAST, context, reportDiagnostics);
        private getCurrentParameterIndexForFunction(parameter, funcDecl);
        private resolveMemberAccessExpression(dottedNameAST, context);
        private resolveDottedNameExpression(dottedNameAST, expression, name, context);
        private computeDottedNameExpression(expression, name, context, checkSuperPrivateAndStaticAccess);
        private resolveTypeNameExpression(nameAST, context);
        private computeTypeNameExpression(nameAST, context);
        private isLeftSideOfQualifiedName(ast);
        private resolveGenericTypeReference(genericTypeAST, context);
        private resolveQualifiedName(dottedNameAST, context);
        private computeQualifiedName(dottedNameAST, context);
        private shouldContextuallyTypeAnyFunctionExpression(functionExpressionAST, typeParameters, parameters, returnTypeAnnotation, context);
        private resolveAnyFunctionExpression(funcDeclAST, typeParameters, parameters, returnTypeAnnotation, block, bodyExpression, isContextuallyTyped, context);
        private typeCheckSimpleArrowFunctionExpression(arrowFunction, context);
        private typeCheckParenthesizedArrowFunctionExpression(arrowFunction, context);
        private typeCheckAnyFunctionExpression(funcDeclAST, typeParameters, returnTypeAnnotation, block, bodyExpression, context);
        private resolveThisExpression(thisExpression, context);
        private inTypeArgumentList(ast);
        private inClassExtendsHeritageClause(ast);
        private inTypeQuery(ast);
        private inArgumentListOfSuperInvocation(ast);
        private inConstructorParameterList(ast);
        private isFunctionOrNonArrowFunctionExpression(decl);
        private typeCheckThisExpression(thisExpression, context, enclosingDecl);
        private getContextualClassSymbolForEnclosingDecl(ast, enclosingDecl);
        private inStaticMemberVariableDeclaration(ast);
        private resolveSuperExpression(ast, context);
        private typeCheckSuperExpression(ast, context, enclosingDecl);
        private resolveSimplePropertyAssignment(propertyAssignment, isContextuallyTyped, context);
        private resolveFunctionPropertyAssignment(funcProp, isContextuallyTyped, context);
        private typeCheckFunctionPropertyAssignment(funcProp, isContextuallyTyped, context);
        public resolveObjectLiteralExpression(expressionAST: TypeScript.ObjectLiteralExpression, isContextuallyTyped: boolean, context: TypeScript.PullTypeResolutionContext, additionalResults?: PullAdditionalObjectLiteralResolutionData): TypeScript.PullSymbol;
        private bindObjectLiteralMembers(objectLiteralDeclaration, objectLiteralTypeSymbol, objectLiteralMembers, isUsingExistingSymbol, pullTypeContext);
        private resolveObjectLiteralMembers(objectLiteralDeclaration, objectLiteralTypeSymbol, objectLiteralContextualType, objectLiteralMembers, stringIndexerSignature, numericIndexerSignature, allMemberTypes, allNumericMemberTypes, boundMemberSymbols, isUsingExistingSymbol, pullTypeContext, additionalResults?);
        private computeObjectLiteralExpression(objectLitAST, isContextuallyTyped, context, additionalResults?);
        private getPropertyAssignmentName(propertyAssignment);
        private stampObjectLiteralWithIndexSignature(objectLiteralSymbol, indexerTypeCandidates, contextualIndexSignature, context);
        private resolveArrayLiteralExpression(arrayLit, isContextuallyTyped, context);
        private computeArrayLiteralExpressionSymbol(arrayLit, isContextuallyTyped, context);
        private resolveElementAccessExpression(callEx, context);
        private typeCheckElementAccessExpression(callEx, context, symbolAndDiagnostic);
        private computeElementAccessExpressionSymbolAndDiagnostic(callEx, context);
        private getBothKindsOfIndexSignatures(enclosingType, context);
        private resolveBinaryAdditionOperation(binaryExpression, context);
        private bestCommonTypeOfTwoTypes(type1, type2, context);
        private bestCommonTypeOfThreeTypes(type1, type2, type3, context);
        private resolveLogicalOrExpression(binex, isContextuallyTyped, context);
        private resolveLogicalAndExpression(binex, context);
        private computeTypeOfConditionalExpression(leftType, rightType, isContextuallyTyped, context);
        private resolveConditionalExpression(trinex, isContextuallyTyped, context);
        private conditionExpressionTypesAreValid(leftType, rightType, expressionType, isContextuallyTyped, context);
        private resolveParenthesizedExpression(ast, context);
        private resolveExpressionStatement(ast, context);
        public resolveInvocationExpression(callEx: TypeScript.InvocationExpression, context: TypeScript.PullTypeResolutionContext, additionalResults?: PullAdditionalCallResolutionData): TypeScript.PullSymbol;
        private typeCheckInvocationExpression(callEx, context);
        private computeInvocationExpressionSymbol(callEx, context, additionalResults);
        public resolveObjectCreationExpression(callEx: TypeScript.ObjectCreationExpression, context: TypeScript.PullTypeResolutionContext, additionalResults?: PullAdditionalCallResolutionData): TypeScript.PullSymbol;
        private typeCheckObjectCreationExpression(callEx, context);
        private postOverloadResolutionDiagnostics(diagnostic, additionalResults, context);
        private computeObjectCreationExpressionSymbol(callEx, context, additionalResults);
        private instantiateSignatureInContext(signatureA, signatureB, context);
        private resolveCastExpression(assertionExpression, context);
        private typeCheckCastExpression(assertionExpression, context, typeAssertionType);
        private resolveAssignmentExpression(binaryExpression, context);
        private getInstanceTypeForAssignment(lhs, type, context);
        public widenType(type: TypeScript.PullTypeSymbol, ast?: TypeScript.AST, context?: TypeScript.PullTypeResolutionContext): TypeScript.PullTypeSymbol;
        public findBestCommonType(collection: IPullTypeCollection, context: TypeScript.PullTypeResolutionContext, comparisonInfo?: TypeComparisonInfo): TypeScript.PullTypeSymbol;
        private typeIsBestCommonTypeCandidate(candidateType, collection, context);
        private typesAreIdenticalInEnclosingTypes(t1, t2, t1EnclosingType, t2EnclosingType, val?);
        public typesAreIdentical(t1: TypeScript.PullTypeSymbol, t2: TypeScript.PullTypeSymbol, val?: TypeScript.AST): boolean;
        private signatureGroupsAreIdentical(sg1, sg2);
        public signaturesAreIdentical(s1: TypeScript.PullSignatureSymbol, s2: TypeScript.PullSignatureSymbol, includingReturnType?: boolean): boolean;
        private substituteUpperBoundForType(type);
        private symbolsShareDeclaration(symbol1, symbol2);
        private sourceExtendsTarget(source, target, context);
        private sourceIsSubtypeOfTarget(source, target, ast, context, comparisonInfo?, isComparingInstantiatedSignatures?);
        private sourceMembersAreSubtypeOfTargetMembers(source, target, ast, context, comparisonInfo, isComparingInstantiatedSignatures?);
        private sourcePropertyIsSubtypeOfTargetProperty(source, target, sourceProp, targetProp, ast, context, comparisonInfo, isComparingInstantiatedSignatures?);
        private sourceCallSignaturesAreSubtypeOfTargetCallSignatures(source, target, ast, context, comparisonInfo, isComparingInstantiatedSignatures?);
        private sourceConstructSignaturesAreSubtypeOfTargetConstructSignatures(source, target, ast, context, comparisonInfo, isComparingInstantiatedSignatures?);
        private sourceIndexSignaturesAreSubtypeOfTargetIndexSignatures(source, target, ast, context, comparisonInfo, isComparingInstantiatedSignatures?);
        private typeIsSubtypeOfFunction(source, ast, context);
        private signatureIsSubtypeOfTarget(s1, s2, ast, context, comparisonInfo?, isComparingInstantiatedSignatures?);
        private sourceIsAssignableToTarget(source, target, ast, context, comparisonInfo?, isComparingInstantiatedSignatures?);
        private signatureIsAssignableToTarget(s1, s2, ast, context, comparisonInfo, isComparingInstantiatedSignatures?);
        private getSymbolForRelationshipCheck(symbol);
        private sourceIsRelatableToTargetInEnclosingTypes(source, target, sourceEnclosingType, targetEnclosingType, assignableTo, comparisonCache, ast, context, comparisonInfo, isComparingInstantiatedSignatures);
        private sourceIsRelatableToTarget(source, target, assignableTo, comparisonCache, ast, context, comparisonInfo, isComparingInstantiatedSignatures);
        private sourceMembersAreRelatableToTargetMembers(source, target, assignableTo, comparisonCache, ast, context, comparisonInfo, isComparingInstantiatedSignatures);
        private infinitelyExpandingSourceTypeIsRelatableToTargetType(sourceType, targetType, assignableTo, comparisonCache, ast, context, comparisonInfo, isComparingInstantiatedSignatures);
        private infinitelyExpandingTypesAreIdentical(sourceType, targetType);
        private sourcePropertyIsRelatableToTargetProperty(source, target, sourceProp, targetProp, assignableTo, comparisonCache, ast, context, comparisonInfo, isComparingInstantiatedSignatures);
        private sourceCallSignaturesAreRelatableToTargetCallSignatures(source, target, assignableTo, comparisonCache, ast, context, comparisonInfo, isComparingInstantiatedSignatures);
        private sourceConstructSignaturesAreRelatableToTargetConstructSignatures(source, target, assignableTo, comparisonCache, ast, context, comparisonInfo, isComparingInstantiatedSignatures);
        private sourceIndexSignaturesAreRelatableToTargetIndexSignatures(source, target, assignableTo, comparisonCache, ast, context, comparisonInfo, isComparingInstantiatedSignatures);
        private signatureGroupIsRelatableToTarget(sourceSG, targetSG, assignableTo, comparisonCache, ast, context, comparisonInfo, isComparingInstantiatedSignatures);
        private signatureIsRelatableToTarget(sourceSig, targetSig, assignableTo, comparisonCache, ast, context, comparisonInfo, isComparingInstantiatedSignatures);
        private resolveOverloads(application, group, haveTypeArgumentsAtCallSite, context, diagnostics);
        private getCallTargetErrorSpanAST(callEx);
        private overloadHasCorrectArity(signature, args);
        private overloadIsApplicable(signature, args, context, comparisonInfo);
        private overloadIsApplicableForArgument(paramType, arg, argIndex, context, comparisonInfo);
        private overloadIsApplicableForAnyFunctionExpressionArgument(paramType, arg, typeParameters, parameters, returnTypeAnnotation, block, bodyExpression, argIndex, context, comparisonInfo);
        private overloadIsApplicableForObjectLiteralArgument(paramType, arg, argIndex, context, comparisonInfo);
        private overloadIsApplicableForArrayLiteralArgument(paramType, arg, argIndex, context, comparisonInfo);
        private overloadIsApplicableForOtherArgument(paramType, arg, argIndex, context, comparisonInfo);
        private overloadIsApplicableForArgumentHelper(paramType, argSym, argumentIndex, comparisonInfo, arg, context);
        private inferArgumentTypesForSignature(signature, argContext, comparisonInfo, context);
        private typeParametersAreInScopeAtArgumentList(typeParameters, args);
        private relateTypeToTypeParametersInEnclosingType(expressionType, parameterType, expressionTypeEnclosingType, parameterTypeEnclosingType, shouldFix, argContext, context);
        private relateTypeToTypeParameters(expressionType, parameterType, shouldFix, argContext, context);
        private relateTypeArgumentsOfTypeToTypeParameters(expressionType, parameterType, shouldFix, argContext, context);
        private relateInifinitelyExpandingTypeToTypeParameters(expressionType, parameterType, shouldFix, argContext, context);
        private relateFunctionSignatureToTypeParameters(expressionSignature, parameterSignature, argContext, context);
        private relateObjectTypeToTypeParameters(objectType, parameterType, shouldFix, argContext, context);
        private relateArrayTypeToTypeParameters(argArrayType, parameterArrayType, shouldFix, argContext, context);
        public instantiateTypeToAny(typeToSpecialize: TypeScript.PullTypeSymbol, context: TypeScript.PullTypeResolutionContext): TypeScript.PullTypeSymbol;
        static globalTypeCheckPhase: number;
        static typeCheck(compilationSettings: TypeScript.ImmutableCompilationSettings, semanticInfoChain: TypeScript.SemanticInfoChain, document: TypeScript.Document): void;
        private validateVariableDeclarationGroups(enclosingDecl, context);
        private typeCheckFunctionOverloads(funcDecl, context, signature?, allSignatures?);
        private checkSymbolPrivacy(declSymbol, symbol, privacyErrorReporter);
        private checkTypePrivacyOfSignatures(declSymbol, signatures, privacyErrorReporter);
        private typeParameterOfTypeDeclarationPrivacyErrorReporter(classOrInterface, indexOfTypeParameter, typeParameter, symbol, context);
        private baseListPrivacyErrorReporter(classOrInterface, declSymbol, baseAst, isExtendedType, symbol, context);
        private variablePrivacyErrorReporter(declAST, declSymbol, symbol, context);
        private checkFunctionTypePrivacy(funcDeclAST, isStatic, typeParameters, parameters, returnTypeAnnotation, block, context);
        private functionTypeArgumentArgumentTypePrivacyErrorReporter(declAST, isStatic, typeParameterAST, typeParameter, symbol, context);
        private functionArgumentTypePrivacyErrorReporter(declAST, isStatic, parameters, argIndex, paramSymbol, symbol, context);
        private functionReturnTypePrivacyErrorReporter(declAST, isStatic, returnTypeAnnotation, block, funcReturnType, symbol, context);
        private enclosingClassIsDerived(classDecl);
        private isSuperInvocationExpression(ast);
        private isSuperInvocationExpressionStatement(node);
        private getFirstStatementOfBlockOrNull(block);
        private superCallMustBeFirstStatementInConstructor(constructorDecl);
        private checkForThisCaptureInArrowFunction(expression);
        private typeCheckMembersAgainstIndexer(containerType, containerTypeDecl, context);
        private determineRelevantIndexerForMember(member, numberIndexSignature, stringIndexSignature);
        private reportErrorThatMemberIsNotSubtypeOfIndexer(member, indexSignature, astForError, context, comparisonInfo);
        private typeCheckIfTypeMemberPropertyOkToOverride(typeSymbol, extendedType, typeMember, extendedTypeMember, enclosingDecl, comparisonInfo);
        private typeCheckIfTypeExtendsType(classOrInterface, name, typeSymbol, extendedType, enclosingDecl, context);
        private typeCheckIfClassImplementsType(classDecl, classSymbol, implementedType, enclosingDecl, context);
        private hasClassTypeSymbolConflictAsValue(valueDeclAST, typeSymbol, enclosingDecl, context);
        private typeCheckBase(classOrInterface, name, typeSymbol, baseDeclAST, isExtendedType, enclosingDecl, context);
        private typeCheckBases(classOrInterface, name, heritageClauses, typeSymbol, enclosingDecl, context);
        private checkTypeCompatibilityBetweenBases(name, typeSymbol, context);
        private checkNamedPropertyTypeIdentityBetweenBases(interfaceName, interfaceSymbol, baseTypeSymbol, inheritedMembersMap, context);
        private checkIndexSignatureIdentityBetweenBases(interfaceName, interfaceSymbol, baseTypeSymbol, allInheritedSignatures, derivedTypeHasOwnNumberSignature, derivedTypeHasOwnStringSignature, context);
        private checkInheritedMembersAgainstInheritedIndexSignatures(interfaceName, interfaceSymbol, inheritedIndexSignatures, inheritedMembers, context);
        private checkThatInheritedNumberSignatureIsSubtypeOfInheritedStringSignature(interfaceName, interfaceSymbol, inheritedIndexSignatures, context);
        private checkAssignability(ast, source, target, context);
        private isReference(ast, astSymbol);
        private checkForSuperMemberAccess(expression, name, resolvedName, context);
        private getEnclosingDeclForAST(ast);
        private getEnclosingSymbolForAST(ast);
        private checkForPrivateMemberAccess(name, expressionType, resolvedName, context);
        public instantiateType(type: TypeScript.PullTypeSymbol, typeParameterArgumentMap: TypeScript.PullTypeSymbol[], instantiateFunctionTypeParameters?: boolean): TypeScript.PullTypeSymbol;
        public instantiateSignature(signature: TypeScript.PullSignatureSymbol, typeParameterArgumentMap: TypeScript.PullTypeSymbol[], instantiateFunctionTypeParameters?: boolean): TypeScript.PullSignatureSymbol;
    }
    class TypeComparisonInfo {
        public onlyCaptureFirstError: boolean;
        public flags: TypeScript.TypeRelationshipFlags;
        public message: string;
        public stringConstantVal: TypeScript.AST;
        private indent;
        constructor(sourceComparisonInfo?: TypeComparisonInfo);
        private indentString();
        public addMessage(message: string): void;
    }
    function getPropertyAssignmentNameTextFromIdentifier(identifier: AST): {
        actualText: string;
        memberName: string;
    };
    function isTypesOnlyLocation(ast: AST): boolean;
}
declare module TypeScript {
    var declCacheHit: number;
    var declCacheMiss: number;
    var symbolCacheHit: number;
    var symbolCacheMiss: number;
    class SemanticInfoChain {
        private compiler;
        private logger;
        private documents;
        private fileNameToDocument;
        public anyTypeDecl: TypeScript.PullDecl;
        public booleanTypeDecl: TypeScript.PullDecl;
        public numberTypeDecl: TypeScript.PullDecl;
        public stringTypeDecl: TypeScript.PullDecl;
        public nullTypeDecl: TypeScript.PullDecl;
        public undefinedTypeDecl: TypeScript.PullDecl;
        public voidTypeDecl: TypeScript.PullDecl;
        public undefinedValueDecl: TypeScript.PullDecl;
        public anyTypeSymbol: TypeScript.PullPrimitiveTypeSymbol;
        public booleanTypeSymbol: TypeScript.PullPrimitiveTypeSymbol;
        public numberTypeSymbol: TypeScript.PullPrimitiveTypeSymbol;
        public stringTypeSymbol: TypeScript.PullPrimitiveTypeSymbol;
        public nullTypeSymbol: TypeScript.PullPrimitiveTypeSymbol;
        public undefinedTypeSymbol: TypeScript.PullPrimitiveTypeSymbol;
        public voidTypeSymbol: TypeScript.PullPrimitiveTypeSymbol;
        public undefinedValueSymbol: TypeScript.PullSymbol;
        public emptyTypeSymbol: TypeScript.PullTypeSymbol;
        private astSymbolMap;
        private astAliasSymbolMap;
        private astCallResolutionDataMap;
        private declSymbolMap;
        private declSignatureSymbolMap;
        private declCache;
        private symbolCache;
        private fileNameToDiagnostics;
        private _binder;
        private _resolver;
        private _topLevelDecls;
        private _fileNames;
        constructor(compiler: TypeScript.TypeScriptCompiler, logger: TypeScript.ILogger);
        public getDocument(fileName: string): TypeScript.Document;
        public lineMap(fileName: string): TypeScript.LineMap;
        public fileNames(): string[];
        private bindPrimitiveSymbol(decl, newSymbol);
        private addPrimitiveTypeSymbol(decl);
        private addPrimitiveValueSymbol(decl, type);
        private resetGlobalSymbols();
        public addDocument(document: TypeScript.Document): void;
        public removeDocument(fileName: string): void;
        private getDeclPathCacheID(declPath, declKind);
        public findTopLevelSymbol(name: string, kind: TypeScript.PullElementKind, doNotGoPastThisDecl: TypeScript.PullDecl): TypeScript.PullSymbol;
        private findTopLevelSymbolInDecl(topLevelDecl, name, kind, doNotGoPastThisDecl);
        public findExternalModule(id: string): TypeScript.PullContainerSymbol;
        public findAmbientExternalModuleInGlobalContext(id: string): TypeScript.PullContainerSymbol;
        public findDecls(declPath: string[], declKind: TypeScript.PullElementKind): TypeScript.PullDecl[];
        public findDeclsFromPath(declPath: TypeScript.PullDecl[], declKind: TypeScript.PullElementKind): TypeScript.PullDecl[];
        public findSymbol(declPath: string[], declType: TypeScript.PullElementKind): TypeScript.PullSymbol;
        public cacheGlobalSymbol(symbol: TypeScript.PullSymbol, kind: TypeScript.PullElementKind): void;
        public invalidate(oldSettings?: TypeScript.ImmutableCompilationSettings, newSettings?: TypeScript.ImmutableCompilationSettings): void;
        private settingsChangeAffectsSyntax(before, after);
        public setSymbolForAST(ast: TypeScript.AST, symbol: TypeScript.PullSymbol): void;
        public getSymbolForAST(ast: TypeScript.AST): TypeScript.PullSymbol;
        public setAliasSymbolForAST(ast: TypeScript.AST, symbol: TypeScript.PullTypeAliasSymbol): void;
        public getAliasSymbolForAST(ast: TypeScript.AST): TypeScript.PullTypeAliasSymbol;
        public getCallResolutionDataForAST(ast: TypeScript.AST): TypeScript.PullAdditionalCallResolutionData;
        public setCallResolutionDataForAST(ast: TypeScript.AST, callResolutionData: TypeScript.PullAdditionalCallResolutionData): void;
        public setSymbolForDecl(decl: TypeScript.PullDecl, symbol: TypeScript.PullSymbol): void;
        public getSymbolForDecl(decl: TypeScript.PullDecl): TypeScript.PullSymbol;
        public setSignatureSymbolForDecl(decl: TypeScript.PullDecl, signatureSymbol: TypeScript.PullSignatureSymbol): void;
        public getSignatureSymbolForDecl(decl: TypeScript.PullDecl): TypeScript.PullSignatureSymbol;
        public addDiagnostic(diagnostic: TypeScript.Diagnostic): void;
        public getDiagnostics(fileName: string): TypeScript.Diagnostic[];
        public getBinder(): TypeScript.PullSymbolBinder;
        public getResolver(): TypeScript.PullTypeResolver;
        public addSyntheticIndexSignature(containingDecl: TypeScript.PullDecl, containingSymbol: TypeScript.PullTypeSymbol, ast: TypeScript.AST, indexParamName: string, indexParamType: TypeScript.PullTypeSymbol, returnType: TypeScript.PullTypeSymbol): void;
        public getDeclForAST(ast: TypeScript.AST): TypeScript.PullDecl;
        public getEnclosingDecl(ast: TypeScript.AST): TypeScript.PullDecl;
        public setDeclForAST(ast: TypeScript.AST, decl: TypeScript.PullDecl): void;
        public getASTForDecl(decl: TypeScript.PullDecl): TypeScript.AST;
        public setASTForDecl(decl: TypeScript.PullDecl, ast: TypeScript.AST): void;
        public topLevelDecl(fileName: string): TypeScript.PullDecl;
        public topLevelDecls(): TypeScript.PullDecl[];
        public addDiagnosticFromAST(ast: TypeScript.AST, diagnosticKey: string, arguments?: any[]): void;
        public diagnosticFromAST(ast: TypeScript.AST, diagnosticKey: string, arguments?: any[]): TypeScript.Diagnostic;
    }
}
declare module TypeScript {
    function getModuleNames(name: AST, result?: Identifier[]): Identifier[];
    module DeclarationCreator {
        function create(document: TypeScript.Document, semanticInfoChain: TypeScript.SemanticInfoChain, compilationSettings: TypeScript.ImmutableCompilationSettings): TypeScript.PullDecl;
    }
}
declare module TypeScript {
    class PullSymbolBinder {
        private semanticInfoChain;
        private declsBeingBound;
        constructor(semanticInfoChain: TypeScript.SemanticInfoChain);
        private getParent(decl, returnInstanceType?);
        private findDeclsInContext(startingDecl, declKind, searchGlobally);
        private getExistingSymbol(decl, searchKind, parent);
        private checkThatExportsMatch(decl, prevSymbol, reportError?);
        private bindEnumDeclarationToPullSymbol(enumContainerDecl);
        private bindEnumIndexerDeclsToPullSymbols(enumContainerDecl, enumContainerSymbol);
        private bindModuleDeclarationToPullSymbol(moduleContainerDecl);
        private bindImportDeclaration(importDeclaration);
        private bindClassDeclarationToPullSymbol(classDecl);
        private bindInterfaceDeclarationToPullSymbol(interfaceDecl);
        private bindObjectTypeDeclarationToPullSymbol(objectDecl);
        private bindConstructorTypeDeclarationToPullSymbol(constructorTypeDeclaration);
        private bindVariableDeclarationToPullSymbol(variableDeclaration);
        private bindCatchVariableToPullSymbol(variableDeclaration);
        private bindEnumMemberDeclarationToPullSymbol(propertyDeclaration);
        private bindPropertyDeclarationToPullSymbol(propertyDeclaration);
        private bindParameterSymbols(functionDeclaration, parameterList, funcType, signatureSymbol);
        private bindFunctionDeclarationToPullSymbol(functionDeclaration);
        private bindFunctionExpressionToPullSymbol(functionExpressionDeclaration);
        private bindFunctionTypeDeclarationToPullSymbol(functionTypeDeclaration);
        private bindMethodDeclarationToPullSymbol(methodDeclaration);
        private bindStaticPrototypePropertyOfClass(classTypeSymbol, constructorTypeSymbol);
        private bindConstructorDeclarationToPullSymbol(constructorDeclaration);
        private bindConstructSignatureDeclarationToPullSymbol(constructSignatureDeclaration);
        private bindCallSignatureDeclarationToPullSymbol(callSignatureDeclaration);
        private bindIndexSignatureDeclarationToPullSymbol(indexSignatureDeclaration);
        private bindGetAccessorDeclarationToPullSymbol(getAccessorDeclaration);
        private bindSetAccessorDeclarationToPullSymbol(setAccessorDeclaration);
        public bindDeclToPullSymbol(decl: TypeScript.PullDecl): void;
    }
}
declare module TypeScript {
    module PullHelpers {
        interface SignatureInfoForFuncDecl {
            signature: TypeScript.PullSignatureSymbol;
            allSignatures: TypeScript.PullSignatureSymbol[];
        }
        function getSignatureForFuncDecl(functionDecl: TypeScript.PullDecl): {
            signature: TypeScript.PullSignatureSymbol;
            allSignatures: TypeScript.PullSignatureSymbol[];
        };
        function getAccessorSymbol(getterOrSetter: TypeScript.AST, semanticInfoChain: TypeScript.SemanticInfoChain): TypeScript.PullAccessorSymbol;
        function getGetterAndSetterFunction(funcDecl: TypeScript.AST, semanticInfoChain: TypeScript.SemanticInfoChain): {
            getter: TypeScript.GetAccessor;
            setter: TypeScript.SetAccessor;
        };
        function symbolIsEnum(source: TypeScript.PullSymbol): boolean;
        function symbolIsModule(symbol: TypeScript.PullSymbol): boolean;
        function isNameNumeric(name: string): boolean;
        function typeSymbolsAreIdentical(a: TypeScript.PullTypeSymbol, b: TypeScript.PullTypeSymbol): boolean;
        function getRootType(type: TypeScript.PullTypeSymbol): TypeScript.PullTypeSymbol;
        function isSymbolLocal(symbol: TypeScript.PullSymbol): boolean;
    }
}
declare module TypeScript {
    enum GenerativeTypeClassification {
        Unknown = 0,
        Open = 1,
        Closed = 2,
        InfinitelyExpanding = 3,
    }
    class PullTypeReferenceSymbol extends TypeScript.PullTypeSymbol {
        public referencedTypeSymbol: TypeScript.PullTypeSymbol;
        static createTypeReference(type: TypeScript.PullTypeSymbol): PullTypeReferenceSymbol;
        constructor(referencedTypeSymbol: TypeScript.PullTypeSymbol);
        public isTypeReference(): boolean;
        public isResolved: boolean;
        public setResolved(): void;
        public setUnresolved(): void;
        public invalidate(): void;
        public ensureReferencedTypeIsResolved(): void;
        public getReferencedTypeSymbol(): TypeScript.PullTypeSymbol;
        public _getResolver(): TypeScript.PullTypeResolver;
        public hasMembers(): boolean;
        public setAssociatedContainerType(type: TypeScript.PullTypeSymbol): void;
        public getAssociatedContainerType(): TypeScript.PullTypeSymbol;
        public getFunctionSymbol(): TypeScript.PullSymbol;
        public setFunctionSymbol(symbol: TypeScript.PullSymbol): void;
        public addContainedNonMember(nonMember: TypeScript.PullSymbol): void;
        public findContainedNonMemberContainer(containerName: string, kind?: TypeScript.PullElementKind): TypeScript.PullTypeSymbol;
        public addMember(memberSymbol: TypeScript.PullSymbol): void;
        public addEnclosedMemberType(enclosedType: TypeScript.PullTypeSymbol): void;
        public addEnclosedMemberContainer(enclosedContainer: TypeScript.PullTypeSymbol): void;
        public addEnclosedNonMember(enclosedNonMember: TypeScript.PullSymbol): void;
        public addEnclosedNonMemberType(enclosedNonMemberType: TypeScript.PullTypeSymbol): void;
        public addEnclosedNonMemberContainer(enclosedNonMemberContainer: TypeScript.PullTypeSymbol): void;
        public addTypeParameter(typeParameter: TypeScript.PullTypeParameterSymbol): void;
        public addConstructorTypeParameter(typeParameter: TypeScript.PullTypeParameterSymbol): void;
        public findContainedNonMember(name: string): TypeScript.PullSymbol;
        public findContainedNonMemberType(typeName: string, kind?: TypeScript.PullElementKind): TypeScript.PullTypeSymbol;
        public getMembers(): TypeScript.PullSymbol[];
        public setHasDefaultConstructor(hasOne?: boolean): void;
        public getHasDefaultConstructor(): boolean;
        public getConstructorMethod(): TypeScript.PullSymbol;
        public setConstructorMethod(constructorMethod: TypeScript.PullSymbol): void;
        public getTypeParameters(): TypeScript.PullTypeParameterSymbol[];
        public isGeneric(): boolean;
        public addSpecialization(specializedVersionOfThisType: TypeScript.PullTypeSymbol, substitutingTypes: TypeScript.PullTypeSymbol[]): void;
        public getSpecialization(substitutingTypes: TypeScript.PullTypeSymbol[]): TypeScript.PullTypeSymbol;
        public getKnownSpecializations(): TypeScript.PullTypeSymbol[];
        public getTypeArguments(): TypeScript.PullTypeSymbol[];
        public getTypeArgumentsOrTypeParameters(): TypeScript.PullTypeSymbol[];
        public addCallSignature(callSignature: TypeScript.PullSignatureSymbol): void;
        public addConstructSignature(constructSignature: TypeScript.PullSignatureSymbol): void;
        public addIndexSignature(indexSignature: TypeScript.PullSignatureSymbol): void;
        public hasOwnCallSignatures(): boolean;
        public getCallSignatures(): TypeScript.PullSignatureSymbol[];
        public hasOwnConstructSignatures(): boolean;
        public getConstructSignatures(): TypeScript.PullSignatureSymbol[];
        public hasOwnIndexSignatures(): boolean;
        public getIndexSignatures(): TypeScript.PullSignatureSymbol[];
        public addImplementedType(implementedType: TypeScript.PullTypeSymbol): void;
        public getImplementedTypes(): TypeScript.PullTypeSymbol[];
        public addExtendedType(extendedType: TypeScript.PullTypeSymbol): void;
        public getExtendedTypes(): TypeScript.PullTypeSymbol[];
        public addTypeThatExtendsThisType(type: TypeScript.PullTypeSymbol): void;
        public getTypesThatExtendThisType(): TypeScript.PullTypeSymbol[];
        public addTypeThatExplicitlyImplementsThisType(type: TypeScript.PullTypeSymbol): void;
        public getTypesThatExplicitlyImplementThisType(): TypeScript.PullTypeSymbol[];
        public hasBase(potentialBase: TypeScript.PullTypeSymbol, visited?: TypeScript.PullSymbol[]): boolean;
        public isValidBaseKind(baseType: TypeScript.PullTypeSymbol, isExtendedType: boolean): boolean;
        public findMember(name: string, lookInParent?: boolean): TypeScript.PullSymbol;
        public findNestedType(name: string, kind?: TypeScript.PullElementKind): TypeScript.PullTypeSymbol;
        public findNestedContainer(name: string, kind?: TypeScript.PullElementKind): TypeScript.PullTypeSymbol;
        public getAllMembers(searchDeclKind: TypeScript.PullElementKind, memberVisiblity: TypeScript.GetAllMembersVisiblity): TypeScript.PullSymbol[];
        public findTypeParameter(name: string): TypeScript.PullTypeParameterSymbol;
        public hasOnlyOverloadCallSignatures(): boolean;
    }
    var nSpecializationsCreated: number;
    var nSpecializedSignaturesCreated: number;
    class PullInstantiatedTypeReferenceSymbol extends PullTypeReferenceSymbol {
        public referencedTypeSymbol: TypeScript.PullTypeSymbol;
        private _typeParameterArgumentMap;
        private _instantiatedMembers;
        private _allInstantiatedMemberNameCache;
        private _instantiatedMemberNameCache;
        private _instantiatedCallSignatures;
        private _instantiatedConstructSignatures;
        private _instantiatedIndexSignatures;
        private _typeArgumentReferences;
        private _instantiatedConstructorMethod;
        private _instantiatedAssociatedContainerType;
        private _isArray;
        public isInstanceReferenceType: boolean;
        public getIsSpecialized(): boolean;
        private _generativeTypeClassification;
        public getGenerativeTypeClassification(enclosingType: TypeScript.PullTypeSymbol): GenerativeTypeClassification;
        public isArrayNamedTypeReference(): boolean;
        public getElementType(): TypeScript.PullTypeSymbol;
        public getReferencedTypeSymbol(): TypeScript.PullTypeSymbol;
        static create(resolver: TypeScript.PullTypeResolver, type: TypeScript.PullTypeSymbol, typeParameterArgumentMap: TypeScript.PullTypeSymbol[], instantiateFunctionTypeParameters?: boolean): PullInstantiatedTypeReferenceSymbol;
        constructor(referencedTypeSymbol: TypeScript.PullTypeSymbol, _typeParameterArgumentMap: TypeScript.PullTypeSymbol[]);
        public isGeneric(): boolean;
        public getTypeParameterArgumentMap(): TypeScript.PullTypeSymbol[];
        public getTypeArguments(): TypeScript.PullTypeSymbol[];
        public getTypeArgumentsOrTypeParameters(): TypeScript.PullTypeSymbol[];
        public getMembers(): TypeScript.PullSymbol[];
        public findMember(name: string, lookInParent?: boolean): TypeScript.PullSymbol;
        public getAllMembers(searchDeclKind: TypeScript.PullElementKind, memberVisiblity: TypeScript.GetAllMembersVisiblity): TypeScript.PullSymbol[];
        public getConstructorMethod(): TypeScript.PullSymbol;
        public getAssociatedContainerType(): TypeScript.PullTypeSymbol;
        public getCallSignatures(): TypeScript.PullSignatureSymbol[];
        public getConstructSignatures(): TypeScript.PullSignatureSymbol[];
        public getIndexSignatures(): TypeScript.PullSignatureSymbol[];
        public hasBase(potentialBase: TypeScript.PullTypeSymbol, visited?: TypeScript.PullSymbol[]): boolean;
    }
}
declare module TypeScript {
    class SyntaxTreeToAstVisitor implements TypeScript.ISyntaxVisitor {
        private fileName;
        public lineMap: TypeScript.LineMap;
        private compilationSettings;
        public position: number;
        public previousTokenTrailingComments: TypeScript.Comment[];
        constructor(fileName: string, lineMap: TypeScript.LineMap, compilationSettings: TypeScript.ImmutableCompilationSettings);
        static visit(syntaxTree: TypeScript.SyntaxTree, fileName: string, compilationSettings: TypeScript.ImmutableCompilationSettings, incrementalAST: boolean): TypeScript.SourceUnit;
        public movePast(element: TypeScript.ISyntaxElement): void;
        private moveTo(element1, element2);
        private setCommentsAndSpan(ast, fullStart, node);
        public createTokenSpan(fullStart: number, element: TypeScript.ISyntaxToken): TypeScript.ASTSpan;
        public setSpan(span: TypeScript.AST, fullStart: number, element: TypeScript.ISyntaxElement, firstToken?: TypeScript.ISyntaxToken, lastToken?: TypeScript.ISyntaxToken): void;
        public setSpanExplicit(span: TypeScript.IASTSpan, start: number, end: number): void;
        public visitSyntaxList(node: TypeScript.ISyntaxList): TypeScript.ISyntaxList2;
        public visitSeparatedSyntaxList(list: TypeScript.ISeparatedSyntaxList): TypeScript.ISeparatedSyntaxList2;
        private convertComment(trivia, commentStartPosition, hasTrailingNewLine);
        private convertComments(triviaList, commentStartPosition);
        private mergeComments(comments1, comments2);
        private convertTokenLeadingComments(token, commentStartPosition);
        private convertTokenTrailingComments(token, commentStartPosition);
        private convertNodeTrailingComments(node, lastToken, nodeStart);
        private visitIdentifier(token);
        public visitToken(token: TypeScript.ISyntaxToken): TypeScript.IASTToken;
        public visitTokenWorker(token: TypeScript.ISyntaxToken): TypeScript.IASTToken;
        public visitSourceUnit(node: TypeScript.SourceUnitSyntax): TypeScript.SourceUnit;
        public visitExternalModuleReference(node: TypeScript.ExternalModuleReferenceSyntax): TypeScript.ExternalModuleReference;
        public visitModuleNameModuleReference(node: TypeScript.ModuleNameModuleReferenceSyntax): TypeScript.ModuleNameModuleReference;
        public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): TypeScript.ClassDeclaration;
        private visitModifiers(modifiers);
        public visitInterfaceDeclaration(node: TypeScript.InterfaceDeclarationSyntax): TypeScript.InterfaceDeclaration;
        public visitHeritageClause(node: TypeScript.HeritageClauseSyntax): TypeScript.HeritageClause;
        public visitModuleDeclaration(node: TypeScript.ModuleDeclarationSyntax): TypeScript.ModuleDeclaration;
        public visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): TypeScript.FunctionDeclaration;
        public visitEnumDeclaration(node: TypeScript.EnumDeclarationSyntax): TypeScript.EnumDeclaration;
        public visitEnumElement(node: TypeScript.EnumElementSyntax): TypeScript.EnumElement;
        public visitImportDeclaration(node: TypeScript.ImportDeclarationSyntax): TypeScript.ImportDeclaration;
        public visitExportAssignment(node: TypeScript.ExportAssignmentSyntax): TypeScript.ExportAssignment;
        public visitVariableStatement(node: TypeScript.VariableStatementSyntax): TypeScript.VariableStatement;
        public visitVariableDeclaration(node: TypeScript.VariableDeclarationSyntax): TypeScript.VariableDeclaration;
        public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): TypeScript.VariableDeclarator;
        public visitEqualsValueClause(node: TypeScript.EqualsValueClauseSyntax): TypeScript.EqualsValueClause;
        public visitPrefixUnaryExpression(node: TypeScript.PrefixUnaryExpressionSyntax): TypeScript.PrefixUnaryExpression;
        public visitArrayLiteralExpression(node: TypeScript.ArrayLiteralExpressionSyntax): TypeScript.ArrayLiteralExpression;
        public visitOmittedExpression(node: TypeScript.OmittedExpressionSyntax): TypeScript.OmittedExpression;
        public visitParenthesizedExpression(node: TypeScript.ParenthesizedExpressionSyntax): TypeScript.ParenthesizedExpression;
        public visitSimpleArrowFunctionExpression(node: TypeScript.SimpleArrowFunctionExpressionSyntax): TypeScript.SimpleArrowFunctionExpression;
        public visitParenthesizedArrowFunctionExpression(node: TypeScript.ParenthesizedArrowFunctionExpressionSyntax): TypeScript.ParenthesizedArrowFunctionExpression;
        public visitType(type: TypeScript.ITypeSyntax): TypeScript.AST;
        public visitTypeQuery(node: TypeScript.TypeQuerySyntax): TypeScript.TypeQuery;
        public visitQualifiedName(node: TypeScript.QualifiedNameSyntax): TypeScript.QualifiedName;
        public visitTypeArgumentList(node: TypeScript.TypeArgumentListSyntax): TypeScript.TypeArgumentList;
        public visitConstructorType(node: TypeScript.ConstructorTypeSyntax): TypeScript.ConstructorType;
        public visitFunctionType(node: TypeScript.FunctionTypeSyntax): TypeScript.FunctionType;
        public visitObjectType(node: TypeScript.ObjectTypeSyntax): TypeScript.ObjectType;
        public visitArrayType(node: TypeScript.ArrayTypeSyntax): TypeScript.ArrayType;
        public visitGenericType(node: TypeScript.GenericTypeSyntax): TypeScript.GenericType;
        public visitTypeAnnotation(node: TypeScript.TypeAnnotationSyntax): TypeScript.TypeAnnotation;
        public visitBlock(node: TypeScript.BlockSyntax): TypeScript.Block;
        public visitParameter(node: TypeScript.ParameterSyntax): TypeScript.Parameter;
        public visitMemberAccessExpression(node: TypeScript.MemberAccessExpressionSyntax): TypeScript.MemberAccessExpression;
        public visitPostfixUnaryExpression(node: TypeScript.PostfixUnaryExpressionSyntax): TypeScript.PostfixUnaryExpression;
        public visitElementAccessExpression(node: TypeScript.ElementAccessExpressionSyntax): TypeScript.ElementAccessExpression;
        public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax): TypeScript.InvocationExpression;
        public visitArgumentList(node: TypeScript.ArgumentListSyntax): TypeScript.ArgumentList;
        public visitBinaryExpression(node: TypeScript.BinaryExpressionSyntax): TypeScript.BinaryExpression;
        public visitConditionalExpression(node: TypeScript.ConditionalExpressionSyntax): TypeScript.ConditionalExpression;
        public visitConstructSignature(node: TypeScript.ConstructSignatureSyntax): TypeScript.ConstructSignature;
        public visitMethodSignature(node: TypeScript.MethodSignatureSyntax): TypeScript.MethodSignature;
        public visitIndexSignature(node: TypeScript.IndexSignatureSyntax): TypeScript.IndexSignature;
        public visitPropertySignature(node: TypeScript.PropertySignatureSyntax): TypeScript.PropertySignature;
        public visitParameterList(node: TypeScript.ParameterListSyntax): TypeScript.ParameterList;
        public visitCallSignature(node: TypeScript.CallSignatureSyntax): TypeScript.CallSignature;
        public visitTypeParameterList(node: TypeScript.TypeParameterListSyntax): TypeScript.TypeParameterList;
        public visitTypeParameter(node: TypeScript.TypeParameterSyntax): TypeScript.TypeParameter;
        public visitConstraint(node: TypeScript.ConstraintSyntax): TypeScript.Constraint;
        public visitIfStatement(node: TypeScript.IfStatementSyntax): TypeScript.IfStatement;
        public visitElseClause(node: TypeScript.ElseClauseSyntax): TypeScript.ElseClause;
        public visitExpressionStatement(node: TypeScript.ExpressionStatementSyntax): TypeScript.ExpressionStatement;
        public visitConstructorDeclaration(node: TypeScript.ConstructorDeclarationSyntax): TypeScript.ConstructorDeclaration;
        public visitIndexMemberDeclaration(node: TypeScript.IndexMemberDeclarationSyntax): TypeScript.IndexMemberDeclaration;
        public visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): TypeScript.MemberFunctionDeclaration;
        public visitGetAccessor(node: TypeScript.GetAccessorSyntax): TypeScript.GetAccessor;
        public visitSetAccessor(node: TypeScript.SetAccessorSyntax): TypeScript.SetAccessor;
        public visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): TypeScript.MemberVariableDeclaration;
        public visitThrowStatement(node: TypeScript.ThrowStatementSyntax): TypeScript.ThrowStatement;
        public visitReturnStatement(node: TypeScript.ReturnStatementSyntax): TypeScript.ReturnStatement;
        public visitObjectCreationExpression(node: TypeScript.ObjectCreationExpressionSyntax): TypeScript.ObjectCreationExpression;
        public visitSwitchStatement(node: TypeScript.SwitchStatementSyntax): TypeScript.SwitchStatement;
        public visitCaseSwitchClause(node: TypeScript.CaseSwitchClauseSyntax): TypeScript.CaseSwitchClause;
        public visitDefaultSwitchClause(node: TypeScript.DefaultSwitchClauseSyntax): TypeScript.DefaultSwitchClause;
        public visitBreakStatement(node: TypeScript.BreakStatementSyntax): TypeScript.BreakStatement;
        public visitContinueStatement(node: TypeScript.ContinueStatementSyntax): TypeScript.ContinueStatement;
        public visitForStatement(node: TypeScript.ForStatementSyntax): TypeScript.ForStatement;
        public visitForInStatement(node: TypeScript.ForInStatementSyntax): TypeScript.ForInStatement;
        public visitWhileStatement(node: TypeScript.WhileStatementSyntax): TypeScript.WhileStatement;
        public visitWithStatement(node: TypeScript.WithStatementSyntax): TypeScript.WithStatement;
        public visitCastExpression(node: TypeScript.CastExpressionSyntax): TypeScript.CastExpression;
        public visitObjectLiteralExpression(node: TypeScript.ObjectLiteralExpressionSyntax): TypeScript.ObjectLiteralExpression;
        public visitSimplePropertyAssignment(node: TypeScript.SimplePropertyAssignmentSyntax): TypeScript.SimplePropertyAssignment;
        public visitFunctionPropertyAssignment(node: TypeScript.FunctionPropertyAssignmentSyntax): TypeScript.FunctionPropertyAssignment;
        public visitFunctionExpression(node: TypeScript.FunctionExpressionSyntax): TypeScript.FunctionExpression;
        public visitEmptyStatement(node: TypeScript.EmptyStatementSyntax): TypeScript.EmptyStatement;
        public visitTryStatement(node: TypeScript.TryStatementSyntax): TypeScript.TryStatement;
        public visitCatchClause(node: TypeScript.CatchClauseSyntax): TypeScript.CatchClause;
        public visitFinallyClause(node: TypeScript.FinallyClauseSyntax): TypeScript.FinallyClause;
        public visitLabeledStatement(node: TypeScript.LabeledStatementSyntax): TypeScript.LabeledStatement;
        public visitDoStatement(node: TypeScript.DoStatementSyntax): TypeScript.DoStatement;
        public visitTypeOfExpression(node: TypeScript.TypeOfExpressionSyntax): TypeScript.TypeOfExpression;
        public visitDeleteExpression(node: TypeScript.DeleteExpressionSyntax): TypeScript.DeleteExpression;
        public visitVoidExpression(node: TypeScript.VoidExpressionSyntax): TypeScript.VoidExpression;
        public visitDebuggerStatement(node: TypeScript.DebuggerStatementSyntax): TypeScript.DebuggerStatement;
    }
}
declare module TypeScript {
    var fileResolutionTime: number;
    var fileResolutionIOTime: number;
    var fileResolutionScanImportsTime: number;
    var fileResolutionImportFileSearchTime: number;
    var fileResolutionGetDefaultLibraryTime: number;
    var sourceCharactersCompiled: number;
    var syntaxTreeParseTime: number;
    var syntaxDiagnosticsTime: number;
    var astTranslationTime: number;
    var typeCheckTime: number;
    var compilerResolvePathTime: number;
    var compilerDirectoryNameTime: number;
    var compilerDirectoryExistsTime: number;
    var compilerFileExistsTime: number;
    var emitTime: number;
    var emitWriteFileTime: number;
    var declarationEmitTime: number;
    var declarationEmitIsExternallyVisibleTime: number;
    var declarationEmitTypeSignatureTime: number;
    var declarationEmitGetBoundDeclTypeTime: number;
    var declarationEmitIsOverloadedCallSignatureTime: number;
    var declarationEmitFunctionDeclarationGetSymbolTime: number;
    var declarationEmitGetBaseTypeTime: number;
    var declarationEmitGetAccessorFunctionTime: number;
    var declarationEmitGetTypeParameterSymbolTime: number;
    var declarationEmitGetImportDeclarationSymbolTime: number;
    var ioHostResolvePathTime: number;
    var ioHostDirectoryNameTime: number;
    var ioHostCreateDirectoryStructureTime: number;
    var ioHostWriteFileTime: number;
    interface PullSymbolInfo {
        symbol: TypeScript.PullSymbol;
        aliasSymbol: TypeScript.PullTypeAliasSymbol;
        ast: TypeScript.AST;
        enclosingScopeSymbol: TypeScript.PullSymbol;
    }
    interface PullCallSymbolInfo {
        targetSymbol: TypeScript.PullSymbol;
        resolvedSignatures: TypeScript.PullSignatureSymbol[];
        candidateSignature: TypeScript.PullSignatureSymbol;
        isConstructorCall: boolean;
        ast: TypeScript.AST;
        enclosingScopeSymbol: TypeScript.PullSymbol;
    }
    interface PullVisibleSymbolsInfo {
        symbols: TypeScript.PullSymbol[];
        enclosingScopeSymbol: TypeScript.PullSymbol;
    }
    class EmitOutput {
        public outputFiles: OutputFile[];
        public diagnostics: TypeScript.Diagnostic[];
    }
    enum OutputFileType {
        JavaScript = 0,
        SourceMap = 1,
        Declaration = 2,
    }
    class OutputFile {
        public name: string;
        public writeByteOrderMark: boolean;
        public text: string;
        public fileType: OutputFileType;
        public sourceMapEntries: TypeScript.SourceMapEntry[];
        constructor(name: string, writeByteOrderMark: boolean, text: string, fileType: OutputFileType, sourceMapEntries?: TypeScript.SourceMapEntry[]);
    }
    class CompileResult {
        public diagnostics: TypeScript.Diagnostic[];
        public outputFiles: OutputFile[];
        static fromDiagnostics(diagnostics: TypeScript.Diagnostic[]): CompileResult;
        static fromOutputFiles(outputFiles: OutputFile[]): CompileResult;
    }
    class TypeScriptCompiler {
        public logger: TypeScript.ILogger;
        private _settings;
        private semanticInfoChain;
        constructor(logger?: TypeScript.ILogger, _settings?: TypeScript.ImmutableCompilationSettings);
        public compilationSettings(): TypeScript.ImmutableCompilationSettings;
        public setCompilationSettings(newSettings: TypeScript.ImmutableCompilationSettings): void;
        public getDocument(fileName: string): TypeScript.Document;
        public cleanupSemanticCache(): void;
        public addFile(fileName: string, scriptSnapshot: TypeScript.IScriptSnapshot, byteOrderMark: TypeScript.ByteOrderMark, version: number, isOpen: boolean, referencedFiles?: string[]): void;
        public updateFile(fileName: string, scriptSnapshot: TypeScript.IScriptSnapshot, version: number, isOpen: boolean, textChangeRange: TypeScript.TextChangeRange): void;
        public removeFile(fileName: string): void;
        public _isDynamicModuleCompilation(): boolean;
        public mapOutputFileName(document: TypeScript.Document, emitOptions: TypeScript.EmitOptions, extensionChanger: (fname: string, wholeFileNameReplaced: boolean) => string): string;
        private writeByteOrderMarkForDocument(document);
        static mapToDTSFileName(fileName: string, wholeFileNameReplaced: boolean): string;
        public _shouldEmit(document: TypeScript.Document): boolean;
        public _shouldEmitDeclarations(document: TypeScript.Document): boolean;
        private emitDocumentDeclarationsWorker(document, emitOptions, declarationEmitter?);
        public _emitDocumentDeclarations(document: TypeScript.Document, emitOptions: TypeScript.EmitOptions, onSingleFileEmitComplete: (files: OutputFile) => void, sharedEmitter: TypeScript.DeclarationEmitter): TypeScript.DeclarationEmitter;
        public emitAllDeclarations(resolvePath: (path: string) => string): EmitOutput;
        public emitDeclarations(fileName: string, resolvePath: (path: string) => string): EmitOutput;
        static mapToFileNameExtension(extension: string, fileName: string, wholeFileNameReplaced: boolean): string;
        static mapToJSFileName(fileName: string, wholeFileNameReplaced: boolean): string;
        private emitDocumentWorker(document, emitOptions, emitter?);
        public _emitDocument(document: TypeScript.Document, emitOptions: TypeScript.EmitOptions, onSingleFileEmitComplete: (files: OutputFile[]) => void, sharedEmitter: TypeScript.Emitter): TypeScript.Emitter;
        public emitAll(resolvePath: (path: string) => string): EmitOutput;
        public emit(fileName: string, resolvePath: (path: string) => string): EmitOutput;
        public compile(resolvePath: (path: string) => string, continueOnDiagnostics?: boolean): TypeScript.Iterator<CompileResult>;
        public getSyntacticDiagnostics(fileName: string): TypeScript.Diagnostic[];
        private getSyntaxTree(fileName);
        private getSourceUnit(fileName);
        public getSemanticDiagnostics(fileName: string): TypeScript.Diagnostic[];
        public resolveAllFiles(): void;
        public getSymbolOfDeclaration(decl: TypeScript.PullDecl): TypeScript.PullSymbol;
        private extractResolutionContextFromAST(resolver, ast, document, propagateContextualTypes);
        private extractResolutionContextForVariable(inContextuallyTypedAssignment, propagateContextualTypes, resolver, resolutionContext, enclosingDecl, assigningAST, init);
        private getASTPath(ast);
        public pullGetSymbolInformationFromAST(ast: TypeScript.AST, document: TypeScript.Document): PullSymbolInfo;
        public pullGetCallInformationFromAST(ast: TypeScript.AST, document: TypeScript.Document): PullCallSymbolInfo;
        public pullGetVisibleMemberSymbolsFromAST(ast: TypeScript.AST, document: TypeScript.Document): PullVisibleSymbolsInfo;
        public pullGetVisibleDeclsFromAST(ast: TypeScript.AST, document: TypeScript.Document): TypeScript.PullDecl[];
        public pullGetContextualMembersFromAST(ast: TypeScript.AST, document: TypeScript.Document): PullVisibleSymbolsInfo;
        public pullGetDeclInformation(decl: TypeScript.PullDecl, ast: TypeScript.AST, document: TypeScript.Document): PullSymbolInfo;
        public topLevelDeclaration(fileName: string): TypeScript.PullDecl;
        public getDeclForAST(ast: TypeScript.AST): TypeScript.PullDecl;
        public fileNames(): string[];
        public topLevelDecl(fileName: string): TypeScript.PullDecl;
    }
    function compareDataObjects(dst: any, src: any): boolean;
}
declare module TypeScript.Services {
    enum EndOfLineState {
        Start = 0,
        InMultiLineCommentTrivia = 1,
        InSingleQuoteStringLiteral = 2,
        InDoubleQuoteStringLiteral = 3,
    }
    enum TokenClass {
        Punctuation = 0,
        Keyword = 1,
        Operator = 2,
        Comment = 3,
        Whitespace = 4,
        Identifier = 5,
        NumberLiteral = 6,
        StringLiteral = 7,
        RegExpLiteral = 8,
    }
    class Classifier {
        public host: IClassifierHost;
        private scanner;
        private characterWindow;
        private diagnostics;
        constructor(host: IClassifierHost);
        public getClassificationsForLine(text: string, lexState: EndOfLineState): ClassificationResult;
        private processToken(text, offset, token, result);
        private processTriviaList(text, offset, triviaList, result);
        private addResult(text, offset, result, length, kind);
        private classFromKind(kind);
    }
    interface IClassifierHost extends TypeScript.ILogger {
    }
    class ClassificationResult {
        public finalLexState: EndOfLineState;
        public entries: ClassificationInfo[];
        constructor();
    }
    class ClassificationInfo {
        public length: number;
        public classification: TokenClass;
        constructor(length: number, classification: TokenClass);
    }
}
declare module TypeScript.Services.Formatting {
    interface ITextSnapshot {
        getText(span: TypeScript.TextSpan): string;
        getLineNumberFromPosition(position: number): number;
        getLineFromPosition(position: number): Formatting.ITextSnapshotLine;
        getLineFromLineNumber(lineNumber: number): Formatting.ITextSnapshotLine;
    }
    class TextSnapshot implements ITextSnapshot {
        private snapshot;
        private lines;
        constructor(snapshot: TypeScript.ISimpleText);
        public getText(span: TypeScript.TextSpan): string;
        public getLineNumberFromPosition(position: number): number;
        public getLineFromPosition(position: number): Formatting.ITextSnapshotLine;
        public getLineFromLineNumber(lineNumber: number): Formatting.ITextSnapshotLine;
        private getLineFromLineNumberWorker(lineNumber);
    }
}
declare module TypeScript.Services.Formatting {
    interface ITextSnapshotLine {
        snapshot(): Formatting.ITextSnapshot;
        start(): Formatting.SnapshotPoint;
        startPosition(): number;
        end(): Formatting.SnapshotPoint;
        endPosition(): number;
        endIncludingLineBreak(): Formatting.SnapshotPoint;
        endIncludingLineBreakPosition(): number;
        length(): number;
        lineNumber(): number;
        getText(): string;
    }
    class TextSnapshotLine implements ITextSnapshotLine {
        private _snapshot;
        private _lineNumber;
        private _start;
        private _end;
        private _lineBreak;
        constructor(_snapshot: Formatting.ITextSnapshot, _lineNumber: number, _start: number, _end: number, _lineBreak: string);
        public snapshot(): Formatting.ITextSnapshot;
        public start(): Formatting.SnapshotPoint;
        public startPosition(): number;
        public end(): Formatting.SnapshotPoint;
        public endPosition(): number;
        public endIncludingLineBreak(): Formatting.SnapshotPoint;
        public endIncludingLineBreakPosition(): number;
        public length(): number;
        public lineNumber(): number;
        public getText(): string;
    }
}
declare module TypeScript.Services.Formatting {
    class SnapshotPoint {
        public snapshot: Formatting.ITextSnapshot;
        public position: number;
        constructor(snapshot: Formatting.ITextSnapshot, position: number);
        public getContainingLine(): Formatting.ITextSnapshotLine;
        public add(offset: number): SnapshotPoint;
    }
}
declare module TypeScript.Services.Formatting {
    class FormattingContext {
        private snapshot;
        public formattingRequestKind: Formatting.FormattingRequestKind;
        public currentTokenSpan: Formatting.TokenSpan;
        public nextTokenSpan: Formatting.TokenSpan;
        public contextNode: Formatting.IndentationNodeContext;
        public currentTokenParent: Formatting.IndentationNodeContext;
        public nextTokenParent: Formatting.IndentationNodeContext;
        private contextNodeAllOnSameLine;
        private nextNodeAllOnSameLine;
        private tokensAreOnSameLine;
        private contextNodeBlockIsOnOneLine;
        private nextNodeBlockIsOnOneLine;
        constructor(snapshot: Formatting.ITextSnapshot, formattingRequestKind: Formatting.FormattingRequestKind);
        public updateContext(currentTokenSpan: Formatting.TokenSpan, currentTokenParent: Formatting.IndentationNodeContext, nextTokenSpan: Formatting.TokenSpan, nextTokenParent: Formatting.IndentationNodeContext, commonParent: Formatting.IndentationNodeContext): void;
        public ContextNodeAllOnSameLine(): boolean;
        public NextNodeAllOnSameLine(): boolean;
        public TokensAreOnSameLine(): boolean;
        public ContextNodeBlockIsOnOneLine(): boolean;
        public NextNodeBlockIsOnOneLine(): boolean;
        public NodeIsOnOneLine(node: Formatting.IndentationNodeContext): boolean;
        public BlockIsOnOneLine(node: Formatting.IndentationNodeContext): boolean;
    }
}
declare module TypeScript.Services.Formatting {
    class FormattingManager {
        private syntaxTree;
        private snapshot;
        private rulesProvider;
        private options;
        constructor(syntaxTree: TypeScript.SyntaxTree, snapshot: Formatting.ITextSnapshot, rulesProvider: Formatting.RulesProvider, editorOptions: Services.EditorOptions);
        public formatSelection(minChar: number, limChar: number): Services.TextEdit[];
        public formatDocument(minChar: number, limChar: number): Services.TextEdit[];
        public formatOnPaste(minChar: number, limChar: number): Services.TextEdit[];
        public formatOnSemicolon(caretPosition: number): Services.TextEdit[];
        public formatOnClosingCurlyBrace(caretPosition: number): Services.TextEdit[];
        public formatOnEnter(caretPosition: number): Services.TextEdit[];
        private formatSpan(span, formattingRequestKind);
    }
}
declare module TypeScript.Services.Formatting {
    enum FormattingRequestKind {
        FormatDocument = 0,
        FormatSelection = 1,
        FormatOnEnter = 2,
        FormatOnSemicolon = 3,
        FormatOnClosingCurlyBrace = 4,
        FormatOnPaste = 5,
    }
}
declare module TypeScript.Services.Formatting {
    class Rule {
        public Descriptor: Formatting.RuleDescriptor;
        public Operation: Formatting.RuleOperation;
        public Flag: Formatting.RuleFlags;
        constructor(Descriptor: Formatting.RuleDescriptor, Operation: Formatting.RuleOperation, Flag?: Formatting.RuleFlags);
        public toString(): string;
    }
}
declare module TypeScript.Services.Formatting {
    enum RuleAction {
        Ignore = 0,
        Space = 1,
        NewLine = 2,
        Delete = 3,
    }
}
declare module TypeScript.Services.Formatting {
    class RuleDescriptor {
        public LeftTokenRange: Formatting.Shared.TokenRange;
        public RightTokenRange: Formatting.Shared.TokenRange;
        constructor(LeftTokenRange: Formatting.Shared.TokenRange, RightTokenRange: Formatting.Shared.TokenRange);
        public toString(): string;
        static create1(left: TypeScript.SyntaxKind, right: TypeScript.SyntaxKind): RuleDescriptor;
        static create2(left: Formatting.Shared.TokenRange, right: TypeScript.SyntaxKind): RuleDescriptor;
        static create3(left: TypeScript.SyntaxKind, right: Formatting.Shared.TokenRange): RuleDescriptor;
        static create4(left: Formatting.Shared.TokenRange, right: Formatting.Shared.TokenRange): RuleDescriptor;
    }
}
declare module TypeScript.Services.Formatting {
    enum RuleFlags {
        None = 0,
        CanDeleteNewLines = 1,
    }
}
declare module TypeScript.Services.Formatting {
    class RuleOperation {
        public Context: Formatting.RuleOperationContext;
        public Action: Formatting.RuleAction;
        constructor();
        public toString(): string;
        static create1(action: Formatting.RuleAction): RuleOperation;
        static create2(context: Formatting.RuleOperationContext, action: Formatting.RuleAction): RuleOperation;
    }
}
declare module TypeScript.Services.Formatting {
    class RuleOperationContext {
        private customContextChecks;
        constructor(...funcs: {
            (context: Formatting.FormattingContext): boolean;
        }[]);
        static Any: RuleOperationContext;
        public IsAny(): boolean;
        public InContext(context: Formatting.FormattingContext): boolean;
    }
}
declare module TypeScript.Services.Formatting {
    class Rules {
        public getRuleName(rule: Formatting.Rule): any;
        public IgnoreBeforeComment: Formatting.Rule;
        public IgnoreAfterLineComment: Formatting.Rule;
        public NoSpaceBeforeSemicolon: Formatting.Rule;
        public NoSpaceBeforeColon: Formatting.Rule;
        public NoSpaceBeforeQMark: Formatting.Rule;
        public SpaceAfterColon: Formatting.Rule;
        public SpaceAfterQMark: Formatting.Rule;
        public SpaceAfterSemicolon: Formatting.Rule;
        public SpaceAfterCloseBrace: Formatting.Rule;
        public SpaceBetweenCloseBraceAndElse: Formatting.Rule;
        public SpaceBetweenCloseBraceAndWhile: Formatting.Rule;
        public NoSpaceAfterCloseBrace: Formatting.Rule;
        public NoSpaceBeforeDot: Formatting.Rule;
        public NoSpaceAfterDot: Formatting.Rule;
        public NoSpaceBeforeOpenBracket: Formatting.Rule;
        public NoSpaceAfterOpenBracket: Formatting.Rule;
        public NoSpaceBeforeCloseBracket: Formatting.Rule;
        public NoSpaceAfterCloseBracket: Formatting.Rule;
        public SpaceAfterOpenBrace: Formatting.Rule;
        public SpaceBeforeCloseBrace: Formatting.Rule;
        public NoSpaceBetweenEmptyBraceBrackets: Formatting.Rule;
        public NewLineAfterOpenBraceInBlockContext: Formatting.Rule;
        public NewLineBeforeCloseBraceInBlockContext: Formatting.Rule;
        public NoSpaceAfterUnaryPrefixOperator: Formatting.Rule;
        public NoSpaceAfterUnaryPreincrementOperator: Formatting.Rule;
        public NoSpaceAfterUnaryPredecrementOperator: Formatting.Rule;
        public NoSpaceBeforeUnaryPostincrementOperator: Formatting.Rule;
        public NoSpaceBeforeUnaryPostdecrementOperator: Formatting.Rule;
        public SpaceAfterPostincrementWhenFollowedByAdd: Formatting.Rule;
        public SpaceAfterAddWhenFollowedByUnaryPlus: Formatting.Rule;
        public SpaceAfterAddWhenFollowedByPreincrement: Formatting.Rule;
        public SpaceAfterPostdecrementWhenFollowedBySubtract: Formatting.Rule;
        public SpaceAfterSubtractWhenFollowedByUnaryMinus: Formatting.Rule;
        public SpaceAfterSubtractWhenFollowedByPredecrement: Formatting.Rule;
        public NoSpaceBeforeComma: Formatting.Rule;
        public SpaceAfterCertainKeywords: Formatting.Rule;
        public NoSpaceBeforeOpenParenInFuncCall: Formatting.Rule;
        public SpaceAfterFunctionInFuncDecl: Formatting.Rule;
        public NoSpaceBeforeOpenParenInFuncDecl: Formatting.Rule;
        public SpaceAfterVoidOperator: Formatting.Rule;
        public NoSpaceBetweenReturnAndSemicolon: Formatting.Rule;
        public SpaceBetweenStatements: Formatting.Rule;
        public SpaceAfterTryFinally: Formatting.Rule;
        public SpaceAfterGetSetInMember: Formatting.Rule;
        public SpaceBeforeBinaryKeywordOperator: Formatting.Rule;
        public SpaceAfterBinaryKeywordOperator: Formatting.Rule;
        public NoSpaceAfterConstructor: Formatting.Rule;
        public NoSpaceAfterModuleImport: Formatting.Rule;
        public SpaceAfterCertainTypeScriptKeywords: Formatting.Rule;
        public SpaceBeforeCertainTypeScriptKeywords: Formatting.Rule;
        public SpaceAfterModuleName: Formatting.Rule;
        public SpaceAfterArrow: Formatting.Rule;
        public NoSpaceAfterEllipsis: Formatting.Rule;
        public NoSpaceAfterOptionalParameters: Formatting.Rule;
        public NoSpaceBeforeOpenAngularBracket: Formatting.Rule;
        public NoSpaceBetweenCloseParenAndAngularBracket: Formatting.Rule;
        public NoSpaceAfterOpenAngularBracket: Formatting.Rule;
        public NoSpaceBeforeCloseAngularBracket: Formatting.Rule;
        public NoSpaceAfterCloseAngularBracket: Formatting.Rule;
        public NoSpaceBetweenEmptyInterfaceBraceBrackets: Formatting.Rule;
        public HighPriorityCommonRules: Formatting.Rule[];
        public LowPriorityCommonRules: Formatting.Rule[];
        public SpaceAfterComma: Formatting.Rule;
        public NoSpaceAfterComma: Formatting.Rule;
        public SpaceBeforeBinaryOperator: Formatting.Rule;
        public SpaceAfterBinaryOperator: Formatting.Rule;
        public NoSpaceBeforeBinaryOperator: Formatting.Rule;
        public NoSpaceAfterBinaryOperator: Formatting.Rule;
        public SpaceAfterKeywordInControl: Formatting.Rule;
        public NoSpaceAfterKeywordInControl: Formatting.Rule;
        public FunctionOpenBraceLeftTokenRange: Formatting.Shared.TokenRange;
        public SpaceBeforeOpenBraceInFunction: Formatting.Rule;
        public NewLineBeforeOpenBraceInFunction: Formatting.Rule;
        public TypeScriptOpenBraceLeftTokenRange: Formatting.Shared.TokenRange;
        public SpaceBeforeOpenBraceInTypeScriptDeclWithBlock: Formatting.Rule;
        public NewLineBeforeOpenBraceInTypeScriptDeclWithBlock: Formatting.Rule;
        public ControlOpenBraceLeftTokenRange: Formatting.Shared.TokenRange;
        public SpaceBeforeOpenBraceInControl: Formatting.Rule;
        public NewLineBeforeOpenBraceInControl: Formatting.Rule;
        public SpaceAfterSemicolonInFor: Formatting.Rule;
        public NoSpaceAfterSemicolonInFor: Formatting.Rule;
        public SpaceAfterOpenParen: Formatting.Rule;
        public SpaceBeforeCloseParen: Formatting.Rule;
        public NoSpaceBetweenParens: Formatting.Rule;
        public NoSpaceAfterOpenParen: Formatting.Rule;
        public NoSpaceBeforeCloseParen: Formatting.Rule;
        public SpaceAfterAnonymousFunctionKeyword: Formatting.Rule;
        public NoSpaceAfterAnonymousFunctionKeyword: Formatting.Rule;
        constructor();
        static IsForContext(context: Formatting.FormattingContext): boolean;
        static IsNotForContext(context: Formatting.FormattingContext): boolean;
        static IsBinaryOpContext(context: Formatting.FormattingContext): boolean;
        static IsNotBinaryOpContext(context: Formatting.FormattingContext): boolean;
        static IsSameLineTokenOrBeforeMultilineBlockContext(context: Formatting.FormattingContext): boolean;
        static IsBeforeMultilineBlockContext(context: Formatting.FormattingContext): boolean;
        static IsMultilineBlockContext(context: Formatting.FormattingContext): boolean;
        static IsSingleLineBlockContext(context: Formatting.FormattingContext): boolean;
        static IsBlockContext(context: Formatting.FormattingContext): boolean;
        static IsBeforeBlockContext(context: Formatting.FormattingContext): boolean;
        static NodeIsBlockContext(node: Formatting.IndentationNodeContext): boolean;
        static IsFunctionDeclContext(context: Formatting.FormattingContext): boolean;
        static IsTypeScriptDeclWithBlockContext(context: Formatting.FormattingContext): boolean;
        static NodeIsTypeScriptDeclWithBlockContext(node: Formatting.IndentationNodeContext): boolean;
        static IsAfterCodeBlockContext(context: Formatting.FormattingContext): boolean;
        static IsControlDeclContext(context: Formatting.FormattingContext): boolean;
        static IsObjectContext(context: Formatting.FormattingContext): boolean;
        static IsFunctionCallContext(context: Formatting.FormattingContext): boolean;
        static IsNewContext(context: Formatting.FormattingContext): boolean;
        static IsFunctionCallOrNewContext(context: Formatting.FormattingContext): boolean;
        static IsSameLineTokenContext(context: Formatting.FormattingContext): boolean;
        static IsNotFormatOnEnter(context: Formatting.FormattingContext): boolean;
        static IsModuleDeclContext(context: Formatting.FormattingContext): boolean;
        static IsObjectTypeContext(context: Formatting.FormattingContext): boolean;
        static IsTypeArgumentOrParameter(tokenKind: TypeScript.SyntaxKind, parentKind: TypeScript.SyntaxKind): boolean;
        static IsTypeArgumentOrParameterContext(context: Formatting.FormattingContext): boolean;
        static IsVoidOpContext(context: Formatting.FormattingContext): boolean;
    }
}
declare module TypeScript.Services.Formatting {
    class RulesMap {
        public map: RulesBucket[];
        public mapRowLength: number;
        constructor();
        static create(rules: Formatting.Rule[]): RulesMap;
        public Initialize(rules: Formatting.Rule[]): RulesBucket[];
        public FillRules(rules: Formatting.Rule[], rulesBucketConstructionStateList: RulesBucketConstructionState[]): void;
        private GetRuleBucketIndex(row, column);
        private FillRule(rule, rulesBucketConstructionStateList);
        public GetRule(context: Formatting.FormattingContext): Formatting.Rule;
    }
    enum RulesPosition {
        IgnoreRulesSpecific = 0,
        IgnoreRulesAny,
        ContextRulesSpecific,
        ContextRulesAny,
        NoContextRulesSpecific,
        NoContextRulesAny,
    }
    class RulesBucketConstructionState {
        private rulesInsertionIndexBitmap;
        constructor();
        public GetInsertionIndex(maskPosition: RulesPosition): number;
        public IncreaseInsertionIndex(maskPosition: RulesPosition): void;
    }
    class RulesBucket {
        private rules;
        constructor();
        public Rules(): Formatting.Rule[];
        public AddRule(rule: Formatting.Rule, specificTokens: boolean, constructionState: RulesBucketConstructionState[], rulesBucketIndex: number): void;
    }
}
declare module TypeScript.Services.Formatting {
    class RulesProvider {
        private logger;
        private globalRules;
        private options;
        private activeRules;
        private rulesMap;
        constructor(logger: TypeScript.ILogger);
        public getRuleName(rule: Formatting.Rule): string;
        public getRuleByName(name: string): Formatting.Rule;
        public getRulesMap(): Formatting.RulesMap;
        public ensureUpToDate(options: Services.FormatCodeOptions): void;
        private createActiveRules(options);
    }
}
declare module TypeScript.Services.Formatting {
    class TextEditInfo {
        public position: number;
        public length: number;
        public replaceWith: string;
        constructor(position: number, length: number, replaceWith: string);
        public toString(): string;
    }
}
declare module TypeScript.Services.Formatting {
    module Shared {
        interface ITokenAccess {
            GetTokens(): TypeScript.SyntaxKind[];
            Contains(token: TypeScript.SyntaxKind): boolean;
        }
        class TokenRangeAccess implements ITokenAccess {
            private tokens;
            constructor(from: TypeScript.SyntaxKind, to: TypeScript.SyntaxKind, except: TypeScript.SyntaxKind[]);
            public GetTokens(): TypeScript.SyntaxKind[];
            public Contains(token: TypeScript.SyntaxKind): boolean;
            public toString(): string;
        }
        class TokenValuesAccess implements ITokenAccess {
            private tokens;
            constructor(tks: TypeScript.SyntaxKind[]);
            public GetTokens(): TypeScript.SyntaxKind[];
            public Contains(token: TypeScript.SyntaxKind): boolean;
        }
        class TokenSingleValueAccess implements ITokenAccess {
            public token: TypeScript.SyntaxKind;
            constructor(token: TypeScript.SyntaxKind);
            public GetTokens(): TypeScript.SyntaxKind[];
            public Contains(tokenValue: TypeScript.SyntaxKind): boolean;
            public toString(): string;
        }
        class TokenAllAccess implements ITokenAccess {
            public GetTokens(): TypeScript.SyntaxKind[];
            public Contains(tokenValue: TypeScript.SyntaxKind): boolean;
            public toString(): string;
        }
        class TokenRange {
            public tokenAccess: ITokenAccess;
            constructor(tokenAccess: ITokenAccess);
            static FromToken(token: TypeScript.SyntaxKind): TokenRange;
            static FromTokens(tokens: TypeScript.SyntaxKind[]): TokenRange;
            static FromRange(f: TypeScript.SyntaxKind, to: TypeScript.SyntaxKind, except?: TypeScript.SyntaxKind[]): TokenRange;
            static AllTokens(): TokenRange;
            public GetTokens(): TypeScript.SyntaxKind[];
            public Contains(token: TypeScript.SyntaxKind): boolean;
            public toString(): string;
            static Any: TokenRange;
            static AnyIncludingMultilineComments: TokenRange;
            static Keywords: TokenRange;
            static Operators: TokenRange;
            static BinaryOperators: TokenRange;
            static BinaryKeywordOperators: TokenRange;
            static ReservedKeywords: TokenRange;
            static UnaryPrefixOperators: TokenRange;
            static UnaryPrefixExpressions: TokenRange;
            static UnaryPreincrementExpressions: TokenRange;
            static UnaryPostincrementExpressions: TokenRange;
            static UnaryPredecrementExpressions: TokenRange;
            static UnaryPostdecrementExpressions: TokenRange;
            static Comments: TokenRange;
            static TypeNames: TokenRange;
        }
    }
}
declare module TypeScript.Services.Formatting {
    class TokenSpan extends TypeScript.TextSpan {
        private _kind;
        constructor(kind: TypeScript.SyntaxKind, start: number, length: number);
        public kind(): TypeScript.SyntaxKind;
    }
}
declare module TypeScript.Services.Formatting {
    class IndentationNodeContext {
        private _node;
        private _parent;
        private _fullStart;
        private _indentationAmount;
        private _childIndentationAmountDelta;
        private _depth;
        private _hasSkippedOrMissingTokenChild;
        constructor(parent: IndentationNodeContext, node: TypeScript.SyntaxNode, fullStart: number, indentationAmount: number, childIndentationAmountDelta: number);
        public parent(): IndentationNodeContext;
        public node(): TypeScript.SyntaxNode;
        public fullStart(): number;
        public fullWidth(): number;
        public start(): number;
        public end(): number;
        public indentationAmount(): number;
        public childIndentationAmountDelta(): number;
        public depth(): number;
        public kind(): TypeScript.SyntaxKind;
        public hasSkippedOrMissingTokenChild(): boolean;
        public clone(pool: Formatting.IndentationNodeContextPool): IndentationNodeContext;
        public update(parent: IndentationNodeContext, node: TypeScript.SyntaxNode, fullStart: number, indentationAmount: number, childIndentationAmountDelta: number): void;
    }
}
declare module TypeScript.Services.Formatting {
    class IndentationNodeContextPool {
        private nodes;
        public getNode(parent: Formatting.IndentationNodeContext, node: TypeScript.SyntaxNode, fullStart: number, indentationLevel: number, childIndentationLevelDelta: number): Formatting.IndentationNodeContext;
        public releaseNode(node: Formatting.IndentationNodeContext, recursive?: boolean): void;
    }
}
declare module TypeScript.Services.Formatting {
    class IndentationTrackingWalker extends TypeScript.SyntaxWalker {
        public options: FormattingOptions;
        private _position;
        private _parent;
        private _textSpan;
        private _snapshot;
        private _lastTriviaWasNewLine;
        private _indentationNodeContextPool;
        constructor(textSpan: TypeScript.TextSpan, sourceUnit: TypeScript.SourceUnitSyntax, snapshot: Formatting.ITextSnapshot, indentFirstToken: boolean, options: FormattingOptions);
        public position(): number;
        public parent(): Formatting.IndentationNodeContext;
        public textSpan(): TypeScript.TextSpan;
        public snapshot(): Formatting.ITextSnapshot;
        public indentationNodeContextPool(): Formatting.IndentationNodeContextPool;
        public forceIndentNextToken(tokenStart: number): void;
        public forceSkipIndentingNextToken(tokenStart: number): void;
        public indentToken(token: TypeScript.ISyntaxToken, indentationAmount: number, commentIndentationAmount: number): void;
        public visitTokenInSpan(token: TypeScript.ISyntaxToken): void;
        public visitToken(token: TypeScript.ISyntaxToken): void;
        public visitNode(node: TypeScript.SyntaxNode): void;
        private getTokenIndentationAmount(token);
        private getCommentIndentationAmount(token);
        private getNodeIndentation(node, newLineInsertedByFormatting?);
        private forceRecomputeIndentationOfParent(tokenStart, newLineAdded);
    }
}
declare module TypeScript.Services.Formatting {
    class MultipleTokenIndenter extends Formatting.IndentationTrackingWalker {
        private _edits;
        constructor(textSpan: TypeScript.TextSpan, sourceUnit: TypeScript.SourceUnitSyntax, snapshot: Formatting.ITextSnapshot, indentFirstToken: boolean, options: FormattingOptions);
        public indentToken(token: TypeScript.ISyntaxToken, indentationAmount: number, commentIndentationAmount: number): void;
        public edits(): Formatting.TextEditInfo[];
        public recordEdit(position: number, length: number, replaceWith: string): void;
        private recordIndentationEditsForToken(token, indentationString, commentIndentationString);
        private recordIndentationEditsForSingleLineOrSkippedText(trivia, fullStart, indentationString);
        private recordIndentationEditsForWhitespace(trivia, fullStart, indentationString);
        private recordIndentationEditsForMultiLineComment(trivia, fullStart, indentationString, leadingWhiteSpace, firstLineAlreadyIndented);
        private recordIndentationEditsForSegment(segment, fullStart, indentationColumns, whiteSpaceColumnsInFirstSegment);
    }
}
declare module TypeScript.Services.Formatting {
    class SingleTokenIndenter extends Formatting.IndentationTrackingWalker {
        private indentationAmount;
        private indentationPosition;
        constructor(indentationPosition: number, sourceUnit: TypeScript.SourceUnitSyntax, snapshot: Formatting.ITextSnapshot, indentFirstToken: boolean, options: FormattingOptions);
        static getIndentationAmount(position: number, sourceUnit: TypeScript.SourceUnitSyntax, snapshot: Formatting.ITextSnapshot, options: FormattingOptions): number;
        public indentToken(token: TypeScript.ISyntaxToken, indentationAmount: number, commentIndentationAmount: number): void;
    }
}
declare module TypeScript.Services.Formatting {
    class Formatter extends Formatting.MultipleTokenIndenter {
        private previousTokenSpan;
        private previousTokenParent;
        private scriptHasErrors;
        private rulesProvider;
        private formattingRequestKind;
        private formattingContext;
        constructor(textSpan: TypeScript.TextSpan, sourceUnit: TypeScript.SourceUnitSyntax, indentFirstToken: boolean, options: FormattingOptions, snapshot: Formatting.ITextSnapshot, rulesProvider: Formatting.RulesProvider, formattingRequestKind: Formatting.FormattingRequestKind);
        static getEdits(textSpan: TypeScript.TextSpan, sourceUnit: TypeScript.SourceUnitSyntax, options: FormattingOptions, indentFirstToken: boolean, snapshot: Formatting.ITextSnapshot, rulesProvider: Formatting.RulesProvider, formattingRequestKind: Formatting.FormattingRequestKind): Formatting.TextEditInfo[];
        public visitTokenInSpan(token: TypeScript.ISyntaxToken): void;
        private processToken(token);
        private processTrivia(triviaList, fullStart);
        private findCommonParents(parent1, parent2);
        private formatPair(t1, t1Parent, t2, t2Parent);
        private getLineNumber(span);
        private trimWhitespaceInLineRange(startLine, endLine, token?);
        private trimWhitespace(line, token?);
        private RecordRuleEdits(rule, t1, t2);
    }
}
declare var debugObjectHost: any;
declare module TypeScript.Services {
    interface ICoreServicesHost {
        logger: TypeScript.ILogger;
    }
    class CoreServices {
        public host: ICoreServicesHost;
        constructor(host: ICoreServicesHost);
        public getPreProcessedFileInfo(fileName: string, sourceText: TypeScript.IScriptSnapshot): TypeScript.IPreProcessedFileInfo;
        public getDefaultCompilationSettings(): TypeScript.CompilationSettings;
        public dumpMemory(): string;
        public getMemoryInfo(): any[];
        public collectGarbage(): void;
    }
}
declare module TypeScript.Services {
    class SyntaxTreeCache {
        private _host;
        private _hostCache;
        private _currentFileName;
        private _currentFileVersion;
        private _currentFileSyntaxTree;
        private _currentFileScriptSnapshot;
        constructor(_host: Services.ILanguageServiceHost);
        public getCurrentFileSyntaxTree(fileName: string): TypeScript.SyntaxTree;
        private createSyntaxTree(fileName, scriptSnapshot);
        private updateSyntaxTree(fileName, scriptSnapshot, previousSyntaxTree, previousFileVersion);
        private ensureInvariants(fileName, editRange, incrementalTree, oldScriptSnapshot, newScriptSnapshot);
    }
    class LanguageServiceCompiler {
        private host;
        private logger;
        private compiler;
        private hostCache;
        constructor(host: Services.ILanguageServiceHost);
        private synchronizeHostData();
        private synchronizeHostDataWorker();
        private tryUpdateFile(compiler, fileName);
        public getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot;
        public getCachedHostFileName(fileName: string): string;
        public getCachedTopLevelDeclaration(fileName: string): TypeScript.PullDecl;
        public compilationSettings(): TypeScript.ImmutableCompilationSettings;
        public fileNames(): string[];
        public cleanupSemanticCache(): void;
        public getDocument(fileName: string): TypeScript.Document;
        public getSyntacticDiagnostics(fileName: string): TypeScript.Diagnostic[];
        public getSemanticDiagnostics(fileName: string): TypeScript.Diagnostic[];
        public getSymbolInformationFromAST(ast: TypeScript.AST, document: TypeScript.Document): TypeScript.PullSymbolInfo;
        public getCallInformationFromAST(ast: TypeScript.AST, document: TypeScript.Document): TypeScript.PullCallSymbolInfo;
        public getVisibleMemberSymbolsFromAST(ast: TypeScript.AST, document: TypeScript.Document): TypeScript.PullVisibleSymbolsInfo;
        public getVisibleDeclsFromAST(ast: TypeScript.AST, document: TypeScript.Document): TypeScript.PullDecl[];
        public getContextualMembersFromAST(ast: TypeScript.AST, document: TypeScript.Document): TypeScript.PullVisibleSymbolsInfo;
        public pullGetDeclInformation(decl: TypeScript.PullDecl, ast: TypeScript.AST, document: TypeScript.Document): TypeScript.PullSymbolInfo;
        public topLevelDeclaration(fileName: string): TypeScript.PullDecl;
        public getDeclForAST(ast: TypeScript.AST): TypeScript.PullDecl;
        public emit(fileName: string, resolvePath: (path: string) => string): TypeScript.EmitOutput;
        public emitDeclarations(fileName: string, resolvePath: (path: string) => string): TypeScript.EmitOutput;
    }
}
declare module TypeScript.Services {
    class CompletionHelpers {
        static filterContextualMembersList(contextualMemberSymbols: TypeScript.PullSymbol[], existingMembers: TypeScript.PullVisibleSymbolsInfo): TypeScript.PullSymbol[];
        static isCompletionListBlocker(sourceUnit: TypeScript.SourceUnitSyntax, position: number): boolean;
        static getContainingObjectLiteralApplicableForCompletion(sourceUnit: TypeScript.SourceUnitSyntax, position: number): TypeScript.PositionedElement;
        static isIdentifierDefinitionLocation(sourceUnit: TypeScript.SourceUnitSyntax, position: number): boolean;
        static getNonIdentifierCompleteTokenOnLeft(sourceUnit: TypeScript.SourceUnitSyntax, position: number): TypeScript.PositionedToken;
        static isRightOfIllegalDot(sourceUnit: TypeScript.SourceUnitSyntax, position: number): boolean;
        static getValidCompletionEntryDisplayName(displayName: string): string;
    }
}
declare module TypeScript.Services {
    class KeywordCompletions {
        private static keywords;
        private static keywordCompletions;
        static getKeywordCompltions(): Services.ResolvedCompletionEntry[];
    }
}
declare module TypeScript.Services {
    interface IPartiallyWrittenTypeArgumentListInformation {
        genericIdentifer: TypeScript.PositionedToken;
        lessThanToken: TypeScript.PositionedToken;
        argumentIndex: number;
    }
    class SignatureInfoHelpers {
        static isInPartiallyWrittenTypeArgumentList(syntaxTree: TypeScript.SyntaxTree, position: number): IPartiallyWrittenTypeArgumentListInformation;
        static getSignatureInfoFromSignatureSymbol(symbol: TypeScript.PullSymbol, signatures: TypeScript.PullSignatureSymbol[], enclosingScopeSymbol: TypeScript.PullSymbol, compilerState: Services.LanguageServiceCompiler): Services.FormalSignatureItemInfo[];
        static getSignatureInfoFromGenericSymbol(symbol: TypeScript.PullSymbol, enclosingScopeSymbol: TypeScript.PullSymbol, compilerState: Services.LanguageServiceCompiler): Services.FormalSignatureItemInfo[];
        static getActualSignatureInfoFromCallExpression(ast: TypeScript.ICallExpression, caretPosition: number, typeParameterInformation: IPartiallyWrittenTypeArgumentListInformation): Services.ActualSignatureInfo;
        static getActualSignatureInfoFromPartiallyWritenGenericExpression(caretPosition: number, typeParameterInformation: IPartiallyWrittenTypeArgumentListInformation): Services.ActualSignatureInfo;
        static isSignatureHelpBlocker(sourceUnit: TypeScript.SourceUnitSyntax, position: number): boolean;
        static isTargetOfObjectCreationExpression(positionedToken: TypeScript.PositionedToken): boolean;
        private static moveBackUpTillMatchingTokenKind(token, tokenKind, matchingTokenKind);
    }
}
declare module TypeScript.Services {
    interface CachedCompletionEntryDetails extends Services.CompletionEntryDetails {
        isResolved(): boolean;
    }
    class ResolvedCompletionEntry implements CachedCompletionEntryDetails {
        public name: string;
        public kind: string;
        public kindModifiers: string;
        public type: string;
        public fullSymbolName: string;
        public docComment: string;
        constructor(name: string, kind: string, kindModifiers: string, type: string, fullSymbolName: string, docComment: string);
        public isResolved(): boolean;
    }
    class DeclReferenceCompletionEntry implements CachedCompletionEntryDetails {
        public name: string;
        public kind: string;
        public kindModifiers: string;
        public decl: TypeScript.PullDecl;
        public type: string;
        public fullSymbolName: string;
        public docComment: string;
        private hasBeenResolved;
        constructor(name: string, kind: string, kindModifiers: string, decl: TypeScript.PullDecl);
        public isResolved(): boolean;
        public resolve(type: string, fullSymbolName: string, docComments: string): void;
    }
    class CompletionSession {
        public fileName: string;
        public position: number;
        public entries: TypeScript.IdentiferNameHashTable<CachedCompletionEntryDetails>;
        constructor(fileName: string, position: number, entries: TypeScript.IdentiferNameHashTable<CachedCompletionEntryDetails>);
    }
}
declare module TypeScript.Services {
    class LanguageService implements Services.ILanguageService {
        public host: Services.ILanguageServiceHost;
        private logger;
        private compiler;
        private _syntaxTreeCache;
        private formattingRulesProvider;
        private activeCompletionSession;
        constructor(host: Services.ILanguageServiceHost);
        public cleanupSemanticCache(): void;
        public refresh(): void;
        private getSymbolInfoAtPosition(fileName, pos, requireName);
        public getReferencesAtPosition(fileName: string, pos: number): Services.ReferenceEntry[];
        private getSymbolScopeAST(symbol, ast);
        public getOccurrencesAtPosition(fileName: string, pos: number): Services.ReferenceEntry[];
        private getSingleNodeReferenceAtPosition(fileName, position);
        public getImplementorsAtPosition(fileName: string, pos: number): Services.ReferenceEntry[];
        public getOverrides(container: TypeScript.PullTypeSymbol, memberSym: TypeScript.PullSymbol): TypeScript.PullTypeSymbol[];
        private getImplementorsInFile(fileName, symbol);
        private getReferencesInFile(fileName, symbol, containingASTOpt);
        private isWriteAccess(current);
        private isLetterOrDigit(char);
        private getPossibleSymbolReferencePositions(fileName, symbolName);
        public getSignatureAtPosition(fileName: string, position: number): Services.SignatureInfo;
        private getTypeParameterSignatureFromPartiallyWrittenExpression(document, position, genericTypeArgumentListInfo);
        public getDefinitionAtPosition(fileName: string, position: number): Services.DefinitionInfo[];
        private addDeclarations(symbolKind, symbolName, containerKind, containerName, declarations, result);
        private addDeclaration(symbolKind, symbolName, containerKind, containerName, declaration, result);
        private tryAddDefinition(symbolKind, symbolName, containerKind, containerName, declarations, result);
        private tryAddSignatures(symbolKind, symbolName, containerKind, containerName, declarations, result);
        private tryAddConstructor(symbolKind, symbolName, containerKind, containerName, declarations, result);
        public getNavigateToItems(searchValue: string): Services.NavigateToItem[];
        private findSearchValueInPullDecl(fileName, declarations, results, searchTerms, searchRegExpTerms, parentName?, parentkindName?);
        private getScriptElementKindModifiersFromDecl(decl);
        private isContainerDeclaration(declaration);
        private shouldIncludeDeclarationInNavigationItems(declaration);
        public getSyntacticDiagnostics(fileName: string): TypeScript.Diagnostic[];
        public getSemanticDiagnostics(fileName: string): TypeScript.Diagnostic[];
        public getEmitOutput(fileName: string): TypeScript.EmitOutput;
        private getAllSyntacticDiagnostics();
        private getAllSemanticDiagnostics();
        private containErrors(diagnostics);
        private getFullNameOfSymbol(symbol, enclosingScopeSymbol);
        private getTypeInfoEligiblePath(fileName, position, isConstructorValidPosition);
        public getTypeAtPosition(fileName: string, position: number): Services.TypeInfo;
        public getCompletionsAtPosition(fileName: string, position: number, isMemberCompletion: boolean): Services.CompletionInfo;
        private getCompletionEntriesFromSymbols(symbolInfo, result);
        private getCompletionEntriesFromDecls(decls, result);
        private getResolvedCompletionEntryDetailsFromSymbol(symbol, enclosingScopeSymbol);
        private getCompletionEntriesForKeywords(keywords, result);
        public getCompletionEntryDetails(fileName: string, position: number, entryName: string): Services.CompletionEntryDetails;
        private tryFindDeclFromPreviousCompilerVersion(invalidatedDecl);
        private getModuleOrEnumKind(symbol);
        private mapPullElementKind(kind, symbol?, useConstructorAsClass?, varIsFunction?, functionIsConstructor?);
        private getScriptElementKindModifiers(symbol);
        private getScriptElementKindModifiersFromFlags(flags);
        public getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): Services.SpanInfo;
        public getBreakpointStatementAtPosition(fileName: string, pos: number): Services.SpanInfo;
        public getFormattingEditsForRange(fileName: string, minChar: number, limChar: number, options: Services.FormatCodeOptions): Services.TextEdit[];
        public getFormattingEditsForDocument(fileName: string, minChar: number, limChar: number, options: Services.FormatCodeOptions): Services.TextEdit[];
        public getFormattingEditsOnPaste(fileName: string, minChar: number, limChar: number, options: Services.FormatCodeOptions): Services.TextEdit[];
        public getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: Services.FormatCodeOptions): Services.TextEdit[];
        private getFormattingManager(fileName, options);
        public getOutliningRegions(fileName: string): TypeScript.TextSpan[];
        public getIndentationAtPosition(fileName: string, position: number, editorOptions: Services.EditorOptions): number;
        public getBraceMatchingAtPosition(fileName: string, position: number): TypeScript.TextSpan[];
        public getScriptLexicalStructure(fileName: string): Services.NavigateToItem[];
        public getSyntaxTree(fileName: string): TypeScript.SyntaxTree;
    }
}
declare module TypeScript.Services {
    class FindReferenceHelpers {
        static compareSymbolsForLexicalIdentity(firstSymbol: TypeScript.PullSymbol, secondSymbol: TypeScript.PullSymbol): boolean;
        private static checkSymbolsForDeclarationEquality(firstSymbol, secondSymbol);
        private static declarationsAreSameOrParents(firstDecl, secondDecl);
    }
}
declare module TypeScript.Services {
    interface IScriptSnapshotShim {
        getText(start: number, end: number): string;
        getLength(): number;
        getLineStartPositions(): string;
        getTextChangeRangeSinceVersion(scriptVersion: number): string;
    }
    interface ILanguageServiceShimHost extends TypeScript.ILogger {
        getCompilationSettings(): string;
        getScriptFileNames(): string;
        getScriptVersion(fileName: string): number;
        getScriptIsOpen(fileName: string): boolean;
        getScriptByteOrderMark(fileName: string): number;
        getScriptSnapshot(fileName: string): IScriptSnapshotShim;
        resolveRelativePath(path: string, directory: string): string;
        fileExists(path: string): boolean;
        directoryExists(path: string): boolean;
        getParentDirectory(path: string): string;
        getDiagnosticsObject(): Services.ILanguageServicesDiagnostics;
        getLocalizedDiagnosticMessages(): string;
    }
    interface IShimFactory {
        registerShim(shim: IShim): void;
        unregisterShim(shim: IShim): void;
    }
    interface IShim {
        dispose(dummy: any): void;
    }
    class ShimBase implements IShim {
        private factory;
        constructor(factory: IShimFactory);
        public dispose(dummy: any): void;
    }
    interface ILanguageServiceShim extends IShim {
        languageService: Services.ILanguageService;
        dispose(dummy: any): void;
        refresh(throwOnError: boolean): void;
        cleanupSemanticCache(): void;
        getSyntacticDiagnostics(fileName: string): string;
        getSemanticDiagnostics(fileName: string): string;
        getCompletionsAtPosition(fileName: string, position: number, isMemberCompletion: boolean): string;
        getCompletionEntryDetails(fileName: string, position: number, entryName: string): string;
        getTypeAtPosition(fileName: string, position: number): string;
        getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): string;
        getBreakpointStatementAtPosition(fileName: string, position: number): string;
        getSignatureAtPosition(fileName: string, position: number): string;
        getDefinitionAtPosition(fileName: string, position: number): string;
        getReferencesAtPosition(fileName: string, position: number): string;
        getOccurrencesAtPosition(fileName: string, position: number): string;
        getImplementorsAtPosition(fileName: string, position: number): string;
        getNavigateToItems(searchValue: string): string;
        getScriptLexicalStructure(fileName: string): string;
        getOutliningRegions(fileName: string): string;
        getBraceMatchingAtPosition(fileName: string, position: number): string;
        getIndentationAtPosition(fileName: string, position: number, options: string): string;
        getFormattingEditsForRange(fileName: string, minChar: number, limChar: number, options: string): string;
        getFormattingEditsForDocument(fileName: string, minChar: number, limChar: number, options: string): string;
        getFormattingEditsOnPaste(fileName: string, minChar: number, limChar: number, options: string): string;
        getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: string): string;
        getEmitOutput(fileName: string): string;
    }
    class LanguageServiceShimHostAdapter implements Services.ILanguageServiceHost {
        private shimHost;
        constructor(shimHost: ILanguageServiceShimHost);
        public information(): boolean;
        public debug(): boolean;
        public warning(): boolean;
        public error(): boolean;
        public fatal(): boolean;
        public log(s: string): void;
        public getCompilationSettings(): TypeScript.CompilationSettings;
        public getScriptFileNames(): string[];
        public getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot;
        public getScriptVersion(fileName: string): number;
        public getScriptIsOpen(fileName: string): boolean;
        public getScriptByteOrderMark(fileName: string): TypeScript.ByteOrderMark;
        public getDiagnosticsObject(): Services.ILanguageServicesDiagnostics;
        public getLocalizedDiagnosticMessages(): any;
        public resolveRelativePath(path: string, directory: string): string;
        public fileExists(path: string): boolean;
        public directoryExists(path: string): boolean;
        public getParentDirectory(path: string): string;
    }
    function simpleForwardCall(logger: TypeScript.ILogger, actionDescription: string, action: () => any): any;
    function forwardJSONCall(logger: TypeScript.ILogger, actionDescription: string, action: () => any): string;
    class LanguageServiceShim extends ShimBase implements ILanguageServiceShim {
        private host;
        public languageService: Services.ILanguageService;
        private logger;
        constructor(factory: IShimFactory, host: ILanguageServiceShimHost, languageService: Services.ILanguageService);
        public forwardJSONCall(actionDescription: string, action: () => any): string;
        public dispose(dummy: any): void;
        public refresh(throwOnError: boolean): void;
        public cleanupSemanticCache(): void;
        private static realizeDiagnosticCategory(category);
        private static realizeDiagnostic(diagnostic);
        public getSyntacticDiagnostics(fileName: string): string;
        public getSemanticDiagnostics(fileName: string): string;
        public getTypeAtPosition(fileName: string, position: number): string;
        public getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): string;
        public getBreakpointStatementAtPosition(fileName: string, position: number): string;
        public getSignatureAtPosition(fileName: string, position: number): string;
        public getDefinitionAtPosition(fileName: string, position: number): string;
        public getBraceMatchingAtPosition(fileName: string, position: number): string;
        public getIndentationAtPosition(fileName: string, position: number, options: string): string;
        public getReferencesAtPosition(fileName: string, position: number): string;
        public getOccurrencesAtPosition(fileName: string, position: number): string;
        public getImplementorsAtPosition(fileName: string, position: number): string;
        public getCompletionsAtPosition(fileName: string, position: number, isMemberCompletion: boolean): string;
        public getCompletionEntryDetails(fileName: string, position: number, entryName: string): string;
        public getFormattingEditsForRange(fileName: string, minChar: number, limChar: number, options: string): string;
        public getFormattingEditsForDocument(fileName: string, minChar: number, limChar: number, options: string): string;
        public getFormattingEditsOnPaste(fileName: string, minChar: number, limChar: number, options: string): string;
        public getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: string): string;
        public getNavigateToItems(searchValue: string): string;
        public getScriptLexicalStructure(fileName: string): string;
        public getOutliningRegions(fileName: string): string;
        public getEmitOutput(fileName: string): string;
        private _navigateToItemsToString(items);
    }
    class ClassifierShim extends ShimBase {
        public host: Services.IClassifierHost;
        public classifier: Services.Classifier;
        constructor(factory: IShimFactory, host: Services.IClassifierHost);
        public getClassificationsForLine(text: string, lexState: Services.EndOfLineState): string;
    }
    class CoreServicesShim extends ShimBase {
        public host: Services.ICoreServicesHost;
        public logger: TypeScript.ILogger;
        public services: Services.CoreServices;
        constructor(factory: IShimFactory, host: Services.ICoreServicesHost);
        private forwardJSONCall(actionDescription, action);
        public getPreProcessedFileInfo(fileName: string, sourceText: TypeScript.IScriptSnapshot): string;
        public getDefaultCompilationSettings(): string;
        public dumpMemory(dummy: any): string;
        public getMemoryInfo(dummy: any): string;
    }
}
declare module TypeScript.Services {
    class OutliningElementsCollector extends TypeScript.DepthLimitedWalker {
        private static MaximumDepth;
        private inObjectLiteralExpression;
        private elements;
        constructor();
        public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): void;
        public visitInterfaceDeclaration(node: TypeScript.InterfaceDeclarationSyntax): void;
        public visitModuleDeclaration(node: TypeScript.ModuleDeclarationSyntax): void;
        public visitEnumDeclaration(node: TypeScript.EnumDeclarationSyntax): void;
        public visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): void;
        public visitFunctionExpression(node: TypeScript.FunctionExpressionSyntax): void;
        public visitConstructorDeclaration(node: TypeScript.ConstructorDeclarationSyntax): void;
        public visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): void;
        public visitGetAccessor(node: TypeScript.GetAccessorSyntax): void;
        public visitSetAccessor(node: TypeScript.SetAccessorSyntax): void;
        public visitObjectLiteralExpression(node: TypeScript.ObjectLiteralExpressionSyntax): void;
        private addOutlineRange(node, startElement, endElement);
        static collectElements(node: TypeScript.SourceUnitSyntax): TypeScript.TextSpan[];
    }
}
declare module TypeScript.Services {
    class BraceMatcher {
        static getMatchSpans(syntaxTree: TypeScript.SyntaxTree, position: number): TypeScript.TextSpan[];
        private static getMatchingCloseBrace(currentToken, position, result);
        private static getMatchingOpenBrace(currentToken, position, result);
        private static getMatchingCloseBraceTokenKind(positionedElement);
        private static getMatchingOpenBraceTokenKind(positionedElement);
    }
}
declare module TypeScript.Services {
    class Indenter {
        static getIndentation(node: TypeScript.SourceUnitSyntax, soruceText: TypeScript.IScriptSnapshot, position: number, editorOptions: Services.EditorOptions): number;
        private static belongsToBracket(sourceText, token, position);
        private static isInContainerNode(parent, element);
        private static getCustomListIndentation(list, element);
        private static getListItemIndentation(list, elementIndex);
    }
}
declare module TypeScript.Services.Breakpoints {
    function getBreakpointLocation(syntaxTree: TypeScript.SyntaxTree, askedPos: number): Services.SpanInfo;
}
declare module TypeScript.Services {
    class GetScriptLexicalStructureWalker extends TypeScript.PositionTrackingWalker {
        private items;
        private fileName;
        private nameStack;
        private kindStack;
        private currentMemberVariableDeclaration;
        private currentVariableStatement;
        private currentInterfaceDeclaration;
        constructor(items: Services.NavigateToItem[], fileName: string);
        static getListsOfAllScriptLexicalStructure(items: Services.NavigateToItem[], fileName: string, unit: TypeScript.SourceUnitSyntax): void;
        private createItem(node, modifiers, kind, name);
        private getKindModifiers(modifiers);
        public visitModuleDeclaration(node: TypeScript.ModuleDeclarationSyntax): void;
        private visitModuleDeclarationWorker(node, names, nameIndex);
        private getModuleNames(node);
        private getModuleNamesHelper(name, result);
        public visitClassDeclaration(node: TypeScript.ClassDeclarationSyntax): void;
        public visitInterfaceDeclaration(node: TypeScript.InterfaceDeclarationSyntax): void;
        public visitObjectType(node: TypeScript.ObjectTypeSyntax): void;
        public visitEnumDeclaration(node: TypeScript.EnumDeclarationSyntax): void;
        public visitConstructorDeclaration(node: TypeScript.ConstructorDeclarationSyntax): void;
        public visitMemberFunctionDeclaration(node: TypeScript.MemberFunctionDeclarationSyntax): void;
        public visitGetAccessor(node: TypeScript.GetAccessorSyntax): void;
        public visitSetAccessor(node: TypeScript.SetAccessorSyntax): void;
        public visitMemberVariableDeclaration(node: TypeScript.MemberVariableDeclarationSyntax): void;
        public visitVariableStatement(node: TypeScript.VariableStatementSyntax): void;
        public visitVariableDeclarator(node: TypeScript.VariableDeclaratorSyntax): void;
        public visitIndexSignature(node: TypeScript.IndexSignatureSyntax): void;
        public visitEnumElement(node: TypeScript.EnumElementSyntax): void;
        public visitCallSignature(node: TypeScript.CallSignatureSyntax): void;
        public visitConstructSignature(node: TypeScript.ConstructSignatureSyntax): void;
        public visitMethodSignature(node: TypeScript.MethodSignatureSyntax): void;
        public visitPropertySignature(node: TypeScript.PropertySignatureSyntax): void;
        public visitFunctionDeclaration(node: TypeScript.FunctionDeclarationSyntax): void;
        public visitBlock(node: TypeScript.BlockSyntax): void;
        public visitIfStatement(node: TypeScript.IfStatementSyntax): void;
        public visitExpressionStatement(node: TypeScript.ExpressionStatementSyntax): void;
        public visitThrowStatement(node: TypeScript.ThrowStatementSyntax): void;
        public visitReturnStatement(node: TypeScript.ReturnStatementSyntax): void;
        public visitSwitchStatement(node: TypeScript.SwitchStatementSyntax): void;
        public visitWithStatement(node: TypeScript.WithStatementSyntax): void;
        public visitTryStatement(node: TypeScript.TryStatementSyntax): void;
        public visitLabeledStatement(node: TypeScript.LabeledStatementSyntax): void;
    }
}
declare module TypeScript.Services {
    function copyDataObject(dst: any, src: any): any;
    class TypeScriptServicesFactory implements Services.IShimFactory {
        private _shims;
        public createPullLanguageService(host: Services.ILanguageServiceHost): Services.ILanguageService;
        public createLanguageServiceShim(host: Services.ILanguageServiceShimHost): Services.ILanguageServiceShim;
        public createClassifier(host: Services.IClassifierHost): Services.Classifier;
        public createClassifierShim(host: Services.IClassifierHost): Services.ClassifierShim;
        public createCoreServices(host: Services.ICoreServicesHost): Services.CoreServices;
        public createCoreServicesShim(host: Services.ICoreServicesHost): Services.CoreServicesShim;
        public close(): void;
        public registerShim(shim: Services.IShim): void;
        public unregisterShim(shim: Services.IShim): void;
    }
}
declare module TypeScript.Services {
    interface ILanguageServicesDiagnostics {
        log(content: string): void;
    }
}
declare module TypeScript.Services {
    interface ILanguageServiceHost extends TypeScript.ILogger, TypeScript.IReferenceResolverHost {
        getCompilationSettings(): TypeScript.CompilationSettings;
        getScriptFileNames(): string[];
        getScriptVersion(fileName: string): number;
        getScriptIsOpen(fileName: string): boolean;
        getScriptByteOrderMark(fileName: string): TypeScript.ByteOrderMark;
        getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot;
        getDiagnosticsObject(): Services.ILanguageServicesDiagnostics;
        getLocalizedDiagnosticMessages(): any;
    }
    interface ILanguageService {
        refresh(): void;
        cleanupSemanticCache(): void;
        getSyntacticDiagnostics(fileName: string): TypeScript.Diagnostic[];
        getSemanticDiagnostics(fileName: string): TypeScript.Diagnostic[];
        getCompletionsAtPosition(fileName: string, position: number, isMemberCompletion: boolean): CompletionInfo;
        getCompletionEntryDetails(fileName: string, position: number, entryName: string): CompletionEntryDetails;
        getTypeAtPosition(fileName: string, position: number): TypeInfo;
        getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): SpanInfo;
        getBreakpointStatementAtPosition(fileName: string, position: number): SpanInfo;
        getSignatureAtPosition(fileName: string, position: number): SignatureInfo;
        getDefinitionAtPosition(fileName: string, position: number): DefinitionInfo[];
        getReferencesAtPosition(fileName: string, position: number): ReferenceEntry[];
        getOccurrencesAtPosition(fileName: string, position: number): ReferenceEntry[];
        getImplementorsAtPosition(fileName: string, position: number): ReferenceEntry[];
        getNavigateToItems(searchValue: string): NavigateToItem[];
        getScriptLexicalStructure(fileName: string): NavigateToItem[];
        getOutliningRegions(fileName: string): TypeScript.TextSpan[];
        getBraceMatchingAtPosition(fileName: string, position: number): TypeScript.TextSpan[];
        getIndentationAtPosition(fileName: string, position: number, options: EditorOptions): number;
        getFormattingEditsForRange(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[];
        getFormattingEditsForDocument(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[];
        getFormattingEditsOnPaste(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[];
        getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: FormatCodeOptions): TextEdit[];
        getEmitOutput(fileName: string): TypeScript.EmitOutput;
        getSyntaxTree(fileName: string): TypeScript.SyntaxTree;
    }
    function logInternalError(logger: TypeScript.ILogger, err: Error): void;
    class ReferenceEntry {
        public fileName: string;
        public minChar: number;
        public limChar: number;
        public isWriteAccess: boolean;
        constructor(fileName: string, minChar: number, limChar: number, isWriteAccess: boolean);
    }
    class NavigateToItem {
        public name: string;
        public kind: string;
        public kindModifiers: string;
        public matchKind: string;
        public fileName: string;
        public minChar: number;
        public limChar: number;
        public containerName: string;
        public containerKind: string;
    }
    class TextEdit {
        public minChar: number;
        public limChar: number;
        public text: string;
        constructor(minChar: number, limChar: number, text: string);
        static createInsert(pos: number, text: string): TextEdit;
        static createDelete(minChar: number, limChar: number): TextEdit;
        static createReplace(minChar: number, limChar: number, text: string): TextEdit;
    }
    class EditorOptions {
        public IndentSize: number;
        public TabSize: number;
        public NewLineCharacter: string;
        public ConvertTabsToSpaces: boolean;
        static clone(objectToClone: EditorOptions): EditorOptions;
    }
    class FormatCodeOptions extends EditorOptions {
        public InsertSpaceAfterCommaDelimiter: boolean;
        public InsertSpaceAfterSemicolonInForStatements: boolean;
        public InsertSpaceBeforeAndAfterBinaryOperators: boolean;
        public InsertSpaceAfterKeywordsInControlFlowStatements: boolean;
        public InsertSpaceAfterFunctionKeywordForAnonymousFunctions: boolean;
        public InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: boolean;
        public PlaceOpenBraceOnNewLineForFunctions: boolean;
        public PlaceOpenBraceOnNewLineForControlBlocks: boolean;
        static clone(objectToClone: FormatCodeOptions): FormatCodeOptions;
    }
    class DefinitionInfo {
        public fileName: string;
        public minChar: number;
        public limChar: number;
        public kind: string;
        public name: string;
        public containerKind: string;
        public containerName: string;
        constructor(fileName: string, minChar: number, limChar: number, kind: string, name: string, containerKind: string, containerName: string);
    }
    class TypeInfo {
        public memberName: TypeScript.MemberName;
        public docComment: string;
        public fullSymbolName: string;
        public kind: string;
        public minChar: number;
        public limChar: number;
        constructor(memberName: TypeScript.MemberName, docComment: string, fullSymbolName: string, kind: string, minChar: number, limChar: number);
    }
    class SpanInfo {
        public minChar: number;
        public limChar: number;
        public text: string;
        constructor(minChar: number, limChar: number, text?: string);
    }
    class SignatureInfo {
        public actual: ActualSignatureInfo;
        public formal: FormalSignatureItemInfo[];
        public activeFormal: number;
    }
    class FormalSignatureItemInfo {
        public signatureInfo: string;
        public typeParameters: FormalTypeParameterInfo[];
        public parameters: FormalParameterInfo[];
        public docComment: string;
    }
    class FormalTypeParameterInfo {
        public name: string;
        public docComment: string;
        public minChar: number;
        public limChar: number;
    }
    class FormalParameterInfo {
        public name: string;
        public isVariable: boolean;
        public docComment: string;
        public minChar: number;
        public limChar: number;
    }
    class ActualSignatureInfo {
        public parameterMinChar: number;
        public parameterLimChar: number;
        public currentParameterIsTypeParameter: boolean;
        public currentParameter: number;
    }
    class CompletionInfo {
        public maybeInaccurate: boolean;
        public isMemberCompletion: boolean;
        public entries: CompletionEntry[];
    }
    interface CompletionEntry {
        name: string;
        kind: string;
        kindModifiers: string;
    }
    interface CompletionEntryDetails {
        name: string;
        kind: string;
        kindModifiers: string;
        type: string;
        fullSymbolName: string;
        docComment: string;
    }
    class ScriptElementKind {
        static unknown: string;
        static keyword: string;
        static scriptElement: string;
        static moduleElement: string;
        static classElement: string;
        static interfaceElement: string;
        static enumElement: string;
        static variableElement: string;
        static localVariableElement: string;
        static functionElement: string;
        static localFunctionElement: string;
        static memberFunctionElement: string;
        static memberGetAccessorElement: string;
        static memberSetAccessorElement: string;
        static memberVariableElement: string;
        static constructorImplementationElement: string;
        static callSignatureElement: string;
        static indexSignatureElement: string;
        static constructSignatureElement: string;
        static parameterElement: string;
        static typeParameterElement: string;
        static primitiveType: string;
    }
    class ScriptElementKindModifier {
        static none: string;
        static publicMemberModifier: string;
        static privateMemberModifier: string;
        static exportedModifier: string;
        static ambientModifier: string;
        static staticModifier: string;
    }
    class MatchKind {
        static none: string;
        static exact: string;
        static subString: string;
        static prefix: string;
    }
    class DiagnosticCategory {
        static none: string;
        static error: string;
        static warning: string;
        static message: string;
    }
}
declare module Lint {
    class LanguageServiceHost extends TypeScript.NullLogger implements TypeScript.Services.ILanguageServiceHost {
        private syntaxTree;
        private source;
        constructor(syntaxTree: TypeScript.SyntaxTree, source: string);
        public getCompilationSettings(): TypeScript.CompilationSettings;
        public getScriptFileNames(): string[];
        public getScriptVersion(fileName: string): number;
        public getScriptIsOpen(fileName: string): boolean;
        public getScriptByteOrderMark(fileName: string): TypeScript.ByteOrderMark;
        public getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot;
        public getDiagnosticsObject(): LanguageServicesDiagnostics;
        public getLocalizedDiagnosticMessages(): string;
        public resolveRelativePath(path: string, directory: string): string;
        public fileExists(path: string): boolean;
        public directoryExists(path: string): boolean;
        public getParentDirectory(path: string): string;
    }
    class LanguageServicesDiagnostics implements TypeScript.Services.ILanguageServicesDiagnostics {
        public log(content: string): void;
    }
}
declare module Lint {
    function getSyntaxTree(fileName: string, source: string): TypeScript.SyntaxTree;
    function createCompilationSettings(): TypeScript.CompilationSettings;
    function doesIntersect(failure: RuleFailure, disabledIntervals: IDisabledInterval[]): boolean;
}
declare module Lint.Formatters {
    class AbstractFormatter implements Lint.Formatter {
        public format(failures: Lint.RuleFailure[]): string;
    }
}
declare module Lint.Rules {
    class AbstractRule implements Lint.Rule {
        private value;
        private options;
        constructor(ruleName: string, value: any, disabledIntervals: Lint.IDisabledInterval[]);
        public getOptions(): Lint.IOptions;
        public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[];
        public applyWithWalker(walker: Lint.RuleWalker): Lint.RuleFailure[];
        public isEnabled(): boolean;
    }
}
declare module Lint {
    class ScopeAwareRuleWalker<T> extends Lint.RuleWalker {
        private scopeStack;
        constructor(syntaxTree: TypeScript.SyntaxTree, options?: any);
        public visitNode(node: TypeScript.SyntaxNode): void;
        public createScope(): T;
        public getCurrentScope(): T;
        public getCurrentDepth(): number;
        public onScopeStart(): void;
        public onScopeEnd(): void;
        private isScopeBoundary(node);
    }
}
declare module Lint {
    interface RuleWalkerState {
        position: number;
        token: TypeScript.ISyntaxToken;
    }
    class StateAwareRuleWalker extends Lint.RuleWalker {
        private lastState;
        public visitToken(token: TypeScript.ISyntaxToken): void;
        public getLastState(): RuleWalkerState;
    }
}
declare module Lint {
    interface LintResult {
        failureCount: number;
        format: string;
        output: string;
    }
    class Linter {
        private fileName;
        private source;
        private options;
        static VERSION: string;
        constructor(fileName: string, source: string, options: any);
        public lint(): LintResult;
        private getRelativePath(directory);
        private containsRule(rules, rule);
    }
}
