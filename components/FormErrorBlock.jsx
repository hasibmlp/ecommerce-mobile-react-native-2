import { Fragment } from "react";
import { Text, View } from "react-native";

const FormErrorBlock = ({ errors, touched }) => {
  const errorFields = [
    "position",
    "language",
    "color",
    "fontStyle",
    "firstLine",
    "secondLine",
    "imageUrl",
  ];

  const hasErrors = errorFields.some(
    (field) => touched[field] && errors[field]
  );

  //   useEffect(() => {
  //     if (errors) {
  //       scrollY.current.scrollTo({
  //         options: { x: 0, y: 0 },
  //       });
  //     }
  //   }, [errors]);

  if (!hasErrors) return null;

  return (
    <View className="items-center bg-red-500 py-2">
      {errorFields.map((field) => (
        <Fragment key={field}>
          {touched[field] && errors[field] && (
            <Text className="text-[14px] text-white font-medium">
              {errors[field]}
            </Text>
          )}
        </Fragment>
      ))}
    </View>
  );
};

export default FormErrorBlock;
