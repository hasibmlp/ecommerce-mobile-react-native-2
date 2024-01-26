import { Text, View } from "react-native";
import Button from "../buttons/Button";
import InputListItem from "./InputListItem";
import { Formik } from "formik";
import * as yup from "yup";
import ErrorMessage from "./ErrorMessage";
import { useContext, useRef, useState } from "react";
import { FilterPriceRangeContext } from "../../contexts/FilterPriceRangeContext";

export default function PriceRangeForm({
  option,
  setActiveFilterInput,
  setLoading,
  maxFilterPriceRange
}) {

  const validationSchema = yup.object({
    min: yup
      .number("must be number")
      .required("Minimum field is required")
      .integer()
      .test(
        "check-min-value",
        `Price must be within 0 AED - ${maxFilterPriceRange.current} AED`,
        function (value) {
          return value >= 0;
        }
      ),
    max: yup
      .number("must be number")
      .required("Maximum field is required")
      .positive()
      .integer()
      .test(
        "check-max-value",
        `Price must be within 0 AED - ${maxFilterPriceRange.current} AED`,
        function (value) {
          return value <= maxFilterPriceRange.current;
        }
      ),
  });

  return (
    <View className="p-3">
      <Formik
        initialValues={{ min: "0", max: null }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setLoading(true);
          const priceRange = {
            id: option.id,
            label: `${values.min} - ${values.max}`,
            input: {
              price: { max: parseInt(values.max), min: parseInt(values.min) },
            },
          };

          setActiveFilterInput((prevState) => {
            const prevFilterInputs = [...prevState];
            const inputIndex = prevFilterInputs.findIndex(
              (prevInput) => prevInput.id === option.id
            );

            if (inputIndex > -1) prevFilterInputs.splice(inputIndex, 1);
            return [...prevFilterInputs, priceRange];
          });
        }}
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <InputListItem
              style={{ marginBottom: 12 }}
              priceType="min"
              price={0}
              values={values}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            <InputListItem
              style={{ marginBottom: 12 }}
              priceType="max"
              price={maxFilterPriceRange.current}
              values={values}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
            <ErrorMessage errors={errors} touched={touched} />
            <Button onPress={handleSubmit} label="apply" />
          </>
        )}
      </Formik>
    </View>
  );
}
