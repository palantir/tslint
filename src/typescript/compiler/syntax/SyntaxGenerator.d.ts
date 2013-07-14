declare module TypeScript {
    class ArrayUtilities {
        static isArray(value: any): boolean;
        static sequenceEquals(array1: any[], array2: any[], equals: (v1: any, v2: any) => boolean): boolean;
        static contains(array: any[], value: any): boolean;
        static groupBy(array: any[], func: (v: any) => string): any;
        static min(array: any[], func: (v: any) => number): number;
        static max(array: any[], func: (v: any) => number): number;
        static last(array: any[]);
        static firstOrDefault(array: any[], func: (v: any) => boolean): any;
        static sum(array: any[], func: (v: any) => number): number;
        static whereNotNull(array: any[]): any[];
        static select(values: any[], func: (v: any) => any): any[];
        static where(values: any[], func: (v: any) => boolean): any[];
        static any(array: any[], func: (v: any) => boolean): boolean;
        static all(array: any[], func: (v: any) => boolean): boolean;
        static binarySearch(array: number[], value: number): number;
        static createArray(length: number, defaultvalue: any): any[];
        static grow(array: any[], length: number, defaultValue: any): void;
        static copy(sourceArray: any[], sourceIndex: number, destinationArray: any[], destinationIndex: number, length: number): void;
    }
}
declare module TypeScript {
    enum Constants {
        Max31BitInteger,
        Min31BitInteger,
    }
}
declare module TypeScript {
    class Contract {
        static requires(expression: boolean): void;
        static throwIfFalse(expression: boolean): void;
        static throwIfNull(value: any): void;
    }
}
declare module TypeScript {
    class Debug {
        static assert(expression: boolean, message?: string): void;
    }
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
    enum DiagnosticCode {
        error_TS_0__1,
        warning_TS_0__1,
        _0__NL__1_TB__2,
        _0_TB__1,
        Unrecognized_escape_sequence,
        Unexpected_character_0,
        Missing_closing_quote_character,
        Identifier_expected,
        _0_keyword_expected,
        _0_expected,
        Identifier_expected__0__is_a_keyword,
        Automatic_semicolon_insertion_not_allowed,
        Unexpected_token__0_expected,
        Trailing_separator_not_allowed,
        _StarSlash__expected,
        _public_or_private_modifier_must_precede__static_,
        Unexpected_token_,
        A_catch_clause_variable_cannot_have_a_type_annotation,
        Rest_parameter_must_be_last_in_list,
        Parameter_cannot_have_question_mark_and_initializer,
        Required_parameter_cannot_follow_optional_parameter,
        Index_signatures_cannot_have_rest_parameters,
        Index_signature_parameter_cannot_have_accessibility_modifiers,
        Index_signature_parameter_cannot_have_a_question_mark,
        Index_signature_parameter_cannot_have_an_initializer,
        Index_signature_must_have_a_type_annotation,
        Index_signature_parameter_must_have_a_type_annotation,
        Index_signature_parameter_type_must_be__string__or__number_,
        _extends__clause_already_seen,
        _extends__clause_must_precede__implements__clause,
        Class_can_only_extend_single_type,
        _implements__clause_already_seen,
        Accessibility_modifier_already_seen,
        _0__modifier_must_precede__1__modifier,
        _0__modifier_already_seen,
        _0__modifier_cannot_appear_on_a_class_element,
        Interface_declaration_cannot_have__implements__clause,
        _super__invocation_cannot_have_type_arguments,
        Non_ambient_modules_cannot_use_quoted_names,
        Statements_are_not_allowed_in_ambient_contexts,
        Implementations_are_not_allowed_in_ambient_contexts,
        _declare__modifier_not_allowed_for_code_already_in_an_ambient_context,
        Initializers_are_not_allowed_in_ambient_contexts,
        Overload_and_ambient_signatures_cannot_specify_parameter_properties,
        Function_implementation_expected,
        Constructor_implementation_expected,
        Function_overload_name_must_be__0_,
        _0__modifier_cannot_appear_on_a_module_element,
        _declare__modifier_cannot_appear_on_an_interface_declaration,
        _declare__modifier_required_for_top_level_element,
        _set__accessor_must_have_only_one_parameter,
        _set__accessor_parameter_cannot_have_accessibility_modifier,
        _set__accessor_parameter_cannot_be_optional,
        _set__accessor_parameter_cannot_have_initializer,
        _set__accessor_cannot_have_rest_parameter,
        _get__accessor_cannot_have_parameters,
        Rest_parameter_cannot_be_optional,
        Rest_parameter_cannot_have_initializer,
        Modifiers_cannot_appear_here,
        Accessors_are_only_available_when_targeting_EcmaScript5_and_higher,
        Class_name_cannot_be__0_,
        Interface_name_cannot_be__0_,
        Enum_name_cannot_be__0_,
        Module_name_cannot_be__0_,
        Enum_member_must_have_initializer,
        _module_______is_deprecated__Use__require_______instead,
        Duplicate_identifier__0_,
        The_name__0__does_not_exist_in_the_current_scope,
        The_name__0__does_not_refer_to_a_value,
        Keyword__super__can_only_be_used_inside_a_class_instance_method,
        The_left_hand_side_of_an_assignment_expression_must_be_a_variable__property_or_indexer,
        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new__,
        Value_of_type__0__is_not_callable,
        Value_of_type__0__is_not_newable,
        Value_of_type__0__is_not_indexable_by_type__1_,
        Operator__0__cannot_be_applied_to_types__1__and__2_,
        Operator__0__cannot_be_applied_to_types__1__and__2__3,
        Cannot_convert__0__to__1_,
        Cannot_convert__0__to__1__NL__2,
        Expected_var__class__interface__or_module,
        Operator__0__cannot_be_applied_to_type__1_,
        Getter__0__already_declared,
        Setter__0__already_declared,
        Accessor_cannot_have_type_parameters,
        Exported_class__0__extends_private_class__1_,
        Exported_class__0__implements_private_interface__1_,
        Exported_interface__0__extends_private_interface__1_,
        Exported_class__0__extends_class_from_inaccessible_module__1_,
        Exported_class__0__implements_interface_from_inaccessible_module__1_,
        Exported_interface__0__extends_interface_from_inaccessible_module__1_,
        Public_static_property__0__of__exported_class_has_or_is_using_private_type__1_,
        Public_property__0__of__exported_class_has_or_is_using_private_type__1_,
        Property__0__of__exported_interface_has_or_is_using_private_type__1_,
        Exported_variable__0__has_or_is_using_private_type__1_,
        Public_static_property__0__of__exported_class_is_using_inaccessible_module__1_,
        Public_property__0__of__exported_class_is_using_inaccessible_module__1_,
        Property__0__of__exported_interface_is_using_inaccessible_module__1_,
        Exported_variable__0__is_using_inaccessible_module__1_,
        Parameter__0__of_constructor_from_exported_class_has_or_is_using_private_type__1_,
        Parameter__0__of_public_static_property_setter_from_exported_class_has_or_is_using_private_type__1_,
        Parameter__0__of_public_property_setter_from_exported_class_has_or_is_using_private_type__1_,
        Parameter__0__of_constructor_signature_from_exported_interface_has_or_is_using_private_type__1_,
        Parameter__0__of_call_signature_from_exported_interface_has_or_is_using_private_type__1_,
        Parameter__0__of_public_static_method_from_exported_class_has_or_is_using_private_type__1_,
        Parameter__0__of_public_method_from_exported_class_has_or_is_using_private_type__1_,
        Parameter__0__of_method_from_exported_interface_has_or_is_using_private_type__1_,
        Parameter__0__of_exported_function_has_or_is_using_private_type__1_,
        Parameter__0__of_constructor_from_exported_class_is_using_inaccessible_module__1_,
        Parameter__0__of_public_static_property_setter_from_exported_class_is_using_inaccessible_module__1_,
        Parameter__0__of_public_property_setter_from_exported_class_is_using_inaccessible_module__1_,
        Parameter__0__of_constructor_signature_from_exported_interface_is_using_inaccessible_module__1_,
        Parameter__0__of_call_signature_from_exported_interface_is_using_inaccessible_module__1_,
        Parameter__0__of_public_static_method_from_exported_class_is_using_inaccessible_module__1_,
        Parameter__0__of_public_method_from_exported_class_is_using_inaccessible_module__1_,
        Parameter__0__of_method_from_exported_interface_is_using_inaccessible_module__1_,
        Parameter__0__of_exported_function_is_using_inaccessible_module__1_,
        Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_type__0_,
        Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_type__0_,
        Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_type__0_,
        Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_type__0_,
        Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_type__0_,
        Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_type__0_,
        Return_type_of_public_method_from_exported_class_has_or_is_using_private_type__0_,
        Return_type_of_method_from_exported_interface_has_or_is_using_private_type__0_,
        Return_type_of_exported_function_has_or_is_using_private_type__0_,
        Return_type_of_public_static_property_getter_from_exported_class_is_using_inaccessible_module__0_,
        Return_type_of_public_property_getter_from_exported_class_is_using_inaccessible_module__0_,
        Return_type_of_constructor_signature_from_exported_interface_is_using_inaccessible_module__0_,
        Return_type_of_call_signature_from_exported_interface_is_using_inaccessible_module__0_,
        Return_type_of_index_signature_from_exported_interface_is_using_inaccessible_module__0_,
        Return_type_of_public_static_method_from_exported_class_is_using_inaccessible_module__0_,
        Return_type_of_public_method_from_exported_class_is_using_inaccessible_module__0_,
        Return_type_of_method_from_exported_interface_is_using_inaccessible_module__0_,
        Return_type_of_exported_function_is_using_inaccessible_module__0_,
        _new_T____cannot_be_used_to_create_an_array__Use__new_Array_T_____instead,
        A_parameter_list_must_follow_a_generic_type_argument_list______expected,
        Multiple_constructor_implementations_are_not_allowed,
        Unable_to_resolve_external_module__0_,
        Module_cannot_be_aliased_to_a_non_module_type,
        A_class_may_only_extend_another_class,
        A_class_may_only_implement_another_class_or_interface,
        An_interface_may_only_extend_another_class_or_interface,
        An_interface_cannot_implement_another_type,
        Unable_to_resolve_type,
        Unable_to_resolve_type_of__0_,
        Unable_to_resolve_type_parameter_constraint,
        Type_parameter_constraint_cannot_be_a_primitive_type,
        Supplied_parameters_do_not_match_any_signature_of_call_target,
        Supplied_parameters_do_not_match_any_signature_of_call_target__NL__0,
        Invalid__new__expression,
        Call_signatures_used_in_a__new__expression_must_have_a__void__return_type,
        Could_not_select_overload_for__new__expression,
        Type__0__does_not_satisfy_the_constraint__1__for_type_parameter__2_,
        Could_not_select_overload_for__call__expression,
        Unable_to_invoke_type_with_no_call_signatures,
        Calls_to__super__are_only_valid_inside_a_class,
        Generic_type__0__requires_1_type_argument_s_,
        Type_of_conditional_expression_cannot_be_determined__Best_common_type_could_not_be_found_between__0__and__1_,
        Type_of_array_literal_cannot_be_determined__Best_common_type_could_not_be_found_for_array_elements,
        Could_not_find_enclosing_symbol_for_dotted_name__0_,
        The_property__0__does_not_exist_on_value_of_type__1__,
        Could_not_find_symbol__0_,
        _get__and__set__accessor_must_have_the_same_type,
        _this__cannot_be_referenced_in_current_location,
        Use_of_deprecated__bool__type__Use__boolean__instead,
        Class__0__is_recursively_referenced_as_a_base_type_of_itself,
        Interface__0__is_recursively_referenced_as_a_base_type_of_itself,
        _super__property_access_is_permitted_only_in_a_constructor__instance_member_function__or_instance_member_accessor_of_a_derived_class,
        _super__cannot_be_referenced_in_non_derived_classes,
        A__super__call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_intialized_properties_or_has_parameter_properties,
        Constructors_for_derived_classes_must_contain_a__super__call,
        Super_calls_are_not_permitted_outside_constructors_or_in_local_functions_inside_constructors,
        _0_1__is_inaccessible,
        _this__cannot_be_referenced_within_module_bodies,
        _this__must_only_be_used_inside_a_function_or_script_context,
        Invalid__addition__expression___types_do_not_agree,
        The_right_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type,
        The_left_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type,
        The_type_of_a_unary_arithmetic_operation_operand_must_be_of_type__any____number__or_an_enum_type,
        Variable_declarations_for_for_in_expressions_cannot_contain_a_type_annotation,
        Variable_declarations_for_for_in_expressions_must_be_of_types__string__or__any_,
        The_right_operand_of_a_for_in_expression_must_be_of_type__any____an_object_type_or_a_type_parameter,
        The_left_hand_side_of_an__in__expression_must_be_of_types__string__or__any_,
        The_right_hand_side_of_an__in__expression_must_be_of_type__any___an_object_type_or_a_type_parameter,
        The_left_hand_side_of_an__instanceOf__expression_must_be_of_type__any___an_object_type_or_a_type_parameter,
        The_right_hand_side_of_an__instanceOf__expression_must_be_of_type__any__or_a_subtype_of_the__Function__interface_type,
        Setters_cannot_return_a_value,
        Tried_to_set_variable_type_to_module_type__0__,
        Tried_to_set_variable_type_to_uninitialized_module_type__0__,
        Function__0__declared_a_non_void_return_type__but_has_no_return_expression,
        Getters_must_return_a_value,
        Getter_and_setter_accessors_do_not_agree_in_visibility,
        Invalid_left_hand_side_of_assignment_expression,
        Function_declared_a_non_void_return_type__but_has_no_return_expression,
        Cannot_resolve_return_type_reference,
        Constructors_cannot_have_a_return_type_of__void_,
        Subsequent_variable_declarations_must_have_the_same_type___Variable__0__must_be_of_type__1___but_here_has_type___2_,
        All_symbols_within_a__with__block_will_be_resolved_to__any__,
        Import_declarations_in_an_internal_module_cannot_reference_an_external_module,
        Class__0__declares_interface__1__but_does_not_implement_it__NL__2,
        Class__0__declares_class__1__but_does_not_implement_it__NL__2,
        The_operand_of_an_increment_or_decrement_operator_must_be_a_variable__property_or_indexer,
        _this__cannot_be_referenced_in_initializers_in_a_class_body,
        Class__0__cannot_extend_class__1__NL__2,
        Interface__0__cannot_extend_class__1__NL__2,
        Interface__0__cannot_extend_interface__1__NL__2,
        Duplicate_overload_signature_for__0_,
        Duplicate_constructor_overload_signature,
        Duplicate_overload_call_signature,
        Duplicate_overload_construct_signature,
        Overload_signature_is_not_compatible_with_function_definition,
        Overload_signature_is_not_compatible_with_function_definition__NL__0,
        Overload_signatures_must_all_be_public_or_private,
        Overload_signatures_must_all_be_exported_or_local,
        Overload_signatures_must_all_be_ambient_or_non_ambient,
        Overload_signatures_must_all_be_optional_or_required,
        Specialized_overload_signature_is_not_subtype_of_any_non_specialized_signature,
        _this__cannot_be_referenced_in_constructor_arguments,
        Static_member_cannot_be_accessed_off_an_instance_variable,
        Instance_member_cannot_be_accessed_off_a_class,
        Untyped_function_calls_may_not_accept_type_arguments,
        Non_generic_functions_may_not_accept_type_arguments,
        A_generic_type_may_not_reference_itself_with_its_own_type_parameters,
        Static_methods_cannot_reference_class_type_parameters,
        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new___,
        Rest_parameters_must_be_array_types,
        Overload_signature_implementation_cannot_use_specialized_type,
        Export_assignments_may_only_be_used_in_External_modules,
        Export_assignments_may_only_be_made_with_acceptable_kinds,
        Type__0__is_missing_property__1__from_type__2_,
        Types_of_property__0__of_types__1__and__2__are_incompatible,
        Types_of_property__0__of_types__1__and__2__are_incompatible__NL__3,
        Property__0__defined_as_private_in_type__1__is_defined_as_public_in_type__2_,
        Property__0__defined_as_public_in_type__1__is_defined_as_private_in_type__2_,
        Types__0__and__1__define_property__2__as_private,
        Call_signatures_of_types__0__and__1__are_incompatible,
        Call_signatures_of_types__0__and__1__are_incompatible__NL__2,
        Type__0__requires_a_call_signature__but_Type__1__lacks_one,
        Construct_signatures_of_types__0__and__1__are_incompatible,
        Construct_signatures_of_types__0__and__1__are_incompatible__NL__2,
        Type__0__requires_a_construct_signature__but_Type__1__lacks_one,
        Index_signatures_of_types__0__and__1__are_incompatible,
        Index_signatures_of_types__0__and__1__are_incompatible__NL__2,
        Call_signature_expects__0__or_fewer_parameters,
        Could_not_apply_type__0__to_argument__1__which_is_of_type__2_,
        Class__0__defines_instance_member_accessor__1___but_extended_class__2__defines_it_as_instance_member_function,
        Class__0__defines_instance_member_property__1___but_extended_class__2__defines_it_as_instance_member_function,
        Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_accessor,
        Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_property,
        Types_of_static_property__0__of_class__1__and_class__2__are_incompatible,
        Types_of_static_property__0__of_class__1__and_class__2__are_incompatible__NL__3,
        Current_host_does_not_support__w_atch_option,
        ECMAScript_target_version__0__not_supported___Using_default__1__code_generation,
        Module_code_generation__0__not_supported___Using_default__1__code_generation,
        Could_not_find_file___0_,
        Unknown_extension_for_file___0__Only__ts_and_d_ts_extensions_are_allowed,
        A_file_cannot_have_a_reference_itself,
        Cannot_resolve_referenced_file___0_,
        Cannot_resolve_imported_file___0_,
        Cannot_find_the_common_subdirectory_path_for_the_input_files,
        Cannot_compile_dynamic_modules_when_emitting_into_single_file,
        Emit_Error__0,
    }
}
declare module TypeScript {
    interface DiagnosticInfo {
        category: DiagnosticCategory;
        message: string;
        code: number;
    }
}
declare module TypeScript {
    interface IDiagnosticMessages {
        error_TS_0__1: DiagnosticInfo;
        warning_TS_0__1: DiagnosticInfo;
        _0__NL__1_TB__2: DiagnosticInfo;
        _0_TB__1: DiagnosticInfo;
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
        Export_assignments_may_only_be_used_in_External_modules;
        Export_assignments_may_only_be_made_with_acceptable_kinds;
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
    }
    var diagnosticMessages: IDiagnosticMessages;
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
        static computeMurmur2CharArrayHashCode(key: number[], start: number, len: number): number;
        static computeMurmur2StringHashCode(key: string): number;
        private static primes;
        static getPrime(min: number): number;
        static expandPrime(oldSize: number): number;
        static combine(value: number, currentHash: number): number;
    }
}
declare module TypeScript.Collections {
    var DefaultHashTableCapacity: number;
    class HashTable {
        private hash;
        private equals;
        private entries;
        private count;
        constructor(capacity: number, hash: (k: any) => number, equals: (k1: any, k2: any) => boolean);
        public set(key: any, value: any): void;
        public add(key: any, value: any): void;
        public containsKey(key: any): boolean;
        public get(key: any): any;
        private computeHashCode(key);
        private addOrSet(key, value, throwOnExistingEntry);
        private findEntry(key, hashCode);
        private addEntry(key, value, hashCode);
        private grow();
    }
    function createHashTable(capacity?: number, hash?: (k: any) => number, equals?: (k1: any, k2: any) => boolean): HashTable;
    function identityHashCode(value: any): number;
}
declare module TypeScript {
    interface IDiagnostic {
        fileName(): string;
        start(): number;
        length(): number;
        diagnosticCode(): DiagnosticCode;
        text(): string;
        message(): string;
    }
    class Diagnostic implements IDiagnostic {
        private _fileName;
        private _start;
        private _originalStart;
        private _length;
        private _diagnosticCode;
        private _arguments;
        constructor(fileName: string, start: number, length: number, diagnosticCode: DiagnosticCode, arguments?: any[]);
        public toJSON(key);
        public fileName(): string;
        public start(): number;
        public length(): number;
        public diagnosticCode(): DiagnosticCode;
        public arguments(): any[];
        public text(): string;
        public message(): string;
        public adjustOffset(pos: number): void;
        public additionalLocations(): Location[];
        static equals(diagnostic1: Diagnostic, diagnostic2: Diagnostic): boolean;
    }
    function getDiagnosticInfoFromCode(diagnosticCode: DiagnosticCode): DiagnosticInfo;
    function getDiagnosticText(diagnosticCode: DiagnosticCode, args: any[]): string;
    function getDiagnosticMessage(diagnosticCode: DiagnosticCode, args: any[]): string;
}
declare class Enumerator {
    public atEnd(): boolean;
    public moveNext();
    public item(): any;
    constructor(o: any);
}
declare module process {
    var argv: string[];
    var platform: string;
    function on(event: string, handler: (any: any) => void): void;
    module stdout {
        function write(str: string);
    }
    module stderr {
        function write(str: string);
    }
    module mainModule {
        var filename: string;
    }
    function exit(exitCode?: number);
}
interface IEnvironment {
    readFile(path: string, useUTF8?: boolean): string;
    writeFile(path: string, contents: string, useUTF8?: boolean): void;
    deleteFile(path: string): void;
    fileExists(path: string): boolean;
    directoryExists(path: string): boolean;
    listFiles(path: string, re?: RegExp, options?: {
        recursive?: boolean;
    }): string[];
    arguments: string[];
    standardOut: ITextWriter;
    currentDirectory(): string;
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
        constructor(capacity);
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
declare var global;
declare module TypeScript {
    class Timer {
        public startTime;
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
        BoolKeyword,
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
    function isAnyDivideToken(kind: SyntaxKind): boolean;
    function isAnyDivideOrRegularExpressionToken(kind: SyntaxKind): boolean;
    function isParserGenerated(kind: SyntaxKind): boolean;
    function isAnyBinaryExpression(kind: SyntaxKind): boolean;
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
