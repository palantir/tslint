var TypeScript;
(function (TypeScript) {
    var ArrayUtilities = (function () {
        function ArrayUtilities() {
        }
        ArrayUtilities.isArray = function (value) {
            return Object.prototype.toString.apply(value, []) === '[object Array]';
        };

        ArrayUtilities.sequenceEquals = function (array1, array2, equals) {
            if (array1 === array2) {
                return true;
            }

            if (array1 === null || array2 === null) {
                return false;
            }

            if (array1.length !== array2.length) {
                return false;
            }

            for (var i = 0, n = array1.length; i < n; i++) {
                if (!equals(array1[i], array2[i])) {
                    return false;
                }
            }

            return true;
        };

        ArrayUtilities.contains = function (array, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === value) {
                    return true;
                }
            }

            return false;
        };

        ArrayUtilities.groupBy = function (array, func) {
            var result = {};

            for (var i = 0, n = array.length; i < n; i++) {
                var v = array[i];
                var k = func(v);

                var list = result[k] || [];
                list.push(v);
                result[k] = list;
            }

            return result;
        };

        ArrayUtilities.min = function (array, func) {
            var min = func(array[0]);

            for (var i = 1; i < array.length; i++) {
                var next = func(array[i]);
                if (next < min) {
                    min = next;
                }
            }

            return min;
        };

        ArrayUtilities.max = function (array, func) {
            var max = func(array[0]);

            for (var i = 1; i < array.length; i++) {
                var next = func(array[i]);
                if (next > max) {
                    max = next;
                }
            }

            return max;
        };

        ArrayUtilities.last = function (array) {
            if (array.length === 0) {
                throw TypeScript.Errors.argumentOutOfRange('array');
            }

            return array[array.length - 1];
        };

        ArrayUtilities.firstOrDefault = function (array, func) {
            for (var i = 0, n = array.length; i < n; i++) {
                var value = array[i];
                if (func(value)) {
                    return value;
                }
            }

            return null;
        };

        ArrayUtilities.sum = function (array, func) {
            var result = 0;

            for (var i = 0, n = array.length; i < n; i++) {
                result += func(array[i]);
            }

            return result;
        };

        ArrayUtilities.whereNotNull = function (array) {
            var result = [];
            for (var i = 0; i < array.length; i++) {
                var value = array[i];
                if (value !== null) {
                    result.push(value);
                }
            }

            return result;
        };

        ArrayUtilities.select = function (values, func) {
            var result = [];

            for (var i = 0; i < values.length; i++) {
                result.push(func(values[i]));
            }

            return result;
        };

        ArrayUtilities.where = function (values, func) {
            var result = [];

            for (var i = 0; i < values.length; i++) {
                if (func(values[i])) {
                    result.push(values[i]);
                }
            }

            return result;
        };

        ArrayUtilities.any = function (array, func) {
            for (var i = 0, n = array.length; i < n; i++) {
                if (func(array[i])) {
                    return true;
                }
            }

            return false;
        };

        ArrayUtilities.all = function (array, func) {
            for (var i = 0, n = array.length; i < n; i++) {
                if (!func(array[i])) {
                    return false;
                }
            }

            return true;
        };

        ArrayUtilities.binarySearch = function (array, value) {
            var low = 0;
            var high = array.length - 1;

            while (low <= high) {
                var middle = low + ((high - low) >> 1);
                var midValue = array[middle];

                if (midValue === value) {
                    return middle;
                } else if (midValue > value) {
                    high = middle - 1;
                } else {
                    low = middle + 1;
                }
            }

            return ~low;
        };

        ArrayUtilities.createArray = function (length, defaultvalue) {
            var result = [];
            for (var i = 0; i < length; i++) {
                result.push(defaultvalue);
            }

            return result;
        };

        ArrayUtilities.grow = function (array, length, defaultValue) {
            var count = length - array.length;
            for (var i = 0; i < count; i++) {
                array.push(defaultValue);
            }
        };

        ArrayUtilities.copy = function (sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
            for (var i = 0; i < length; i++) {
                destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
            }
        };
        return ArrayUtilities;
    })();
    TypeScript.ArrayUtilities = ArrayUtilities;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    (function (Constants) {
        Constants[Constants["Max31BitInteger"] = 1073741823] = "Max31BitInteger";
        Constants[Constants["Min31BitInteger"] = -1073741824] = "Min31BitInteger";
    })(TypeScript.Constants || (TypeScript.Constants = {}));
    var Constants = TypeScript.Constants;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var Contract = (function () {
        function Contract() {
        }
        Contract.requires = function (expression) {
            if (!expression) {
                throw new Error("Contract violated. False expression.");
            }
        };

        Contract.throwIfFalse = function (expression) {
            if (!expression) {
                throw new Error("Contract violated. False expression.");
            }
        };

        Contract.throwIfNull = function (value) {
            if (value === null) {
                throw new Error("Contract violated. Null value.");
            }
        };
        return Contract;
    })();
    TypeScript.Contract = Contract;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var Debug = (function () {
        function Debug() {
        }
        Debug.assert = function (expression, message) {
            if (!expression) {
                throw new Error("Debug Failure. False expression: " + (message ? message : ""));
            }
        };
        return Debug;
    })();
    TypeScript.Debug = Debug;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    (function (DiagnosticCategory) {
        DiagnosticCategory[DiagnosticCategory["Warning"] = 0] = "Warning";
        DiagnosticCategory[DiagnosticCategory["Error"] = 1] = "Error";
        DiagnosticCategory[DiagnosticCategory["Message"] = 2] = "Message";
        DiagnosticCategory[DiagnosticCategory["NoPrefix"] = 3] = "NoPrefix";
    })(TypeScript.DiagnosticCategory || (TypeScript.DiagnosticCategory = {}));
    var DiagnosticCategory = TypeScript.DiagnosticCategory;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    (function (DiagnosticCode) {
        DiagnosticCode[DiagnosticCode["error_TS_0__1"] = 0] = "error_TS_0__1";
        DiagnosticCode[DiagnosticCode["warning_TS_0__1"] = 1] = "warning_TS_0__1";

        DiagnosticCode[DiagnosticCode["_0__NL__1_TB__2"] = 2] = "_0__NL__1_TB__2";
        DiagnosticCode[DiagnosticCode["_0_TB__1"] = 3] = "_0_TB__1";

        DiagnosticCode[DiagnosticCode["Unrecognized_escape_sequence"] = 4] = "Unrecognized_escape_sequence";
        DiagnosticCode[DiagnosticCode["Unexpected_character_0"] = 5] = "Unexpected_character_0";
        DiagnosticCode[DiagnosticCode["Missing_closing_quote_character"] = 6] = "Missing_closing_quote_character";
        DiagnosticCode[DiagnosticCode["Identifier_expected"] = 7] = "Identifier_expected";
        DiagnosticCode[DiagnosticCode["_0_keyword_expected"] = 8] = "_0_keyword_expected";
        DiagnosticCode[DiagnosticCode["_0_expected"] = 9] = "_0_expected";
        DiagnosticCode[DiagnosticCode["Identifier_expected__0__is_a_keyword"] = 10] = "Identifier_expected__0__is_a_keyword";
        DiagnosticCode[DiagnosticCode["Automatic_semicolon_insertion_not_allowed"] = 11] = "Automatic_semicolon_insertion_not_allowed";
        DiagnosticCode[DiagnosticCode["Unexpected_token__0_expected"] = 12] = "Unexpected_token__0_expected";
        DiagnosticCode[DiagnosticCode["Trailing_separator_not_allowed"] = 13] = "Trailing_separator_not_allowed";
        DiagnosticCode[DiagnosticCode["_StarSlash__expected"] = 14] = "_StarSlash__expected";
        DiagnosticCode[DiagnosticCode["_public_or_private_modifier_must_precede__static_"] = 15] = "_public_or_private_modifier_must_precede__static_";
        DiagnosticCode[DiagnosticCode["Unexpected_token_"] = 16] = "Unexpected_token_";
        DiagnosticCode[DiagnosticCode["A_catch_clause_variable_cannot_have_a_type_annotation"] = 17] = "A_catch_clause_variable_cannot_have_a_type_annotation";
        DiagnosticCode[DiagnosticCode["Rest_parameter_must_be_last_in_list"] = 18] = "Rest_parameter_must_be_last_in_list";
        DiagnosticCode[DiagnosticCode["Parameter_cannot_have_question_mark_and_initializer"] = 19] = "Parameter_cannot_have_question_mark_and_initializer";
        DiagnosticCode[DiagnosticCode["Required_parameter_cannot_follow_optional_parameter"] = 20] = "Required_parameter_cannot_follow_optional_parameter";
        DiagnosticCode[DiagnosticCode["Index_signatures_cannot_have_rest_parameters"] = 21] = "Index_signatures_cannot_have_rest_parameters";
        DiagnosticCode[DiagnosticCode["Index_signature_parameter_cannot_have_accessibility_modifiers"] = 22] = "Index_signature_parameter_cannot_have_accessibility_modifiers";
        DiagnosticCode[DiagnosticCode["Index_signature_parameter_cannot_have_a_question_mark"] = 23] = "Index_signature_parameter_cannot_have_a_question_mark";
        DiagnosticCode[DiagnosticCode["Index_signature_parameter_cannot_have_an_initializer"] = 24] = "Index_signature_parameter_cannot_have_an_initializer";
        DiagnosticCode[DiagnosticCode["Index_signature_must_have_a_type_annotation"] = 25] = "Index_signature_must_have_a_type_annotation";
        DiagnosticCode[DiagnosticCode["Index_signature_parameter_must_have_a_type_annotation"] = 26] = "Index_signature_parameter_must_have_a_type_annotation";
        DiagnosticCode[DiagnosticCode["Index_signature_parameter_type_must_be__string__or__number_"] = 27] = "Index_signature_parameter_type_must_be__string__or__number_";
        DiagnosticCode[DiagnosticCode["_extends__clause_already_seen"] = 28] = "_extends__clause_already_seen";
        DiagnosticCode[DiagnosticCode["_extends__clause_must_precede__implements__clause"] = 29] = "_extends__clause_must_precede__implements__clause";
        DiagnosticCode[DiagnosticCode["Class_can_only_extend_single_type"] = 30] = "Class_can_only_extend_single_type";
        DiagnosticCode[DiagnosticCode["_implements__clause_already_seen"] = 31] = "_implements__clause_already_seen";
        DiagnosticCode[DiagnosticCode["Accessibility_modifier_already_seen"] = 32] = "Accessibility_modifier_already_seen";
        DiagnosticCode[DiagnosticCode["_0__modifier_must_precede__1__modifier"] = 33] = "_0__modifier_must_precede__1__modifier";
        DiagnosticCode[DiagnosticCode["_0__modifier_already_seen"] = 34] = "_0__modifier_already_seen";
        DiagnosticCode[DiagnosticCode["_0__modifier_cannot_appear_on_a_class_element"] = 35] = "_0__modifier_cannot_appear_on_a_class_element";
        DiagnosticCode[DiagnosticCode["Interface_declaration_cannot_have__implements__clause"] = 36] = "Interface_declaration_cannot_have__implements__clause";
        DiagnosticCode[DiagnosticCode["_super__invocation_cannot_have_type_arguments"] = 37] = "_super__invocation_cannot_have_type_arguments";
        DiagnosticCode[DiagnosticCode["Non_ambient_modules_cannot_use_quoted_names"] = 38] = "Non_ambient_modules_cannot_use_quoted_names";
        DiagnosticCode[DiagnosticCode["Statements_are_not_allowed_in_ambient_contexts"] = 39] = "Statements_are_not_allowed_in_ambient_contexts";
        DiagnosticCode[DiagnosticCode["Implementations_are_not_allowed_in_ambient_contexts"] = 40] = "Implementations_are_not_allowed_in_ambient_contexts";
        DiagnosticCode[DiagnosticCode["_declare__modifier_not_allowed_for_code_already_in_an_ambient_context"] = 41] = "_declare__modifier_not_allowed_for_code_already_in_an_ambient_context";
        DiagnosticCode[DiagnosticCode["Initializers_are_not_allowed_in_ambient_contexts"] = 42] = "Initializers_are_not_allowed_in_ambient_contexts";
        DiagnosticCode[DiagnosticCode["Overload_and_ambient_signatures_cannot_specify_parameter_properties"] = 43] = "Overload_and_ambient_signatures_cannot_specify_parameter_properties";
        DiagnosticCode[DiagnosticCode["Function_implementation_expected"] = 44] = "Function_implementation_expected";
        DiagnosticCode[DiagnosticCode["Constructor_implementation_expected"] = 45] = "Constructor_implementation_expected";
        DiagnosticCode[DiagnosticCode["Function_overload_name_must_be__0_"] = 46] = "Function_overload_name_must_be__0_";
        DiagnosticCode[DiagnosticCode["_0__modifier_cannot_appear_on_a_module_element"] = 47] = "_0__modifier_cannot_appear_on_a_module_element";
        DiagnosticCode[DiagnosticCode["_declare__modifier_cannot_appear_on_an_interface_declaration"] = 48] = "_declare__modifier_cannot_appear_on_an_interface_declaration";
        DiagnosticCode[DiagnosticCode["_declare__modifier_required_for_top_level_element"] = 49] = "_declare__modifier_required_for_top_level_element";
        DiagnosticCode[DiagnosticCode["_set__accessor_must_have_only_one_parameter"] = 50] = "_set__accessor_must_have_only_one_parameter";
        DiagnosticCode[DiagnosticCode["_set__accessor_parameter_cannot_have_accessibility_modifier"] = 51] = "_set__accessor_parameter_cannot_have_accessibility_modifier";
        DiagnosticCode[DiagnosticCode["_set__accessor_parameter_cannot_be_optional"] = 52] = "_set__accessor_parameter_cannot_be_optional";
        DiagnosticCode[DiagnosticCode["_set__accessor_parameter_cannot_have_initializer"] = 53] = "_set__accessor_parameter_cannot_have_initializer";
        DiagnosticCode[DiagnosticCode["_set__accessor_cannot_have_rest_parameter"] = 54] = "_set__accessor_cannot_have_rest_parameter";
        DiagnosticCode[DiagnosticCode["_get__accessor_cannot_have_parameters"] = 55] = "_get__accessor_cannot_have_parameters";
        DiagnosticCode[DiagnosticCode["Rest_parameter_cannot_be_optional"] = 56] = "Rest_parameter_cannot_be_optional";
        DiagnosticCode[DiagnosticCode["Rest_parameter_cannot_have_initializer"] = 57] = "Rest_parameter_cannot_have_initializer";
        DiagnosticCode[DiagnosticCode["Modifiers_cannot_appear_here"] = 58] = "Modifiers_cannot_appear_here";
        DiagnosticCode[DiagnosticCode["Accessors_are_only_available_when_targeting_EcmaScript5_and_higher"] = 59] = "Accessors_are_only_available_when_targeting_EcmaScript5_and_higher";
        DiagnosticCode[DiagnosticCode["Class_name_cannot_be__0_"] = 60] = "Class_name_cannot_be__0_";
        DiagnosticCode[DiagnosticCode["Interface_name_cannot_be__0_"] = 61] = "Interface_name_cannot_be__0_";
        DiagnosticCode[DiagnosticCode["Enum_name_cannot_be__0_"] = 62] = "Enum_name_cannot_be__0_";
        DiagnosticCode[DiagnosticCode["Module_name_cannot_be__0_"] = 63] = "Module_name_cannot_be__0_";
        DiagnosticCode[DiagnosticCode["Enum_member_must_have_initializer"] = 64] = "Enum_member_must_have_initializer";
        DiagnosticCode[DiagnosticCode["_module_______is_deprecated___Use__require_______instead"] = 65] = "_module_______is_deprecated___Use__require_______instead";

        DiagnosticCode[DiagnosticCode["Duplicate_identifier__0_"] = 66] = "Duplicate_identifier__0_";
        DiagnosticCode[DiagnosticCode["The_name__0__does_not_exist_in_the_current_scope"] = 67] = "The_name__0__does_not_exist_in_the_current_scope";
        DiagnosticCode[DiagnosticCode["The_name__0__does_not_refer_to_a_value"] = 68] = "The_name__0__does_not_refer_to_a_value";
        DiagnosticCode[DiagnosticCode["Keyword__super__can_only_be_used_inside_a_class_instance_method"] = 69] = "Keyword__super__can_only_be_used_inside_a_class_instance_method";
        DiagnosticCode[DiagnosticCode["The_left_hand_side_of_an_assignment_expression_must_be_a_variable__property_or_indexer"] = 70] = "The_left_hand_side_of_an_assignment_expression_must_be_a_variable__property_or_indexer";
        DiagnosticCode[DiagnosticCode["Value_of_type__0__is_not_callable__Did_you_mean_to_include__new__"] = 71] = "Value_of_type__0__is_not_callable__Did_you_mean_to_include__new__";
        DiagnosticCode[DiagnosticCode["Value_of_type__0__is_not_callable"] = 72] = "Value_of_type__0__is_not_callable";
        DiagnosticCode[DiagnosticCode["Value_of_type__0__is_not_newable"] = 73] = "Value_of_type__0__is_not_newable";
        DiagnosticCode[DiagnosticCode["Value_of_type__0__is_not_indexable_by_type__1_"] = 74] = "Value_of_type__0__is_not_indexable_by_type__1_";
        DiagnosticCode[DiagnosticCode["Operator__0__cannot_be_applied_to_types__1__and__2_"] = 75] = "Operator__0__cannot_be_applied_to_types__1__and__2_";
        DiagnosticCode[DiagnosticCode["Operator__0__cannot_be_applied_to_types__1__and__2__3"] = 76] = "Operator__0__cannot_be_applied_to_types__1__and__2__3";
        DiagnosticCode[DiagnosticCode["Cannot_convert__0__to__1_"] = 77] = "Cannot_convert__0__to__1_";
        DiagnosticCode[DiagnosticCode["Cannot_convert__0__to__1__NL__2"] = 78] = "Cannot_convert__0__to__1__NL__2";
        DiagnosticCode[DiagnosticCode["Expected_var__class__interface__or_module"] = 79] = "Expected_var__class__interface__or_module";
        DiagnosticCode[DiagnosticCode["Operator__0__cannot_be_applied_to_type__1_"] = 80] = "Operator__0__cannot_be_applied_to_type__1_";
        DiagnosticCode[DiagnosticCode["Getter__0__already_declared"] = 81] = "Getter__0__already_declared";
        DiagnosticCode[DiagnosticCode["Setter__0__already_declared"] = 82] = "Setter__0__already_declared";
        DiagnosticCode[DiagnosticCode["Accessor_cannot_have_type_parameters"] = 83] = "Accessor_cannot_have_type_parameters";
        DiagnosticCode[DiagnosticCode["Exported_class__0__extends_private_class__1_"] = 84] = "Exported_class__0__extends_private_class__1_";
        DiagnosticCode[DiagnosticCode["Exported_class__0__implements_private_interface__1_"] = 85] = "Exported_class__0__implements_private_interface__1_";
        DiagnosticCode[DiagnosticCode["Exported_interface__0__extends_private_interface__1_"] = 86] = "Exported_interface__0__extends_private_interface__1_";
        DiagnosticCode[DiagnosticCode["Exported_class__0__extends_class_from_inaccessible_module__1_"] = 87] = "Exported_class__0__extends_class_from_inaccessible_module__1_";
        DiagnosticCode[DiagnosticCode["Exported_class__0__implements_interface_from_inaccessible_module__1_"] = 88] = "Exported_class__0__implements_interface_from_inaccessible_module__1_";
        DiagnosticCode[DiagnosticCode["Exported_interface__0__extends_interface_from_inaccessible_module__1_"] = 89] = "Exported_interface__0__extends_interface_from_inaccessible_module__1_";
        DiagnosticCode[DiagnosticCode["Public_static_property__0__of__exported_class_has_or_is_using_private_type__1_"] = 90] = "Public_static_property__0__of__exported_class_has_or_is_using_private_type__1_";
        DiagnosticCode[DiagnosticCode["Public_property__0__of__exported_class_has_or_is_using_private_type__1_"] = 91] = "Public_property__0__of__exported_class_has_or_is_using_private_type__1_";
        DiagnosticCode[DiagnosticCode["Property__0__of__exported_interface_has_or_is_using_private_type__1_"] = 92] = "Property__0__of__exported_interface_has_or_is_using_private_type__1_";
        DiagnosticCode[DiagnosticCode["Exported_variable__0__has_or_is_using_private_type__1_"] = 93] = "Exported_variable__0__has_or_is_using_private_type__1_";
        DiagnosticCode[DiagnosticCode["Public_static_property__0__of__exported_class_is_using_inaccessible_module__1_"] = 94] = "Public_static_property__0__of__exported_class_is_using_inaccessible_module__1_";
        DiagnosticCode[DiagnosticCode["Public_property__0__of__exported_class_is_using_inaccessible_module__1_"] = 95] = "Public_property__0__of__exported_class_is_using_inaccessible_module__1_";
        DiagnosticCode[DiagnosticCode["Property__0__of__exported_interface_is_using_inaccessible_module__1_"] = 96] = "Property__0__of__exported_interface_is_using_inaccessible_module__1_";
        DiagnosticCode[DiagnosticCode["Exported_variable__0__is_using_inaccessible_module__1_"] = 97] = "Exported_variable__0__is_using_inaccessible_module__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_constructor_from_exported_class_has_or_is_using_private_type__1_"] = 98] = "Parameter__0__of_constructor_from_exported_class_has_or_is_using_private_type__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_public_static_property_setter_from_exported_class_has_or_is_using_private_type__1_"] = 99] = "Parameter__0__of_public_static_property_setter_from_exported_class_has_or_is_using_private_type__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_public_property_setter_from_exported_class_has_or_is_using_private_type__1_"] = 100] = "Parameter__0__of_public_property_setter_from_exported_class_has_or_is_using_private_type__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_constructor_signature_from_exported_interface_has_or_is_using_private_type__1_"] = 101] = "Parameter__0__of_constructor_signature_from_exported_interface_has_or_is_using_private_type__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_call_signature_from_exported_interface_has_or_is_using_private_type__1_"] = 102] = "Parameter__0__of_call_signature_from_exported_interface_has_or_is_using_private_type__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_public_static_method_from_exported_class_has_or_is_using_private_type__1_"] = 103] = "Parameter__0__of_public_static_method_from_exported_class_has_or_is_using_private_type__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_public_method_from_exported_class_has_or_is_using_private_type__1_"] = 104] = "Parameter__0__of_public_method_from_exported_class_has_or_is_using_private_type__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_method_from_exported_interface_has_or_is_using_private_type__1_"] = 105] = "Parameter__0__of_method_from_exported_interface_has_or_is_using_private_type__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_exported_function_has_or_is_using_private_type__1_"] = 106] = "Parameter__0__of_exported_function_has_or_is_using_private_type__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_constructor_from_exported_class_is_using_inaccessible_module__1_"] = 107] = "Parameter__0__of_constructor_from_exported_class_is_using_inaccessible_module__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_public_static_property_setter_from_exported_class_is_using_inaccessible_module__1_"] = 108] = "Parameter__0__of_public_static_property_setter_from_exported_class_is_using_inaccessible_module__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_public_property_setter_from_exported_class_is_using_inaccessible_module__1_"] = 109] = "Parameter__0__of_public_property_setter_from_exported_class_is_using_inaccessible_module__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_constructor_signature_from_exported_interface_is_using_inaccessible_module__1_"] = 110] = "Parameter__0__of_constructor_signature_from_exported_interface_is_using_inaccessible_module__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_call_signature_from_exported_interface_is_using_inaccessible_module__1_"] = 111] = "Parameter__0__of_call_signature_from_exported_interface_is_using_inaccessible_module__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_public_static_method_from_exported_class_is_using_inaccessible_module__1_"] = 112] = "Parameter__0__of_public_static_method_from_exported_class_is_using_inaccessible_module__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_public_method_from_exported_class_is_using_inaccessible_module__1_"] = 113] = "Parameter__0__of_public_method_from_exported_class_is_using_inaccessible_module__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_method_from_exported_interface_is_using_inaccessible_module__1_"] = 114] = "Parameter__0__of_method_from_exported_interface_is_using_inaccessible_module__1_";
        DiagnosticCode[DiagnosticCode["Parameter__0__of_exported_function_is_using_inaccessible_module__1_"] = 115] = "Parameter__0__of_exported_function_is_using_inaccessible_module__1_";
        DiagnosticCode[DiagnosticCode["Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_type__0_"] = 116] = "Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_type__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_type__0_"] = 117] = "Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_type__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_type__0_"] = 118] = "Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_type__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_type__0_"] = 119] = "Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_type__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_type__0_"] = 120] = "Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_type__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_type__0_"] = 121] = "Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_type__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_public_method_from_exported_class_has_or_is_using_private_type__0_"] = 122] = "Return_type_of_public_method_from_exported_class_has_or_is_using_private_type__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_method_from_exported_interface_has_or_is_using_private_type__0_"] = 123] = "Return_type_of_method_from_exported_interface_has_or_is_using_private_type__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_exported_function_has_or_is_using_private_type__0_"] = 124] = "Return_type_of_exported_function_has_or_is_using_private_type__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_public_static_property_getter_from_exported_class_is_using_inaccessible_module__0_"] = 125] = "Return_type_of_public_static_property_getter_from_exported_class_is_using_inaccessible_module__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_public_property_getter_from_exported_class_is_using_inaccessible_module__0_"] = 126] = "Return_type_of_public_property_getter_from_exported_class_is_using_inaccessible_module__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_constructor_signature_from_exported_interface_is_using_inaccessible_module__0_"] = 127] = "Return_type_of_constructor_signature_from_exported_interface_is_using_inaccessible_module__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_call_signature_from_exported_interface_is_using_inaccessible_module__0_"] = 128] = "Return_type_of_call_signature_from_exported_interface_is_using_inaccessible_module__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_index_signature_from_exported_interface_is_using_inaccessible_module__0_"] = 129] = "Return_type_of_index_signature_from_exported_interface_is_using_inaccessible_module__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_public_static_method_from_exported_class_is_using_inaccessible_module__0_"] = 130] = "Return_type_of_public_static_method_from_exported_class_is_using_inaccessible_module__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_public_method_from_exported_class_is_using_inaccessible_module__0_"] = 131] = "Return_type_of_public_method_from_exported_class_is_using_inaccessible_module__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_method_from_exported_interface_is_using_inaccessible_module__0_"] = 132] = "Return_type_of_method_from_exported_interface_is_using_inaccessible_module__0_";
        DiagnosticCode[DiagnosticCode["Return_type_of_exported_function_is_using_inaccessible_module__0_"] = 133] = "Return_type_of_exported_function_is_using_inaccessible_module__0_";
        DiagnosticCode[DiagnosticCode["_new_T____cannot_be_used_to_create_an_array__Use__new_Array_T_____instead"] = 134] = "_new_T____cannot_be_used_to_create_an_array__Use__new_Array_T_____instead";
        DiagnosticCode[DiagnosticCode["A_parameter_list_must_follow_a_generic_type_argument_list______expected"] = 135] = "A_parameter_list_must_follow_a_generic_type_argument_list______expected";
        DiagnosticCode[DiagnosticCode["Multiple_constructor_implementations_are_not_allowed"] = 136] = "Multiple_constructor_implementations_are_not_allowed";
        DiagnosticCode[DiagnosticCode["Unable_to_resolve_external_module__0_"] = 137] = "Unable_to_resolve_external_module__0_";
        DiagnosticCode[DiagnosticCode["Module_cannot_be_aliased_to_a_non_module_type"] = 138] = "Module_cannot_be_aliased_to_a_non_module_type";
        DiagnosticCode[DiagnosticCode["A_class_may_only_extend_another_class"] = 139] = "A_class_may_only_extend_another_class";
        DiagnosticCode[DiagnosticCode["A_class_may_only_implement_another_class_or_interface"] = 140] = "A_class_may_only_implement_another_class_or_interface";
        DiagnosticCode[DiagnosticCode["An_interface_may_only_extend_another_class_or_interface"] = 141] = "An_interface_may_only_extend_another_class_or_interface";
        DiagnosticCode[DiagnosticCode["An_interface_cannot_implement_another_type"] = 142] = "An_interface_cannot_implement_another_type";
        DiagnosticCode[DiagnosticCode["Unable_to_resolve_type"] = 143] = "Unable_to_resolve_type";
        DiagnosticCode[DiagnosticCode["Unable_to_resolve_type_of__0_"] = 144] = "Unable_to_resolve_type_of__0_";
        DiagnosticCode[DiagnosticCode["Unable_to_resolve_type_parameter_constraint"] = 145] = "Unable_to_resolve_type_parameter_constraint";
        DiagnosticCode[DiagnosticCode["Type_parameter_constraint_cannot_be_a_primitive_type"] = 146] = "Type_parameter_constraint_cannot_be_a_primitive_type";
        DiagnosticCode[DiagnosticCode["Supplied_parameters_do_not_match_any_signature_of_call_target"] = 147] = "Supplied_parameters_do_not_match_any_signature_of_call_target";
        DiagnosticCode[DiagnosticCode["Supplied_parameters_do_not_match_any_signature_of_call_target__NL__0"] = 148] = "Supplied_parameters_do_not_match_any_signature_of_call_target__NL__0";
        DiagnosticCode[DiagnosticCode["Invalid__new__expression"] = 149] = "Invalid__new__expression";
        DiagnosticCode[DiagnosticCode["Call_signatures_used_in_a__new__expression_must_have_a__void__return_type"] = 150] = "Call_signatures_used_in_a__new__expression_must_have_a__void__return_type";
        DiagnosticCode[DiagnosticCode["Could_not_select_overload_for__new__expression"] = 151] = "Could_not_select_overload_for__new__expression";
        DiagnosticCode[DiagnosticCode["Type__0__does_not_satisfy_the_constraint__1__for_type_parameter__2_"] = 152] = "Type__0__does_not_satisfy_the_constraint__1__for_type_parameter__2_";
        DiagnosticCode[DiagnosticCode["Could_not_select_overload_for__call__expression"] = 153] = "Could_not_select_overload_for__call__expression";
        DiagnosticCode[DiagnosticCode["Unable_to_invoke_type_with_no_call_signatures"] = 154] = "Unable_to_invoke_type_with_no_call_signatures";
        DiagnosticCode[DiagnosticCode["Calls_to__super__are_only_valid_inside_a_class"] = 155] = "Calls_to__super__are_only_valid_inside_a_class";
        DiagnosticCode[DiagnosticCode["Generic_type__0__requires_1_type_argument_s_"] = 156] = "Generic_type__0__requires_1_type_argument_s_";
        DiagnosticCode[DiagnosticCode["Type_of_conditional_expression_cannot_be_determined__Best_common_type_could_not_be_found_between__0__and__1_"] = 157] = "Type_of_conditional_expression_cannot_be_determined__Best_common_type_could_not_be_found_between__0__and__1_";
        DiagnosticCode[DiagnosticCode["Type_of_array_literal_cannot_be_determined__Best_common_type_could_not_be_found_for_array_elements"] = 158] = "Type_of_array_literal_cannot_be_determined__Best_common_type_could_not_be_found_for_array_elements";
        DiagnosticCode[DiagnosticCode["Could_not_find_enclosing_symbol_for_dotted_name__0_"] = 159] = "Could_not_find_enclosing_symbol_for_dotted_name__0_";
        DiagnosticCode[DiagnosticCode["The_property__0__does_not_exist_on_value_of_type__1__"] = 160] = "The_property__0__does_not_exist_on_value_of_type__1__";
        DiagnosticCode[DiagnosticCode["Could_not_find_symbol__0_"] = 161] = "Could_not_find_symbol__0_";
        DiagnosticCode[DiagnosticCode["_get__and__set__accessor_must_have_the_same_type"] = 162] = "_get__and__set__accessor_must_have_the_same_type";
        DiagnosticCode[DiagnosticCode["_this__cannot_be_referenced_in_current_location"] = 163] = "_this__cannot_be_referenced_in_current_location";
        DiagnosticCode[DiagnosticCode["Use_of_deprecated__bool__type__Use__boolean__instead"] = 164] = "Use_of_deprecated__bool__type__Use__boolean__instead";

        DiagnosticCode[DiagnosticCode["Class__0__is_recursively_referenced_as_a_base_type_of_itself"] = 165] = "Class__0__is_recursively_referenced_as_a_base_type_of_itself";
        DiagnosticCode[DiagnosticCode["Interface__0__is_recursively_referenced_as_a_base_type_of_itself"] = 166] = "Interface__0__is_recursively_referenced_as_a_base_type_of_itself";
        DiagnosticCode[DiagnosticCode["_super__property_access_is_permitted_only_in_a_constructor__instance_member_function__or_instance_member_accessor_of_a_derived_class"] = 167] = "_super__property_access_is_permitted_only_in_a_constructor__instance_member_function__or_instance_member_accessor_of_a_derived_class";
        DiagnosticCode[DiagnosticCode["_super__cannot_be_referenced_in_non_derived_classes"] = 168] = "_super__cannot_be_referenced_in_non_derived_classes";
        DiagnosticCode[DiagnosticCode["A__super__call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_intialized_properties_or_has_parameter_properties"] = 169] = "A__super__call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_intialized_properties_or_has_parameter_properties";
        DiagnosticCode[DiagnosticCode["Constructors_for_derived_classes_must_contain_a__super__call"] = 170] = "Constructors_for_derived_classes_must_contain_a__super__call";
        DiagnosticCode[DiagnosticCode["Super_calls_are_not_permitted_outside_constructors_or_in_local_functions_inside_constructors"] = 171] = "Super_calls_are_not_permitted_outside_constructors_or_in_local_functions_inside_constructors";
        DiagnosticCode[DiagnosticCode["_0_1__is_inaccessible"] = 172] = "_0_1__is_inaccessible";
        DiagnosticCode[DiagnosticCode["_this__cannot_be_referenced_within_module_bodies"] = 173] = "_this__cannot_be_referenced_within_module_bodies";
        DiagnosticCode[DiagnosticCode["_this__must_only_be_used_inside_a_function_or_script_context"] = 174] = "_this__must_only_be_used_inside_a_function_or_script_context";
        DiagnosticCode[DiagnosticCode["Invalid__addition__expression___types_do_not_agree"] = 175] = "Invalid__addition__expression___types_do_not_agree";
        DiagnosticCode[DiagnosticCode["The_right_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type"] = 176] = "The_right_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type";
        DiagnosticCode[DiagnosticCode["The_left_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type"] = 177] = "The_left_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type";
        DiagnosticCode[DiagnosticCode["The_type_of_a_unary_arithmetic_operation_operand_must_be_of_type__any____number__or_an_enum_type"] = 178] = "The_type_of_a_unary_arithmetic_operation_operand_must_be_of_type__any____number__or_an_enum_type";
        DiagnosticCode[DiagnosticCode["Variable_declarations_for_for_in_expressions_cannot_contain_a_type_annotation"] = 179] = "Variable_declarations_for_for_in_expressions_cannot_contain_a_type_annotation";
        DiagnosticCode[DiagnosticCode["Variable_declarations_for_for_in_expressions_must_be_of_types__string__or__any_"] = 180] = "Variable_declarations_for_for_in_expressions_must_be_of_types__string__or__any_";
        DiagnosticCode[DiagnosticCode["The_right_operand_of_a_for_in_expression_must_be_of_type__any____an_object_type_or_a_type_parameter"] = 181] = "The_right_operand_of_a_for_in_expression_must_be_of_type__any____an_object_type_or_a_type_parameter";
        DiagnosticCode[DiagnosticCode["The_left_hand_side_of_an__in__expression_must_be_of_types__string__or__any_"] = 182] = "The_left_hand_side_of_an__in__expression_must_be_of_types__string__or__any_";
        DiagnosticCode[DiagnosticCode["The_right_hand_side_of_an__in__expression_must_be_of_type__any___an_object_type_or_a_type_parameter"] = 183] = "The_right_hand_side_of_an__in__expression_must_be_of_type__any___an_object_type_or_a_type_parameter";
        DiagnosticCode[DiagnosticCode["The_left_hand_side_of_an__instanceOf__expression_must_be_of_type__any___an_object_type_or_a_type_parameter"] = 184] = "The_left_hand_side_of_an__instanceOf__expression_must_be_of_type__any___an_object_type_or_a_type_parameter";
        DiagnosticCode[DiagnosticCode["The_right_hand_side_of_an__instanceOf__expression_must_be_of_type__any__or_a_subtype_of_the__Function__interface_type"] = 185] = "The_right_hand_side_of_an__instanceOf__expression_must_be_of_type__any__or_a_subtype_of_the__Function__interface_type";
        DiagnosticCode[DiagnosticCode["Setters_cannot_return_a_value"] = 186] = "Setters_cannot_return_a_value";
        DiagnosticCode[DiagnosticCode["Tried_to_set_variable_type_to_uninitialized_module_type"] = 187] = "Tried_to_set_variable_type_to_uninitialized_module_type";
        DiagnosticCode[DiagnosticCode["Tried_to_set_variable_type_to_uninitialized_module_type__0__"] = 188] = "Tried_to_set_variable_type_to_uninitialized_module_type__0__";
        DiagnosticCode[DiagnosticCode["Function__0__declared_a_non_void_return_type__but_has_no_return_expression"] = 189] = "Function__0__declared_a_non_void_return_type__but_has_no_return_expression";
        DiagnosticCode[DiagnosticCode["Getters_must_return_a_value"] = 190] = "Getters_must_return_a_value";
        DiagnosticCode[DiagnosticCode["Getter_and_setter_accessors_do_not_agree_in_visibility"] = 191] = "Getter_and_setter_accessors_do_not_agree_in_visibility";
        DiagnosticCode[DiagnosticCode["Invalid_left_hand_side_of_assignment_expression"] = 192] = "Invalid_left_hand_side_of_assignment_expression";
        DiagnosticCode[DiagnosticCode["Function_declared_a_non_void_return_type__but_has_no_return_expression"] = 193] = "Function_declared_a_non_void_return_type__but_has_no_return_expression";
        DiagnosticCode[DiagnosticCode["Cannot_resolve_return_type_reference"] = 194] = "Cannot_resolve_return_type_reference";
        DiagnosticCode[DiagnosticCode["Constructors_cannot_have_a_return_type_of__void_"] = 195] = "Constructors_cannot_have_a_return_type_of__void_";
        DiagnosticCode[DiagnosticCode["Subsequent_variable_declarations_must_have_the_same_type___Variable__0__must_be_of_type__1___but_here_has_type___2_"] = 196] = "Subsequent_variable_declarations_must_have_the_same_type___Variable__0__must_be_of_type__1___but_here_has_type___2_";
        DiagnosticCode[DiagnosticCode["All_symbols_within_a__with__block_will_be_resolved_to__any__"] = 197] = "All_symbols_within_a__with__block_will_be_resolved_to__any__";
        DiagnosticCode[DiagnosticCode["Import_declarations_in_an_internal_module_cannot_reference_an_external_module"] = 198] = "Import_declarations_in_an_internal_module_cannot_reference_an_external_module";
        DiagnosticCode[DiagnosticCode["Class__0__declares_interface__1__but_does_not_implement_it__NL__2"] = 199] = "Class__0__declares_interface__1__but_does_not_implement_it__NL__2";
        DiagnosticCode[DiagnosticCode["Class__0__declares_class__1__but_does_not_implement_it__NL__2"] = 200] = "Class__0__declares_class__1__but_does_not_implement_it__NL__2";
        DiagnosticCode[DiagnosticCode["The_operand_of_an_increment_or_decrement_operator_must_be_a_variable__property_or_indexer"] = 201] = "The_operand_of_an_increment_or_decrement_operator_must_be_a_variable__property_or_indexer";
        DiagnosticCode[DiagnosticCode["_this__cannot_be_referenced_in_initializers_in_a_class_body"] = 202] = "_this__cannot_be_referenced_in_initializers_in_a_class_body";
        DiagnosticCode[DiagnosticCode["Class__0__cannot_extend_class__1__NL__2"] = 203] = "Class__0__cannot_extend_class__1__NL__2";
        DiagnosticCode[DiagnosticCode["Interface__0__cannot_extend_class__1__NL__2"] = 204] = "Interface__0__cannot_extend_class__1__NL__2";
        DiagnosticCode[DiagnosticCode["Interface__0__cannot_extend_interface__1__NL__2"] = 205] = "Interface__0__cannot_extend_interface__1__NL__2";
        DiagnosticCode[DiagnosticCode["Duplicate_overload_signature_for__0_"] = 206] = "Duplicate_overload_signature_for__0_";
        DiagnosticCode[DiagnosticCode["Duplicate_constructor_overload_signature"] = 207] = "Duplicate_constructor_overload_signature";
        DiagnosticCode[DiagnosticCode["Duplicate_overload_call_signature"] = 208] = "Duplicate_overload_call_signature";
        DiagnosticCode[DiagnosticCode["Duplicate_overload_construct_signature"] = 209] = "Duplicate_overload_construct_signature";
        DiagnosticCode[DiagnosticCode["Overload_signature_is_not_compatible_with_function_definition"] = 210] = "Overload_signature_is_not_compatible_with_function_definition";
        DiagnosticCode[DiagnosticCode["Overload_signature_is_not_compatible_with_function_definition__NL__0"] = 211] = "Overload_signature_is_not_compatible_with_function_definition__NL__0";
        DiagnosticCode[DiagnosticCode["Overload_signatures_must_all_be_public_or_private"] = 212] = "Overload_signatures_must_all_be_public_or_private";
        DiagnosticCode[DiagnosticCode["Overload_signatures_must_all_be_exported_or_local"] = 213] = "Overload_signatures_must_all_be_exported_or_local";
        DiagnosticCode[DiagnosticCode["Overload_signatures_must_all_be_ambient_or_non_ambient"] = 214] = "Overload_signatures_must_all_be_ambient_or_non_ambient";
        DiagnosticCode[DiagnosticCode["Overload_signatures_must_all_be_optional_or_required"] = 215] = "Overload_signatures_must_all_be_optional_or_required";
        DiagnosticCode[DiagnosticCode["Specialized_overload_signature_is_not_subtype_of_any_non_specialized_signature"] = 216] = "Specialized_overload_signature_is_not_subtype_of_any_non_specialized_signature";
        DiagnosticCode[DiagnosticCode["_this__cannot_be_referenced_in_constructor_arguments"] = 217] = "_this__cannot_be_referenced_in_constructor_arguments";
        DiagnosticCode[DiagnosticCode["Static_member_cannot_be_accessed_off_an_instance_variable"] = 218] = "Static_member_cannot_be_accessed_off_an_instance_variable";
        DiagnosticCode[DiagnosticCode["Instance_member_cannot_be_accessed_off_a_class"] = 219] = "Instance_member_cannot_be_accessed_off_a_class";
        DiagnosticCode[DiagnosticCode["Untyped_function_calls_may_not_accept_type_arguments"] = 220] = "Untyped_function_calls_may_not_accept_type_arguments";
        DiagnosticCode[DiagnosticCode["Non_generic_functions_may_not_accept_type_arguments"] = 221] = "Non_generic_functions_may_not_accept_type_arguments";
        DiagnosticCode[DiagnosticCode["A_generic_type_may_not_reference_itself_with_its_own_type_parameters"] = 222] = "A_generic_type_may_not_reference_itself_with_its_own_type_parameters";
        DiagnosticCode[DiagnosticCode["Static_methods_cannot_reference_class_type_parameters"] = 223] = "Static_methods_cannot_reference_class_type_parameters";
        DiagnosticCode[DiagnosticCode["Value_of_type__0__is_not_callable__Did_you_mean_to_include__new___"] = 224] = "Value_of_type__0__is_not_callable__Did_you_mean_to_include__new___";
        DiagnosticCode[DiagnosticCode["Rest_parameters_must_be_array_types"] = 225] = "Rest_parameters_must_be_array_types";
        DiagnosticCode[DiagnosticCode["Overload_signature_implementation_cannot_use_specialized_type"] = 226] = "Overload_signature_implementation_cannot_use_specialized_type";

        DiagnosticCode[DiagnosticCode["Type__0__is_missing_property__1__from_type__2_"] = 227] = "Type__0__is_missing_property__1__from_type__2_";
        DiagnosticCode[DiagnosticCode["Types_of_property__0__of_types__1__and__2__are_incompatible"] = 228] = "Types_of_property__0__of_types__1__and__2__are_incompatible";
        DiagnosticCode[DiagnosticCode["Types_of_property__0__of_types__1__and__2__are_incompatible__NL__3"] = 229] = "Types_of_property__0__of_types__1__and__2__are_incompatible__NL__3";
        DiagnosticCode[DiagnosticCode["Property__0__defined_as_private_in_type__1__is_defined_as_public_in_type__2_"] = 230] = "Property__0__defined_as_private_in_type__1__is_defined_as_public_in_type__2_";
        DiagnosticCode[DiagnosticCode["Property__0__defined_as_public_in_type__1__is_defined_as_private_in_type__2_"] = 231] = "Property__0__defined_as_public_in_type__1__is_defined_as_private_in_type__2_";
        DiagnosticCode[DiagnosticCode["Types__0__and__1__define_property__2__as_private"] = 232] = "Types__0__and__1__define_property__2__as_private";
        DiagnosticCode[DiagnosticCode["Call_signatures_of_types__0__and__1__are_incompatible"] = 233] = "Call_signatures_of_types__0__and__1__are_incompatible";
        DiagnosticCode[DiagnosticCode["Call_signatures_of_types__0__and__1__are_incompatible__NL__2"] = 234] = "Call_signatures_of_types__0__and__1__are_incompatible__NL__2";
        DiagnosticCode[DiagnosticCode["Type__0__requires_a_call_signature__but_Type__1__lacks_one"] = 235] = "Type__0__requires_a_call_signature__but_Type__1__lacks_one";
        DiagnosticCode[DiagnosticCode["Construct_signatures_of_types__0__and__1__are_incompatible"] = 236] = "Construct_signatures_of_types__0__and__1__are_incompatible";
        DiagnosticCode[DiagnosticCode["Construct_signatures_of_types__0__and__1__are_incompatible__NL__2"] = 237] = "Construct_signatures_of_types__0__and__1__are_incompatible__NL__2";
        DiagnosticCode[DiagnosticCode["Type__0__requires_a_construct_signature__but_Type__1__lacks_one"] = 238] = "Type__0__requires_a_construct_signature__but_Type__1__lacks_one";
        DiagnosticCode[DiagnosticCode["Index_signatures_of_types__0__and__1__are_incompatible"] = 239] = "Index_signatures_of_types__0__and__1__are_incompatible";
        DiagnosticCode[DiagnosticCode["Index_signatures_of_types__0__and__1__are_incompatible__NL__2"] = 240] = "Index_signatures_of_types__0__and__1__are_incompatible__NL__2";
        DiagnosticCode[DiagnosticCode["Call_signature_expects__0__or_fewer_parameters"] = 241] = "Call_signature_expects__0__or_fewer_parameters";
        DiagnosticCode[DiagnosticCode["Could_not_apply_type__0__to_argument__1__which_is_of_type__2_"] = 242] = "Could_not_apply_type__0__to_argument__1__which_is_of_type__2_";
        DiagnosticCode[DiagnosticCode["Class__0__defines_instance_member_accessor__1___but_extended_class__2__defines_it_as_instance_member_function"] = 243] = "Class__0__defines_instance_member_accessor__1___but_extended_class__2__defines_it_as_instance_member_function";
        DiagnosticCode[DiagnosticCode["Class__0__defines_instance_member_property__1___but_extended_class__2__defines_it_as_instance_member_function"] = 244] = "Class__0__defines_instance_member_property__1___but_extended_class__2__defines_it_as_instance_member_function";
        DiagnosticCode[DiagnosticCode["Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_accessor"] = 245] = "Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_accessor";
        DiagnosticCode[DiagnosticCode["Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_property"] = 246] = "Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_property";
        DiagnosticCode[DiagnosticCode["Types_of_static_property__0__of_class__1__and_class__2__are_incompatible"] = 247] = "Types_of_static_property__0__of_class__1__and_class__2__are_incompatible";
        DiagnosticCode[DiagnosticCode["Types_of_static_property__0__of_class__1__and_class__2__are_incompatible__NL__3"] = 248] = "Types_of_static_property__0__of_class__1__and_class__2__are_incompatible__NL__3";

        DiagnosticCode[DiagnosticCode["Current_host_does_not_support__w_atch_option"] = 249] = "Current_host_does_not_support__w_atch_option";
        DiagnosticCode[DiagnosticCode["ECMAScript_target_version__0__not_supported___Using_default__1__code_generation"] = 250] = "ECMAScript_target_version__0__not_supported___Using_default__1__code_generation";
        DiagnosticCode[DiagnosticCode["Module_code_generation__0__not_supported___Using_default__1__code_generation"] = 251] = "Module_code_generation__0__not_supported___Using_default__1__code_generation";
        DiagnosticCode[DiagnosticCode["Could_not_find_file___0_"] = 252] = "Could_not_find_file___0_";
        DiagnosticCode[DiagnosticCode["Unknown_extension_for_file___0__Only__ts_and_d_ts_extensions_are_allowed"] = 253] = "Unknown_extension_for_file___0__Only__ts_and_d_ts_extensions_are_allowed";
        DiagnosticCode[DiagnosticCode["A_file_cannot_have_a_reference_itself"] = 254] = "A_file_cannot_have_a_reference_itself";
        DiagnosticCode[DiagnosticCode["Cannot_resolve_referenced_file___0_"] = 255] = "Cannot_resolve_referenced_file___0_";
        DiagnosticCode[DiagnosticCode["Cannot_resolve_imported_file___0_"] = 256] = "Cannot_resolve_imported_file___0_";
        DiagnosticCode[DiagnosticCode["Cannot_find_the_common_subdirectory_path_for_the_input_files"] = 257] = "Cannot_find_the_common_subdirectory_path_for_the_input_files";
        DiagnosticCode[DiagnosticCode["Cannot_compile_dynamic_modules_when_emitting_into_single_file"] = 258] = "Cannot_compile_dynamic_modules_when_emitting_into_single_file";
        DiagnosticCode[DiagnosticCode["Emit_Error__0"] = 259] = "Emit_Error__0";
    })(TypeScript.DiagnosticCode || (TypeScript.DiagnosticCode = {}));
    var DiagnosticCode = TypeScript.DiagnosticCode;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    TypeScript.diagnosticMessages = {
        error_TS_0__1: {
            category: 3 /* NoPrefix */,
            message: "error TS{0}: {1}",
            code: 0
        },
        warning_TS_0__1: {
            category: 3 /* NoPrefix */,
            message: "warning TS{0}: {1}",
            code: 1
        },
        _0__NL__1_TB__2: {
            category: 3 /* NoPrefix */,
            message: "{0}{NL}{{1}TB}{2}",
            code: 21
        },
        _0_TB__1: {
            category: 3 /* NoPrefix */,
            message: "{{0}TB}{1}",
            code: 22
        },
        Unrecognized_escape_sequence: {
            category: 1 /* Error */,
            message: "Unrecognized escape sequence.",
            code: 1000
        },
        Unexpected_character_0: {
            category: 1 /* Error */,
            message: "Unexpected character {0}.",
            code: 1001
        },
        Missing_closing_quote_character: {
            category: 1 /* Error */,
            message: "Missing close quote character.",
            code: 1002
        },
        Identifier_expected: {
            category: 1 /* Error */,
            message: "Identifier expected.",
            code: 1003
        },
        _0_keyword_expected: {
            category: 1 /* Error */,
            message: "'{0}' keyword expected.",
            code: 1004
        },
        _0_expected: {
            category: 1 /* Error */,
            message: "'{0}' expected.",
            code: 1005
        },
        Identifier_expected__0__is_a_keyword: {
            category: 1 /* Error */,
            message: "Identifier expected; '{0}' is a keyword.",
            code: 1006
        },
        Automatic_semicolon_insertion_not_allowed: {
            category: 1 /* Error */,
            message: "Automatic semicolon insertion not allowed.",
            code: 1007
        },
        Unexpected_token__0_expected: {
            category: 1 /* Error */,
            message: "Unexpected token; '{0}' expected.",
            code: 1008
        },
        Trailing_separator_not_allowed: {
            category: 1 /* Error */,
            message: "Trailing separator not allowed.",
            code: 1009
        },
        _StarSlash__expected: {
            category: 1 /* Error */,
            message: "'*/' expected.",
            code: 1010
        },
        _public_or_private_modifier_must_precede__static_: {
            category: 1 /* Error */,
            message: "'public' or 'private' modifier must precede 'static'.",
            code: 1011
        },
        Unexpected_token_: {
            category: 1 /* Error */,
            message: "Unexpected token.",
            code: 1012
        },
        A_catch_clause_variable_cannot_have_a_type_annotation: {
            category: 1 /* Error */,
            message: "A catch clause variable cannot have a type annotation.",
            code: 1013
        },
        Rest_parameter_must_be_last_in_list: {
            category: 1 /* Error */,
            message: "Rest parameter must be last in list.",
            code: 1014
        },
        Parameter_cannot_have_question_mark_and_initializer: {
            category: 1 /* Error */,
            message: "Parameter cannot have question mark and initializer.",
            code: 1015
        },
        Required_parameter_cannot_follow_optional_parameter: {
            category: 1 /* Error */,
            message: "Required parameter cannot follow optional parameter.",
            code: 1016
        },
        Index_signatures_cannot_have_rest_parameters: {
            category: 1 /* Error */,
            message: "Index signatures cannot have rest parameters.",
            code: 1017
        },
        Index_signature_parameter_cannot_have_accessibility_modifiers: {
            category: 1 /* Error */,
            message: "Index signature parameter cannot have accessibility modifiers.",
            code: 1018
        },
        Index_signature_parameter_cannot_have_a_question_mark: {
            category: 1 /* Error */,
            message: "Index signature parameter cannot have a question mark.",
            code: 1019
        },
        Index_signature_parameter_cannot_have_an_initializer: {
            category: 1 /* Error */,
            message: "Index signature parameter cannot have an initializer.",
            code: 1020
        },
        Index_signature_must_have_a_type_annotation: {
            category: 1 /* Error */,
            message: "Index signature must have a type annotation.",
            code: 1021
        },
        Index_signature_parameter_must_have_a_type_annotation: {
            category: 1 /* Error */,
            message: "Index signature parameter must have a type annotation.",
            code: 1022
        },
        Index_signature_parameter_type_must_be__string__or__number_: {
            category: 1 /* Error */,
            message: "Index signature parameter type must be 'string' or 'number'.",
            code: 1023
        },
        _extends__clause_already_seen: {
            category: 1 /* Error */,
            message: "'extends' clause already seen.",
            code: 1024
        },
        _extends__clause_must_precede__implements__clause: {
            category: 1 /* Error */,
            message: "'extends' clause must precede 'implements' clause.",
            code: 1025
        },
        Class_can_only_extend_single_type: {
            category: 1 /* Error */,
            message: "Class can only extend single type.",
            code: 1026
        },
        _implements__clause_already_seen: {
            category: 1 /* Error */,
            message: "'implements' clause already seen.",
            code: 1027
        },
        Accessibility_modifier_already_seen: {
            category: 1 /* Error */,
            message: "Accessibility modifier already seen.",
            code: 1028
        },
        _0__modifier_must_precede__1__modifier: {
            category: 1 /* Error */,
            message: "'{0}' modifier must precede '{1}' modifier.",
            code: 1029
        },
        _0__modifier_already_seen: {
            category: 1 /* Error */,
            message: "'{0}' modifier already seen.",
            code: 1030
        },
        _0__modifier_cannot_appear_on_a_class_element: {
            category: 1 /* Error */,
            message: "'{0}' modifier cannot appear on a class element.",
            code: 1031
        },
        Interface_declaration_cannot_have__implements__clause: {
            category: 1 /* Error */,
            message: "Interface declaration cannot have 'implements' clause.",
            code: 1032
        },
        _super__invocation_cannot_have_type_arguments: {
            category: 1 /* Error */,
            message: "'super' invocation cannot have type arguments.",
            code: 1034
        },
        Non_ambient_modules_cannot_use_quoted_names: {
            category: 1 /* Error */,
            message: "Non ambient modules cannot use quoted names.",
            code: 1035
        },
        Statements_are_not_allowed_in_ambient_contexts: {
            category: 1 /* Error */,
            message: "Statements are not allowed in ambient contexts.",
            code: 1036
        },
        Implementations_are_not_allowed_in_ambient_contexts: {
            category: 1 /* Error */,
            message: "Implementations are not allowed in ambient contexts.",
            code: 1037
        },
        _declare__modifier_not_allowed_for_code_already_in_an_ambient_context: {
            category: 1 /* Error */,
            message: "'declare' modifier not allowed for code already in an ambient context.",
            code: 1038
        },
        Initializers_are_not_allowed_in_ambient_contexts: {
            category: 1 /* Error */,
            message: "Initializers are not allowed in ambient contexts.",
            code: 1039
        },
        Overload_and_ambient_signatures_cannot_specify_parameter_properties: {
            category: 1 /* Error */,
            message: "Overload and ambient signatures cannot specify parameter properties.",
            code: 1040
        },
        Function_implementation_expected: {
            category: 1 /* Error */,
            message: "Function implementation expected.",
            code: 1041
        },
        Constructor_implementation_expected: {
            category: 1 /* Error */,
            message: "Constructor implementation expected.",
            code: 1042
        },
        Function_overload_name_must_be__0_: {
            category: 1 /* Error */,
            message: "Function overload name must be '{0}'.",
            code: 1043
        },
        _0__modifier_cannot_appear_on_a_module_element: {
            category: 1 /* Error */,
            message: "'{0}' modifier cannot appear on a module element.",
            code: 1044
        },
        _declare__modifier_cannot_appear_on_an_interface_declaration: {
            category: 1 /* Error */,
            message: "'declare' modifier cannot appear on an interface declaration.",
            code: 1045
        },
        _declare__modifier_required_for_top_level_element: {
            category: 1 /* Error */,
            message: "'declare' modifier required for top level element.",
            code: 1046
        },
        Rest_parameter_cannot_be_optional: {
            category: 1 /* Error */,
            message: "Rest parameter cannot be optional.",
            code: 1047
        },
        Rest_parameter_cannot_have_initializer: {
            category: 1 /* Error */,
            message: "Rest parameter cannot have initializer.",
            code: 1048
        },
        _set__accessor_must_have_only_one_parameter: {
            category: 1 /* Error */,
            message: "'set' accessor must have one and only one parameter.",
            code: 1049
        },
        _set__accessor_parameter_cannot_have_accessibility_modifier: {
            category: 1 /* Error */,
            message: "'set' accessor parameter cannot have accessibility modifier.",
            code: 1050
        },
        _set__accessor_parameter_cannot_be_optional: {
            category: 1 /* Error */,
            message: "'set' accessor parameter cannot be optional.",
            code: 1051
        },
        _set__accessor_parameter_cannot_have_initializer: {
            category: 1 /* Error */,
            message: "'set' accessor parameter cannot have initializer.",
            code: 1052
        },
        _set__accessor_cannot_have_rest_parameter: {
            category: 1 /* Error */,
            message: "'set' accessor cannot have rest parameter.",
            code: 1053
        },
        _get__accessor_cannot_have_parameters: {
            category: 1 /* Error */,
            message: "'get' accessor cannot have parameters.",
            code: 1054
        },
        Modifiers_cannot_appear_here: {
            category: 1 /* Error */,
            message: "Modifiers cannot appear here.",
            code: 1055
        },
        Accessors_are_only_available_when_targeting_EcmaScript5_and_higher: {
            category: 1 /* Error */,
            message: "Accessors are only when targeting EcmaScript5 and higher.",
            code: 1056
        },
        Class_name_cannot_be__0_: {
            category: 1 /* Error */,
            message: "Class name cannot be '{0}'.",
            code: 1057
        },
        Interface_name_cannot_be__0_: {
            category: 1 /* Error */,
            message: "Interface name cannot be '{0}'.",
            code: 1058
        },
        Enum_name_cannot_be__0_: {
            category: 1 /* Error */,
            message: "Enum name cannot be '{0}'.",
            code: 1059
        },
        Module_name_cannot_be__0_: {
            category: 1 /* Error */,
            message: "Module name cannot be '{0}'.",
            code: 1060
        },
        Enum_member_must_have_initializer: {
            category: 1 /* Error */,
            message: "Enum member must have initializer.",
            code: 1061
        },
        _module_______is_deprecated___Use__require_______instead: {
            category: 1 /* Error */,
            message: "'module(...)' is deprecated.  Use 'require(...)' instead.",
            code: 1062
        },
        Duplicate_identifier__0_: {
            category: 1 /* Error */,
            message: "Duplicate identifier '{0}'.",
            code: 2000
        },
        The_name__0__does_not_exist_in_the_current_scope: {
            category: 1 /* Error */,
            message: "The name '{0}' does not exist in the current scope.",
            code: 2001
        },
        The_name__0__does_not_refer_to_a_value: {
            category: 1 /* Error */,
            message: "The name '{0}' does not refer to a value.",
            code: 2002
        },
        Keyword__super__can_only_be_used_inside_a_class_instance_method: {
            category: 1 /* Error */,
            message: "Keyword 'super' can only be used inside a class instance method.",
            code: 2003
        },
        The_left_hand_side_of_an_assignment_expression_must_be_a_variable__property_or_indexer: {
            category: 1 /* Error */,
            message: "The left-hand side of an assignment expression must be a variable, property or indexer.",
            code: 2004
        },
        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new__: {
            category: 1 /* Error */,
            message: "Value of type '{0}' is not callable. Did you mean to include 'new'?",
            code: 2005
        },
        Value_of_type__0__is_not_callable: {
            category: 1 /* Error */,
            message: "Value of type '{0}' is not callable.",
            code: 2006
        },
        Value_of_type__0__is_not_newable: {
            category: 1 /* Error */,
            message: "Value of type '{0}' is not newable.",
            code: 2007
        },
        Value_of_type__0__is_not_indexable_by_type__1_: {
            category: 1 /* Error */,
            message: "Value of type '{0}' is not indexable by type '{1}'.",
            code: 2008
        },
        Operator__0__cannot_be_applied_to_types__1__and__2_: {
            category: 1 /* Error */,
            message: "Operator '{0}' cannot be applied to types '{1}' and '{2}'.",
            code: 2009
        },
        Operator__0__cannot_be_applied_to_types__1__and__2__3: {
            category: 1 /* Error */,
            message: "Operator '{0}' cannot be applied to types '{1}' and '{2}': {3}",
            code: 2010
        },
        Cannot_convert__0__to__1_: {
            category: 1 /* Error */,
            message: "Cannot convert '{0}' to '{1}'.",
            code: 2011
        },
        Cannot_convert__0__to__1__NL__2: {
            category: 1 /* Error */,
            message: "Cannot convert '{0}' to '{1}':{NL}{2}",
            code: 2012
        },
        Expected_var__class__interface__or_module: {
            category: 1 /* Error */,
            message: "Expected var, class, interface, or module.",
            code: 2013
        },
        Operator__0__cannot_be_applied_to_type__1_: {
            category: 1 /* Error */,
            message: "Operator '{0}' cannot be applied to type '{1}'.",
            code: 2014
        },
        Getter__0__already_declared: {
            category: 1 /* Error */,
            message: "Getter '{0}' already declared.",
            code: 2015
        },
        Setter__0__already_declared: {
            category: 1 /* Error */,
            message: "Setter '{0}' already declared.",
            code: 2016
        },
        Accessor_cannot_have_type_parameters: {
            category: 1 /* Error */,
            message: "Accessors cannot have type parameters.",
            code: 2017
        },
        Exported_class__0__extends_private_class__1_: {
            category: 1 /* Error */,
            message: "Exported class '{0}' extends private class '{1}'.",
            code: 2018
        },
        Exported_class__0__implements_private_interface__1_: {
            category: 1 /* Error */,
            message: "Exported class '{0}' implements private interface '{1}'.",
            code: 2019
        },
        Exported_interface__0__extends_private_interface__1_: {
            category: 1 /* Error */,
            message: "Exported interface '{0}' extends private interface '{1}'.",
            code: 2020
        },
        Exported_class__0__extends_class_from_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Exported class '{0}' extends class from inaccessible module {1}.",
            code: 2021
        },
        Exported_class__0__implements_interface_from_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Exported class '{0}' implements interface from inaccessible module {1}.",
            code: 2022
        },
        Exported_interface__0__extends_interface_from_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Exported interface '{0}' extends interface from inaccessible module {1}.",
            code: 2023
        },
        Public_static_property__0__of__exported_class_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Public static property '{0}' of exported class has or is using private type '{1}'.",
            code: 2024
        },
        Public_property__0__of__exported_class_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Public property '{0}' of exported class has or is using private type '{1}'.",
            code: 2025
        },
        Property__0__of__exported_interface_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Property '{0}' of exported interface has or is using private type '{1}'.",
            code: 2026
        },
        Exported_variable__0__has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Exported variable '{0}' has or is using private type '{1}'.",
            code: 2027
        },
        Public_static_property__0__of__exported_class_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Public static property '{0}' of exported class is using inaccessible module {1}.",
            code: 2028
        },
        Public_property__0__of__exported_class_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Public property '{0}' of exported class is using inaccessible module {1}.",
            code: 2029
        },
        Property__0__of__exported_interface_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Property '{0}' of exported interface is using inaccessible module {1}.",
            code: 2030
        },
        Exported_variable__0__is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Exported variable '{0}' is using inaccessible module {1}.",
            code: 2031
        },
        Parameter__0__of_constructor_from_exported_class_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of constructor from exported class has or is using private type '{1}'.",
            code: 2032
        },
        Parameter__0__of_public_static_property_setter_from_exported_class_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of public static property setter from exported class has or is using private type '{1}'.",
            code: 2033
        },
        Parameter__0__of_public_property_setter_from_exported_class_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of public property setter from exported class has or is using private type '{1}'.",
            code: 2034
        },
        Parameter__0__of_constructor_signature_from_exported_interface_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of constructor signature from exported interface has or is using private type '{1}'.",
            code: 2035
        },
        Parameter__0__of_call_signature_from_exported_interface_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of call signature from exported interface has or is using private type '{1}'.",
            code: 2036
        },
        Parameter__0__of_public_static_method_from_exported_class_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of public static method from exported class has or is using private type '{1}'.",
            code: 2037
        },
        Parameter__0__of_public_method_from_exported_class_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of public method from exported class has or is using private type '{1}'.",
            code: 2038
        },
        Parameter__0__of_method_from_exported_interface_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of method from exported interface has or is using private type '{1}'.",
            code: 2039
        },
        Parameter__0__of_exported_function_has_or_is_using_private_type__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of exported function has or is using private type '{1}'.",
            code: 2040
        },
        Parameter__0__of_constructor_from_exported_class_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of constructor from exported class is using inaccessible module {1}.",
            code: 2041
        },
        Parameter__0__of_public_static_property_setter_from_exported_class_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of public static property setter from exported class is using inaccessible module {1}.",
            code: 2042
        },
        Parameter__0__of_public_property_setter_from_exported_class_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of public property setter from exported class is using inaccessible module {1}.",
            code: 2043
        },
        Parameter__0__of_constructor_signature_from_exported_interface_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of constructor signature from exported interface is using inaccessible module {1}.",
            code: 2044
        },
        Parameter__0__of_call_signature_from_exported_interface_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of call signature from exported interface is using inaccessible module {1}",
            code: 2045
        },
        Parameter__0__of_public_static_method_from_exported_class_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of public static method from exported class is using inaccessible module {1}.",
            code: 2046
        },
        Parameter__0__of_public_method_from_exported_class_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of public method from exported class is using inaccessible module {1}.",
            code: 2047
        },
        Parameter__0__of_method_from_exported_interface_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of method from exported interface is using inaccessible module {1}.",
            code: 2048
        },
        Parameter__0__of_exported_function_is_using_inaccessible_module__1_: {
            category: 1 /* Error */,
            message: "Parameter '{0}' of exported function is using inaccessible module {1}.",
            code: 2049
        },
        Return_type_of_public_static_property_getter_from_exported_class_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of public static property getter from exported class has or is using private type '{0}'.",
            code: 2050
        },
        Return_type_of_public_property_getter_from_exported_class_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of public property getter from exported class has or is using private type '{0}'.",
            code: 2051
        },
        Return_type_of_constructor_signature_from_exported_interface_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of constructor signature from exported interface has or is using private type '{0}'.",
            code: 2052
        },
        Return_type_of_call_signature_from_exported_interface_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of call signature from exported interface has or is using private type '{0}'.",
            code: 2053
        },
        Return_type_of_index_signature_from_exported_interface_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of index signature from exported interface has or is using private type '{0}'.",
            code: 2054
        },
        Return_type_of_public_static_method_from_exported_class_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of public static method from exported class has or is using private type '{0}'.",
            code: 2055
        },
        Return_type_of_public_method_from_exported_class_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of public method from exported class has or is using private type '{0}'.",
            code: 2056
        },
        Return_type_of_method_from_exported_interface_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of method from exported interface has or is using private type '{0}'.",
            code: 2057
        },
        Return_type_of_exported_function_has_or_is_using_private_type__0_: {
            category: 1 /* Error */,
            message: "Return type of exported function has or is using private type '{0}'.",
            code: 2058
        },
        Return_type_of_public_static_property_getter_from_exported_class_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of public static property getter from exported class is using inaccessible module {0}.",
            code: 2059
        },
        Return_type_of_public_property_getter_from_exported_class_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of public property getter from exported class is using inaccessible module {0}.",
            code: 2060
        },
        Return_type_of_constructor_signature_from_exported_interface_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of constructor signature from exported interface is using inaccessible module {0}.",
            code: 2061
        },
        Return_type_of_call_signature_from_exported_interface_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of call signature from exported interface is using inaccessible module {0}.",
            code: 2062
        },
        Return_type_of_index_signature_from_exported_interface_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of index signature from exported interface is using inaccessible module {0}.",
            code: 2063
        },
        Return_type_of_public_static_method_from_exported_class_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of public static method from exported class is using inaccessible module {0}.",
            code: 2064
        },
        Return_type_of_public_method_from_exported_class_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of public method from exported class is using inaccessible module {0}.",
            code: 2065
        },
        Return_type_of_method_from_exported_interface_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of method from exported interface is using inaccessible module {0}.",
            code: 2066
        },
        Return_type_of_exported_function_is_using_inaccessible_module__0_: {
            category: 1 /* Error */,
            message: "Return type of exported function is using inaccessible module {0}.",
            code: 2067
        },
        _new_T____cannot_be_used_to_create_an_array__Use__new_Array_T_____instead: {
            category: 1 /* Error */,
            message: "'new T[]' cannot be used to create an array. Use 'new Array<T>()' instead.",
            code: 2068
        },
        A_parameter_list_must_follow_a_generic_type_argument_list______expected: {
            category: 1 /* Error */,
            message: "A parameter list must follow a generic type argument list. '(' expected.",
            code: 2069
        },
        Multiple_constructor_implementations_are_not_allowed: {
            category: 1 /* Error */,
            message: "Multiple constructor implementations are not allowed.",
            code: 2070
        },
        Unable_to_resolve_external_module__0_: {
            category: 1 /* Error */,
            message: "Unable to resolve external module '{0}'.",
            code: 2071
        },
        Module_cannot_be_aliased_to_a_non_module_type: {
            category: 1 /* Error */,
            message: "Module cannot be aliased to a non-module type.",
            code: 2072
        },
        A_class_may_only_extend_another_class: {
            category: 1 /* Error */,
            message: "A class may only extend another class.",
            code: 2073
        },
        A_class_may_only_implement_another_class_or_interface: {
            category: 1 /* Error */,
            message: "A class may only implement another class or interface.",
            code: 2074
        },
        An_interface_may_only_extend_another_class_or_interface: {
            category: 1 /* Error */,
            message: "An interface may only extend another class or interface.",
            code: 2075
        },
        An_interface_cannot_implement_another_type: {
            category: 1 /* Error */,
            message: "An interface cannot implement another type.",
            code: 2076
        },
        Unable_to_resolve_type: {
            category: 1 /* Error */,
            message: "Unable to resolve type.",
            code: 2077
        },
        Unable_to_resolve_type_of__0_: {
            category: 1 /* Error */,
            message: "Unable to resolve type of '{0}'.",
            code: 2078
        },
        Unable_to_resolve_type_parameter_constraint: {
            category: 1 /* Error */,
            message: "Unable to resolve type parameter constraint.",
            code: 2079
        },
        Type_parameter_constraint_cannot_be_a_primitive_type: {
            category: 1 /* Error */,
            message: "Type parameter constraint cannot be a primitive type.",
            code: 2080
        },
        Supplied_parameters_do_not_match_any_signature_of_call_target: {
            category: 1 /* Error */,
            message: "Supplied parameters do not match any signature of call target.",
            code: 2081
        },
        Supplied_parameters_do_not_match_any_signature_of_call_target__NL__0: {
            category: 1 /* Error */,
            message: "Supplied parameters do not match any signature of call target:{NL}{0}",
            code: 2082
        },
        Invalid__new__expression: {
            category: 1 /* Error */,
            message: "Invalid 'new' expression.",
            code: 2083
        },
        Call_signatures_used_in_a__new__expression_must_have_a__void__return_type: {
            category: 1 /* Error */,
            message: "Call sigantures used in a 'new' expression must have a 'void' return type.",
            code: 2084
        },
        Could_not_select_overload_for__new__expression: {
            category: 1 /* Error */,
            message: "Could not select overload for 'new' expression.",
            code: 2085
        },
        Type__0__does_not_satisfy_the_constraint__1__for_type_parameter__2_: {
            category: 1 /* Error */,
            message: "Type '{0}' does not satisfy the constraint '{1}' for type parameter '{2}'.",
            code: 2086
        },
        Could_not_select_overload_for__call__expression: {
            category: 1 /* Error */,
            message: "Could not select overload for 'call' expression.",
            code: 2087
        },
        Unable_to_invoke_type_with_no_call_signatures: {
            category: 1 /* Error */,
            message: "Unable to invoke type with no call signatures.",
            code: 2088
        },
        Calls_to__super__are_only_valid_inside_a_class: {
            category: 1 /* Error */,
            message: "Calls to 'super' are only valid inside a class.",
            code: 2089
        },
        Generic_type__0__requires_1_type_argument_s_: {
            category: 1 /* Error */,
            message: "Generic type '{0}' requires {1} type argument(s).",
            code: 2090
        },
        Type_of_conditional_expression_cannot_be_determined__Best_common_type_could_not_be_found_between__0__and__1_: {
            category: 1 /* Error */,
            message: "Type of conditional expression cannot be determined. Best common type could not be found between '{0}' and '{1}'.",
            code: 2091
        },
        Type_of_array_literal_cannot_be_determined__Best_common_type_could_not_be_found_for_array_elements: {
            category: 1 /* Error */,
            message: "Type of array literal cannot be determined. Best common type could not be found for array elements.",
            code: 2092
        },
        Could_not_find_enclosing_symbol_for_dotted_name__0_: {
            category: 1 /* Error */,
            message: "Could not find enclosing symbol for dotted name '{0}'.",
            code: 2093
        },
        The_property__0__does_not_exist_on_value_of_type__1__: {
            category: 1 /* Error */,
            message: "The property '{0}' does not exist on value of type '{1}'.",
            code: 2094
        },
        Could_not_find_symbol__0_: {
            category: 1 /* Error */,
            message: "Could not find symbol '{0}'.",
            code: 2095
        },
        _get__and__set__accessor_must_have_the_same_type: {
            category: 1 /* Error */,
            message: "'get' and 'set' accessor must have the same type.",
            code: 2096
        },
        _this__cannot_be_referenced_in_current_location: {
            category: 1 /* Error */,
            message: "'this' cannot be referenced in current location.",
            code: 2097
        },
        Use_of_deprecated__bool__type__Use__boolean__instead: {
            category: 0 /* Warning */,
            message: "Use of deprecated type 'bool'. Use 'boolean' instead.",
            code: 2098
        },
        Static_methods_cannot_reference_class_type_parameters: {
            category: 1 /* Error */,
            message: "Static methods cannot reference class type parameters.",
            code: 2099
        },
        Class__0__is_recursively_referenced_as_a_base_type_of_itself: {
            category: 1 /* Error */,
            message: "Class '{0}' is recursively referenced as a base type of itself.",
            code: 2100
        },
        Interface__0__is_recursively_referenced_as_a_base_type_of_itself: {
            category: 1 /* Error */,
            message: "Interface '{0}' is recursively referenced as a base type of itself.",
            code: 2101
        },
        _super__property_access_is_permitted_only_in_a_constructor__instance_member_function__or_instance_member_accessor_of_a_derived_class: {
            category: 1 /* Error */,
            message: "'super' property access is permitted only in a constructor, instance member function, or instance member accessor of a derived class.",
            code: 2102
        },
        _super__cannot_be_referenced_in_non_derived_classes: {
            category: 1 /* Error */,
            message: "'super' cannot be referenced in non-derived classes.",
            code: 2103
        },
        A__super__call_must_be_the_first_statement_in_the_constructor_when_a_class_contains_intialized_properties_or_has_parameter_properties: {
            category: 1 /* Error */,
            message: "A 'super' call must be the first statement in the constructor when a class contains initialized properties or has parameter properties.",
            code: 2104
        },
        Constructors_for_derived_classes_must_contain_a__super__call: {
            category: 1 /* Error */,
            message: "Constructors for derived classes must contain a 'super' call.",
            code: 2105
        },
        Super_calls_are_not_permitted_outside_constructors_or_in_local_functions_inside_constructors: {
            category: 1 /* Error */,
            message: "Super calls are not permitted outside constructors or in local functions inside constructors.",
            code: 2106
        },
        _0_1__is_inaccessible: {
            category: 1 /* Error */,
            message: "'{0}.{1}' is inaccessible.",
            code: 2107
        },
        _this__cannot_be_referenced_within_module_bodies: {
            category: 1 /* Error */,
            message: "'this' cannot be referenced within module bodies.",
            code: 2108
        },
        _this__must_only_be_used_inside_a_function_or_script_context: {
            category: 1 /* Error */,
            message: "'this' must only be used inside a function or script context.",
            code: 2109
        },
        Invalid__addition__expression___types_do_not_agree: {
            category: 1 /* Error */,
            message: "Invalid '+' expression - types not known to support the addition operator.",
            code: 2111
        },
        The_right_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type: {
            category: 1 /* Error */,
            message: "The right-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.",
            code: 2112
        },
        The_left_hand_side_of_an_arithmetic_operation_must_be_of_type__any____number__or_an_enum_type: {
            category: 1 /* Error */,
            message: "The left-hand side of an arithmetic operation must be of type 'any', 'number' or an enum type.",
            code: 2113
        },
        The_type_of_a_unary_arithmetic_operation_operand_must_be_of_type__any____number__or_an_enum_type: {
            category: 1 /* Error */,
            message: "The type of a unary arithmetic operation operand must be of type 'any', 'number' or an enum type.",
            code: 2114
        },
        Variable_declarations_for_for_in_expressions_cannot_contain_a_type_annotation: {
            category: 1 /* Error */,
            message: "Variable declarations for for/in expressions cannot contain a type annotation.",
            code: 2115
        },
        Variable_declarations_for_for_in_expressions_must_be_of_types__string__or__any_: {
            category: 1 /* Error */,
            message: "Variable declarations for for/in expressions must be of types 'string' or 'any'.",
            code: 2116
        },
        The_right_operand_of_a_for_in_expression_must_be_of_type__any____an_object_type_or_a_type_parameter: {
            category: 1 /* Error */,
            message: "The right operand of a for/in expression must be of type 'any', an object type or a type parameter.",
            code: 2117
        },
        The_left_hand_side_of_an__in__expression_must_be_of_types__string__or__any_: {
            category: 1 /* Error */,
            message: "The left-hand side of an 'in' expression must be of types 'string' or 'any'.",
            code: 2118
        },
        The_right_hand_side_of_an__in__expression_must_be_of_type__any___an_object_type_or_a_type_parameter: {
            category: 1 /* Error */,
            message: "The right-hand side of an 'in' expression must be of type 'any', an object type or a type parameter.",
            code: 2119
        },
        The_left_hand_side_of_an__instanceOf__expression_must_be_of_type__any___an_object_type_or_a_type_parameter: {
            category: 1 /* Error */,
            message: "The left-hand side of an 'instanceOf' expression must be of type 'any', an object type or a type parameter.",
            code: 2120
        },
        The_right_hand_side_of_an__instanceOf__expression_must_be_of_type__any__or_a_subtype_of_the__Function__interface_type: {
            category: 1 /* Error */,
            message: "The right-hand side of an 'instanceOf' expression must be of type 'any' or a subtype of the 'Function' interface type.",
            code: 2121
        },
        Setters_cannot_return_a_value: {
            category: 1 /* Error */,
            message: "Setters cannot return a value.",
            code: 2122
        },
        Tried_to_set_variable_type_to_uninitialized_module_type: {
            category: 1 /* Error */,
            message: "Tried to set variable type to uninitialized module type.",
            code: 2123
        },
        Tried_to_set_variable_type_to_uninitialized_module_type__0__: {
            category: 1 /* Error */,
            message: "Tried to set variable type to uninitialized module type '{0}'.",
            code: 2124
        },
        Function__0__declared_a_non_void_return_type__but_has_no_return_expression: {
            category: 1 /* Error */,
            message: "Function {0} declared a non-void return type, but has no return expression.",
            code: 2125
        },
        Getters_must_return_a_value: {
            category: 1 /* Error */,
            message: "Getters must return a value.",
            code: 2126
        },
        Getter_and_setter_accessors_do_not_agree_in_visibility: {
            category: 1 /* Error */,
            message: "Getter and setter accessors do not agree in visibility.",
            code: 2127
        },
        Invalid_left_hand_side_of_assignment_expression: {
            category: 1 /* Error */,
            message: "Invalid left-hand side of assignment expression.",
            code: 2130
        },
        Function_declared_a_non_void_return_type__but_has_no_return_expression: {
            category: 1 /* Error */,
            message: "Function declared a non-void return type, but has no return expression.",
            code: 2131
        },
        Cannot_resolve_return_type_reference: {
            category: 1 /* Error */,
            message: "Cannot resolve return type reference.",
            code: 2132
        },
        Constructors_cannot_have_a_return_type_of__void_: {
            category: 1 /* Error */,
            message: "Constructors cannot have a return type of 'void'.",
            code: 2133
        },
        Subsequent_variable_declarations_must_have_the_same_type___Variable__0__must_be_of_type__1___but_here_has_type___2_: {
            category: 1 /* Error */,
            message: "Subsequent variable declarations must have the same type.  Variable '{0}' must be of type '{1}', but here has type '{2}'",
            code: 2134
        },
        All_symbols_within_a__with__block_will_be_resolved_to__any__: {
            category: 1 /* Error */,
            message: "All symbols within a with block will be resolved to 'any'.",
            code: 2135
        },
        Import_declarations_in_an_internal_module_cannot_reference_an_external_module: {
            category: 1 /* Error */,
            message: "Import declarations in an internal module cannot reference an external module.",
            code: 2136
        },
        Class__0__declares_interface__1__but_does_not_implement_it__NL__2: {
            category: 1 /* Error */,
            message: "Class {0} declares interface {1} but does not implement it:{NL}{2}",
            code: 2137
        },
        Class__0__declares_class__1__but_does_not_implement_it__NL__2: {
            category: 1 /* Error */,
            message: "Class {0} declares class {1} as an implemented interface but does not implement it:{NL}{2}",
            code: 2138
        },
        The_operand_of_an_increment_or_decrement_operator_must_be_a_variable__property_or_indexer: {
            category: 1 /* Error */,
            message: "The operand of an increment or decrement operator must be a variable, property or indexer.",
            code: 2139
        },
        _this__cannot_be_referenced_in_initializers_in_a_class_body: {
            category: 1 /* Error */,
            message: "'this' cannot be referenced in initializers in a class body.",
            code: 2140
        },
        Class__0__cannot_extend_class__1__NL__2: {
            category: 1 /* Error */,
            message: "Class '{0}' cannot extend class '{1}':{NL}{2}",
            code: 2141
        },
        Interface__0__cannot_extend_class__1__NL__2: {
            category: 1 /* Error */,
            message: "Interface '{0}' cannot extend class '{1}':{NL}{2}",
            code: 2142
        },
        Interface__0__cannot_extend_interface__1__NL__2: {
            category: 1 /* Error */,
            message: "Interface '{0}' cannot extend interface '{1}':{NL}{2}",
            code: 2143
        },
        Duplicate_overload_signature_for__0_: {
            category: 1 /* Error */,
            message: "Duplicate overload signature for '{0}'.",
            code: 2144
        },
        Duplicate_constructor_overload_signature: {
            category: 1 /* Error */,
            message: "Duplicate constructor overload signature.",
            code: 2145
        },
        Duplicate_overload_call_signature: {
            category: 1 /* Error */,
            message: "Duplicate overload call signature.",
            code: 2146
        },
        Duplicate_overload_construct_signature: {
            category: 1 /* Error */,
            message: "Duplicate overload construct signature.",
            code: 2147
        },
        Overload_signature_is_not_compatible_with_function_definition: {
            category: 1 /* Error */,
            message: "Overload signature is not compatible with function definition.",
            code: 2148
        },
        Overload_signature_is_not_compatible_with_function_definition__NL__0: {
            category: 1 /* Error */,
            message: "Overload signature is not compatible with function definition:{NL}{0}",
            code: 2149
        },
        Overload_signatures_must_all_be_public_or_private: {
            category: 1 /* Error */,
            message: "Overload signatures must all be public or private.",
            code: 2150
        },
        Overload_signatures_must_all_be_exported_or_local: {
            category: 1 /* Error */,
            message: "Overload signatures must all be exported or local.",
            code: 2151
        },
        Overload_signatures_must_all_be_ambient_or_non_ambient: {
            category: 1 /* Error */,
            message: "Overload signatures must all be ambient or non-ambient.",
            code: 2152
        },
        Overload_signatures_must_all_be_optional_or_required: {
            category: 1 /* Error */,
            message: "Overload signatures must all be optional or required.",
            code: 2153
        },
        Specialized_overload_signature_is_not_subtype_of_any_non_specialized_signature: {
            category: 1 /* Error */,
            message: "Specialized overload signature is not subtype of any non-specialized signature.",
            code: 2154
        },
        _this__cannot_be_referenced_in_constructor_arguments: {
            category: 1 /* Error */,
            message: "'this' cannot be referenced in constructor arguments.",
            code: 2155
        },
        Static_member_cannot_be_accessed_off_an_instance_variable: {
            category: 1 /* Error */,
            message: "Static member cannot be accessed off an instance variable.",
            code: 2156
        },
        Instance_member_cannot_be_accessed_off_a_class: {
            category: 1 /* Error */,
            message: "Instance member cannot be accessed off a class.",
            code: 2157
        },
        Untyped_function_calls_may_not_accept_type_arguments: {
            category: 1 /* Error */,
            message: "Untyped function calls may not accept type arguments.",
            code: 2158
        },
        Non_generic_functions_may_not_accept_type_arguments: {
            category: 1 /* Error */,
            message: "Non-generic functions may not accept type arguments.",
            code: 2159
        },
        A_generic_type_may_not_reference_itself_with_its_own_type_parameters: {
            category: 1 /* Error */,
            message: "A generic type may not reference itself with its own type parameters.",
            code: 2160
        },
        Value_of_type__0__is_not_callable__Did_you_mean_to_include__new___: {
            category: 1 /* Error */,
            message: "Value of type '{0}' is not callable. Did you mean to include 'new'?",
            code: 2161
        },
        Rest_parameters_must_be_array_types: {
            category: 1 /* Error */,
            message: "Rest parameters must be array types.",
            code: 2162
        },
        Overload_signature_implementation_cannot_use_specialized_type: {
            category: 1 /* Error */,
            message: "Overload signature implementation cannot use specialized type.",
            code: 2163
        },
        Type__0__is_missing_property__1__from_type__2_: {
            category: 3 /* NoPrefix */,
            message: "Type '{0}' is missing property '{1}' from type '{2}'.",
            code: 4000
        },
        Types_of_property__0__of_types__1__and__2__are_incompatible: {
            category: 3 /* NoPrefix */,
            message: "Types of property '{0}' of types '{1}' and '{2}' are incompatible.",
            code: 4001
        },
        Types_of_property__0__of_types__1__and__2__are_incompatible__NL__3: {
            category: 3 /* NoPrefix */,
            message: "Types of property '{0}' of types '{1}' and '{2}' are incompatible:{NL}{3}",
            code: 4002
        },
        Property__0__defined_as_private_in_type__1__is_defined_as_public_in_type__2_: {
            category: 3 /* NoPrefix */,
            message: "Property '{0}' defined as private in type '{1}' is defined as public in type '{2}'.",
            code: 4003
        },
        Property__0__defined_as_public_in_type__1__is_defined_as_private_in_type__2_: {
            category: 3 /* NoPrefix */,
            message: "Property '{0}' defined as public in type '{1}' is defined as private in type '{2}'.",
            code: 4004
        },
        Types__0__and__1__define_property__2__as_private: {
            category: 3 /* NoPrefix */,
            message: "Types '{0}' and '{1}' define property '{2}' as private.",
            code: 4005
        },
        Call_signatures_of_types__0__and__1__are_incompatible: {
            category: 3 /* NoPrefix */,
            message: "Call signatures of types '{0}' and '{1}' are incompatible.",
            code: 4006
        },
        Call_signatures_of_types__0__and__1__are_incompatible__NL__2: {
            category: 3 /* NoPrefix */,
            message: "Call signatures of types '{0}' and '{1}' are incompatible:{NL}{2}",
            code: 4007
        },
        Type__0__requires_a_call_signature__but_Type__1__lacks_one: {
            category: 3 /* NoPrefix */,
            message: "Type '{0}' requires a call signature, but type '{1}' lacks one.",
            code: 4008
        },
        Construct_signatures_of_types__0__and__1__are_incompatible: {
            category: 3 /* NoPrefix */,
            message: "Construct signatures of types '{0}' and '{1}' are incompatible.",
            code: 4009
        },
        Construct_signatures_of_types__0__and__1__are_incompatible__NL__2: {
            category: 3 /* NoPrefix */,
            message: "Construct signatures of types '{0}' and '{1}' are incompatible:{NL}{2}",
            code: 40010
        },
        Type__0__requires_a_construct_signature__but_Type__1__lacks_one: {
            category: 3 /* NoPrefix */,
            message: "Type '{0}' requires a construct signature, but type '{1}' lacks one.",
            code: 4011
        },
        Index_signatures_of_types__0__and__1__are_incompatible: {
            category: 3 /* NoPrefix */,
            message: "Index signatures of types '{0}' and '{1}' are incompatible.",
            code: 4012
        },
        Index_signatures_of_types__0__and__1__are_incompatible__NL__2: {
            category: 3 /* NoPrefix */,
            message: "Index signatures of types '{0}' and '{1}' are incompatible:{NL}{2}",
            code: 4013
        },
        Call_signature_expects__0__or_fewer_parameters: {
            category: 3 /* NoPrefix */,
            message: "Call signature expects {0} or fewer parameters.",
            code: 4014
        },
        Could_not_apply_type__0__to_argument__1__which_is_of_type__2_: {
            category: 3 /* NoPrefix */,
            message: "Could not apply type'{0}' to argument {1} which is of type '{2}'.",
            code: 4015
        },
        Class__0__defines_instance_member_accessor__1___but_extended_class__2__defines_it_as_instance_member_function: {
            category: 3 /* NoPrefix */,
            message: "Class '{0}' defines instance member accessor '{1}', but extended class '{2}' defines it as instance member function.",
            code: 4016
        },
        Class__0__defines_instance_member_property__1___but_extended_class__2__defines_it_as_instance_member_function: {
            category: 3 /* NoPrefix */,
            message: "Class '{0}' defines instance member property '{1}', but extended class '{2}' defines it as instance member function.",
            code: 4017
        },
        Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_accessor: {
            category: 3 /* NoPrefix */,
            message: "Class '{0}' defines instance member function '{1}', but extended class '{2}' defines it as instance member accessor.",
            code: 4018
        },
        Class__0__defines_instance_member_function__1___but_extended_class__2__defines_it_as_instance_member_property: {
            category: 3 /* NoPrefix */,
            message: "Class '{0}' defines instance member function '{1}', but extended class '{2}' defines it as instance member property.",
            code: 4019
        },
        Types_of_static_property__0__of_class__1__and_class__2__are_incompatible: {
            category: 3 /* NoPrefix */,
            message: "Types of static property '{0}' of class '{1}' and class '{2}' are incompatible.",
            code: 4020
        },
        Types_of_static_property__0__of_class__1__and_class__2__are_incompatible__NL__3: {
            category: 3 /* NoPrefix */,
            message: "Types of static property '{0}' of class '{1}' and class '{2}' are incompatible:{NL}{3}",
            code: 4021
        },
        Current_host_does_not_support__w_atch_option: {
            category: 1 /* Error */,
            message: "Current host does not support -w[atch] option.",
            code: 5001
        },
        ECMAScript_target_version__0__not_supported___Using_default__1__code_generation: {
            category: 0 /* Warning */,
            message: "ECMAScript target version '{0}' not supported.  Using default '{1}' code generation.",
            code: 5002
        },
        Module_code_generation__0__not_supported___Using_default__1__code_generation: {
            category: 0 /* Warning */,
            message: "Module code generation '{0}' not supported.  Using default '{1}' code generation.",
            code: 5003
        },
        Could_not_find_file___0_: {
            category: 1 /* Error */,
            message: "Could not find file: '{0}'.",
            code: 5004
        },
        Unknown_extension_for_file___0__Only__ts_and_d_ts_extensions_are_allowed: {
            category: 1 /* Error */,
            message: "Unknown extension for file: '{0}'. Only .ts and .d.ts extensions are allowed.",
            code: 5005
        },
        A_file_cannot_have_a_reference_itself: {
            category: 1 /* Error */,
            message: "A file cannot have a reference itself.",
            code: 5006
        },
        Cannot_resolve_referenced_file___0_: {
            category: 1 /* Error */,
            message: "Cannot resolve referenced file: '{0}'.",
            code: 5007
        },
        Cannot_resolve_imported_file___0_: {
            category: 1 /* Error */,
            message: "Cannot resolve imported file: '{0}'.",
            code: 5008
        },
        Cannot_find_the_common_subdirectory_path_for_the_input_files: {
            category: 1 /* Error */,
            message: "Cannot find the common subdirectory path for the input files",
            code: 5009
        },
        Cannot_compile_dynamic_modules_when_emitting_into_single_file: {
            category: 1 /* Error */,
            message: "Cannot compile dynamic modules when emitting into single file",
            code: 5010
        },
        Emit_Error__0: {
            category: 1 /* Error */,
            message: "Emit Error: {0}.",
            code: 5011
        }
    };

    var seenCodes = [];
    for (var name in TypeScript.diagnosticMessages) {
        if (TypeScript.diagnosticMessages.hasOwnProperty(name)) {
            var diagnosticMessage = TypeScript.diagnosticMessages[name];
            var value = seenCodes[diagnosticMessage.code];
            if (value) {
                throw new Error("Duplicate diagnostic code: " + diagnosticMessage.code);
            }

            seenCodes[diagnosticMessage.code] = diagnosticMessage;
        }
    }
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var Errors = (function () {
        function Errors() {
        }
        Errors.argument = function (argument, message) {
            return new Error("Invalid argument: " + argument + "." + (message ? (" " + message) : ""));
        };

        Errors.argumentOutOfRange = function (argument) {
            return new Error("Argument out of range: " + argument + ".");
        };

        Errors.argumentNull = function (argument) {
            return new Error("Argument null: " + argument + ".");
        };

        Errors.abstract = function () {
            return new Error("Operation not implemented properly by subclass.");
        };

        Errors.notYetImplemented = function () {
            return new Error("Not yet implemented.");
        };

        Errors.invalidOperation = function (message) {
            return new Error(message ? ("Invalid operation: " + message) : "Invalid operation.");
        };
        return Errors;
    })();
    TypeScript.Errors = Errors;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var Hash = (function () {
        function Hash() {
        }
        Hash.computeFnv1aCharArrayHashCode = function (text, start, len) {
            var hashCode = Hash.FNV_BASE;
            var end = start + len;

            for (var i = start; i < end; i++) {
                hashCode = (hashCode ^ text[i]) * Hash.FNV_PRIME;
            }

            return hashCode;
        };

        Hash.computeSimple31BitCharArrayHashCode = function (key, start, len) {
            var hash = 0;

            for (var i = 0; i < len; i++) {
                var ch = key[start + i];

                hash = (((hash << 5) + hash) + ch) | 0;
            }

            return hash & 0x7FFFFFFF;
        };

        Hash.computeSimple31BitStringHashCode = function (key) {
            var hash = 0;

            var start = 0;
            var len = key.length;

            for (var i = 0; i < len; i++) {
                var ch = key.charCodeAt(start + i);

                hash = (((hash << 5) + hash) + ch) | 0;
            }

            return hash & 0x7FFFFFFF;
        };

        Hash.computeMurmur2CharArrayHashCode = function (key, start, len) {
            var m = 0x5bd1e995;
            var r = 24;

            var numberOfCharsLeft = len;
            var h = (0 ^ numberOfCharsLeft);

            var index = start;
            while (numberOfCharsLeft >= 2) {
                var c1 = key[index];
                var c2 = key[index + 1];

                var k = c1 | (c2 << 16);

                k *= m;
                k ^= k >> r;
                k *= m;

                h *= m;
                h ^= k;

                index += 2;
                numberOfCharsLeft -= 2;
            }

            if (numberOfCharsLeft === 1) {
                h ^= key[index];
                h *= m;
            }

            h ^= h >> 13;
            h *= m;
            h ^= h >> 15;

            return h;
        };

        Hash.computeMurmur2StringHashCode = function (key) {
            var m = 0x5bd1e995;
            var r = 24;

            var start = 0;
            var len = key.length;
            var numberOfCharsLeft = len;

            var h = (0 ^ numberOfCharsLeft);

            var index = start;
            while (numberOfCharsLeft >= 2) {
                var c1 = key.charCodeAt(index);
                var c2 = key.charCodeAt(index + 1);

                var k = c1 | (c2 << 16);

                k *= m;
                k ^= k >> r;
                k *= m;

                h *= m;
                h ^= k;

                index += 2;
                numberOfCharsLeft -= 2;
            }

            if (numberOfCharsLeft === 1) {
                h ^= key.charCodeAt(index);
                h *= m;
            }

            h ^= h >> 13;
            h *= m;
            h ^= h >> 15;

            return h;
        };

        Hash.getPrime = function (min) {
            for (var i = 0; i < Hash.primes.length; i++) {
                var num = Hash.primes[i];
                if (num >= min) {
                    return num;
                }
            }

            throw TypeScript.Errors.notYetImplemented();
        };

        Hash.expandPrime = function (oldSize) {
            var num = oldSize << 1;
            if (num > 2146435069 && 2146435069 > oldSize) {
                return 2146435069;
            }
            return Hash.getPrime(num);
        };

        Hash.combine = function (value, currentHash) {
            return (((currentHash << 5) + currentHash) + value) & 0x7FFFFFFF;
        };
        Hash.FNV_BASE = 2166136261;
        Hash.FNV_PRIME = 16777619;

        Hash.primes = [
            3,
            7,
            11,
            17,
            23,
            29,
            37,
            47,
            59,
            71,
            89,
            107,
            131,
            163,
            197,
            239,
            293,
            353,
            431,
            521,
            631,
            761,
            919,
            1103,
            1327,
            1597,
            1931,
            2333,
            2801,
            3371,
            4049,
            4861,
            5839,
            7013,
            8419,
            10103,
            12143,
            14591,
            17519,
            21023,
            25229,
            30293,
            36353,
            43627,
            52361,
            62851,
            75431,
            90523,
            108631,
            130363,
            156437,
            187751,
            225307,
            270371,
            324449,
            389357,
            467237,
            560689,
            672827,
            807403,
            968897,
            1162687,
            1395263,
            1674319,
            2009191,
            2411033,
            2893249,
            3471899,
            4166287,
            4999559,
            5999471,
            7199369
        ];
        return Hash;
    })();
    TypeScript.Hash = Hash;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    (function (Collections) {
        Collections.DefaultHashTableCapacity = 256;

        var HashTableEntry = (function () {
            function HashTableEntry(Key, Value, HashCode, Next) {
                this.Key = Key;
                this.Value = Value;
                this.HashCode = HashCode;
                this.Next = Next;
            }
            return HashTableEntry;
        })();

        var HashTable = (function () {
            function HashTable(capacity, hash, equals) {
                this.hash = hash;
                this.equals = equals;
                this.entries = [];
                this.count = 0;
                var size = TypeScript.Hash.getPrime(capacity);
                this.hash = hash;
                this.equals = equals;
                this.entries = TypeScript.ArrayUtilities.createArray(size, null);
            }
            HashTable.prototype.set = function (key, value) {
                this.addOrSet(key, value, false);
            };

            HashTable.prototype.add = function (key, value) {
                this.addOrSet(key, value, true);
            };

            HashTable.prototype.containsKey = function (key) {
                var hashCode = this.computeHashCode(key);
                var entry = this.findEntry(key, hashCode);
                return entry !== null;
            };

            HashTable.prototype.get = function (key) {
                var hashCode = this.computeHashCode(key);
                var entry = this.findEntry(key, hashCode);

                return entry === null ? null : entry.Value;
            };

            HashTable.prototype.computeHashCode = function (key) {
                var hashCode = this.hash === null ? key.hashCode() : this.hash(key);

                hashCode = hashCode & 0x7FFFFFFF;
                TypeScript.Debug.assert(hashCode > 0);

                return hashCode;
            };

            HashTable.prototype.addOrSet = function (key, value, throwOnExistingEntry) {
                var hashCode = this.computeHashCode(key);

                var entry = this.findEntry(key, hashCode);
                if (entry !== null) {
                    if (throwOnExistingEntry) {
                        throw TypeScript.Errors.argument('key', 'Key was already in table.');
                    }

                    entry.Key = key;
                    entry.Value = value;
                    return;
                }

                return this.addEntry(key, value, hashCode);
            };

            HashTable.prototype.findEntry = function (key, hashCode) {
                for (var e = this.entries[hashCode % this.entries.length]; e !== null; e = e.Next) {
                    if (e.HashCode === hashCode) {
                        var equals = this.equals === null ? key === e.Key : this.equals(key, e.Key);

                        if (equals) {
                            return e;
                        }
                    }
                }

                return null;
            };

            HashTable.prototype.addEntry = function (key, value, hashCode) {
                var index = hashCode % this.entries.length;

                var e = new HashTableEntry(key, value, hashCode, this.entries[index]);

                this.entries[index] = e;

                if (this.count === this.entries.length) {
                    this.grow();
                }

                this.count++;
                return e.Key;
            };

            HashTable.prototype.grow = function () {
                var newSize = TypeScript.Hash.expandPrime(this.entries.length);

                var oldEntries = this.entries;
                var newEntries = TypeScript.ArrayUtilities.createArray(newSize, null);

                this.entries = newEntries;

                for (var i = 0; i < oldEntries.length; i++) {
                    var e = oldEntries[i];

                    while (e !== null) {
                        var newIndex = e.HashCode % newSize;
                        var tmp = e.Next;
                        e.Next = newEntries[newIndex];
                        newEntries[newIndex] = e;
                        e = tmp;
                    }
                }
            };
            return HashTable;
        })();
        Collections.HashTable = HashTable;

        function createHashTable(capacity, hash, equals) {
            if (typeof capacity === "undefined") { capacity = Collections.DefaultHashTableCapacity; }
            if (typeof hash === "undefined") { hash = null; }
            if (typeof equals === "undefined") { equals = null; }
            return new HashTable(capacity, hash, equals);
        }
        Collections.createHashTable = createHashTable;

        var currentHashCode = 1;
        function identityHashCode(value) {
            if (value.__hash === undefined) {
                value.__hash = currentHashCode;
                currentHashCode++;
            }

            return value.__hash;
        }
        Collections.identityHashCode = identityHashCode;
    })(TypeScript.Collections || (TypeScript.Collections = {}));
    var Collections = TypeScript.Collections;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var Diagnostic = (function () {
        function Diagnostic(fileName, start, length, diagnosticCode, arguments) {
            this._diagnosticCode = diagnosticCode;
            this._arguments = (arguments && arguments.length > 0) ? arguments : null;
            this._fileName = fileName;
            this._originalStart = this._start = start;
            this._length = length;
        }
        Diagnostic.prototype.toJSON = function (key) {
            var result = {};
            result.start = this.start();
            result.length = this.length();

            result.diagnosticCode = TypeScript.DiagnosticCode[this.diagnosticCode()];

            var arguments = (this).arguments();
            if (arguments && arguments.length > 0) {
                result.arguments = arguments;
            }

            return result;
        };

        Diagnostic.prototype.fileName = function () {
            return this._fileName;
        };

        Diagnostic.prototype.start = function () {
            return this._start;
        };

        Diagnostic.prototype.length = function () {
            return this._length;
        };

        Diagnostic.prototype.diagnosticCode = function () {
            return this._diagnosticCode;
        };

        Diagnostic.prototype.arguments = function () {
            return this._arguments;
        };

        Diagnostic.prototype.text = function () {
            return TypeScript.getDiagnosticText(this._diagnosticCode, this._arguments);
        };

        Diagnostic.prototype.message = function () {
            return TypeScript.getDiagnosticMessage(this._diagnosticCode, this._arguments);
        };

        Diagnostic.prototype.adjustOffset = function (pos) {
            this._start = this._originalStart + pos;
        };

        Diagnostic.prototype.additionalLocations = function () {
            return [];
        };

        Diagnostic.equals = function (diagnostic1, diagnostic2) {
            return diagnostic1._fileName === diagnostic2._fileName && diagnostic1._start === diagnostic2._start && diagnostic1._length === diagnostic2._length && diagnostic1._diagnosticCode === diagnostic2._diagnosticCode && TypeScript.ArrayUtilities.sequenceEquals(diagnostic1._arguments, diagnostic2._arguments, function (v1, v2) {
                return v1 === v2;
            });
        };
        return Diagnostic;
    })();
    TypeScript.Diagnostic = Diagnostic;

    function getLargestIndex(diagnostic) {
        var largest = -1;
        var stringComponents = diagnostic.split("_");

        for (var i = 0; i < stringComponents.length; i++) {
            var val = parseInt(stringComponents[i]);
            if (!isNaN(val) && val > largest) {
                largest = val;
            }
        }

        return largest;
    }

    function getDiagnosticInfoFromCode(diagnosticCode) {
        var diagnosticName = TypeScript.DiagnosticCode[diagnosticCode];
        return TypeScript.diagnosticMessages[diagnosticName];
    }
    TypeScript.getDiagnosticInfoFromCode = getDiagnosticInfoFromCode;

    function getDiagnosticText(diagnosticCode, args) {
        var diagnosticName = TypeScript.DiagnosticCode[diagnosticCode];

        var diagnostic = TypeScript.diagnosticMessages[diagnosticName];

        var actualCount = args ? args.length : 0;
        if (!diagnostic) {
            throw new Error("Invalid diagnostic");
        } else {
            var expectedCount = 1 + getLargestIndex(diagnosticName);

            if (expectedCount !== actualCount) {
                throw new Error("Expected " + expectedCount + " arguments to diagnostic, got " + actualCount + " instead");
            }
        }

        var diagnosticMessageText = diagnostic.message.replace(/{({(\d+)})?TB}/g, function (match, p1, num) {
            var tabChar = "\t";
            var result = tabChar;
            if (num && args[num]) {
                for (var i = 1; i < args[num]; i++) {
                    result += tabChar;
                }
            }

            return result;
        });

        diagnosticMessageText = diagnosticMessageText.replace(/{(\d+)}/g, function (match, num) {
            return typeof args[num] !== 'undefined' ? args[num] : match;
        });

        diagnosticMessageText = diagnosticMessageText.replace(/{(NL)}/g, function (match) {
            return "\r\n";
        });

        return diagnosticMessageText;
    }
    TypeScript.getDiagnosticText = getDiagnosticText;

    function getDiagnosticMessage(diagnosticCode, args) {
        var diagnostic = getDiagnosticInfoFromCode(diagnosticCode);
        var diagnosticMessageText = getDiagnosticText(diagnosticCode, args);

        var message;
        if (diagnostic.category === 1 /* Error */) {
            message = getDiagnosticText(0 /* error_TS_0__1 */, [diagnostic.code, diagnosticMessageText]);
        } else if (diagnostic.category === 0 /* Warning */) {
            message = getDiagnosticText(1 /* warning_TS_0__1 */, [diagnostic.code, diagnosticMessageText]);
        } else {
            message = diagnosticMessageText;
        }

        return message;
    }
    TypeScript.getDiagnosticMessage = getDiagnosticMessage;
})(TypeScript || (TypeScript = {}));
var Environment = (function () {
    function getWindowsScriptHostEnvironment() {
        try  {
            var fso = new ActiveXObject("Scripting.FileSystemObject");
        } catch (e) {
            return null;
        }

        var streamObjectPool = [];

        function getStreamObject() {
            if (streamObjectPool.length > 0) {
                return streamObjectPool.pop();
            } else {
                return new ActiveXObject("ADODB.Stream");
            }
        }

        function releaseStreamObject(obj) {
            streamObjectPool.push(obj);
        }

        var args = [];
        for (var i = 0; i < WScript.Arguments.length; i++) {
            args[i] = WScript.Arguments.Item(i);
        }

        return {
            currentDirectory: function () {
                return (WScript).CreateObject("WScript.Shell").CurrentDirectory;
            },
            readFile: function (path, useUTF8) {
                if (typeof useUTF8 === "undefined") { useUTF8 = false; }
                try  {
                    var streamObj = getStreamObject();
                    streamObj.Open();
                    streamObj.Type = 2;
                    streamObj.Charset = 'x-ansi';
                    streamObj.LoadFromFile(path);
                    var bomChar = streamObj.ReadText(2);
                    streamObj.Position = 0;
                    if ((bomChar.charCodeAt(0) === 0xFE && bomChar.charCodeAt(1) === 0xFF) || (bomChar.charCodeAt(0) === 0xFF && bomChar.charCodeAt(1) === 0xFE)) {
                        streamObj.Charset = 'unicode';
                    } else if (bomChar.charCodeAt(0) === 0xEF && bomChar.charCodeAt(1) === 0xBB) {
                        streamObj.Charset = 'utf-8';
                    } else {
                        streamObj.Charset = useUTF8 ? 'utf-8' : 'x-ansi';
                    }

                    var str = streamObj.ReadText(-1);
                    streamObj.Close();
                    releaseStreamObject(streamObj);
                    return str;
                } catch (err) {
                    throw new Error("Error reading file \"" + path + "\": " + err.message);
                }
            },
            writeFile: function (path, contents, useUTF8) {
                if (typeof useUTF8 === "undefined") { useUTF8 = false; }
                var file = this.createFile(path, useUTF8);
                file.Write(contents);
                file.Close();
            },
            fileExists: function (path) {
                return fso.FileExists(path);
            },
            deleteFile: function (path) {
                if (fso.FileExists(path)) {
                    fso.DeleteFile(path, true);
                }
            },
            directoryExists: function (path) {
                return fso.FolderExists(path);
            },
            listFiles: function (path, spec, options) {
                options = options || {};
                function filesInFolder(folder, root) {
                    var paths = [];
                    var fc;

                    if (options.recursive) {
                        fc = new Enumerator(folder.subfolders);

                        for (; !fc.atEnd(); fc.moveNext()) {
                            paths = paths.concat(filesInFolder(fc.item(), root + "\\" + fc.item().Name));
                        }
                    }

                    fc = new Enumerator(folder.files);

                    for (; !fc.atEnd(); fc.moveNext()) {
                        if (!spec || fc.item().Name.match(spec)) {
                            paths.push(root + "\\" + fc.item().Name);
                        }
                    }

                    return paths;
                }

                var folder = fso.GetFolder(path);
                var paths = [];

                return filesInFolder(folder, path);
            },
            createFile: function (path, useUTF8) {
                if (typeof useUTF8 === "undefined") { useUTF8 = false; }
                try  {
                    var streamObj = getStreamObject();
                    streamObj.Charset = useUTF8 ? 'utf-8' : 'x-ansi';
                    streamObj.Open();
                    return {
                        Write: function (str) {
                            streamObj.WriteText(str, 0);
                        },
                        WriteLine: function (str) {
                            streamObj.WriteText(str, 1);
                        },
                        Close: function () {
                            streamObj.SaveToFile(path, 2);
                            streamObj.Close();
                            releaseStreamObject(streamObj);
                        }
                    };
                } catch (ex) {
                    WScript.StdErr.WriteLine("Couldn't write to file '" + path + "'");
                    throw ex;
                }
            },
            arguments: args,
            standardOut: WScript.StdOut
        };
    }
    ;

    function getNodeEnvironment() {
        var _fs = require('fs');
        var _path = require('path');
        var _module = require('module');

        return {
            currentDirectory: function () {
                return (process).cwd();
            },
            readFile: function (file, useUTF8) {
                var buffer = _fs.readFileSync(file);
                switch (buffer[0]) {
                    case 0xFE:
                        if (buffer[1] === 0xFF) {
                            var i = 0;
                            while ((i + 1) < buffer.length) {
                                var temp = buffer[i];
                                buffer[i] = buffer[i + 1];
                                buffer[i + 1] = temp;
                                i += 2;
                            }
                            return buffer.toString("ucs2", 2);
                        }
                        break;
                    case 0xFF:
                        if (buffer[1] === 0xFE) {
                            return buffer.toString("ucs2", 2);
                        }
                        break;
                    case 0xEF:
                        if (buffer[1] === 0xBB) {
                            return buffer.toString("utf8", 3);
                        }
                }

                return useUTF8 ? buffer.toString("utf8", 0) : buffer.toString();
            },
            writeFile: function (path, contents, useUTF) {
                if (useUTF) {
                    _fs.writeFileSync(path, contents, "utf8");
                } else {
                    _fs.writeFileSync(path, contents);
                }
            },
            fileExists: function (path) {
                return _fs.existsSync(path);
            },
            deleteFile: function (path) {
                try  {
                    _fs.unlinkSync(path);
                } catch (e) {
                }
            },
            directoryExists: function (path) {
                return _fs.existsSync(path) && _fs.statSync(path).isDirectory();
            },
            listFiles: function dir(path, spec, options) {
                options = options || {};

                function filesInFolder(folder) {
                    var paths = [];

                    var files = _fs.readdirSync(folder);
                    for (var i = 0; i < files.length; i++) {
                        var stat = _fs.statSync(folder + "\\" + files[i]);
                        if (options.recursive && stat.isDirectory()) {
                            paths = paths.concat(filesInFolder(folder + "\\" + files[i]));
                        } else if (stat.isFile() && (!spec || files[i].match(spec))) {
                            paths.push(folder + "\\" + files[i]);
                        }
                    }

                    return paths;
                }

                return filesInFolder(path);
            },
            createFile: function (path, useUTF8) {
                function mkdirRecursiveSync(path) {
                    var stats = _fs.statSync(path);
                    if (stats.isFile()) {
                        throw "\"" + path + "\" exists but isn't a directory.";
                    } else if (stats.isDirectory()) {
                        return;
                    } else {
                        mkdirRecursiveSync(_path.dirname(path));
                        _fs.mkdirSync(path, 0775);
                    }
                }
                mkdirRecursiveSync(_path.dirname(path));

                var fd = _fs.openSync(path, 'w');
                return {
                    Write: function (str) {
                        _fs.writeSync(fd, str);
                    },
                    WriteLine: function (str) {
                        _fs.writeSync(fd, str + '\r\n');
                    },
                    Close: function () {
                        _fs.closeSync(fd);
                        fd = null;
                    }
                };
            },
            arguments: process.argv.slice(2),
            standardOut: {
                Write: function (str) {
                    process.stdout.write(str);
                },
                WriteLine: function (str) {
                    process.stdout.write(str + '\n');
                },
                Close: function () {
                }
            }
        };
    }
    ;

    if (typeof WScript !== "undefined" && typeof ActiveXObject === "function") {
        return getWindowsScriptHostEnvironment();
    } else if (typeof require === "function") {
        return getNodeEnvironment();
    } else {
        return null;
    }
})();
var TypeScript;
(function (TypeScript) {
    var IntegerUtilities = (function () {
        function IntegerUtilities() {
        }
        IntegerUtilities.integerDivide = function (numerator, denominator) {
            return (numerator / denominator) >> 0;
        };

        IntegerUtilities.integerMultiplyLow32Bits = function (n1, n2) {
            var n1Low16 = n1 & 0x0000ffff;
            var n1High16 = n1 >>> 16;

            var n2Low16 = n2 & 0x0000ffff;
            var n2High16 = n2 >>> 16;

            var resultLow32 = (((n1 & 0xffff0000) * n2) >>> 0) + (((n1 & 0x0000ffff) * n2) >>> 0) >>> 0;
            return resultLow32;
        };

        IntegerUtilities.integerMultiplyHigh32Bits = function (n1, n2) {
            var n1Low16 = n1 & 0x0000ffff;
            var n1High16 = n1 >>> 16;

            var n2Low16 = n2 & 0x0000ffff;
            var n2High16 = n2 >>> 16;

            var resultHigh32 = n1High16 * n2High16 + ((((n1Low16 * n2Low16) >>> 17) + n1Low16 * n2High16) >>> 15);
            return resultHigh32;
        };
        return IntegerUtilities;
    })();
    TypeScript.IntegerUtilities = IntegerUtilities;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var MathPrototype = (function () {
        function MathPrototype() {
        }
        MathPrototype.max = function (a, b) {
            return a >= b ? a : b;
        };

        MathPrototype.min = function (a, b) {
            return a <= b ? a : b;
        };
        return MathPrototype;
    })();
    TypeScript.MathPrototype = MathPrototype;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    (function (Collections) {
        Collections.DefaultStringTableCapacity = 256;

        var StringTableEntry = (function () {
            function StringTableEntry(Text, HashCode, Next) {
                this.Text = Text;
                this.HashCode = HashCode;
                this.Next = Next;
            }
            return StringTableEntry;
        })();

        var StringTable = (function () {
            function StringTable(capacity) {
                this.entries = [];
                this.count = 0;
                var size = TypeScript.Hash.getPrime(capacity);
                this.entries = TypeScript.ArrayUtilities.createArray(size, null);
            }
            StringTable.prototype.addCharArray = function (key, start, len) {
                var hashCode = TypeScript.Hash.computeSimple31BitCharArrayHashCode(key, start, len) & 0x7FFFFFFF;

                var entry = this.findCharArrayEntry(key, start, len, hashCode);
                if (entry !== null) {
                    return entry.Text;
                }

                var slice = key.slice(start, start + len);
                return this.addEntry(TypeScript.StringUtilities.fromCharCodeArray(slice), hashCode);
            };

            StringTable.prototype.findCharArrayEntry = function (key, start, len, hashCode) {
                for (var e = this.entries[hashCode % this.entries.length]; e !== null; e = e.Next) {
                    if (e.HashCode === hashCode && StringTable.textCharArrayEquals(e.Text, key, start, len)) {
                        return e;
                    }
                }

                return null;
            };

            StringTable.prototype.addEntry = function (text, hashCode) {
                var index = hashCode % this.entries.length;

                var e = new StringTableEntry(text, hashCode, this.entries[index]);

                this.entries[index] = e;

                if (this.count === this.entries.length) {
                    this.grow();
                }

                this.count++;
                return e.Text;
            };

            StringTable.prototype.grow = function () {
                var newSize = TypeScript.Hash.expandPrime(this.entries.length);

                var oldEntries = this.entries;
                var newEntries = TypeScript.ArrayUtilities.createArray(newSize, null);

                this.entries = newEntries;

                for (var i = 0; i < oldEntries.length; i++) {
                    var e = oldEntries[i];
                    while (e !== null) {
                        var newIndex = e.HashCode % newSize;
                        var tmp = e.Next;
                        e.Next = newEntries[newIndex];
                        newEntries[newIndex] = e;
                        e = tmp;
                    }
                }
            };

            StringTable.textCharArrayEquals = function (text, array, start, length) {
                if (text.length !== length) {
                    return false;
                }

                var s = start;
                for (var i = 0; i < length; i++) {
                    if (text.charCodeAt(i) !== array[s]) {
                        return false;
                    }

                    s++;
                }

                return true;
            };
            return StringTable;
        })();
        Collections.StringTable = StringTable;

        Collections.DefaultStringTable = new StringTable(Collections.DefaultStringTableCapacity);
    })(TypeScript.Collections || (TypeScript.Collections = {}));
    var Collections = TypeScript.Collections;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    var StringUtilities = (function () {
        function StringUtilities() {
        }
        StringUtilities.isString = function (value) {
            return Object.prototype.toString.apply(value, []) === '[object String]';
        };

        StringUtilities.fromCharCodeArray = function (array) {
            return String.fromCharCode.apply(null, array);
        };

        StringUtilities.endsWith = function (string, value) {
            return string.substring(string.length - value.length, string.length) === value;
        };

        StringUtilities.startsWith = function (string, value) {
            return string.substr(0, value.length) === value;
        };

        StringUtilities.copyTo = function (source, sourceIndex, destination, destinationIndex, count) {
            for (var i = 0; i < count; i++) {
                destination[destinationIndex + i] = source.charCodeAt(sourceIndex + i);
            }
        };

        StringUtilities.repeat = function (value, count) {
            return Array(count + 1).join(value);
        };

        StringUtilities.stringEquals = function (val1, val2) {
            return val1 === val2;
        };
        return StringUtilities;
    })();
    TypeScript.StringUtilities = StringUtilities;
})(TypeScript || (TypeScript = {}));
var global = Function("return this").call(null);

var TypeScript;
(function (TypeScript) {
    var Clock;
    (function (Clock) {
        Clock.now;
        Clock.resolution;

        if (typeof WScript !== "undefined" && typeof global['WScript'].InitializeProjection !== "undefined") {
            global['WScript'].InitializeProjection();

            Clock.now = function () {
                return TestUtilities.QueryPerformanceCounter();
            };

            Clock.resolution = TestUtilities.QueryPerformanceFrequency();
        } else {
            Clock.now = function () {
                return Date.now();
            };

            Clock.resolution = 1000;
        }
    })(Clock || (Clock = {}));

    var Timer = (function () {
        function Timer() {
            this.time = 0;
        }
        Timer.prototype.start = function () {
            this.time = 0;
            this.startTime = Clock.now();
        };

        Timer.prototype.end = function () {
            this.time = (Clock.now() - this.startTime);
        };
        return Timer;
    })();
    TypeScript.Timer = Timer;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    (function (SyntaxKind) {
        SyntaxKind[SyntaxKind["None"] = 0] = "None";
        SyntaxKind[SyntaxKind["List"] = 1] = "List";
        SyntaxKind[SyntaxKind["SeparatedList"] = 2] = "SeparatedList";
        SyntaxKind[SyntaxKind["TriviaList"] = 3] = "TriviaList";

        SyntaxKind[SyntaxKind["WhitespaceTrivia"] = 4] = "WhitespaceTrivia";
        SyntaxKind[SyntaxKind["NewLineTrivia"] = 5] = "NewLineTrivia";
        SyntaxKind[SyntaxKind["MultiLineCommentTrivia"] = 6] = "MultiLineCommentTrivia";
        SyntaxKind[SyntaxKind["SingleLineCommentTrivia"] = 7] = "SingleLineCommentTrivia";
        SyntaxKind[SyntaxKind["SkippedTokenTrivia"] = 8] = "SkippedTokenTrivia";

        SyntaxKind[SyntaxKind["ErrorToken"] = 9] = "ErrorToken";
        SyntaxKind[SyntaxKind["EndOfFileToken"] = 10] = "EndOfFileToken";

        SyntaxKind[SyntaxKind["IdentifierName"] = 11] = "IdentifierName";

        SyntaxKind[SyntaxKind["RegularExpressionLiteral"] = 12] = "RegularExpressionLiteral";
        SyntaxKind[SyntaxKind["NumericLiteral"] = 13] = "NumericLiteral";
        SyntaxKind[SyntaxKind["StringLiteral"] = 14] = "StringLiteral";

        SyntaxKind[SyntaxKind["BreakKeyword"] = 15] = "BreakKeyword";
        SyntaxKind[SyntaxKind["CaseKeyword"] = 16] = "CaseKeyword";
        SyntaxKind[SyntaxKind["CatchKeyword"] = 17] = "CatchKeyword";
        SyntaxKind[SyntaxKind["ContinueKeyword"] = 18] = "ContinueKeyword";
        SyntaxKind[SyntaxKind["DebuggerKeyword"] = 19] = "DebuggerKeyword";
        SyntaxKind[SyntaxKind["DefaultKeyword"] = 20] = "DefaultKeyword";
        SyntaxKind[SyntaxKind["DeleteKeyword"] = 21] = "DeleteKeyword";
        SyntaxKind[SyntaxKind["DoKeyword"] = 22] = "DoKeyword";
        SyntaxKind[SyntaxKind["ElseKeyword"] = 23] = "ElseKeyword";
        SyntaxKind[SyntaxKind["FalseKeyword"] = 24] = "FalseKeyword";
        SyntaxKind[SyntaxKind["FinallyKeyword"] = 25] = "FinallyKeyword";
        SyntaxKind[SyntaxKind["ForKeyword"] = 26] = "ForKeyword";
        SyntaxKind[SyntaxKind["FunctionKeyword"] = 27] = "FunctionKeyword";
        SyntaxKind[SyntaxKind["IfKeyword"] = 28] = "IfKeyword";
        SyntaxKind[SyntaxKind["InKeyword"] = 29] = "InKeyword";
        SyntaxKind[SyntaxKind["InstanceOfKeyword"] = 30] = "InstanceOfKeyword";
        SyntaxKind[SyntaxKind["NewKeyword"] = 31] = "NewKeyword";
        SyntaxKind[SyntaxKind["NullKeyword"] = 32] = "NullKeyword";
        SyntaxKind[SyntaxKind["ReturnKeyword"] = 33] = "ReturnKeyword";
        SyntaxKind[SyntaxKind["SwitchKeyword"] = 34] = "SwitchKeyword";
        SyntaxKind[SyntaxKind["ThisKeyword"] = 35] = "ThisKeyword";
        SyntaxKind[SyntaxKind["ThrowKeyword"] = 36] = "ThrowKeyword";
        SyntaxKind[SyntaxKind["TrueKeyword"] = 37] = "TrueKeyword";
        SyntaxKind[SyntaxKind["TryKeyword"] = 38] = "TryKeyword";
        SyntaxKind[SyntaxKind["TypeOfKeyword"] = 39] = "TypeOfKeyword";
        SyntaxKind[SyntaxKind["VarKeyword"] = 40] = "VarKeyword";
        SyntaxKind[SyntaxKind["VoidKeyword"] = 41] = "VoidKeyword";
        SyntaxKind[SyntaxKind["WhileKeyword"] = 42] = "WhileKeyword";
        SyntaxKind[SyntaxKind["WithKeyword"] = 43] = "WithKeyword";

        SyntaxKind[SyntaxKind["ClassKeyword"] = 44] = "ClassKeyword";
        SyntaxKind[SyntaxKind["ConstKeyword"] = 45] = "ConstKeyword";
        SyntaxKind[SyntaxKind["EnumKeyword"] = 46] = "EnumKeyword";
        SyntaxKind[SyntaxKind["ExportKeyword"] = 47] = "ExportKeyword";
        SyntaxKind[SyntaxKind["ExtendsKeyword"] = 48] = "ExtendsKeyword";
        SyntaxKind[SyntaxKind["ImportKeyword"] = 49] = "ImportKeyword";
        SyntaxKind[SyntaxKind["SuperKeyword"] = 50] = "SuperKeyword";

        SyntaxKind[SyntaxKind["ImplementsKeyword"] = 51] = "ImplementsKeyword";
        SyntaxKind[SyntaxKind["InterfaceKeyword"] = 52] = "InterfaceKeyword";
        SyntaxKind[SyntaxKind["LetKeyword"] = 53] = "LetKeyword";
        SyntaxKind[SyntaxKind["PackageKeyword"] = 54] = "PackageKeyword";
        SyntaxKind[SyntaxKind["PrivateKeyword"] = 55] = "PrivateKeyword";
        SyntaxKind[SyntaxKind["ProtectedKeyword"] = 56] = "ProtectedKeyword";
        SyntaxKind[SyntaxKind["PublicKeyword"] = 57] = "PublicKeyword";
        SyntaxKind[SyntaxKind["StaticKeyword"] = 58] = "StaticKeyword";
        SyntaxKind[SyntaxKind["YieldKeyword"] = 59] = "YieldKeyword";

        SyntaxKind[SyntaxKind["AnyKeyword"] = 60] = "AnyKeyword";
        SyntaxKind[SyntaxKind["BooleanKeyword"] = 61] = "BooleanKeyword";
        SyntaxKind[SyntaxKind["BoolKeyword"] = 62] = "BoolKeyword";
        SyntaxKind[SyntaxKind["ConstructorKeyword"] = 63] = "ConstructorKeyword";
        SyntaxKind[SyntaxKind["DeclareKeyword"] = 64] = "DeclareKeyword";
        SyntaxKind[SyntaxKind["GetKeyword"] = 65] = "GetKeyword";
        SyntaxKind[SyntaxKind["ModuleKeyword"] = 66] = "ModuleKeyword";
        SyntaxKind[SyntaxKind["RequireKeyword"] = 67] = "RequireKeyword";
        SyntaxKind[SyntaxKind["NumberKeyword"] = 68] = "NumberKeyword";
        SyntaxKind[SyntaxKind["SetKeyword"] = 69] = "SetKeyword";
        SyntaxKind[SyntaxKind["StringKeyword"] = 70] = "StringKeyword";

        SyntaxKind[SyntaxKind["OpenBraceToken"] = 71] = "OpenBraceToken";
        SyntaxKind[SyntaxKind["CloseBraceToken"] = 72] = "CloseBraceToken";
        SyntaxKind[SyntaxKind["OpenParenToken"] = 73] = "OpenParenToken";
        SyntaxKind[SyntaxKind["CloseParenToken"] = 74] = "CloseParenToken";
        SyntaxKind[SyntaxKind["OpenBracketToken"] = 75] = "OpenBracketToken";
        SyntaxKind[SyntaxKind["CloseBracketToken"] = 76] = "CloseBracketToken";
        SyntaxKind[SyntaxKind["DotToken"] = 77] = "DotToken";
        SyntaxKind[SyntaxKind["DotDotDotToken"] = 78] = "DotDotDotToken";
        SyntaxKind[SyntaxKind["SemicolonToken"] = 79] = "SemicolonToken";
        SyntaxKind[SyntaxKind["CommaToken"] = 80] = "CommaToken";
        SyntaxKind[SyntaxKind["LessThanToken"] = 81] = "LessThanToken";
        SyntaxKind[SyntaxKind["GreaterThanToken"] = 82] = "GreaterThanToken";
        SyntaxKind[SyntaxKind["LessThanEqualsToken"] = 83] = "LessThanEqualsToken";
        SyntaxKind[SyntaxKind["GreaterThanEqualsToken"] = 84] = "GreaterThanEqualsToken";
        SyntaxKind[SyntaxKind["EqualsEqualsToken"] = 85] = "EqualsEqualsToken";
        SyntaxKind[SyntaxKind["EqualsGreaterThanToken"] = 86] = "EqualsGreaterThanToken";
        SyntaxKind[SyntaxKind["ExclamationEqualsToken"] = 87] = "ExclamationEqualsToken";
        SyntaxKind[SyntaxKind["EqualsEqualsEqualsToken"] = 88] = "EqualsEqualsEqualsToken";
        SyntaxKind[SyntaxKind["ExclamationEqualsEqualsToken"] = 89] = "ExclamationEqualsEqualsToken";
        SyntaxKind[SyntaxKind["PlusToken"] = 90] = "PlusToken";
        SyntaxKind[SyntaxKind["MinusToken"] = 91] = "MinusToken";
        SyntaxKind[SyntaxKind["AsteriskToken"] = 92] = "AsteriskToken";
        SyntaxKind[SyntaxKind["PercentToken"] = 93] = "PercentToken";
        SyntaxKind[SyntaxKind["PlusPlusToken"] = 94] = "PlusPlusToken";
        SyntaxKind[SyntaxKind["MinusMinusToken"] = 95] = "MinusMinusToken";
        SyntaxKind[SyntaxKind["LessThanLessThanToken"] = 96] = "LessThanLessThanToken";
        SyntaxKind[SyntaxKind["GreaterThanGreaterThanToken"] = 97] = "GreaterThanGreaterThanToken";
        SyntaxKind[SyntaxKind["GreaterThanGreaterThanGreaterThanToken"] = 98] = "GreaterThanGreaterThanGreaterThanToken";
        SyntaxKind[SyntaxKind["AmpersandToken"] = 99] = "AmpersandToken";
        SyntaxKind[SyntaxKind["BarToken"] = 100] = "BarToken";
        SyntaxKind[SyntaxKind["CaretToken"] = 101] = "CaretToken";
        SyntaxKind[SyntaxKind["ExclamationToken"] = 102] = "ExclamationToken";
        SyntaxKind[SyntaxKind["TildeToken"] = 103] = "TildeToken";
        SyntaxKind[SyntaxKind["AmpersandAmpersandToken"] = 104] = "AmpersandAmpersandToken";
        SyntaxKind[SyntaxKind["BarBarToken"] = 105] = "BarBarToken";
        SyntaxKind[SyntaxKind["QuestionToken"] = 106] = "QuestionToken";
        SyntaxKind[SyntaxKind["ColonToken"] = 107] = "ColonToken";
        SyntaxKind[SyntaxKind["EqualsToken"] = 108] = "EqualsToken";
        SyntaxKind[SyntaxKind["PlusEqualsToken"] = 109] = "PlusEqualsToken";
        SyntaxKind[SyntaxKind["MinusEqualsToken"] = 110] = "MinusEqualsToken";
        SyntaxKind[SyntaxKind["AsteriskEqualsToken"] = 111] = "AsteriskEqualsToken";
        SyntaxKind[SyntaxKind["PercentEqualsToken"] = 112] = "PercentEqualsToken";
        SyntaxKind[SyntaxKind["LessThanLessThanEqualsToken"] = 113] = "LessThanLessThanEqualsToken";
        SyntaxKind[SyntaxKind["GreaterThanGreaterThanEqualsToken"] = 114] = "GreaterThanGreaterThanEqualsToken";
        SyntaxKind[SyntaxKind["GreaterThanGreaterThanGreaterThanEqualsToken"] = 115] = "GreaterThanGreaterThanGreaterThanEqualsToken";
        SyntaxKind[SyntaxKind["AmpersandEqualsToken"] = 116] = "AmpersandEqualsToken";
        SyntaxKind[SyntaxKind["BarEqualsToken"] = 117] = "BarEqualsToken";
        SyntaxKind[SyntaxKind["CaretEqualsToken"] = 118] = "CaretEqualsToken";
        SyntaxKind[SyntaxKind["SlashToken"] = 119] = "SlashToken";
        SyntaxKind[SyntaxKind["SlashEqualsToken"] = 120] = "SlashEqualsToken";

        SyntaxKind[SyntaxKind["SourceUnit"] = 121] = "SourceUnit";

        SyntaxKind[SyntaxKind["QualifiedName"] = 122] = "QualifiedName";

        SyntaxKind[SyntaxKind["ObjectType"] = 123] = "ObjectType";
        SyntaxKind[SyntaxKind["FunctionType"] = 124] = "FunctionType";
        SyntaxKind[SyntaxKind["ArrayType"] = 125] = "ArrayType";
        SyntaxKind[SyntaxKind["ConstructorType"] = 126] = "ConstructorType";
        SyntaxKind[SyntaxKind["GenericType"] = 127] = "GenericType";

        SyntaxKind[SyntaxKind["InterfaceDeclaration"] = 128] = "InterfaceDeclaration";
        SyntaxKind[SyntaxKind["FunctionDeclaration"] = 129] = "FunctionDeclaration";
        SyntaxKind[SyntaxKind["ModuleDeclaration"] = 130] = "ModuleDeclaration";
        SyntaxKind[SyntaxKind["ClassDeclaration"] = 131] = "ClassDeclaration";
        SyntaxKind[SyntaxKind["EnumDeclaration"] = 132] = "EnumDeclaration";
        SyntaxKind[SyntaxKind["ImportDeclaration"] = 133] = "ImportDeclaration";
        SyntaxKind[SyntaxKind["ExportAssignment"] = 134] = "ExportAssignment";

        SyntaxKind[SyntaxKind["MemberFunctionDeclaration"] = 135] = "MemberFunctionDeclaration";
        SyntaxKind[SyntaxKind["MemberVariableDeclaration"] = 136] = "MemberVariableDeclaration";
        SyntaxKind[SyntaxKind["ConstructorDeclaration"] = 137] = "ConstructorDeclaration";
        SyntaxKind[SyntaxKind["GetMemberAccessorDeclaration"] = 138] = "GetMemberAccessorDeclaration";
        SyntaxKind[SyntaxKind["SetMemberAccessorDeclaration"] = 139] = "SetMemberAccessorDeclaration";

        SyntaxKind[SyntaxKind["PropertySignature"] = 140] = "PropertySignature";
        SyntaxKind[SyntaxKind["CallSignature"] = 141] = "CallSignature";
        SyntaxKind[SyntaxKind["ConstructSignature"] = 142] = "ConstructSignature";
        SyntaxKind[SyntaxKind["IndexSignature"] = 143] = "IndexSignature";
        SyntaxKind[SyntaxKind["MethodSignature"] = 144] = "MethodSignature";

        SyntaxKind[SyntaxKind["Block"] = 145] = "Block";
        SyntaxKind[SyntaxKind["IfStatement"] = 146] = "IfStatement";
        SyntaxKind[SyntaxKind["VariableStatement"] = 147] = "VariableStatement";
        SyntaxKind[SyntaxKind["ExpressionStatement"] = 148] = "ExpressionStatement";
        SyntaxKind[SyntaxKind["ReturnStatement"] = 149] = "ReturnStatement";
        SyntaxKind[SyntaxKind["SwitchStatement"] = 150] = "SwitchStatement";
        SyntaxKind[SyntaxKind["BreakStatement"] = 151] = "BreakStatement";
        SyntaxKind[SyntaxKind["ContinueStatement"] = 152] = "ContinueStatement";
        SyntaxKind[SyntaxKind["ForStatement"] = 153] = "ForStatement";
        SyntaxKind[SyntaxKind["ForInStatement"] = 154] = "ForInStatement";
        SyntaxKind[SyntaxKind["EmptyStatement"] = 155] = "EmptyStatement";
        SyntaxKind[SyntaxKind["ThrowStatement"] = 156] = "ThrowStatement";
        SyntaxKind[SyntaxKind["WhileStatement"] = 157] = "WhileStatement";
        SyntaxKind[SyntaxKind["TryStatement"] = 158] = "TryStatement";
        SyntaxKind[SyntaxKind["LabeledStatement"] = 159] = "LabeledStatement";
        SyntaxKind[SyntaxKind["DoStatement"] = 160] = "DoStatement";
        SyntaxKind[SyntaxKind["DebuggerStatement"] = 161] = "DebuggerStatement";
        SyntaxKind[SyntaxKind["WithStatement"] = 162] = "WithStatement";

        SyntaxKind[SyntaxKind["PlusExpression"] = 163] = "PlusExpression";
        SyntaxKind[SyntaxKind["NegateExpression"] = 164] = "NegateExpression";
        SyntaxKind[SyntaxKind["BitwiseNotExpression"] = 165] = "BitwiseNotExpression";
        SyntaxKind[SyntaxKind["LogicalNotExpression"] = 166] = "LogicalNotExpression";
        SyntaxKind[SyntaxKind["PreIncrementExpression"] = 167] = "PreIncrementExpression";
        SyntaxKind[SyntaxKind["PreDecrementExpression"] = 168] = "PreDecrementExpression";
        SyntaxKind[SyntaxKind["DeleteExpression"] = 169] = "DeleteExpression";
        SyntaxKind[SyntaxKind["TypeOfExpression"] = 170] = "TypeOfExpression";
        SyntaxKind[SyntaxKind["VoidExpression"] = 171] = "VoidExpression";
        SyntaxKind[SyntaxKind["CommaExpression"] = 172] = "CommaExpression";
        SyntaxKind[SyntaxKind["AssignmentExpression"] = 173] = "AssignmentExpression";
        SyntaxKind[SyntaxKind["AddAssignmentExpression"] = 174] = "AddAssignmentExpression";
        SyntaxKind[SyntaxKind["SubtractAssignmentExpression"] = 175] = "SubtractAssignmentExpression";
        SyntaxKind[SyntaxKind["MultiplyAssignmentExpression"] = 176] = "MultiplyAssignmentExpression";
        SyntaxKind[SyntaxKind["DivideAssignmentExpression"] = 177] = "DivideAssignmentExpression";
        SyntaxKind[SyntaxKind["ModuloAssignmentExpression"] = 178] = "ModuloAssignmentExpression";
        SyntaxKind[SyntaxKind["AndAssignmentExpression"] = 179] = "AndAssignmentExpression";
        SyntaxKind[SyntaxKind["ExclusiveOrAssignmentExpression"] = 180] = "ExclusiveOrAssignmentExpression";
        SyntaxKind[SyntaxKind["OrAssignmentExpression"] = 181] = "OrAssignmentExpression";
        SyntaxKind[SyntaxKind["LeftShiftAssignmentExpression"] = 182] = "LeftShiftAssignmentExpression";
        SyntaxKind[SyntaxKind["SignedRightShiftAssignmentExpression"] = 183] = "SignedRightShiftAssignmentExpression";
        SyntaxKind[SyntaxKind["UnsignedRightShiftAssignmentExpression"] = 184] = "UnsignedRightShiftAssignmentExpression";
        SyntaxKind[SyntaxKind["ConditionalExpression"] = 185] = "ConditionalExpression";
        SyntaxKind[SyntaxKind["LogicalOrExpression"] = 186] = "LogicalOrExpression";
        SyntaxKind[SyntaxKind["LogicalAndExpression"] = 187] = "LogicalAndExpression";
        SyntaxKind[SyntaxKind["BitwiseOrExpression"] = 188] = "BitwiseOrExpression";
        SyntaxKind[SyntaxKind["BitwiseExclusiveOrExpression"] = 189] = "BitwiseExclusiveOrExpression";
        SyntaxKind[SyntaxKind["BitwiseAndExpression"] = 190] = "BitwiseAndExpression";
        SyntaxKind[SyntaxKind["EqualsWithTypeConversionExpression"] = 191] = "EqualsWithTypeConversionExpression";
        SyntaxKind[SyntaxKind["NotEqualsWithTypeConversionExpression"] = 192] = "NotEqualsWithTypeConversionExpression";
        SyntaxKind[SyntaxKind["EqualsExpression"] = 193] = "EqualsExpression";
        SyntaxKind[SyntaxKind["NotEqualsExpression"] = 194] = "NotEqualsExpression";
        SyntaxKind[SyntaxKind["LessThanExpression"] = 195] = "LessThanExpression";
        SyntaxKind[SyntaxKind["GreaterThanExpression"] = 196] = "GreaterThanExpression";
        SyntaxKind[SyntaxKind["LessThanOrEqualExpression"] = 197] = "LessThanOrEqualExpression";
        SyntaxKind[SyntaxKind["GreaterThanOrEqualExpression"] = 198] = "GreaterThanOrEqualExpression";
        SyntaxKind[SyntaxKind["InstanceOfExpression"] = 199] = "InstanceOfExpression";
        SyntaxKind[SyntaxKind["InExpression"] = 200] = "InExpression";
        SyntaxKind[SyntaxKind["LeftShiftExpression"] = 201] = "LeftShiftExpression";
        SyntaxKind[SyntaxKind["SignedRightShiftExpression"] = 202] = "SignedRightShiftExpression";
        SyntaxKind[SyntaxKind["UnsignedRightShiftExpression"] = 203] = "UnsignedRightShiftExpression";
        SyntaxKind[SyntaxKind["MultiplyExpression"] = 204] = "MultiplyExpression";
        SyntaxKind[SyntaxKind["DivideExpression"] = 205] = "DivideExpression";
        SyntaxKind[SyntaxKind["ModuloExpression"] = 206] = "ModuloExpression";
        SyntaxKind[SyntaxKind["AddExpression"] = 207] = "AddExpression";
        SyntaxKind[SyntaxKind["SubtractExpression"] = 208] = "SubtractExpression";
        SyntaxKind[SyntaxKind["PostIncrementExpression"] = 209] = "PostIncrementExpression";
        SyntaxKind[SyntaxKind["PostDecrementExpression"] = 210] = "PostDecrementExpression";
        SyntaxKind[SyntaxKind["MemberAccessExpression"] = 211] = "MemberAccessExpression";
        SyntaxKind[SyntaxKind["InvocationExpression"] = 212] = "InvocationExpression";
        SyntaxKind[SyntaxKind["ArrayLiteralExpression"] = 213] = "ArrayLiteralExpression";
        SyntaxKind[SyntaxKind["ObjectLiteralExpression"] = 214] = "ObjectLiteralExpression";
        SyntaxKind[SyntaxKind["ObjectCreationExpression"] = 215] = "ObjectCreationExpression";
        SyntaxKind[SyntaxKind["ParenthesizedExpression"] = 216] = "ParenthesizedExpression";
        SyntaxKind[SyntaxKind["ParenthesizedArrowFunctionExpression"] = 217] = "ParenthesizedArrowFunctionExpression";
        SyntaxKind[SyntaxKind["SimpleArrowFunctionExpression"] = 218] = "SimpleArrowFunctionExpression";
        SyntaxKind[SyntaxKind["CastExpression"] = 219] = "CastExpression";
        SyntaxKind[SyntaxKind["ElementAccessExpression"] = 220] = "ElementAccessExpression";
        SyntaxKind[SyntaxKind["FunctionExpression"] = 221] = "FunctionExpression";
        SyntaxKind[SyntaxKind["OmittedExpression"] = 222] = "OmittedExpression";

        SyntaxKind[SyntaxKind["VariableDeclaration"] = 223] = "VariableDeclaration";
        SyntaxKind[SyntaxKind["VariableDeclarator"] = 224] = "VariableDeclarator";

        SyntaxKind[SyntaxKind["ArgumentList"] = 225] = "ArgumentList";
        SyntaxKind[SyntaxKind["ParameterList"] = 226] = "ParameterList";
        SyntaxKind[SyntaxKind["TypeArgumentList"] = 227] = "TypeArgumentList";
        SyntaxKind[SyntaxKind["TypeParameterList"] = 228] = "TypeParameterList";

        SyntaxKind[SyntaxKind["HeritageClause"] = 229] = "HeritageClause";
        SyntaxKind[SyntaxKind["EqualsValueClause"] = 230] = "EqualsValueClause";
        SyntaxKind[SyntaxKind["CaseSwitchClause"] = 231] = "CaseSwitchClause";
        SyntaxKind[SyntaxKind["DefaultSwitchClause"] = 232] = "DefaultSwitchClause";
        SyntaxKind[SyntaxKind["ElseClause"] = 233] = "ElseClause";
        SyntaxKind[SyntaxKind["CatchClause"] = 234] = "CatchClause";
        SyntaxKind[SyntaxKind["FinallyClause"] = 235] = "FinallyClause";

        SyntaxKind[SyntaxKind["TypeParameter"] = 236] = "TypeParameter";
        SyntaxKind[SyntaxKind["Constraint"] = 237] = "Constraint";

        SyntaxKind[SyntaxKind["SimplePropertyAssignment"] = 238] = "SimplePropertyAssignment";
        SyntaxKind[SyntaxKind["GetAccessorPropertyAssignment"] = 239] = "GetAccessorPropertyAssignment";
        SyntaxKind[SyntaxKind["SetAccessorPropertyAssignment"] = 240] = "SetAccessorPropertyAssignment";
        SyntaxKind[SyntaxKind["FunctionPropertyAssignment"] = 241] = "FunctionPropertyAssignment";

        SyntaxKind[SyntaxKind["Parameter"] = 242] = "Parameter";
        SyntaxKind[SyntaxKind["EnumElement"] = 243] = "EnumElement";
        SyntaxKind[SyntaxKind["TypeAnnotation"] = 244] = "TypeAnnotation";
        SyntaxKind[SyntaxKind["ExternalModuleReference"] = 245] = "ExternalModuleReference";
        SyntaxKind[SyntaxKind["ModuleNameModuleReference"] = 246] = "ModuleNameModuleReference";

        SyntaxKind[SyntaxKind["FirstStandardKeyword"] = SyntaxKind.BreakKeyword] = "FirstStandardKeyword";
        SyntaxKind[SyntaxKind["LastStandardKeyword"] = SyntaxKind.WithKeyword] = "LastStandardKeyword";

        SyntaxKind[SyntaxKind["FirstFutureReservedKeyword"] = SyntaxKind.ClassKeyword] = "FirstFutureReservedKeyword";
        SyntaxKind[SyntaxKind["LastFutureReservedKeyword"] = SyntaxKind.SuperKeyword] = "LastFutureReservedKeyword";

        SyntaxKind[SyntaxKind["FirstFutureReservedStrictKeyword"] = SyntaxKind.ImplementsKeyword] = "FirstFutureReservedStrictKeyword";
        SyntaxKind[SyntaxKind["LastFutureReservedStrictKeyword"] = SyntaxKind.YieldKeyword] = "LastFutureReservedStrictKeyword";

        SyntaxKind[SyntaxKind["FirstTypeScriptKeyword"] = SyntaxKind.AnyKeyword] = "FirstTypeScriptKeyword";
        SyntaxKind[SyntaxKind["LastTypeScriptKeyword"] = SyntaxKind.StringKeyword] = "LastTypeScriptKeyword";

        SyntaxKind[SyntaxKind["FirstKeyword"] = SyntaxKind.FirstStandardKeyword] = "FirstKeyword";
        SyntaxKind[SyntaxKind["LastKeyword"] = SyntaxKind.LastTypeScriptKeyword] = "LastKeyword";

        SyntaxKind[SyntaxKind["FirstToken"] = SyntaxKind.ErrorToken] = "FirstToken";
        SyntaxKind[SyntaxKind["LastToken"] = SyntaxKind.SlashEqualsToken] = "LastToken";

        SyntaxKind[SyntaxKind["FirstPunctuation"] = SyntaxKind.OpenBraceToken] = "FirstPunctuation";
        SyntaxKind[SyntaxKind["LastPunctuation"] = SyntaxKind.SlashEqualsToken] = "LastPunctuation";

        SyntaxKind[SyntaxKind["FirstFixedWidth"] = SyntaxKind.FirstKeyword] = "FirstFixedWidth";
        SyntaxKind[SyntaxKind["LastFixedWidth"] = SyntaxKind.LastPunctuation] = "LastFixedWidth";
    })(TypeScript.SyntaxKind || (TypeScript.SyntaxKind = {}));
    var SyntaxKind = TypeScript.SyntaxKind;
})(TypeScript || (TypeScript = {}));
var TypeScript;
(function (TypeScript) {
    (function (SyntaxFacts) {
        var textToKeywordKind = {
            "any": 60 /* AnyKeyword */,
            "bool": 62 /* BoolKeyword */,
            "boolean": 61 /* BooleanKeyword */,
            "break": 15 /* BreakKeyword */,
            "case": 16 /* CaseKeyword */,
            "catch": 17 /* CatchKeyword */,
            "class": 44 /* ClassKeyword */,
            "continue": 18 /* ContinueKeyword */,
            "const": 45 /* ConstKeyword */,
            "constructor": 63 /* ConstructorKeyword */,
            "debugger": 19 /* DebuggerKeyword */,
            "declare": 64 /* DeclareKeyword */,
            "default": 20 /* DefaultKeyword */,
            "delete": 21 /* DeleteKeyword */,
            "do": 22 /* DoKeyword */,
            "else": 23 /* ElseKeyword */,
            "enum": 46 /* EnumKeyword */,
            "export": 47 /* ExportKeyword */,
            "extends": 48 /* ExtendsKeyword */,
            "false": 24 /* FalseKeyword */,
            "finally": 25 /* FinallyKeyword */,
            "for": 26 /* ForKeyword */,
            "function": 27 /* FunctionKeyword */,
            "get": 65 /* GetKeyword */,
            "if": 28 /* IfKeyword */,
            "implements": 51 /* ImplementsKeyword */,
            "import": 49 /* ImportKeyword */,
            "in": 29 /* InKeyword */,
            "instanceof": 30 /* InstanceOfKeyword */,
            "interface": 52 /* InterfaceKeyword */,
            "let": 53 /* LetKeyword */,
            "module": 66 /* ModuleKeyword */,
            "new": 31 /* NewKeyword */,
            "null": 32 /* NullKeyword */,
            "number": 68 /* NumberKeyword */,
            "package": 54 /* PackageKeyword */,
            "private": 55 /* PrivateKeyword */,
            "protected": 56 /* ProtectedKeyword */,
            "public": 57 /* PublicKeyword */,
            "require": 67 /* RequireKeyword */,
            "return": 33 /* ReturnKeyword */,
            "set": 69 /* SetKeyword */,
            "static": 58 /* StaticKeyword */,
            "string": 70 /* StringKeyword */,
            "super": 50 /* SuperKeyword */,
            "switch": 34 /* SwitchKeyword */,
            "this": 35 /* ThisKeyword */,
            "throw": 36 /* ThrowKeyword */,
            "true": 37 /* TrueKeyword */,
            "try": 38 /* TryKeyword */,
            "typeof": 39 /* TypeOfKeyword */,
            "var": 40 /* VarKeyword */,
            "void": 41 /* VoidKeyword */,
            "while": 42 /* WhileKeyword */,
            "with": 43 /* WithKeyword */,
            "yield": 59 /* YieldKeyword */,
            "{": 71 /* OpenBraceToken */,
            "}": 72 /* CloseBraceToken */,
            "(": 73 /* OpenParenToken */,
            ")": 74 /* CloseParenToken */,
            "[": 75 /* OpenBracketToken */,
            "]": 76 /* CloseBracketToken */,
            ".": 77 /* DotToken */,
            "...": 78 /* DotDotDotToken */,
            ";": 79 /* SemicolonToken */,
            ",": 80 /* CommaToken */,
            "<": 81 /* LessThanToken */,
            ">": 82 /* GreaterThanToken */,
            "<=": 83 /* LessThanEqualsToken */,
            ">=": 84 /* GreaterThanEqualsToken */,
            "==": 85 /* EqualsEqualsToken */,
            "=>": 86 /* EqualsGreaterThanToken */,
            "!=": 87 /* ExclamationEqualsToken */,
            "===": 88 /* EqualsEqualsEqualsToken */,
            "!==": 89 /* ExclamationEqualsEqualsToken */,
            "+": 90 /* PlusToken */,
            "-": 91 /* MinusToken */,
            "*": 92 /* AsteriskToken */,
            "%": 93 /* PercentToken */,
            "++": 94 /* PlusPlusToken */,
            "--": 95 /* MinusMinusToken */,
            "<<": 96 /* LessThanLessThanToken */,
            ">>": 97 /* GreaterThanGreaterThanToken */,
            ">>>": 98 /* GreaterThanGreaterThanGreaterThanToken */,
            "&": 99 /* AmpersandToken */,
            "|": 100 /* BarToken */,
            "^": 101 /* CaretToken */,
            "!": 102 /* ExclamationToken */,
            "~": 103 /* TildeToken */,
            "&&": 104 /* AmpersandAmpersandToken */,
            "||": 105 /* BarBarToken */,
            "?": 106 /* QuestionToken */,
            ":": 107 /* ColonToken */,
            "=": 108 /* EqualsToken */,
            "+=": 109 /* PlusEqualsToken */,
            "-=": 110 /* MinusEqualsToken */,
            "*=": 111 /* AsteriskEqualsToken */,
            "%=": 112 /* PercentEqualsToken */,
            "<<=": 113 /* LessThanLessThanEqualsToken */,
            ">>=": 114 /* GreaterThanGreaterThanEqualsToken */,
            ">>>=": 115 /* GreaterThanGreaterThanGreaterThanEqualsToken */,
            "&=": 116 /* AmpersandEqualsToken */,
            "|=": 117 /* BarEqualsToken */,
            "^=": 118 /* CaretEqualsToken */,
            "/": 119 /* SlashToken */,
            "/=": 120 /* SlashEqualsToken */
        };

        var kindToText = [];

        for (var name in textToKeywordKind) {
            if (textToKeywordKind.hasOwnProperty(name)) {
                kindToText[textToKeywordKind[name]] = name;
            }
        }

        kindToText[63 /* ConstructorKeyword */] = "constructor";

        function getTokenKind(text) {
            if (textToKeywordKind.hasOwnProperty(text)) {
                return textToKeywordKind[text];
            }

            return 0 /* None */;
        }
        SyntaxFacts.getTokenKind = getTokenKind;

        function getText(kind) {
            var result = kindToText[kind];
            return result !== undefined ? result : null;
        }
        SyntaxFacts.getText = getText;

        function isTokenKind(kind) {
            return kind >= 9 /* FirstToken */ && kind <= 120 /* LastToken */;
        }
        SyntaxFacts.isTokenKind = isTokenKind;

        function isAnyKeyword(kind) {
            return kind >= TypeScript.SyntaxKind.FirstKeyword && kind <= TypeScript.SyntaxKind.LastKeyword;
        }
        SyntaxFacts.isAnyKeyword = isAnyKeyword;

        function isStandardKeyword(kind) {
            return kind >= 15 /* FirstStandardKeyword */ && kind <= 43 /* LastStandardKeyword */;
        }
        SyntaxFacts.isStandardKeyword = isStandardKeyword;

        function isFutureReservedKeyword(kind) {
            return kind >= 44 /* FirstFutureReservedKeyword */ && kind <= 50 /* LastFutureReservedKeyword */;
        }
        SyntaxFacts.isFutureReservedKeyword = isFutureReservedKeyword;

        function isFutureReservedStrictKeyword(kind) {
            return kind >= 51 /* FirstFutureReservedStrictKeyword */ && kind <= 59 /* LastFutureReservedStrictKeyword */;
        }
        SyntaxFacts.isFutureReservedStrictKeyword = isFutureReservedStrictKeyword;

        function isAnyPunctuation(kind) {
            return kind >= 71 /* FirstPunctuation */ && kind <= 120 /* LastPunctuation */;
        }
        SyntaxFacts.isAnyPunctuation = isAnyPunctuation;

        function isPrefixUnaryExpressionOperatorToken(tokenKind) {
            return getPrefixUnaryExpressionFromOperatorToken(tokenKind) !== 0 /* None */;
        }
        SyntaxFacts.isPrefixUnaryExpressionOperatorToken = isPrefixUnaryExpressionOperatorToken;

        function isBinaryExpressionOperatorToken(tokenKind) {
            return getBinaryExpressionFromOperatorToken(tokenKind) !== 0 /* None */;
        }
        SyntaxFacts.isBinaryExpressionOperatorToken = isBinaryExpressionOperatorToken;

        function getPrefixUnaryExpressionFromOperatorToken(tokenKind) {
            switch (tokenKind) {
                case 90 /* PlusToken */:
                    return 163 /* PlusExpression */;
                case 91 /* MinusToken */:
                    return 164 /* NegateExpression */;
                case 103 /* TildeToken */:
                    return 165 /* BitwiseNotExpression */;
                case 102 /* ExclamationToken */:
                    return 166 /* LogicalNotExpression */;
                case 94 /* PlusPlusToken */:
                    return 167 /* PreIncrementExpression */;
                case 95 /* MinusMinusToken */:
                    return 168 /* PreDecrementExpression */;

                default:
                    return 0 /* None */;
            }
        }
        SyntaxFacts.getPrefixUnaryExpressionFromOperatorToken = getPrefixUnaryExpressionFromOperatorToken;

        function getPostfixUnaryExpressionFromOperatorToken(tokenKind) {
            switch (tokenKind) {
                case 94 /* PlusPlusToken */:
                    return 209 /* PostIncrementExpression */;
                case 95 /* MinusMinusToken */:
                    return 210 /* PostDecrementExpression */;
                default:
                    return 0 /* None */;
            }
        }
        SyntaxFacts.getPostfixUnaryExpressionFromOperatorToken = getPostfixUnaryExpressionFromOperatorToken;

        function getBinaryExpressionFromOperatorToken(tokenKind) {
            switch (tokenKind) {
                case 92 /* AsteriskToken */:
                    return 204 /* MultiplyExpression */;

                case 119 /* SlashToken */:
                    return 205 /* DivideExpression */;

                case 93 /* PercentToken */:
                    return 206 /* ModuloExpression */;

                case 90 /* PlusToken */:
                    return 207 /* AddExpression */;

                case 91 /* MinusToken */:
                    return 208 /* SubtractExpression */;

                case 96 /* LessThanLessThanToken */:
                    return 201 /* LeftShiftExpression */;

                case 97 /* GreaterThanGreaterThanToken */:
                    return 202 /* SignedRightShiftExpression */;

                case 98 /* GreaterThanGreaterThanGreaterThanToken */:
                    return 203 /* UnsignedRightShiftExpression */;

                case 81 /* LessThanToken */:
                    return 195 /* LessThanExpression */;

                case 82 /* GreaterThanToken */:
                    return 196 /* GreaterThanExpression */;

                case 83 /* LessThanEqualsToken */:
                    return 197 /* LessThanOrEqualExpression */;

                case 84 /* GreaterThanEqualsToken */:
                    return 198 /* GreaterThanOrEqualExpression */;

                case 30 /* InstanceOfKeyword */:
                    return 199 /* InstanceOfExpression */;

                case 29 /* InKeyword */:
                    return 200 /* InExpression */;

                case 85 /* EqualsEqualsToken */:
                    return 191 /* EqualsWithTypeConversionExpression */;

                case 87 /* ExclamationEqualsToken */:
                    return 192 /* NotEqualsWithTypeConversionExpression */;

                case 88 /* EqualsEqualsEqualsToken */:
                    return 193 /* EqualsExpression */;

                case 89 /* ExclamationEqualsEqualsToken */:
                    return 194 /* NotEqualsExpression */;

                case 99 /* AmpersandToken */:
                    return 190 /* BitwiseAndExpression */;

                case 101 /* CaretToken */:
                    return 189 /* BitwiseExclusiveOrExpression */;

                case 100 /* BarToken */:
                    return 188 /* BitwiseOrExpression */;

                case 104 /* AmpersandAmpersandToken */:
                    return 187 /* LogicalAndExpression */;

                case 105 /* BarBarToken */:
                    return 186 /* LogicalOrExpression */;

                case 117 /* BarEqualsToken */:
                    return 181 /* OrAssignmentExpression */;

                case 116 /* AmpersandEqualsToken */:
                    return 179 /* AndAssignmentExpression */;

                case 118 /* CaretEqualsToken */:
                    return 180 /* ExclusiveOrAssignmentExpression */;

                case 113 /* LessThanLessThanEqualsToken */:
                    return 182 /* LeftShiftAssignmentExpression */;

                case 114 /* GreaterThanGreaterThanEqualsToken */:
                    return 183 /* SignedRightShiftAssignmentExpression */;

                case 115 /* GreaterThanGreaterThanGreaterThanEqualsToken */:
                    return 184 /* UnsignedRightShiftAssignmentExpression */;

                case 109 /* PlusEqualsToken */:
                    return 174 /* AddAssignmentExpression */;

                case 110 /* MinusEqualsToken */:
                    return 175 /* SubtractAssignmentExpression */;

                case 111 /* AsteriskEqualsToken */:
                    return 176 /* MultiplyAssignmentExpression */;

                case 120 /* SlashEqualsToken */:
                    return 177 /* DivideAssignmentExpression */;

                case 112 /* PercentEqualsToken */:
                    return 178 /* ModuloAssignmentExpression */;

                case 108 /* EqualsToken */:
                    return 173 /* AssignmentExpression */;

                case 80 /* CommaToken */:
                    return 172 /* CommaExpression */;

                default:
                    return 0 /* None */;
            }
        }
        SyntaxFacts.getBinaryExpressionFromOperatorToken = getBinaryExpressionFromOperatorToken;

        function isAnyDivideToken(kind) {
            switch (kind) {
                case 119 /* SlashToken */:
                case 120 /* SlashEqualsToken */:
                    return true;
                default:
                    return false;
            }
        }
        SyntaxFacts.isAnyDivideToken = isAnyDivideToken;

        function isAnyDivideOrRegularExpressionToken(kind) {
            switch (kind) {
                case 119 /* SlashToken */:
                case 120 /* SlashEqualsToken */:
                case 12 /* RegularExpressionLiteral */:
                    return true;
                default:
                    return false;
            }
        }
        SyntaxFacts.isAnyDivideOrRegularExpressionToken = isAnyDivideOrRegularExpressionToken;

        function isParserGenerated(kind) {
            switch (kind) {
                case 97 /* GreaterThanGreaterThanToken */:
                case 98 /* GreaterThanGreaterThanGreaterThanToken */:
                case 84 /* GreaterThanEqualsToken */:
                case 114 /* GreaterThanGreaterThanEqualsToken */:
                case 115 /* GreaterThanGreaterThanGreaterThanEqualsToken */:
                    return true;
                default:
                    return false;
            }
        }
        SyntaxFacts.isParserGenerated = isParserGenerated;

        function isAnyBinaryExpression(kind) {
            switch (kind) {
                case 172 /* CommaExpression */:
                case 173 /* AssignmentExpression */:
                case 174 /* AddAssignmentExpression */:
                case 175 /* SubtractAssignmentExpression */:
                case 176 /* MultiplyAssignmentExpression */:
                case 177 /* DivideAssignmentExpression */:
                case 178 /* ModuloAssignmentExpression */:
                case 179 /* AndAssignmentExpression */:
                case 180 /* ExclusiveOrAssignmentExpression */:
                case 181 /* OrAssignmentExpression */:
                case 182 /* LeftShiftAssignmentExpression */:
                case 183 /* SignedRightShiftAssignmentExpression */:
                case 184 /* UnsignedRightShiftAssignmentExpression */:
                case 186 /* LogicalOrExpression */:
                case 187 /* LogicalAndExpression */:
                case 188 /* BitwiseOrExpression */:
                case 189 /* BitwiseExclusiveOrExpression */:
                case 190 /* BitwiseAndExpression */:
                case 191 /* EqualsWithTypeConversionExpression */:
                case 192 /* NotEqualsWithTypeConversionExpression */:
                case 193 /* EqualsExpression */:
                case 194 /* NotEqualsExpression */:
                case 195 /* LessThanExpression */:
                case 196 /* GreaterThanExpression */:
                case 197 /* LessThanOrEqualExpression */:
                case 198 /* GreaterThanOrEqualExpression */:
                case 199 /* InstanceOfExpression */:
                case 200 /* InExpression */:
                case 201 /* LeftShiftExpression */:
                case 202 /* SignedRightShiftExpression */:
                case 203 /* UnsignedRightShiftExpression */:
                case 204 /* MultiplyExpression */:
                case 205 /* DivideExpression */:
                case 206 /* ModuloExpression */:
                case 207 /* AddExpression */:
                case 208 /* SubtractExpression */:
                    return true;
            }

            return false;
        }
        SyntaxFacts.isAnyBinaryExpression = isAnyBinaryExpression;
    })(TypeScript.SyntaxFacts || (TypeScript.SyntaxFacts = {}));
    var SyntaxFacts = TypeScript.SyntaxFacts;
})(TypeScript || (TypeScript = {}));
var argumentChecks = false;
var forPrettyPrinter = false;

var interfaces = {
    IMemberDeclarationSyntax: 'IClassElementSyntax',
    IStatementSyntax: 'IModuleElementSyntax',
    INameSyntax: 'ITypeSyntax',
    ITypeSyntax: 'IUnaryExpressionSyntax',
    IUnaryExpressionSyntax: 'IExpressionSyntax'
};

var definitions = [
    {
        name: 'SourceUnitSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'moduleElements', isList: true, elementType: 'IModuleElementSyntax' },
            { name: 'endOfFileToken', isToken: true }
        ]
    },
    {
        name: 'ModuleReferenceSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IModuleReferenceSyntax'],
        isAbstract: true,
        children: [],
        isTypeScriptSpecific: true
    },
    {
        name: 'ExternalModuleReferenceSyntax',
        baseType: 'ModuleReferenceSyntax',
        children: [
            { name: 'moduleOrRequireKeyword', isToken: true, tokenKinds: ['ModuleKeyword', 'RequireKeyword'] },
            { name: 'openParenToken', isToken: true },
            { name: 'stringLiteral', isToken: true },
            { name: 'closeParenToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ModuleNameModuleReferenceSyntax',
        baseType: 'ModuleReferenceSyntax',
        children: [
            { name: 'moduleName', type: 'INameSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ImportDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IModuleElementSyntax'],
        children: [
            { name: 'importKeyword', isToken: true },
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'equalsToken', isToken: true },
            { name: 'moduleReference', type: 'ModuleReferenceSyntax' },
            { name: 'semicolonToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ExportAssignmentSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IModuleElementSyntax'],
        children: [
            { name: 'exportKeyword', isToken: true },
            { name: 'equalsToken', isToken: true },
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'semicolonToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ClassDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IModuleElementSyntax'],
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'classKeyword', isToken: true },
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'typeParameterList', type: 'TypeParameterListSyntax', isOptional: true },
            { name: 'heritageClauses', isList: true, elementType: 'HeritageClauseSyntax' },
            { name: 'openBraceToken', isToken: true },
            { name: 'classElements', isList: true, elementType: 'IClassElementSyntax' },
            { name: 'closeBraceToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'InterfaceDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IModuleElementSyntax'],
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'interfaceKeyword', isToken: true },
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'typeParameterList', type: 'TypeParameterListSyntax', isOptional: true },
            { name: 'heritageClauses', isList: true, elementType: 'HeritageClauseSyntax' },
            { name: 'body', type: 'ObjectTypeSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'HeritageClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'extendsOrImplementsKeyword', isToken: true, tokenKinds: ['ExtendsKeyword', 'ImplementsKeyword'] },
            { name: 'typeNames', isSeparatedList: true, requiresAtLeastOneItem: true, elementType: 'INameSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ModuleDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IModuleElementSyntax'],
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'moduleKeyword', isToken: true },
            { name: 'moduleName', type: 'INameSyntax', isOptional: true },
            { name: 'stringLiteral', isToken: true, isOptional: true },
            { name: 'openBraceToken', isToken: true },
            { name: 'moduleElements', isList: true, elementType: 'IModuleElementSyntax' },
            { name: 'closeBraceToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'FunctionDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'functionKeyword', isToken: true },
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'callSignature', type: 'CallSignatureSyntax' },
            { name: 'block', type: 'BlockSyntax', isOptional: true },
            { name: 'semicolonToken', isToken: true, isOptional: true }
        ]
    },
    {
        name: 'VariableStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'variableDeclaration', type: 'VariableDeclarationSyntax' },
            { name: 'semicolonToken', isToken: true }
        ]
    },
    {
        name: 'VariableDeclarationSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'varKeyword', isToken: true },
            { name: 'variableDeclarators', isSeparatedList: true, requiresAtLeastOneItem: true, elementType: 'VariableDeclaratorSyntax' }
        ]
    },
    {
        name: 'VariableDeclaratorSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true, isTypeScriptSpecific: true },
            { name: 'equalsValueClause', type: 'EqualsValueClauseSyntax', isOptional: true }
        ]
    },
    {
        name: 'EqualsValueClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'equalsToken', isToken: true },
            { name: 'value', type: 'IExpressionSyntax' }
        ]
    },
    {
        name: 'PrefixUnaryExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'kind', type: 'SyntaxKind' },
            { name: 'operatorToken', isToken: true, tokenKinds: ['PlusPlusToken', 'MinusMinusToken', 'PlusToken', 'MinusToken', 'TildeToken', 'ExclamationToken'] },
            { name: 'operand', type: 'IUnaryExpressionSyntax' }
        ]
    },
    {
        name: 'ArrayLiteralExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'openBracketToken', isToken: true },
            { name: 'expressions', isSeparatedList: true, elementType: 'IExpressionSyntax' },
            { name: 'closeBracketToken', isToken: true }
        ]
    },
    {
        name: 'OmittedExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IExpressionSyntax'],
        children: []
    },
    {
        name: 'ParenthesizedExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'openParenToken', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'closeParenToken', isToken: true }
        ]
    },
    {
        name: 'ArrowFunctionExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        isAbstract: true,
        children: [],
        isTypeScriptSpecific: true
    },
    {
        name: 'SimpleArrowFunctionExpressionSyntax',
        baseType: 'ArrowFunctionExpressionSyntax',
        children: [
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'equalsGreaterThanToken', isToken: true },
            { name: 'body', type: 'ISyntaxNodeOrToken' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ParenthesizedArrowFunctionExpressionSyntax',
        baseType: 'ArrowFunctionExpressionSyntax',
        children: [
            { name: 'callSignature', type: 'CallSignatureSyntax' },
            { name: 'equalsGreaterThanToken', isToken: true },
            { name: 'body', type: 'ISyntaxNodeOrToken' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'QualifiedNameSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['INameSyntax'],
        children: [
            { name: 'left', type: 'INameSyntax' },
            { name: 'dotToken', isToken: true },
            { name: 'right', isToken: true, tokenKinds: ['IdentifierName'] }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'TypeArgumentListSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'lessThanToken', isToken: true },
            { name: 'typeArguments', isSeparatedList: true, elementType: 'ITypeSyntax' },
            { name: 'greaterThanToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ConstructorTypeSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeSyntax'],
        children: [
            { name: 'newKeyword', isToken: true },
            { name: 'typeParameterList', type: 'TypeParameterListSyntax', isOptional: true },
            { name: 'parameterList', type: 'ParameterListSyntax' },
            { name: 'equalsGreaterThanToken', isToken: true },
            { name: 'type', type: 'ITypeSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'FunctionTypeSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeSyntax'],
        children: [
            { name: 'typeParameterList', type: 'TypeParameterListSyntax', isOptional: true },
            { name: 'parameterList', type: 'ParameterListSyntax' },
            { name: 'equalsGreaterThanToken', isToken: true },
            { name: 'type', type: 'ITypeSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ObjectTypeSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeSyntax'],
        children: [
            { name: 'openBraceToken', isToken: true },
            { name: 'typeMembers', isSeparatedList: true, elementType: 'ITypeMemberSyntax' },
            { name: 'closeBraceToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ArrayTypeSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeSyntax'],
        children: [
            { name: 'type', type: 'ITypeSyntax' },
            { name: 'openBracketToken', isToken: true },
            { name: 'closeBracketToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'GenericTypeSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeSyntax'],
        children: [
            { name: 'name', type: 'INameSyntax' },
            { name: 'typeArgumentList', type: 'TypeArgumentListSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'TypeAnnotationSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'colonToken', isToken: true },
            { name: 'type', type: 'ITypeSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'BlockSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'openBraceToken', isToken: true },
            { name: 'statements', isList: true, elementType: 'IStatementSyntax' },
            { name: 'closeBraceToken', isToken: true }
        ]
    },
    {
        name: 'ParameterSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'dotDotDotToken', isToken: true, isOptional: true, isTypeScriptSpecific: true },
            { name: 'publicOrPrivateKeyword', isToken: true, isOptional: true, tokenKinds: ['PublicKeyword', 'PrivateKeyword'], isTypeScriptSpecific: true },
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'questionToken', isToken: true, isOptional: true, isTypeScriptSpecific: true },
            { name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true, isTypeScriptSpecific: true },
            { name: 'equalsValueClause', type: 'EqualsValueClauseSyntax', isOptional: true, isTypeScriptSpecific: true }
        ]
    },
    {
        name: 'MemberAccessExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'dotToken', isToken: true },
            { name: 'name', isToken: true, tokenKinds: ['IdentifierName'] }
        ]
    },
    {
        name: 'PostfixUnaryExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'kind', type: 'SyntaxKind' },
            { name: 'operand', type: 'IExpressionSyntax' },
            { name: 'operatorToken', isToken: true, tokenKinds: ['PlusPlusToken', 'MinusMinusToken'] }
        ]
    },
    {
        name: 'ElementAccessExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'openBracketToken', isToken: true },
            { name: 'argumentExpression', type: 'IExpressionSyntax' },
            { name: 'closeBracketToken', isToken: true }
        ]
    },
    {
        name: 'InvocationExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'argumentList', type: 'ArgumentListSyntax' }
        ]
    },
    {
        name: 'ArgumentListSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'typeArgumentList', type: 'TypeArgumentListSyntax', isOptional: true },
            { name: 'openParenToken', isToken: true },
            { name: 'arguments', isSeparatedList: true, elementType: 'IExpressionSyntax' },
            { name: 'closeParenToken', isToken: true }
        ]
    },
    {
        name: 'BinaryExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IExpressionSyntax'],
        children: [
            { name: 'kind', type: 'SyntaxKind' },
            { name: 'left', type: 'IExpressionSyntax' },
            {
                name: 'operatorToken',
                isToken: true,
                tokenKinds: [
                    'AsteriskToken',
                    'SlashToken',
                    'PercentToken',
                    'PlusToken',
                    'MinusToken',
                    'LessThanLessThanToken',
                    'GreaterThanGreaterThanToken',
                    'GreaterThanGreaterThanGreaterThanToken',
                    'LessThanToken',
                    'GreaterThanToken',
                    'LessThanEqualsToken',
                    'GreaterThanEqualsToken',
                    'InstanceOfKeyword',
                    'InKeyword',
                    'EqualsEqualsToken',
                    'ExclamationEqualsToken',
                    'EqualsEqualsEqualsToken',
                    'ExclamationEqualsEqualsToken',
                    'AmpersandToken',
                    'CaretToken',
                    'BarToken',
                    'AmpersandAmpersandToken',
                    'BarBarToken',
                    'BarEqualsToken',
                    'AmpersandEqualsToken',
                    'CaretEqualsToken',
                    'LessThanLessThanEqualsToken',
                    'GreaterThanGreaterThanEqualsToken',
                    'GreaterThanGreaterThanGreaterThanEqualsToken',
                    'PlusEqualsToken',
                    'MinusEqualsToken',
                    'AsteriskEqualsToken',
                    'SlashEqualsToken',
                    'PercentEqualsToken',
                    'EqualsToken',
                    'CommaToken'
                ]
            },
            { name: 'right', type: 'IExpressionSyntax' }
        ]
    },
    {
        name: 'ConditionalExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IExpressionSyntax'],
        children: [
            { name: 'condition', type: 'IExpressionSyntax' },
            { name: 'questionToken', isToken: true },
            { name: 'whenTrue', type: 'IExpressionSyntax' },
            { name: 'colonToken', isToken: true },
            { name: 'whenFalse', type: 'IExpressionSyntax' }
        ]
    },
    {
        name: 'ConstructSignatureSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeMemberSyntax'],
        children: [
            { name: 'newKeyword', isToken: true },
            { name: 'callSignature', type: 'CallSignatureSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'MethodSignatureSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeMemberSyntax'],
        children: [
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName', 'StringLiteral', 'NumericLiteral'] },
            { name: 'questionToken', isToken: true, isOptional: true, itTypeScriptSpecific: true },
            { name: 'callSignature', type: 'CallSignatureSyntax' }
        ]
    },
    {
        name: 'IndexSignatureSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeMemberSyntax', 'IClassElementSyntax'],
        children: [
            { name: 'openBracketToken', isToken: true },
            { name: 'parameter', type: 'ParameterSyntax' },
            { name: 'closeBracketToken', isToken: true },
            { name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'PropertySignatureSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeMemberSyntax'],
        children: [
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName', 'StringLiteral', 'NumericLiteral'] },
            { name: 'questionToken', isToken: true, isOptional: true },
            { name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'CallSignatureSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ITypeMemberSyntax'],
        children: [
            { name: 'typeParameterList', type: 'TypeParameterListSyntax', isOptional: true, isTypeScriptSpecific: true },
            { name: 'parameterList', type: 'ParameterListSyntax' },
            { name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true, isTypeScriptSpecific: true }
        ]
    },
    {
        name: 'ParameterListSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'openParenToken', isToken: true },
            { name: 'parameters', isSeparatedList: true, elementType: 'ParameterSyntax' },
            { name: 'closeParenToken', isToken: true }
        ]
    },
    {
        name: 'TypeParameterListSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'lessThanToken', isToken: true },
            { name: 'typeParameters', isSeparatedList: true, elementType: 'TypeParameterSyntax' },
            { name: 'greaterThanToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'TypeParameterSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'constraint', type: 'ConstraintSyntax', isOptional: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ConstraintSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'extendsKeyword', isToken: true },
            { name: 'type', type: 'ITypeSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ElseClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'elseKeyword', isToken: true },
            { name: 'statement', type: 'IStatementSyntax' }
        ]
    },
    {
        name: 'IfStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'ifKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'condition', type: 'IExpressionSyntax' },
            { name: 'closeParenToken', isToken: true },
            { name: 'statement', type: 'IStatementSyntax' },
            { name: 'elseClause', type: 'ElseClauseSyntax', isOptional: true }
        ]
    },
    {
        name: 'ExpressionStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'semicolonToken', isToken: true }
        ]
    },
    {
        name: 'ConstructorDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IClassElementSyntax'],
        children: [
            { name: 'constructorKeyword', isToken: true },
            { name: 'parameterList', type: 'ParameterListSyntax' },
            { name: 'block', type: 'BlockSyntax', isOptional: true },
            { name: 'semicolonToken', isToken: true, isOptional: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'MemberFunctionDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IMemberDeclarationSyntax'],
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName', 'StringLiteral', 'NumericLiteral'] },
            { name: 'callSignature', type: 'CallSignatureSyntax' },
            { name: 'block', type: 'BlockSyntax', isOptional: true },
            { name: 'semicolonToken', isToken: true, isOptional: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'MemberAccessorDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IMemberDeclarationSyntax'],
        isAbstract: true,
        children: [],
        isTypeScriptSpecific: true
    },
    {
        name: 'GetMemberAccessorDeclarationSyntax',
        baseType: 'MemberAccessorDeclarationSyntax',
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'getKeyword', isToken: true },
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName', 'StringLiteral', 'NumericLiteral'] },
            { name: 'parameterList', type: 'ParameterListSyntax' },
            { name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true },
            { name: 'block', type: 'BlockSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'SetMemberAccessorDeclarationSyntax',
        baseType: 'MemberAccessorDeclarationSyntax',
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'setKeyword', isToken: true },
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName', 'StringLiteral', 'NumericLiteral'] },
            { name: 'parameterList', type: 'ParameterListSyntax' },
            { name: 'block', type: 'BlockSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'MemberVariableDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IMemberDeclarationSyntax'],
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'variableDeclarator', type: 'VariableDeclaratorSyntax' },
            { name: 'semicolonToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ThrowStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'throwKeyword', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'semicolonToken', isToken: true }
        ]
    },
    {
        name: 'ReturnStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'returnKeyword', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax', isOptional: true },
            { name: 'semicolonToken', isToken: true }
        ]
    },
    {
        name: 'ObjectCreationExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'newKeyword', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'argumentList', type: 'ArgumentListSyntax', isOptional: true }
        ]
    },
    {
        name: 'SwitchStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'switchKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'closeParenToken', isToken: true },
            { name: 'openBraceToken', isToken: true },
            { name: 'switchClauses', isList: true, elementType: 'SwitchClauseSyntax' },
            { name: 'closeBraceToken', isToken: true }
        ]
    },
    {
        name: 'SwitchClauseSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['ISwitchClauseSyntax'],
        isAbstract: true,
        children: []
    },
    {
        name: 'CaseSwitchClauseSyntax',
        baseType: 'SwitchClauseSyntax',
        children: [
            { name: 'caseKeyword', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'colonToken', isToken: true },
            { name: 'statements', isList: true, elementType: 'IStatementSyntax' }
        ]
    },
    {
        name: 'DefaultSwitchClauseSyntax',
        baseType: 'SwitchClauseSyntax',
        children: [
            { name: 'defaultKeyword', isToken: true },
            { name: 'colonToken', isToken: true },
            { name: 'statements', isList: true, elementType: 'IStatementSyntax' }
        ]
    },
    {
        name: 'BreakStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'breakKeyword', isToken: true },
            { name: 'identifier', isToken: true, isOptional: true, tokenKinds: ['IdentifierName'] },
            { name: 'semicolonToken', isToken: true }
        ]
    },
    {
        name: 'ContinueStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'continueKeyword', isToken: true },
            { name: 'identifier', isToken: true, isOptional: true, tokenKinds: ['IdentifierName'] },
            { name: 'semicolonToken', isToken: true }
        ]
    },
    {
        name: 'IterationStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        isAbstract: true,
        children: []
    },
    {
        name: 'BaseForStatementSyntax',
        baseType: 'IterationStatementSyntax',
        isAbstract: true,
        children: []
    },
    {
        name: 'ForStatementSyntax',
        baseType: 'BaseForStatementSyntax',
        children: [
            { name: 'forKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'variableDeclaration', type: 'VariableDeclarationSyntax', isOptional: true },
            { name: 'initializer', type: 'IExpressionSyntax', isOptional: true },
            { name: 'firstSemicolonToken', isToken: true, tokenKinds: ['SemicolonToken'] },
            { name: 'condition', type: 'IExpressionSyntax', isOptional: true },
            { name: 'secondSemicolonToken', isToken: true, tokenKinds: ['SemicolonToken'] },
            { name: 'incrementor', type: 'IExpressionSyntax', isOptional: true },
            { name: 'closeParenToken', isToken: true },
            { name: 'statement', type: 'IStatementSyntax' }
        ]
    },
    {
        name: 'ForInStatementSyntax',
        baseType: 'BaseForStatementSyntax',
        children: [
            { name: 'forKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'variableDeclaration', type: 'VariableDeclarationSyntax', isOptional: true },
            { name: 'left', type: 'IExpressionSyntax', isOptional: true },
            { name: 'inKeyword', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' },
            { name: 'closeParenToken', isToken: true },
            { name: 'statement', type: 'IStatementSyntax' }
        ]
    },
    {
        name: 'WhileStatementSyntax',
        baseType: 'IterationStatementSyntax',
        children: [
            { name: 'whileKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'condition', type: 'IExpressionSyntax' },
            { name: 'closeParenToken', isToken: true },
            { name: 'statement', type: 'IStatementSyntax' }
        ]
    },
    {
        name: 'WithStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'withKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'condition', type: 'IExpressionSyntax' },
            { name: 'closeParenToken', isToken: true },
            { name: 'statement', type: 'IStatementSyntax' }
        ]
    },
    {
        name: 'EnumDeclarationSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IModuleElementSyntax'],
        children: [
            { name: 'modifiers', isList: true, elementType: 'ISyntaxToken' },
            { name: 'enumKeyword', isToken: true },
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'openBraceToken', isToken: true },
            { name: 'enumElements', isSeparatedList: true, elementType: 'EnumElementSyntax' },
            { name: 'closeBraceToken', isToken: true }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'EnumElementSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName', 'StringLiteral', 'NumericLiteral'] },
            { name: 'equalsValueClause', type: 'EqualsValueClauseSyntax', isOptional: true }
        ]
    },
    {
        name: 'CastExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'lessThanToken', isToken: true },
            { name: 'type', type: 'ITypeSyntax' },
            { name: 'greaterThanToken', isToken: true },
            { name: 'expression', type: 'IUnaryExpressionSyntax' }
        ],
        isTypeScriptSpecific: true
    },
    {
        name: 'ObjectLiteralExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'openBraceToken', isToken: true },
            { name: 'propertyAssignments', isSeparatedList: true, elementType: 'PropertyAssignmentSyntax' },
            { name: 'closeBraceToken', isToken: true }
        ]
    },
    {
        name: 'PropertyAssignmentSyntax',
        baseType: 'SyntaxNode',
        isAbstract: true,
        children: []
    },
    {
        name: 'SimplePropertyAssignmentSyntax',
        baseType: 'PropertyAssignmentSyntax',
        children: [
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName', 'StringLiteral', 'NumericLiteral'] },
            { name: 'colonToken', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' }
        ]
    },
    {
        name: 'FunctionPropertyAssignmentSyntax',
        baseType: 'PropertyAssignmentSyntax',
        children: [
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName', 'StringLiteral', 'NumericLiteral'] },
            { name: 'callSignature', type: 'CallSignatureSyntax' },
            { name: 'block', type: 'BlockSyntax' }
        ]
    },
    {
        name: 'AccessorPropertyAssignmentSyntax',
        baseType: 'PropertyAssignmentSyntax',
        isAbstract: true,
        children: []
    },
    {
        name: 'GetAccessorPropertyAssignmentSyntax',
        baseType: 'AccessorPropertyAssignmentSyntax',
        children: [
            { name: 'getKeyword', isToken: true },
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'openParenToken', isToken: true },
            { name: 'closeParenToken', isToken: true },
            { name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true },
            { name: 'block', type: 'BlockSyntax' }
        ]
    },
    {
        name: 'SetAccessorPropertyAssignmentSyntax',
        baseType: 'AccessorPropertyAssignmentSyntax',
        children: [
            { name: 'setKeyword', isToken: true },
            { name: 'propertyName', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'openParenToken', isToken: true },
            { name: 'parameter', type: 'ParameterSyntax' },
            { name: 'closeParenToken', isToken: true },
            { name: 'block', type: 'BlockSyntax' }
        ]
    },
    {
        name: 'FunctionExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'functionKeyword', isToken: true },
            { name: 'identifier', isToken: true, isOptional: true, tokenKinds: ['IdentifierName'] },
            { name: 'callSignature', type: 'CallSignatureSyntax' },
            { name: 'block', type: 'BlockSyntax' }
        ]
    },
    {
        name: 'EmptyStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'semicolonToken', isToken: true }
        ]
    },
    {
        name: 'TryStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'tryKeyword', isToken: true },
            { name: 'block', type: 'BlockSyntax' },
            { name: 'catchClause', type: 'CatchClauseSyntax', isOptional: true },
            { name: 'finallyClause', type: 'FinallyClauseSyntax', isOptional: true }
        ]
    },
    {
        name: 'CatchClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'catchKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'typeAnnotation', type: 'TypeAnnotationSyntax', isOptional: true, isTypeScriptSpecified: true },
            { name: 'closeParenToken', isToken: true },
            { name: 'block', type: 'BlockSyntax' }
        ]
    },
    {
        name: 'FinallyClauseSyntax',
        baseType: 'SyntaxNode',
        children: [
            { name: 'finallyKeyword', isToken: true },
            { name: 'block', type: 'BlockSyntax' }
        ]
    },
    {
        name: 'LabeledStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'identifier', isToken: true, tokenKinds: ['IdentifierName'] },
            { name: 'colonToken', isToken: true },
            { name: 'statement', type: 'IStatementSyntax' }
        ]
    },
    {
        name: 'DoStatementSyntax',
        baseType: 'IterationStatementSyntax',
        children: [
            { name: 'doKeyword', isToken: true },
            { name: 'statement', type: 'IStatementSyntax' },
            { name: 'whileKeyword', isToken: true },
            { name: 'openParenToken', isToken: true },
            { name: 'condition', type: 'IExpressionSyntax' },
            { name: 'closeParenToken', isToken: true },
            { name: 'semicolonToken', isToken: true }
        ]
    },
    {
        name: 'TypeOfExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'typeOfKeyword', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' }
        ]
    },
    {
        name: 'DeleteExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'deleteKeyword', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' }
        ]
    },
    {
        name: 'VoidExpressionSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IUnaryExpressionSyntax'],
        children: [
            { name: 'voidKeyword', isToken: true },
            { name: 'expression', type: 'IExpressionSyntax' }
        ]
    },
    {
        name: 'DebuggerStatementSyntax',
        baseType: 'SyntaxNode',
        interfaces: ['IStatementSyntax'],
        children: [
            { name: 'debuggerKeyword', isToken: true },
            { name: 'semicolonToken', isToken: true }
        ]
    }
];

function getStringWithoutSuffix(definition) {
    if (TypeScript.StringUtilities.endsWith(definition, "Syntax")) {
        return definition.substring(0, definition.length - "Syntax".length);
    }

    return definition;
}

function getNameWithoutSuffix(definition) {
    return getStringWithoutSuffix(definition.name);
}

function getType(child) {
    if (child.isToken) {
        return "ISyntaxToken";
    } else if (child.isSeparatedList) {
        return "ISeparatedSyntaxList";
    } else if (child.isList) {
        return "ISyntaxList";
    } else {
        return child.type;
    }
}

var hasKind = false;

function pascalCase(value) {
    return value.substr(0, 1).toUpperCase() + value.substr(1);
}

function camelCase(value) {
    return value.substr(0, 1).toLowerCase() + value.substr(1);
}

function getSafeName(child) {
    if (child.name === "arguments") {
        return "_" + child.name;
    }

    return child.name;
}

function getPropertyAccess(child) {
    if (child.type === "SyntaxKind") {
        return "this._kind";
    }

    return "this." + child.name;
}

function generateProperties(definition) {
    var result = "";

    for (var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];

        if (getType(child) === "SyntaxKind") {
            result += "    private _" + child.name + ": " + getType(child) + ";\r\n";
        }

        hasKind = hasKind || (getType(child) === "SyntaxKind");
    }

    if (definition.children.length > 0) {
        result += "\r\n";
    }

    return result;
}

function generateNullChecks(definition) {
    var result = "";

    for (var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];

        if (!child.isOptional && !child.isToken) {
            result += "        if (" + child.name + " === null) { throw Errors.argumentNull('" + child.name + "'); }\r\n";
        }
    }

    return result;
}

function generateIfKindCheck(child, tokenKinds, indent) {
    var result = "";

    result += indent + "        if (";

    for (var j = 0; j < tokenKinds.length; j++) {
        if (j > 0) {
            result += " && ";
        }

        var tokenKind = tokenKinds[j];
        if (tokenKind === "IdentifierName") {
            result += "!SyntaxFacts.isIdentifierName(" + child.name + ".tokenKind)";
        } else {
            result += child.name + ".tokenKind !== SyntaxKind." + tokenKind;
        }
    }

    result += ") { throw Errors.argument('" + child.name + "'); }\r\n";
    return result;
}

function generateSwitchCase(tokenKind, indent) {
    return indent + "            case SyntaxKind." + tokenKind + ":\r\n";
}

function generateBreakStatement(indent) {
    return indent + "                break;\r\n";
}

function generateSwitchCases(tokenKinds, indent) {
    var result = "";
    for (var j = 0; j < tokenKinds.length; j++) {
        var tokenKind = tokenKinds[j];

        result += generateSwitchCase(tokenKind, indent);
    }

    if (tokenKinds.length > 0) {
        result += generateBreakStatement(indent);
    }

    return result;
}

function generateDefaultCase(child, indent) {
    var result = "";

    result += indent + "            default:\r\n";
    result += indent + "                throw Errors.argument('" + child.name + "');\r\n";

    return result;
}

function generateSwitchKindCheck(child, tokenKinds, indent) {
    if (tokenKinds.length === 0) {
        return "";
    }

    var result = "";

    var identifierName = TypeScript.ArrayUtilities.where(tokenKinds, function (v) {
        return v.indexOf("IdentifierName") >= 0;
    });
    var notIdentifierName = TypeScript.ArrayUtilities.where(tokenKinds, function (v) {
        return v.indexOf("IdentifierName") < 0;
    });

    if (identifierName.length > 0) {
        result += indent + "        if (!SyntaxFacts.isIdentifierName(" + child.name + ".tokenKind)) {\r\n";
        if (notIdentifierName.length === 0) {
            result += indent + "            throw Errors.argument('" + child.name + "');\r\n";
            result += indent + "        }\r\n";
            return result;
        }

        indent += "    ";
    }

    if (notIdentifierName.length <= 2) {
        result += generateIfKindCheck(child, notIdentifierName, indent);
    } else if (notIdentifierName.length > 2) {
        result += indent + "        switch (" + child.name + ".tokenKind) {\r\n";
        result += generateSwitchCases(notIdentifierName, indent);
        result += generateDefaultCase(child, indent);
        result += indent + "        }\r\n";
    }

    if (identifierName.length > 0) {
        result += indent + "    }\r\n";
    }

    return result;
}

function tokenKinds(child) {
    return child.tokenKinds ? child.tokenKinds : [pascalCase(child.name)];
}

function generateKindCheck(child) {
    var indent = "";
    var result = "";

    if (child.isOptional) {
        indent = "    ";

        result += "        if (" + child.name + " !== null) {\r\n";
    }

    var kinds = tokenKinds(child);

    if (kinds.length <= 2) {
        result += generateIfKindCheck(child, kinds, indent);
    } else {
        result += generateSwitchKindCheck(child, kinds, indent);
    }

    if (child.isOptional) {
        result += "        }\r\n";
    }

    return result;
}

function generateKindChecks(definition) {
    var result = "";

    for (var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];

        if (child.isToken) {
            result += generateKindCheck(child);
        }
    }

    return result;
}

function generateArgumentChecks(definition) {
    var result = "";

    if (argumentChecks) {
        result += generateNullChecks(definition);
        result += generateKindChecks(definition);

        if (definition.children.length > 0) {
            result += "\r\n";
        }
    }

    return result;
}

function generateConstructor(definition) {
    if (definition.isAbstract) {
    }

    var i;
    var child;
    var base = baseType(definition);
    var subchildren = childrenInAllSubclasses(definition);
    var baseSubchildren = childrenInAllSubclasses(base);
    var baseSubchildrenNames = TypeScript.ArrayUtilities.select(baseSubchildren, function (c) {
        return c.name;
    });

    var result = "";
    result += "        constructor(";

    var children = definition.children;
    if (subchildren.length > 0) {
        children = subchildren;
    }

    for (i = 0; i < children.length; i++) {
        child = children[i];

        if (getType(child) !== "SyntaxKind" && !TypeScript.ArrayUtilities.contains(baseSubchildrenNames, child.name)) {
            result += "public ";
        }

        result += child.name + ": " + getType(child);
        result += ",\r\n                    ";
    }

    result += "parsedInStrictMode: boolean) {\r\n";

    result += "            super(";

    for (i = 0; i < baseSubchildrenNames.length; i++) {
        result += baseSubchildrenNames[i] + ", ";
    }

    result += "parsedInStrictMode); \r\n";
    if (definition.children.length > 0) {
        result += "\r\n";
    }

    result += generateArgumentChecks(definition);

    for (i = 0; i < definition.children.length; i++) {
        child = definition.children[i];

        if (child.type === "SyntaxKind") {
            result += "            " + getPropertyAccess(child) + " = " + child.name + ";\r\n";
        }
    }

    result += "        }\r\n";

    return result;
}

function isOptional(child) {
    if (child.isOptional) {
        return true;
    }

    if (child.isList && !child.requiresAtLeastOneItem) {
        return true;
    }

    if (child.isSeparatedList && !child.requiresAtLeastOneItem) {
        return true;
    }

    return false;
}

function generateFactory1Method(definition) {
    var mandatoryChildren = TypeScript.ArrayUtilities.where(definition.children, function (c) {
        return !isOptional(c);
    });
    if (mandatoryChildren.length === definition.children.length) {
        return "";
    }

    var result = "\r\n    public static create(";
    var i;
    var child;

    for (i = 0; i < mandatoryChildren.length; i++) {
        child = mandatoryChildren[i];

        result += child.name + ": " + getType(child);

        if (i < mandatoryChildren.length - 1) {
            result += ",\r\n                         ";
        }
    }

    result += "): " + definition.name + " {\r\n";

    result += "        return new " + definition.name + "(";

    for (i = 0; i < definition.children.length; i++) {
        child = definition.children[i];

        if (!isOptional(child)) {
            result += child.name;
        } else if (child.isList) {
            result += "Syntax.emptyList";
        } else if (child.isSeparatedList) {
            result += "Syntax.emptySeparatedList";
        } else {
            result += "null";
        }

        result += ", ";
    }

    result += "/*parsedInStrictMode:*/ false);\r\n";
    result += "    }\r\n";

    return result;
}

function isKeywordOrPunctuation(kind) {
    if (TypeScript.StringUtilities.endsWith(kind, "Keyword")) {
        return true;
    }

    if (TypeScript.StringUtilities.endsWith(kind, "Token") && kind !== "IdentifierName" && kind !== "EndOfFileToken") {
        return true;
    }

    return false;
}

function isDefaultConstructable(definition) {
    if (definition === null || definition.isAbstract) {
        return false;
    }

    for (var i = 0; i < definition.children.length; i++) {
        if (isMandatory(definition.children[i])) {
            return false;
        }
    }

    return true;
}

function isMandatory(child) {
    if (isOptional(child)) {
        return false;
    }

    if (child.type === "SyntaxKind" || child.isList || child.isSeparatedList) {
        return true;
    }

    if (child.isToken) {
        var kinds = tokenKinds(child);
        var isFixed = kinds.length === 1 && isKeywordOrPunctuation(kinds[0]);

        return !isFixed;
    }

    return !isDefaultConstructable(memberDefinitionType(child));
}

function generateFactory2Method(definition) {
    var mandatoryChildren = TypeScript.ArrayUtilities.where(definition.children, isMandatory);
    if (mandatoryChildren.length === definition.children.length) {
        return "";
    }

    var i;
    var child;
    var result = "\r\n    public static create1(";

    for (i = 0; i < mandatoryChildren.length; i++) {
        child = mandatoryChildren[i];

        result += child.name + ": " + getType(child);

        if (i < mandatoryChildren.length - 1) {
            result += ",\r\n                          ";
        }
    }

    result += "): " + definition.name + " {\r\n";
    result += "        return new " + definition.name + "(";

    for (i = 0; i < definition.children.length; i++) {
        child = definition.children[i];

        if (isMandatory(child)) {
            result += child.name;
        } else if (child.isList) {
            result += "Syntax.emptyList";
        } else if (child.isSeparatedList) {
            result += "Syntax.emptySeparatedList";
        } else if (isOptional(child)) {
            result += "null";
        } else if (child.isToken) {
            result += "Syntax.token(SyntaxKind." + tokenKinds(child)[0] + ")";
        } else {
            result += child.type + ".create1()";
        }

        result += ", ";
    }

    result += "/*parsedInStrictMode:*/ false);\r\n";
    result += "    }\r\n";

    return result;
}

function generateFactoryMethod(definition) {
    return generateFactory1Method(definition) + generateFactory2Method(definition);
}

function generateAcceptMethods(definition) {
    var result = "";

    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public accept(visitor: ISyntaxVisitor): any {\r\n";
        result += "        return visitor.visit" + getNameWithoutSuffix(definition) + "(this);\r\n";
        result += "    }\r\n";
    }

    return result;
}

function generateIsMethod(definition) {
    var result = "";

    if (definition.interfaces) {
        var ifaces = definition.interfaces.slice(0);
        var i;
        for (i = 0; i < ifaces.length; i++) {
            var current = ifaces[i];

            while (current !== undefined) {
                if (!TypeScript.ArrayUtilities.contains(ifaces, current)) {
                    ifaces.push(current);
                }

                current = interfaces[current];
            }
        }

        for (i = 0; i < ifaces.length; i++) {
            var type = ifaces[i];
            type = getStringWithoutSuffix(type);
            if (isInterface(type)) {
                type = type.substr(1);
            }

            result += "\r\n";
            result += "    public is" + type + "(): boolean {\r\n";
            result += "        return true;\r\n";
            result += "    }\r\n";
        }
    }

    return result;
}

function generateKindMethod(definition) {
    var result = "";

    if (!definition.isAbstract) {
        if (!hasKind) {
            result += "\r\n";
            result += "    public kind(): SyntaxKind {\r\n";
            result += "        return SyntaxKind." + getNameWithoutSuffix(definition) + ";\r\n";
            result += "    }\r\n";
        }
    }

    return result;
}

function generateSlotMethods(definition) {
    var result = "";

    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public childCount(): number {\r\n";
        var slotCount = hasKind ? (definition.children.length - 1) : definition.children.length;

        result += "        return " + slotCount + ";\r\n";
        result += "    }\r\n\r\n";

        result += "    public childAt(slot: number): ISyntaxElement {\r\n";

        if (slotCount === 0) {
            result += "        throw Errors.invalidOperation();\r\n";
        } else {
            result += "        switch (slot) {\r\n";

            var index = 0;
            for (var i = 0; i < definition.children.length; i++) {
                var child = definition.children[i];
                if (child.type === "SyntaxKind") {
                    continue;
                }

                result += "            case " + index + ": return this." + definition.children[i].name + ";\r\n";
                index++;
            }

            result += "            default: throw Errors.invalidOperation();\r\n";
            result += "        }\r\n";
        }

        result += "    }\r\n";
    }

    return result;
}

function generateFirstTokenMethod(definition) {
    var result = "";

    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public firstToken(): ISyntaxToken {\r\n";
        result += "        var token = null;\r\n";

        for (var i = 0; i < definition.children.length; i++) {
            var child = definition.children[i];

            if (getType(child) === "SyntaxKind") {
                continue;
            }

            if (child.name === "endOfFileToken") {
                continue;
            }

            result += "        if (";

            if (child.isOptional) {
                result += getPropertyAccess(child) + " !== null && ";
            }

            if (child.isToken) {
                result += getPropertyAccess(child) + ".width() > 0";
                result += ") { return " + getPropertyAccess(child) + "; }\r\n";
            } else {
                result += "(token = " + getPropertyAccess(child) + ".firstToken()) !== null";
                result += ") { return token; }\r\n";
            }
        }

        if (definition.name === "SourceUnitSyntax") {
            result += "        return this._endOfFileToken;\r\n";
        } else {
            result += "        return null;\r\n";
        }

        result += "    }\r\n";
    }

    return result;
}

function generateLastTokenMethod(definition) {
    var result = "";

    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public lastToken(): ISyntaxToken {\r\n";

        if (definition.name === "SourceUnitSyntax") {
            result += "        return this._endOfFileToken;\r\n";
        } else {
            result += "        var token = null;\r\n";

            for (var i = definition.children.length - 1; i >= 0; i--) {
                var child = definition.children[i];

                if (getType(child) === "SyntaxKind") {
                    continue;
                }

                if (child.name === "endOfFileToken") {
                    continue;
                }

                result += "        if (";

                if (child.isOptional) {
                    result += getPropertyAccess(child) + " !== null && ";
                }

                if (child.isToken) {
                    result += getPropertyAccess(child) + ".width() > 0";
                    result += ") { return " + getPropertyAccess(child) + "; }\r\n";
                } else {
                    result += "(token = " + getPropertyAccess(child) + ".lastToken()) !== null";
                    result += ") { return token; }\r\n";
                }
            }

            result += "        return null;\r\n";
        }

        result += "    }\r\n";
    }

    return result;
}

function generateInsertChildrenIntoMethod(definition) {
    var result = "";

    if (!definition.isAbstract) {
        result += "\r\n";
        result += "    public insertChildrenInto(array: ISyntaxElement[], index: number) {\r\n";

        for (var i = definition.children.length - 1; i >= 0; i--) {
            var child = definition.children[i];

            if (child.type === "SyntaxKind") {
                continue;
            }

            if (child.isList || child.isSeparatedList) {
                result += "        " + getPropertyAccess(child) + ".insertChildrenInto(array, index);\r\n";
            } else if (child.isOptional) {
                result += "        if (" + getPropertyAccess(child) + " !== null) { array.splice(index, 0, " + getPropertyAccess(child) + "); }\r\n";
            } else {
                result += "        array.splice(index, 0, " + getPropertyAccess(child) + ");\r\n";
            }
        }

        result += "    }\r\n";
    }

    return result;
}

function baseType(definition) {
    return TypeScript.ArrayUtilities.firstOrDefault(definitions, function (d) {
        return d.name === definition.baseType;
    });
}

function memberDefinitionType(child) {
    return TypeScript.ArrayUtilities.firstOrDefault(definitions, function (d) {
        return d.name === child.type;
    });
}

function derivesFrom(def1, def2) {
    var current = def1;
    while (current !== null) {
        var base = baseType(current);
        if (base === def2) {
            return true;
        }

        current = base;
    }

    return false;
}

function contains(definition, child) {
    return TypeScript.ArrayUtilities.any(definition.children, function (c) {
        return c.name === child.name && c.isList === child.isList && c.isSeparatedList === child.isSeparatedList && c.isToken === child.isToken && c.type === child.type;
    });
}

function childrenInAllSubclasses(definition) {
    var result = [];

    if (definition !== null && definition.isAbstract) {
        var subclasses = TypeScript.ArrayUtilities.where(definitions, function (d) {
            return !d.isAbstract && derivesFrom(d, definition);
        });

        if (subclasses.length > 0) {
            var firstSubclass = subclasses[0];

            for (var i = 0; i < firstSubclass.children.length; i++) {
                var child = firstSubclass.children[i];

                if (TypeScript.ArrayUtilities.all(subclasses, function (s) {
                    return contains(s, child);
                })) {
                    result.push(child);
                }
            }
        }
    }

    return result;
}

function generateAccessors(definition) {
    var result = "";

    for (var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];

        if (child.type === "SyntaxKind") {
            result += "\r\n";
            result += "    public " + child.name + "(): " + getType(child) + " {\r\n";
            result += "        return " + getPropertyAccess(child) + ";\r\n";
            result += "    }\r\n";
        }
    }

    return result;
}

function generateWithMethod(definition, child) {
    var result = "";
    result += "\r\n";
    result += "    public with" + pascalCase(child.name) + "(" + getSafeName(child) + ": " + getType(child) + "): " + definition.name + " {\r\n";
    result += "        return this.update(";

    for (var i = 0; i < definition.children.length; i++) {
        if (i > 0) {
            result += ", ";
        }

        if (definition.children[i] === child) {
            result += getSafeName(child);
        } else {
            result += getPropertyAccess(definition.children[i]);
        }
    }

    result += ");\r\n";
    result += "    }\r\n";

    if (child.isList || child.isSeparatedList) {
        if (TypeScript.StringUtilities.endsWith(child.name, "s")) {
            var pascalName = pascalCase(child.name);
            pascalName = pascalName.substring(0, pascalName.length - 1);

            var argName = getSafeName(child);
            argName = argName.substring(0, argName.length - 1);

            result += "\r\n";
            result += "    public with" + pascalName + "(" + argName + ": " + child.elementType + "): " + definition.name + " {\r\n";
            result += "        return this.with" + pascalCase(child.name) + "(";

            if (child.isList) {
                result += "Syntax.list([" + argName + "])";
            } else {
                result += "Syntax.separatedList([" + argName + "])";
            }

            result += ");\r\n";
            result += "    }\r\n";
        }
    }

    return result;
}

function generateWithMethods(definition) {
    var result = "";

    for (var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];
        result += generateWithMethod(definition, child);
    }

    return result;
}

function generateTriviaMethods(definition) {
    var result = "\r\n";
    result += "    public withLeadingTrivia(trivia: ISyntaxTriviaList): " + definition.name + " {\r\n";
    result += "        return <" + definition.name + ">super.withLeadingTrivia(trivia);\r\n";
    result += "    }\r\n\r\n";
    result += "    public withTrailingTrivia(trivia: ISyntaxTriviaList): " + definition.name + " {\r\n";
    result += "        return <" + definition.name + ">super.withTrailingTrivia(trivia);\r\n";
    result += "    }\r\n";

    return result;
}

function generateUpdateMethod(definition) {
    if (definition.isAbstract) {
        return "";
    }

    var result = "";

    result += "\r\n";

    result += "    public ";

    result += "update(";
    var i;
    var child;

    for (i = 0; i < definition.children.length; i++) {
        child = definition.children[i];

        result += getSafeName(child) + ": " + getType(child);

        if (i < definition.children.length - 1) {
            result += ",\r\n                  ";
        }
    }

    result += "): " + definition.name + " {\r\n";

    if (definition.children.length === 0) {
        result += "        return this;\r\n";
    } else {
        result += "        if (";

        for (i = 0; i < definition.children.length; i++) {
            child = definition.children[i];

            if (i !== 0) {
                result += " && ";
            }

            result += getPropertyAccess(child) + " === " + getSafeName(child);
        }

        result += ") {\r\n";
        result += "            return this;\r\n";
        result += "        }\r\n\r\n";

        result += "        return new " + definition.name + "(";

        for (i = 0; i < definition.children.length; i++) {
            child = definition.children[i];

            result += getSafeName(child);
            result += ", ";
        }

        result += "/*parsedInStrictMode:*/ this.parsedInStrictMode());\r\n";
    }

    result += "    }\r\n";

    return result;
}

function generateIsTypeScriptSpecificMethod(definition) {
    var result = "\r\n    public isTypeScriptSpecific(): boolean {\r\n";

    if (definition.isTypeScriptSpecific) {
        result += "        return true;\r\n";
    } else {
        for (var i = 0; i < definition.children.length; i++) {
            var child = definition.children[i];

            if (child.type === "SyntaxKind") {
                continue;
            }

            if (child.isTypeScriptSpecific) {
                result += "        if (" + getPropertyAccess(child) + " !== null) { return true; }\r\n";
                continue;
            }

            if (child.isToken) {
                continue;
            }

            if (child.isOptional) {
                result += "        if (" + getPropertyAccess(child) + " !== null && " + getPropertyAccess(child) + ".isTypeScriptSpecific()) { return true; }\r\n";
            } else {
                result += "        if (" + getPropertyAccess(child) + ".isTypeScriptSpecific()) { return true; }\r\n";
            }
        }

        result += "        return false;\r\n";
    }

    result += "    }\r\n";

    return result;
}

function couldBeRegularExpressionToken(child) {
    var kinds = tokenKinds(child);
    return TypeScript.ArrayUtilities.contains(kinds, "SlashToken") || TypeScript.ArrayUtilities.contains(kinds, "SlashEqualsToken") || TypeScript.ArrayUtilities.contains(kinds, "RegularExpressionLiteral");
}

function generateStructuralEqualsMethod(definition) {
    if (definition.isAbstract) {
        return "";
    }

    var result = "\r\n    private structuralEquals(node: SyntaxNode): boolean {\r\n";
    result += "        if (this === node) { return true; }\r\n";
    result += "        if (node === null) { return false; }\r\n";
    result += "        if (this.kind() !== node.kind()) { return false; }\r\n";
    result += "        var other = <" + definition.name + ">node;\r\n";

    for (var i = 0; i < definition.children.length; i++) {
        var child = definition.children[i];

        if (child.type !== "SyntaxKind") {
            if (child.isList) {
                result += "        if (!Syntax.listStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
            } else if (child.isSeparatedList) {
                result += "        if (!Syntax.separatedListStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
            } else if (child.isToken) {
                result += "        if (!Syntax.tokenStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
            } else if (isNodeOrToken(child)) {
                result += "        if (!Syntax.nodeOrTokenStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
            } else {
                result += "        if (!Syntax.nodeStructuralEquals(" + getPropertyAccess(child) + ", other._" + child.name + ")) { return false; }\r\n";
            }
        }
    }

    result += "        return true;\r\n";
    result += "    }\r\n";
    return result;
}

function generateNode(definition) {
    var result = "    export class " + definition.name + " extends " + definition.baseType;

    if (definition.interfaces) {
        result += " implements " + definition.interfaces.join(", ");
    }

    result += " {\r\n";
    hasKind = false;

    result += generateProperties(definition);
    result += generateConstructor(definition);
    result += generateAcceptMethods(definition);
    result += generateKindMethod(definition);
    result += generateSlotMethods(definition);
    result += generateIsMethod(definition);
    result += generateAccessors(definition);
    result += generateUpdateMethod(definition);

    if (!forPrettyPrinter) {
        result += generateFactoryMethod(definition);
        result += generateTriviaMethods(definition);
        result += generateWithMethods(definition);
        result += generateIsTypeScriptSpecificMethod(definition);
    }

    result += "    }";

    return result;
}

function generateNodes() {
    var result = "///<reference path='references.ts' />\r\n\r\n";

    result += "module TypeScript {\r\n";

    for (var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];

        if (i > 0) {
            result += "\r\n\r\n";
        }

        result += generateNode(definition);
    }

    result += "\r\n}";

    return result;
}

function isInterface(name) {
    return name.substr(0, 1) === "I" && name.substr(1, 1).toUpperCase() === name.substr(1, 1);
}

function isNodeOrToken(child) {
    return child.type && isInterface(child.type);
}

function generateRewriter() {
    var result = "///<reference path='references.ts' />\r\n\r\n";

    result += "module TypeScript {\r\n" + "    export class SyntaxRewriter implements ISyntaxVisitor {\r\n" + "        public visitToken(token: ISyntaxToken): ISyntaxToken {\r\n" + "            return token;\r\n" + "        }\r\n" + "\r\n" + "        public visitNode(node: SyntaxNode): SyntaxNode {\r\n" + "            return node.accept(this);\r\n" + "        }\r\n" + "\r\n" + "        public visitNodeOrToken(node: ISyntaxNodeOrToken): ISyntaxNodeOrToken {\r\n" + "            return node.isToken() ? <ISyntaxNodeOrToken>this.visitToken(<ISyntaxToken>node) : this.visitNode(<SyntaxNode>node);\r\n" + "        }\r\n" + "\r\n" + "        public visitList(list: ISyntaxList): ISyntaxList {\r\n" + "            var newItems: ISyntaxNodeOrToken[] = null;\r\n" + "\r\n" + "            for (var i = 0, n = list.childCount(); i < n; i++) {\r\n" + "                var item = list.childAt(i);\r\n" + "                var newItem = this.visitNodeOrToken(item);\r\n" + "\r\n" + "                if (item !== newItem && newItems === null) {\r\n" + "                    newItems = [];\r\n" + "                    for (var j = 0; j < i; j++) {\r\n" + "                        newItems.push(list.childAt(j));\r\n" + "                    }\r\n" + "                }\r\n" + "\r\n" + "                if (newItems) {\r\n" + "                    newItems.push(newItem);\r\n" + "                }\r\n" + "            }\r\n" + "\r\n" + "            // Debug.assert(newItems === null || newItems.length === list.childCount());\r\n" + "            return newItems === null ? list : Syntax.list(newItems);\r\n" + "        }\r\n" + "\r\n" + "        public visitSeparatedList(list: ISeparatedSyntaxList): ISeparatedSyntaxList {\r\n" + "            var newItems: ISyntaxNodeOrToken[] = null;\r\n" + "\r\n" + "            for (var i = 0, n = list.childCount(); i < n; i++) {\r\n" + "                var item = list.childAt(i);\r\n" + "                var newItem = item.isToken() ? <ISyntaxNodeOrToken>this.visitToken(<ISyntaxToken>item) : this.visitNode(<SyntaxNode>item);\r\n" + "\r\n" + "                if (item !== newItem && newItems === null) {\r\n" + "                    newItems = [];\r\n" + "                    for (var j = 0; j < i; j++) {\r\n" + "                        newItems.push(list.childAt(j));\r\n" + "                    }\r\n" + "                }\r\n" + "\r\n" + "                if (newItems) {\r\n" + "                    newItems.push(newItem);\r\n" + "                }\r\n" + "            }\r\n" + "\r\n" + "            // Debug.assert(newItems === null || newItems.length === list.childCount());\r\n" + "            return newItems === null ? list : Syntax.separatedList(newItems);\r\n" + "        }\r\n";

    for (var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if (definition.isAbstract) {
            continue;
        }

        result += "\r\n";
        result += "        public visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): any {\r\n";

        if (definition.children.length === 0) {
            result += "            return node;\r\n";
            result += "        }\r\n";
            continue;
        }

        result += "            return node.update(\r\n";

        for (var j = 0; j < definition.children.length; j++) {
            var child = definition.children[j];

            result += "                ";
            if (child.isOptional) {
                result += "node." + child.name + " === null ? null : ";
            }

            if (child.isToken) {
                result += "this.visitToken(node." + child.name + ")";
            } else if (child.isList) {
                result += "this.visitList(node." + child.name + ")";
            } else if (child.isSeparatedList) {
                result += "this.visitSeparatedList(node." + child.name + ")";
            } else if (child.type === "SyntaxKind") {
                result += "node.kind()";
            } else if (isNodeOrToken(child)) {
                result += "<" + child.type + ">this.visitNodeOrToken(node." + child.name + ")";
            } else {
                result += "<" + child.type + ">this.visitNode(node." + child.name + ")";
            }

            if (j < definition.children.length - 1) {
                result += ",\r\n";
            }
        }

        result += ");\r\n";
        result += "        }\r\n";
    }

    result += "    }";
    result += "\r\n}";
    return result;
}

function generateToken(isFixedWidth, leading, trailing) {
    var isVariableWidth = !isFixedWidth;
    var hasAnyTrivia = leading || trailing;

    var result = "    export class ";

    var needsSourcetext = hasAnyTrivia || isVariableWidth;

    var className = isFixedWidth ? "FixedWidthToken" : "VariableWidthToken";
    className += leading && trailing ? "WithLeadingAndTrailingTrivia" : leading && !trailing ? "WithLeadingTrivia" : !leading && trailing ? "WithTrailingTrivia" : "WithNoTrivia";

    result += className;

    result += " implements ISyntaxToken {\r\n";

    if (needsSourcetext) {
        result += "        private _sourceText: ISimpleText;\r\n";
        result += "        private _fullStart: number;\r\n";
    }

    result += "        public tokenKind: SyntaxKind;\r\n";

    if (leading) {
        result += "        private _leadingTriviaInfo: number;\r\n";
    }

    if (isVariableWidth) {
        result += "        private _textOrWidth: any;\r\n";
    }

    if (trailing) {
        result += "        private _trailingTriviaInfo: number;\r\n";
    }

    result += "\r\n";

    if (needsSourcetext) {
        result += "        constructor(sourceText: ISimpleText, fullStart: number,";
    } else {
        result += "        constructor(";
    }

    result += "kind: SyntaxKind";

    if (leading) {
        result += ", leadingTriviaInfo: number";
    }

    if (isVariableWidth) {
        result += ", textOrWidth: any";
    }

    if (trailing) {
        result += ", trailingTriviaInfo: number";
    }

    result += ") {\r\n";

    if (needsSourcetext) {
        result += "            this._sourceText = sourceText;\r\n";
        result += "            this._fullStart = fullStart;\r\n";
    }

    result += "            this.tokenKind = kind;\r\n";

    if (leading) {
        result += "            this._leadingTriviaInfo = leadingTriviaInfo;\r\n";
    }

    if (isVariableWidth) {
        result += "            this._textOrWidth = textOrWidth;\r\n";
    }

    if (trailing) {
        result += "            this._trailingTriviaInfo = trailingTriviaInfo;\r\n";
    }

    result += "        }\r\n\r\n";

    result += "        public clone(): ISyntaxToken {\r\n";
    result += "            return new " + className + "(\r\n";

    if (needsSourcetext) {
        result += "                this._sourceText,\r\n";
        result += "                this._fullStart,\r\n";
    }

    result += "                this.tokenKind";

    if (leading) {
        result += ",\r\n                this._leadingTriviaInfo";
    }

    if (isVariableWidth) {
        result += ",\r\n                this._textOrWidth";
    }

    if (trailing) {
        result += ",\r\n                this._trailingTriviaInfo";
    }

    result += ");\r\n";
    result += "        }\r\n\r\n";

    result += "        public isNode(): boolean { return false; }\r\n" + "        public isToken(): boolean { return true; }\r\n" + "        public isList(): boolean { return false; }\r\n" + "        public isSeparatedList(): boolean { return false; }\r\n\r\n";

    result += "        public kind(): SyntaxKind { return this.tokenKind; }\r\n\r\n";

    result += "        public childCount(): number { return 0; }\r\n";
    result += "        public childAt(index: number): ISyntaxElement { throw Errors.argumentOutOfRange('index'); }\r\n\r\n";

    var leadingTriviaWidth = leading ? "getTriviaWidth(this._leadingTriviaInfo)" : "0";
    var trailingTriviaWidth = trailing ? "getTriviaWidth(this._trailingTriviaInfo)" : "0";

    if (leading && trailing) {
        result += "        public fullWidth(): number { return " + leadingTriviaWidth + " + this.width() + " + trailingTriviaWidth + "; }\r\n";
    } else if (leading) {
        result += "        public fullWidth(): number { return " + leadingTriviaWidth + " + this.width(); }\r\n";
    } else if (trailing) {
        result += "        public fullWidth(): number { return this.width() + " + trailingTriviaWidth + "; }\r\n";
    } else {
        result += "        public fullWidth(): number { return this.width(); }\r\n";
    }

    if (needsSourcetext) {
        if (leading) {
            result += "        private start(): number { return this._fullStart + " + leadingTriviaWidth + "; }\r\n";
        } else {
            result += "        private start(): number { return this._fullStart; }\r\n";
        }

        result += "        private end(): number { return this.start() + this.width(); }\r\n\r\n";
    }

    if (isFixedWidth) {
        result += "        public width(): number { return this.text().length; }\r\n";
    } else {
        result += "        public width(): number { return typeof this._textOrWidth === 'number' ? this._textOrWidth : this._textOrWidth.length; }\r\n";
    }

    if (isFixedWidth) {
        result += "        public text(): string { return SyntaxFacts.getText(this.tokenKind); }\r\n";
    } else {
        result += "\r\n";
        result += "        public text(): string {\r\n";
        result += "            if (typeof this._textOrWidth === 'number') {\r\n";
        result += "                this._textOrWidth = this._sourceText.substr(\r\n";
        result += "                    this.start(), this._textOrWidth, /*intern:*/ this.tokenKind === SyntaxKind.IdentifierName);\r\n";
        result += "            }\r\n";
        result += "\r\n";
        result += "            return this._textOrWidth;\r\n";
        result += "        }\r\n\r\n";
    }

    if (needsSourcetext) {
        result += "        public fullText(): string { return this._sourceText.substr(this._fullStart, this.fullWidth(), /*intern:*/ false); }\r\n\r\n";
    } else {
        result += "        public fullText(): string { return this.text(); }\r\n\r\n";
    }

    if (isFixedWidth) {
        result += "        public value(): any { return value(this); }\r\n";
        result += "        public valueText(): string { return valueText(this); }\r\n";
    } else {
        result += "        public value(): any {\r\n" + "            if ((<any>this)._value === undefined) {\r\n" + "                (<any>this)._value = value(this);\r\n" + "            }\r\n" + "\r\n" + "            return (<any>this)._value;\r\n" + "        }\r\n\r\n";
        result += "        public valueText(): string {\r\n" + "            if ((<any>this)._valueText === undefined) {\r\n" + "                (<any>this)._valueText = valueText(this);\r\n" + "            }\r\n" + "\r\n" + "            return (<any>this)._valueText;\r\n" + "        }\r\n\r\n";
    }

    result += "        public hasLeadingTrivia(): boolean { return " + (leading ? "true" : "false") + "; }\r\n";
    result += "        public hasLeadingComment(): boolean { return " + (leading ? "hasTriviaComment(this._leadingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasLeadingNewLine(): boolean { return " + (leading ? "hasTriviaNewLine(this._leadingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasLeadingSkippedText(): boolean { return false; }\r\n";
    result += "        public leadingTriviaWidth(): number { return " + (leading ? "getTriviaWidth(this._leadingTriviaInfo)" : "0") + "; }\r\n";
    result += "        public leadingTrivia(): ISyntaxTriviaList { return " + (leading ? "Scanner.scanTrivia(this._sourceText, this._fullStart, getTriviaWidth(this._leadingTriviaInfo), /*isTrailing:*/ false)" : "Syntax.emptyTriviaList") + "; }\r\n\r\n";

    result += "        public hasTrailingTrivia(): boolean { return " + (trailing ? "true" : "false") + "; }\r\n";
    result += "        public hasTrailingComment(): boolean { return " + (trailing ? "hasTriviaComment(this._trailingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasTrailingNewLine(): boolean { return " + (trailing ? "hasTriviaNewLine(this._trailingTriviaInfo)" : "false") + "; }\r\n";
    result += "        public hasTrailingSkippedText(): boolean { return false; }\r\n";
    result += "        public trailingTriviaWidth(): number { return " + (trailing ? "getTriviaWidth(this._trailingTriviaInfo)" : "0") + "; }\r\n";
    result += "        public trailingTrivia(): ISyntaxTriviaList { return " + (trailing ? "Scanner.scanTrivia(this._sourceText, this.end(), getTriviaWidth(this._trailingTriviaInfo), /*isTrailing:*/ true)" : "Syntax.emptyTriviaList") + "; }\r\n\r\n";
    result += "        public hasSkippedToken(): boolean { return false; }\r\n";

    result += "        public toJSON(key) { return tokenToJSON(this); }\r\n" + "        public firstToken(): ISyntaxToken { return this; }\r\n" + "        public lastToken(): ISyntaxToken { return this; }\r\n" + "        public isTypeScriptSpecific(): boolean { return false; }\r\n" + "        public isIncrementallyUnusable(): boolean { return this.fullWidth() === 0 || SyntaxFacts.isAnyDivideOrRegularExpressionToken(this.tokenKind); }\r\n" + "        public accept(visitor: ISyntaxVisitor): any { return visitor.visitToken(this); }\r\n" + "        private realize(): ISyntaxToken { return realizeToken(this); }\r\n" + "        public collectTextElements(elements: string[]): void { collectTokenTextElements(this, elements); }\r\n\r\n";

    result += "        private findTokenInternal(parent: PositionedElement, position: number, fullStart: number): PositionedToken {\r\n" + "            return new PositionedToken(parent, this, fullStart);\r\n" + "        }\r\n\r\n";

    result += "        public withLeadingTrivia(leadingTrivia: ISyntaxTriviaList): ISyntaxToken {\r\n" + "            return this.realize().withLeadingTrivia(leadingTrivia);\r\n" + "        }\r\n" + "\r\n" + "        public withTrailingTrivia(trailingTrivia: ISyntaxTriviaList): ISyntaxToken {\r\n" + "            return this.realize().withTrailingTrivia(trailingTrivia);\r\n" + "        }\r\n";

    result += "    }\r\n";

    return result;
}

function generateTokens() {
    var result = "///<reference path='references.ts' />\r\n" + "\r\n" + "module TypeScript.Syntax {\r\n";

    result += generateToken(false, false, false);
    result += "\r\n";
    result += generateToken(false, true, false);
    result += "\r\n";
    result += generateToken(false, false, true);
    result += "\r\n";
    result += generateToken(false, true, true);
    result += "\r\n";

    result += generateToken(true, false, false);
    result += "\r\n";
    result += generateToken(true, true, false);
    result += "\r\n";
    result += generateToken(true, false, true);
    result += "\r\n";
    result += generateToken(true, true, true);
    result += "\r\n";

    result += "    function collectTokenTextElements(token: ISyntaxToken, elements: string[]): void {\r\n" + "        token.leadingTrivia().collectTextElements(elements);\r\n" + "        elements.push(token.text());\r\n" + "        token.trailingTrivia().collectTextElements(elements);\r\n" + "    }\r\n" + "\r\n" + "    export function fixedWidthToken(sourceText: ISimpleText, fullStart: number,\r\n" + "        kind: SyntaxKind,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "\r\n" + "        if (leadingTriviaInfo === 0) {\r\n" + "            if (trailingTriviaInfo === 0) {\r\n" + "                return new FixedWidthTokenWithNoTrivia(kind);\r\n" + "            }\r\n" + "            else {\r\n" + "                return new FixedWidthTokenWithTrailingTrivia(sourceText, fullStart, kind, trailingTriviaInfo);\r\n" + "            }\r\n" + "        }\r\n" + "        else if (trailingTriviaInfo === 0) {\r\n" + "            return new FixedWidthTokenWithLeadingTrivia(sourceText, fullStart, kind, leadingTriviaInfo);\r\n" + "        }\r\n" + "        else {\r\n" + "            return new FixedWidthTokenWithLeadingAndTrailingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n" + "\r\n" + "    export function variableWidthToken(sourceText: ISimpleText, fullStart: number,\r\n" + "        kind: SyntaxKind,\r\n" + "        leadingTriviaInfo: number,\r\n" + "        width: number,\r\n" + "        trailingTriviaInfo: number): ISyntaxToken {\r\n" + "\r\n" + "        if (leadingTriviaInfo === 0) {\r\n" + "            if (trailingTriviaInfo === 0) {\r\n" + "                return new VariableWidthTokenWithNoTrivia(sourceText, fullStart, kind, width);\r\n" + "            }\r\n" + "            else {\r\n" + "                return new VariableWidthTokenWithTrailingTrivia(sourceText, fullStart, kind, width, trailingTriviaInfo);\r\n" + "            }\r\n" + "        }\r\n" + "        else if (trailingTriviaInfo === 0) {\r\n" + "            return new VariableWidthTokenWithLeadingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, width);\r\n" + "        }\r\n" + "        else {\r\n" + "            return new VariableWidthTokenWithLeadingAndTrailingTrivia(sourceText, fullStart, kind, leadingTriviaInfo, width, trailingTriviaInfo);\r\n" + "        }\r\n" + "    }\r\n\r\n";

    result += "    function getTriviaWidth(value: number): number {\r\n" + "        return value >>> SyntaxConstants.TriviaFullWidthShift;\r\n" + "    }\r\n" + "\r\n" + "    function hasTriviaComment(value: number): boolean {\r\n" + "        return (value & SyntaxConstants.TriviaCommentMask) !== 0;\r\n" + "    }\r\n" + "\r\n" + "    function hasTriviaNewLine(value: number): boolean {\r\n" + "        return (value & SyntaxConstants.TriviaNewLineMask) !== 0;\r\n" + "    }\r\n";

    result += "}";

    return result;
}

function generateWalker() {
    var result = "";

    result += "///<reference path='references.ts' />\r\n" + "\r\n" + "module TypeScript {\r\n" + "    export class SyntaxWalker implements ISyntaxVisitor {\r\n" + "        public visitToken(token: ISyntaxToken): void {\r\n" + "        }\r\n" + "\r\n" + "        public visitNode(node: SyntaxNode): void {\r\n" + "            node.accept(this);\r\n" + "        }\r\n" + "\r\n" + "        public visitNodeOrToken(nodeOrToken: ISyntaxNodeOrToken): void {\r\n" + "            if (nodeOrToken.isToken()) { \r\n" + "                this.visitToken(<ISyntaxToken>nodeOrToken);\r\n" + "            }\r\n" + "            else {\r\n" + "                this.visitNode(<SyntaxNode>nodeOrToken);\r\n" + "            }\r\n" + "        }\r\n" + "\r\n" + "        private visitOptionalToken(token: ISyntaxToken): void {\r\n" + "            if (token === null) {\r\n" + "                return;\r\n" + "            }\r\n" + "\r\n" + "            this.visitToken(token);\r\n" + "        }\r\n" + "\r\n" + "        public visitOptionalNode(node: SyntaxNode): void {\r\n" + "            if (node === null) {\r\n" + "                return;\r\n" + "            }\r\n" + "\r\n" + "            this.visitNode(node);\r\n" + "        }\r\n" + "\r\n" + "        public visitOptionalNodeOrToken(nodeOrToken: ISyntaxNodeOrToken): void {\r\n" + "            if (nodeOrToken === null) {\r\n" + "                return;\r\n" + "            }\r\n" + "\r\n" + "            this.visitNodeOrToken(nodeOrToken);\r\n" + "        }\r\n" + "\r\n" + "        public visitList(list: ISyntaxList): void {\r\n" + "            for (var i = 0, n = list.childCount(); i < n; i++) {\r\n" + "               this.visitNodeOrToken(list.childAt(i));\r\n" + "            }\r\n" + "        }\r\n" + "\r\n" + "        public visitSeparatedList(list: ISeparatedSyntaxList): void {\r\n" + "            for (var i = 0, n = list.childCount(); i < n; i++) {\r\n" + "                var item = list.childAt(i);\r\n" + "                this.visitNodeOrToken(item);\r\n" + "            }\r\n" + "        }\r\n";

    for (var i = 0; i < definitions.length; i++) {
        var definition = definitions[i];
        if (definition.isAbstract) {
            continue;
        }

        result += "\r\n";
        result += "        public visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): void {\r\n";

        for (var j = 0; j < definition.children.length; j++) {
            var child = definition.children[j];

            if (child.isToken) {
                if (child.isOptional) {
                    result += "            this.visitOptionalToken(node." + child.name + ");\r\n";
                } else {
                    result += "            this.visitToken(node." + child.name + ");\r\n";
                }
            } else if (child.isList) {
                result += "            this.visitList(node." + child.name + ");\r\n";
            } else if (child.isSeparatedList) {
                result += "            this.visitSeparatedList(node." + child.name + ");\r\n";
            } else if (isNodeOrToken(child)) {
                if (child.isOptional) {
                    result += "            this.visitOptionalNodeOrToken(node." + child.name + ");\r\n";
                } else {
                    result += "            this.visitNodeOrToken(node." + child.name + ");\r\n";
                }
            } else if (child.type !== "SyntaxKind") {
                if (child.isOptional) {
                    result += "            this.visitOptionalNode(node." + child.name + ");\r\n";
                } else {
                    result += "            this.visitNode(node." + child.name + ");\r\n";
                }
            }
        }

        result += "        }\r\n";
    }

    result += "    }";
    result += "\r\n}";
    return result;
}

function firstEnumName(e, value) {
    for (var name in e) {
        if (e[name] === value) {
            return name;
        }
    }
}

function generateKeywordCondition(keywords, currentCharacter, indent) {
    var length = keywords[0].text.length;

    var result = "";
    var index;

    if (keywords.length === 1) {
        var keyword = keywords[0];

        if (currentCharacter === length) {
            return indent + "return SyntaxKind." + firstEnumName(TypeScript.SyntaxKind, keyword.kind) + ";\r\n";
        }

        var keywordText = keywords[0].text;
        result = indent + "return (";

        for (var i = currentCharacter; i < length; i++) {
            if (i > currentCharacter) {
                result += " && ";
            }

            index = i === 0 ? "startIndex" : ("startIndex + " + i);
            result += "array[" + index + "] === CharacterCodes." + keywordText.substr(i, 1);
        }

        result += ") ? SyntaxKind." + firstEnumName(TypeScript.SyntaxKind, keyword.kind) + " : SyntaxKind.IdentifierName;\r\n";
    } else {
        index = currentCharacter === 0 ? "startIndex" : ("startIndex + " + currentCharacter);
        result += indent + "switch(array[" + index + "]) {\r\n";

        var groupedKeywords = TypeScript.ArrayUtilities.groupBy(keywords, function (k) {
            return k.text.substr(currentCharacter, 1);
        });

        for (var c in groupedKeywords) {
            if (groupedKeywords.hasOwnProperty(c)) {
                result += indent + "case CharacterCodes." + c + ":\r\n";
                result += indent + "    // " + TypeScript.ArrayUtilities.select(groupedKeywords[c], function (k) {
                    return k.text;
                }).join(", ") + "\r\n";
                result += generateKeywordCondition(groupedKeywords[c], currentCharacter + 1, indent + "    ");
            }
        }

        result += indent + "default:\r\n";
        result += indent + "    return SyntaxKind.IdentifierName;\r\n";
        result += indent + "}\r\n\r\n";
    }

    return result;
}

function generateScannerUtilities() {
    var result = "///<reference path='references.ts' />\r\n" + "\r\n" + "module TypeScript {\r\n" + "    export class ScannerUtilities {\r\n";

    var i;
    var keywords = [];

    for (i = TypeScript.SyntaxKind.FirstKeyword; i <= TypeScript.SyntaxKind.LastKeyword; i++) {
        keywords.push({ kind: i, text: TypeScript.SyntaxFacts.getText(i) });
    }

    result += "        public static identifierKind(array: number[], startIndex: number, length: number): SyntaxKind {\r\n";

    var minTokenLength = TypeScript.ArrayUtilities.min(keywords, function (k) {
        return k.text.length;
    });
    var maxTokenLength = TypeScript.ArrayUtilities.max(keywords, function (k) {
        return k.text.length;
    });
    result += "            switch (length) {\r\n";

    for (i = minTokenLength; i <= maxTokenLength; i++) {
        var keywordsOfLengthI = TypeScript.ArrayUtilities.where(keywords, function (k) {
            return k.text.length === i;
        });
        if (keywordsOfLengthI.length > 0) {
            result += "            case " + i + ":\r\n";
            result += "                // " + TypeScript.ArrayUtilities.select(keywordsOfLengthI, function (k) {
                return k.text;
            }).join(", ") + "\r\n";

            result += generateKeywordCondition(keywordsOfLengthI, 0, "            ");
        }
    }

    result += "            default:\r\n";
    result += "                return SyntaxKind.IdentifierName;\r\n";
    result += "            }\r\n";
    result += "        }\r\n";

    result += "    }\r\n";
    result += "}";

    return result;
}

function generateVisitor() {
    var i;
    var definition;
    var result = "";

    result += "///<reference path='references.ts' />\r\n\r\n";

    result += "module TypeScript {\r\n";
    result += "    export interface ISyntaxVisitor {\r\n";
    result += "        visitToken(token: ISyntaxToken): any;\r\n";

    for (i = 0; i < definitions.length; i++) {
        definition = definitions[i];
        if (!definition.isAbstract) {
            result += "        visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): any;\r\n";
        }
    }

    result += "    }\r\n\r\n";

    if (!forPrettyPrinter) {
        result += "    export class SyntaxVisitor implements ISyntaxVisitor {\r\n";
        result += "        public defaultVisit(node: ISyntaxNodeOrToken): any {\r\n";
        result += "            return null;\r\n";
        result += "        }\r\n";
        result += "\r\n";
        result += "        public visitToken(token: ISyntaxToken): any {\r\n";
        result += "            return this.defaultVisit(token);\r\n";
        result += "        }\r\n";

        for (i = 0; i < definitions.length; i++) {
            definition = definitions[i];

            if (!definition.isAbstract) {
                result += "\r\n        public visit" + getNameWithoutSuffix(definition) + "(node: " + definition.name + "): any {\r\n";
                result += "            return this.defaultVisit(node);\r\n";
                result += "        }\r\n";
            }
        }

        result += "    }";
    }

    result += "\r\n}";

    return result;
}

function generateFactory() {
    var result = "///<reference path='references.ts' />\r\n";

    result += "\r\nmodule TypeScript.Syntax {\r\n";
    result += "    export interface IFactory {\r\n";

    var i;
    var j;
    var definition;
    var child;

    for (i = 0; i < definitions.length; i++) {
        definition = definitions[i];
        if (definition.isAbstract) {
            continue;
        }
        result += "        " + camelCase(getNameWithoutSuffix(definition)) + "(";

        for (j = 0; j < definition.children.length; j++) {
            if (j > 0) {
                result += ", ";
            }

            child = definition.children[j];
            result += child.name + ": " + getType(child);
        }

        result += "): " + definition.name + ";\r\n";
    }

    result += "    }\r\n\r\n";

    result += "    export class NormalModeFactory implements IFactory {\r\n";

    for (i = 0; i < definitions.length; i++) {
        definition = definitions[i];
        if (definition.isAbstract) {
            continue;
        }
        result += "        " + camelCase(getNameWithoutSuffix(definition)) + "(";

        for (j = 0; j < definition.children.length; j++) {
            if (j > 0) {
                result += ", ";
            }

            child = definition.children[j];
            result += getSafeName(child) + ": " + getType(child);
        }

        result += "): " + definition.name + " {\r\n";
        result += "            return new " + definition.name + "(";

        for (j = 0; j < definition.children.length; j++) {
            child = definition.children[j];
            result += getSafeName(child);
            result += ", ";
        }

        result += "/*parsedInStrictMode:*/ false);\r\n";
        result += "        }\r\n";
    }

    result += "    }\r\n\r\n";

    result += "    export class StrictModeFactory implements IFactory {\r\n";

    for (i = 0; i < definitions.length; i++) {
        definition = definitions[i];
        if (definition.isAbstract) {
            continue;
        }
        result += "        " + camelCase(getNameWithoutSuffix(definition)) + "(";

        for (j = 0; j < definition.children.length; j++) {
            if (j > 0) {
                result += ", ";
            }

            child = definition.children[j];
            result += getSafeName(child) + ": " + getType(child);
        }

        result += "): " + definition.name + " {\r\n";
        result += "            return new " + definition.name + "(";

        for (j = 0; j < definition.children.length; j++) {
            child = definition.children[j];
            result += getSafeName(child);
            result += ", ";
        }

        result += "/*parsedInStrictMode:*/ true);\r\n";

        result += "        }\r\n";
    }

    result += "    }\r\n\r\n";

    result += "    export var normalModeFactory: IFactory = new NormalModeFactory();\r\n";
    result += "    export var strictModeFactory: IFactory = new StrictModeFactory();\r\n";
    result += "}";

    return result;
}

var syntaxNodes = generateNodes();
var rewriter = generateRewriter();
var tokens = generateTokens();
var walker = generateWalker();
var scannerUtilities = generateScannerUtilities();
var visitor = generateVisitor();
var factory = generateFactory();

Environment.writeFile(Environment.currentDirectory() + "\\src\\compiler\\syntax\\syntaxNodes.generated.ts", syntaxNodes, true);
Environment.writeFile(Environment.currentDirectory() + "\\src\\compiler\\syntax\\syntaxRewriter.generated.ts", rewriter, true);
Environment.writeFile(Environment.currentDirectory() + "\\src\\compiler\\syntax\\syntaxToken.generated.ts", tokens, true);
Environment.writeFile(Environment.currentDirectory() + "\\src\\compiler\\syntax\\syntaxWalker.generated.ts", walker, true);
Environment.writeFile(Environment.currentDirectory() + "\\src\\compiler\\syntax\\scannerUtilities.generated.ts", scannerUtilities, true);
Environment.writeFile(Environment.currentDirectory() + "\\src\\compiler\\syntax\\syntaxVisitor.generated.ts", visitor, true);
Environment.writeFile(Environment.currentDirectory() + "\\src\\compiler\\syntax\\syntaxFactory.generated.ts", factory, true);
