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
        constructor(fileName: string, lineMap: LineMap, start: number, length: number, diagnosticKey: string, arguments?: any[]);
        toJSON(key: any): any;
        fileName(): string;
        line(): number;
        character(): number;
        start(): number;
        length(): number;
        diagnosticKey(): string;
        arguments(): any[];
        text(): string;
        message(): string;
        additionalLocations(): Location[];
        static equals(diagnostic1: Diagnostic, diagnostic2: Diagnostic): boolean;
        info(): DiagnosticInfo;
    }
    function newLine(): string;
    function getLocalizedText(diagnosticKey: string, args: any[]): string;
    function getDiagnosticMessage(diagnosticKey: string, args: any[]): string;
}
declare module TypeScript {
    interface DiagnosticInfo {
        category: DiagnosticCategory;
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
        set(key: TKey, value: TValue): void;
        add(key: TKey, value: TValue): void;
        containsKey(key: TKey): boolean;
        get(key: TKey): TValue;
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
    atEnd(): boolean;
    moveNext(): boolean;
    item(): any;
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
declare var Buffer: new (str: string, encoding?: string) => any;
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
        contents: string;
        byteOrderMark: ByteOrderMark;
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
        toJSON(key: any): {
            lineStarts: number[];
            length: number;
        };
        equals(other: LineMap): boolean;
        lineStarts(): number[];
        lineCount(): number;
        getPosition(line: number, character: number): number;
        getLineNumberFromPosition(position: number): number;
        getLineStartPosition(lineNumber: number): number;
        fillLineAndCharacterFromPosition(position: number, lineAndCharacter: ILineAndCharacter): void;
        getLineAndCharacterFromPosition(position: number): LineAndCharacter;
    }
}
declare module TypeScript {
    class LineAndCharacter {
        private _line;
        private _character;
        constructor(line: number, character: number);
        line(): number;
        character(): number;
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
        addCharArray(key: number[], start: number, len: number): string;
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
        startTime: number;
        time: number;
        start(): void;
        end(): void;
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
        getTextChangeRangeSinceVersion(scriptVersion: number): TextChangeRange;
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
        subText(span: TextSpan): ISimpleText;
        charCodeAt(index: number): number;
        lineMap(): LineMap;
    }
    interface IText extends ISimpleText {
        lineCount(): number;
        lines(): ITextLine[];
        charCodeAt(position: number): number;
        getLineFromLineNumber(lineNumber: number): ITextLine;
        getLineFromPosition(position: number): ITextLine;
        getLineNumberFromPosition(position: number): number;
        getLinePosition(position: number): LineAndCharacter;
        toString(span?: TextSpan): string;
    }
}
declare module TypeScript {
    interface ITextLine {
        start(): number;
        end(): number;
        endIncludingLineBreak(): number;
        extent(): TextSpan;
        extentIncludingLineBreak(): TextSpan;
        toString(): string;
        lineNumber(): number;
    }
}
declare module TypeScript {
    module LineMap1 {
        function fromSimpleText(text: ISimpleText): LineMap;
        function fromScriptSnapshot(scriptSnapshot: IScriptSnapshot): LineMap;
        function fromString(text: string): LineMap;
    }
}
declare module TypeScript.TextFactory {
    function createText(value: string): IText;
}
declare module TypeScript.SimpleText {
    function fromString(value: string): ISimpleText;
    function fromScriptSnapshot(scriptSnapshot: IScriptSnapshot): ISimpleText;
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
        start(): number;
        length(): number;
        end(): number;
        isEmpty(): boolean;
        containsPosition(position: number): boolean;
        containsTextSpan(span: TextSpan): boolean;
        overlapsWith(span: TextSpan): boolean;
        overlap(span: TextSpan): TextSpan;
        intersectsWithTextSpan(span: TextSpan): boolean;
        intersectsWith(start: number, length: number): boolean;
        intersectsWithPosition(position: number): boolean;
        intersection(span: TextSpan): TextSpan;
        static fromBounds(start: number, end: number): TextSpan;
    }
}
declare module TypeScript {
    class TextChangeRange {
        static unchanged: TextChangeRange;
        private _span;
        private _newLength;
        constructor(span: TextSpan, newLength: number);
        span(): TextSpan;
        newLength(): number;
        newSpan(): TextSpan;
        isUnchanged(): boolean;
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
    useTabs: boolean;
    spacesPerTab: number;
    indentSpaces: number;
    newLineCharacter: string;
    constructor(useTabs: boolean, spacesPerTab: number, indentSpaces: number, newLineCharacter: string);
    static defaultOptions: FormattingOptions;
}
declare module TypeScript.Indentation {
    function columnForEndOfToken(token: ISyntaxToken, syntaxInformationMap: SyntaxInformationMap, options: FormattingOptions): number;
    function columnForStartOfToken(token: ISyntaxToken, syntaxInformationMap: SyntaxInformationMap, options: FormattingOptions): number;
    function columnForStartOfFirstTokenInLineContainingToken(token: ISyntaxToken, syntaxInformationMap: SyntaxInformationMap, options: FormattingOptions): number;
    function columnForPositionInString(input: string, position: number, options: FormattingOptions): number;
    function indentationString(column: number, options: FormattingOptions): string;
    function indentationTrivia(column: number, options: FormattingOptions): ISyntaxTrivia;
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
        constructor(languageVersion: LanguageVersion, allowAutomaticSemicolonInsertion: boolean);
        toJSON(key: any): {
            allowAutomaticSemicolonInsertion: boolean;
        };
        languageVersion(): LanguageVersion;
        allowAutomaticSemicolonInsertion(): boolean;
    }
}
declare module TypeScript {
    class PositionedElement {
        private _parent;
        private _element;
        private _fullStart;
        constructor(parent: PositionedElement, element: ISyntaxElement, fullStart: number);
        static create(parent: PositionedElement, element: ISyntaxElement, fullStart: number): PositionedElement;
        parent(): PositionedElement;
        parentElement(): ISyntaxElement;
        element(): ISyntaxElement;
        kind(): SyntaxKind;
        childIndex(child: ISyntaxElement): number;
        childCount(): number;
        childAt(index: number): PositionedElement;
        childStart(child: ISyntaxElement): number;
        childEnd(child: ISyntaxElement): number;
        childStartAt(index: number): number;
        childEndAt(index: number): number;
        getPositionedChild(child: ISyntaxElement): PositionedElement;
        fullStart(): number;
        fullEnd(): number;
        fullWidth(): number;
        start(): number;
        end(): number;
        root(): PositionedNode;
        containingNode(): PositionedNode;
    }
    class PositionedNodeOrToken extends PositionedElement {
        constructor(parent: PositionedElement, nodeOrToken: ISyntaxNodeOrToken, fullStart: number);
        nodeOrToken(): ISyntaxNodeOrToken;
    }
    class PositionedNode extends PositionedNodeOrToken {
        constructor(parent: PositionedElement, node: SyntaxNode, fullStart: number);
        node(): SyntaxNode;
    }
    class PositionedToken extends PositionedNodeOrToken {
        constructor(parent: PositionedElement, token: ISyntaxToken, fullStart: number);
        token(): ISyntaxToken;
        previousToken(includeSkippedTokens?: boolean): PositionedToken;
        nextToken(includeSkippedTokens?: boolean): PositionedToken;
    }
    class PositionedList extends PositionedElement {
        constructor(parent: PositionedElement, list: ISyntaxList, fullStart: number);
        list(): ISyntaxList;
    }
    class PositionedSeparatedList extends PositionedElement {
        constructor(parent: PositionedElement, list: ISeparatedSyntaxList, fullStart: number);
        list(): ISeparatedSyntaxList;
    }
    class PositionedSkippedToken extends PositionedToken {
        private _parentToken;
        constructor(parentToken: PositionedToken, token: ISyntaxToken, fullStart: number);
        parentToken(): PositionedToken;
        previousToken(includeSkippedTokens?: boolean): PositionedToken;
        nextToken(includeSkippedTokens?: boolean): PositionedToken;
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
    function getTokenKind(text: string): SyntaxKind;
    function getText(kind: SyntaxKind): string;
    function isTokenKind(kind: SyntaxKind): boolean;
    function isAnyKeyword(kind: SyntaxKind): boolean;
    function isStandardKeyword(kind: SyntaxKind): boolean;
    function isFutureReservedKeyword(kind: SyntaxKind): boolean;
    function isFutureReservedStrictKeyword(kind: SyntaxKind): boolean;
    function isAnyPunctuation(kind: SyntaxKind): boolean;
    function isPrefixUnaryExpressionOperatorToken(tokenKind: SyntaxKind): boolean;
    function isBinaryExpressionOperatorToken(tokenKind: SyntaxKind): boolean;
    function getPrefixUnaryExpressionFromOperatorToken(tokenKind: SyntaxKind): SyntaxKind;
    function getPostfixUnaryExpressionFromOperatorToken(tokenKind: SyntaxKind): SyntaxKind;
    function getBinaryExpressionFromOperatorToken(tokenKind: SyntaxKind): SyntaxKind;
    function getOperatorTokenFromBinaryExpression(tokenKind: SyntaxKind): SyntaxKind;
    function isAnyDivideToken(kind: SyntaxKind): boolean;
    function isAnyDivideOrRegularExpressionToken(kind: SyntaxKind): boolean;
}
declare module TypeScript {
    class Scanner implements ISlidingWindowSource {
        private slidingWindow;
        private fileName;
        private text;
        private _languageVersion;
        constructor(fileName: string, text: ISimpleText, languageVersion: LanguageVersion, window?: number[]);
        languageVersion(): LanguageVersion;
        fetchMoreItems(argument: any, sourceIndex: number, window: number[], destinationIndex: number, spaceAvailable: number): number;
        private currentCharCode();
        absoluteIndex(): number;
        setAbsoluteIndex(index: number): void;
        scan(diagnostics: Diagnostic[], allowRegularExpression: boolean): ISyntaxToken;
        private createToken(fullStart, leadingTriviaInfo, start, kind, end, trailingTriviaInfo, isVariableWidthKeyword);
        private static triviaWindow;
        static scanTrivia(text: ISimpleText, start: number, length: number, isTrailing: boolean): ISyntaxTriviaList;
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
        substring(start: number, end: number, intern: boolean): string;
        private createIllegalEscapeDiagnostic(start, end);
        static isValidIdentifier(text: ISimpleText, languageVersion: LanguageVersion): boolean;
    }
}
declare module TypeScript {
    class ScannerUtilities {
        static identifierKind(array: number[], startIndex: number, length: number): SyntaxKind;
    }
}
declare module TypeScript {
    interface ISeparatedSyntaxList extends ISyntaxElement {
        childAt(index: number): ISyntaxNodeOrToken;
        toArray(): ISyntaxNodeOrToken[];
        toNonSeparatorArray(): ISyntaxNodeOrToken[];
        separatorCount(): number;
        separatorAt(index: number): ISyntaxToken;
        nonSeparatorCount(): number;
        nonSeparatorAt(index: number): ISyntaxNodeOrToken;
        insertChildrenInto(array: ISyntaxElement[], index: number): void;
    }
}
declare module TypeScript.Syntax {
    var emptySeparatedList: ISeparatedSyntaxList;
    function separatedList(nodes: ISyntaxNodeOrToken[]): ISeparatedSyntaxList;
}
declare module TypeScript {
    interface ISlidingWindowSource {
        fetchMoreItems(argument: any, sourceIndex: number, window: any[], destinationIndex: number, spaceAvailable: number): number;
    }
    class SlidingWindow {
        private source;
        window: any[];
        private defaultValue;
        private sourceLength;
        windowCount: number;
        windowAbsoluteStartIndex: number;
        currentRelativeItemIndex: number;
        private _pinCount;
        private firstPinnedAbsoluteIndex;
        constructor(source: ISlidingWindowSource, window: any[], defaultValue: any, sourceLength?: number);
        private windowAbsoluteEndIndex();
        private addMoreItemsToWindow(argument);
        private tryShiftOrGrowWindow();
        absoluteIndex(): number;
        isAtEndOfSource(): boolean;
        getAndPinAbsoluteIndex(): number;
        releaseAndUnpinAbsoluteIndex(absoluteIndex: number): void;
        rewindToPinnedIndex(absoluteIndex: number): void;
        currentItem(argument: any): any;
        peekItemN(n: number): any;
        moveToNextItem(): void;
        disgardAllItemsFromCurrentIndexOnwards(): void;
        setAbsoluteIndex(absoluteIndex: number): void;
        pinCount(): number;
    }
}
declare module TypeScript {
}
declare module TypeScript.Syntax {
    function emptySourceUnit(): SourceUnitSyntax;
    function getStandaloneExpression(positionedToken: PositionedToken): PositionedNodeOrToken;
    function isInModuleOrTypeContext(positionedToken: PositionedToken): boolean;
    function isInTypeOnlyContext(positionedToken: PositionedToken): boolean;
    function childOffset(parent: ISyntaxElement, child: ISyntaxElement): number;
    function childOffsetAt(parent: ISyntaxElement, index: number): number;
    function childIndex(parent: ISyntaxElement, child: ISyntaxElement): number;
    function nodeStructuralEquals(node1: SyntaxNode, node2: SyntaxNode): boolean;
    function nodeOrTokenStructuralEquals(node1: ISyntaxNodeOrToken, node2: ISyntaxNodeOrToken): boolean;
    function tokenStructuralEquals(token1: ISyntaxToken, token2: ISyntaxToken): boolean;
    function triviaListStructuralEquals(triviaList1: ISyntaxTriviaList, triviaList2: ISyntaxTriviaList): boolean;
    function triviaStructuralEquals(trivia1: ISyntaxTrivia, trivia2: ISyntaxTrivia): boolean;
    function listStructuralEquals(list1: ISyntaxList, list2: ISyntaxList): boolean;
    function separatedListStructuralEquals(list1: ISeparatedSyntaxList, list2: ISeparatedSyntaxList): boolean;
    function elementStructuralEquals(element1: ISyntaxElement, element2: ISyntaxElement): boolean;
    function identifierName(text: string, info?: ITokenInfo): ISyntaxToken;
    function trueExpression(): IUnaryExpressionSyntax;
    function falseExpression(): IUnaryExpressionSyntax;
    function numericLiteralExpression(text: string): IUnaryExpressionSyntax;
    function stringLiteralExpression(text: string): IUnaryExpressionSyntax;
    function isSuperInvocationExpression(node: IExpressionSyntax): boolean;
    function isSuperInvocationExpressionStatement(node: SyntaxNode): boolean;
    function isSuperMemberAccessExpression(node: IExpressionSyntax): boolean;
    function isSuperMemberAccessInvocationExpression(node: SyntaxNode): boolean;
    function assignmentExpression(left: IExpressionSyntax, token: ISyntaxToken, right: IExpressionSyntax): BinaryExpressionSyntax;
    function nodeHasSkippedOrMissingTokens(node: SyntaxNode): boolean;
    function isUnterminatedStringLiteral(token: ISyntaxToken): boolean;
    function isUnterminatedMultilineCommentTrivia(trivia: ISyntaxTrivia): boolean;
    function isEntirelyInsideCommentTrivia(trivia: ISyntaxTrivia, fullStart: number, position: number): boolean;
    function isEntirelyInsideComment(sourceUnit: SourceUnitSyntax, position: number): boolean;
    function isEntirelyInStringOrRegularExpressionLiteral(sourceUnit: SourceUnitSyntax, position: number): boolean;
    function findSkippedTokenInLeadingTriviaList(positionedToken: PositionedToken, position: number): PositionedSkippedToken;
    function findSkippedTokenInTrailingTriviaList(positionedToken: PositionedToken, position: number): PositionedSkippedToken;
    function findSkippedTokenInPositionedToken(positionedToken: PositionedToken, position: number): PositionedSkippedToken;
    function findSkippedTokenOnLeft(positionedToken: PositionedToken, position: number): PositionedSkippedToken;
    function getAncestorOfKind(positionedToken: PositionedElement, kind: SyntaxKind): PositionedElement;
    function hasAncestorOfKind(positionedToken: PositionedElement, kind: SyntaxKind): boolean;
    function isIntegerLiteral(expression: IExpressionSyntax): boolean;
}
declare module TypeScript {
    interface ISyntaxElement {
        kind(): SyntaxKind;
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
        leadingTrivia(): ISyntaxTriviaList;
        trailingTrivia(): ISyntaxTriviaList;
        leadingTriviaWidth(): number;
        trailingTriviaWidth(): number;
        firstToken(): ISyntaxToken;
        lastToken(): ISyntaxToken;
        collectTextElements(elements: string[]): void;
    }
    interface ISyntaxNode extends ISyntaxNodeOrToken {
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
        statements: ISyntaxList;
    }
    interface IExpressionSyntax extends ISyntaxNodeOrToken {
        isExpression(): boolean;
        withLeadingTrivia(trivia: ISyntaxTriviaList): IExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): IExpressionSyntax;
    }
    interface IUnaryExpressionSyntax extends IExpressionSyntax {
        isUnaryExpression(): boolean;
    }
    interface IArrowFunctionExpressionSyntax extends IUnaryExpressionSyntax {
        isArrowFunctionExpression(): boolean;
        equalsGreaterThanToken: ISyntaxToken;
        block: BlockSyntax;
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
    interface ITypeSyntax extends ISyntaxNodeOrToken {
    }
    interface INameSyntax extends ITypeSyntax {
    }
}
declare module TypeScript.Syntax {
    interface IFactory {
        sourceUnit(moduleElements: ISyntaxList, endOfFileToken: ISyntaxToken): SourceUnitSyntax;
        externalModuleReference(requireKeyword: ISyntaxToken, openParenToken: ISyntaxToken, stringLiteral: ISyntaxToken, closeParenToken: ISyntaxToken): ExternalModuleReferenceSyntax;
        moduleNameModuleReference(moduleName: INameSyntax): ModuleNameModuleReferenceSyntax;
        importDeclaration(modifiers: ISyntaxList, importKeyword: ISyntaxToken, identifier: ISyntaxToken, equalsToken: ISyntaxToken, moduleReference: IModuleReferenceSyntax, semicolonToken: ISyntaxToken): ImportDeclarationSyntax;
        exportAssignment(exportKeyword: ISyntaxToken, equalsToken: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): ExportAssignmentSyntax;
        classDeclaration(modifiers: ISyntaxList, classKeyword: ISyntaxToken, identifier: ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: ISyntaxList, openBraceToken: ISyntaxToken, classElements: ISyntaxList, closeBraceToken: ISyntaxToken): ClassDeclarationSyntax;
        interfaceDeclaration(modifiers: ISyntaxList, interfaceKeyword: ISyntaxToken, identifier: ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: ISyntaxList, body: ObjectTypeSyntax): InterfaceDeclarationSyntax;
        heritageClause(kind: SyntaxKind, extendsOrImplementsKeyword: ISyntaxToken, typeNames: ISeparatedSyntaxList): HeritageClauseSyntax;
        moduleDeclaration(modifiers: ISyntaxList, moduleKeyword: ISyntaxToken, name: INameSyntax, stringLiteral: ISyntaxToken, openBraceToken: ISyntaxToken, moduleElements: ISyntaxList, closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax;
        functionDeclaration(modifiers: ISyntaxList, functionKeyword: ISyntaxToken, identifier: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): FunctionDeclarationSyntax;
        variableStatement(modifiers: ISyntaxList, variableDeclaration: VariableDeclarationSyntax, semicolonToken: ISyntaxToken): VariableStatementSyntax;
        variableDeclaration(varKeyword: ISyntaxToken, variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax;
        variableDeclarator(propertyName: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax;
        equalsValueClause(equalsToken: ISyntaxToken, value: IExpressionSyntax): EqualsValueClauseSyntax;
        prefixUnaryExpression(kind: SyntaxKind, operatorToken: ISyntaxToken, operand: IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax;
        arrayLiteralExpression(openBracketToken: ISyntaxToken, expressions: ISeparatedSyntaxList, closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax;
        omittedExpression(): OmittedExpressionSyntax;
        parenthesizedExpression(openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken): ParenthesizedExpressionSyntax;
        simpleArrowFunctionExpression(identifier: ISyntaxToken, equalsGreaterThanToken: ISyntaxToken, block: BlockSyntax, expression: IExpressionSyntax): SimpleArrowFunctionExpressionSyntax;
        parenthesizedArrowFunctionExpression(callSignature: CallSignatureSyntax, equalsGreaterThanToken: ISyntaxToken, block: BlockSyntax, expression: IExpressionSyntax): ParenthesizedArrowFunctionExpressionSyntax;
        qualifiedName(left: INameSyntax, dotToken: ISyntaxToken, right: ISyntaxToken): QualifiedNameSyntax;
        typeArgumentList(lessThanToken: ISyntaxToken, typeArguments: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeArgumentListSyntax;
        constructorType(newKeyword: ISyntaxToken, typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): ConstructorTypeSyntax;
        functionType(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): FunctionTypeSyntax;
        objectType(openBraceToken: ISyntaxToken, typeMembers: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectTypeSyntax;
        arrayType(type: ITypeSyntax, openBracketToken: ISyntaxToken, closeBracketToken: ISyntaxToken): ArrayTypeSyntax;
        genericType(name: INameSyntax, typeArgumentList: TypeArgumentListSyntax): GenericTypeSyntax;
        typeQuery(typeOfKeyword: ISyntaxToken, name: INameSyntax): TypeQuerySyntax;
        typeAnnotation(colonToken: ISyntaxToken, type: ITypeSyntax): TypeAnnotationSyntax;
        block(openBraceToken: ISyntaxToken, statements: ISyntaxList, closeBraceToken: ISyntaxToken): BlockSyntax;
        parameter(dotDotDotToken: ISyntaxToken, modifiers: ISyntaxList, identifier: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax;
        memberAccessExpression(expression: IExpressionSyntax, dotToken: ISyntaxToken, name: ISyntaxToken): MemberAccessExpressionSyntax;
        postfixUnaryExpression(kind: SyntaxKind, operand: IMemberExpressionSyntax, operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax;
        elementAccessExpression(expression: IExpressionSyntax, openBracketToken: ISyntaxToken, argumentExpression: IExpressionSyntax, closeBracketToken: ISyntaxToken): ElementAccessExpressionSyntax;
        invocationExpression(expression: IMemberExpressionSyntax, argumentList: ArgumentListSyntax): InvocationExpressionSyntax;
        argumentList(typeArgumentList: TypeArgumentListSyntax, openParenToken: ISyntaxToken, arguments: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ArgumentListSyntax;
        binaryExpression(kind: SyntaxKind, left: IExpressionSyntax, operatorToken: ISyntaxToken, right: IExpressionSyntax): BinaryExpressionSyntax;
        conditionalExpression(condition: IExpressionSyntax, questionToken: ISyntaxToken, whenTrue: IExpressionSyntax, colonToken: ISyntaxToken, whenFalse: IExpressionSyntax): ConditionalExpressionSyntax;
        constructSignature(newKeyword: ISyntaxToken, callSignature: CallSignatureSyntax): ConstructSignatureSyntax;
        methodSignature(propertyName: ISyntaxToken, questionToken: ISyntaxToken, callSignature: CallSignatureSyntax): MethodSignatureSyntax;
        indexSignature(openBracketToken: ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax;
        propertySignature(propertyName: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax;
        callSignature(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax;
        parameterList(openParenToken: ISyntaxToken, parameters: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ParameterListSyntax;
        typeParameterList(lessThanToken: ISyntaxToken, typeParameters: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeParameterListSyntax;
        typeParameter(identifier: ISyntaxToken, constraint: ConstraintSyntax): TypeParameterSyntax;
        constraint(extendsKeyword: ISyntaxToken, type: ITypeSyntax): ConstraintSyntax;
        elseClause(elseKeyword: ISyntaxToken, statement: IStatementSyntax): ElseClauseSyntax;
        ifStatement(ifKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax, elseClause: ElseClauseSyntax): IfStatementSyntax;
        expressionStatement(expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ExpressionStatementSyntax;
        constructorDeclaration(modifiers: ISyntaxList, constructorKeyword: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): ConstructorDeclarationSyntax;
        memberFunctionDeclaration(modifiers: ISyntaxList, propertyName: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): MemberFunctionDeclarationSyntax;
        getAccessor(modifiers: ISyntaxList, getKeyword: ISyntaxToken, propertyName: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, block: BlockSyntax): GetAccessorSyntax;
        setAccessor(modifiers: ISyntaxList, setKeyword: ISyntaxToken, propertyName: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): SetAccessorSyntax;
        memberVariableDeclaration(modifiers: ISyntaxList, variableDeclarator: VariableDeclaratorSyntax, semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax;
        indexMemberDeclaration(modifiers: ISyntaxList, indexSignature: IndexSignatureSyntax, semicolonToken: ISyntaxToken): IndexMemberDeclarationSyntax;
        throwStatement(throwKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ThrowStatementSyntax;
        returnStatement(returnKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ReturnStatementSyntax;
        objectCreationExpression(newKeyword: ISyntaxToken, expression: IMemberExpressionSyntax, argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax;
        switchStatement(switchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, openBraceToken: ISyntaxToken, switchClauses: ISyntaxList, closeBraceToken: ISyntaxToken): SwitchStatementSyntax;
        caseSwitchClause(caseKeyword: ISyntaxToken, expression: IExpressionSyntax, colonToken: ISyntaxToken, statements: ISyntaxList): CaseSwitchClauseSyntax;
        defaultSwitchClause(defaultKeyword: ISyntaxToken, colonToken: ISyntaxToken, statements: ISyntaxList): DefaultSwitchClauseSyntax;
        breakStatement(breakKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): BreakStatementSyntax;
        continueStatement(continueKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): ContinueStatementSyntax;
        forStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, initializer: IExpressionSyntax, firstSemicolonToken: ISyntaxToken, condition: IExpressionSyntax, secondSemicolonToken: ISyntaxToken, incrementor: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForStatementSyntax;
        forInStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, left: IExpressionSyntax, inKeyword: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForInStatementSyntax;
        whileStatement(whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WhileStatementSyntax;
        withStatement(withKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WithStatementSyntax;
        enumDeclaration(modifiers: ISyntaxList, enumKeyword: ISyntaxToken, identifier: ISyntaxToken, openBraceToken: ISyntaxToken, enumElements: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): EnumDeclarationSyntax;
        enumElement(propertyName: ISyntaxToken, equalsValueClause: EqualsValueClauseSyntax): EnumElementSyntax;
        castExpression(lessThanToken: ISyntaxToken, type: ITypeSyntax, greaterThanToken: ISyntaxToken, expression: IUnaryExpressionSyntax): CastExpressionSyntax;
        objectLiteralExpression(openBraceToken: ISyntaxToken, propertyAssignments: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax;
        simplePropertyAssignment(propertyName: ISyntaxToken, colonToken: ISyntaxToken, expression: IExpressionSyntax): SimplePropertyAssignmentSyntax;
        functionPropertyAssignment(propertyName: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionPropertyAssignmentSyntax;
        functionExpression(functionKeyword: ISyntaxToken, identifier: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionExpressionSyntax;
        emptyStatement(semicolonToken: ISyntaxToken): EmptyStatementSyntax;
        tryStatement(tryKeyword: ISyntaxToken, block: BlockSyntax, catchClause: CatchClauseSyntax, finallyClause: FinallyClauseSyntax): TryStatementSyntax;
        catchClause(catchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, identifier: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, closeParenToken: ISyntaxToken, block: BlockSyntax): CatchClauseSyntax;
        finallyClause(finallyKeyword: ISyntaxToken, block: BlockSyntax): FinallyClauseSyntax;
        labeledStatement(identifier: ISyntaxToken, colonToken: ISyntaxToken, statement: IStatementSyntax): LabeledStatementSyntax;
        doStatement(doKeyword: ISyntaxToken, statement: IStatementSyntax, whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, semicolonToken: ISyntaxToken): DoStatementSyntax;
        typeOfExpression(typeOfKeyword: ISyntaxToken, expression: IUnaryExpressionSyntax): TypeOfExpressionSyntax;
        deleteExpression(deleteKeyword: ISyntaxToken, expression: IUnaryExpressionSyntax): DeleteExpressionSyntax;
        voidExpression(voidKeyword: ISyntaxToken, expression: IUnaryExpressionSyntax): VoidExpressionSyntax;
        debuggerStatement(debuggerKeyword: ISyntaxToken, semicolonToken: ISyntaxToken): DebuggerStatementSyntax;
    }
    class NormalModeFactory implements IFactory {
        sourceUnit(moduleElements: ISyntaxList, endOfFileToken: ISyntaxToken): SourceUnitSyntax;
        externalModuleReference(requireKeyword: ISyntaxToken, openParenToken: ISyntaxToken, stringLiteral: ISyntaxToken, closeParenToken: ISyntaxToken): ExternalModuleReferenceSyntax;
        moduleNameModuleReference(moduleName: INameSyntax): ModuleNameModuleReferenceSyntax;
        importDeclaration(modifiers: ISyntaxList, importKeyword: ISyntaxToken, identifier: ISyntaxToken, equalsToken: ISyntaxToken, moduleReference: IModuleReferenceSyntax, semicolonToken: ISyntaxToken): ImportDeclarationSyntax;
        exportAssignment(exportKeyword: ISyntaxToken, equalsToken: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): ExportAssignmentSyntax;
        classDeclaration(modifiers: ISyntaxList, classKeyword: ISyntaxToken, identifier: ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: ISyntaxList, openBraceToken: ISyntaxToken, classElements: ISyntaxList, closeBraceToken: ISyntaxToken): ClassDeclarationSyntax;
        interfaceDeclaration(modifiers: ISyntaxList, interfaceKeyword: ISyntaxToken, identifier: ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: ISyntaxList, body: ObjectTypeSyntax): InterfaceDeclarationSyntax;
        heritageClause(kind: SyntaxKind, extendsOrImplementsKeyword: ISyntaxToken, typeNames: ISeparatedSyntaxList): HeritageClauseSyntax;
        moduleDeclaration(modifiers: ISyntaxList, moduleKeyword: ISyntaxToken, name: INameSyntax, stringLiteral: ISyntaxToken, openBraceToken: ISyntaxToken, moduleElements: ISyntaxList, closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax;
        functionDeclaration(modifiers: ISyntaxList, functionKeyword: ISyntaxToken, identifier: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): FunctionDeclarationSyntax;
        variableStatement(modifiers: ISyntaxList, variableDeclaration: VariableDeclarationSyntax, semicolonToken: ISyntaxToken): VariableStatementSyntax;
        variableDeclaration(varKeyword: ISyntaxToken, variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax;
        variableDeclarator(propertyName: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax;
        equalsValueClause(equalsToken: ISyntaxToken, value: IExpressionSyntax): EqualsValueClauseSyntax;
        prefixUnaryExpression(kind: SyntaxKind, operatorToken: ISyntaxToken, operand: IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax;
        arrayLiteralExpression(openBracketToken: ISyntaxToken, expressions: ISeparatedSyntaxList, closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax;
        omittedExpression(): OmittedExpressionSyntax;
        parenthesizedExpression(openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken): ParenthesizedExpressionSyntax;
        simpleArrowFunctionExpression(identifier: ISyntaxToken, equalsGreaterThanToken: ISyntaxToken, block: BlockSyntax, expression: IExpressionSyntax): SimpleArrowFunctionExpressionSyntax;
        parenthesizedArrowFunctionExpression(callSignature: CallSignatureSyntax, equalsGreaterThanToken: ISyntaxToken, block: BlockSyntax, expression: IExpressionSyntax): ParenthesizedArrowFunctionExpressionSyntax;
        qualifiedName(left: INameSyntax, dotToken: ISyntaxToken, right: ISyntaxToken): QualifiedNameSyntax;
        typeArgumentList(lessThanToken: ISyntaxToken, typeArguments: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeArgumentListSyntax;
        constructorType(newKeyword: ISyntaxToken, typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): ConstructorTypeSyntax;
        functionType(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): FunctionTypeSyntax;
        objectType(openBraceToken: ISyntaxToken, typeMembers: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectTypeSyntax;
        arrayType(type: ITypeSyntax, openBracketToken: ISyntaxToken, closeBracketToken: ISyntaxToken): ArrayTypeSyntax;
        genericType(name: INameSyntax, typeArgumentList: TypeArgumentListSyntax): GenericTypeSyntax;
        typeQuery(typeOfKeyword: ISyntaxToken, name: INameSyntax): TypeQuerySyntax;
        typeAnnotation(colonToken: ISyntaxToken, type: ITypeSyntax): TypeAnnotationSyntax;
        block(openBraceToken: ISyntaxToken, statements: ISyntaxList, closeBraceToken: ISyntaxToken): BlockSyntax;
        parameter(dotDotDotToken: ISyntaxToken, modifiers: ISyntaxList, identifier: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax;
        memberAccessExpression(expression: IExpressionSyntax, dotToken: ISyntaxToken, name: ISyntaxToken): MemberAccessExpressionSyntax;
        postfixUnaryExpression(kind: SyntaxKind, operand: IMemberExpressionSyntax, operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax;
        elementAccessExpression(expression: IExpressionSyntax, openBracketToken: ISyntaxToken, argumentExpression: IExpressionSyntax, closeBracketToken: ISyntaxToken): ElementAccessExpressionSyntax;
        invocationExpression(expression: IMemberExpressionSyntax, argumentList: ArgumentListSyntax): InvocationExpressionSyntax;
        argumentList(typeArgumentList: TypeArgumentListSyntax, openParenToken: ISyntaxToken, _arguments: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ArgumentListSyntax;
        binaryExpression(kind: SyntaxKind, left: IExpressionSyntax, operatorToken: ISyntaxToken, right: IExpressionSyntax): BinaryExpressionSyntax;
        conditionalExpression(condition: IExpressionSyntax, questionToken: ISyntaxToken, whenTrue: IExpressionSyntax, colonToken: ISyntaxToken, whenFalse: IExpressionSyntax): ConditionalExpressionSyntax;
        constructSignature(newKeyword: ISyntaxToken, callSignature: CallSignatureSyntax): ConstructSignatureSyntax;
        methodSignature(propertyName: ISyntaxToken, questionToken: ISyntaxToken, callSignature: CallSignatureSyntax): MethodSignatureSyntax;
        indexSignature(openBracketToken: ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax;
        propertySignature(propertyName: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax;
        callSignature(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax;
        parameterList(openParenToken: ISyntaxToken, parameters: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ParameterListSyntax;
        typeParameterList(lessThanToken: ISyntaxToken, typeParameters: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeParameterListSyntax;
        typeParameter(identifier: ISyntaxToken, constraint: ConstraintSyntax): TypeParameterSyntax;
        constraint(extendsKeyword: ISyntaxToken, type: ITypeSyntax): ConstraintSyntax;
        elseClause(elseKeyword: ISyntaxToken, statement: IStatementSyntax): ElseClauseSyntax;
        ifStatement(ifKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax, elseClause: ElseClauseSyntax): IfStatementSyntax;
        expressionStatement(expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ExpressionStatementSyntax;
        constructorDeclaration(modifiers: ISyntaxList, constructorKeyword: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): ConstructorDeclarationSyntax;
        memberFunctionDeclaration(modifiers: ISyntaxList, propertyName: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): MemberFunctionDeclarationSyntax;
        getAccessor(modifiers: ISyntaxList, getKeyword: ISyntaxToken, propertyName: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, block: BlockSyntax): GetAccessorSyntax;
        setAccessor(modifiers: ISyntaxList, setKeyword: ISyntaxToken, propertyName: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): SetAccessorSyntax;
        memberVariableDeclaration(modifiers: ISyntaxList, variableDeclarator: VariableDeclaratorSyntax, semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax;
        indexMemberDeclaration(modifiers: ISyntaxList, indexSignature: IndexSignatureSyntax, semicolonToken: ISyntaxToken): IndexMemberDeclarationSyntax;
        throwStatement(throwKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ThrowStatementSyntax;
        returnStatement(returnKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ReturnStatementSyntax;
        objectCreationExpression(newKeyword: ISyntaxToken, expression: IMemberExpressionSyntax, argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax;
        switchStatement(switchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, openBraceToken: ISyntaxToken, switchClauses: ISyntaxList, closeBraceToken: ISyntaxToken): SwitchStatementSyntax;
        caseSwitchClause(caseKeyword: ISyntaxToken, expression: IExpressionSyntax, colonToken: ISyntaxToken, statements: ISyntaxList): CaseSwitchClauseSyntax;
        defaultSwitchClause(defaultKeyword: ISyntaxToken, colonToken: ISyntaxToken, statements: ISyntaxList): DefaultSwitchClauseSyntax;
        breakStatement(breakKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): BreakStatementSyntax;
        continueStatement(continueKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): ContinueStatementSyntax;
        forStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, initializer: IExpressionSyntax, firstSemicolonToken: ISyntaxToken, condition: IExpressionSyntax, secondSemicolonToken: ISyntaxToken, incrementor: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForStatementSyntax;
        forInStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, left: IExpressionSyntax, inKeyword: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForInStatementSyntax;
        whileStatement(whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WhileStatementSyntax;
        withStatement(withKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WithStatementSyntax;
        enumDeclaration(modifiers: ISyntaxList, enumKeyword: ISyntaxToken, identifier: ISyntaxToken, openBraceToken: ISyntaxToken, enumElements: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): EnumDeclarationSyntax;
        enumElement(propertyName: ISyntaxToken, equalsValueClause: EqualsValueClauseSyntax): EnumElementSyntax;
        castExpression(lessThanToken: ISyntaxToken, type: ITypeSyntax, greaterThanToken: ISyntaxToken, expression: IUnaryExpressionSyntax): CastExpressionSyntax;
        objectLiteralExpression(openBraceToken: ISyntaxToken, propertyAssignments: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax;
        simplePropertyAssignment(propertyName: ISyntaxToken, colonToken: ISyntaxToken, expression: IExpressionSyntax): SimplePropertyAssignmentSyntax;
        functionPropertyAssignment(propertyName: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionPropertyAssignmentSyntax;
        functionExpression(functionKeyword: ISyntaxToken, identifier: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionExpressionSyntax;
        emptyStatement(semicolonToken: ISyntaxToken): EmptyStatementSyntax;
        tryStatement(tryKeyword: ISyntaxToken, block: BlockSyntax, catchClause: CatchClauseSyntax, finallyClause: FinallyClauseSyntax): TryStatementSyntax;
        catchClause(catchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, identifier: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, closeParenToken: ISyntaxToken, block: BlockSyntax): CatchClauseSyntax;
        finallyClause(finallyKeyword: ISyntaxToken, block: BlockSyntax): FinallyClauseSyntax;
        labeledStatement(identifier: ISyntaxToken, colonToken: ISyntaxToken, statement: IStatementSyntax): LabeledStatementSyntax;
        doStatement(doKeyword: ISyntaxToken, statement: IStatementSyntax, whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, semicolonToken: ISyntaxToken): DoStatementSyntax;
        typeOfExpression(typeOfKeyword: ISyntaxToken, expression: IUnaryExpressionSyntax): TypeOfExpressionSyntax;
        deleteExpression(deleteKeyword: ISyntaxToken, expression: IUnaryExpressionSyntax): DeleteExpressionSyntax;
        voidExpression(voidKeyword: ISyntaxToken, expression: IUnaryExpressionSyntax): VoidExpressionSyntax;
        debuggerStatement(debuggerKeyword: ISyntaxToken, semicolonToken: ISyntaxToken): DebuggerStatementSyntax;
    }
    class StrictModeFactory implements IFactory {
        sourceUnit(moduleElements: ISyntaxList, endOfFileToken: ISyntaxToken): SourceUnitSyntax;
        externalModuleReference(requireKeyword: ISyntaxToken, openParenToken: ISyntaxToken, stringLiteral: ISyntaxToken, closeParenToken: ISyntaxToken): ExternalModuleReferenceSyntax;
        moduleNameModuleReference(moduleName: INameSyntax): ModuleNameModuleReferenceSyntax;
        importDeclaration(modifiers: ISyntaxList, importKeyword: ISyntaxToken, identifier: ISyntaxToken, equalsToken: ISyntaxToken, moduleReference: IModuleReferenceSyntax, semicolonToken: ISyntaxToken): ImportDeclarationSyntax;
        exportAssignment(exportKeyword: ISyntaxToken, equalsToken: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): ExportAssignmentSyntax;
        classDeclaration(modifiers: ISyntaxList, classKeyword: ISyntaxToken, identifier: ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: ISyntaxList, openBraceToken: ISyntaxToken, classElements: ISyntaxList, closeBraceToken: ISyntaxToken): ClassDeclarationSyntax;
        interfaceDeclaration(modifiers: ISyntaxList, interfaceKeyword: ISyntaxToken, identifier: ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: ISyntaxList, body: ObjectTypeSyntax): InterfaceDeclarationSyntax;
        heritageClause(kind: SyntaxKind, extendsOrImplementsKeyword: ISyntaxToken, typeNames: ISeparatedSyntaxList): HeritageClauseSyntax;
        moduleDeclaration(modifiers: ISyntaxList, moduleKeyword: ISyntaxToken, name: INameSyntax, stringLiteral: ISyntaxToken, openBraceToken: ISyntaxToken, moduleElements: ISyntaxList, closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax;
        functionDeclaration(modifiers: ISyntaxList, functionKeyword: ISyntaxToken, identifier: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): FunctionDeclarationSyntax;
        variableStatement(modifiers: ISyntaxList, variableDeclaration: VariableDeclarationSyntax, semicolonToken: ISyntaxToken): VariableStatementSyntax;
        variableDeclaration(varKeyword: ISyntaxToken, variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax;
        variableDeclarator(propertyName: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax;
        equalsValueClause(equalsToken: ISyntaxToken, value: IExpressionSyntax): EqualsValueClauseSyntax;
        prefixUnaryExpression(kind: SyntaxKind, operatorToken: ISyntaxToken, operand: IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax;
        arrayLiteralExpression(openBracketToken: ISyntaxToken, expressions: ISeparatedSyntaxList, closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax;
        omittedExpression(): OmittedExpressionSyntax;
        parenthesizedExpression(openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken): ParenthesizedExpressionSyntax;
        simpleArrowFunctionExpression(identifier: ISyntaxToken, equalsGreaterThanToken: ISyntaxToken, block: BlockSyntax, expression: IExpressionSyntax): SimpleArrowFunctionExpressionSyntax;
        parenthesizedArrowFunctionExpression(callSignature: CallSignatureSyntax, equalsGreaterThanToken: ISyntaxToken, block: BlockSyntax, expression: IExpressionSyntax): ParenthesizedArrowFunctionExpressionSyntax;
        qualifiedName(left: INameSyntax, dotToken: ISyntaxToken, right: ISyntaxToken): QualifiedNameSyntax;
        typeArgumentList(lessThanToken: ISyntaxToken, typeArguments: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeArgumentListSyntax;
        constructorType(newKeyword: ISyntaxToken, typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): ConstructorTypeSyntax;
        functionType(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): FunctionTypeSyntax;
        objectType(openBraceToken: ISyntaxToken, typeMembers: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectTypeSyntax;
        arrayType(type: ITypeSyntax, openBracketToken: ISyntaxToken, closeBracketToken: ISyntaxToken): ArrayTypeSyntax;
        genericType(name: INameSyntax, typeArgumentList: TypeArgumentListSyntax): GenericTypeSyntax;
        typeQuery(typeOfKeyword: ISyntaxToken, name: INameSyntax): TypeQuerySyntax;
        typeAnnotation(colonToken: ISyntaxToken, type: ITypeSyntax): TypeAnnotationSyntax;
        block(openBraceToken: ISyntaxToken, statements: ISyntaxList, closeBraceToken: ISyntaxToken): BlockSyntax;
        parameter(dotDotDotToken: ISyntaxToken, modifiers: ISyntaxList, identifier: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax;
        memberAccessExpression(expression: IExpressionSyntax, dotToken: ISyntaxToken, name: ISyntaxToken): MemberAccessExpressionSyntax;
        postfixUnaryExpression(kind: SyntaxKind, operand: IMemberExpressionSyntax, operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax;
        elementAccessExpression(expression: IExpressionSyntax, openBracketToken: ISyntaxToken, argumentExpression: IExpressionSyntax, closeBracketToken: ISyntaxToken): ElementAccessExpressionSyntax;
        invocationExpression(expression: IMemberExpressionSyntax, argumentList: ArgumentListSyntax): InvocationExpressionSyntax;
        argumentList(typeArgumentList: TypeArgumentListSyntax, openParenToken: ISyntaxToken, _arguments: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ArgumentListSyntax;
        binaryExpression(kind: SyntaxKind, left: IExpressionSyntax, operatorToken: ISyntaxToken, right: IExpressionSyntax): BinaryExpressionSyntax;
        conditionalExpression(condition: IExpressionSyntax, questionToken: ISyntaxToken, whenTrue: IExpressionSyntax, colonToken: ISyntaxToken, whenFalse: IExpressionSyntax): ConditionalExpressionSyntax;
        constructSignature(newKeyword: ISyntaxToken, callSignature: CallSignatureSyntax): ConstructSignatureSyntax;
        methodSignature(propertyName: ISyntaxToken, questionToken: ISyntaxToken, callSignature: CallSignatureSyntax): MethodSignatureSyntax;
        indexSignature(openBracketToken: ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax;
        propertySignature(propertyName: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax;
        callSignature(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax;
        parameterList(openParenToken: ISyntaxToken, parameters: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ParameterListSyntax;
        typeParameterList(lessThanToken: ISyntaxToken, typeParameters: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeParameterListSyntax;
        typeParameter(identifier: ISyntaxToken, constraint: ConstraintSyntax): TypeParameterSyntax;
        constraint(extendsKeyword: ISyntaxToken, type: ITypeSyntax): ConstraintSyntax;
        elseClause(elseKeyword: ISyntaxToken, statement: IStatementSyntax): ElseClauseSyntax;
        ifStatement(ifKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax, elseClause: ElseClauseSyntax): IfStatementSyntax;
        expressionStatement(expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ExpressionStatementSyntax;
        constructorDeclaration(modifiers: ISyntaxList, constructorKeyword: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): ConstructorDeclarationSyntax;
        memberFunctionDeclaration(modifiers: ISyntaxList, propertyName: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): MemberFunctionDeclarationSyntax;
        getAccessor(modifiers: ISyntaxList, getKeyword: ISyntaxToken, propertyName: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, block: BlockSyntax): GetAccessorSyntax;
        setAccessor(modifiers: ISyntaxList, setKeyword: ISyntaxToken, propertyName: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): SetAccessorSyntax;
        memberVariableDeclaration(modifiers: ISyntaxList, variableDeclarator: VariableDeclaratorSyntax, semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax;
        indexMemberDeclaration(modifiers: ISyntaxList, indexSignature: IndexSignatureSyntax, semicolonToken: ISyntaxToken): IndexMemberDeclarationSyntax;
        throwStatement(throwKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ThrowStatementSyntax;
        returnStatement(returnKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ReturnStatementSyntax;
        objectCreationExpression(newKeyword: ISyntaxToken, expression: IMemberExpressionSyntax, argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax;
        switchStatement(switchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, openBraceToken: ISyntaxToken, switchClauses: ISyntaxList, closeBraceToken: ISyntaxToken): SwitchStatementSyntax;
        caseSwitchClause(caseKeyword: ISyntaxToken, expression: IExpressionSyntax, colonToken: ISyntaxToken, statements: ISyntaxList): CaseSwitchClauseSyntax;
        defaultSwitchClause(defaultKeyword: ISyntaxToken, colonToken: ISyntaxToken, statements: ISyntaxList): DefaultSwitchClauseSyntax;
        breakStatement(breakKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): BreakStatementSyntax;
        continueStatement(continueKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): ContinueStatementSyntax;
        forStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, initializer: IExpressionSyntax, firstSemicolonToken: ISyntaxToken, condition: IExpressionSyntax, secondSemicolonToken: ISyntaxToken, incrementor: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForStatementSyntax;
        forInStatement(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, left: IExpressionSyntax, inKeyword: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForInStatementSyntax;
        whileStatement(whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WhileStatementSyntax;
        withStatement(withKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WithStatementSyntax;
        enumDeclaration(modifiers: ISyntaxList, enumKeyword: ISyntaxToken, identifier: ISyntaxToken, openBraceToken: ISyntaxToken, enumElements: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): EnumDeclarationSyntax;
        enumElement(propertyName: ISyntaxToken, equalsValueClause: EqualsValueClauseSyntax): EnumElementSyntax;
        castExpression(lessThanToken: ISyntaxToken, type: ITypeSyntax, greaterThanToken: ISyntaxToken, expression: IUnaryExpressionSyntax): CastExpressionSyntax;
        objectLiteralExpression(openBraceToken: ISyntaxToken, propertyAssignments: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax;
        simplePropertyAssignment(propertyName: ISyntaxToken, colonToken: ISyntaxToken, expression: IExpressionSyntax): SimplePropertyAssignmentSyntax;
        functionPropertyAssignment(propertyName: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionPropertyAssignmentSyntax;
        functionExpression(functionKeyword: ISyntaxToken, identifier: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionExpressionSyntax;
        emptyStatement(semicolonToken: ISyntaxToken): EmptyStatementSyntax;
        tryStatement(tryKeyword: ISyntaxToken, block: BlockSyntax, catchClause: CatchClauseSyntax, finallyClause: FinallyClauseSyntax): TryStatementSyntax;
        catchClause(catchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, identifier: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, closeParenToken: ISyntaxToken, block: BlockSyntax): CatchClauseSyntax;
        finallyClause(finallyKeyword: ISyntaxToken, block: BlockSyntax): FinallyClauseSyntax;
        labeledStatement(identifier: ISyntaxToken, colonToken: ISyntaxToken, statement: IStatementSyntax): LabeledStatementSyntax;
        doStatement(doKeyword: ISyntaxToken, statement: IStatementSyntax, whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, semicolonToken: ISyntaxToken): DoStatementSyntax;
        typeOfExpression(typeOfKeyword: ISyntaxToken, expression: IUnaryExpressionSyntax): TypeOfExpressionSyntax;
        deleteExpression(deleteKeyword: ISyntaxToken, expression: IUnaryExpressionSyntax): DeleteExpressionSyntax;
        voidExpression(voidKeyword: ISyntaxToken, expression: IUnaryExpressionSyntax): VoidExpressionSyntax;
        debuggerStatement(debuggerKeyword: ISyntaxToken, semicolonToken: ISyntaxToken): DebuggerStatementSyntax;
    }
    var normalModeFactory: IFactory;
    var strictModeFactory: IFactory;
}
declare module TypeScript.SyntaxFacts {
    function isDirectivePrologueElement(node: ISyntaxNodeOrToken): boolean;
    function isUseStrictDirective(node: ISyntaxNodeOrToken): boolean;
    function isIdentifierNameOrAnyKeyword(token: ISyntaxToken): boolean;
}
declare module TypeScript {
    interface ISyntaxList extends ISyntaxElement {
        childAt(index: number): ISyntaxNodeOrToken;
        toArray(): ISyntaxNodeOrToken[];
        insertChildrenInto(array: ISyntaxElement[], index: number): void;
    }
}
declare module TypeScript.Syntax {
    class EmptySyntaxList implements ISyntaxList {
        kind(): SyntaxKind;
        isNode(): boolean;
        isToken(): boolean;
        isList(): boolean;
        isSeparatedList(): boolean;
        toJSON(key: any): any;
        childCount(): number;
        childAt(index: number): ISyntaxNodeOrToken;
        toArray(): ISyntaxNodeOrToken[];
        collectTextElements(elements: string[]): void;
        firstToken(): ISyntaxToken;
        lastToken(): ISyntaxToken;
        fullWidth(): number;
        width(): number;
        leadingTrivia(): ISyntaxTriviaList;
        trailingTrivia(): ISyntaxTriviaList;
        leadingTriviaWidth(): number;
        trailingTriviaWidth(): number;
        fullText(): string;
        isTypeScriptSpecific(): boolean;
        isIncrementallyUnusable(): boolean;
        findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken;
        insertChildrenInto(array: ISyntaxElement[], index: number): void;
    }
    var emptyList: ISyntaxList;
    function list(nodes: ISyntaxNodeOrToken[]): ISyntaxList;
}
declare module TypeScript {
    class SyntaxNode implements ISyntaxNodeOrToken {
        private _data;
        constructor(parsedInStrictMode: boolean);
        isNode(): boolean;
        isToken(): boolean;
        isList(): boolean;
        isSeparatedList(): boolean;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        firstToken(): ISyntaxToken;
        lastToken(): ISyntaxToken;
        insertChildrenInto(array: ISyntaxElement[], index: number): void;
        leadingTrivia(): ISyntaxTriviaList;
        trailingTrivia(): ISyntaxTriviaList;
        toJSON(key: any): any;
        accept(visitor: ISyntaxVisitor): any;
        fullText(): string;
        collectTextElements(elements: string[]): void;
        replaceToken(token1: ISyntaxToken, token2: ISyntaxToken): SyntaxNode;
        withLeadingTrivia(trivia: ISyntaxTriviaList): SyntaxNode;
        withTrailingTrivia(trivia: ISyntaxTriviaList): SyntaxNode;
        hasLeadingTrivia(): boolean;
        hasTrailingTrivia(): boolean;
        isTypeScriptSpecific(): boolean;
        isIncrementallyUnusable(): boolean;
        parsedInStrictMode(): boolean;
        fullWidth(): number;
        private computeData();
        private data();
        findToken(position: number, includeSkippedTokens?: boolean): PositionedToken;
        private tryGetEndOfFileAt(position);
        private findTokenInternal(parent, position, fullStart);
        findTokenOnLeft(position: number, includeSkippedTokens?: boolean): PositionedToken;
        findCompleteTokenOnLeft(position: number, includeSkippedTokens?: boolean): PositionedToken;
        isModuleElement(): boolean;
        isClassElement(): boolean;
        isTypeMember(): boolean;
        isStatement(): boolean;
        isExpression(): boolean;
        isSwitchClause(): boolean;
        structuralEquals(node: SyntaxNode): boolean;
        width(): number;
        leadingTriviaWidth(): number;
        trailingTriviaWidth(): number;
    }
}
declare module TypeScript {
    interface ISyntaxNodeOrToken extends ISyntaxElement {
        withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxNodeOrToken;
        withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxNodeOrToken;
        accept(visitor: ISyntaxVisitor): any;
    }
}
declare module TypeScript {
    class SourceUnitSyntax extends SyntaxNode {
        moduleElements: ISyntaxList;
        endOfFileToken: ISyntaxToken;
        constructor(moduleElements: ISyntaxList, endOfFileToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        update(moduleElements: ISyntaxList, endOfFileToken: ISyntaxToken): SourceUnitSyntax;
        static create(endOfFileToken: ISyntaxToken): SourceUnitSyntax;
        static create1(endOfFileToken: ISyntaxToken): SourceUnitSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): SourceUnitSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): SourceUnitSyntax;
        withModuleElements(moduleElements: ISyntaxList): SourceUnitSyntax;
        withModuleElement(moduleElement: IModuleElementSyntax): SourceUnitSyntax;
        withEndOfFileToken(endOfFileToken: ISyntaxToken): SourceUnitSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ExternalModuleReferenceSyntax extends SyntaxNode implements IModuleReferenceSyntax {
        requireKeyword: ISyntaxToken;
        openParenToken: ISyntaxToken;
        stringLiteral: ISyntaxToken;
        closeParenToken: ISyntaxToken;
        constructor(requireKeyword: ISyntaxToken, openParenToken: ISyntaxToken, stringLiteral: ISyntaxToken, closeParenToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isModuleReference(): boolean;
        update(requireKeyword: ISyntaxToken, openParenToken: ISyntaxToken, stringLiteral: ISyntaxToken, closeParenToken: ISyntaxToken): ExternalModuleReferenceSyntax;
        static create1(stringLiteral: ISyntaxToken): ExternalModuleReferenceSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ExternalModuleReferenceSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ExternalModuleReferenceSyntax;
        withRequireKeyword(requireKeyword: ISyntaxToken): ExternalModuleReferenceSyntax;
        withOpenParenToken(openParenToken: ISyntaxToken): ExternalModuleReferenceSyntax;
        withStringLiteral(stringLiteral: ISyntaxToken): ExternalModuleReferenceSyntax;
        withCloseParenToken(closeParenToken: ISyntaxToken): ExternalModuleReferenceSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ModuleNameModuleReferenceSyntax extends SyntaxNode implements IModuleReferenceSyntax {
        moduleName: INameSyntax;
        constructor(moduleName: INameSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isModuleReference(): boolean;
        update(moduleName: INameSyntax): ModuleNameModuleReferenceSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ModuleNameModuleReferenceSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ModuleNameModuleReferenceSyntax;
        withModuleName(moduleName: INameSyntax): ModuleNameModuleReferenceSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ImportDeclarationSyntax extends SyntaxNode implements IModuleElementSyntax {
        modifiers: ISyntaxList;
        importKeyword: ISyntaxToken;
        identifier: ISyntaxToken;
        equalsToken: ISyntaxToken;
        moduleReference: IModuleReferenceSyntax;
        semicolonToken: ISyntaxToken;
        constructor(modifiers: ISyntaxList, importKeyword: ISyntaxToken, identifier: ISyntaxToken, equalsToken: ISyntaxToken, moduleReference: IModuleReferenceSyntax, semicolonToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isModuleElement(): boolean;
        update(modifiers: ISyntaxList, importKeyword: ISyntaxToken, identifier: ISyntaxToken, equalsToken: ISyntaxToken, moduleReference: IModuleReferenceSyntax, semicolonToken: ISyntaxToken): ImportDeclarationSyntax;
        static create(importKeyword: ISyntaxToken, identifier: ISyntaxToken, equalsToken: ISyntaxToken, moduleReference: IModuleReferenceSyntax, semicolonToken: ISyntaxToken): ImportDeclarationSyntax;
        static create1(identifier: ISyntaxToken, moduleReference: IModuleReferenceSyntax): ImportDeclarationSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ImportDeclarationSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ImportDeclarationSyntax;
        withModifiers(modifiers: ISyntaxList): ImportDeclarationSyntax;
        withModifier(modifier: ISyntaxToken): ImportDeclarationSyntax;
        withImportKeyword(importKeyword: ISyntaxToken): ImportDeclarationSyntax;
        withIdentifier(identifier: ISyntaxToken): ImportDeclarationSyntax;
        withEqualsToken(equalsToken: ISyntaxToken): ImportDeclarationSyntax;
        withModuleReference(moduleReference: IModuleReferenceSyntax): ImportDeclarationSyntax;
        withSemicolonToken(semicolonToken: ISyntaxToken): ImportDeclarationSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ExportAssignmentSyntax extends SyntaxNode implements IModuleElementSyntax {
        exportKeyword: ISyntaxToken;
        equalsToken: ISyntaxToken;
        identifier: ISyntaxToken;
        semicolonToken: ISyntaxToken;
        constructor(exportKeyword: ISyntaxToken, equalsToken: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isModuleElement(): boolean;
        update(exportKeyword: ISyntaxToken, equalsToken: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): ExportAssignmentSyntax;
        static create1(identifier: ISyntaxToken): ExportAssignmentSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ExportAssignmentSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ExportAssignmentSyntax;
        withExportKeyword(exportKeyword: ISyntaxToken): ExportAssignmentSyntax;
        withEqualsToken(equalsToken: ISyntaxToken): ExportAssignmentSyntax;
        withIdentifier(identifier: ISyntaxToken): ExportAssignmentSyntax;
        withSemicolonToken(semicolonToken: ISyntaxToken): ExportAssignmentSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ClassDeclarationSyntax extends SyntaxNode implements IModuleElementSyntax {
        modifiers: ISyntaxList;
        classKeyword: ISyntaxToken;
        identifier: ISyntaxToken;
        typeParameterList: TypeParameterListSyntax;
        heritageClauses: ISyntaxList;
        openBraceToken: ISyntaxToken;
        classElements: ISyntaxList;
        closeBraceToken: ISyntaxToken;
        constructor(modifiers: ISyntaxList, classKeyword: ISyntaxToken, identifier: ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: ISyntaxList, openBraceToken: ISyntaxToken, classElements: ISyntaxList, closeBraceToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isModuleElement(): boolean;
        update(modifiers: ISyntaxList, classKeyword: ISyntaxToken, identifier: ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: ISyntaxList, openBraceToken: ISyntaxToken, classElements: ISyntaxList, closeBraceToken: ISyntaxToken): ClassDeclarationSyntax;
        static create(classKeyword: ISyntaxToken, identifier: ISyntaxToken, openBraceToken: ISyntaxToken, closeBraceToken: ISyntaxToken): ClassDeclarationSyntax;
        static create1(identifier: ISyntaxToken): ClassDeclarationSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ClassDeclarationSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ClassDeclarationSyntax;
        withModifiers(modifiers: ISyntaxList): ClassDeclarationSyntax;
        withModifier(modifier: ISyntaxToken): ClassDeclarationSyntax;
        withClassKeyword(classKeyword: ISyntaxToken): ClassDeclarationSyntax;
        withIdentifier(identifier: ISyntaxToken): ClassDeclarationSyntax;
        withTypeParameterList(typeParameterList: TypeParameterListSyntax): ClassDeclarationSyntax;
        withHeritageClauses(heritageClauses: ISyntaxList): ClassDeclarationSyntax;
        withHeritageClause(heritageClause: HeritageClauseSyntax): ClassDeclarationSyntax;
        withOpenBraceToken(openBraceToken: ISyntaxToken): ClassDeclarationSyntax;
        withClassElements(classElements: ISyntaxList): ClassDeclarationSyntax;
        withClassElement(classElement: IClassElementSyntax): ClassDeclarationSyntax;
        withCloseBraceToken(closeBraceToken: ISyntaxToken): ClassDeclarationSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class InterfaceDeclarationSyntax extends SyntaxNode implements IModuleElementSyntax {
        modifiers: ISyntaxList;
        interfaceKeyword: ISyntaxToken;
        identifier: ISyntaxToken;
        typeParameterList: TypeParameterListSyntax;
        heritageClauses: ISyntaxList;
        body: ObjectTypeSyntax;
        constructor(modifiers: ISyntaxList, interfaceKeyword: ISyntaxToken, identifier: ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: ISyntaxList, body: ObjectTypeSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isModuleElement(): boolean;
        update(modifiers: ISyntaxList, interfaceKeyword: ISyntaxToken, identifier: ISyntaxToken, typeParameterList: TypeParameterListSyntax, heritageClauses: ISyntaxList, body: ObjectTypeSyntax): InterfaceDeclarationSyntax;
        static create(interfaceKeyword: ISyntaxToken, identifier: ISyntaxToken, body: ObjectTypeSyntax): InterfaceDeclarationSyntax;
        static create1(identifier: ISyntaxToken): InterfaceDeclarationSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): InterfaceDeclarationSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): InterfaceDeclarationSyntax;
        withModifiers(modifiers: ISyntaxList): InterfaceDeclarationSyntax;
        withModifier(modifier: ISyntaxToken): InterfaceDeclarationSyntax;
        withInterfaceKeyword(interfaceKeyword: ISyntaxToken): InterfaceDeclarationSyntax;
        withIdentifier(identifier: ISyntaxToken): InterfaceDeclarationSyntax;
        withTypeParameterList(typeParameterList: TypeParameterListSyntax): InterfaceDeclarationSyntax;
        withHeritageClauses(heritageClauses: ISyntaxList): InterfaceDeclarationSyntax;
        withHeritageClause(heritageClause: HeritageClauseSyntax): InterfaceDeclarationSyntax;
        withBody(body: ObjectTypeSyntax): InterfaceDeclarationSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class HeritageClauseSyntax extends SyntaxNode {
        extendsOrImplementsKeyword: ISyntaxToken;
        typeNames: ISeparatedSyntaxList;
        private _kind;
        constructor(kind: SyntaxKind, extendsOrImplementsKeyword: ISyntaxToken, typeNames: ISeparatedSyntaxList, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        kind(): SyntaxKind;
        update(kind: SyntaxKind, extendsOrImplementsKeyword: ISyntaxToken, typeNames: ISeparatedSyntaxList): HeritageClauseSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): HeritageClauseSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): HeritageClauseSyntax;
        withKind(kind: SyntaxKind): HeritageClauseSyntax;
        withExtendsOrImplementsKeyword(extendsOrImplementsKeyword: ISyntaxToken): HeritageClauseSyntax;
        withTypeNames(typeNames: ISeparatedSyntaxList): HeritageClauseSyntax;
        withTypeName(typeName: INameSyntax): HeritageClauseSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ModuleDeclarationSyntax extends SyntaxNode implements IModuleElementSyntax {
        modifiers: ISyntaxList;
        moduleKeyword: ISyntaxToken;
        name: INameSyntax;
        stringLiteral: ISyntaxToken;
        openBraceToken: ISyntaxToken;
        moduleElements: ISyntaxList;
        closeBraceToken: ISyntaxToken;
        constructor(modifiers: ISyntaxList, moduleKeyword: ISyntaxToken, name: INameSyntax, stringLiteral: ISyntaxToken, openBraceToken: ISyntaxToken, moduleElements: ISyntaxList, closeBraceToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isModuleElement(): boolean;
        update(modifiers: ISyntaxList, moduleKeyword: ISyntaxToken, name: INameSyntax, stringLiteral: ISyntaxToken, openBraceToken: ISyntaxToken, moduleElements: ISyntaxList, closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax;
        static create(moduleKeyword: ISyntaxToken, openBraceToken: ISyntaxToken, closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax;
        static create1(): ModuleDeclarationSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ModuleDeclarationSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ModuleDeclarationSyntax;
        withModifiers(modifiers: ISyntaxList): ModuleDeclarationSyntax;
        withModifier(modifier: ISyntaxToken): ModuleDeclarationSyntax;
        withModuleKeyword(moduleKeyword: ISyntaxToken): ModuleDeclarationSyntax;
        withName(name: INameSyntax): ModuleDeclarationSyntax;
        withStringLiteral(stringLiteral: ISyntaxToken): ModuleDeclarationSyntax;
        withOpenBraceToken(openBraceToken: ISyntaxToken): ModuleDeclarationSyntax;
        withModuleElements(moduleElements: ISyntaxList): ModuleDeclarationSyntax;
        withModuleElement(moduleElement: IModuleElementSyntax): ModuleDeclarationSyntax;
        withCloseBraceToken(closeBraceToken: ISyntaxToken): ModuleDeclarationSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class FunctionDeclarationSyntax extends SyntaxNode implements IStatementSyntax {
        modifiers: ISyntaxList;
        functionKeyword: ISyntaxToken;
        identifier: ISyntaxToken;
        callSignature: CallSignatureSyntax;
        block: BlockSyntax;
        semicolonToken: ISyntaxToken;
        constructor(modifiers: ISyntaxList, functionKeyword: ISyntaxToken, identifier: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(modifiers: ISyntaxList, functionKeyword: ISyntaxToken, identifier: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): FunctionDeclarationSyntax;
        static create(functionKeyword: ISyntaxToken, identifier: ISyntaxToken, callSignature: CallSignatureSyntax): FunctionDeclarationSyntax;
        static create1(identifier: ISyntaxToken): FunctionDeclarationSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): FunctionDeclarationSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): FunctionDeclarationSyntax;
        withModifiers(modifiers: ISyntaxList): FunctionDeclarationSyntax;
        withModifier(modifier: ISyntaxToken): FunctionDeclarationSyntax;
        withFunctionKeyword(functionKeyword: ISyntaxToken): FunctionDeclarationSyntax;
        withIdentifier(identifier: ISyntaxToken): FunctionDeclarationSyntax;
        withCallSignature(callSignature: CallSignatureSyntax): FunctionDeclarationSyntax;
        withBlock(block: BlockSyntax): FunctionDeclarationSyntax;
        withSemicolonToken(semicolonToken: ISyntaxToken): FunctionDeclarationSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class VariableStatementSyntax extends SyntaxNode implements IStatementSyntax {
        modifiers: ISyntaxList;
        variableDeclaration: VariableDeclarationSyntax;
        semicolonToken: ISyntaxToken;
        constructor(modifiers: ISyntaxList, variableDeclaration: VariableDeclarationSyntax, semicolonToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(modifiers: ISyntaxList, variableDeclaration: VariableDeclarationSyntax, semicolonToken: ISyntaxToken): VariableStatementSyntax;
        static create(variableDeclaration: VariableDeclarationSyntax, semicolonToken: ISyntaxToken): VariableStatementSyntax;
        static create1(variableDeclaration: VariableDeclarationSyntax): VariableStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): VariableStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): VariableStatementSyntax;
        withModifiers(modifiers: ISyntaxList): VariableStatementSyntax;
        withModifier(modifier: ISyntaxToken): VariableStatementSyntax;
        withVariableDeclaration(variableDeclaration: VariableDeclarationSyntax): VariableStatementSyntax;
        withSemicolonToken(semicolonToken: ISyntaxToken): VariableStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class VariableDeclarationSyntax extends SyntaxNode {
        varKeyword: ISyntaxToken;
        variableDeclarators: ISeparatedSyntaxList;
        constructor(varKeyword: ISyntaxToken, variableDeclarators: ISeparatedSyntaxList, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        update(varKeyword: ISyntaxToken, variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax;
        static create1(variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): VariableDeclarationSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): VariableDeclarationSyntax;
        withVarKeyword(varKeyword: ISyntaxToken): VariableDeclarationSyntax;
        withVariableDeclarators(variableDeclarators: ISeparatedSyntaxList): VariableDeclarationSyntax;
        withVariableDeclarator(variableDeclarator: VariableDeclaratorSyntax): VariableDeclarationSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class VariableDeclaratorSyntax extends SyntaxNode {
        propertyName: ISyntaxToken;
        typeAnnotation: TypeAnnotationSyntax;
        equalsValueClause: EqualsValueClauseSyntax;
        constructor(propertyName: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        update(propertyName: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax;
        static create(propertyName: ISyntaxToken): VariableDeclaratorSyntax;
        static create1(propertyName: ISyntaxToken): VariableDeclaratorSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): VariableDeclaratorSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): VariableDeclaratorSyntax;
        withPropertyName(propertyName: ISyntaxToken): VariableDeclaratorSyntax;
        withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): VariableDeclaratorSyntax;
        withEqualsValueClause(equalsValueClause: EqualsValueClauseSyntax): VariableDeclaratorSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class EqualsValueClauseSyntax extends SyntaxNode {
        equalsToken: ISyntaxToken;
        value: IExpressionSyntax;
        constructor(equalsToken: ISyntaxToken, value: IExpressionSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        update(equalsToken: ISyntaxToken, value: IExpressionSyntax): EqualsValueClauseSyntax;
        static create1(value: IExpressionSyntax): EqualsValueClauseSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): EqualsValueClauseSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): EqualsValueClauseSyntax;
        withEqualsToken(equalsToken: ISyntaxToken): EqualsValueClauseSyntax;
        withValue(value: IExpressionSyntax): EqualsValueClauseSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class PrefixUnaryExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
        operatorToken: ISyntaxToken;
        operand: IUnaryExpressionSyntax;
        private _kind;
        constructor(kind: SyntaxKind, operatorToken: ISyntaxToken, operand: IUnaryExpressionSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isUnaryExpression(): boolean;
        isExpression(): boolean;
        kind(): SyntaxKind;
        update(kind: SyntaxKind, operatorToken: ISyntaxToken, operand: IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): PrefixUnaryExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): PrefixUnaryExpressionSyntax;
        withKind(kind: SyntaxKind): PrefixUnaryExpressionSyntax;
        withOperatorToken(operatorToken: ISyntaxToken): PrefixUnaryExpressionSyntax;
        withOperand(operand: IUnaryExpressionSyntax): PrefixUnaryExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ArrayLiteralExpressionSyntax extends SyntaxNode implements IPrimaryExpressionSyntax {
        openBracketToken: ISyntaxToken;
        expressions: ISeparatedSyntaxList;
        closeBracketToken: ISyntaxToken;
        constructor(openBracketToken: ISyntaxToken, expressions: ISeparatedSyntaxList, closeBracketToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isPrimaryExpression(): boolean;
        isMemberExpression(): boolean;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
        isExpression(): boolean;
        update(openBracketToken: ISyntaxToken, expressions: ISeparatedSyntaxList, closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax;
        static create(openBracketToken: ISyntaxToken, closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax;
        static create1(): ArrayLiteralExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ArrayLiteralExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ArrayLiteralExpressionSyntax;
        withOpenBracketToken(openBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax;
        withExpressions(expressions: ISeparatedSyntaxList): ArrayLiteralExpressionSyntax;
        withExpression(expression: IExpressionSyntax): ArrayLiteralExpressionSyntax;
        withCloseBracketToken(closeBracketToken: ISyntaxToken): ArrayLiteralExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class OmittedExpressionSyntax extends SyntaxNode implements IExpressionSyntax {
        constructor(parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isExpression(): boolean;
        update(): OmittedExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): OmittedExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): OmittedExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ParenthesizedExpressionSyntax extends SyntaxNode implements IPrimaryExpressionSyntax {
        openParenToken: ISyntaxToken;
        expression: IExpressionSyntax;
        closeParenToken: ISyntaxToken;
        constructor(openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isPrimaryExpression(): boolean;
        isMemberExpression(): boolean;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
        isExpression(): boolean;
        update(openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken): ParenthesizedExpressionSyntax;
        static create1(expression: IExpressionSyntax): ParenthesizedExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ParenthesizedExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ParenthesizedExpressionSyntax;
        withOpenParenToken(openParenToken: ISyntaxToken): ParenthesizedExpressionSyntax;
        withExpression(expression: IExpressionSyntax): ParenthesizedExpressionSyntax;
        withCloseParenToken(closeParenToken: ISyntaxToken): ParenthesizedExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class SimpleArrowFunctionExpressionSyntax extends SyntaxNode implements IArrowFunctionExpressionSyntax {
        identifier: ISyntaxToken;
        equalsGreaterThanToken: ISyntaxToken;
        block: BlockSyntax;
        expression: IExpressionSyntax;
        constructor(identifier: ISyntaxToken, equalsGreaterThanToken: ISyntaxToken, block: BlockSyntax, expression: IExpressionSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isArrowFunctionExpression(): boolean;
        isUnaryExpression(): boolean;
        isExpression(): boolean;
        update(identifier: ISyntaxToken, equalsGreaterThanToken: ISyntaxToken, block: BlockSyntax, expression: IExpressionSyntax): SimpleArrowFunctionExpressionSyntax;
        static create(identifier: ISyntaxToken, equalsGreaterThanToken: ISyntaxToken): SimpleArrowFunctionExpressionSyntax;
        static create1(identifier: ISyntaxToken): SimpleArrowFunctionExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): SimpleArrowFunctionExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): SimpleArrowFunctionExpressionSyntax;
        withIdentifier(identifier: ISyntaxToken): SimpleArrowFunctionExpressionSyntax;
        withEqualsGreaterThanToken(equalsGreaterThanToken: ISyntaxToken): SimpleArrowFunctionExpressionSyntax;
        withBlock(block: BlockSyntax): SimpleArrowFunctionExpressionSyntax;
        withExpression(expression: IExpressionSyntax): SimpleArrowFunctionExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ParenthesizedArrowFunctionExpressionSyntax extends SyntaxNode implements IArrowFunctionExpressionSyntax {
        callSignature: CallSignatureSyntax;
        equalsGreaterThanToken: ISyntaxToken;
        block: BlockSyntax;
        expression: IExpressionSyntax;
        constructor(callSignature: CallSignatureSyntax, equalsGreaterThanToken: ISyntaxToken, block: BlockSyntax, expression: IExpressionSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isArrowFunctionExpression(): boolean;
        isUnaryExpression(): boolean;
        isExpression(): boolean;
        update(callSignature: CallSignatureSyntax, equalsGreaterThanToken: ISyntaxToken, block: BlockSyntax, expression: IExpressionSyntax): ParenthesizedArrowFunctionExpressionSyntax;
        static create(callSignature: CallSignatureSyntax, equalsGreaterThanToken: ISyntaxToken): ParenthesizedArrowFunctionExpressionSyntax;
        static create1(): ParenthesizedArrowFunctionExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ParenthesizedArrowFunctionExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ParenthesizedArrowFunctionExpressionSyntax;
        withCallSignature(callSignature: CallSignatureSyntax): ParenthesizedArrowFunctionExpressionSyntax;
        withEqualsGreaterThanToken(equalsGreaterThanToken: ISyntaxToken): ParenthesizedArrowFunctionExpressionSyntax;
        withBlock(block: BlockSyntax): ParenthesizedArrowFunctionExpressionSyntax;
        withExpression(expression: IExpressionSyntax): ParenthesizedArrowFunctionExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class QualifiedNameSyntax extends SyntaxNode implements INameSyntax {
        left: INameSyntax;
        dotToken: ISyntaxToken;
        right: ISyntaxToken;
        constructor(left: INameSyntax, dotToken: ISyntaxToken, right: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isName(): boolean;
        isType(): boolean;
        update(left: INameSyntax, dotToken: ISyntaxToken, right: ISyntaxToken): QualifiedNameSyntax;
        static create1(left: INameSyntax, right: ISyntaxToken): QualifiedNameSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): QualifiedNameSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): QualifiedNameSyntax;
        withLeft(left: INameSyntax): QualifiedNameSyntax;
        withDotToken(dotToken: ISyntaxToken): QualifiedNameSyntax;
        withRight(right: ISyntaxToken): QualifiedNameSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class TypeArgumentListSyntax extends SyntaxNode {
        lessThanToken: ISyntaxToken;
        typeArguments: ISeparatedSyntaxList;
        greaterThanToken: ISyntaxToken;
        constructor(lessThanToken: ISyntaxToken, typeArguments: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        update(lessThanToken: ISyntaxToken, typeArguments: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeArgumentListSyntax;
        static create(lessThanToken: ISyntaxToken, greaterThanToken: ISyntaxToken): TypeArgumentListSyntax;
        static create1(): TypeArgumentListSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): TypeArgumentListSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): TypeArgumentListSyntax;
        withLessThanToken(lessThanToken: ISyntaxToken): TypeArgumentListSyntax;
        withTypeArguments(typeArguments: ISeparatedSyntaxList): TypeArgumentListSyntax;
        withTypeArgument(typeArgument: ITypeSyntax): TypeArgumentListSyntax;
        withGreaterThanToken(greaterThanToken: ISyntaxToken): TypeArgumentListSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ConstructorTypeSyntax extends SyntaxNode implements ITypeSyntax {
        newKeyword: ISyntaxToken;
        typeParameterList: TypeParameterListSyntax;
        parameterList: ParameterListSyntax;
        equalsGreaterThanToken: ISyntaxToken;
        type: ITypeSyntax;
        constructor(newKeyword: ISyntaxToken, typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isType(): boolean;
        update(newKeyword: ISyntaxToken, typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): ConstructorTypeSyntax;
        static create(newKeyword: ISyntaxToken, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): ConstructorTypeSyntax;
        static create1(type: ITypeSyntax): ConstructorTypeSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ConstructorTypeSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ConstructorTypeSyntax;
        withNewKeyword(newKeyword: ISyntaxToken): ConstructorTypeSyntax;
        withTypeParameterList(typeParameterList: TypeParameterListSyntax): ConstructorTypeSyntax;
        withParameterList(parameterList: ParameterListSyntax): ConstructorTypeSyntax;
        withEqualsGreaterThanToken(equalsGreaterThanToken: ISyntaxToken): ConstructorTypeSyntax;
        withType(type: ITypeSyntax): ConstructorTypeSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class FunctionTypeSyntax extends SyntaxNode implements ITypeSyntax {
        typeParameterList: TypeParameterListSyntax;
        parameterList: ParameterListSyntax;
        equalsGreaterThanToken: ISyntaxToken;
        type: ITypeSyntax;
        constructor(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isType(): boolean;
        update(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): FunctionTypeSyntax;
        static create(parameterList: ParameterListSyntax, equalsGreaterThanToken: ISyntaxToken, type: ITypeSyntax): FunctionTypeSyntax;
        static create1(type: ITypeSyntax): FunctionTypeSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): FunctionTypeSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): FunctionTypeSyntax;
        withTypeParameterList(typeParameterList: TypeParameterListSyntax): FunctionTypeSyntax;
        withParameterList(parameterList: ParameterListSyntax): FunctionTypeSyntax;
        withEqualsGreaterThanToken(equalsGreaterThanToken: ISyntaxToken): FunctionTypeSyntax;
        withType(type: ITypeSyntax): FunctionTypeSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ObjectTypeSyntax extends SyntaxNode implements ITypeSyntax {
        openBraceToken: ISyntaxToken;
        typeMembers: ISeparatedSyntaxList;
        closeBraceToken: ISyntaxToken;
        constructor(openBraceToken: ISyntaxToken, typeMembers: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isType(): boolean;
        update(openBraceToken: ISyntaxToken, typeMembers: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectTypeSyntax;
        static create(openBraceToken: ISyntaxToken, closeBraceToken: ISyntaxToken): ObjectTypeSyntax;
        static create1(): ObjectTypeSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ObjectTypeSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ObjectTypeSyntax;
        withOpenBraceToken(openBraceToken: ISyntaxToken): ObjectTypeSyntax;
        withTypeMembers(typeMembers: ISeparatedSyntaxList): ObjectTypeSyntax;
        withTypeMember(typeMember: ITypeMemberSyntax): ObjectTypeSyntax;
        withCloseBraceToken(closeBraceToken: ISyntaxToken): ObjectTypeSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ArrayTypeSyntax extends SyntaxNode implements ITypeSyntax {
        type: ITypeSyntax;
        openBracketToken: ISyntaxToken;
        closeBracketToken: ISyntaxToken;
        constructor(type: ITypeSyntax, openBracketToken: ISyntaxToken, closeBracketToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isType(): boolean;
        update(type: ITypeSyntax, openBracketToken: ISyntaxToken, closeBracketToken: ISyntaxToken): ArrayTypeSyntax;
        static create1(type: ITypeSyntax): ArrayTypeSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ArrayTypeSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ArrayTypeSyntax;
        withType(type: ITypeSyntax): ArrayTypeSyntax;
        withOpenBracketToken(openBracketToken: ISyntaxToken): ArrayTypeSyntax;
        withCloseBracketToken(closeBracketToken: ISyntaxToken): ArrayTypeSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class GenericTypeSyntax extends SyntaxNode implements ITypeSyntax {
        name: INameSyntax;
        typeArgumentList: TypeArgumentListSyntax;
        constructor(name: INameSyntax, typeArgumentList: TypeArgumentListSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isType(): boolean;
        update(name: INameSyntax, typeArgumentList: TypeArgumentListSyntax): GenericTypeSyntax;
        static create1(name: INameSyntax): GenericTypeSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): GenericTypeSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): GenericTypeSyntax;
        withName(name: INameSyntax): GenericTypeSyntax;
        withTypeArgumentList(typeArgumentList: TypeArgumentListSyntax): GenericTypeSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class TypeQuerySyntax extends SyntaxNode implements ITypeSyntax {
        typeOfKeyword: ISyntaxToken;
        name: INameSyntax;
        constructor(typeOfKeyword: ISyntaxToken, name: INameSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isType(): boolean;
        update(typeOfKeyword: ISyntaxToken, name: INameSyntax): TypeQuerySyntax;
        static create1(name: INameSyntax): TypeQuerySyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): TypeQuerySyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): TypeQuerySyntax;
        withTypeOfKeyword(typeOfKeyword: ISyntaxToken): TypeQuerySyntax;
        withName(name: INameSyntax): TypeQuerySyntax;
        isTypeScriptSpecific(): boolean;
    }
    class TypeAnnotationSyntax extends SyntaxNode {
        colonToken: ISyntaxToken;
        type: ITypeSyntax;
        constructor(colonToken: ISyntaxToken, type: ITypeSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        update(colonToken: ISyntaxToken, type: ITypeSyntax): TypeAnnotationSyntax;
        static create1(type: ITypeSyntax): TypeAnnotationSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): TypeAnnotationSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): TypeAnnotationSyntax;
        withColonToken(colonToken: ISyntaxToken): TypeAnnotationSyntax;
        withType(type: ITypeSyntax): TypeAnnotationSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class BlockSyntax extends SyntaxNode implements IStatementSyntax {
        openBraceToken: ISyntaxToken;
        statements: ISyntaxList;
        closeBraceToken: ISyntaxToken;
        constructor(openBraceToken: ISyntaxToken, statements: ISyntaxList, closeBraceToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(openBraceToken: ISyntaxToken, statements: ISyntaxList, closeBraceToken: ISyntaxToken): BlockSyntax;
        static create(openBraceToken: ISyntaxToken, closeBraceToken: ISyntaxToken): BlockSyntax;
        static create1(): BlockSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): BlockSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): BlockSyntax;
        withOpenBraceToken(openBraceToken: ISyntaxToken): BlockSyntax;
        withStatements(statements: ISyntaxList): BlockSyntax;
        withStatement(statement: IStatementSyntax): BlockSyntax;
        withCloseBraceToken(closeBraceToken: ISyntaxToken): BlockSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ParameterSyntax extends SyntaxNode {
        dotDotDotToken: ISyntaxToken;
        modifiers: ISyntaxList;
        identifier: ISyntaxToken;
        questionToken: ISyntaxToken;
        typeAnnotation: TypeAnnotationSyntax;
        equalsValueClause: EqualsValueClauseSyntax;
        constructor(dotDotDotToken: ISyntaxToken, modifiers: ISyntaxList, identifier: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        update(dotDotDotToken: ISyntaxToken, modifiers: ISyntaxList, identifier: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax;
        static create(identifier: ISyntaxToken): ParameterSyntax;
        static create1(identifier: ISyntaxToken): ParameterSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ParameterSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ParameterSyntax;
        withDotDotDotToken(dotDotDotToken: ISyntaxToken): ParameterSyntax;
        withModifiers(modifiers: ISyntaxList): ParameterSyntax;
        withModifier(modifier: ISyntaxToken): ParameterSyntax;
        withIdentifier(identifier: ISyntaxToken): ParameterSyntax;
        withQuestionToken(questionToken: ISyntaxToken): ParameterSyntax;
        withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): ParameterSyntax;
        withEqualsValueClause(equalsValueClause: EqualsValueClauseSyntax): ParameterSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class MemberAccessExpressionSyntax extends SyntaxNode implements IMemberExpressionSyntax {
        expression: IExpressionSyntax;
        dotToken: ISyntaxToken;
        name: ISyntaxToken;
        constructor(expression: IExpressionSyntax, dotToken: ISyntaxToken, name: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isMemberExpression(): boolean;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
        isExpression(): boolean;
        update(expression: IExpressionSyntax, dotToken: ISyntaxToken, name: ISyntaxToken): MemberAccessExpressionSyntax;
        static create1(expression: IExpressionSyntax, name: ISyntaxToken): MemberAccessExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): MemberAccessExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): MemberAccessExpressionSyntax;
        withExpression(expression: IExpressionSyntax): MemberAccessExpressionSyntax;
        withDotToken(dotToken: ISyntaxToken): MemberAccessExpressionSyntax;
        withName(name: ISyntaxToken): MemberAccessExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class PostfixUnaryExpressionSyntax extends SyntaxNode implements IPostfixExpressionSyntax {
        operand: IMemberExpressionSyntax;
        operatorToken: ISyntaxToken;
        private _kind;
        constructor(kind: SyntaxKind, operand: IMemberExpressionSyntax, operatorToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
        isExpression(): boolean;
        kind(): SyntaxKind;
        update(kind: SyntaxKind, operand: IMemberExpressionSyntax, operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): PostfixUnaryExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): PostfixUnaryExpressionSyntax;
        withKind(kind: SyntaxKind): PostfixUnaryExpressionSyntax;
        withOperand(operand: IMemberExpressionSyntax): PostfixUnaryExpressionSyntax;
        withOperatorToken(operatorToken: ISyntaxToken): PostfixUnaryExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ElementAccessExpressionSyntax extends SyntaxNode implements IMemberExpressionSyntax {
        expression: IExpressionSyntax;
        openBracketToken: ISyntaxToken;
        argumentExpression: IExpressionSyntax;
        closeBracketToken: ISyntaxToken;
        constructor(expression: IExpressionSyntax, openBracketToken: ISyntaxToken, argumentExpression: IExpressionSyntax, closeBracketToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isMemberExpression(): boolean;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
        isExpression(): boolean;
        update(expression: IExpressionSyntax, openBracketToken: ISyntaxToken, argumentExpression: IExpressionSyntax, closeBracketToken: ISyntaxToken): ElementAccessExpressionSyntax;
        static create1(expression: IExpressionSyntax, argumentExpression: IExpressionSyntax): ElementAccessExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ElementAccessExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ElementAccessExpressionSyntax;
        withExpression(expression: IExpressionSyntax): ElementAccessExpressionSyntax;
        withOpenBracketToken(openBracketToken: ISyntaxToken): ElementAccessExpressionSyntax;
        withArgumentExpression(argumentExpression: IExpressionSyntax): ElementAccessExpressionSyntax;
        withCloseBracketToken(closeBracketToken: ISyntaxToken): ElementAccessExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class InvocationExpressionSyntax extends SyntaxNode implements IMemberExpressionSyntax {
        expression: IMemberExpressionSyntax;
        argumentList: ArgumentListSyntax;
        constructor(expression: IMemberExpressionSyntax, argumentList: ArgumentListSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isMemberExpression(): boolean;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
        isExpression(): boolean;
        update(expression: IMemberExpressionSyntax, argumentList: ArgumentListSyntax): InvocationExpressionSyntax;
        static create1(expression: IMemberExpressionSyntax): InvocationExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): InvocationExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): InvocationExpressionSyntax;
        withExpression(expression: IMemberExpressionSyntax): InvocationExpressionSyntax;
        withArgumentList(argumentList: ArgumentListSyntax): InvocationExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ArgumentListSyntax extends SyntaxNode {
        typeArgumentList: TypeArgumentListSyntax;
        openParenToken: ISyntaxToken;
        arguments: ISeparatedSyntaxList;
        closeParenToken: ISyntaxToken;
        constructor(typeArgumentList: TypeArgumentListSyntax, openParenToken: ISyntaxToken, arguments: ISeparatedSyntaxList, closeParenToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        update(typeArgumentList: TypeArgumentListSyntax, openParenToken: ISyntaxToken, _arguments: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ArgumentListSyntax;
        static create(openParenToken: ISyntaxToken, closeParenToken: ISyntaxToken): ArgumentListSyntax;
        static create1(): ArgumentListSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ArgumentListSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ArgumentListSyntax;
        withTypeArgumentList(typeArgumentList: TypeArgumentListSyntax): ArgumentListSyntax;
        withOpenParenToken(openParenToken: ISyntaxToken): ArgumentListSyntax;
        withArguments(_arguments: ISeparatedSyntaxList): ArgumentListSyntax;
        withArgument(_argument: IExpressionSyntax): ArgumentListSyntax;
        withCloseParenToken(closeParenToken: ISyntaxToken): ArgumentListSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class BinaryExpressionSyntax extends SyntaxNode implements IExpressionSyntax {
        left: IExpressionSyntax;
        operatorToken: ISyntaxToken;
        right: IExpressionSyntax;
        private _kind;
        constructor(kind: SyntaxKind, left: IExpressionSyntax, operatorToken: ISyntaxToken, right: IExpressionSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isExpression(): boolean;
        kind(): SyntaxKind;
        update(kind: SyntaxKind, left: IExpressionSyntax, operatorToken: ISyntaxToken, right: IExpressionSyntax): BinaryExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): BinaryExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): BinaryExpressionSyntax;
        withKind(kind: SyntaxKind): BinaryExpressionSyntax;
        withLeft(left: IExpressionSyntax): BinaryExpressionSyntax;
        withOperatorToken(operatorToken: ISyntaxToken): BinaryExpressionSyntax;
        withRight(right: IExpressionSyntax): BinaryExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ConditionalExpressionSyntax extends SyntaxNode implements IExpressionSyntax {
        condition: IExpressionSyntax;
        questionToken: ISyntaxToken;
        whenTrue: IExpressionSyntax;
        colonToken: ISyntaxToken;
        whenFalse: IExpressionSyntax;
        constructor(condition: IExpressionSyntax, questionToken: ISyntaxToken, whenTrue: IExpressionSyntax, colonToken: ISyntaxToken, whenFalse: IExpressionSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isExpression(): boolean;
        update(condition: IExpressionSyntax, questionToken: ISyntaxToken, whenTrue: IExpressionSyntax, colonToken: ISyntaxToken, whenFalse: IExpressionSyntax): ConditionalExpressionSyntax;
        static create1(condition: IExpressionSyntax, whenTrue: IExpressionSyntax, whenFalse: IExpressionSyntax): ConditionalExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ConditionalExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ConditionalExpressionSyntax;
        withCondition(condition: IExpressionSyntax): ConditionalExpressionSyntax;
        withQuestionToken(questionToken: ISyntaxToken): ConditionalExpressionSyntax;
        withWhenTrue(whenTrue: IExpressionSyntax): ConditionalExpressionSyntax;
        withColonToken(colonToken: ISyntaxToken): ConditionalExpressionSyntax;
        withWhenFalse(whenFalse: IExpressionSyntax): ConditionalExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ConstructSignatureSyntax extends SyntaxNode implements ITypeMemberSyntax {
        newKeyword: ISyntaxToken;
        callSignature: CallSignatureSyntax;
        constructor(newKeyword: ISyntaxToken, callSignature: CallSignatureSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isTypeMember(): boolean;
        update(newKeyword: ISyntaxToken, callSignature: CallSignatureSyntax): ConstructSignatureSyntax;
        static create1(): ConstructSignatureSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ConstructSignatureSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ConstructSignatureSyntax;
        withNewKeyword(newKeyword: ISyntaxToken): ConstructSignatureSyntax;
        withCallSignature(callSignature: CallSignatureSyntax): ConstructSignatureSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class MethodSignatureSyntax extends SyntaxNode implements ITypeMemberSyntax {
        propertyName: ISyntaxToken;
        questionToken: ISyntaxToken;
        callSignature: CallSignatureSyntax;
        constructor(propertyName: ISyntaxToken, questionToken: ISyntaxToken, callSignature: CallSignatureSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isTypeMember(): boolean;
        update(propertyName: ISyntaxToken, questionToken: ISyntaxToken, callSignature: CallSignatureSyntax): MethodSignatureSyntax;
        static create(propertyName: ISyntaxToken, callSignature: CallSignatureSyntax): MethodSignatureSyntax;
        static create1(propertyName: ISyntaxToken): MethodSignatureSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): MethodSignatureSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): MethodSignatureSyntax;
        withPropertyName(propertyName: ISyntaxToken): MethodSignatureSyntax;
        withQuestionToken(questionToken: ISyntaxToken): MethodSignatureSyntax;
        withCallSignature(callSignature: CallSignatureSyntax): MethodSignatureSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class IndexSignatureSyntax extends SyntaxNode implements ITypeMemberSyntax {
        openBracketToken: ISyntaxToken;
        parameter: ParameterSyntax;
        closeBracketToken: ISyntaxToken;
        typeAnnotation: TypeAnnotationSyntax;
        constructor(openBracketToken: ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isTypeMember(): boolean;
        update(openBracketToken: ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax;
        static create(openBracketToken: ISyntaxToken, parameter: ParameterSyntax, closeBracketToken: ISyntaxToken): IndexSignatureSyntax;
        static create1(parameter: ParameterSyntax): IndexSignatureSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): IndexSignatureSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): IndexSignatureSyntax;
        withOpenBracketToken(openBracketToken: ISyntaxToken): IndexSignatureSyntax;
        withParameter(parameter: ParameterSyntax): IndexSignatureSyntax;
        withCloseBracketToken(closeBracketToken: ISyntaxToken): IndexSignatureSyntax;
        withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): IndexSignatureSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class PropertySignatureSyntax extends SyntaxNode implements ITypeMemberSyntax {
        propertyName: ISyntaxToken;
        questionToken: ISyntaxToken;
        typeAnnotation: TypeAnnotationSyntax;
        constructor(propertyName: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isTypeMember(): boolean;
        update(propertyName: ISyntaxToken, questionToken: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax;
        static create(propertyName: ISyntaxToken): PropertySignatureSyntax;
        static create1(propertyName: ISyntaxToken): PropertySignatureSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): PropertySignatureSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): PropertySignatureSyntax;
        withPropertyName(propertyName: ISyntaxToken): PropertySignatureSyntax;
        withQuestionToken(questionToken: ISyntaxToken): PropertySignatureSyntax;
        withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): PropertySignatureSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class CallSignatureSyntax extends SyntaxNode implements ITypeMemberSyntax {
        typeParameterList: TypeParameterListSyntax;
        parameterList: ParameterListSyntax;
        typeAnnotation: TypeAnnotationSyntax;
        constructor(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isTypeMember(): boolean;
        update(typeParameterList: TypeParameterListSyntax, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax;
        static create(parameterList: ParameterListSyntax): CallSignatureSyntax;
        static create1(): CallSignatureSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): CallSignatureSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): CallSignatureSyntax;
        withTypeParameterList(typeParameterList: TypeParameterListSyntax): CallSignatureSyntax;
        withParameterList(parameterList: ParameterListSyntax): CallSignatureSyntax;
        withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): CallSignatureSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ParameterListSyntax extends SyntaxNode {
        openParenToken: ISyntaxToken;
        parameters: ISeparatedSyntaxList;
        closeParenToken: ISyntaxToken;
        constructor(openParenToken: ISyntaxToken, parameters: ISeparatedSyntaxList, closeParenToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        update(openParenToken: ISyntaxToken, parameters: ISeparatedSyntaxList, closeParenToken: ISyntaxToken): ParameterListSyntax;
        static create(openParenToken: ISyntaxToken, closeParenToken: ISyntaxToken): ParameterListSyntax;
        static create1(): ParameterListSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ParameterListSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ParameterListSyntax;
        withOpenParenToken(openParenToken: ISyntaxToken): ParameterListSyntax;
        withParameters(parameters: ISeparatedSyntaxList): ParameterListSyntax;
        withParameter(parameter: ParameterSyntax): ParameterListSyntax;
        withCloseParenToken(closeParenToken: ISyntaxToken): ParameterListSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class TypeParameterListSyntax extends SyntaxNode {
        lessThanToken: ISyntaxToken;
        typeParameters: ISeparatedSyntaxList;
        greaterThanToken: ISyntaxToken;
        constructor(lessThanToken: ISyntaxToken, typeParameters: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        update(lessThanToken: ISyntaxToken, typeParameters: ISeparatedSyntaxList, greaterThanToken: ISyntaxToken): TypeParameterListSyntax;
        static create(lessThanToken: ISyntaxToken, greaterThanToken: ISyntaxToken): TypeParameterListSyntax;
        static create1(): TypeParameterListSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): TypeParameterListSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): TypeParameterListSyntax;
        withLessThanToken(lessThanToken: ISyntaxToken): TypeParameterListSyntax;
        withTypeParameters(typeParameters: ISeparatedSyntaxList): TypeParameterListSyntax;
        withTypeParameter(typeParameter: TypeParameterSyntax): TypeParameterListSyntax;
        withGreaterThanToken(greaterThanToken: ISyntaxToken): TypeParameterListSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class TypeParameterSyntax extends SyntaxNode {
        identifier: ISyntaxToken;
        constraint: ConstraintSyntax;
        constructor(identifier: ISyntaxToken, constraint: ConstraintSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        update(identifier: ISyntaxToken, constraint: ConstraintSyntax): TypeParameterSyntax;
        static create(identifier: ISyntaxToken): TypeParameterSyntax;
        static create1(identifier: ISyntaxToken): TypeParameterSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): TypeParameterSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): TypeParameterSyntax;
        withIdentifier(identifier: ISyntaxToken): TypeParameterSyntax;
        withConstraint(constraint: ConstraintSyntax): TypeParameterSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ConstraintSyntax extends SyntaxNode {
        extendsKeyword: ISyntaxToken;
        type: ITypeSyntax;
        constructor(extendsKeyword: ISyntaxToken, type: ITypeSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        update(extendsKeyword: ISyntaxToken, type: ITypeSyntax): ConstraintSyntax;
        static create1(type: ITypeSyntax): ConstraintSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ConstraintSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ConstraintSyntax;
        withExtendsKeyword(extendsKeyword: ISyntaxToken): ConstraintSyntax;
        withType(type: ITypeSyntax): ConstraintSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ElseClauseSyntax extends SyntaxNode {
        elseKeyword: ISyntaxToken;
        statement: IStatementSyntax;
        constructor(elseKeyword: ISyntaxToken, statement: IStatementSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        update(elseKeyword: ISyntaxToken, statement: IStatementSyntax): ElseClauseSyntax;
        static create1(statement: IStatementSyntax): ElseClauseSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ElseClauseSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ElseClauseSyntax;
        withElseKeyword(elseKeyword: ISyntaxToken): ElseClauseSyntax;
        withStatement(statement: IStatementSyntax): ElseClauseSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class IfStatementSyntax extends SyntaxNode implements IStatementSyntax {
        ifKeyword: ISyntaxToken;
        openParenToken: ISyntaxToken;
        condition: IExpressionSyntax;
        closeParenToken: ISyntaxToken;
        statement: IStatementSyntax;
        elseClause: ElseClauseSyntax;
        constructor(ifKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax, elseClause: ElseClauseSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(ifKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax, elseClause: ElseClauseSyntax): IfStatementSyntax;
        static create(ifKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): IfStatementSyntax;
        static create1(condition: IExpressionSyntax, statement: IStatementSyntax): IfStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): IfStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): IfStatementSyntax;
        withIfKeyword(ifKeyword: ISyntaxToken): IfStatementSyntax;
        withOpenParenToken(openParenToken: ISyntaxToken): IfStatementSyntax;
        withCondition(condition: IExpressionSyntax): IfStatementSyntax;
        withCloseParenToken(closeParenToken: ISyntaxToken): IfStatementSyntax;
        withStatement(statement: IStatementSyntax): IfStatementSyntax;
        withElseClause(elseClause: ElseClauseSyntax): IfStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ExpressionStatementSyntax extends SyntaxNode implements IStatementSyntax {
        expression: IExpressionSyntax;
        semicolonToken: ISyntaxToken;
        constructor(expression: IExpressionSyntax, semicolonToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ExpressionStatementSyntax;
        static create1(expression: IExpressionSyntax): ExpressionStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ExpressionStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ExpressionStatementSyntax;
        withExpression(expression: IExpressionSyntax): ExpressionStatementSyntax;
        withSemicolonToken(semicolonToken: ISyntaxToken): ExpressionStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ConstructorDeclarationSyntax extends SyntaxNode implements IClassElementSyntax {
        modifiers: ISyntaxList;
        constructorKeyword: ISyntaxToken;
        parameterList: ParameterListSyntax;
        block: BlockSyntax;
        semicolonToken: ISyntaxToken;
        constructor(modifiers: ISyntaxList, constructorKeyword: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isClassElement(): boolean;
        update(modifiers: ISyntaxList, constructorKeyword: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): ConstructorDeclarationSyntax;
        static create(constructorKeyword: ISyntaxToken, parameterList: ParameterListSyntax): ConstructorDeclarationSyntax;
        static create1(): ConstructorDeclarationSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ConstructorDeclarationSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ConstructorDeclarationSyntax;
        withModifiers(modifiers: ISyntaxList): ConstructorDeclarationSyntax;
        withModifier(modifier: ISyntaxToken): ConstructorDeclarationSyntax;
        withConstructorKeyword(constructorKeyword: ISyntaxToken): ConstructorDeclarationSyntax;
        withParameterList(parameterList: ParameterListSyntax): ConstructorDeclarationSyntax;
        withBlock(block: BlockSyntax): ConstructorDeclarationSyntax;
        withSemicolonToken(semicolonToken: ISyntaxToken): ConstructorDeclarationSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class MemberFunctionDeclarationSyntax extends SyntaxNode implements IMemberDeclarationSyntax {
        modifiers: ISyntaxList;
        propertyName: ISyntaxToken;
        callSignature: CallSignatureSyntax;
        block: BlockSyntax;
        semicolonToken: ISyntaxToken;
        constructor(modifiers: ISyntaxList, propertyName: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isMemberDeclaration(): boolean;
        isClassElement(): boolean;
        update(modifiers: ISyntaxList, propertyName: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, semicolonToken: ISyntaxToken): MemberFunctionDeclarationSyntax;
        static create(propertyName: ISyntaxToken, callSignature: CallSignatureSyntax): MemberFunctionDeclarationSyntax;
        static create1(propertyName: ISyntaxToken): MemberFunctionDeclarationSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): MemberFunctionDeclarationSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): MemberFunctionDeclarationSyntax;
        withModifiers(modifiers: ISyntaxList): MemberFunctionDeclarationSyntax;
        withModifier(modifier: ISyntaxToken): MemberFunctionDeclarationSyntax;
        withPropertyName(propertyName: ISyntaxToken): MemberFunctionDeclarationSyntax;
        withCallSignature(callSignature: CallSignatureSyntax): MemberFunctionDeclarationSyntax;
        withBlock(block: BlockSyntax): MemberFunctionDeclarationSyntax;
        withSemicolonToken(semicolonToken: ISyntaxToken): MemberFunctionDeclarationSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class GetAccessorSyntax extends SyntaxNode implements IMemberDeclarationSyntax, IPropertyAssignmentSyntax {
        modifiers: ISyntaxList;
        getKeyword: ISyntaxToken;
        propertyName: ISyntaxToken;
        parameterList: ParameterListSyntax;
        typeAnnotation: TypeAnnotationSyntax;
        block: BlockSyntax;
        constructor(modifiers: ISyntaxList, getKeyword: ISyntaxToken, propertyName: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, block: BlockSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isMemberDeclaration(): boolean;
        isPropertyAssignment(): boolean;
        isClassElement(): boolean;
        update(modifiers: ISyntaxList, getKeyword: ISyntaxToken, propertyName: ISyntaxToken, parameterList: ParameterListSyntax, typeAnnotation: TypeAnnotationSyntax, block: BlockSyntax): GetAccessorSyntax;
        static create(getKeyword: ISyntaxToken, propertyName: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): GetAccessorSyntax;
        static create1(propertyName: ISyntaxToken): GetAccessorSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): GetAccessorSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): GetAccessorSyntax;
        withModifiers(modifiers: ISyntaxList): GetAccessorSyntax;
        withModifier(modifier: ISyntaxToken): GetAccessorSyntax;
        withGetKeyword(getKeyword: ISyntaxToken): GetAccessorSyntax;
        withPropertyName(propertyName: ISyntaxToken): GetAccessorSyntax;
        withParameterList(parameterList: ParameterListSyntax): GetAccessorSyntax;
        withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): GetAccessorSyntax;
        withBlock(block: BlockSyntax): GetAccessorSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class SetAccessorSyntax extends SyntaxNode implements IMemberDeclarationSyntax, IPropertyAssignmentSyntax {
        modifiers: ISyntaxList;
        setKeyword: ISyntaxToken;
        propertyName: ISyntaxToken;
        parameterList: ParameterListSyntax;
        block: BlockSyntax;
        constructor(modifiers: ISyntaxList, setKeyword: ISyntaxToken, propertyName: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isMemberDeclaration(): boolean;
        isPropertyAssignment(): boolean;
        isClassElement(): boolean;
        update(modifiers: ISyntaxList, setKeyword: ISyntaxToken, propertyName: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): SetAccessorSyntax;
        static create(setKeyword: ISyntaxToken, propertyName: ISyntaxToken, parameterList: ParameterListSyntax, block: BlockSyntax): SetAccessorSyntax;
        static create1(propertyName: ISyntaxToken): SetAccessorSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): SetAccessorSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): SetAccessorSyntax;
        withModifiers(modifiers: ISyntaxList): SetAccessorSyntax;
        withModifier(modifier: ISyntaxToken): SetAccessorSyntax;
        withSetKeyword(setKeyword: ISyntaxToken): SetAccessorSyntax;
        withPropertyName(propertyName: ISyntaxToken): SetAccessorSyntax;
        withParameterList(parameterList: ParameterListSyntax): SetAccessorSyntax;
        withBlock(block: BlockSyntax): SetAccessorSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class MemberVariableDeclarationSyntax extends SyntaxNode implements IMemberDeclarationSyntax {
        modifiers: ISyntaxList;
        variableDeclarator: VariableDeclaratorSyntax;
        semicolonToken: ISyntaxToken;
        constructor(modifiers: ISyntaxList, variableDeclarator: VariableDeclaratorSyntax, semicolonToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isMemberDeclaration(): boolean;
        isClassElement(): boolean;
        update(modifiers: ISyntaxList, variableDeclarator: VariableDeclaratorSyntax, semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax;
        static create(variableDeclarator: VariableDeclaratorSyntax, semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax;
        static create1(variableDeclarator: VariableDeclaratorSyntax): MemberVariableDeclarationSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): MemberVariableDeclarationSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): MemberVariableDeclarationSyntax;
        withModifiers(modifiers: ISyntaxList): MemberVariableDeclarationSyntax;
        withModifier(modifier: ISyntaxToken): MemberVariableDeclarationSyntax;
        withVariableDeclarator(variableDeclarator: VariableDeclaratorSyntax): MemberVariableDeclarationSyntax;
        withSemicolonToken(semicolonToken: ISyntaxToken): MemberVariableDeclarationSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class IndexMemberDeclarationSyntax extends SyntaxNode implements IClassElementSyntax {
        modifiers: ISyntaxList;
        indexSignature: IndexSignatureSyntax;
        semicolonToken: ISyntaxToken;
        constructor(modifiers: ISyntaxList, indexSignature: IndexSignatureSyntax, semicolonToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isClassElement(): boolean;
        update(modifiers: ISyntaxList, indexSignature: IndexSignatureSyntax, semicolonToken: ISyntaxToken): IndexMemberDeclarationSyntax;
        static create(indexSignature: IndexSignatureSyntax, semicolonToken: ISyntaxToken): IndexMemberDeclarationSyntax;
        static create1(indexSignature: IndexSignatureSyntax): IndexMemberDeclarationSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): IndexMemberDeclarationSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): IndexMemberDeclarationSyntax;
        withModifiers(modifiers: ISyntaxList): IndexMemberDeclarationSyntax;
        withModifier(modifier: ISyntaxToken): IndexMemberDeclarationSyntax;
        withIndexSignature(indexSignature: IndexSignatureSyntax): IndexMemberDeclarationSyntax;
        withSemicolonToken(semicolonToken: ISyntaxToken): IndexMemberDeclarationSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ThrowStatementSyntax extends SyntaxNode implements IStatementSyntax {
        throwKeyword: ISyntaxToken;
        expression: IExpressionSyntax;
        semicolonToken: ISyntaxToken;
        constructor(throwKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(throwKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ThrowStatementSyntax;
        static create1(expression: IExpressionSyntax): ThrowStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ThrowStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ThrowStatementSyntax;
        withThrowKeyword(throwKeyword: ISyntaxToken): ThrowStatementSyntax;
        withExpression(expression: IExpressionSyntax): ThrowStatementSyntax;
        withSemicolonToken(semicolonToken: ISyntaxToken): ThrowStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ReturnStatementSyntax extends SyntaxNode implements IStatementSyntax {
        returnKeyword: ISyntaxToken;
        expression: IExpressionSyntax;
        semicolonToken: ISyntaxToken;
        constructor(returnKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(returnKeyword: ISyntaxToken, expression: IExpressionSyntax, semicolonToken: ISyntaxToken): ReturnStatementSyntax;
        static create(returnKeyword: ISyntaxToken, semicolonToken: ISyntaxToken): ReturnStatementSyntax;
        static create1(): ReturnStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ReturnStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ReturnStatementSyntax;
        withReturnKeyword(returnKeyword: ISyntaxToken): ReturnStatementSyntax;
        withExpression(expression: IExpressionSyntax): ReturnStatementSyntax;
        withSemicolonToken(semicolonToken: ISyntaxToken): ReturnStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ObjectCreationExpressionSyntax extends SyntaxNode implements IMemberExpressionSyntax {
        newKeyword: ISyntaxToken;
        expression: IMemberExpressionSyntax;
        argumentList: ArgumentListSyntax;
        constructor(newKeyword: ISyntaxToken, expression: IMemberExpressionSyntax, argumentList: ArgumentListSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isMemberExpression(): boolean;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
        isExpression(): boolean;
        update(newKeyword: ISyntaxToken, expression: IMemberExpressionSyntax, argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax;
        static create(newKeyword: ISyntaxToken, expression: IMemberExpressionSyntax): ObjectCreationExpressionSyntax;
        static create1(expression: IMemberExpressionSyntax): ObjectCreationExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ObjectCreationExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ObjectCreationExpressionSyntax;
        withNewKeyword(newKeyword: ISyntaxToken): ObjectCreationExpressionSyntax;
        withExpression(expression: IMemberExpressionSyntax): ObjectCreationExpressionSyntax;
        withArgumentList(argumentList: ArgumentListSyntax): ObjectCreationExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class SwitchStatementSyntax extends SyntaxNode implements IStatementSyntax {
        switchKeyword: ISyntaxToken;
        openParenToken: ISyntaxToken;
        expression: IExpressionSyntax;
        closeParenToken: ISyntaxToken;
        openBraceToken: ISyntaxToken;
        switchClauses: ISyntaxList;
        closeBraceToken: ISyntaxToken;
        constructor(switchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, openBraceToken: ISyntaxToken, switchClauses: ISyntaxList, closeBraceToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(switchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, openBraceToken: ISyntaxToken, switchClauses: ISyntaxList, closeBraceToken: ISyntaxToken): SwitchStatementSyntax;
        static create(switchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, openBraceToken: ISyntaxToken, closeBraceToken: ISyntaxToken): SwitchStatementSyntax;
        static create1(expression: IExpressionSyntax): SwitchStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): SwitchStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): SwitchStatementSyntax;
        withSwitchKeyword(switchKeyword: ISyntaxToken): SwitchStatementSyntax;
        withOpenParenToken(openParenToken: ISyntaxToken): SwitchStatementSyntax;
        withExpression(expression: IExpressionSyntax): SwitchStatementSyntax;
        withCloseParenToken(closeParenToken: ISyntaxToken): SwitchStatementSyntax;
        withOpenBraceToken(openBraceToken: ISyntaxToken): SwitchStatementSyntax;
        withSwitchClauses(switchClauses: ISyntaxList): SwitchStatementSyntax;
        withSwitchClause(switchClause: ISwitchClauseSyntax): SwitchStatementSyntax;
        withCloseBraceToken(closeBraceToken: ISyntaxToken): SwitchStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class CaseSwitchClauseSyntax extends SyntaxNode implements ISwitchClauseSyntax {
        caseKeyword: ISyntaxToken;
        expression: IExpressionSyntax;
        colonToken: ISyntaxToken;
        statements: ISyntaxList;
        constructor(caseKeyword: ISyntaxToken, expression: IExpressionSyntax, colonToken: ISyntaxToken, statements: ISyntaxList, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isSwitchClause(): boolean;
        update(caseKeyword: ISyntaxToken, expression: IExpressionSyntax, colonToken: ISyntaxToken, statements: ISyntaxList): CaseSwitchClauseSyntax;
        static create(caseKeyword: ISyntaxToken, expression: IExpressionSyntax, colonToken: ISyntaxToken): CaseSwitchClauseSyntax;
        static create1(expression: IExpressionSyntax): CaseSwitchClauseSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): CaseSwitchClauseSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): CaseSwitchClauseSyntax;
        withCaseKeyword(caseKeyword: ISyntaxToken): CaseSwitchClauseSyntax;
        withExpression(expression: IExpressionSyntax): CaseSwitchClauseSyntax;
        withColonToken(colonToken: ISyntaxToken): CaseSwitchClauseSyntax;
        withStatements(statements: ISyntaxList): CaseSwitchClauseSyntax;
        withStatement(statement: IStatementSyntax): CaseSwitchClauseSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class DefaultSwitchClauseSyntax extends SyntaxNode implements ISwitchClauseSyntax {
        defaultKeyword: ISyntaxToken;
        colonToken: ISyntaxToken;
        statements: ISyntaxList;
        constructor(defaultKeyword: ISyntaxToken, colonToken: ISyntaxToken, statements: ISyntaxList, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isSwitchClause(): boolean;
        update(defaultKeyword: ISyntaxToken, colonToken: ISyntaxToken, statements: ISyntaxList): DefaultSwitchClauseSyntax;
        static create(defaultKeyword: ISyntaxToken, colonToken: ISyntaxToken): DefaultSwitchClauseSyntax;
        static create1(): DefaultSwitchClauseSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): DefaultSwitchClauseSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): DefaultSwitchClauseSyntax;
        withDefaultKeyword(defaultKeyword: ISyntaxToken): DefaultSwitchClauseSyntax;
        withColonToken(colonToken: ISyntaxToken): DefaultSwitchClauseSyntax;
        withStatements(statements: ISyntaxList): DefaultSwitchClauseSyntax;
        withStatement(statement: IStatementSyntax): DefaultSwitchClauseSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class BreakStatementSyntax extends SyntaxNode implements IStatementSyntax {
        breakKeyword: ISyntaxToken;
        identifier: ISyntaxToken;
        semicolonToken: ISyntaxToken;
        constructor(breakKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(breakKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): BreakStatementSyntax;
        static create(breakKeyword: ISyntaxToken, semicolonToken: ISyntaxToken): BreakStatementSyntax;
        static create1(): BreakStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): BreakStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): BreakStatementSyntax;
        withBreakKeyword(breakKeyword: ISyntaxToken): BreakStatementSyntax;
        withIdentifier(identifier: ISyntaxToken): BreakStatementSyntax;
        withSemicolonToken(semicolonToken: ISyntaxToken): BreakStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ContinueStatementSyntax extends SyntaxNode implements IStatementSyntax {
        continueKeyword: ISyntaxToken;
        identifier: ISyntaxToken;
        semicolonToken: ISyntaxToken;
        constructor(continueKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(continueKeyword: ISyntaxToken, identifier: ISyntaxToken, semicolonToken: ISyntaxToken): ContinueStatementSyntax;
        static create(continueKeyword: ISyntaxToken, semicolonToken: ISyntaxToken): ContinueStatementSyntax;
        static create1(): ContinueStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ContinueStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ContinueStatementSyntax;
        withContinueKeyword(continueKeyword: ISyntaxToken): ContinueStatementSyntax;
        withIdentifier(identifier: ISyntaxToken): ContinueStatementSyntax;
        withSemicolonToken(semicolonToken: ISyntaxToken): ContinueStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ForStatementSyntax extends SyntaxNode implements IIterationStatementSyntax {
        forKeyword: ISyntaxToken;
        openParenToken: ISyntaxToken;
        variableDeclaration: VariableDeclarationSyntax;
        initializer: IExpressionSyntax;
        firstSemicolonToken: ISyntaxToken;
        condition: IExpressionSyntax;
        secondSemicolonToken: ISyntaxToken;
        incrementor: IExpressionSyntax;
        closeParenToken: ISyntaxToken;
        statement: IStatementSyntax;
        constructor(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, initializer: IExpressionSyntax, firstSemicolonToken: ISyntaxToken, condition: IExpressionSyntax, secondSemicolonToken: ISyntaxToken, incrementor: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isIterationStatement(): boolean;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, initializer: IExpressionSyntax, firstSemicolonToken: ISyntaxToken, condition: IExpressionSyntax, secondSemicolonToken: ISyntaxToken, incrementor: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForStatementSyntax;
        static create(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, firstSemicolonToken: ISyntaxToken, secondSemicolonToken: ISyntaxToken, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForStatementSyntax;
        static create1(statement: IStatementSyntax): ForStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ForStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ForStatementSyntax;
        withForKeyword(forKeyword: ISyntaxToken): ForStatementSyntax;
        withOpenParenToken(openParenToken: ISyntaxToken): ForStatementSyntax;
        withVariableDeclaration(variableDeclaration: VariableDeclarationSyntax): ForStatementSyntax;
        withInitializer(initializer: IExpressionSyntax): ForStatementSyntax;
        withFirstSemicolonToken(firstSemicolonToken: ISyntaxToken): ForStatementSyntax;
        withCondition(condition: IExpressionSyntax): ForStatementSyntax;
        withSecondSemicolonToken(secondSemicolonToken: ISyntaxToken): ForStatementSyntax;
        withIncrementor(incrementor: IExpressionSyntax): ForStatementSyntax;
        withCloseParenToken(closeParenToken: ISyntaxToken): ForStatementSyntax;
        withStatement(statement: IStatementSyntax): ForStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ForInStatementSyntax extends SyntaxNode implements IIterationStatementSyntax {
        forKeyword: ISyntaxToken;
        openParenToken: ISyntaxToken;
        variableDeclaration: VariableDeclarationSyntax;
        left: IExpressionSyntax;
        inKeyword: ISyntaxToken;
        expression: IExpressionSyntax;
        closeParenToken: ISyntaxToken;
        statement: IStatementSyntax;
        constructor(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, left: IExpressionSyntax, inKeyword: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isIterationStatement(): boolean;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, variableDeclaration: VariableDeclarationSyntax, left: IExpressionSyntax, inKeyword: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForInStatementSyntax;
        static create(forKeyword: ISyntaxToken, openParenToken: ISyntaxToken, inKeyword: ISyntaxToken, expression: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): ForInStatementSyntax;
        static create1(expression: IExpressionSyntax, statement: IStatementSyntax): ForInStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ForInStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ForInStatementSyntax;
        withForKeyword(forKeyword: ISyntaxToken): ForInStatementSyntax;
        withOpenParenToken(openParenToken: ISyntaxToken): ForInStatementSyntax;
        withVariableDeclaration(variableDeclaration: VariableDeclarationSyntax): ForInStatementSyntax;
        withLeft(left: IExpressionSyntax): ForInStatementSyntax;
        withInKeyword(inKeyword: ISyntaxToken): ForInStatementSyntax;
        withExpression(expression: IExpressionSyntax): ForInStatementSyntax;
        withCloseParenToken(closeParenToken: ISyntaxToken): ForInStatementSyntax;
        withStatement(statement: IStatementSyntax): ForInStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class WhileStatementSyntax extends SyntaxNode implements IIterationStatementSyntax {
        whileKeyword: ISyntaxToken;
        openParenToken: ISyntaxToken;
        condition: IExpressionSyntax;
        closeParenToken: ISyntaxToken;
        statement: IStatementSyntax;
        constructor(whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isIterationStatement(): boolean;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WhileStatementSyntax;
        static create1(condition: IExpressionSyntax, statement: IStatementSyntax): WhileStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): WhileStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): WhileStatementSyntax;
        withWhileKeyword(whileKeyword: ISyntaxToken): WhileStatementSyntax;
        withOpenParenToken(openParenToken: ISyntaxToken): WhileStatementSyntax;
        withCondition(condition: IExpressionSyntax): WhileStatementSyntax;
        withCloseParenToken(closeParenToken: ISyntaxToken): WhileStatementSyntax;
        withStatement(statement: IStatementSyntax): WhileStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class WithStatementSyntax extends SyntaxNode implements IStatementSyntax {
        withKeyword: ISyntaxToken;
        openParenToken: ISyntaxToken;
        condition: IExpressionSyntax;
        closeParenToken: ISyntaxToken;
        statement: IStatementSyntax;
        constructor(withKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(withKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, statement: IStatementSyntax): WithStatementSyntax;
        static create1(condition: IExpressionSyntax, statement: IStatementSyntax): WithStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): WithStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): WithStatementSyntax;
        withWithKeyword(withKeyword: ISyntaxToken): WithStatementSyntax;
        withOpenParenToken(openParenToken: ISyntaxToken): WithStatementSyntax;
        withCondition(condition: IExpressionSyntax): WithStatementSyntax;
        withCloseParenToken(closeParenToken: ISyntaxToken): WithStatementSyntax;
        withStatement(statement: IStatementSyntax): WithStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class EnumDeclarationSyntax extends SyntaxNode implements IModuleElementSyntax {
        modifiers: ISyntaxList;
        enumKeyword: ISyntaxToken;
        identifier: ISyntaxToken;
        openBraceToken: ISyntaxToken;
        enumElements: ISeparatedSyntaxList;
        closeBraceToken: ISyntaxToken;
        constructor(modifiers: ISyntaxList, enumKeyword: ISyntaxToken, identifier: ISyntaxToken, openBraceToken: ISyntaxToken, enumElements: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isModuleElement(): boolean;
        update(modifiers: ISyntaxList, enumKeyword: ISyntaxToken, identifier: ISyntaxToken, openBraceToken: ISyntaxToken, enumElements: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): EnumDeclarationSyntax;
        static create(enumKeyword: ISyntaxToken, identifier: ISyntaxToken, openBraceToken: ISyntaxToken, closeBraceToken: ISyntaxToken): EnumDeclarationSyntax;
        static create1(identifier: ISyntaxToken): EnumDeclarationSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): EnumDeclarationSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): EnumDeclarationSyntax;
        withModifiers(modifiers: ISyntaxList): EnumDeclarationSyntax;
        withModifier(modifier: ISyntaxToken): EnumDeclarationSyntax;
        withEnumKeyword(enumKeyword: ISyntaxToken): EnumDeclarationSyntax;
        withIdentifier(identifier: ISyntaxToken): EnumDeclarationSyntax;
        withOpenBraceToken(openBraceToken: ISyntaxToken): EnumDeclarationSyntax;
        withEnumElements(enumElements: ISeparatedSyntaxList): EnumDeclarationSyntax;
        withEnumElement(enumElement: EnumElementSyntax): EnumDeclarationSyntax;
        withCloseBraceToken(closeBraceToken: ISyntaxToken): EnumDeclarationSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class EnumElementSyntax extends SyntaxNode {
        propertyName: ISyntaxToken;
        equalsValueClause: EqualsValueClauseSyntax;
        constructor(propertyName: ISyntaxToken, equalsValueClause: EqualsValueClauseSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        update(propertyName: ISyntaxToken, equalsValueClause: EqualsValueClauseSyntax): EnumElementSyntax;
        static create(propertyName: ISyntaxToken): EnumElementSyntax;
        static create1(propertyName: ISyntaxToken): EnumElementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): EnumElementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): EnumElementSyntax;
        withPropertyName(propertyName: ISyntaxToken): EnumElementSyntax;
        withEqualsValueClause(equalsValueClause: EqualsValueClauseSyntax): EnumElementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class CastExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
        lessThanToken: ISyntaxToken;
        type: ITypeSyntax;
        greaterThanToken: ISyntaxToken;
        expression: IUnaryExpressionSyntax;
        constructor(lessThanToken: ISyntaxToken, type: ITypeSyntax, greaterThanToken: ISyntaxToken, expression: IUnaryExpressionSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isUnaryExpression(): boolean;
        isExpression(): boolean;
        update(lessThanToken: ISyntaxToken, type: ITypeSyntax, greaterThanToken: ISyntaxToken, expression: IUnaryExpressionSyntax): CastExpressionSyntax;
        static create1(type: ITypeSyntax, expression: IUnaryExpressionSyntax): CastExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): CastExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): CastExpressionSyntax;
        withLessThanToken(lessThanToken: ISyntaxToken): CastExpressionSyntax;
        withType(type: ITypeSyntax): CastExpressionSyntax;
        withGreaterThanToken(greaterThanToken: ISyntaxToken): CastExpressionSyntax;
        withExpression(expression: IUnaryExpressionSyntax): CastExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class ObjectLiteralExpressionSyntax extends SyntaxNode implements IPrimaryExpressionSyntax {
        openBraceToken: ISyntaxToken;
        propertyAssignments: ISeparatedSyntaxList;
        closeBraceToken: ISyntaxToken;
        constructor(openBraceToken: ISyntaxToken, propertyAssignments: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isPrimaryExpression(): boolean;
        isMemberExpression(): boolean;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
        isExpression(): boolean;
        update(openBraceToken: ISyntaxToken, propertyAssignments: ISeparatedSyntaxList, closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax;
        static create(openBraceToken: ISyntaxToken, closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax;
        static create1(): ObjectLiteralExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): ObjectLiteralExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): ObjectLiteralExpressionSyntax;
        withOpenBraceToken(openBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax;
        withPropertyAssignments(propertyAssignments: ISeparatedSyntaxList): ObjectLiteralExpressionSyntax;
        withPropertyAssignment(propertyAssignment: IPropertyAssignmentSyntax): ObjectLiteralExpressionSyntax;
        withCloseBraceToken(closeBraceToken: ISyntaxToken): ObjectLiteralExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class SimplePropertyAssignmentSyntax extends SyntaxNode implements IPropertyAssignmentSyntax {
        propertyName: ISyntaxToken;
        colonToken: ISyntaxToken;
        expression: IExpressionSyntax;
        constructor(propertyName: ISyntaxToken, colonToken: ISyntaxToken, expression: IExpressionSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isPropertyAssignment(): boolean;
        update(propertyName: ISyntaxToken, colonToken: ISyntaxToken, expression: IExpressionSyntax): SimplePropertyAssignmentSyntax;
        static create1(propertyName: ISyntaxToken, expression: IExpressionSyntax): SimplePropertyAssignmentSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): SimplePropertyAssignmentSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): SimplePropertyAssignmentSyntax;
        withPropertyName(propertyName: ISyntaxToken): SimplePropertyAssignmentSyntax;
        withColonToken(colonToken: ISyntaxToken): SimplePropertyAssignmentSyntax;
        withExpression(expression: IExpressionSyntax): SimplePropertyAssignmentSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class FunctionPropertyAssignmentSyntax extends SyntaxNode implements IPropertyAssignmentSyntax {
        propertyName: ISyntaxToken;
        callSignature: CallSignatureSyntax;
        block: BlockSyntax;
        constructor(propertyName: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isPropertyAssignment(): boolean;
        update(propertyName: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionPropertyAssignmentSyntax;
        static create1(propertyName: ISyntaxToken): FunctionPropertyAssignmentSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): FunctionPropertyAssignmentSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): FunctionPropertyAssignmentSyntax;
        withPropertyName(propertyName: ISyntaxToken): FunctionPropertyAssignmentSyntax;
        withCallSignature(callSignature: CallSignatureSyntax): FunctionPropertyAssignmentSyntax;
        withBlock(block: BlockSyntax): FunctionPropertyAssignmentSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class FunctionExpressionSyntax extends SyntaxNode implements IPrimaryExpressionSyntax {
        functionKeyword: ISyntaxToken;
        identifier: ISyntaxToken;
        callSignature: CallSignatureSyntax;
        block: BlockSyntax;
        constructor(functionKeyword: ISyntaxToken, identifier: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isPrimaryExpression(): boolean;
        isMemberExpression(): boolean;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
        isExpression(): boolean;
        update(functionKeyword: ISyntaxToken, identifier: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionExpressionSyntax;
        static create(functionKeyword: ISyntaxToken, callSignature: CallSignatureSyntax, block: BlockSyntax): FunctionExpressionSyntax;
        static create1(): FunctionExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): FunctionExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): FunctionExpressionSyntax;
        withFunctionKeyword(functionKeyword: ISyntaxToken): FunctionExpressionSyntax;
        withIdentifier(identifier: ISyntaxToken): FunctionExpressionSyntax;
        withCallSignature(callSignature: CallSignatureSyntax): FunctionExpressionSyntax;
        withBlock(block: BlockSyntax): FunctionExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class EmptyStatementSyntax extends SyntaxNode implements IStatementSyntax {
        semicolonToken: ISyntaxToken;
        constructor(semicolonToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(semicolonToken: ISyntaxToken): EmptyStatementSyntax;
        static create1(): EmptyStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): EmptyStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): EmptyStatementSyntax;
        withSemicolonToken(semicolonToken: ISyntaxToken): EmptyStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class TryStatementSyntax extends SyntaxNode implements IStatementSyntax {
        tryKeyword: ISyntaxToken;
        block: BlockSyntax;
        catchClause: CatchClauseSyntax;
        finallyClause: FinallyClauseSyntax;
        constructor(tryKeyword: ISyntaxToken, block: BlockSyntax, catchClause: CatchClauseSyntax, finallyClause: FinallyClauseSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(tryKeyword: ISyntaxToken, block: BlockSyntax, catchClause: CatchClauseSyntax, finallyClause: FinallyClauseSyntax): TryStatementSyntax;
        static create(tryKeyword: ISyntaxToken, block: BlockSyntax): TryStatementSyntax;
        static create1(): TryStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): TryStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): TryStatementSyntax;
        withTryKeyword(tryKeyword: ISyntaxToken): TryStatementSyntax;
        withBlock(block: BlockSyntax): TryStatementSyntax;
        withCatchClause(catchClause: CatchClauseSyntax): TryStatementSyntax;
        withFinallyClause(finallyClause: FinallyClauseSyntax): TryStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class CatchClauseSyntax extends SyntaxNode {
        catchKeyword: ISyntaxToken;
        openParenToken: ISyntaxToken;
        identifier: ISyntaxToken;
        typeAnnotation: TypeAnnotationSyntax;
        closeParenToken: ISyntaxToken;
        block: BlockSyntax;
        constructor(catchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, identifier: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, closeParenToken: ISyntaxToken, block: BlockSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        update(catchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, identifier: ISyntaxToken, typeAnnotation: TypeAnnotationSyntax, closeParenToken: ISyntaxToken, block: BlockSyntax): CatchClauseSyntax;
        static create(catchKeyword: ISyntaxToken, openParenToken: ISyntaxToken, identifier: ISyntaxToken, closeParenToken: ISyntaxToken, block: BlockSyntax): CatchClauseSyntax;
        static create1(identifier: ISyntaxToken): CatchClauseSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): CatchClauseSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): CatchClauseSyntax;
        withCatchKeyword(catchKeyword: ISyntaxToken): CatchClauseSyntax;
        withOpenParenToken(openParenToken: ISyntaxToken): CatchClauseSyntax;
        withIdentifier(identifier: ISyntaxToken): CatchClauseSyntax;
        withTypeAnnotation(typeAnnotation: TypeAnnotationSyntax): CatchClauseSyntax;
        withCloseParenToken(closeParenToken: ISyntaxToken): CatchClauseSyntax;
        withBlock(block: BlockSyntax): CatchClauseSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class FinallyClauseSyntax extends SyntaxNode {
        finallyKeyword: ISyntaxToken;
        block: BlockSyntax;
        constructor(finallyKeyword: ISyntaxToken, block: BlockSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        update(finallyKeyword: ISyntaxToken, block: BlockSyntax): FinallyClauseSyntax;
        static create1(): FinallyClauseSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): FinallyClauseSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): FinallyClauseSyntax;
        withFinallyKeyword(finallyKeyword: ISyntaxToken): FinallyClauseSyntax;
        withBlock(block: BlockSyntax): FinallyClauseSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class LabeledStatementSyntax extends SyntaxNode implements IStatementSyntax {
        identifier: ISyntaxToken;
        colonToken: ISyntaxToken;
        statement: IStatementSyntax;
        constructor(identifier: ISyntaxToken, colonToken: ISyntaxToken, statement: IStatementSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(identifier: ISyntaxToken, colonToken: ISyntaxToken, statement: IStatementSyntax): LabeledStatementSyntax;
        static create1(identifier: ISyntaxToken, statement: IStatementSyntax): LabeledStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): LabeledStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): LabeledStatementSyntax;
        withIdentifier(identifier: ISyntaxToken): LabeledStatementSyntax;
        withColonToken(colonToken: ISyntaxToken): LabeledStatementSyntax;
        withStatement(statement: IStatementSyntax): LabeledStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class DoStatementSyntax extends SyntaxNode implements IIterationStatementSyntax {
        doKeyword: ISyntaxToken;
        statement: IStatementSyntax;
        whileKeyword: ISyntaxToken;
        openParenToken: ISyntaxToken;
        condition: IExpressionSyntax;
        closeParenToken: ISyntaxToken;
        semicolonToken: ISyntaxToken;
        constructor(doKeyword: ISyntaxToken, statement: IStatementSyntax, whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, semicolonToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isIterationStatement(): boolean;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(doKeyword: ISyntaxToken, statement: IStatementSyntax, whileKeyword: ISyntaxToken, openParenToken: ISyntaxToken, condition: IExpressionSyntax, closeParenToken: ISyntaxToken, semicolonToken: ISyntaxToken): DoStatementSyntax;
        static create1(statement: IStatementSyntax, condition: IExpressionSyntax): DoStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): DoStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): DoStatementSyntax;
        withDoKeyword(doKeyword: ISyntaxToken): DoStatementSyntax;
        withStatement(statement: IStatementSyntax): DoStatementSyntax;
        withWhileKeyword(whileKeyword: ISyntaxToken): DoStatementSyntax;
        withOpenParenToken(openParenToken: ISyntaxToken): DoStatementSyntax;
        withCondition(condition: IExpressionSyntax): DoStatementSyntax;
        withCloseParenToken(closeParenToken: ISyntaxToken): DoStatementSyntax;
        withSemicolonToken(semicolonToken: ISyntaxToken): DoStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class TypeOfExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
        typeOfKeyword: ISyntaxToken;
        expression: IUnaryExpressionSyntax;
        constructor(typeOfKeyword: ISyntaxToken, expression: IUnaryExpressionSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isUnaryExpression(): boolean;
        isExpression(): boolean;
        update(typeOfKeyword: ISyntaxToken, expression: IUnaryExpressionSyntax): TypeOfExpressionSyntax;
        static create1(expression: IUnaryExpressionSyntax): TypeOfExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): TypeOfExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): TypeOfExpressionSyntax;
        withTypeOfKeyword(typeOfKeyword: ISyntaxToken): TypeOfExpressionSyntax;
        withExpression(expression: IUnaryExpressionSyntax): TypeOfExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class DeleteExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
        deleteKeyword: ISyntaxToken;
        expression: IUnaryExpressionSyntax;
        constructor(deleteKeyword: ISyntaxToken, expression: IUnaryExpressionSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isUnaryExpression(): boolean;
        isExpression(): boolean;
        update(deleteKeyword: ISyntaxToken, expression: IUnaryExpressionSyntax): DeleteExpressionSyntax;
        static create1(expression: IUnaryExpressionSyntax): DeleteExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): DeleteExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): DeleteExpressionSyntax;
        withDeleteKeyword(deleteKeyword: ISyntaxToken): DeleteExpressionSyntax;
        withExpression(expression: IUnaryExpressionSyntax): DeleteExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class VoidExpressionSyntax extends SyntaxNode implements IUnaryExpressionSyntax {
        voidKeyword: ISyntaxToken;
        expression: IUnaryExpressionSyntax;
        constructor(voidKeyword: ISyntaxToken, expression: IUnaryExpressionSyntax, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isUnaryExpression(): boolean;
        isExpression(): boolean;
        update(voidKeyword: ISyntaxToken, expression: IUnaryExpressionSyntax): VoidExpressionSyntax;
        static create1(expression: IUnaryExpressionSyntax): VoidExpressionSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): VoidExpressionSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): VoidExpressionSyntax;
        withVoidKeyword(voidKeyword: ISyntaxToken): VoidExpressionSyntax;
        withExpression(expression: IUnaryExpressionSyntax): VoidExpressionSyntax;
        isTypeScriptSpecific(): boolean;
    }
    class DebuggerStatementSyntax extends SyntaxNode implements IStatementSyntax {
        debuggerKeyword: ISyntaxToken;
        semicolonToken: ISyntaxToken;
        constructor(debuggerKeyword: ISyntaxToken, semicolonToken: ISyntaxToken, parsedInStrictMode: boolean);
        accept(visitor: ISyntaxVisitor): any;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(slot: number): ISyntaxElement;
        isStatement(): boolean;
        isModuleElement(): boolean;
        update(debuggerKeyword: ISyntaxToken, semicolonToken: ISyntaxToken): DebuggerStatementSyntax;
        static create1(): DebuggerStatementSyntax;
        withLeadingTrivia(trivia: ISyntaxTriviaList): DebuggerStatementSyntax;
        withTrailingTrivia(trivia: ISyntaxTriviaList): DebuggerStatementSyntax;
        withDebuggerKeyword(debuggerKeyword: ISyntaxToken): DebuggerStatementSyntax;
        withSemicolonToken(semicolonToken: ISyntaxToken): DebuggerStatementSyntax;
        isTypeScriptSpecific(): boolean;
    }
}
declare module TypeScript {
    class SyntaxRewriter implements ISyntaxVisitor {
        visitToken(token: ISyntaxToken): ISyntaxToken;
        visitNode(node: SyntaxNode): SyntaxNode;
        visitNodeOrToken(node: ISyntaxNodeOrToken): ISyntaxNodeOrToken;
        visitList(list: ISyntaxList): ISyntaxList;
        visitSeparatedList(list: ISeparatedSyntaxList): ISeparatedSyntaxList;
        visitSourceUnit(node: SourceUnitSyntax): any;
        visitExternalModuleReference(node: ExternalModuleReferenceSyntax): any;
        visitModuleNameModuleReference(node: ModuleNameModuleReferenceSyntax): any;
        visitImportDeclaration(node: ImportDeclarationSyntax): any;
        visitExportAssignment(node: ExportAssignmentSyntax): any;
        visitClassDeclaration(node: ClassDeclarationSyntax): any;
        visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): any;
        visitHeritageClause(node: HeritageClauseSyntax): any;
        visitModuleDeclaration(node: ModuleDeclarationSyntax): any;
        visitFunctionDeclaration(node: FunctionDeclarationSyntax): any;
        visitVariableStatement(node: VariableStatementSyntax): any;
        visitVariableDeclaration(node: VariableDeclarationSyntax): any;
        visitVariableDeclarator(node: VariableDeclaratorSyntax): any;
        visitEqualsValueClause(node: EqualsValueClauseSyntax): any;
        visitPrefixUnaryExpression(node: PrefixUnaryExpressionSyntax): any;
        visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): any;
        visitOmittedExpression(node: OmittedExpressionSyntax): any;
        visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): any;
        visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): any;
        visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): any;
        visitQualifiedName(node: QualifiedNameSyntax): any;
        visitTypeArgumentList(node: TypeArgumentListSyntax): any;
        visitConstructorType(node: ConstructorTypeSyntax): any;
        visitFunctionType(node: FunctionTypeSyntax): any;
        visitObjectType(node: ObjectTypeSyntax): any;
        visitArrayType(node: ArrayTypeSyntax): any;
        visitGenericType(node: GenericTypeSyntax): any;
        visitTypeQuery(node: TypeQuerySyntax): any;
        visitTypeAnnotation(node: TypeAnnotationSyntax): any;
        visitBlock(node: BlockSyntax): any;
        visitParameter(node: ParameterSyntax): any;
        visitMemberAccessExpression(node: MemberAccessExpressionSyntax): any;
        visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): any;
        visitElementAccessExpression(node: ElementAccessExpressionSyntax): any;
        visitInvocationExpression(node: InvocationExpressionSyntax): any;
        visitArgumentList(node: ArgumentListSyntax): any;
        visitBinaryExpression(node: BinaryExpressionSyntax): any;
        visitConditionalExpression(node: ConditionalExpressionSyntax): any;
        visitConstructSignature(node: ConstructSignatureSyntax): any;
        visitMethodSignature(node: MethodSignatureSyntax): any;
        visitIndexSignature(node: IndexSignatureSyntax): any;
        visitPropertySignature(node: PropertySignatureSyntax): any;
        visitCallSignature(node: CallSignatureSyntax): any;
        visitParameterList(node: ParameterListSyntax): any;
        visitTypeParameterList(node: TypeParameterListSyntax): any;
        visitTypeParameter(node: TypeParameterSyntax): any;
        visitConstraint(node: ConstraintSyntax): any;
        visitElseClause(node: ElseClauseSyntax): any;
        visitIfStatement(node: IfStatementSyntax): any;
        visitExpressionStatement(node: ExpressionStatementSyntax): any;
        visitConstructorDeclaration(node: ConstructorDeclarationSyntax): any;
        visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): any;
        visitGetAccessor(node: GetAccessorSyntax): any;
        visitSetAccessor(node: SetAccessorSyntax): any;
        visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): any;
        visitIndexMemberDeclaration(node: IndexMemberDeclarationSyntax): any;
        visitThrowStatement(node: ThrowStatementSyntax): any;
        visitReturnStatement(node: ReturnStatementSyntax): any;
        visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): any;
        visitSwitchStatement(node: SwitchStatementSyntax): any;
        visitCaseSwitchClause(node: CaseSwitchClauseSyntax): any;
        visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): any;
        visitBreakStatement(node: BreakStatementSyntax): any;
        visitContinueStatement(node: ContinueStatementSyntax): any;
        visitForStatement(node: ForStatementSyntax): any;
        visitForInStatement(node: ForInStatementSyntax): any;
        visitWhileStatement(node: WhileStatementSyntax): any;
        visitWithStatement(node: WithStatementSyntax): any;
        visitEnumDeclaration(node: EnumDeclarationSyntax): any;
        visitEnumElement(node: EnumElementSyntax): any;
        visitCastExpression(node: CastExpressionSyntax): any;
        visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): any;
        visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): any;
        visitFunctionPropertyAssignment(node: FunctionPropertyAssignmentSyntax): any;
        visitFunctionExpression(node: FunctionExpressionSyntax): any;
        visitEmptyStatement(node: EmptyStatementSyntax): any;
        visitTryStatement(node: TryStatementSyntax): any;
        visitCatchClause(node: CatchClauseSyntax): any;
        visitFinallyClause(node: FinallyClauseSyntax): any;
        visitLabeledStatement(node: LabeledStatementSyntax): any;
        visitDoStatement(node: DoStatementSyntax): any;
        visitTypeOfExpression(node: TypeOfExpressionSyntax): any;
        visitDeleteExpression(node: DeleteExpressionSyntax): any;
        visitVoidExpression(node: VoidExpressionSyntax): any;
        visitDebuggerStatement(node: DebuggerStatementSyntax): any;
    }
}
declare module TypeScript {
    class SyntaxDedenter extends SyntaxRewriter {
        private dedentationAmount;
        private minimumIndent;
        private options;
        private lastTriviaWasNewLine;
        constructor(dedentFirstToken: boolean, dedentationAmount: number, minimumIndent: number, options: FormattingOptions);
        private abort();
        private isAborted();
        visitToken(token: ISyntaxToken): ISyntaxToken;
        private dedentTriviaList(triviaList);
        private dedentSegment(segment, hasFollowingNewLineTrivia);
        private dedentWhitespace(trivia, hasFollowingNewLineTrivia);
        private dedentMultiLineComment(trivia);
        static dedentNode(node: ISyntaxNode, dedentFirstToken: boolean, dedentAmount: number, minimumIndent: number, options: FormattingOptions): ISyntaxNode;
    }
}
declare module TypeScript {
    class SyntaxIndenter extends SyntaxRewriter {
        private indentationAmount;
        private options;
        private lastTriviaWasNewLine;
        private indentationTrivia;
        constructor(indentFirstToken: boolean, indentationAmount: number, options: FormattingOptions);
        visitToken(token: ISyntaxToken): ISyntaxToken;
        indentTriviaList(triviaList: ISyntaxTriviaList): ISyntaxTriviaList;
        private indentSegment(segment);
        private indentWhitespace(trivia, indentThisTrivia, result);
        private indentSingleLineOrSkippedText(trivia, indentThisTrivia, result);
        private indentMultiLineComment(trivia, indentThisTrivia, result);
        static indentNode(node: ISyntaxNode, indentFirstToken: boolean, indentAmount: number, options: FormattingOptions): SyntaxNode;
        static indentNodes(nodes: SyntaxNode[], indentFirstToken: boolean, indentAmount: number, options: FormattingOptions): SyntaxNode[];
    }
}
declare module TypeScript.Syntax {
    class VariableWidthTokenWithNoTrivia implements ISyntaxToken {
        private _sourceText;
        private _fullStart;
        tokenKind: SyntaxKind;
        private _textOrWidth;
        constructor(sourceText: ISimpleText, fullStart: number, kind: SyntaxKind, textOrWidth: any);
        clone(): ISyntaxToken;
        isNode(): boolean;
        isToken(): boolean;
        isList(): boolean;
        isSeparatedList(): boolean;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(index: number): ISyntaxElement;
        fullWidth(): number;
        private start();
        private end();
        width(): number;
        text(): string;
        fullText(): string;
        value(): any;
        valueText(): string;
        hasLeadingTrivia(): boolean;
        hasLeadingComment(): boolean;
        hasLeadingNewLine(): boolean;
        hasLeadingSkippedText(): boolean;
        leadingTriviaWidth(): number;
        leadingTrivia(): ISyntaxTriviaList;
        hasTrailingTrivia(): boolean;
        hasTrailingComment(): boolean;
        hasTrailingNewLine(): boolean;
        hasTrailingSkippedText(): boolean;
        trailingTriviaWidth(): number;
        trailingTrivia(): ISyntaxTriviaList;
        hasSkippedToken(): boolean;
        toJSON(key: any): any;
        firstToken(): ISyntaxToken;
        lastToken(): ISyntaxToken;
        isTypeScriptSpecific(): boolean;
        isIncrementallyUnusable(): boolean;
        accept(visitor: ISyntaxVisitor): any;
        private realize();
        collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken;
        withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken;
        isExpression(): boolean;
        isPrimaryExpression(): boolean;
        isMemberExpression(): boolean;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
    }
    class VariableWidthTokenWithLeadingTrivia implements ISyntaxToken {
        private _sourceText;
        private _fullStart;
        tokenKind: SyntaxKind;
        private _leadingTriviaInfo;
        private _textOrWidth;
        constructor(sourceText: ISimpleText, fullStart: number, kind: SyntaxKind, leadingTriviaInfo: number, textOrWidth: any);
        clone(): ISyntaxToken;
        isNode(): boolean;
        isToken(): boolean;
        isList(): boolean;
        isSeparatedList(): boolean;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(index: number): ISyntaxElement;
        fullWidth(): number;
        private start();
        private end();
        width(): number;
        text(): string;
        fullText(): string;
        value(): any;
        valueText(): string;
        hasLeadingTrivia(): boolean;
        hasLeadingComment(): boolean;
        hasLeadingNewLine(): boolean;
        hasLeadingSkippedText(): boolean;
        leadingTriviaWidth(): number;
        leadingTrivia(): ISyntaxTriviaList;
        hasTrailingTrivia(): boolean;
        hasTrailingComment(): boolean;
        hasTrailingNewLine(): boolean;
        hasTrailingSkippedText(): boolean;
        trailingTriviaWidth(): number;
        trailingTrivia(): ISyntaxTriviaList;
        hasSkippedToken(): boolean;
        toJSON(key: any): any;
        firstToken(): ISyntaxToken;
        lastToken(): ISyntaxToken;
        isTypeScriptSpecific(): boolean;
        isIncrementallyUnusable(): boolean;
        accept(visitor: ISyntaxVisitor): any;
        private realize();
        collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken;
        withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken;
        isExpression(): boolean;
        isPrimaryExpression(): boolean;
        isMemberExpression(): boolean;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
    }
    class VariableWidthTokenWithTrailingTrivia implements ISyntaxToken {
        private _sourceText;
        private _fullStart;
        tokenKind: SyntaxKind;
        private _textOrWidth;
        private _trailingTriviaInfo;
        constructor(sourceText: ISimpleText, fullStart: number, kind: SyntaxKind, textOrWidth: any, trailingTriviaInfo: number);
        clone(): ISyntaxToken;
        isNode(): boolean;
        isToken(): boolean;
        isList(): boolean;
        isSeparatedList(): boolean;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(index: number): ISyntaxElement;
        fullWidth(): number;
        private start();
        private end();
        width(): number;
        text(): string;
        fullText(): string;
        value(): any;
        valueText(): string;
        hasLeadingTrivia(): boolean;
        hasLeadingComment(): boolean;
        hasLeadingNewLine(): boolean;
        hasLeadingSkippedText(): boolean;
        leadingTriviaWidth(): number;
        leadingTrivia(): ISyntaxTriviaList;
        hasTrailingTrivia(): boolean;
        hasTrailingComment(): boolean;
        hasTrailingNewLine(): boolean;
        hasTrailingSkippedText(): boolean;
        trailingTriviaWidth(): number;
        trailingTrivia(): ISyntaxTriviaList;
        hasSkippedToken(): boolean;
        toJSON(key: any): any;
        firstToken(): ISyntaxToken;
        lastToken(): ISyntaxToken;
        isTypeScriptSpecific(): boolean;
        isIncrementallyUnusable(): boolean;
        accept(visitor: ISyntaxVisitor): any;
        private realize();
        collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken;
        withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken;
        isExpression(): boolean;
        isPrimaryExpression(): boolean;
        isMemberExpression(): boolean;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
    }
    class VariableWidthTokenWithLeadingAndTrailingTrivia implements ISyntaxToken {
        private _sourceText;
        private _fullStart;
        tokenKind: SyntaxKind;
        private _leadingTriviaInfo;
        private _textOrWidth;
        private _trailingTriviaInfo;
        constructor(sourceText: ISimpleText, fullStart: number, kind: SyntaxKind, leadingTriviaInfo: number, textOrWidth: any, trailingTriviaInfo: number);
        clone(): ISyntaxToken;
        isNode(): boolean;
        isToken(): boolean;
        isList(): boolean;
        isSeparatedList(): boolean;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(index: number): ISyntaxElement;
        fullWidth(): number;
        private start();
        private end();
        width(): number;
        text(): string;
        fullText(): string;
        value(): any;
        valueText(): string;
        hasLeadingTrivia(): boolean;
        hasLeadingComment(): boolean;
        hasLeadingNewLine(): boolean;
        hasLeadingSkippedText(): boolean;
        leadingTriviaWidth(): number;
        leadingTrivia(): ISyntaxTriviaList;
        hasTrailingTrivia(): boolean;
        hasTrailingComment(): boolean;
        hasTrailingNewLine(): boolean;
        hasTrailingSkippedText(): boolean;
        trailingTriviaWidth(): number;
        trailingTrivia(): ISyntaxTriviaList;
        hasSkippedToken(): boolean;
        toJSON(key: any): any;
        firstToken(): ISyntaxToken;
        lastToken(): ISyntaxToken;
        isTypeScriptSpecific(): boolean;
        isIncrementallyUnusable(): boolean;
        accept(visitor: ISyntaxVisitor): any;
        private realize();
        collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken;
        withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken;
        isExpression(): boolean;
        isPrimaryExpression(): boolean;
        isMemberExpression(): boolean;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
    }
    class FixedWidthTokenWithNoTrivia implements ISyntaxToken {
        tokenKind: SyntaxKind;
        constructor(kind: SyntaxKind);
        clone(): ISyntaxToken;
        isNode(): boolean;
        isToken(): boolean;
        isList(): boolean;
        isSeparatedList(): boolean;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(index: number): ISyntaxElement;
        fullWidth(): number;
        width(): number;
        text(): string;
        fullText(): string;
        value(): any;
        valueText(): string;
        hasLeadingTrivia(): boolean;
        hasLeadingComment(): boolean;
        hasLeadingNewLine(): boolean;
        hasLeadingSkippedText(): boolean;
        leadingTriviaWidth(): number;
        leadingTrivia(): ISyntaxTriviaList;
        hasTrailingTrivia(): boolean;
        hasTrailingComment(): boolean;
        hasTrailingNewLine(): boolean;
        hasTrailingSkippedText(): boolean;
        trailingTriviaWidth(): number;
        trailingTrivia(): ISyntaxTriviaList;
        hasSkippedToken(): boolean;
        toJSON(key: any): any;
        firstToken(): ISyntaxToken;
        lastToken(): ISyntaxToken;
        isTypeScriptSpecific(): boolean;
        isIncrementallyUnusable(): boolean;
        accept(visitor: ISyntaxVisitor): any;
        private realize();
        collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken;
        withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken;
        isExpression(): boolean;
        isPrimaryExpression(): boolean;
        isMemberExpression(): boolean;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
    }
    class FixedWidthTokenWithLeadingTrivia implements ISyntaxToken {
        private _sourceText;
        private _fullStart;
        tokenKind: SyntaxKind;
        private _leadingTriviaInfo;
        constructor(sourceText: ISimpleText, fullStart: number, kind: SyntaxKind, leadingTriviaInfo: number);
        clone(): ISyntaxToken;
        isNode(): boolean;
        isToken(): boolean;
        isList(): boolean;
        isSeparatedList(): boolean;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(index: number): ISyntaxElement;
        fullWidth(): number;
        private start();
        private end();
        width(): number;
        text(): string;
        fullText(): string;
        value(): any;
        valueText(): string;
        hasLeadingTrivia(): boolean;
        hasLeadingComment(): boolean;
        hasLeadingNewLine(): boolean;
        hasLeadingSkippedText(): boolean;
        leadingTriviaWidth(): number;
        leadingTrivia(): ISyntaxTriviaList;
        hasTrailingTrivia(): boolean;
        hasTrailingComment(): boolean;
        hasTrailingNewLine(): boolean;
        hasTrailingSkippedText(): boolean;
        trailingTriviaWidth(): number;
        trailingTrivia(): ISyntaxTriviaList;
        hasSkippedToken(): boolean;
        toJSON(key: any): any;
        firstToken(): ISyntaxToken;
        lastToken(): ISyntaxToken;
        isTypeScriptSpecific(): boolean;
        isIncrementallyUnusable(): boolean;
        accept(visitor: ISyntaxVisitor): any;
        private realize();
        collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken;
        withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken;
        isExpression(): boolean;
        isPrimaryExpression(): boolean;
        isMemberExpression(): boolean;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
    }
    class FixedWidthTokenWithTrailingTrivia implements ISyntaxToken {
        private _sourceText;
        private _fullStart;
        tokenKind: SyntaxKind;
        private _trailingTriviaInfo;
        constructor(sourceText: ISimpleText, fullStart: number, kind: SyntaxKind, trailingTriviaInfo: number);
        clone(): ISyntaxToken;
        isNode(): boolean;
        isToken(): boolean;
        isList(): boolean;
        isSeparatedList(): boolean;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(index: number): ISyntaxElement;
        fullWidth(): number;
        private start();
        private end();
        width(): number;
        text(): string;
        fullText(): string;
        value(): any;
        valueText(): string;
        hasLeadingTrivia(): boolean;
        hasLeadingComment(): boolean;
        hasLeadingNewLine(): boolean;
        hasLeadingSkippedText(): boolean;
        leadingTriviaWidth(): number;
        leadingTrivia(): ISyntaxTriviaList;
        hasTrailingTrivia(): boolean;
        hasTrailingComment(): boolean;
        hasTrailingNewLine(): boolean;
        hasTrailingSkippedText(): boolean;
        trailingTriviaWidth(): number;
        trailingTrivia(): ISyntaxTriviaList;
        hasSkippedToken(): boolean;
        toJSON(key: any): any;
        firstToken(): ISyntaxToken;
        lastToken(): ISyntaxToken;
        isTypeScriptSpecific(): boolean;
        isIncrementallyUnusable(): boolean;
        accept(visitor: ISyntaxVisitor): any;
        private realize();
        collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken;
        withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken;
        isExpression(): boolean;
        isPrimaryExpression(): boolean;
        isMemberExpression(): boolean;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
    }
    class FixedWidthTokenWithLeadingAndTrailingTrivia implements ISyntaxToken {
        private _sourceText;
        private _fullStart;
        tokenKind: SyntaxKind;
        private _leadingTriviaInfo;
        private _trailingTriviaInfo;
        constructor(sourceText: ISimpleText, fullStart: number, kind: SyntaxKind, leadingTriviaInfo: number, trailingTriviaInfo: number);
        clone(): ISyntaxToken;
        isNode(): boolean;
        isToken(): boolean;
        isList(): boolean;
        isSeparatedList(): boolean;
        kind(): SyntaxKind;
        childCount(): number;
        childAt(index: number): ISyntaxElement;
        fullWidth(): number;
        private start();
        private end();
        width(): number;
        text(): string;
        fullText(): string;
        value(): any;
        valueText(): string;
        hasLeadingTrivia(): boolean;
        hasLeadingComment(): boolean;
        hasLeadingNewLine(): boolean;
        hasLeadingSkippedText(): boolean;
        leadingTriviaWidth(): number;
        leadingTrivia(): ISyntaxTriviaList;
        hasTrailingTrivia(): boolean;
        hasTrailingComment(): boolean;
        hasTrailingNewLine(): boolean;
        hasTrailingSkippedText(): boolean;
        trailingTriviaWidth(): number;
        trailingTrivia(): ISyntaxTriviaList;
        hasSkippedToken(): boolean;
        toJSON(key: any): any;
        firstToken(): ISyntaxToken;
        lastToken(): ISyntaxToken;
        isTypeScriptSpecific(): boolean;
        isIncrementallyUnusable(): boolean;
        accept(visitor: ISyntaxVisitor): any;
        private realize();
        collectTextElements(elements: string[]): void;
        private findTokenInternal(parent, position, fullStart);
        withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken;
        withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken;
        isExpression(): boolean;
        isPrimaryExpression(): boolean;
        isMemberExpression(): boolean;
        isPostfixExpression(): boolean;
        isUnaryExpression(): boolean;
    }
    function fixedWidthToken(sourceText: ISimpleText, fullStart: number, kind: SyntaxKind, leadingTriviaInfo: number, trailingTriviaInfo: number): ISyntaxToken;
    function variableWidthToken(sourceText: ISimpleText, fullStart: number, kind: SyntaxKind, leadingTriviaInfo: number, width: number, trailingTriviaInfo: number): ISyntaxToken;
}
declare module TypeScript {
    interface ISyntaxToken extends ISyntaxNodeOrToken, INameSyntax, IPrimaryExpressionSyntax {
        tokenKind: SyntaxKind;
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
        leadingTrivia(): ISyntaxTriviaList;
        trailingTrivia(): ISyntaxTriviaList;
        withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken;
        withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken;
        clone(): ISyntaxToken;
    }
    interface ITokenInfo {
        leadingTrivia?: ISyntaxTrivia[];
        text?: string;
        trailingTrivia?: ISyntaxTrivia[];
    }
}
declare module TypeScript.Syntax {
    function isExpression(token: ISyntaxToken): boolean;
    function realizeToken(token: ISyntaxToken): ISyntaxToken;
    function convertToIdentifierName(token: ISyntaxToken): ISyntaxToken;
    function tokenToJSON(token: ISyntaxToken): any;
    function value(token: ISyntaxToken): any;
    function massageEscapes(text: string): string;
    function valueText(token: ISyntaxToken): string;
    function emptyToken(kind: SyntaxKind): ISyntaxToken;
    function token(kind: SyntaxKind, info?: ITokenInfo): ISyntaxToken;
    function identifier(text: string, info?: ITokenInfo): ISyntaxToken;
}
declare module TypeScript {
    class SyntaxTokenReplacer extends SyntaxRewriter {
        private token1;
        private token2;
        constructor(token1: ISyntaxToken, token2: ISyntaxToken);
        visitToken(token: ISyntaxToken): ISyntaxToken;
        visitNode(node: SyntaxNode): SyntaxNode;
        visitList(list: ISyntaxList): ISyntaxList;
        visitSeparatedList(list: ISeparatedSyntaxList): ISeparatedSyntaxList;
    }
}
declare module TypeScript {
    interface ISyntaxTrivia {
        kind(): SyntaxKind;
        isWhitespace(): boolean;
        isComment(): boolean;
        isNewLine(): boolean;
        isSkippedToken(): boolean;
        fullWidth(): number;
        fullText(): string;
        skippedToken(): ISyntaxToken;
    }
}
declare module TypeScript.Syntax {
    function deferredTrivia(kind: SyntaxKind, text: ISimpleText, fullStart: number, fullWidth: number): ISyntaxTrivia;
    function trivia(kind: SyntaxKind, text: string): ISyntaxTrivia;
    function skippedTokenTrivia(token: ISyntaxToken): ISyntaxTrivia;
    function spaces(count: number): ISyntaxTrivia;
    function whitespace(text: string): ISyntaxTrivia;
    function multiLineComment(text: string): ISyntaxTrivia;
    function singleLineComment(text: string): ISyntaxTrivia;
    var spaceTrivia: ISyntaxTrivia;
    var lineFeedTrivia: ISyntaxTrivia;
    var carriageReturnTrivia: ISyntaxTrivia;
    var carriageReturnLineFeedTrivia: ISyntaxTrivia;
    function splitMultiLineCommentTriviaIntoMultipleLines(trivia: ISyntaxTrivia): string[];
}
declare module TypeScript {
    interface ISyntaxTriviaList {
        count(): number;
        syntaxTriviaAt(index: number): ISyntaxTrivia;
        fullWidth(): number;
        fullText(): string;
        hasComment(): boolean;
        hasNewLine(): boolean;
        hasSkippedToken(): boolean;
        last(): ISyntaxTrivia;
        toArray(): ISyntaxTrivia[];
        concat(trivia: ISyntaxTriviaList): ISyntaxTriviaList;
        collectTextElements(elements: string[]): void;
    }
}
declare module TypeScript.Syntax {
    var emptyTriviaList: ISyntaxTriviaList;
    function triviaList(trivia: ISyntaxTrivia[]): ISyntaxTriviaList;
    var spaceTriviaList: ISyntaxTriviaList;
}
declare module TypeScript {
    class SyntaxUtilities {
        static isAngleBracket(positionedElement: PositionedElement): boolean;
        static getToken(list: ISyntaxList, kind: SyntaxKind): ISyntaxToken;
        static containsToken(list: ISyntaxList, kind: SyntaxKind): boolean;
        static hasExportKeyword(moduleElement: IModuleElementSyntax): boolean;
        static getExportKeyword(moduleElement: IModuleElementSyntax): ISyntaxToken;
        static isAmbientDeclarationSyntax(positionNode: PositionedNode): boolean;
    }
}
declare module TypeScript {
    interface ISyntaxVisitor {
        visitToken(token: ISyntaxToken): any;
        visitSourceUnit(node: SourceUnitSyntax): any;
        visitExternalModuleReference(node: ExternalModuleReferenceSyntax): any;
        visitModuleNameModuleReference(node: ModuleNameModuleReferenceSyntax): any;
        visitImportDeclaration(node: ImportDeclarationSyntax): any;
        visitExportAssignment(node: ExportAssignmentSyntax): any;
        visitClassDeclaration(node: ClassDeclarationSyntax): any;
        visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): any;
        visitHeritageClause(node: HeritageClauseSyntax): any;
        visitModuleDeclaration(node: ModuleDeclarationSyntax): any;
        visitFunctionDeclaration(node: FunctionDeclarationSyntax): any;
        visitVariableStatement(node: VariableStatementSyntax): any;
        visitVariableDeclaration(node: VariableDeclarationSyntax): any;
        visitVariableDeclarator(node: VariableDeclaratorSyntax): any;
        visitEqualsValueClause(node: EqualsValueClauseSyntax): any;
        visitPrefixUnaryExpression(node: PrefixUnaryExpressionSyntax): any;
        visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): any;
        visitOmittedExpression(node: OmittedExpressionSyntax): any;
        visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): any;
        visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): any;
        visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): any;
        visitQualifiedName(node: QualifiedNameSyntax): any;
        visitTypeArgumentList(node: TypeArgumentListSyntax): any;
        visitConstructorType(node: ConstructorTypeSyntax): any;
        visitFunctionType(node: FunctionTypeSyntax): any;
        visitObjectType(node: ObjectTypeSyntax): any;
        visitArrayType(node: ArrayTypeSyntax): any;
        visitGenericType(node: GenericTypeSyntax): any;
        visitTypeQuery(node: TypeQuerySyntax): any;
        visitTypeAnnotation(node: TypeAnnotationSyntax): any;
        visitBlock(node: BlockSyntax): any;
        visitParameter(node: ParameterSyntax): any;
        visitMemberAccessExpression(node: MemberAccessExpressionSyntax): any;
        visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): any;
        visitElementAccessExpression(node: ElementAccessExpressionSyntax): any;
        visitInvocationExpression(node: InvocationExpressionSyntax): any;
        visitArgumentList(node: ArgumentListSyntax): any;
        visitBinaryExpression(node: BinaryExpressionSyntax): any;
        visitConditionalExpression(node: ConditionalExpressionSyntax): any;
        visitConstructSignature(node: ConstructSignatureSyntax): any;
        visitMethodSignature(node: MethodSignatureSyntax): any;
        visitIndexSignature(node: IndexSignatureSyntax): any;
        visitPropertySignature(node: PropertySignatureSyntax): any;
        visitCallSignature(node: CallSignatureSyntax): any;
        visitParameterList(node: ParameterListSyntax): any;
        visitTypeParameterList(node: TypeParameterListSyntax): any;
        visitTypeParameter(node: TypeParameterSyntax): any;
        visitConstraint(node: ConstraintSyntax): any;
        visitElseClause(node: ElseClauseSyntax): any;
        visitIfStatement(node: IfStatementSyntax): any;
        visitExpressionStatement(node: ExpressionStatementSyntax): any;
        visitConstructorDeclaration(node: ConstructorDeclarationSyntax): any;
        visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): any;
        visitGetAccessor(node: GetAccessorSyntax): any;
        visitSetAccessor(node: SetAccessorSyntax): any;
        visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): any;
        visitIndexMemberDeclaration(node: IndexMemberDeclarationSyntax): any;
        visitThrowStatement(node: ThrowStatementSyntax): any;
        visitReturnStatement(node: ReturnStatementSyntax): any;
        visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): any;
        visitSwitchStatement(node: SwitchStatementSyntax): any;
        visitCaseSwitchClause(node: CaseSwitchClauseSyntax): any;
        visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): any;
        visitBreakStatement(node: BreakStatementSyntax): any;
        visitContinueStatement(node: ContinueStatementSyntax): any;
        visitForStatement(node: ForStatementSyntax): any;
        visitForInStatement(node: ForInStatementSyntax): any;
        visitWhileStatement(node: WhileStatementSyntax): any;
        visitWithStatement(node: WithStatementSyntax): any;
        visitEnumDeclaration(node: EnumDeclarationSyntax): any;
        visitEnumElement(node: EnumElementSyntax): any;
        visitCastExpression(node: CastExpressionSyntax): any;
        visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): any;
        visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): any;
        visitFunctionPropertyAssignment(node: FunctionPropertyAssignmentSyntax): any;
        visitFunctionExpression(node: FunctionExpressionSyntax): any;
        visitEmptyStatement(node: EmptyStatementSyntax): any;
        visitTryStatement(node: TryStatementSyntax): any;
        visitCatchClause(node: CatchClauseSyntax): any;
        visitFinallyClause(node: FinallyClauseSyntax): any;
        visitLabeledStatement(node: LabeledStatementSyntax): any;
        visitDoStatement(node: DoStatementSyntax): any;
        visitTypeOfExpression(node: TypeOfExpressionSyntax): any;
        visitDeleteExpression(node: DeleteExpressionSyntax): any;
        visitVoidExpression(node: VoidExpressionSyntax): any;
        visitDebuggerStatement(node: DebuggerStatementSyntax): any;
    }
    class SyntaxVisitor implements ISyntaxVisitor {
        defaultVisit(node: ISyntaxNodeOrToken): any;
        visitToken(token: ISyntaxToken): any;
        visitSourceUnit(node: SourceUnitSyntax): any;
        visitExternalModuleReference(node: ExternalModuleReferenceSyntax): any;
        visitModuleNameModuleReference(node: ModuleNameModuleReferenceSyntax): any;
        visitImportDeclaration(node: ImportDeclarationSyntax): any;
        visitExportAssignment(node: ExportAssignmentSyntax): any;
        visitClassDeclaration(node: ClassDeclarationSyntax): any;
        visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): any;
        visitHeritageClause(node: HeritageClauseSyntax): any;
        visitModuleDeclaration(node: ModuleDeclarationSyntax): any;
        visitFunctionDeclaration(node: FunctionDeclarationSyntax): any;
        visitVariableStatement(node: VariableStatementSyntax): any;
        visitVariableDeclaration(node: VariableDeclarationSyntax): any;
        visitVariableDeclarator(node: VariableDeclaratorSyntax): any;
        visitEqualsValueClause(node: EqualsValueClauseSyntax): any;
        visitPrefixUnaryExpression(node: PrefixUnaryExpressionSyntax): any;
        visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): any;
        visitOmittedExpression(node: OmittedExpressionSyntax): any;
        visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): any;
        visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): any;
        visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): any;
        visitQualifiedName(node: QualifiedNameSyntax): any;
        visitTypeArgumentList(node: TypeArgumentListSyntax): any;
        visitConstructorType(node: ConstructorTypeSyntax): any;
        visitFunctionType(node: FunctionTypeSyntax): any;
        visitObjectType(node: ObjectTypeSyntax): any;
        visitArrayType(node: ArrayTypeSyntax): any;
        visitGenericType(node: GenericTypeSyntax): any;
        visitTypeQuery(node: TypeQuerySyntax): any;
        visitTypeAnnotation(node: TypeAnnotationSyntax): any;
        visitBlock(node: BlockSyntax): any;
        visitParameter(node: ParameterSyntax): any;
        visitMemberAccessExpression(node: MemberAccessExpressionSyntax): any;
        visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): any;
        visitElementAccessExpression(node: ElementAccessExpressionSyntax): any;
        visitInvocationExpression(node: InvocationExpressionSyntax): any;
        visitArgumentList(node: ArgumentListSyntax): any;
        visitBinaryExpression(node: BinaryExpressionSyntax): any;
        visitConditionalExpression(node: ConditionalExpressionSyntax): any;
        visitConstructSignature(node: ConstructSignatureSyntax): any;
        visitMethodSignature(node: MethodSignatureSyntax): any;
        visitIndexSignature(node: IndexSignatureSyntax): any;
        visitPropertySignature(node: PropertySignatureSyntax): any;
        visitCallSignature(node: CallSignatureSyntax): any;
        visitParameterList(node: ParameterListSyntax): any;
        visitTypeParameterList(node: TypeParameterListSyntax): any;
        visitTypeParameter(node: TypeParameterSyntax): any;
        visitConstraint(node: ConstraintSyntax): any;
        visitElseClause(node: ElseClauseSyntax): any;
        visitIfStatement(node: IfStatementSyntax): any;
        visitExpressionStatement(node: ExpressionStatementSyntax): any;
        visitConstructorDeclaration(node: ConstructorDeclarationSyntax): any;
        visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): any;
        visitGetAccessor(node: GetAccessorSyntax): any;
        visitSetAccessor(node: SetAccessorSyntax): any;
        visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): any;
        visitIndexMemberDeclaration(node: IndexMemberDeclarationSyntax): any;
        visitThrowStatement(node: ThrowStatementSyntax): any;
        visitReturnStatement(node: ReturnStatementSyntax): any;
        visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): any;
        visitSwitchStatement(node: SwitchStatementSyntax): any;
        visitCaseSwitchClause(node: CaseSwitchClauseSyntax): any;
        visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): any;
        visitBreakStatement(node: BreakStatementSyntax): any;
        visitContinueStatement(node: ContinueStatementSyntax): any;
        visitForStatement(node: ForStatementSyntax): any;
        visitForInStatement(node: ForInStatementSyntax): any;
        visitWhileStatement(node: WhileStatementSyntax): any;
        visitWithStatement(node: WithStatementSyntax): any;
        visitEnumDeclaration(node: EnumDeclarationSyntax): any;
        visitEnumElement(node: EnumElementSyntax): any;
        visitCastExpression(node: CastExpressionSyntax): any;
        visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): any;
        visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): any;
        visitFunctionPropertyAssignment(node: FunctionPropertyAssignmentSyntax): any;
        visitFunctionExpression(node: FunctionExpressionSyntax): any;
        visitEmptyStatement(node: EmptyStatementSyntax): any;
        visitTryStatement(node: TryStatementSyntax): any;
        visitCatchClause(node: CatchClauseSyntax): any;
        visitFinallyClause(node: FinallyClauseSyntax): any;
        visitLabeledStatement(node: LabeledStatementSyntax): any;
        visitDoStatement(node: DoStatementSyntax): any;
        visitTypeOfExpression(node: TypeOfExpressionSyntax): any;
        visitDeleteExpression(node: DeleteExpressionSyntax): any;
        visitVoidExpression(node: VoidExpressionSyntax): any;
        visitDebuggerStatement(node: DebuggerStatementSyntax): any;
    }
}
declare module TypeScript {
    class SyntaxWalker implements ISyntaxVisitor {
        visitToken(token: ISyntaxToken): void;
        visitNode(node: SyntaxNode): void;
        visitNodeOrToken(nodeOrToken: ISyntaxNodeOrToken): void;
        private visitOptionalToken(token);
        visitOptionalNode(node: SyntaxNode): void;
        visitOptionalNodeOrToken(nodeOrToken: ISyntaxNodeOrToken): void;
        visitList(list: ISyntaxList): void;
        visitSeparatedList(list: ISeparatedSyntaxList): void;
        visitSourceUnit(node: SourceUnitSyntax): void;
        visitExternalModuleReference(node: ExternalModuleReferenceSyntax): void;
        visitModuleNameModuleReference(node: ModuleNameModuleReferenceSyntax): void;
        visitImportDeclaration(node: ImportDeclarationSyntax): void;
        visitExportAssignment(node: ExportAssignmentSyntax): void;
        visitClassDeclaration(node: ClassDeclarationSyntax): void;
        visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): void;
        visitHeritageClause(node: HeritageClauseSyntax): void;
        visitModuleDeclaration(node: ModuleDeclarationSyntax): void;
        visitFunctionDeclaration(node: FunctionDeclarationSyntax): void;
        visitVariableStatement(node: VariableStatementSyntax): void;
        visitVariableDeclaration(node: VariableDeclarationSyntax): void;
        visitVariableDeclarator(node: VariableDeclaratorSyntax): void;
        visitEqualsValueClause(node: EqualsValueClauseSyntax): void;
        visitPrefixUnaryExpression(node: PrefixUnaryExpressionSyntax): void;
        visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): void;
        visitOmittedExpression(node: OmittedExpressionSyntax): void;
        visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): void;
        visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): void;
        visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): void;
        visitQualifiedName(node: QualifiedNameSyntax): void;
        visitTypeArgumentList(node: TypeArgumentListSyntax): void;
        visitConstructorType(node: ConstructorTypeSyntax): void;
        visitFunctionType(node: FunctionTypeSyntax): void;
        visitObjectType(node: ObjectTypeSyntax): void;
        visitArrayType(node: ArrayTypeSyntax): void;
        visitGenericType(node: GenericTypeSyntax): void;
        visitTypeQuery(node: TypeQuerySyntax): void;
        visitTypeAnnotation(node: TypeAnnotationSyntax): void;
        visitBlock(node: BlockSyntax): void;
        visitParameter(node: ParameterSyntax): void;
        visitMemberAccessExpression(node: MemberAccessExpressionSyntax): void;
        visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): void;
        visitElementAccessExpression(node: ElementAccessExpressionSyntax): void;
        visitInvocationExpression(node: InvocationExpressionSyntax): void;
        visitArgumentList(node: ArgumentListSyntax): void;
        visitBinaryExpression(node: BinaryExpressionSyntax): void;
        visitConditionalExpression(node: ConditionalExpressionSyntax): void;
        visitConstructSignature(node: ConstructSignatureSyntax): void;
        visitMethodSignature(node: MethodSignatureSyntax): void;
        visitIndexSignature(node: IndexSignatureSyntax): void;
        visitPropertySignature(node: PropertySignatureSyntax): void;
        visitCallSignature(node: CallSignatureSyntax): void;
        visitParameterList(node: ParameterListSyntax): void;
        visitTypeParameterList(node: TypeParameterListSyntax): void;
        visitTypeParameter(node: TypeParameterSyntax): void;
        visitConstraint(node: ConstraintSyntax): void;
        visitElseClause(node: ElseClauseSyntax): void;
        visitIfStatement(node: IfStatementSyntax): void;
        visitExpressionStatement(node: ExpressionStatementSyntax): void;
        visitConstructorDeclaration(node: ConstructorDeclarationSyntax): void;
        visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): void;
        visitGetAccessor(node: GetAccessorSyntax): void;
        visitSetAccessor(node: SetAccessorSyntax): void;
        visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): void;
        visitIndexMemberDeclaration(node: IndexMemberDeclarationSyntax): void;
        visitThrowStatement(node: ThrowStatementSyntax): void;
        visitReturnStatement(node: ReturnStatementSyntax): void;
        visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): void;
        visitSwitchStatement(node: SwitchStatementSyntax): void;
        visitCaseSwitchClause(node: CaseSwitchClauseSyntax): void;
        visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): void;
        visitBreakStatement(node: BreakStatementSyntax): void;
        visitContinueStatement(node: ContinueStatementSyntax): void;
        visitForStatement(node: ForStatementSyntax): void;
        visitForInStatement(node: ForInStatementSyntax): void;
        visitWhileStatement(node: WhileStatementSyntax): void;
        visitWithStatement(node: WithStatementSyntax): void;
        visitEnumDeclaration(node: EnumDeclarationSyntax): void;
        visitEnumElement(node: EnumElementSyntax): void;
        visitCastExpression(node: CastExpressionSyntax): void;
        visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): void;
        visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): void;
        visitFunctionPropertyAssignment(node: FunctionPropertyAssignmentSyntax): void;
        visitFunctionExpression(node: FunctionExpressionSyntax): void;
        visitEmptyStatement(node: EmptyStatementSyntax): void;
        visitTryStatement(node: TryStatementSyntax): void;
        visitCatchClause(node: CatchClauseSyntax): void;
        visitFinallyClause(node: FinallyClauseSyntax): void;
        visitLabeledStatement(node: LabeledStatementSyntax): void;
        visitDoStatement(node: DoStatementSyntax): void;
        visitTypeOfExpression(node: TypeOfExpressionSyntax): void;
        visitDeleteExpression(node: DeleteExpressionSyntax): void;
        visitVoidExpression(node: VoidExpressionSyntax): void;
        visitDebuggerStatement(node: DebuggerStatementSyntax): void;
    }
}
declare module TypeScript {
    class PositionTrackingWalker extends SyntaxWalker {
        private _position;
        visitToken(token: ISyntaxToken): void;
        position(): number;
        skip(element: ISyntaxElement): void;
    }
}
declare module TypeScript {
    interface ITokenInformation {
        previousToken: ISyntaxToken;
        nextToken: ISyntaxToken;
    }
    class SyntaxInformationMap extends SyntaxWalker {
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
        static create(node: SyntaxNode, trackParents: boolean, trackPreviousToken: boolean): SyntaxInformationMap;
        visitNode(node: SyntaxNode): void;
        visitToken(token: ISyntaxToken): void;
        parent(element: ISyntaxElement): SyntaxNode;
        fullStart(element: ISyntaxElement): number;
        start(element: ISyntaxElement): number;
        end(element: ISyntaxElement): number;
        previousToken(token: ISyntaxToken): ISyntaxToken;
        tokenInformation(token: ISyntaxToken): ITokenInformation;
        firstTokenInLineContainingToken(token: ISyntaxToken): ISyntaxToken;
        isFirstTokenInLine(token: ISyntaxToken): boolean;
        private isFirstTokenInLineWorker(information);
    }
}
declare module TypeScript {
    class SyntaxNodeInvariantsChecker extends SyntaxWalker {
        private tokenTable;
        static checkInvariants(node: SyntaxNode): void;
        visitToken(token: ISyntaxToken): void;
    }
}
declare module TypeScript {
    class DepthLimitedWalker extends PositionTrackingWalker {
        private _depth;
        private _maximumDepth;
        constructor(maximumDepth: number);
        visitNode(node: SyntaxNode): void;
    }
}
declare module TypeScript.Parser {
    function parse(fileName: string, text: ISimpleText, isDeclaration: boolean, options: ParseOptions): SyntaxTree;
    function incrementalParse(oldSyntaxTree: SyntaxTree, textChangeRange: TextChangeRange, newText: ISimpleText): SyntaxTree;
}
declare module TypeScript {
    class Unicode {
        static unicodeES3IdentifierStart: number[];
        static unicodeES3IdentifierPart: number[];
        static unicodeES5IdentifierStart: number[];
        static unicodeES5IdentifierPart: number[];
        static lookupInUnicodeMap(code: number, map: number[]): boolean;
        static isIdentifierStart(code: number, languageVersion: LanguageVersion): boolean;
        static isIdentifierPart(code: number, languageVersion: LanguageVersion): boolean;
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
        constructor(sourceUnit: SourceUnitSyntax, isDeclaration: boolean, diagnostics: Diagnostic[], fileName: string, lineMap: LineMap, parseOtions: ParseOptions);
        toJSON(key: any): any;
        sourceUnit(): SourceUnitSyntax;
        isDeclaration(): boolean;
        private computeDiagnostics();
        diagnostics(): Diagnostic[];
        fileName(): string;
        lineMap(): LineMap;
        parseOptions(): ParseOptions;
        structuralEquals(tree: SyntaxTree): boolean;
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
    interface IRule {
        getOptions(): IOptions;
        isEnabled(): boolean;
        apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[];
        applyWithWalker(walker: RuleWalker): RuleFailure[];
    }
    class RuleFailurePosition {
        private position;
        private lineAndCharacter;
        constructor(position: number, lineAndCharacter: TypeScript.LineAndCharacter);
        getPosition(): number;
        getLineAndCharacter(): TypeScript.LineAndCharacter;
        toJson(): {
            position: number;
            line: number;
            character: number;
        };
        equals(ruleFailurePosition: RuleFailurePosition): boolean;
    }
    class RuleFailure {
        private fileName;
        private startPosition;
        private endPosition;
        private failure;
        private ruleName;
        constructor(syntaxTree: TypeScript.SyntaxTree, start: number, end: number, failure: string, ruleName: string);
        getFileName(): string;
        getRuleName(): string;
        getStartPosition(): RuleFailurePosition;
        getEndPosition(): RuleFailurePosition;
        getFailure(): string;
        toJson(): any;
        equals(ruleFailure: RuleFailure): boolean;
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
        constructor(syntaxTree: TypeScript.SyntaxTree, options: IOptions);
        getSyntaxTree(): TypeScript.SyntaxTree;
        getFailures(): RuleFailure[];
        positionAfter(...elements: TypeScript.ISyntaxElement[]): number;
        getOptions(): any;
        hasOption(option: string): boolean;
        createFailure(start: number, width: number, failure: string): RuleFailure;
        addFailure(failure: RuleFailure): void;
        private existsFailure(failure);
    }
}
declare module Lint {
    interface IEnableDisablePosition {
        isEnabled: boolean;
        position: number;
    }
    function loadRules(ruleConfiguration: {
        [x: string]: any;
    }, enableDisableRuleMap: {
        [x: string]: IEnableDisablePosition[];
    }, rulesDirectory?: string): IRule[];
    function findRule(name: string, rulesDirectory?: string): any;
}
declare module Lint.Configuration {
    function findConfiguration(configFile: string, inputFileLocation: string): any;
}
declare module Lint {
    interface IFormatter {
        format(failures: RuleFailure[]): string;
    }
}
declare module Lint {
    function findFormatter(name: string, formattersDirectory?: string): any;
}
declare module Lint {
    class EnableDisableRulesWalker extends RuleWalker {
        enableDisableRuleMap: {
            [x: string]: IEnableDisablePosition[];
        };
        visitToken(token: TypeScript.ISyntaxToken): void;
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
        information(): boolean;
        debug(): boolean;
        warning(): boolean;
        error(): boolean;
        fatal(): boolean;
        log(s: string): void;
    }
    function timeFunction(logger: ILogger, funcDescription: string, func: () => any): any;
}
declare module TypeScript {
    class Document {
        private _compiler;
        private _semanticInfoChain;
        fileName: string;
        referencedFiles: string[];
        private _scriptSnapshot;
        byteOrderMark: ByteOrderMark;
        version: number;
        isOpen: boolean;
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
        constructor(_compiler: TypeScriptCompiler, _semanticInfoChain: SemanticInfoChain, fileName: string, referencedFiles: string[], _scriptSnapshot: IScriptSnapshot, byteOrderMark: ByteOrderMark, version: number, isOpen: boolean, _syntaxTree: SyntaxTree, _topLevelDecl: PullDecl);
        invalidate(): void;
        isDeclareFile(): boolean;
        private cacheSyntaxTreeInfo(syntaxTree);
        private getLeadingComments(node);
        private getAmdDependency(comment);
        private hasImplicitImport(sourceUnitLeadingComments);
        private getImplicitImport(comment);
        private hasTopLevelImportOrExport(node);
        sourceUnit(): SourceUnit;
        diagnostics(): Diagnostic[];
        lineMap(): LineMap;
        isExternalModule(): boolean;
        amdDependencies(): string[];
        syntaxTree(): SyntaxTree;
        bloomFilter(): BloomFilter;
        emitToOwnOutputFile(): boolean;
        update(scriptSnapshot: IScriptSnapshot, version: number, isOpen: boolean, textChangeRange: TextChangeRange): Document;
        static create(compiler: TypeScriptCompiler, semanticInfoChain: SemanticInfoChain, fileName: string, scriptSnapshot: IScriptSnapshot, byteOrderMark: ByteOrderMark, version: number, isOpen: boolean, referencedFiles: string[]): Document;
        topLevelDecl(): PullDecl;
        _getDeclForAST(ast: AST): PullDecl;
        getEnclosingDecl(ast: AST): PullDecl;
        _setDeclForAST(ast: AST, decl: PullDecl): void;
        _getASTForDecl(decl: PullDecl): AST;
        _setASTForDecl(decl: PullDecl, ast: AST): void;
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
        getAllKeys(): string[];
        add(key: string, data: T): boolean;
        addOrUpdate(key: string, data: T): boolean;
        map(fn: (k: string, value: T, context: any) => void, context: any): void;
        every(fn: (k: string, value: T, context: any) => void, context: any): boolean;
        some(fn: (k: string, value: T, context: any) => void, context: any): boolean;
        count(): number;
        lookup(key: string): T;
        remove(key: string): void;
    }
    class IdentiferNameHashTable<T> extends StringHashTable<T> {
        getAllKeys(): string[];
        add(key: string, data: T): boolean;
        addOrUpdate(key: string, data: T): boolean;
        map(fn: (k: string, value: T, context: any) => void, context: any): void;
        every(fn: (k: string, value: T, context: any) => void, context: any): boolean;
        some(fn: (k: string, value: any, context: any) => void, context: any): boolean;
        lookup(key: string): T;
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
        _start: number;
        _end: number;
        constructor(_start: number, _end: number);
        start(): number;
        end(): number;
    }
    function structuralEqualsNotIncludingPosition(ast1: AST, ast2: AST): boolean;
    function structuralEqualsIncludingPosition(ast1: AST, ast2: AST): boolean;
    class AST implements IASTSpan {
        parent: AST;
        _start: number;
        _end: number;
        _trailingTriviaWidth: number;
        private _astID;
        private _preComments;
        private _postComments;
        constructor();
        syntaxID(): number;
        start(): number;
        end(): number;
        trailingTriviaWidth(): number;
        fileName(): string;
        kind(): SyntaxKind;
        preComments(): Comment[];
        postComments(): Comment[];
        setPreComments(comments: Comment[]): void;
        setPostComments(comments: Comment[]): void;
        width(): number;
        structuralEquals(ast: AST, includingPosition: boolean): boolean;
    }
    interface IASTToken extends AST {
        text(): string;
        valueText(): string;
    }
    class ISyntaxList2 extends AST {
        private _fileName;
        private members;
        constructor(_fileName: string, members: AST[]);
        childCount(): number;
        childAt(index: number): AST;
        fileName(): string;
        kind(): SyntaxKind;
        firstOrDefault(func: (v: AST, index: number) => boolean): AST;
        lastOrDefault(func: (v: AST, index: number) => boolean): AST;
        any(func: (v: AST) => boolean): boolean;
        structuralEquals(ast: ISyntaxList2, includingPosition: boolean): boolean;
    }
    class ISeparatedSyntaxList2 extends AST {
        private _fileName;
        private members;
        private _separatorCount;
        constructor(_fileName: string, members: AST[], _separatorCount: number);
        nonSeparatorCount(): number;
        separatorCount(): number;
        nonSeparatorAt(index: number): AST;
        nonSeparatorIndexOf(ast: AST): number;
        fileName(): string;
        kind(): SyntaxKind;
        structuralEquals(ast: ISeparatedSyntaxList2, includingPosition: boolean): boolean;
    }
    class SourceUnit extends AST {
        moduleElements: ISyntaxList2;
        private _fileName;
        constructor(moduleElements: ISyntaxList2, _fileName: string);
        fileName(): string;
        kind(): SyntaxKind;
        structuralEquals(ast: SourceUnit, includingPosition: boolean): boolean;
    }
    class Identifier extends AST implements IASTToken {
        private _text;
        private _valueText;
        constructor(_text: string);
        text(): string;
        valueText(): string;
        kind(): SyntaxKind;
        structuralEquals(ast: Identifier, includingPosition: boolean): boolean;
    }
    class LiteralExpression extends AST {
        private _nodeType;
        private _text;
        private _valueText;
        constructor(_nodeType: SyntaxKind, _text: string, _valueText: string);
        text(): string;
        valueText(): string;
        kind(): SyntaxKind;
        structuralEquals(ast: ParenthesizedExpression, includingPosition: boolean): boolean;
    }
    class ThisExpression extends AST implements IASTToken {
        private _text;
        private _valueText;
        constructor(_text: string, _valueText: string);
        text(): string;
        valueText(): string;
        kind(): SyntaxKind;
        structuralEquals(ast: ParenthesizedExpression, includingPosition: boolean): boolean;
    }
    class SuperExpression extends AST implements IASTToken {
        private _text;
        private _valueText;
        constructor(_text: string, _valueText: string);
        text(): string;
        valueText(): string;
        kind(): SyntaxKind;
        structuralEquals(ast: ParenthesizedExpression, includingPosition: boolean): boolean;
    }
    class NumericLiteral extends AST implements IASTToken {
        private _value;
        private _text;
        private _valueText;
        constructor(_value: number, _text: string, _valueText: string);
        text(): string;
        valueText(): string;
        value(): any;
        kind(): SyntaxKind;
        structuralEquals(ast: NumericLiteral, includingPosition: boolean): boolean;
    }
    class RegularExpressionLiteral extends AST implements IASTToken {
        private _text;
        private _valueText;
        constructor(_text: string, _valueText: string);
        text(): string;
        valueText(): string;
        kind(): SyntaxKind;
    }
    class StringLiteral extends AST implements IASTToken {
        private _text;
        private _valueText;
        constructor(_text: string, _valueText: string);
        text(): string;
        valueText(): string;
        kind(): SyntaxKind;
        structuralEquals(ast: StringLiteral, includingPosition: boolean): boolean;
    }
    class TypeAnnotation extends AST {
        type: AST;
        constructor(type: AST);
        kind(): SyntaxKind;
    }
    class BuiltInType extends AST implements IASTToken {
        private _nodeType;
        private _text;
        private _valueText;
        constructor(_nodeType: SyntaxKind, _text: string, _valueText: string);
        text(): string;
        valueText(): string;
        kind(): SyntaxKind;
    }
    class ExternalModuleReference extends AST {
        stringLiteral: StringLiteral;
        constructor(stringLiteral: StringLiteral);
        kind(): SyntaxKind;
    }
    class ModuleNameModuleReference extends AST {
        moduleName: AST;
        constructor(moduleName: AST);
        kind(): SyntaxKind;
    }
    class ImportDeclaration extends AST {
        modifiers: PullElementFlags[];
        identifier: Identifier;
        moduleReference: AST;
        constructor(modifiers: PullElementFlags[], identifier: Identifier, moduleReference: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: ImportDeclaration, includingPosition: boolean): boolean;
    }
    class ExportAssignment extends AST {
        identifier: Identifier;
        constructor(identifier: Identifier);
        kind(): SyntaxKind;
        structuralEquals(ast: ExportAssignment, includingPosition: boolean): boolean;
    }
    class TypeParameterList extends AST {
        typeParameters: ISeparatedSyntaxList2;
        constructor(typeParameters: ISeparatedSyntaxList2);
        kind(): SyntaxKind;
    }
    class ClassDeclaration extends AST {
        modifiers: PullElementFlags[];
        identifier: Identifier;
        typeParameterList: TypeParameterList;
        heritageClauses: ISyntaxList2;
        classElements: ISyntaxList2;
        closeBraceToken: ASTSpan;
        constructor(modifiers: PullElementFlags[], identifier: Identifier, typeParameterList: TypeParameterList, heritageClauses: ISyntaxList2, classElements: ISyntaxList2, closeBraceToken: ASTSpan);
        kind(): SyntaxKind;
        structuralEquals(ast: ClassDeclaration, includingPosition: boolean): boolean;
    }
    class InterfaceDeclaration extends AST {
        modifiers: PullElementFlags[];
        identifier: Identifier;
        typeParameterList: TypeParameterList;
        heritageClauses: ISyntaxList2;
        body: ObjectType;
        constructor(modifiers: PullElementFlags[], identifier: Identifier, typeParameterList: TypeParameterList, heritageClauses: ISyntaxList2, body: ObjectType);
        kind(): SyntaxKind;
        structuralEquals(ast: InterfaceDeclaration, includingPosition: boolean): boolean;
    }
    class HeritageClause extends AST {
        private _nodeType;
        typeNames: ISeparatedSyntaxList2;
        constructor(_nodeType: SyntaxKind, typeNames: ISeparatedSyntaxList2);
        kind(): SyntaxKind;
        structuralEquals(ast: HeritageClause, includingPosition: boolean): boolean;
    }
    class ModuleDeclaration extends AST {
        modifiers: PullElementFlags[];
        name: AST;
        stringLiteral: StringLiteral;
        moduleElements: ISyntaxList2;
        endingToken: ASTSpan;
        constructor(modifiers: PullElementFlags[], name: AST, stringLiteral: StringLiteral, moduleElements: ISyntaxList2, endingToken: ASTSpan);
        kind(): SyntaxKind;
        structuralEquals(ast: ModuleDeclaration, includingPosition: boolean): boolean;
    }
    class FunctionDeclaration extends AST {
        modifiers: PullElementFlags[];
        identifier: Identifier;
        callSignature: CallSignature;
        block: Block;
        constructor(modifiers: PullElementFlags[], identifier: Identifier, callSignature: CallSignature, block: Block);
        kind(): SyntaxKind;
        structuralEquals(ast: FunctionDeclaration, includingPosition: boolean): boolean;
    }
    class VariableStatement extends AST {
        modifiers: PullElementFlags[];
        declaration: VariableDeclaration;
        constructor(modifiers: PullElementFlags[], declaration: VariableDeclaration);
        kind(): SyntaxKind;
        structuralEquals(ast: VariableStatement, includingPosition: boolean): boolean;
    }
    class VariableDeclaration extends AST {
        declarators: ISeparatedSyntaxList2;
        constructor(declarators: ISeparatedSyntaxList2);
        kind(): SyntaxKind;
        structuralEquals(ast: VariableDeclaration, includingPosition: boolean): boolean;
    }
    class VariableDeclarator extends AST {
        propertyName: IASTToken;
        typeAnnotation: TypeAnnotation;
        equalsValueClause: EqualsValueClause;
        constructor(propertyName: IASTToken, typeAnnotation: TypeAnnotation, equalsValueClause: EqualsValueClause);
        kind(): SyntaxKind;
    }
    class EqualsValueClause extends AST {
        value: AST;
        constructor(value: AST);
        kind(): SyntaxKind;
    }
    class PrefixUnaryExpression extends AST {
        private _nodeType;
        operand: AST;
        constructor(_nodeType: SyntaxKind, operand: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: PrefixUnaryExpression, includingPosition: boolean): boolean;
    }
    class ArrayLiteralExpression extends AST {
        expressions: ISeparatedSyntaxList2;
        constructor(expressions: ISeparatedSyntaxList2);
        kind(): SyntaxKind;
        structuralEquals(ast: ArrayLiteralExpression, includingPosition: boolean): boolean;
    }
    class OmittedExpression extends AST {
        kind(): SyntaxKind;
        structuralEquals(ast: CatchClause, includingPosition: boolean): boolean;
    }
    class ParenthesizedExpression extends AST {
        openParenTrailingComments: Comment[];
        expression: AST;
        constructor(openParenTrailingComments: Comment[], expression: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: ParenthesizedExpression, includingPosition: boolean): boolean;
    }
    interface ICallExpression extends IASTSpan {
        expression: AST;
        argumentList: ArgumentList;
    }
    class SimpleArrowFunctionExpression extends AST {
        identifier: Identifier;
        block: Block;
        expression: AST;
        constructor(identifier: Identifier, block: Block, expression: AST);
        kind(): SyntaxKind;
    }
    class ParenthesizedArrowFunctionExpression extends AST {
        callSignature: CallSignature;
        block: Block;
        expression: AST;
        constructor(callSignature: CallSignature, block: Block, expression: AST);
        kind(): SyntaxKind;
    }
    class QualifiedName extends AST {
        left: AST;
        right: Identifier;
        constructor(left: AST, right: Identifier);
        kind(): SyntaxKind;
        structuralEquals(ast: QualifiedName, includingPosition: boolean): boolean;
    }
    class ParameterList extends AST {
        openParenTrailingComments: Comment[];
        parameters: ISeparatedSyntaxList2;
        constructor(openParenTrailingComments: Comment[], parameters: ISeparatedSyntaxList2);
        kind(): SyntaxKind;
    }
    class ConstructorType extends AST {
        typeParameterList: TypeParameterList;
        parameterList: ParameterList;
        type: AST;
        constructor(typeParameterList: TypeParameterList, parameterList: ParameterList, type: AST);
        kind(): SyntaxKind;
    }
    class FunctionType extends AST {
        typeParameterList: TypeParameterList;
        parameterList: ParameterList;
        type: AST;
        constructor(typeParameterList: TypeParameterList, parameterList: ParameterList, type: AST);
        kind(): SyntaxKind;
    }
    class ObjectType extends AST {
        typeMembers: ISeparatedSyntaxList2;
        constructor(typeMembers: ISeparatedSyntaxList2);
        kind(): SyntaxKind;
        structuralEquals(ast: ObjectType, includingPosition: boolean): boolean;
    }
    class ArrayType extends AST {
        type: AST;
        constructor(type: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: ArrayType, includingPosition: boolean): boolean;
    }
    class TypeArgumentList extends AST {
        typeArguments: ISeparatedSyntaxList2;
        constructor(typeArguments: ISeparatedSyntaxList2);
        kind(): SyntaxKind;
    }
    class GenericType extends AST {
        name: AST;
        typeArgumentList: TypeArgumentList;
        constructor(name: AST, typeArgumentList: TypeArgumentList);
        kind(): SyntaxKind;
        structuralEquals(ast: GenericType, includingPosition: boolean): boolean;
    }
    class TypeQuery extends AST {
        name: AST;
        constructor(name: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: TypeQuery, includingPosition: boolean): boolean;
    }
    class Block extends AST {
        statements: ISyntaxList2;
        closeBraceLeadingComments: Comment[];
        closeBraceToken: IASTSpan;
        constructor(statements: ISyntaxList2, closeBraceLeadingComments: Comment[], closeBraceToken: IASTSpan);
        kind(): SyntaxKind;
        structuralEquals(ast: Block, includingPosition: boolean): boolean;
    }
    class Parameter extends AST {
        dotDotDotToken: ASTSpan;
        modifiers: PullElementFlags[];
        identifier: Identifier;
        questionToken: ASTSpan;
        typeAnnotation: TypeAnnotation;
        equalsValueClause: EqualsValueClause;
        constructor(dotDotDotToken: ASTSpan, modifiers: PullElementFlags[], identifier: Identifier, questionToken: ASTSpan, typeAnnotation: TypeAnnotation, equalsValueClause: EqualsValueClause);
        kind(): SyntaxKind;
    }
    class MemberAccessExpression extends AST {
        expression: AST;
        name: Identifier;
        constructor(expression: AST, name: Identifier);
        kind(): SyntaxKind;
        structuralEquals(ast: MemberAccessExpression, includingPosition: boolean): boolean;
    }
    class PostfixUnaryExpression extends AST {
        private _nodeType;
        operand: AST;
        constructor(_nodeType: SyntaxKind, operand: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: PostfixUnaryExpression, includingPosition: boolean): boolean;
    }
    class ElementAccessExpression extends AST {
        expression: AST;
        argumentExpression: AST;
        constructor(expression: AST, argumentExpression: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: ElementAccessExpression, includingPosition: boolean): boolean;
    }
    class InvocationExpression extends AST implements ICallExpression {
        expression: AST;
        argumentList: ArgumentList;
        constructor(expression: AST, argumentList: ArgumentList);
        kind(): SyntaxKind;
        structuralEquals(ast: InvocationExpression, includingPosition: boolean): boolean;
    }
    class ArgumentList extends AST {
        typeArgumentList: TypeArgumentList;
        arguments: ISeparatedSyntaxList2;
        closeParenToken: ASTSpan;
        constructor(typeArgumentList: TypeArgumentList, arguments: ISeparatedSyntaxList2, closeParenToken: ASTSpan);
        kind(): SyntaxKind;
    }
    class BinaryExpression extends AST {
        private _nodeType;
        left: AST;
        right: AST;
        constructor(_nodeType: SyntaxKind, left: AST, right: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: BinaryExpression, includingPosition: boolean): boolean;
    }
    class ConditionalExpression extends AST {
        condition: AST;
        whenTrue: AST;
        whenFalse: AST;
        constructor(condition: AST, whenTrue: AST, whenFalse: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: ConditionalExpression, includingPosition: boolean): boolean;
    }
    class ConstructSignature extends AST {
        callSignature: CallSignature;
        constructor(callSignature: CallSignature);
        kind(): SyntaxKind;
    }
    class MethodSignature extends AST {
        propertyName: IASTToken;
        questionToken: ASTSpan;
        callSignature: CallSignature;
        constructor(propertyName: IASTToken, questionToken: ASTSpan, callSignature: CallSignature);
        kind(): SyntaxKind;
    }
    class IndexSignature extends AST {
        parameter: Parameter;
        typeAnnotation: TypeAnnotation;
        constructor(parameter: Parameter, typeAnnotation: TypeAnnotation);
        kind(): SyntaxKind;
    }
    class PropertySignature extends AST {
        propertyName: IASTToken;
        questionToken: ASTSpan;
        typeAnnotation: TypeAnnotation;
        constructor(propertyName: IASTToken, questionToken: ASTSpan, typeAnnotation: TypeAnnotation);
        kind(): SyntaxKind;
    }
    class CallSignature extends AST {
        typeParameterList: TypeParameterList;
        parameterList: ParameterList;
        typeAnnotation: TypeAnnotation;
        constructor(typeParameterList: TypeParameterList, parameterList: ParameterList, typeAnnotation: TypeAnnotation);
        kind(): SyntaxKind;
    }
    class TypeParameter extends AST {
        identifier: Identifier;
        constraint: Constraint;
        constructor(identifier: Identifier, constraint: Constraint);
        kind(): SyntaxKind;
        structuralEquals(ast: TypeParameter, includingPosition: boolean): boolean;
    }
    class Constraint extends AST {
        type: AST;
        constructor(type: AST);
        kind(): SyntaxKind;
    }
    class ElseClause extends AST {
        statement: AST;
        constructor(statement: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: ElseClause, includingPosition: boolean): boolean;
    }
    class IfStatement extends AST {
        condition: AST;
        statement: AST;
        elseClause: ElseClause;
        constructor(condition: AST, statement: AST, elseClause: ElseClause);
        kind(): SyntaxKind;
        structuralEquals(ast: IfStatement, includingPosition: boolean): boolean;
    }
    class ExpressionStatement extends AST {
        expression: AST;
        constructor(expression: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: ExpressionStatement, includingPosition: boolean): boolean;
    }
    class ConstructorDeclaration extends AST {
        parameterList: ParameterList;
        block: Block;
        constructor(parameterList: ParameterList, block: Block);
        kind(): SyntaxKind;
    }
    class MemberFunctionDeclaration extends AST {
        modifiers: PullElementFlags[];
        propertyName: IASTToken;
        callSignature: CallSignature;
        block: Block;
        constructor(modifiers: PullElementFlags[], propertyName: IASTToken, callSignature: CallSignature, block: Block);
        kind(): SyntaxKind;
    }
    class GetAccessor extends AST {
        modifiers: PullElementFlags[];
        propertyName: IASTToken;
        parameterList: ParameterList;
        typeAnnotation: TypeAnnotation;
        block: Block;
        constructor(modifiers: PullElementFlags[], propertyName: IASTToken, parameterList: ParameterList, typeAnnotation: TypeAnnotation, block: Block);
        kind(): SyntaxKind;
    }
    class SetAccessor extends AST {
        modifiers: PullElementFlags[];
        propertyName: IASTToken;
        parameterList: ParameterList;
        block: Block;
        constructor(modifiers: PullElementFlags[], propertyName: IASTToken, parameterList: ParameterList, block: Block);
        kind(): SyntaxKind;
    }
    class MemberVariableDeclaration extends AST {
        modifiers: PullElementFlags[];
        variableDeclarator: VariableDeclarator;
        constructor(modifiers: PullElementFlags[], variableDeclarator: VariableDeclarator);
        kind(): SyntaxKind;
    }
    class IndexMemberDeclaration extends AST {
        indexSignature: IndexSignature;
        constructor(indexSignature: IndexSignature);
        kind(): SyntaxKind;
    }
    class ThrowStatement extends AST {
        expression: AST;
        constructor(expression: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: ThrowStatement, includingPosition: boolean): boolean;
    }
    class ReturnStatement extends AST {
        expression: AST;
        constructor(expression: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: ReturnStatement, includingPosition: boolean): boolean;
    }
    class ObjectCreationExpression extends AST implements ICallExpression {
        expression: AST;
        argumentList: ArgumentList;
        constructor(expression: AST, argumentList: ArgumentList);
        kind(): SyntaxKind;
        structuralEquals(ast: ObjectCreationExpression, includingPosition: boolean): boolean;
    }
    class SwitchStatement extends AST {
        expression: AST;
        closeParenToken: ASTSpan;
        switchClauses: ISyntaxList2;
        constructor(expression: AST, closeParenToken: ASTSpan, switchClauses: ISyntaxList2);
        kind(): SyntaxKind;
        structuralEquals(ast: SwitchStatement, includingPosition: boolean): boolean;
    }
    class CaseSwitchClause extends AST {
        expression: AST;
        statements: ISyntaxList2;
        constructor(expression: AST, statements: ISyntaxList2);
        kind(): SyntaxKind;
        structuralEquals(ast: CaseSwitchClause, includingPosition: boolean): boolean;
    }
    class DefaultSwitchClause extends AST {
        statements: ISyntaxList2;
        constructor(statements: ISyntaxList2);
        kind(): SyntaxKind;
        structuralEquals(ast: DefaultSwitchClause, includingPosition: boolean): boolean;
    }
    class BreakStatement extends AST {
        identifier: Identifier;
        constructor(identifier: Identifier);
        kind(): SyntaxKind;
        structuralEquals(ast: BreakStatement, includingPosition: boolean): boolean;
    }
    class ContinueStatement extends AST {
        identifier: Identifier;
        constructor(identifier: Identifier);
        kind(): SyntaxKind;
        structuralEquals(ast: ContinueStatement, includingPosition: boolean): boolean;
    }
    class ForStatement extends AST {
        variableDeclaration: VariableDeclaration;
        initializer: AST;
        condition: AST;
        incrementor: AST;
        statement: AST;
        constructor(variableDeclaration: VariableDeclaration, initializer: AST, condition: AST, incrementor: AST, statement: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: ForStatement, includingPosition: boolean): boolean;
    }
    class ForInStatement extends AST {
        variableDeclaration: VariableDeclaration;
        left: AST;
        expression: AST;
        statement: AST;
        constructor(variableDeclaration: VariableDeclaration, left: AST, expression: AST, statement: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: ForInStatement, includingPosition: boolean): boolean;
    }
    class WhileStatement extends AST {
        condition: AST;
        statement: AST;
        constructor(condition: AST, statement: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: WhileStatement, includingPosition: boolean): boolean;
    }
    class WithStatement extends AST {
        condition: AST;
        statement: AST;
        constructor(condition: AST, statement: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: WithStatement, includingPosition: boolean): boolean;
    }
    class EnumDeclaration extends AST {
        modifiers: PullElementFlags[];
        identifier: Identifier;
        enumElements: ISeparatedSyntaxList2;
        constructor(modifiers: PullElementFlags[], identifier: Identifier, enumElements: ISeparatedSyntaxList2);
        kind(): SyntaxKind;
    }
    class EnumElement extends AST {
        propertyName: IASTToken;
        equalsValueClause: EqualsValueClause;
        constructor(propertyName: IASTToken, equalsValueClause: EqualsValueClause);
        kind(): SyntaxKind;
    }
    class CastExpression extends AST {
        type: AST;
        expression: AST;
        constructor(type: AST, expression: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: CastExpression, includingPosition: boolean): boolean;
    }
    class ObjectLiteralExpression extends AST {
        propertyAssignments: ISeparatedSyntaxList2;
        constructor(propertyAssignments: ISeparatedSyntaxList2);
        kind(): SyntaxKind;
        structuralEquals(ast: ObjectLiteralExpression, includingPosition: boolean): boolean;
    }
    class SimplePropertyAssignment extends AST {
        propertyName: Identifier;
        expression: AST;
        constructor(propertyName: Identifier, expression: AST);
        kind(): SyntaxKind;
    }
    class FunctionPropertyAssignment extends AST {
        propertyName: Identifier;
        callSignature: CallSignature;
        block: Block;
        constructor(propertyName: Identifier, callSignature: CallSignature, block: Block);
        kind(): SyntaxKind;
    }
    class FunctionExpression extends AST {
        identifier: Identifier;
        callSignature: CallSignature;
        block: Block;
        constructor(identifier: Identifier, callSignature: CallSignature, block: Block);
        kind(): SyntaxKind;
    }
    class EmptyStatement extends AST {
        kind(): SyntaxKind;
        structuralEquals(ast: CatchClause, includingPosition: boolean): boolean;
    }
    class TryStatement extends AST {
        block: Block;
        catchClause: CatchClause;
        finallyClause: FinallyClause;
        constructor(block: Block, catchClause: CatchClause, finallyClause: FinallyClause);
        kind(): SyntaxKind;
        structuralEquals(ast: TryStatement, includingPosition: boolean): boolean;
    }
    class CatchClause extends AST {
        identifier: Identifier;
        typeAnnotation: TypeAnnotation;
        block: Block;
        constructor(identifier: Identifier, typeAnnotation: TypeAnnotation, block: Block);
        kind(): SyntaxKind;
        structuralEquals(ast: CatchClause, includingPosition: boolean): boolean;
    }
    class FinallyClause extends AST {
        block: Block;
        constructor(block: Block);
        kind(): SyntaxKind;
        structuralEquals(ast: CatchClause, includingPosition: boolean): boolean;
    }
    class LabeledStatement extends AST {
        identifier: Identifier;
        statement: AST;
        constructor(identifier: Identifier, statement: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: LabeledStatement, includingPosition: boolean): boolean;
    }
    class DoStatement extends AST {
        statement: AST;
        whileKeyword: ASTSpan;
        condition: AST;
        constructor(statement: AST, whileKeyword: ASTSpan, condition: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: DoStatement, includingPosition: boolean): boolean;
    }
    class TypeOfExpression extends AST {
        expression: AST;
        constructor(expression: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: TypeOfExpression, includingPosition: boolean): boolean;
    }
    class DeleteExpression extends AST {
        expression: AST;
        constructor(expression: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: DeleteExpression, includingPosition: boolean): boolean;
    }
    class VoidExpression extends AST {
        expression: AST;
        constructor(expression: AST);
        kind(): SyntaxKind;
        structuralEquals(ast: VoidExpression, includingPosition: boolean): boolean;
    }
    class DebuggerStatement extends AST {
        kind(): SyntaxKind;
    }
    class Comment {
        private _trivia;
        endsLine: boolean;
        _start: number;
        _end: number;
        constructor(_trivia: ISyntaxTrivia, endsLine: boolean, _start: number, _end: number);
        start(): number;
        end(): number;
        fullText(): string;
        kind(): SyntaxKind;
        structuralEquals(ast: Comment, includingPosition: boolean): boolean;
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
        ast: AST;
        astAt(index: number): AST;
        identifierAt(index: number): Identifier;
        typeAt(index: number): AST;
        initializerAt(index: number): EqualsValueClause;
        isOptionalAt(index: number): boolean;
    }
    module Parameters {
        function fromIdentifier(id: Identifier): IParameters;
        function fromParameter(parameter: Parameter): IParameters;
        function fromParameterList(list: ParameterList): IParameters;
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
        goChildren: boolean;
        stopWalking: boolean;
    }
    interface IAstWalker {
        options: AstWalkOptions;
        state: any;
    }
    class AstWalkerFactory {
        walk(ast: AST, pre: (ast: AST, walker: IAstWalker) => void, post?: (ast: AST, walker: IAstWalker) => void, state?: any): void;
        simpleWalk(ast: AST, pre: (ast: AST, state: any) => void, post?: (ast: AST, state: any) => void, state?: any): void;
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
        sourceLine: number;
        sourceColumn: number;
        emittedLine: number;
        emittedColumn: number;
    }
    class SourceMapping {
        start: SourceMapPosition;
        end: SourceMapPosition;
        nameIndex: number;
        childMappings: SourceMapping[];
    }
    class SourceMapEntry {
        emittedFile: string;
        emittedLine: number;
        emittedColumn: number;
        sourceFile: string;
        sourceLine: number;
        sourceColumn: number;
        sourceName: string;
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
        names: string[];
        private mappingLevel;
        private tsFilePaths;
        private allSourceMappings;
        currentMappings: SourceMapping[][];
        currentNameIndex: number[];
        private sourceMapEntries;
        constructor(jsFile: TextWriter, sourceMapOut: TextWriter, document: Document, jsFilePath: string, emitOptions: EmitOptions, resolvePath: (path: string) => string);
        getOutputFile(): OutputFile;
        increaseMappingLevel(ast: IASTSpan): void;
        decreaseMappingLevel(ast: IASTSpan): void;
        setNewSourceFile(document: Document, emitOptions: EmitOptions): void;
        private setSourceMapOptions(document, jsFilePath, emitOptions, resolvePath);
        private setNewSourceFilePath(document, emitOptions);
        emitSourceMapping(): void;
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
        column: number;
        line: number;
        container: EmitContainer;
        constructor();
    }
    class EmitOptions {
        resolvePath: (path: string) => string;
        private _diagnostic;
        private _settings;
        private _commonDirectoryPath;
        private _sharedOutputFile;
        private _sourceRootDirectory;
        private _sourceMapRootDirectory;
        private _outputDirectory;
        diagnostic(): Diagnostic;
        commonDirectoryPath(): string;
        sharedOutputFile(): string;
        sourceRootDirectory(): string;
        sourceMapRootDirectory(): string;
        outputDirectory(): string;
        compilationSettings(): ImmutableCompilationSettings;
        constructor(compiler: TypeScriptCompiler, resolvePath: (path: string) => string);
        private determineCommonDirectoryPath(compiler);
    }
    class Indenter {
        static indentStep: number;
        static indentStepString: string;
        static indentStrings: string[];
        indentAmt: number;
        increaseIndent(): void;
        decreaseIndent(): void;
        getIndent(): string;
    }
    function lastParameterIsRest(parameterList: ParameterList): boolean;
    class Emitter {
        emittingFileName: string;
        outfile: TextWriter;
        emitOptions: EmitOptions;
        private semanticInfoChain;
        globalThisCapturePrologueEmitted: boolean;
        extendsPrologueEmitted: boolean;
        thisClassNode: ClassDeclaration;
        inArrowFunction: boolean;
        moduleName: string;
        emitState: EmitState;
        indenter: Indenter;
        sourceMapper: SourceMapper;
        captureThisStmtString: string;
        private currentVariableDeclaration;
        private declStack;
        private exportAssignmentIdentifier;
        private inWithBlock;
        document: Document;
        private copyrightElement;
        constructor(emittingFileName: string, outfile: TextWriter, emitOptions: EmitOptions, semanticInfoChain: SemanticInfoChain);
        private pushDecl(decl);
        private popDecl(decl);
        private getEnclosingDecl();
        setExportAssignmentIdentifier(id: string): void;
        getExportAssignmentIdentifier(): string;
        setDocument(document: Document): void;
        shouldEmitImportDeclaration(importDeclAST: ImportDeclaration): boolean;
        emitImportDeclaration(importDeclAST: ImportDeclaration): void;
        createSourceMapper(document: Document, jsFileName: string, jsFile: TextWriter, sourceMapOut: TextWriter, resolvePath: (path: string) => string): void;
        setSourceMapperNewSourceFile(document: Document): void;
        private updateLineAndColumn(s);
        writeToOutputWithSourceMapRecord(s: string, astSpan: IASTSpan): void;
        writeToOutput(s: string): void;
        writeLineToOutput(s: string, force?: boolean): void;
        writeCaptureThisStatement(ast: AST): void;
        setContainer(c: number): number;
        private getIndentString();
        emitIndent(): void;
        emitComment(comment: Comment, trailing: boolean, first: boolean): void;
        emitComments(ast: AST, pre: boolean, onlyPinnedOrTripleSlashComments?: boolean): void;
        private isPinnedOrTripleSlash(comment);
        emitCommentsArray(comments: Comment[], trailing: boolean): void;
        emitObjectLiteralExpression(objectLiteral: ObjectLiteralExpression): void;
        emitArrayLiteralExpression(arrayLiteral: ArrayLiteralExpression): void;
        emitObjectCreationExpression(objectCreationExpression: ObjectCreationExpression): void;
        getConstantDecl(dotExpr: MemberAccessExpression): PullEnumElementDecl;
        tryEmitConstant(dotExpr: MemberAccessExpression): boolean;
        emitInvocationExpression(callNode: InvocationExpression): void;
        private emitParameterList(list);
        private emitFunctionParameters(parameters);
        private emitFunctionBodyStatements(name, funcDecl, parameterList, block, bodyExpression);
        private emitDefaultValueAssignments(parameters);
        private emitRestParameterInitializer(parameters);
        private getImportDecls(fileName);
        getModuleImportAndDependencyList(sourceUnit: SourceUnit): {
            importList: string;
            dependencyList: string;
        };
        shouldCaptureThis(ast: AST): boolean;
        emitEnum(moduleDecl: EnumDeclaration): void;
        private getModuleDeclToVerifyChildNameCollision(moduleDecl, changeNameIfAnyDeclarationInContext);
        private hasChildNameCollision(moduleName, childDecls);
        private getModuleName(moduleDecl, changeNameIfAnyDeclarationInContext?);
        private emitModuleDeclarationWorker(moduleDecl);
        emitSingleModuleDeclaration(moduleDecl: ModuleDeclaration, moduleName: IASTToken): void;
        emitEnumElement(varDecl: EnumElement): void;
        emitElementAccessExpression(expression: ElementAccessExpression): void;
        emitSimpleArrowFunctionExpression(arrowFunction: SimpleArrowFunctionExpression): void;
        emitParenthesizedArrowFunctionExpression(arrowFunction: ParenthesizedArrowFunctionExpression): void;
        private emitAnyArrowFunctionExpression(arrowFunction, funcName, parameters, block, expression);
        emitConstructor(funcDecl: ConstructorDeclaration): void;
        emitGetAccessor(accessor: GetAccessor): void;
        emitSetAccessor(accessor: SetAccessor): void;
        emitFunctionExpression(funcDecl: FunctionExpression): void;
        emitFunction(funcDecl: FunctionDeclaration): void;
        emitAmbientVarDecl(varDecl: VariableDeclarator): void;
        emitVarDeclVar(): void;
        emitVariableDeclaration(declaration: VariableDeclaration): void;
        private emitMemberVariableDeclaration(varDecl);
        emitVariableDeclarator(varDecl: VariableDeclarator): void;
        private symbolIsUsedInItsEnclosingContainer(symbol, dynamic?);
        private getPotentialDeclPathInfoForEmit(pullSymbol);
        private emitDottedNameFromDeclPath(declPath, startingIndex, lastIndex);
        private emitSymbolContainerNameInEnclosingContext(pullSymbol);
        private getSymbolForEmit(ast);
        emitName(name: Identifier, addThis: boolean): void;
        recordSourceMappingNameStart(name: string): void;
        recordSourceMappingNameEnd(): void;
        recordSourceMappingStart(ast: IASTSpan): void;
        recordSourceMappingEnd(ast: IASTSpan): void;
        getOutputFiles(): OutputFile[];
        private emitParameterPropertyAndMemberVariableAssignments();
        private isOnSameLine(pos1, pos2);
        private emitCommaSeparatedList(parent, list, buffer, preserveNewLines);
        emitList(list: ISyntaxList2, useNewLineSeparator?: boolean, startInclusive?: number, endExclusive?: number): void;
        emitSeparatedList(list: ISeparatedSyntaxList2, useNewLineSeparator?: boolean, startInclusive?: number, endExclusive?: number): void;
        private isDirectivePrologueElement(node);
        emitSpaceBetweenConstructs(node1: AST, node2: AST): void;
        private getCopyrightComments();
        private emitPossibleCopyrightHeaders(script);
        emitScriptElements(sourceUnit: SourceUnit): void;
        emitConstructorStatements(funcDecl: ConstructorDeclaration): void;
        emitJavascript(ast: AST, startLine: boolean): void;
        emitAccessorMemberDeclaration(funcDecl: AST, name: IASTToken, className: string, isProto: boolean): void;
        private emitAccessorBody(funcDecl, parameterList, block);
        emitClass(classDecl: ClassDeclaration): void;
        private emitClassMembers(classDecl);
        private emitClassMemberFunctionDeclaration(classDecl, funcDecl);
        private requiresExtendsBlock(moduleElements);
        emitPrologue(sourceUnit: SourceUnit): void;
        emitThis(): void;
        emitBlockOrStatement(node: AST): void;
        emitLiteralExpression(expression: LiteralExpression): void;
        emitThisExpression(expression: ThisExpression): void;
        emitSuperExpression(expression: SuperExpression): void;
        emitParenthesizedExpression(parenthesizedExpression: ParenthesizedExpression): void;
        emitCastExpression(expression: CastExpression): void;
        emitPrefixUnaryExpression(expression: PrefixUnaryExpression): void;
        emitPostfixUnaryExpression(expression: PostfixUnaryExpression): void;
        emitTypeOfExpression(expression: TypeOfExpression): void;
        emitDeleteExpression(expression: DeleteExpression): void;
        emitVoidExpression(expression: VoidExpression): void;
        private canEmitDottedNameMemberAccessExpression(expression);
        private emitDottedNameMemberAccessExpressionWorker(expression, potentialPath, startingIndex, lastIndex);
        private emitDottedNameMemberAccessExpressionRecurse(expression, potentialPath, startingIndex, lastIndex);
        private emitDottedNameMemberAccessExpression(expression);
        emitMemberAccessExpression(expression: MemberAccessExpression): void;
        emitQualifiedName(name: QualifiedName): void;
        emitBinaryExpression(expression: BinaryExpression): void;
        emitSimplePropertyAssignment(property: SimplePropertyAssignment): void;
        emitFunctionPropertyAssignment(funcProp: FunctionPropertyAssignment): void;
        emitConditionalExpression(expression: ConditionalExpression): void;
        emitThrowStatement(statement: ThrowStatement): void;
        emitExpressionStatement(statement: ExpressionStatement): void;
        emitLabeledStatement(statement: LabeledStatement): void;
        emitBlock(block: Block): void;
        emitBreakStatement(jump: BreakStatement): void;
        emitContinueStatement(jump: ContinueStatement): void;
        emitWhileStatement(statement: WhileStatement): void;
        emitDoStatement(statement: DoStatement): void;
        emitIfStatement(statement: IfStatement): void;
        emitElseClause(elseClause: ElseClause): void;
        emitReturnStatement(statement: ReturnStatement): void;
        emitForInStatement(statement: ForInStatement): void;
        emitForStatement(statement: ForStatement): void;
        emitWithStatement(statement: WithStatement): void;
        emitSwitchStatement(statement: SwitchStatement): void;
        emitCaseSwitchClause(clause: CaseSwitchClause): void;
        private emitSwitchClauseBody(body);
        emitDefaultSwitchClause(clause: DefaultSwitchClause): void;
        emitTryStatement(statement: TryStatement): void;
        emitCatchClause(clause: CatchClause): void;
        emitFinallyClause(clause: FinallyClause): void;
        emitDebuggerStatement(statement: DebuggerStatement): void;
        emitNumericLiteral(literal: NumericLiteral): void;
        emitRegularExpressionLiteral(literal: RegularExpressionLiteral): void;
        emitStringLiteral(literal: StringLiteral): void;
        emitEqualsValueClause(clause: EqualsValueClause): void;
        emitParameter(parameter: Parameter): void;
        emitConstructorDeclaration(declaration: ConstructorDeclaration): void;
        shouldEmitFunctionDeclaration(declaration: FunctionDeclaration): boolean;
        emitFunctionDeclaration(declaration: FunctionDeclaration): void;
        private emitSourceUnit(sourceUnit);
        shouldEmitEnumDeclaration(declaration: EnumDeclaration): boolean;
        emitEnumDeclaration(declaration: EnumDeclaration): void;
        shouldEmitModuleDeclaration(declaration: ModuleDeclaration): boolean;
        private emitModuleDeclaration(declaration);
        shouldEmitClassDeclaration(declaration: ClassDeclaration): boolean;
        emitClassDeclaration(declaration: ClassDeclaration): void;
        shouldEmitInterfaceDeclaration(declaration: InterfaceDeclaration): boolean;
        emitInterfaceDeclaration(declaration: InterfaceDeclaration): void;
        private firstVariableDeclarator(statement);
        private isNotAmbientOrHasInitializer(variableStatement);
        shouldEmitVariableStatement(statement: VariableStatement): boolean;
        emitVariableStatement(statement: VariableStatement): void;
        emitGenericType(type: GenericType): void;
        private shouldEmit(ast);
        private emit(ast);
        private emitWorker(ast);
    }
    function getLastConstructor(classDecl: ClassDeclaration): ConstructorDeclaration;
    function getTrimmedTextLines(comment: Comment): string[];
}
declare module TypeScript {
    class MemberName {
        prefix: string;
        suffix: string;
        isString(): boolean;
        isArray(): boolean;
        isMarker(): boolean;
        toString(): string;
        static memberNameToString(memberName: MemberName, markerInfo?: number[], markerBaseLength?: number): string;
        static create(text: string): MemberName;
        static create(entry: MemberName, prefix: string, suffix: string): MemberName;
    }
    class MemberNameString extends MemberName {
        text: string;
        constructor(text: string);
        isString(): boolean;
    }
    class MemberNameArray extends MemberName {
        delim: string;
        entries: MemberName[];
        isArray(): boolean;
        add(entry: MemberName): void;
        addAll(entries: MemberName[]): void;
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
    interface IFileReference extends ILineAndCharacter {
        path: string;
        isResident: boolean;
        position: number;
        length: number;
    }
}
declare module TypeScript {
    interface IPreProcessedFileInfo {
        referencedFiles: IFileReference[];
        importedFiles: IFileReference[];
        diagnostics: Diagnostic[];
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
        getScriptSnapshot(fileName: string): IScriptSnapshot;
        resolveRelativePath(path: string, directory: string): string;
        fileExists(path: string): boolean;
        directoryExists(path: string): boolean;
        getParentDirectory(path: string): string;
    }
    class ReferenceResolutionResult {
        resolvedFiles: IResolvedFile[];
        diagnostics: Diagnostic[];
        seenNoDefaultLibTag: boolean;
    }
    class ReferenceResolver {
        private useCaseSensitiveFileResolution;
        private inputFileNames;
        private host;
        private visited;
        constructor(inputFileNames: string[], host: IReferenceResolverHost, useCaseSensitiveFileResolution: boolean);
        static resolve(inputFileNames: string[], host: IReferenceResolverHost, useCaseSensitiveFileResolution: boolean): ReferenceResolutionResult;
        resolveInputFiles(): ReferenceResolutionResult;
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
        onNewLine: boolean;
        constructor(name: string, writeByteOrderMark: boolean, outputFileType: OutputFileType);
        Write(s: string): void;
        WriteLine(s: string): void;
        Close(): void;
        getOutputFile(): OutputFile;
    }
    class DeclarationEmitter {
        private emittingFileName;
        document: Document;
        private compiler;
        private emitOptions;
        private semanticInfoChain;
        private declFile;
        private indenter;
        private emittedReferencePaths;
        constructor(emittingFileName: string, document: Document, compiler: TypeScriptCompiler, emitOptions: EmitOptions, semanticInfoChain: SemanticInfoChain);
        getOutputFile(): OutputFile;
        emitDeclarations(sourceUnit: SourceUnit): void;
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
        getFullName(name: AST): string;
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
        addKeys(keys: IIndexable<any>): void;
        add(value: string): void;
        probablyContains(value: string): boolean;
        isEquivalent(filter: BloomFilter): boolean;
        static isEquivalent(array1: boolean[], array2: boolean[]): boolean;
    }
}
declare module TypeScript {
    class IdentifierWalker extends SyntaxWalker {
        list: IIndexable<boolean>;
        constructor(list: IIndexable<boolean>);
        visitToken(token: ISyntaxToken): void;
    }
}
declare module TypeScript {
    class CompilationSettings {
        propagateEnumConstants: boolean;
        removeComments: boolean;
        watch: boolean;
        noResolve: boolean;
        allowAutomaticSemicolonInsertion: boolean;
        noImplicitAny: boolean;
        noLib: boolean;
        codeGenTarget: LanguageVersion;
        moduleGenTarget: ModuleGenTarget;
        outFileOption: string;
        outDirOption: string;
        mapSourceFiles: boolean;
        mapRoot: string;
        sourceRoot: string;
        generateDeclarationFiles: boolean;
        useCaseSensitiveFileResolution: boolean;
        gatherDiagnostics: boolean;
        codepage: number;
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
        propagateEnumConstants(): boolean;
        removeComments(): boolean;
        watch(): boolean;
        noResolve(): boolean;
        allowAutomaticSemicolonInsertion(): boolean;
        noImplicitAny(): boolean;
        noLib(): boolean;
        codeGenTarget(): LanguageVersion;
        moduleGenTarget(): ModuleGenTarget;
        outFileOption(): string;
        outDirOption(): string;
        mapSourceFiles(): boolean;
        mapRoot(): string;
        sourceRoot(): string;
        generateDeclarationFiles(): boolean;
        useCaseSensitiveFileResolution(): boolean;
        gatherDiagnostics(): boolean;
        codepage(): number;
        constructor(propagateEnumConstants: boolean, removeComments: boolean, watch: boolean, noResolve: boolean, allowAutomaticSemicolonInsertion: boolean, noImplicitAny: boolean, noLib: boolean, codeGenTarget: LanguageVersion, moduleGenTarget: ModuleGenTarget, outFileOption: string, outDirOption: string, mapSourceFiles: boolean, mapRoot: string, sourceRoot: string, generateDeclarationFiles: boolean, useCaseSensitiveFileResolution: boolean, gatherDiagnostics: boolean, codepage: number);
        static defaultSettings(): ImmutableCompilationSettings;
        static fromCompilationSettings(settings: CompilationSettings): ImmutableCompilationSettings;
        toCompilationSettings(): any;
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
        kind: PullElementKind;
        name: string;
        private declDisplayName;
        declID: number;
        flags: PullElementFlags;
        private span;
        private declGroups;
        private childDecls;
        private typeParameters;
        private synthesizedValDecl;
        childDeclTypeCache: IIndexable<PullDecl[]>;
        childDeclValueCache: IIndexable<PullDecl[]>;
        childDeclNamespaceCache: IIndexable<PullDecl[]>;
        childDeclTypeParameterCache: IIndexable<PullDecl[]>;
        constructor(declName: string, displayName: string, kind: PullElementKind, declFlags: PullElementFlags, span: TextSpan);
        fileName(): string;
        getParentPath(): PullDecl[];
        getParentDecl(): PullDecl;
        semanticInfoChain(): SemanticInfoChain;
        isExternalModule(): boolean;
        getEnclosingDecl(): PullDecl;
        _getEnclosingDeclFromParentDecl(): PullDecl;
        getDisplayName(): string;
        setSymbol(symbol: PullSymbol): void;
        ensureSymbolIsBound(bindSignatureSymbol?: boolean): void;
        getSymbol(): PullSymbol;
        hasSymbol(): boolean;
        setSignatureSymbol(signatureSymbol: PullSignatureSymbol): void;
        getSignatureSymbol(): PullSignatureSymbol;
        hasSignatureSymbol(): boolean;
        setFlags(flags: PullElementFlags): void;
        setFlag(flags: PullElementFlags): void;
        getSpan(): TextSpan;
        setValueDecl(valDecl: PullDecl): void;
        getValueDecl(): PullDecl;
        isEqual(other: PullDecl): boolean;
        private getChildDeclCache(declKind);
        addChildDecl(childDecl: PullDecl): void;
        searchChildDecls(declName: string, searchKind: PullElementKind): PullDecl[];
        getChildDecls(): PullDecl[];
        getTypeParameters(): PullDecl[];
        addVariableDeclToGroup(decl: PullDecl): void;
        getVariableDeclGroups(): PullDecl[][];
        hasBeenBound(): boolean;
        isSynthesized(): boolean;
        ast(): AST;
    }
    class RootPullDecl extends PullDecl {
        private _semanticInfoChain;
        private _isExternalModule;
        private _fileName;
        constructor(name: string, fileName: string, kind: PullElementKind, declFlags: PullElementFlags, span: TextSpan, semanticInfoChain: SemanticInfoChain, isExternalModule: boolean);
        fileName(): string;
        getParentPath(): PullDecl[];
        getParentDecl(): PullDecl;
        semanticInfoChain(): SemanticInfoChain;
        isExternalModule(): boolean;
        getEnclosingDecl(): RootPullDecl;
    }
    class NormalPullDecl extends PullDecl {
        private parentDecl;
        private parentPath;
        constructor(declName: string, displayName: string, kind: PullElementKind, declFlags: PullElementFlags, parentDecl: PullDecl, span: TextSpan, addToParent?: boolean);
        fileName(): string;
        getParentDecl(): PullDecl;
        getParentPath(): PullDecl[];
        semanticInfoChain(): SemanticInfoChain;
        isExternalModule(): boolean;
        getEnclosingDecl(): PullDecl;
    }
    class PullEnumElementDecl extends NormalPullDecl {
        constantValue: number;
        constructor(declName: string, displayName: string, parentDecl: PullDecl, span: TextSpan);
    }
    class PullFunctionExpressionDecl extends NormalPullDecl {
        private functionExpressionName;
        constructor(expressionName: string, declFlags: PullElementFlags, parentDecl: PullDecl, span: TextSpan, displayName?: string);
        getFunctionExpressionName(): string;
    }
    class PullSynthesizedDecl extends NormalPullDecl {
        private _semanticInfoChain;
        constructor(declName: string, displayName: string, kind: PullElementKind, declFlags: PullElementFlags, parentDecl: PullDecl, span: TextSpan, semanticInfoChain: SemanticInfoChain);
        semanticInfoChain(): SemanticInfoChain;
        isSynthesized(): boolean;
    }
    class PullDeclGroup {
        name: string;
        private _decls;
        constructor(name: string);
        addDecl(decl: PullDecl): void;
        getDecls(): PullDecl[];
    }
}
declare module TypeScript {
    var pullSymbolID: number;
    var globalTyvarID: number;
    var sentinelEmptyArray: any[];
    class PullSymbol {
        pullSymbolID: number;
        name: string;
        kind: PullElementKind;
        private _container;
        type: PullTypeSymbol;
        private _declarations;
        isResolved: boolean;
        isOptional: boolean;
        inResolution: boolean;
        private isSynthesized;
        isVarArg: boolean;
        private rootSymbol;
        private _enclosingSignature;
        private _docComments;
        isPrinting: boolean;
        isAny(): boolean;
        isType(): boolean;
        isTypeReference(): boolean;
        isSignature(): boolean;
        isArrayNamedTypeReference(): boolean;
        isPrimitive(): boolean;
        isAccessor(): boolean;
        isError(): boolean;
        isInterface(): boolean;
        isMethod(): boolean;
        isProperty(): boolean;
        isAlias(): boolean;
        isContainer(): boolean;
        constructor(name: string, declKind: PullElementKind);
        private findAliasedType(scopeSymbol, skipScopeSymbolAliasesLookIn?, lookIntoOnlyExportedAlias?, aliasSymbols?, visitedScopeDeclarations?);
        getExternalAliasedSymbols(scopeSymbol: PullSymbol): PullTypeAliasSymbol[];
        private isExternalModuleReferenceAlias(aliasSymbol);
        private getExportedInternalAliasSymbol(scopeSymbol);
        getAliasSymbolName(scopeSymbol: PullSymbol, aliasNameGetter: (symbol: PullTypeAliasSymbol) => string, aliasPartsNameGetter: (symbol: PullTypeAliasSymbol) => string, skipInternalAlias?: boolean): string;
        _getResolver(): PullTypeResolver;
        _resolveDeclaredSymbol(): PullSymbol;
        getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, skipInternalAliasName?: boolean): string;
        getIsSpecialized(): boolean;
        getRootSymbol(): PullSymbol;
        setRootSymbol(symbol: PullSymbol): void;
        setIsSynthesized(value?: boolean): void;
        getIsSynthesized(): boolean;
        setEnclosingSignature(signature: PullSignatureSymbol): void;
        getEnclosingSignature(): PullSignatureSymbol;
        addDeclaration(decl: PullDecl): void;
        getDeclarations(): PullDecl[];
        hasDeclaration(decl: PullDecl): boolean;
        setContainer(containerSymbol: PullTypeSymbol): void;
        getContainer(): PullTypeSymbol;
        setResolved(): void;
        startResolving(): void;
        setUnresolved(): void;
        anyDeclHasFlag(flag: PullElementFlags): boolean;
        allDeclsHaveFlag(flag: PullElementFlags): boolean;
        pathToRoot(): PullSymbol[];
        findCommonAncestorPath(b: PullSymbol): PullSymbol[];
        toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        getNamePartForFullName(): string;
        fullName(scopeSymbol?: PullSymbol): string;
        getScopedName(scopeSymbol?: PullSymbol, skipTypeParametersInName?: boolean, useConstraintInName?: boolean, skipInternalAliasName?: boolean): string;
        getScopedNameEx(scopeSymbol?: PullSymbol, skipTypeParametersInName?: boolean, useConstraintInName?: boolean, getPrettyTypeName?: boolean, getTypeParamMarkerInfo?: boolean, skipInternalAliasName?: boolean): MemberName;
        getTypeName(scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean): string;
        getTypeNameEx(scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean): MemberName;
        private getTypeNameForFunctionSignature(prefix, scopeSymbol?, getPrettyTypeName?);
        getNameAndTypeName(scopeSymbol?: PullSymbol): string;
        getNameAndTypeNameEx(scopeSymbol?: PullSymbol): MemberName;
        static getTypeParameterString(typars: PullTypeSymbol[], scopeSymbol?: PullSymbol, useContraintInName?: boolean): string;
        static getTypeParameterStringEx(typeParameters: PullTypeSymbol[], scopeSymbol?: PullSymbol, getTypeParamMarkerInfo?: boolean, useContraintInName?: boolean): MemberNameArray;
        static getIsExternallyVisible(symbol: PullSymbol, fromIsExternallyVisibleSymbol: PullSymbol, inIsExternallyVisibleSymbols: PullSymbol[]): boolean;
        isExternallyVisible(inIsExternallyVisibleSymbols?: PullSymbol[]): boolean;
        private getDocCommentsOfDecl(decl);
        private getDocCommentArray(symbol);
        private static getDefaultConstructorSymbolForDocComments(classSymbol);
        private getDocCommentText(comments);
        private getDocCommentTextValue(comment);
        docComments(useConstructorAsClass?: boolean): string;
        private getParameterDocCommentText(param, fncDocComments);
        private cleanJSDocComment(content, spacesToRemove?);
        private consumeLeadingSpace(line, startIndex, maxSpacesToRemove?);
        private isSpaceChar(line, index);
        private cleanDocCommentLine(line, jsDocStyleComment, jsDocLineSpaceToRemove?);
    }
    class PullSignatureSymbol extends PullSymbol {
        private _memberTypeParameterNameCache;
        private _stringConstantOverload;
        parameters: PullSymbol[];
        typeParameters: PullTypeParameterSymbol[];
        returnType: PullTypeSymbol;
        functionType: PullTypeSymbol;
        hasOptionalParam: boolean;
        nonOptionalParamCount: number;
        hasVarArgs: boolean;
        hasAGenericParameter: boolean;
        hasBeenChecked: boolean;
        inWrapCheck: boolean;
        constructor(kind: PullElementKind);
        isDefinition(): boolean;
        isGeneric(): boolean;
        addParameter(parameter: PullSymbol, isOptional?: boolean): void;
        addTypeParameter(typeParameter: PullTypeParameterSymbol): void;
        getTypeParameters(): PullTypeParameterSymbol[];
        findTypeParameter(name: string): PullTypeParameterSymbol;
        isStringConstantOverloadSignature(): boolean;
        static getSignatureTypeMemberName(candidateSignature: PullSignatureSymbol, signatures: PullSignatureSymbol[], scopeSymbol: PullSymbol): MemberNameArray;
        static getSignaturesTypeNameEx(signatures: PullSignatureSymbol[], prefix: string, shortform: boolean, brackets: boolean, scopeSymbol?: PullSymbol, getPrettyTypeName?: boolean, candidateSignature?: PullSignatureSymbol): MemberName[];
        toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        getSignatureTypeNameEx(prefix: string, shortform: boolean, brackets: boolean, scopeSymbol?: PullSymbol, getParamMarkerInfo?: boolean, getTypeParamMarkerInfo?: boolean): MemberNameArray;
        wrapsSomeTypeParameter(typeParameterArgumentMap: PullTypeSymbol[]): boolean;
        wrapsSomeNestedTypeIntoInfiniteExpansion(typeBeingWrapped: PullTypeSymbol, isCheckingTypeArgumentList: boolean, knownWrapMap: IBitMatrix): boolean;
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
        inSymbolPrivacyCheck: boolean;
        inWrapCheck: boolean;
        typeReference: PullTypeReferenceSymbol;
        constructor(name: string, kind: PullElementKind);
        private _isArrayNamedTypeReference;
        isArrayNamedTypeReference(): boolean;
        private computeIsArrayNamedTypeReference();
        isType(): boolean;
        isClass(): boolean;
        isFunction(): boolean;
        isConstructor(): boolean;
        isTypeParameter(): boolean;
        isTypeVariable(): boolean;
        isError(): boolean;
        isEnum(): boolean;
        getTypeParameterArgumentMap(): PullTypeSymbol[];
        isObject(): boolean;
        getKnownBaseTypeCount(): number;
        resetKnownBaseTypeCount(): void;
        incrementKnownBaseCount(): void;
        setHasBaseTypeConflict(): void;
        hasBaseTypeConflict(): boolean;
        hasMembers(): boolean;
        setHasGenericSignature(): void;
        getHasGenericSignature(): boolean;
        setHasGenericMember(): void;
        getHasGenericMember(): boolean;
        setAssociatedContainerType(type: PullTypeSymbol): void;
        getAssociatedContainerType(): PullTypeSymbol;
        getArrayType(): PullTypeSymbol;
        getElementType(): PullTypeSymbol;
        setArrayType(arrayType: PullTypeSymbol): void;
        getFunctionSymbol(): PullSymbol;
        setFunctionSymbol(symbol: PullSymbol): void;
        findContainedNonMember(name: string): PullSymbol;
        findContainedNonMemberType(typeName: string, kind?: PullElementKind): PullTypeSymbol;
        findContainedNonMemberContainer(containerName: string, kind?: PullElementKind): PullTypeSymbol;
        addMember(memberSymbol: PullSymbol): void;
        addEnclosedMemberType(enclosedType: PullTypeSymbol): void;
        addEnclosedMemberContainer(enclosedContainer: PullTypeSymbol): void;
        addEnclosedNonMember(enclosedNonMember: PullSymbol): void;
        addEnclosedNonMemberType(enclosedNonMemberType: PullTypeSymbol): void;
        addEnclosedNonMemberContainer(enclosedNonMemberContainer: PullTypeSymbol): void;
        addTypeParameter(typeParameter: PullTypeParameterSymbol): void;
        addConstructorTypeParameter(typeParameter: PullTypeParameterSymbol): void;
        getMembers(): PullSymbol[];
        setHasDefaultConstructor(hasOne?: boolean): void;
        getHasDefaultConstructor(): boolean;
        getConstructorMethod(): PullSymbol;
        setConstructorMethod(constructorMethod: PullSymbol): void;
        getTypeParameters(): PullTypeParameterSymbol[];
        isGeneric(): boolean;
        private canUseSimpleInstantiationCache(substitutingTypes);
        addSpecialization(specializedVersionOfThisType: PullTypeSymbol, substitutingTypes: PullTypeSymbol[]): void;
        getSpecialization(substitutingTypes: PullTypeSymbol[]): PullTypeSymbol;
        getKnownSpecializations(): PullTypeSymbol[];
        getTypeArguments(): PullTypeSymbol[];
        getTypeArgumentsOrTypeParameters(): PullTypeSymbol[];
        addCallSignature(callSignature: PullSignatureSymbol): void;
        addConstructSignature(constructSignature: PullSignatureSymbol): void;
        addIndexSignature(indexSignature: PullSignatureSymbol): void;
        private addUnhiddenSignaturesFromBaseType(derivedTypeSignatures, baseTypeSignatures, signaturesBeingAggregated);
        hasOwnCallSignatures(): boolean;
        getCallSignatures(): PullSignatureSymbol[];
        hasOwnConstructSignatures(): boolean;
        getConstructSignatures(): PullSignatureSymbol[];
        hasOwnIndexSignatures(): boolean;
        getOwnIndexSignatures(): PullSignatureSymbol[];
        getIndexSignatures(): PullSignatureSymbol[];
        addImplementedType(implementedType: PullTypeSymbol): void;
        getImplementedTypes(): PullTypeSymbol[];
        addExtendedType(extendedType: PullTypeSymbol): void;
        getExtendedTypes(): PullTypeSymbol[];
        addTypeThatExtendsThisType(type: PullTypeSymbol): void;
        getTypesThatExtendThisType(): PullTypeSymbol[];
        addTypeThatExplicitlyImplementsThisType(type: PullTypeSymbol): void;
        getTypesThatExplicitlyImplementThisType(): PullTypeSymbol[];
        hasBase(potentialBase: PullTypeSymbol, visited?: PullSymbol[]): boolean;
        isValidBaseKind(baseType: PullTypeSymbol, isExtendedType: boolean): boolean;
        findMember(name: string, lookInParent: boolean): PullSymbol;
        findNestedType(name: string, kind?: PullElementKind): PullTypeSymbol;
        findNestedContainer(name: string, kind?: PullElementKind): PullTypeSymbol;
        getAllMembers(searchDeclKind: PullElementKind, memberVisiblity: GetAllMembersVisiblity): PullSymbol[];
        findTypeParameter(name: string): PullTypeParameterSymbol;
        setResolved(): void;
        getNamePartForFullName(): string;
        getScopedName(scopeSymbol?: PullSymbol, skipTypeParametersInName?: boolean, useConstraintInName?: boolean, skipInternalAliasName?: boolean): string;
        isNamedTypeSymbol(): boolean;
        toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        getScopedNameEx(scopeSymbol?: PullSymbol, skipTypeParametersInName?: boolean, useConstraintInName?: boolean, getPrettyTypeName?: boolean, getTypeParamMarkerInfo?: boolean, skipInternalAliasName?: boolean): MemberName;
        hasOnlyOverloadCallSignatures(): boolean;
        getTypeOfSymbol(): PullSymbol;
        private getMemberTypeNameEx(topLevel, scopeSymbol?, getPrettyTypeName?);
        getGenerativeTypeClassification(enclosingType: PullTypeSymbol): GenerativeTypeClassification;
        wrapsSomeTypeParameter(typeParameterArgumentMap: CandidateInferenceInfo[]): boolean;
        wrapsSomeTypeParameter(typeParameterArgumentMap: PullTypeSymbol[]): boolean;
        wrapsSomeNestedTypeIntoInfiniteExpansion(typeBeingWrapped: PullTypeSymbol): boolean;
        private isTypeEquivalentToRootSymbol();
        private isTypeBeingWrapped(typeBeingWrapped);
        private anyRootTypeBeingWrapped(typeBeingWrapped);
        _wrapsSomeNestedTypeIntoInfiniteExpansionRecurse(typeBeingWrapped: PullTypeSymbol, isCheckingTypeArgumentList: boolean, knownWrapMap: IBitMatrix): boolean;
        private _wrapsSomeNestedTypeIntoInfiniteExpansionWorker(typeBeingWrapped, isCheckingTypeArgumentList, knownWrapMap);
    }
    class PullPrimitiveTypeSymbol extends PullTypeSymbol {
        constructor(name: string);
        isAny(): boolean;
        isStringConstant(): boolean;
        setUnresolved(): void;
    }
    class PullStringConstantTypeSymbol extends PullPrimitiveTypeSymbol {
        constructor(name: string);
        isStringConstant(): boolean;
    }
    class PullErrorTypeSymbol extends PullPrimitiveTypeSymbol {
        private anyType;
        constructor(anyType: PullTypeSymbol, name: string);
        isError(): boolean;
        getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, skipInternalAliasName?: boolean): string;
        toString(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
    }
    class PullContainerSymbol extends PullTypeSymbol {
        instanceSymbol: PullSymbol;
        private assignedValue;
        private assignedType;
        private assignedContainer;
        constructor(name: string, kind: PullElementKind);
        isContainer(): boolean;
        setInstanceSymbol(symbol: PullSymbol): void;
        getInstanceSymbol(): PullSymbol;
        setExportAssignedValueSymbol(symbol: PullSymbol): void;
        getExportAssignedValueSymbol(): PullSymbol;
        setExportAssignedTypeSymbol(type: PullTypeSymbol): void;
        getExportAssignedTypeSymbol(): PullTypeSymbol;
        setExportAssignedContainerSymbol(container: PullContainerSymbol): void;
        getExportAssignedContainerSymbol(): PullContainerSymbol;
        hasExportAssignment(): boolean;
        static usedAsSymbol(containerSymbol: PullSymbol, symbol: PullSymbol): boolean;
        getInstanceType(): PullTypeSymbol;
    }
    class PullTypeAliasSymbol extends PullTypeSymbol {
        private _assignedValue;
        private _assignedType;
        private _assignedContainer;
        private _isUsedAsValue;
        private _typeUsedExternally;
        private retrievingExportAssignment;
        constructor(name: string);
        typeUsedExternally(): boolean;
        isUsedAsValue(): boolean;
        setTypeUsedExternally(value: boolean): void;
        setIsUsedAsValue(value: boolean): void;
        assignedValue(): PullSymbol;
        assignedType(): PullTypeSymbol;
        assignedContainer(): PullContainerSymbol;
        isAlias(): boolean;
        isContainer(): boolean;
        setAssignedValueSymbol(symbol: PullSymbol): void;
        getExportAssignedValueSymbol(): PullSymbol;
        setAssignedTypeSymbol(type: PullTypeSymbol): void;
        getExportAssignedTypeSymbol(): PullTypeSymbol;
        setAssignedContainerSymbol(container: PullContainerSymbol): void;
        getExportAssignedContainerSymbol(): PullContainerSymbol;
        getMembers(): PullSymbol[];
        getCallSignatures(): PullSignatureSymbol[];
        getConstructSignatures(): PullSignatureSymbol[];
        getIndexSignatures(): PullSignatureSymbol[];
        findMember(name: string): PullSymbol;
        findNestedType(name: string): PullTypeSymbol;
        findNestedContainer(name: string): PullTypeSymbol;
        getAllMembers(searchDeclKind: PullElementKind, memberVisibility: GetAllMembersVisiblity): PullSymbol[];
    }
    class PullDefinitionSignatureSymbol extends PullSignatureSymbol {
        isDefinition(): boolean;
    }
    class PullTypeParameterSymbol extends PullTypeSymbol {
        private _isFunctionTypeParameter;
        private _constraint;
        constructor(name: string, _isFunctionTypeParameter: boolean);
        isTypeParameter(): boolean;
        isFunctionTypeParameter(): boolean;
        setConstraint(constraintType: PullTypeSymbol): void;
        getConstraint(): PullTypeSymbol;
        getCallSignatures(): PullSignatureSymbol[];
        getConstructSignatures(): PullSignatureSymbol[];
        getIndexSignatures(): PullSignatureSymbol[];
        isGeneric(): boolean;
        fullName(scopeSymbol?: PullSymbol): string;
        getName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean): string;
        getDisplayName(scopeSymbol?: PullSymbol, useConstraintInName?: boolean, skipInternalAliasName?: boolean): string;
        isExternallyVisible(inIsExternallyVisibleSymbols?: PullSymbol[]): boolean;
    }
    class PullAccessorSymbol extends PullSymbol {
        private _getterSymbol;
        private _setterSymbol;
        constructor(name: string);
        isAccessor(): boolean;
        setSetter(setter: PullSymbol): void;
        getSetter(): PullSymbol;
        setGetter(getter: PullSymbol): void;
        getGetter(): PullSymbol;
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
        typeParameter: PullTypeParameterSymbol;
        isFixed: boolean;
        inferenceCandidates: PullTypeSymbol[];
        addCandidate(candidate: PullTypeSymbol): void;
    }
    class ArgumentInferenceContext {
        inferenceCache: IBitMatrix;
        candidateCache: CandidateInferenceInfo[];
        fixedParameterTypes: PullTypeSymbol[];
        resolver: PullTypeResolver;
        argumentASTs: ISeparatedSyntaxList2;
        constructor(resolver: PullTypeResolver, argumentASTs: ISeparatedSyntaxList2);
        constructor(resolver: PullTypeResolver, fixedParameterTypes: PullTypeSymbol[]);
        alreadyRelatingTypes(objectType: PullTypeSymbol, parameterType: PullTypeSymbol): boolean;
        resetRelationshipCache(): void;
        addInferenceRoot(param: PullTypeParameterSymbol): void;
        getInferenceInfo(param: PullTypeParameterSymbol): CandidateInferenceInfo;
        addCandidateForInference(param: PullTypeParameterSymbol, candidate: PullTypeSymbol, fix: boolean): void;
        getInferenceArgumentCount(): number;
        getArgumentTypeSymbolAtIndex(i: number, context: PullTypeResolutionContext): PullTypeSymbol;
        getInferenceCandidates(): PullTypeSymbol[][];
        inferArgumentTypes(resolver: PullTypeResolver, context: PullTypeResolutionContext): {
            results: {
                param: PullTypeParameterSymbol;
                type: PullTypeSymbol;
            }[];
            unfit: boolean;
        };
    }
    class PullContextualTypeContext {
        contextualType: PullTypeSymbol;
        provisional: boolean;
        substitutions: PullTypeSymbol[];
        provisionallyTypedSymbols: PullSymbol[];
        hasProvisionalErrors: boolean;
        private astSymbolMap;
        constructor(contextualType: PullTypeSymbol, provisional: boolean, substitutions: PullTypeSymbol[]);
        recordProvisionallyTypedSymbol(symbol: PullSymbol): void;
        invalidateProvisionallyTypedSymbols(): void;
        setSymbolForAST(ast: AST, symbol: PullSymbol): void;
        getSymbolForAST(ast: AST): PullSymbol;
    }
    class PullTypeResolutionContext {
        private resolver;
        inTypeCheck: boolean;
        fileName: string;
        private contextStack;
        private typeCheckedNodes;
        constructor(resolver: PullTypeResolver, inTypeCheck?: boolean, fileName?: string);
        setTypeChecked(ast: AST): void;
        canTypeCheckAST(ast: AST): boolean;
        pushContextualType(type: PullTypeSymbol, provisional: boolean, substitutions: PullTypeSymbol[]): void;
        popContextualType(): PullContextualTypeContext;
        hasProvisionalErrors(): boolean;
        findSubstitution(type: PullTypeSymbol): PullTypeSymbol;
        getContextualType(): PullTypeSymbol;
        inProvisionalResolution(): boolean;
        private inBaseTypeResolution;
        isInBaseTypeResolution(): boolean;
        startBaseTypeResolution(): boolean;
        doneBaseTypeResolution(wasInBaseTypeResolution: boolean): void;
        setTypeInContext(symbol: PullSymbol, type: PullTypeSymbol): void;
        postDiagnostic(diagnostic: Diagnostic): void;
        typeCheck(): boolean;
        setSymbolForAST(ast: AST, symbol: PullSymbol): void;
        getSymbolForAST(ast: AST): PullSymbol;
    }
}
declare module TypeScript {
    interface IPullTypeCollection {
        getLength(): number;
        getTypeAtIndex(index: number): PullTypeSymbol;
    }
    class PullAdditionalCallResolutionData {
        targetSymbol: PullSymbol;
        resolvedSignatures: PullSignatureSymbol[];
        candidateSignature: PullSignatureSymbol;
        actualParametersContextTypeSymbols: PullTypeSymbol[];
        diagnosticsFromOverloadResolution: Diagnostic[];
    }
    class PullAdditionalObjectLiteralResolutionData {
        membersContextTypeSymbols: PullTypeSymbol[];
    }
    class PullTypeResolver {
        private compilationSettings;
        semanticInfoChain: SemanticInfoChain;
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
        constructor(compilationSettings: ImmutableCompilationSettings, semanticInfoChain: SemanticInfoChain);
        private cachedArrayInterfaceType();
        getArrayNamedType(): PullTypeSymbol;
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
        getASTForDecl(decl: PullDecl): AST;
        getNewErrorTypeSymbol(name?: string): PullErrorTypeSymbol;
        getEnclosingDecl(decl: PullDecl): PullDecl;
        private getExportedMemberSymbol(symbol, parent);
        private getMemberSymbol(symbolName, declSearchKind, parent);
        private getSymbolFromDeclPath(symbolName, declPath, declSearchKind);
        private getVisibleDeclsFromDeclPath(declPath, declSearchKind);
        private addFilteredDecls(decls, declSearchKind, result);
        getVisibleDecls(enclosingDecl: PullDecl): PullDecl[];
        getVisibleContextSymbols(enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol[];
        getVisibleMembersFromExpression(expression: AST, enclosingDecl: PullDecl, context: PullTypeResolutionContext): PullSymbol[];
        private isAnyOrEquivalent(type);
        private resolveExternalModuleReference(idText, currentFileName);
        resolveDeclaredSymbol(symbol: PullSymbol, context?: PullTypeResolutionContext): PullSymbol;
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
        createInstantiatedType(type: PullTypeSymbol, typeArguments: PullTypeSymbol[]): PullTypeSymbol;
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
        resolveTypeReference(typeRef: AST, context: PullTypeResolutionContext): PullTypeSymbol;
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
        static hasSetAccessorParameterTypeAnnotation(setAccessor: SetAccessor): boolean;
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
        resolveAST(ast: AST, isContextuallyTyped: boolean, context: PullTypeResolutionContext): PullSymbol;
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
        resolveObjectLiteralExpression(expressionAST: ObjectLiteralExpression, isContextuallyTyped: boolean, context: PullTypeResolutionContext, additionalResults?: PullAdditionalObjectLiteralResolutionData): PullSymbol;
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
        resolveInvocationExpression(callEx: InvocationExpression, context: PullTypeResolutionContext, additionalResults?: PullAdditionalCallResolutionData): PullSymbol;
        private typeCheckInvocationExpression(callEx, context);
        private computeInvocationExpressionSymbol(callEx, context, additionalResults);
        resolveObjectCreationExpression(callEx: ObjectCreationExpression, context: PullTypeResolutionContext, additionalResults?: PullAdditionalCallResolutionData): PullSymbol;
        private typeCheckObjectCreationExpression(callEx, context);
        private postOverloadResolutionDiagnostics(diagnostic, additionalResults, context);
        private computeObjectCreationExpressionSymbol(callEx, context, additionalResults);
        private instantiateSignatureInContext(signatureA, signatureB, context);
        private resolveCastExpression(assertionExpression, context);
        private typeCheckCastExpression(assertionExpression, context, typeAssertionType);
        private resolveAssignmentExpression(binaryExpression, context);
        private getInstanceTypeForAssignment(lhs, type, context);
        widenType(type: PullTypeSymbol, ast?: AST, context?: PullTypeResolutionContext): PullTypeSymbol;
        findBestCommonType(collection: IPullTypeCollection, context: PullTypeResolutionContext, comparisonInfo?: TypeComparisonInfo): PullTypeSymbol;
        private typeIsBestCommonTypeCandidate(candidateType, collection, context);
        private typesAreIdenticalInEnclosingTypes(t1, t2, t1EnclosingType, t2EnclosingType, val?);
        typesAreIdentical(t1: PullTypeSymbol, t2: PullTypeSymbol, val?: AST): boolean;
        private signatureGroupsAreIdentical(sg1, sg2);
        signaturesAreIdentical(s1: PullSignatureSymbol, s2: PullSignatureSymbol, includingReturnType?: boolean): boolean;
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
        instantiateTypeToAny(typeToSpecialize: PullTypeSymbol, context: PullTypeResolutionContext): PullTypeSymbol;
        static globalTypeCheckPhase: number;
        static typeCheck(compilationSettings: ImmutableCompilationSettings, semanticInfoChain: SemanticInfoChain, document: Document): void;
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
        instantiateType(type: PullTypeSymbol, typeParameterArgumentMap: PullTypeSymbol[], instantiateFunctionTypeParameters?: boolean): PullTypeSymbol;
        instantiateSignature(signature: PullSignatureSymbol, typeParameterArgumentMap: PullTypeSymbol[], instantiateFunctionTypeParameters?: boolean): PullSignatureSymbol;
    }
    class TypeComparisonInfo {
        onlyCaptureFirstError: boolean;
        flags: TypeRelationshipFlags;
        message: string;
        stringConstantVal: AST;
        private indent;
        constructor(sourceComparisonInfo?: TypeComparisonInfo);
        private indentString();
        addMessage(message: string): void;
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
        anyTypeDecl: PullDecl;
        booleanTypeDecl: PullDecl;
        numberTypeDecl: PullDecl;
        stringTypeDecl: PullDecl;
        nullTypeDecl: PullDecl;
        undefinedTypeDecl: PullDecl;
        voidTypeDecl: PullDecl;
        undefinedValueDecl: PullDecl;
        anyTypeSymbol: PullPrimitiveTypeSymbol;
        booleanTypeSymbol: PullPrimitiveTypeSymbol;
        numberTypeSymbol: PullPrimitiveTypeSymbol;
        stringTypeSymbol: PullPrimitiveTypeSymbol;
        nullTypeSymbol: PullPrimitiveTypeSymbol;
        undefinedTypeSymbol: PullPrimitiveTypeSymbol;
        voidTypeSymbol: PullPrimitiveTypeSymbol;
        undefinedValueSymbol: PullSymbol;
        emptyTypeSymbol: PullTypeSymbol;
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
        constructor(compiler: TypeScriptCompiler, logger: ILogger);
        getDocument(fileName: string): Document;
        lineMap(fileName: string): LineMap;
        fileNames(): string[];
        private bindPrimitiveSymbol(decl, newSymbol);
        private addPrimitiveTypeSymbol(decl);
        private addPrimitiveValueSymbol(decl, type);
        private resetGlobalSymbols();
        addDocument(document: Document): void;
        removeDocument(fileName: string): void;
        private getDeclPathCacheID(declPath, declKind);
        findTopLevelSymbol(name: string, kind: PullElementKind, doNotGoPastThisDecl: PullDecl): PullSymbol;
        private findTopLevelSymbolInDecl(topLevelDecl, name, kind, doNotGoPastThisDecl);
        findExternalModule(id: string): PullContainerSymbol;
        findAmbientExternalModuleInGlobalContext(id: string): PullContainerSymbol;
        findDecls(declPath: string[], declKind: PullElementKind): PullDecl[];
        findDeclsFromPath(declPath: PullDecl[], declKind: PullElementKind): PullDecl[];
        findSymbol(declPath: string[], declType: PullElementKind): PullSymbol;
        cacheGlobalSymbol(symbol: PullSymbol, kind: PullElementKind): void;
        invalidate(oldSettings?: ImmutableCompilationSettings, newSettings?: ImmutableCompilationSettings): void;
        private settingsChangeAffectsSyntax(before, after);
        setSymbolForAST(ast: AST, symbol: PullSymbol): void;
        getSymbolForAST(ast: AST): PullSymbol;
        setAliasSymbolForAST(ast: AST, symbol: PullTypeAliasSymbol): void;
        getAliasSymbolForAST(ast: AST): PullTypeAliasSymbol;
        getCallResolutionDataForAST(ast: AST): PullAdditionalCallResolutionData;
        setCallResolutionDataForAST(ast: AST, callResolutionData: PullAdditionalCallResolutionData): void;
        setSymbolForDecl(decl: PullDecl, symbol: PullSymbol): void;
        getSymbolForDecl(decl: PullDecl): PullSymbol;
        setSignatureSymbolForDecl(decl: PullDecl, signatureSymbol: PullSignatureSymbol): void;
        getSignatureSymbolForDecl(decl: PullDecl): PullSignatureSymbol;
        addDiagnostic(diagnostic: Diagnostic): void;
        getDiagnostics(fileName: string): Diagnostic[];
        getBinder(): PullSymbolBinder;
        getResolver(): PullTypeResolver;
        addSyntheticIndexSignature(containingDecl: PullDecl, containingSymbol: PullTypeSymbol, ast: AST, indexParamName: string, indexParamType: PullTypeSymbol, returnType: PullTypeSymbol): void;
        getDeclForAST(ast: AST): PullDecl;
        getEnclosingDecl(ast: AST): PullDecl;
        setDeclForAST(ast: AST, decl: PullDecl): void;
        getASTForDecl(decl: PullDecl): AST;
        setASTForDecl(decl: PullDecl, ast: AST): void;
        topLevelDecl(fileName: string): PullDecl;
        topLevelDecls(): PullDecl[];
        addDiagnosticFromAST(ast: AST, diagnosticKey: string, arguments?: any[]): void;
        diagnosticFromAST(ast: AST, diagnosticKey: string, arguments?: any[]): Diagnostic;
    }
}
declare module TypeScript {
    function getModuleNames(name: AST, result?: Identifier[]): Identifier[];
    module DeclarationCreator {
        function create(document: Document, semanticInfoChain: SemanticInfoChain, compilationSettings: ImmutableCompilationSettings): PullDecl;
    }
}
declare module TypeScript {
    class PullSymbolBinder {
        private semanticInfoChain;
        private declsBeingBound;
        constructor(semanticInfoChain: SemanticInfoChain);
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
        bindDeclToPullSymbol(decl: PullDecl): void;
    }
}
declare module TypeScript {
    module PullHelpers {
        interface SignatureInfoForFuncDecl {
            signature: PullSignatureSymbol;
            allSignatures: PullSignatureSymbol[];
        }
        function getSignatureForFuncDecl(functionDecl: PullDecl): {
            signature: PullSignatureSymbol;
            allSignatures: PullSignatureSymbol[];
        };
        function getAccessorSymbol(getterOrSetter: AST, semanticInfoChain: SemanticInfoChain): PullAccessorSymbol;
        function getGetterAndSetterFunction(funcDecl: AST, semanticInfoChain: SemanticInfoChain): {
            getter: GetAccessor;
            setter: SetAccessor;
        };
        function symbolIsEnum(source: PullSymbol): boolean;
        function symbolIsModule(symbol: PullSymbol): boolean;
        function isNameNumeric(name: string): boolean;
        function typeSymbolsAreIdentical(a: PullTypeSymbol, b: PullTypeSymbol): boolean;
        function getRootType(type: PullTypeSymbol): PullTypeSymbol;
        function isSymbolLocal(symbol: PullSymbol): boolean;
    }
}
declare module TypeScript {
    enum GenerativeTypeClassification {
        Unknown = 0,
        Open = 1,
        Closed = 2,
        InfinitelyExpanding = 3,
    }
    class PullTypeReferenceSymbol extends PullTypeSymbol {
        referencedTypeSymbol: PullTypeSymbol;
        static createTypeReference(type: PullTypeSymbol): PullTypeReferenceSymbol;
        constructor(referencedTypeSymbol: PullTypeSymbol);
        isTypeReference(): boolean;
        isResolved: boolean;
        setResolved(): void;
        setUnresolved(): void;
        invalidate(): void;
        ensureReferencedTypeIsResolved(): void;
        getReferencedTypeSymbol(): PullTypeSymbol;
        _getResolver(): PullTypeResolver;
        hasMembers(): boolean;
        setAssociatedContainerType(type: PullTypeSymbol): void;
        getAssociatedContainerType(): PullTypeSymbol;
        getFunctionSymbol(): PullSymbol;
        setFunctionSymbol(symbol: PullSymbol): void;
        addContainedNonMember(nonMember: PullSymbol): void;
        findContainedNonMemberContainer(containerName: string, kind?: PullElementKind): PullTypeSymbol;
        addMember(memberSymbol: PullSymbol): void;
        addEnclosedMemberType(enclosedType: PullTypeSymbol): void;
        addEnclosedMemberContainer(enclosedContainer: PullTypeSymbol): void;
        addEnclosedNonMember(enclosedNonMember: PullSymbol): void;
        addEnclosedNonMemberType(enclosedNonMemberType: PullTypeSymbol): void;
        addEnclosedNonMemberContainer(enclosedNonMemberContainer: PullTypeSymbol): void;
        addTypeParameter(typeParameter: PullTypeParameterSymbol): void;
        addConstructorTypeParameter(typeParameter: PullTypeParameterSymbol): void;
        findContainedNonMember(name: string): PullSymbol;
        findContainedNonMemberType(typeName: string, kind?: PullElementKind): PullTypeSymbol;
        getMembers(): PullSymbol[];
        setHasDefaultConstructor(hasOne?: boolean): void;
        getHasDefaultConstructor(): boolean;
        getConstructorMethod(): PullSymbol;
        setConstructorMethod(constructorMethod: PullSymbol): void;
        getTypeParameters(): PullTypeParameterSymbol[];
        isGeneric(): boolean;
        addSpecialization(specializedVersionOfThisType: PullTypeSymbol, substitutingTypes: PullTypeSymbol[]): void;
        getSpecialization(substitutingTypes: PullTypeSymbol[]): PullTypeSymbol;
        getKnownSpecializations(): PullTypeSymbol[];
        getTypeArguments(): PullTypeSymbol[];
        getTypeArgumentsOrTypeParameters(): PullTypeSymbol[];
        addCallSignature(callSignature: PullSignatureSymbol): void;
        addConstructSignature(constructSignature: PullSignatureSymbol): void;
        addIndexSignature(indexSignature: PullSignatureSymbol): void;
        hasOwnCallSignatures(): boolean;
        getCallSignatures(): PullSignatureSymbol[];
        hasOwnConstructSignatures(): boolean;
        getConstructSignatures(): PullSignatureSymbol[];
        hasOwnIndexSignatures(): boolean;
        getIndexSignatures(): PullSignatureSymbol[];
        addImplementedType(implementedType: PullTypeSymbol): void;
        getImplementedTypes(): PullTypeSymbol[];
        addExtendedType(extendedType: PullTypeSymbol): void;
        getExtendedTypes(): PullTypeSymbol[];
        addTypeThatExtendsThisType(type: PullTypeSymbol): void;
        getTypesThatExtendThisType(): PullTypeSymbol[];
        addTypeThatExplicitlyImplementsThisType(type: PullTypeSymbol): void;
        getTypesThatExplicitlyImplementThisType(): PullTypeSymbol[];
        hasBase(potentialBase: PullTypeSymbol, visited?: PullSymbol[]): boolean;
        isValidBaseKind(baseType: PullTypeSymbol, isExtendedType: boolean): boolean;
        findMember(name: string, lookInParent?: boolean): PullSymbol;
        findNestedType(name: string, kind?: PullElementKind): PullTypeSymbol;
        findNestedContainer(name: string, kind?: PullElementKind): PullTypeSymbol;
        getAllMembers(searchDeclKind: PullElementKind, memberVisiblity: GetAllMembersVisiblity): PullSymbol[];
        findTypeParameter(name: string): PullTypeParameterSymbol;
        hasOnlyOverloadCallSignatures(): boolean;
    }
    var nSpecializationsCreated: number;
    var nSpecializedSignaturesCreated: number;
    class PullInstantiatedTypeReferenceSymbol extends PullTypeReferenceSymbol {
        referencedTypeSymbol: PullTypeSymbol;
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
        isInstanceReferenceType: boolean;
        getIsSpecialized(): boolean;
        private _generativeTypeClassification;
        getGenerativeTypeClassification(enclosingType: PullTypeSymbol): GenerativeTypeClassification;
        isArrayNamedTypeReference(): boolean;
        getElementType(): PullTypeSymbol;
        getReferencedTypeSymbol(): PullTypeSymbol;
        static create(resolver: PullTypeResolver, type: PullTypeSymbol, typeParameterArgumentMap: PullTypeSymbol[], instantiateFunctionTypeParameters?: boolean): PullInstantiatedTypeReferenceSymbol;
        constructor(referencedTypeSymbol: PullTypeSymbol, _typeParameterArgumentMap: PullTypeSymbol[]);
        isGeneric(): boolean;
        getTypeParameterArgumentMap(): PullTypeSymbol[];
        getTypeArguments(): PullTypeSymbol[];
        getTypeArgumentsOrTypeParameters(): PullTypeSymbol[];
        getMembers(): PullSymbol[];
        findMember(name: string, lookInParent?: boolean): PullSymbol;
        getAllMembers(searchDeclKind: PullElementKind, memberVisiblity: GetAllMembersVisiblity): PullSymbol[];
        getConstructorMethod(): PullSymbol;
        getAssociatedContainerType(): PullTypeSymbol;
        getCallSignatures(): PullSignatureSymbol[];
        getConstructSignatures(): PullSignatureSymbol[];
        getIndexSignatures(): PullSignatureSymbol[];
        hasBase(potentialBase: PullTypeSymbol, visited?: PullSymbol[]): boolean;
    }
}
declare module TypeScript {
    class SyntaxTreeToAstVisitor implements ISyntaxVisitor {
        private fileName;
        lineMap: LineMap;
        private compilationSettings;
        position: number;
        previousTokenTrailingComments: Comment[];
        constructor(fileName: string, lineMap: LineMap, compilationSettings: ImmutableCompilationSettings);
        static visit(syntaxTree: SyntaxTree, fileName: string, compilationSettings: ImmutableCompilationSettings, incrementalAST: boolean): SourceUnit;
        movePast(element: ISyntaxElement): void;
        private moveTo(element1, element2);
        private setCommentsAndSpan(ast, fullStart, node);
        createTokenSpan(fullStart: number, element: ISyntaxToken): ASTSpan;
        setSpan(span: AST, fullStart: number, element: ISyntaxElement, firstToken?: ISyntaxToken, lastToken?: ISyntaxToken): void;
        setSpanExplicit(span: IASTSpan, start: number, end: number): void;
        visitSyntaxList(node: ISyntaxList): ISyntaxList2;
        visitSeparatedSyntaxList(list: ISeparatedSyntaxList): ISeparatedSyntaxList2;
        private convertComment(trivia, commentStartPosition, hasTrailingNewLine);
        private convertComments(triviaList, commentStartPosition);
        private mergeComments(comments1, comments2);
        private convertTokenLeadingComments(token, commentStartPosition);
        private convertTokenTrailingComments(token, commentStartPosition);
        private convertNodeTrailingComments(node, lastToken, nodeStart);
        private visitIdentifier(token);
        visitToken(token: ISyntaxToken): IASTToken;
        visitTokenWorker(token: ISyntaxToken): IASTToken;
        visitSourceUnit(node: SourceUnitSyntax): SourceUnit;
        visitExternalModuleReference(node: ExternalModuleReferenceSyntax): ExternalModuleReference;
        visitModuleNameModuleReference(node: ModuleNameModuleReferenceSyntax): ModuleNameModuleReference;
        visitClassDeclaration(node: ClassDeclarationSyntax): ClassDeclaration;
        private visitModifiers(modifiers);
        visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): InterfaceDeclaration;
        visitHeritageClause(node: HeritageClauseSyntax): HeritageClause;
        visitModuleDeclaration(node: ModuleDeclarationSyntax): ModuleDeclaration;
        visitFunctionDeclaration(node: FunctionDeclarationSyntax): FunctionDeclaration;
        visitEnumDeclaration(node: EnumDeclarationSyntax): EnumDeclaration;
        visitEnumElement(node: EnumElementSyntax): EnumElement;
        visitImportDeclaration(node: ImportDeclarationSyntax): ImportDeclaration;
        visitExportAssignment(node: ExportAssignmentSyntax): ExportAssignment;
        visitVariableStatement(node: VariableStatementSyntax): VariableStatement;
        visitVariableDeclaration(node: VariableDeclarationSyntax): VariableDeclaration;
        visitVariableDeclarator(node: VariableDeclaratorSyntax): VariableDeclarator;
        visitEqualsValueClause(node: EqualsValueClauseSyntax): EqualsValueClause;
        visitPrefixUnaryExpression(node: PrefixUnaryExpressionSyntax): PrefixUnaryExpression;
        visitArrayLiteralExpression(node: ArrayLiteralExpressionSyntax): ArrayLiteralExpression;
        visitOmittedExpression(node: OmittedExpressionSyntax): OmittedExpression;
        visitParenthesizedExpression(node: ParenthesizedExpressionSyntax): ParenthesizedExpression;
        visitSimpleArrowFunctionExpression(node: SimpleArrowFunctionExpressionSyntax): SimpleArrowFunctionExpression;
        visitParenthesizedArrowFunctionExpression(node: ParenthesizedArrowFunctionExpressionSyntax): ParenthesizedArrowFunctionExpression;
        visitType(type: ITypeSyntax): AST;
        visitTypeQuery(node: TypeQuerySyntax): TypeQuery;
        visitQualifiedName(node: QualifiedNameSyntax): QualifiedName;
        visitTypeArgumentList(node: TypeArgumentListSyntax): TypeArgumentList;
        visitConstructorType(node: ConstructorTypeSyntax): ConstructorType;
        visitFunctionType(node: FunctionTypeSyntax): FunctionType;
        visitObjectType(node: ObjectTypeSyntax): ObjectType;
        visitArrayType(node: ArrayTypeSyntax): ArrayType;
        visitGenericType(node: GenericTypeSyntax): GenericType;
        visitTypeAnnotation(node: TypeAnnotationSyntax): TypeAnnotation;
        visitBlock(node: BlockSyntax): Block;
        visitParameter(node: ParameterSyntax): Parameter;
        visitMemberAccessExpression(node: MemberAccessExpressionSyntax): MemberAccessExpression;
        visitPostfixUnaryExpression(node: PostfixUnaryExpressionSyntax): PostfixUnaryExpression;
        visitElementAccessExpression(node: ElementAccessExpressionSyntax): ElementAccessExpression;
        visitInvocationExpression(node: InvocationExpressionSyntax): InvocationExpression;
        visitArgumentList(node: ArgumentListSyntax): ArgumentList;
        visitBinaryExpression(node: BinaryExpressionSyntax): BinaryExpression;
        visitConditionalExpression(node: ConditionalExpressionSyntax): ConditionalExpression;
        visitConstructSignature(node: ConstructSignatureSyntax): ConstructSignature;
        visitMethodSignature(node: MethodSignatureSyntax): MethodSignature;
        visitIndexSignature(node: IndexSignatureSyntax): IndexSignature;
        visitPropertySignature(node: PropertySignatureSyntax): PropertySignature;
        visitParameterList(node: ParameterListSyntax): ParameterList;
        visitCallSignature(node: CallSignatureSyntax): CallSignature;
        visitTypeParameterList(node: TypeParameterListSyntax): TypeParameterList;
        visitTypeParameter(node: TypeParameterSyntax): TypeParameter;
        visitConstraint(node: ConstraintSyntax): Constraint;
        visitIfStatement(node: IfStatementSyntax): IfStatement;
        visitElseClause(node: ElseClauseSyntax): ElseClause;
        visitExpressionStatement(node: ExpressionStatementSyntax): ExpressionStatement;
        visitConstructorDeclaration(node: ConstructorDeclarationSyntax): ConstructorDeclaration;
        visitIndexMemberDeclaration(node: IndexMemberDeclarationSyntax): IndexMemberDeclaration;
        visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): MemberFunctionDeclaration;
        visitGetAccessor(node: GetAccessorSyntax): GetAccessor;
        visitSetAccessor(node: SetAccessorSyntax): SetAccessor;
        visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): MemberVariableDeclaration;
        visitThrowStatement(node: ThrowStatementSyntax): ThrowStatement;
        visitReturnStatement(node: ReturnStatementSyntax): ReturnStatement;
        visitObjectCreationExpression(node: ObjectCreationExpressionSyntax): ObjectCreationExpression;
        visitSwitchStatement(node: SwitchStatementSyntax): SwitchStatement;
        visitCaseSwitchClause(node: CaseSwitchClauseSyntax): CaseSwitchClause;
        visitDefaultSwitchClause(node: DefaultSwitchClauseSyntax): DefaultSwitchClause;
        visitBreakStatement(node: BreakStatementSyntax): BreakStatement;
        visitContinueStatement(node: ContinueStatementSyntax): ContinueStatement;
        visitForStatement(node: ForStatementSyntax): ForStatement;
        visitForInStatement(node: ForInStatementSyntax): ForInStatement;
        visitWhileStatement(node: WhileStatementSyntax): WhileStatement;
        visitWithStatement(node: WithStatementSyntax): WithStatement;
        visitCastExpression(node: CastExpressionSyntax): CastExpression;
        visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): ObjectLiteralExpression;
        visitSimplePropertyAssignment(node: SimplePropertyAssignmentSyntax): SimplePropertyAssignment;
        visitFunctionPropertyAssignment(node: FunctionPropertyAssignmentSyntax): FunctionPropertyAssignment;
        visitFunctionExpression(node: FunctionExpressionSyntax): FunctionExpression;
        visitEmptyStatement(node: EmptyStatementSyntax): EmptyStatement;
        visitTryStatement(node: TryStatementSyntax): TryStatement;
        visitCatchClause(node: CatchClauseSyntax): CatchClause;
        visitFinallyClause(node: FinallyClauseSyntax): FinallyClause;
        visitLabeledStatement(node: LabeledStatementSyntax): LabeledStatement;
        visitDoStatement(node: DoStatementSyntax): DoStatement;
        visitTypeOfExpression(node: TypeOfExpressionSyntax): TypeOfExpression;
        visitDeleteExpression(node: DeleteExpressionSyntax): DeleteExpression;
        visitVoidExpression(node: VoidExpressionSyntax): VoidExpression;
        visitDebuggerStatement(node: DebuggerStatementSyntax): DebuggerStatement;
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
        symbol: PullSymbol;
        aliasSymbol: PullTypeAliasSymbol;
        ast: AST;
        enclosingScopeSymbol: PullSymbol;
    }
    interface PullCallSymbolInfo {
        targetSymbol: PullSymbol;
        resolvedSignatures: PullSignatureSymbol[];
        candidateSignature: PullSignatureSymbol;
        isConstructorCall: boolean;
        ast: AST;
        enclosingScopeSymbol: PullSymbol;
    }
    interface PullVisibleSymbolsInfo {
        symbols: PullSymbol[];
        enclosingScopeSymbol: PullSymbol;
    }
    class EmitOutput {
        outputFiles: OutputFile[];
        diagnostics: Diagnostic[];
    }
    enum OutputFileType {
        JavaScript = 0,
        SourceMap = 1,
        Declaration = 2,
    }
    class OutputFile {
        name: string;
        writeByteOrderMark: boolean;
        text: string;
        fileType: OutputFileType;
        sourceMapEntries: SourceMapEntry[];
        constructor(name: string, writeByteOrderMark: boolean, text: string, fileType: OutputFileType, sourceMapEntries?: SourceMapEntry[]);
    }
    class CompileResult {
        diagnostics: Diagnostic[];
        outputFiles: OutputFile[];
        static fromDiagnostics(diagnostics: Diagnostic[]): CompileResult;
        static fromOutputFiles(outputFiles: OutputFile[]): CompileResult;
    }
    class TypeScriptCompiler {
        logger: ILogger;
        private _settings;
        private semanticInfoChain;
        constructor(logger?: ILogger, _settings?: ImmutableCompilationSettings);
        compilationSettings(): ImmutableCompilationSettings;
        setCompilationSettings(newSettings: ImmutableCompilationSettings): void;
        getDocument(fileName: string): Document;
        cleanupSemanticCache(): void;
        addFile(fileName: string, scriptSnapshot: IScriptSnapshot, byteOrderMark: ByteOrderMark, version: number, isOpen: boolean, referencedFiles?: string[]): void;
        updateFile(fileName: string, scriptSnapshot: IScriptSnapshot, version: number, isOpen: boolean, textChangeRange: TextChangeRange): void;
        removeFile(fileName: string): void;
        _isDynamicModuleCompilation(): boolean;
        mapOutputFileName(document: Document, emitOptions: EmitOptions, extensionChanger: (fname: string, wholeFileNameReplaced: boolean) => string): string;
        private writeByteOrderMarkForDocument(document);
        static mapToDTSFileName(fileName: string, wholeFileNameReplaced: boolean): string;
        _shouldEmit(document: Document): boolean;
        _shouldEmitDeclarations(document: Document): boolean;
        private emitDocumentDeclarationsWorker(document, emitOptions, declarationEmitter?);
        _emitDocumentDeclarations(document: Document, emitOptions: EmitOptions, onSingleFileEmitComplete: (files: OutputFile) => void, sharedEmitter: DeclarationEmitter): DeclarationEmitter;
        emitAllDeclarations(resolvePath: (path: string) => string): EmitOutput;
        emitDeclarations(fileName: string, resolvePath: (path: string) => string): EmitOutput;
        static mapToFileNameExtension(extension: string, fileName: string, wholeFileNameReplaced: boolean): string;
        static mapToJSFileName(fileName: string, wholeFileNameReplaced: boolean): string;
        private emitDocumentWorker(document, emitOptions, emitter?);
        _emitDocument(document: Document, emitOptions: EmitOptions, onSingleFileEmitComplete: (files: OutputFile[]) => void, sharedEmitter: Emitter): Emitter;
        emitAll(resolvePath: (path: string) => string): EmitOutput;
        emit(fileName: string, resolvePath: (path: string) => string): EmitOutput;
        compile(resolvePath: (path: string) => string, continueOnDiagnostics?: boolean): Iterator<CompileResult>;
        getSyntacticDiagnostics(fileName: string): Diagnostic[];
        private getSyntaxTree(fileName);
        private getSourceUnit(fileName);
        getSemanticDiagnostics(fileName: string): Diagnostic[];
        resolveAllFiles(): void;
        getSymbolOfDeclaration(decl: PullDecl): PullSymbol;
        private extractResolutionContextFromAST(resolver, ast, document, propagateContextualTypes);
        private extractResolutionContextForVariable(inContextuallyTypedAssignment, propagateContextualTypes, resolver, resolutionContext, enclosingDecl, assigningAST, init);
        private getASTPath(ast);
        pullGetSymbolInformationFromAST(ast: AST, document: Document): PullSymbolInfo;
        pullGetCallInformationFromAST(ast: AST, document: Document): PullCallSymbolInfo;
        pullGetVisibleMemberSymbolsFromAST(ast: AST, document: Document): PullVisibleSymbolsInfo;
        pullGetVisibleDeclsFromAST(ast: AST, document: Document): PullDecl[];
        pullGetContextualMembersFromAST(ast: AST, document: Document): PullVisibleSymbolsInfo;
        pullGetDeclInformation(decl: PullDecl, ast: AST, document: Document): PullSymbolInfo;
        topLevelDeclaration(fileName: string): PullDecl;
        getDeclForAST(ast: AST): PullDecl;
        fileNames(): string[];
        topLevelDecl(fileName: string): PullDecl;
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
        host: IClassifierHost;
        private scanner;
        private characterWindow;
        private diagnostics;
        constructor(host: IClassifierHost);
        getClassificationsForLine(text: string, lexState: EndOfLineState): ClassificationResult;
        private processToken(text, offset, token, result);
        private processTriviaList(text, offset, triviaList, result);
        private addResult(text, offset, result, length, kind);
        private classFromKind(kind);
    }
    interface IClassifierHost extends ILogger {
    }
    class ClassificationResult {
        finalLexState: EndOfLineState;
        entries: ClassificationInfo[];
        constructor();
    }
    class ClassificationInfo {
        length: number;
        classification: TokenClass;
        constructor(length: number, classification: TokenClass);
    }
}
declare module TypeScript.Services.Formatting {
    interface ITextSnapshot {
        getText(span: TextSpan): string;
        getLineNumberFromPosition(position: number): number;
        getLineFromPosition(position: number): ITextSnapshotLine;
        getLineFromLineNumber(lineNumber: number): ITextSnapshotLine;
    }
    class TextSnapshot implements ITextSnapshot {
        private snapshot;
        private lines;
        constructor(snapshot: ISimpleText);
        getText(span: TextSpan): string;
        getLineNumberFromPosition(position: number): number;
        getLineFromPosition(position: number): ITextSnapshotLine;
        getLineFromLineNumber(lineNumber: number): ITextSnapshotLine;
        private getLineFromLineNumberWorker(lineNumber);
    }
}
declare module TypeScript.Services.Formatting {
    interface ITextSnapshotLine {
        snapshot(): ITextSnapshot;
        start(): SnapshotPoint;
        startPosition(): number;
        end(): SnapshotPoint;
        endPosition(): number;
        endIncludingLineBreak(): SnapshotPoint;
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
        constructor(_snapshot: ITextSnapshot, _lineNumber: number, _start: number, _end: number, _lineBreak: string);
        snapshot(): ITextSnapshot;
        start(): SnapshotPoint;
        startPosition(): number;
        end(): SnapshotPoint;
        endPosition(): number;
        endIncludingLineBreak(): SnapshotPoint;
        endIncludingLineBreakPosition(): number;
        length(): number;
        lineNumber(): number;
        getText(): string;
    }
}
declare module TypeScript.Services.Formatting {
    class SnapshotPoint {
        snapshot: ITextSnapshot;
        position: number;
        constructor(snapshot: ITextSnapshot, position: number);
        getContainingLine(): ITextSnapshotLine;
        add(offset: number): SnapshotPoint;
    }
}
declare module TypeScript.Services.Formatting {
    class FormattingContext {
        private snapshot;
        formattingRequestKind: FormattingRequestKind;
        currentTokenSpan: TokenSpan;
        nextTokenSpan: TokenSpan;
        contextNode: IndentationNodeContext;
        currentTokenParent: IndentationNodeContext;
        nextTokenParent: IndentationNodeContext;
        private contextNodeAllOnSameLine;
        private nextNodeAllOnSameLine;
        private tokensAreOnSameLine;
        private contextNodeBlockIsOnOneLine;
        private nextNodeBlockIsOnOneLine;
        constructor(snapshot: ITextSnapshot, formattingRequestKind: FormattingRequestKind);
        updateContext(currentTokenSpan: TokenSpan, currentTokenParent: IndentationNodeContext, nextTokenSpan: TokenSpan, nextTokenParent: IndentationNodeContext, commonParent: IndentationNodeContext): void;
        ContextNodeAllOnSameLine(): boolean;
        NextNodeAllOnSameLine(): boolean;
        TokensAreOnSameLine(): boolean;
        ContextNodeBlockIsOnOneLine(): boolean;
        NextNodeBlockIsOnOneLine(): boolean;
        NodeIsOnOneLine(node: IndentationNodeContext): boolean;
        BlockIsOnOneLine(node: IndentationNodeContext): boolean;
    }
}
declare module TypeScript.Services.Formatting {
    class FormattingManager {
        private syntaxTree;
        private snapshot;
        private rulesProvider;
        private options;
        constructor(syntaxTree: SyntaxTree, snapshot: ITextSnapshot, rulesProvider: RulesProvider, editorOptions: EditorOptions);
        formatSelection(minChar: number, limChar: number): TextEdit[];
        formatDocument(minChar: number, limChar: number): TextEdit[];
        formatOnPaste(minChar: number, limChar: number): TextEdit[];
        formatOnSemicolon(caretPosition: number): TextEdit[];
        formatOnClosingCurlyBrace(caretPosition: number): TextEdit[];
        formatOnEnter(caretPosition: number): TextEdit[];
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
        Descriptor: RuleDescriptor;
        Operation: RuleOperation;
        Flag: RuleFlags;
        constructor(Descriptor: RuleDescriptor, Operation: RuleOperation, Flag?: RuleFlags);
        toString(): string;
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
        LeftTokenRange: Shared.TokenRange;
        RightTokenRange: Shared.TokenRange;
        constructor(LeftTokenRange: Shared.TokenRange, RightTokenRange: Shared.TokenRange);
        toString(): string;
        static create1(left: SyntaxKind, right: SyntaxKind): RuleDescriptor;
        static create2(left: Shared.TokenRange, right: SyntaxKind): RuleDescriptor;
        static create3(left: SyntaxKind, right: Shared.TokenRange): RuleDescriptor;
        static create4(left: Shared.TokenRange, right: Shared.TokenRange): RuleDescriptor;
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
        Context: RuleOperationContext;
        Action: RuleAction;
        constructor();
        toString(): string;
        static create1(action: RuleAction): RuleOperation;
        static create2(context: RuleOperationContext, action: RuleAction): RuleOperation;
    }
}
declare module TypeScript.Services.Formatting {
    class RuleOperationContext {
        private customContextChecks;
        constructor(...funcs: {
            (context: FormattingContext): boolean;
        }[]);
        static Any: RuleOperationContext;
        IsAny(): boolean;
        InContext(context: FormattingContext): boolean;
    }
}
declare module TypeScript.Services.Formatting {
    class Rules {
        getRuleName(rule: Rule): any;
        IgnoreBeforeComment: Rule;
        IgnoreAfterLineComment: Rule;
        NoSpaceBeforeSemicolon: Rule;
        NoSpaceBeforeColon: Rule;
        NoSpaceBeforeQMark: Rule;
        SpaceAfterColon: Rule;
        SpaceAfterQMark: Rule;
        SpaceAfterSemicolon: Rule;
        SpaceAfterCloseBrace: Rule;
        SpaceBetweenCloseBraceAndElse: Rule;
        SpaceBetweenCloseBraceAndWhile: Rule;
        NoSpaceAfterCloseBrace: Rule;
        NoSpaceBeforeDot: Rule;
        NoSpaceAfterDot: Rule;
        NoSpaceBeforeOpenBracket: Rule;
        NoSpaceAfterOpenBracket: Rule;
        NoSpaceBeforeCloseBracket: Rule;
        NoSpaceAfterCloseBracket: Rule;
        SpaceAfterOpenBrace: Rule;
        SpaceBeforeCloseBrace: Rule;
        NoSpaceBetweenEmptyBraceBrackets: Rule;
        NewLineAfterOpenBraceInBlockContext: Rule;
        NewLineBeforeCloseBraceInBlockContext: Rule;
        NoSpaceAfterUnaryPrefixOperator: Rule;
        NoSpaceAfterUnaryPreincrementOperator: Rule;
        NoSpaceAfterUnaryPredecrementOperator: Rule;
        NoSpaceBeforeUnaryPostincrementOperator: Rule;
        NoSpaceBeforeUnaryPostdecrementOperator: Rule;
        SpaceAfterPostincrementWhenFollowedByAdd: Rule;
        SpaceAfterAddWhenFollowedByUnaryPlus: Rule;
        SpaceAfterAddWhenFollowedByPreincrement: Rule;
        SpaceAfterPostdecrementWhenFollowedBySubtract: Rule;
        SpaceAfterSubtractWhenFollowedByUnaryMinus: Rule;
        SpaceAfterSubtractWhenFollowedByPredecrement: Rule;
        NoSpaceBeforeComma: Rule;
        SpaceAfterCertainKeywords: Rule;
        NoSpaceBeforeOpenParenInFuncCall: Rule;
        SpaceAfterFunctionInFuncDecl: Rule;
        NoSpaceBeforeOpenParenInFuncDecl: Rule;
        SpaceAfterVoidOperator: Rule;
        NoSpaceBetweenReturnAndSemicolon: Rule;
        SpaceBetweenStatements: Rule;
        SpaceAfterTryFinally: Rule;
        SpaceAfterGetSetInMember: Rule;
        SpaceBeforeBinaryKeywordOperator: Rule;
        SpaceAfterBinaryKeywordOperator: Rule;
        NoSpaceAfterConstructor: Rule;
        NoSpaceAfterModuleImport: Rule;
        SpaceAfterCertainTypeScriptKeywords: Rule;
        SpaceBeforeCertainTypeScriptKeywords: Rule;
        SpaceAfterModuleName: Rule;
        SpaceAfterArrow: Rule;
        NoSpaceAfterEllipsis: Rule;
        NoSpaceAfterOptionalParameters: Rule;
        NoSpaceBeforeOpenAngularBracket: Rule;
        NoSpaceBetweenCloseParenAndAngularBracket: Rule;
        NoSpaceAfterOpenAngularBracket: Rule;
        NoSpaceBeforeCloseAngularBracket: Rule;
        NoSpaceAfterCloseAngularBracket: Rule;
        NoSpaceBetweenEmptyInterfaceBraceBrackets: Rule;
        HighPriorityCommonRules: Rule[];
        LowPriorityCommonRules: Rule[];
        SpaceAfterComma: Rule;
        NoSpaceAfterComma: Rule;
        SpaceBeforeBinaryOperator: Rule;
        SpaceAfterBinaryOperator: Rule;
        NoSpaceBeforeBinaryOperator: Rule;
        NoSpaceAfterBinaryOperator: Rule;
        SpaceAfterKeywordInControl: Rule;
        NoSpaceAfterKeywordInControl: Rule;
        FunctionOpenBraceLeftTokenRange: Shared.TokenRange;
        SpaceBeforeOpenBraceInFunction: Rule;
        NewLineBeforeOpenBraceInFunction: Rule;
        TypeScriptOpenBraceLeftTokenRange: Shared.TokenRange;
        SpaceBeforeOpenBraceInTypeScriptDeclWithBlock: Rule;
        NewLineBeforeOpenBraceInTypeScriptDeclWithBlock: Rule;
        ControlOpenBraceLeftTokenRange: Shared.TokenRange;
        SpaceBeforeOpenBraceInControl: Rule;
        NewLineBeforeOpenBraceInControl: Rule;
        SpaceAfterSemicolonInFor: Rule;
        NoSpaceAfterSemicolonInFor: Rule;
        SpaceAfterOpenParen: Rule;
        SpaceBeforeCloseParen: Rule;
        NoSpaceBetweenParens: Rule;
        NoSpaceAfterOpenParen: Rule;
        NoSpaceBeforeCloseParen: Rule;
        SpaceAfterAnonymousFunctionKeyword: Rule;
        NoSpaceAfterAnonymousFunctionKeyword: Rule;
        constructor();
        static IsForContext(context: FormattingContext): boolean;
        static IsNotForContext(context: FormattingContext): boolean;
        static IsBinaryOpContext(context: FormattingContext): boolean;
        static IsNotBinaryOpContext(context: FormattingContext): boolean;
        static IsSameLineTokenOrBeforeMultilineBlockContext(context: FormattingContext): boolean;
        static IsBeforeMultilineBlockContext(context: FormattingContext): boolean;
        static IsMultilineBlockContext(context: FormattingContext): boolean;
        static IsSingleLineBlockContext(context: FormattingContext): boolean;
        static IsBlockContext(context: FormattingContext): boolean;
        static IsBeforeBlockContext(context: FormattingContext): boolean;
        static NodeIsBlockContext(node: IndentationNodeContext): boolean;
        static IsFunctionDeclContext(context: FormattingContext): boolean;
        static IsTypeScriptDeclWithBlockContext(context: FormattingContext): boolean;
        static NodeIsTypeScriptDeclWithBlockContext(node: IndentationNodeContext): boolean;
        static IsAfterCodeBlockContext(context: FormattingContext): boolean;
        static IsControlDeclContext(context: FormattingContext): boolean;
        static IsObjectContext(context: FormattingContext): boolean;
        static IsFunctionCallContext(context: FormattingContext): boolean;
        static IsNewContext(context: FormattingContext): boolean;
        static IsFunctionCallOrNewContext(context: FormattingContext): boolean;
        static IsSameLineTokenContext(context: FormattingContext): boolean;
        static IsNotFormatOnEnter(context: FormattingContext): boolean;
        static IsModuleDeclContext(context: FormattingContext): boolean;
        static IsObjectTypeContext(context: FormattingContext): boolean;
        static IsTypeArgumentOrParameter(tokenKind: SyntaxKind, parentKind: SyntaxKind): boolean;
        static IsTypeArgumentOrParameterContext(context: FormattingContext): boolean;
        static IsVoidOpContext(context: FormattingContext): boolean;
    }
}
declare module TypeScript.Services.Formatting {
    class RulesMap {
        map: RulesBucket[];
        mapRowLength: number;
        constructor();
        static create(rules: Rule[]): RulesMap;
        Initialize(rules: Rule[]): RulesBucket[];
        FillRules(rules: Rule[], rulesBucketConstructionStateList: RulesBucketConstructionState[]): void;
        private GetRuleBucketIndex(row, column);
        private FillRule(rule, rulesBucketConstructionStateList);
        GetRule(context: FormattingContext): Rule;
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
        GetInsertionIndex(maskPosition: RulesPosition): number;
        IncreaseInsertionIndex(maskPosition: RulesPosition): void;
    }
    class RulesBucket {
        private rules;
        constructor();
        Rules(): Rule[];
        AddRule(rule: Rule, specificTokens: boolean, constructionState: RulesBucketConstructionState[], rulesBucketIndex: number): void;
    }
}
declare module TypeScript.Services.Formatting {
    class RulesProvider {
        private logger;
        private globalRules;
        private options;
        private activeRules;
        private rulesMap;
        constructor(logger: ILogger);
        getRuleName(rule: Rule): string;
        getRuleByName(name: string): Rule;
        getRulesMap(): RulesMap;
        ensureUpToDate(options: FormatCodeOptions): void;
        private createActiveRules(options);
    }
}
declare module TypeScript.Services.Formatting {
    class TextEditInfo {
        position: number;
        length: number;
        replaceWith: string;
        constructor(position: number, length: number, replaceWith: string);
        toString(): string;
    }
}
declare module TypeScript.Services.Formatting {
    module Shared {
        interface ITokenAccess {
            GetTokens(): SyntaxKind[];
            Contains(token: SyntaxKind): boolean;
        }
        class TokenRangeAccess implements ITokenAccess {
            private tokens;
            constructor(from: SyntaxKind, to: SyntaxKind, except: SyntaxKind[]);
            GetTokens(): SyntaxKind[];
            Contains(token: SyntaxKind): boolean;
            toString(): string;
        }
        class TokenValuesAccess implements ITokenAccess {
            private tokens;
            constructor(tks: SyntaxKind[]);
            GetTokens(): SyntaxKind[];
            Contains(token: SyntaxKind): boolean;
        }
        class TokenSingleValueAccess implements ITokenAccess {
            token: SyntaxKind;
            constructor(token: SyntaxKind);
            GetTokens(): SyntaxKind[];
            Contains(tokenValue: SyntaxKind): boolean;
            toString(): string;
        }
        class TokenAllAccess implements ITokenAccess {
            GetTokens(): SyntaxKind[];
            Contains(tokenValue: SyntaxKind): boolean;
            toString(): string;
        }
        class TokenRange {
            tokenAccess: ITokenAccess;
            constructor(tokenAccess: ITokenAccess);
            static FromToken(token: SyntaxKind): TokenRange;
            static FromTokens(tokens: SyntaxKind[]): TokenRange;
            static FromRange(f: SyntaxKind, to: SyntaxKind, except?: SyntaxKind[]): TokenRange;
            static AllTokens(): TokenRange;
            GetTokens(): SyntaxKind[];
            Contains(token: SyntaxKind): boolean;
            toString(): string;
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
    class TokenSpan extends TextSpan {
        private _kind;
        constructor(kind: SyntaxKind, start: number, length: number);
        kind(): SyntaxKind;
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
        constructor(parent: IndentationNodeContext, node: SyntaxNode, fullStart: number, indentationAmount: number, childIndentationAmountDelta: number);
        parent(): IndentationNodeContext;
        node(): SyntaxNode;
        fullStart(): number;
        fullWidth(): number;
        start(): number;
        end(): number;
        indentationAmount(): number;
        childIndentationAmountDelta(): number;
        depth(): number;
        kind(): SyntaxKind;
        hasSkippedOrMissingTokenChild(): boolean;
        clone(pool: IndentationNodeContextPool): IndentationNodeContext;
        update(parent: IndentationNodeContext, node: SyntaxNode, fullStart: number, indentationAmount: number, childIndentationAmountDelta: number): void;
    }
}
declare module TypeScript.Services.Formatting {
    class IndentationNodeContextPool {
        private nodes;
        getNode(parent: IndentationNodeContext, node: SyntaxNode, fullStart: number, indentationLevel: number, childIndentationLevelDelta: number): IndentationNodeContext;
        releaseNode(node: IndentationNodeContext, recursive?: boolean): void;
    }
}
declare module TypeScript.Services.Formatting {
    class IndentationTrackingWalker extends SyntaxWalker {
        options: FormattingOptions;
        private _position;
        private _parent;
        private _textSpan;
        private _snapshot;
        private _lastTriviaWasNewLine;
        private _indentationNodeContextPool;
        constructor(textSpan: TextSpan, sourceUnit: SourceUnitSyntax, snapshot: ITextSnapshot, indentFirstToken: boolean, options: FormattingOptions);
        position(): number;
        parent(): IndentationNodeContext;
        textSpan(): TextSpan;
        snapshot(): ITextSnapshot;
        indentationNodeContextPool(): IndentationNodeContextPool;
        forceIndentNextToken(tokenStart: number): void;
        forceSkipIndentingNextToken(tokenStart: number): void;
        indentToken(token: ISyntaxToken, indentationAmount: number, commentIndentationAmount: number): void;
        visitTokenInSpan(token: ISyntaxToken): void;
        visitToken(token: ISyntaxToken): void;
        visitNode(node: SyntaxNode): void;
        private getTokenIndentationAmount(token);
        private getCommentIndentationAmount(token);
        private getNodeIndentation(node, newLineInsertedByFormatting?);
        private forceRecomputeIndentationOfParent(tokenStart, newLineAdded);
    }
}
declare module TypeScript.Services.Formatting {
    class MultipleTokenIndenter extends IndentationTrackingWalker {
        private _edits;
        constructor(textSpan: TextSpan, sourceUnit: SourceUnitSyntax, snapshot: ITextSnapshot, indentFirstToken: boolean, options: FormattingOptions);
        indentToken(token: ISyntaxToken, indentationAmount: number, commentIndentationAmount: number): void;
        edits(): TextEditInfo[];
        recordEdit(position: number, length: number, replaceWith: string): void;
        private recordIndentationEditsForToken(token, indentationString, commentIndentationString);
        private recordIndentationEditsForSingleLineOrSkippedText(trivia, fullStart, indentationString);
        private recordIndentationEditsForWhitespace(trivia, fullStart, indentationString);
        private recordIndentationEditsForMultiLineComment(trivia, fullStart, indentationString, leadingWhiteSpace, firstLineAlreadyIndented);
        private recordIndentationEditsForSegment(segment, fullStart, indentationColumns, whiteSpaceColumnsInFirstSegment);
    }
}
declare module TypeScript.Services.Formatting {
    class SingleTokenIndenter extends IndentationTrackingWalker {
        private indentationAmount;
        private indentationPosition;
        constructor(indentationPosition: number, sourceUnit: SourceUnitSyntax, snapshot: ITextSnapshot, indentFirstToken: boolean, options: FormattingOptions);
        static getIndentationAmount(position: number, sourceUnit: SourceUnitSyntax, snapshot: ITextSnapshot, options: FormattingOptions): number;
        indentToken(token: ISyntaxToken, indentationAmount: number, commentIndentationAmount: number): void;
    }
}
declare module TypeScript.Services.Formatting {
    class Formatter extends MultipleTokenIndenter {
        private previousTokenSpan;
        private previousTokenParent;
        private scriptHasErrors;
        private rulesProvider;
        private formattingRequestKind;
        private formattingContext;
        constructor(textSpan: TextSpan, sourceUnit: SourceUnitSyntax, indentFirstToken: boolean, options: FormattingOptions, snapshot: ITextSnapshot, rulesProvider: RulesProvider, formattingRequestKind: FormattingRequestKind);
        static getEdits(textSpan: TextSpan, sourceUnit: SourceUnitSyntax, options: FormattingOptions, indentFirstToken: boolean, snapshot: ITextSnapshot, rulesProvider: RulesProvider, formattingRequestKind: FormattingRequestKind): TextEditInfo[];
        visitTokenInSpan(token: ISyntaxToken): void;
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
        logger: ILogger;
    }
    class CoreServices {
        host: ICoreServicesHost;
        constructor(host: ICoreServicesHost);
        getPreProcessedFileInfo(fileName: string, sourceText: IScriptSnapshot): IPreProcessedFileInfo;
        getDefaultCompilationSettings(): CompilationSettings;
        dumpMemory(): string;
        getMemoryInfo(): any[];
        collectGarbage(): void;
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
        constructor(_host: ILanguageServiceHost);
        getCurrentFileSyntaxTree(fileName: string): SyntaxTree;
        private createSyntaxTree(fileName, scriptSnapshot);
        private updateSyntaxTree(fileName, scriptSnapshot, previousSyntaxTree, previousFileVersion);
        private ensureInvariants(fileName, editRange, incrementalTree, oldScriptSnapshot, newScriptSnapshot);
    }
    class LanguageServiceCompiler {
        private host;
        private logger;
        private compiler;
        private hostCache;
        constructor(host: ILanguageServiceHost);
        private synchronizeHostData();
        private synchronizeHostDataWorker();
        private tryUpdateFile(compiler, fileName);
        getScriptSnapshot(fileName: string): IScriptSnapshot;
        getCachedHostFileName(fileName: string): string;
        getCachedTopLevelDeclaration(fileName: string): PullDecl;
        compilationSettings(): ImmutableCompilationSettings;
        fileNames(): string[];
        cleanupSemanticCache(): void;
        getDocument(fileName: string): Document;
        getSyntacticDiagnostics(fileName: string): Diagnostic[];
        getSemanticDiagnostics(fileName: string): Diagnostic[];
        getSymbolInformationFromAST(ast: AST, document: Document): PullSymbolInfo;
        getCallInformationFromAST(ast: AST, document: Document): PullCallSymbolInfo;
        getVisibleMemberSymbolsFromAST(ast: AST, document: Document): PullVisibleSymbolsInfo;
        getVisibleDeclsFromAST(ast: AST, document: Document): PullDecl[];
        getContextualMembersFromAST(ast: AST, document: Document): PullVisibleSymbolsInfo;
        pullGetDeclInformation(decl: PullDecl, ast: AST, document: Document): PullSymbolInfo;
        topLevelDeclaration(fileName: string): PullDecl;
        getDeclForAST(ast: AST): PullDecl;
        emit(fileName: string, resolvePath: (path: string) => string): EmitOutput;
        emitDeclarations(fileName: string, resolvePath: (path: string) => string): EmitOutput;
    }
}
declare module TypeScript.Services {
    class CompletionHelpers {
        static filterContextualMembersList(contextualMemberSymbols: PullSymbol[], existingMembers: PullVisibleSymbolsInfo): PullSymbol[];
        static isCompletionListBlocker(sourceUnit: SourceUnitSyntax, position: number): boolean;
        static getContainingObjectLiteralApplicableForCompletion(sourceUnit: SourceUnitSyntax, position: number): PositionedElement;
        static isIdentifierDefinitionLocation(sourceUnit: SourceUnitSyntax, position: number): boolean;
        static getNonIdentifierCompleteTokenOnLeft(sourceUnit: SourceUnitSyntax, position: number): PositionedToken;
        static isRightOfIllegalDot(sourceUnit: SourceUnitSyntax, position: number): boolean;
        static getValidCompletionEntryDisplayName(displayName: string): string;
    }
}
declare module TypeScript.Services {
    class KeywordCompletions {
        private static keywords;
        private static keywordCompletions;
        static getKeywordCompltions(): ResolvedCompletionEntry[];
    }
}
declare module TypeScript.Services {
    interface IPartiallyWrittenTypeArgumentListInformation {
        genericIdentifer: PositionedToken;
        lessThanToken: PositionedToken;
        argumentIndex: number;
    }
    class SignatureInfoHelpers {
        static isInPartiallyWrittenTypeArgumentList(syntaxTree: SyntaxTree, position: number): IPartiallyWrittenTypeArgumentListInformation;
        static getSignatureInfoFromSignatureSymbol(symbol: PullSymbol, signatures: PullSignatureSymbol[], enclosingScopeSymbol: PullSymbol, compilerState: LanguageServiceCompiler): FormalSignatureItemInfo[];
        static getSignatureInfoFromGenericSymbol(symbol: PullSymbol, enclosingScopeSymbol: PullSymbol, compilerState: LanguageServiceCompiler): FormalSignatureItemInfo[];
        static getActualSignatureInfoFromCallExpression(ast: ICallExpression, caretPosition: number, typeParameterInformation: IPartiallyWrittenTypeArgumentListInformation): ActualSignatureInfo;
        static getActualSignatureInfoFromPartiallyWritenGenericExpression(caretPosition: number, typeParameterInformation: IPartiallyWrittenTypeArgumentListInformation): ActualSignatureInfo;
        static isSignatureHelpBlocker(sourceUnit: SourceUnitSyntax, position: number): boolean;
        static isTargetOfObjectCreationExpression(positionedToken: PositionedToken): boolean;
        private static moveBackUpTillMatchingTokenKind(token, tokenKind, matchingTokenKind);
    }
}
declare module TypeScript.Services {
    interface CachedCompletionEntryDetails extends CompletionEntryDetails {
        isResolved(): boolean;
    }
    class ResolvedCompletionEntry implements CachedCompletionEntryDetails {
        name: string;
        kind: string;
        kindModifiers: string;
        type: string;
        fullSymbolName: string;
        docComment: string;
        constructor(name: string, kind: string, kindModifiers: string, type: string, fullSymbolName: string, docComment: string);
        isResolved(): boolean;
    }
    class DeclReferenceCompletionEntry implements CachedCompletionEntryDetails {
        name: string;
        kind: string;
        kindModifiers: string;
        decl: PullDecl;
        type: string;
        fullSymbolName: string;
        docComment: string;
        private hasBeenResolved;
        constructor(name: string, kind: string, kindModifiers: string, decl: PullDecl);
        isResolved(): boolean;
        resolve(type: string, fullSymbolName: string, docComments: string): void;
    }
    class CompletionSession {
        fileName: string;
        position: number;
        entries: IdentiferNameHashTable<CachedCompletionEntryDetails>;
        constructor(fileName: string, position: number, entries: IdentiferNameHashTable<CachedCompletionEntryDetails>);
    }
}
declare module TypeScript.Services {
    class LanguageService implements ILanguageService {
        host: ILanguageServiceHost;
        private logger;
        private compiler;
        private _syntaxTreeCache;
        private formattingRulesProvider;
        private activeCompletionSession;
        constructor(host: ILanguageServiceHost);
        cleanupSemanticCache(): void;
        refresh(): void;
        private getSymbolInfoAtPosition(fileName, pos, requireName);
        getReferencesAtPosition(fileName: string, pos: number): ReferenceEntry[];
        private getSymbolScopeAST(symbol, ast);
        getOccurrencesAtPosition(fileName: string, pos: number): ReferenceEntry[];
        private getSingleNodeReferenceAtPosition(fileName, position);
        getImplementorsAtPosition(fileName: string, pos: number): ReferenceEntry[];
        getOverrides(container: PullTypeSymbol, memberSym: PullSymbol): PullTypeSymbol[];
        private getImplementorsInFile(fileName, symbol);
        private getReferencesInFile(fileName, symbol, containingASTOpt);
        private isWriteAccess(current);
        private isLetterOrDigit(char);
        private getPossibleSymbolReferencePositions(fileName, symbolName);
        getSignatureAtPosition(fileName: string, position: number): SignatureInfo;
        private getTypeParameterSignatureFromPartiallyWrittenExpression(document, position, genericTypeArgumentListInfo);
        getDefinitionAtPosition(fileName: string, position: number): DefinitionInfo[];
        private addDeclarations(symbolKind, symbolName, containerKind, containerName, declarations, result);
        private addDeclaration(symbolKind, symbolName, containerKind, containerName, declaration, result);
        private tryAddDefinition(symbolKind, symbolName, containerKind, containerName, declarations, result);
        private tryAddSignatures(symbolKind, symbolName, containerKind, containerName, declarations, result);
        private tryAddConstructor(symbolKind, symbolName, containerKind, containerName, declarations, result);
        getNavigateToItems(searchValue: string): NavigateToItem[];
        private findSearchValueInPullDecl(fileName, declarations, results, searchTerms, searchRegExpTerms, parentName?, parentkindName?);
        private getScriptElementKindModifiersFromDecl(decl);
        private isContainerDeclaration(declaration);
        private shouldIncludeDeclarationInNavigationItems(declaration);
        getSyntacticDiagnostics(fileName: string): Diagnostic[];
        getSemanticDiagnostics(fileName: string): Diagnostic[];
        getEmitOutput(fileName: string): EmitOutput;
        private getAllSyntacticDiagnostics();
        private getAllSemanticDiagnostics();
        private containErrors(diagnostics);
        private getFullNameOfSymbol(symbol, enclosingScopeSymbol);
        private getTypeInfoEligiblePath(fileName, position, isConstructorValidPosition);
        getTypeAtPosition(fileName: string, position: number): TypeInfo;
        getCompletionsAtPosition(fileName: string, position: number, isMemberCompletion: boolean): CompletionInfo;
        private getCompletionEntriesFromSymbols(symbolInfo, result);
        private getCompletionEntriesFromDecls(decls, result);
        private getResolvedCompletionEntryDetailsFromSymbol(symbol, enclosingScopeSymbol);
        private getCompletionEntriesForKeywords(keywords, result);
        getCompletionEntryDetails(fileName: string, position: number, entryName: string): CompletionEntryDetails;
        private tryFindDeclFromPreviousCompilerVersion(invalidatedDecl);
        private getModuleOrEnumKind(symbol);
        private mapPullElementKind(kind, symbol?, useConstructorAsClass?, varIsFunction?, functionIsConstructor?);
        private getScriptElementKindModifiers(symbol);
        private getScriptElementKindModifiersFromFlags(flags);
        getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): SpanInfo;
        getBreakpointStatementAtPosition(fileName: string, pos: number): SpanInfo;
        getFormattingEditsForRange(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[];
        getFormattingEditsForDocument(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[];
        getFormattingEditsOnPaste(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[];
        getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: FormatCodeOptions): TextEdit[];
        private getFormattingManager(fileName, options);
        getOutliningRegions(fileName: string): TextSpan[];
        getIndentationAtPosition(fileName: string, position: number, editorOptions: EditorOptions): number;
        getBraceMatchingAtPosition(fileName: string, position: number): TextSpan[];
        getScriptLexicalStructure(fileName: string): NavigateToItem[];
        getSyntaxTree(fileName: string): SyntaxTree;
    }
}
declare module TypeScript.Services {
    class FindReferenceHelpers {
        static compareSymbolsForLexicalIdentity(firstSymbol: PullSymbol, secondSymbol: PullSymbol): boolean;
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
    interface ILanguageServiceShimHost extends ILogger {
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
        getDiagnosticsObject(): ILanguageServicesDiagnostics;
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
        dispose(dummy: any): void;
    }
    interface ILanguageServiceShim extends IShim {
        languageService: ILanguageService;
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
    class LanguageServiceShimHostAdapter implements ILanguageServiceHost {
        private shimHost;
        constructor(shimHost: ILanguageServiceShimHost);
        information(): boolean;
        debug(): boolean;
        warning(): boolean;
        error(): boolean;
        fatal(): boolean;
        log(s: string): void;
        getCompilationSettings(): CompilationSettings;
        getScriptFileNames(): string[];
        getScriptSnapshot(fileName: string): IScriptSnapshot;
        getScriptVersion(fileName: string): number;
        getScriptIsOpen(fileName: string): boolean;
        getScriptByteOrderMark(fileName: string): ByteOrderMark;
        getDiagnosticsObject(): ILanguageServicesDiagnostics;
        getLocalizedDiagnosticMessages(): any;
        resolveRelativePath(path: string, directory: string): string;
        fileExists(path: string): boolean;
        directoryExists(path: string): boolean;
        getParentDirectory(path: string): string;
    }
    function simpleForwardCall(logger: ILogger, actionDescription: string, action: () => any): any;
    function forwardJSONCall(logger: ILogger, actionDescription: string, action: () => any): string;
    class LanguageServiceShim extends ShimBase implements ILanguageServiceShim {
        private host;
        languageService: ILanguageService;
        private logger;
        constructor(factory: IShimFactory, host: ILanguageServiceShimHost, languageService: ILanguageService);
        forwardJSONCall(actionDescription: string, action: () => any): string;
        dispose(dummy: any): void;
        refresh(throwOnError: boolean): void;
        cleanupSemanticCache(): void;
        private static realizeDiagnosticCategory(category);
        private static realizeDiagnostic(diagnostic);
        getSyntacticDiagnostics(fileName: string): string;
        getSemanticDiagnostics(fileName: string): string;
        getTypeAtPosition(fileName: string, position: number): string;
        getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): string;
        getBreakpointStatementAtPosition(fileName: string, position: number): string;
        getSignatureAtPosition(fileName: string, position: number): string;
        getDefinitionAtPosition(fileName: string, position: number): string;
        getBraceMatchingAtPosition(fileName: string, position: number): string;
        getIndentationAtPosition(fileName: string, position: number, options: string): string;
        getReferencesAtPosition(fileName: string, position: number): string;
        getOccurrencesAtPosition(fileName: string, position: number): string;
        getImplementorsAtPosition(fileName: string, position: number): string;
        getCompletionsAtPosition(fileName: string, position: number, isMemberCompletion: boolean): string;
        getCompletionEntryDetails(fileName: string, position: number, entryName: string): string;
        getFormattingEditsForRange(fileName: string, minChar: number, limChar: number, options: string): string;
        getFormattingEditsForDocument(fileName: string, minChar: number, limChar: number, options: string): string;
        getFormattingEditsOnPaste(fileName: string, minChar: number, limChar: number, options: string): string;
        getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: string): string;
        getNavigateToItems(searchValue: string): string;
        getScriptLexicalStructure(fileName: string): string;
        getOutliningRegions(fileName: string): string;
        getEmitOutput(fileName: string): string;
        private _navigateToItemsToString(items);
    }
    class ClassifierShim extends ShimBase {
        host: IClassifierHost;
        classifier: Classifier;
        constructor(factory: IShimFactory, host: IClassifierHost);
        getClassificationsForLine(text: string, lexState: EndOfLineState): string;
    }
    class CoreServicesShim extends ShimBase {
        host: ICoreServicesHost;
        logger: ILogger;
        services: CoreServices;
        constructor(factory: IShimFactory, host: ICoreServicesHost);
        private forwardJSONCall(actionDescription, action);
        getPreProcessedFileInfo(fileName: string, sourceText: IScriptSnapshot): string;
        getDefaultCompilationSettings(): string;
        dumpMemory(dummy: any): string;
        getMemoryInfo(dummy: any): string;
    }
}
declare module TypeScript.Services {
    class OutliningElementsCollector extends DepthLimitedWalker {
        private static MaximumDepth;
        private inObjectLiteralExpression;
        private elements;
        constructor();
        visitClassDeclaration(node: ClassDeclarationSyntax): void;
        visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): void;
        visitModuleDeclaration(node: ModuleDeclarationSyntax): void;
        visitEnumDeclaration(node: EnumDeclarationSyntax): void;
        visitFunctionDeclaration(node: FunctionDeclarationSyntax): void;
        visitFunctionExpression(node: FunctionExpressionSyntax): void;
        visitConstructorDeclaration(node: ConstructorDeclarationSyntax): void;
        visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): void;
        visitGetAccessor(node: GetAccessorSyntax): void;
        visitSetAccessor(node: SetAccessorSyntax): void;
        visitObjectLiteralExpression(node: ObjectLiteralExpressionSyntax): void;
        private addOutlineRange(node, startElement, endElement);
        static collectElements(node: SourceUnitSyntax): TextSpan[];
    }
}
declare module TypeScript.Services {
    class BraceMatcher {
        static getMatchSpans(syntaxTree: SyntaxTree, position: number): TextSpan[];
        private static getMatchingCloseBrace(currentToken, position, result);
        private static getMatchingOpenBrace(currentToken, position, result);
        private static getMatchingCloseBraceTokenKind(positionedElement);
        private static getMatchingOpenBraceTokenKind(positionedElement);
    }
}
declare module TypeScript.Services {
    class Indenter {
        static getIndentation(node: SourceUnitSyntax, soruceText: IScriptSnapshot, position: number, editorOptions: EditorOptions): number;
        private static belongsToBracket(sourceText, token, position);
        private static isInContainerNode(parent, element);
        private static getCustomListIndentation(list, element);
        private static getListItemIndentation(list, elementIndex);
    }
}
declare module TypeScript.Services.Breakpoints {
    function getBreakpointLocation(syntaxTree: SyntaxTree, askedPos: number): SpanInfo;
}
declare module TypeScript.Services {
    class GetScriptLexicalStructureWalker extends PositionTrackingWalker {
        private items;
        private fileName;
        private nameStack;
        private kindStack;
        private currentMemberVariableDeclaration;
        private currentVariableStatement;
        private currentInterfaceDeclaration;
        constructor(items: NavigateToItem[], fileName: string);
        static getListsOfAllScriptLexicalStructure(items: NavigateToItem[], fileName: string, unit: SourceUnitSyntax): void;
        private createItem(node, modifiers, kind, name);
        private getKindModifiers(modifiers);
        visitModuleDeclaration(node: ModuleDeclarationSyntax): void;
        private visitModuleDeclarationWorker(node, names, nameIndex);
        private getModuleNames(node);
        private getModuleNamesHelper(name, result);
        visitClassDeclaration(node: ClassDeclarationSyntax): void;
        visitInterfaceDeclaration(node: InterfaceDeclarationSyntax): void;
        visitObjectType(node: ObjectTypeSyntax): void;
        visitEnumDeclaration(node: EnumDeclarationSyntax): void;
        visitConstructorDeclaration(node: ConstructorDeclarationSyntax): void;
        visitMemberFunctionDeclaration(node: MemberFunctionDeclarationSyntax): void;
        visitGetAccessor(node: GetAccessorSyntax): void;
        visitSetAccessor(node: SetAccessorSyntax): void;
        visitMemberVariableDeclaration(node: MemberVariableDeclarationSyntax): void;
        visitVariableStatement(node: VariableStatementSyntax): void;
        visitVariableDeclarator(node: VariableDeclaratorSyntax): void;
        visitIndexSignature(node: IndexSignatureSyntax): void;
        visitEnumElement(node: EnumElementSyntax): void;
        visitCallSignature(node: CallSignatureSyntax): void;
        visitConstructSignature(node: ConstructSignatureSyntax): void;
        visitMethodSignature(node: MethodSignatureSyntax): void;
        visitPropertySignature(node: PropertySignatureSyntax): void;
        visitFunctionDeclaration(node: FunctionDeclarationSyntax): void;
        visitBlock(node: BlockSyntax): void;
        visitIfStatement(node: IfStatementSyntax): void;
        visitExpressionStatement(node: ExpressionStatementSyntax): void;
        visitThrowStatement(node: ThrowStatementSyntax): void;
        visitReturnStatement(node: ReturnStatementSyntax): void;
        visitSwitchStatement(node: SwitchStatementSyntax): void;
        visitWithStatement(node: WithStatementSyntax): void;
        visitTryStatement(node: TryStatementSyntax): void;
        visitLabeledStatement(node: LabeledStatementSyntax): void;
    }
}
declare module TypeScript.Services {
    function copyDataObject(dst: any, src: any): any;
    class TypeScriptServicesFactory implements IShimFactory {
        private _shims;
        createPullLanguageService(host: ILanguageServiceHost): ILanguageService;
        createLanguageServiceShim(host: ILanguageServiceShimHost): ILanguageServiceShim;
        createClassifier(host: IClassifierHost): Classifier;
        createClassifierShim(host: IClassifierHost): ClassifierShim;
        createCoreServices(host: ICoreServicesHost): CoreServices;
        createCoreServicesShim(host: ICoreServicesHost): CoreServicesShim;
        close(): void;
        registerShim(shim: IShim): void;
        unregisterShim(shim: IShim): void;
    }
}
declare module TypeScript.Services {
    interface ILanguageServicesDiagnostics {
        log(content: string): void;
    }
}
declare module TypeScript.Services {
    interface ILanguageServiceHost extends ILogger, IReferenceResolverHost {
        getCompilationSettings(): CompilationSettings;
        getScriptFileNames(): string[];
        getScriptVersion(fileName: string): number;
        getScriptIsOpen(fileName: string): boolean;
        getScriptByteOrderMark(fileName: string): ByteOrderMark;
        getScriptSnapshot(fileName: string): IScriptSnapshot;
        getDiagnosticsObject(): ILanguageServicesDiagnostics;
        getLocalizedDiagnosticMessages(): any;
    }
    interface ILanguageService {
        refresh(): void;
        cleanupSemanticCache(): void;
        getSyntacticDiagnostics(fileName: string): Diagnostic[];
        getSemanticDiagnostics(fileName: string): Diagnostic[];
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
        getOutliningRegions(fileName: string): TextSpan[];
        getBraceMatchingAtPosition(fileName: string, position: number): TextSpan[];
        getIndentationAtPosition(fileName: string, position: number, options: EditorOptions): number;
        getFormattingEditsForRange(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[];
        getFormattingEditsForDocument(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[];
        getFormattingEditsOnPaste(fileName: string, minChar: number, limChar: number, options: FormatCodeOptions): TextEdit[];
        getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: FormatCodeOptions): TextEdit[];
        getEmitOutput(fileName: string): EmitOutput;
        getSyntaxTree(fileName: string): SyntaxTree;
    }
    function logInternalError(logger: ILogger, err: Error): void;
    class ReferenceEntry {
        fileName: string;
        minChar: number;
        limChar: number;
        isWriteAccess: boolean;
        constructor(fileName: string, minChar: number, limChar: number, isWriteAccess: boolean);
    }
    class NavigateToItem {
        name: string;
        kind: string;
        kindModifiers: string;
        matchKind: string;
        fileName: string;
        minChar: number;
        limChar: number;
        containerName: string;
        containerKind: string;
    }
    class TextEdit {
        minChar: number;
        limChar: number;
        text: string;
        constructor(minChar: number, limChar: number, text: string);
        static createInsert(pos: number, text: string): TextEdit;
        static createDelete(minChar: number, limChar: number): TextEdit;
        static createReplace(minChar: number, limChar: number, text: string): TextEdit;
    }
    class EditorOptions {
        IndentSize: number;
        TabSize: number;
        NewLineCharacter: string;
        ConvertTabsToSpaces: boolean;
        static clone(objectToClone: EditorOptions): EditorOptions;
    }
    class FormatCodeOptions extends EditorOptions {
        InsertSpaceAfterCommaDelimiter: boolean;
        InsertSpaceAfterSemicolonInForStatements: boolean;
        InsertSpaceBeforeAndAfterBinaryOperators: boolean;
        InsertSpaceAfterKeywordsInControlFlowStatements: boolean;
        InsertSpaceAfterFunctionKeywordForAnonymousFunctions: boolean;
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: boolean;
        PlaceOpenBraceOnNewLineForFunctions: boolean;
        PlaceOpenBraceOnNewLineForControlBlocks: boolean;
        static clone(objectToClone: FormatCodeOptions): FormatCodeOptions;
    }
    class DefinitionInfo {
        fileName: string;
        minChar: number;
        limChar: number;
        kind: string;
        name: string;
        containerKind: string;
        containerName: string;
        constructor(fileName: string, minChar: number, limChar: number, kind: string, name: string, containerKind: string, containerName: string);
    }
    class TypeInfo {
        memberName: MemberName;
        docComment: string;
        fullSymbolName: string;
        kind: string;
        minChar: number;
        limChar: number;
        constructor(memberName: MemberName, docComment: string, fullSymbolName: string, kind: string, minChar: number, limChar: number);
    }
    class SpanInfo {
        minChar: number;
        limChar: number;
        text: string;
        constructor(minChar: number, limChar: number, text?: string);
    }
    class SignatureInfo {
        actual: ActualSignatureInfo;
        formal: FormalSignatureItemInfo[];
        activeFormal: number;
    }
    class FormalSignatureItemInfo {
        signatureInfo: string;
        typeParameters: FormalTypeParameterInfo[];
        parameters: FormalParameterInfo[];
        docComment: string;
    }
    class FormalTypeParameterInfo {
        name: string;
        docComment: string;
        minChar: number;
        limChar: number;
    }
    class FormalParameterInfo {
        name: string;
        isVariable: boolean;
        docComment: string;
        minChar: number;
        limChar: number;
    }
    class ActualSignatureInfo {
        parameterMinChar: number;
        parameterLimChar: number;
        currentParameterIsTypeParameter: boolean;
        currentParameter: number;
    }
    class CompletionInfo {
        maybeInaccurate: boolean;
        isMemberCompletion: boolean;
        entries: CompletionEntry[];
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
        getCompilationSettings(): TypeScript.CompilationSettings;
        getScriptFileNames(): string[];
        getScriptVersion(fileName: string): number;
        getScriptIsOpen(fileName: string): boolean;
        getScriptByteOrderMark(fileName: string): TypeScript.ByteOrderMark;
        getScriptSnapshot(fileName: string): TypeScript.IScriptSnapshot;
        getDiagnosticsObject(): LanguageServicesDiagnostics;
        getLocalizedDiagnosticMessages(): string;
        resolveRelativePath(path: string, directory: string): string;
        fileExists(path: string): boolean;
        directoryExists(path: string): boolean;
        getParentDirectory(path: string): string;
    }
    class LanguageServicesDiagnostics implements TypeScript.Services.ILanguageServicesDiagnostics {
        log(content: string): void;
    }
}
declare module Lint {
    function getSyntaxTree(fileName: string, source: string): TypeScript.SyntaxTree;
    function createCompilationSettings(): TypeScript.CompilationSettings;
    function doesIntersect(failure: RuleFailure, disabledIntervals: IDisabledInterval[]): boolean;
}
declare module Lint.Formatters {
    class AbstractFormatter implements IFormatter {
        format(failures: RuleFailure[]): string;
    }
}
declare module Lint.Rules {
    class AbstractRule implements IRule {
        private value;
        private options;
        constructor(ruleName: string, value: any, disabledIntervals: IDisabledInterval[]);
        getOptions(): IOptions;
        apply(syntaxTree: TypeScript.SyntaxTree): RuleFailure[];
        applyWithWalker(walker: RuleWalker): RuleFailure[];
        isEnabled(): boolean;
    }
}
declare module Lint {
    class ScopeAwareRuleWalker<T> extends RuleWalker {
        private scopeStack;
        constructor(syntaxTree: TypeScript.SyntaxTree, options?: any);
        visitNode(node: TypeScript.SyntaxNode): void;
        createScope(): T;
        getCurrentScope(): T;
        getCurrentDepth(): number;
        onScopeStart(): void;
        onScopeEnd(): void;
        private isScopeBoundary(node);
    }
}
declare module Lint {
    interface RuleWalkerState {
        position: number;
        token: TypeScript.ISyntaxToken;
    }
    class StateAwareRuleWalker extends RuleWalker {
        private lastState;
        visitToken(token: TypeScript.ISyntaxToken): void;
        getLastState(): RuleWalkerState;
    }
}
declare module Lint {
    interface LintResult {
        failureCount: number;
        format: string;
        output: string;
    }
    interface ILinterOptions {
        configuration: any;
        formatter: string;
        formattersDirectory: string;
        rulesDirectory: string;
    }
    class Linter {
        private fileName;
        private source;
        private options;
        static VERSION: string;
        constructor(fileName: string, source: string, options: ILinterOptions);
        lint(): LintResult;
        private getRelativePath(directory);
        private containsRule(rules, rule);
    }
}
