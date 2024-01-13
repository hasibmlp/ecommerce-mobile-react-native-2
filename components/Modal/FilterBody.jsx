import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingFullScreen from "../Sidebar/LoadingFullScreen";
import TabButton from "../Sidebar/Buttons/TabButton";
import CheckList from "../Sidebar/Buttons/CheckList";
import PriceRangeForm from "../Sidebar/PriceRangeForm";
import ActiveFilter from "../Sidebar/ActiveFilter";
import { useContext, useState, useEffect } from "react";
import { SideBarContext } from "../../App";
import Button from "../buttons/Button";
import { checkTabActive } from "../utils/UtilsFunctions";
import { FilterSelectionContext } from "../../contexts/FilterSelectionContext";

export default function FilterBody({ onClose, loading, filters, activeFilterInput, setLoading, setActiveFilterInput }) {

  return (
    <SafeAreaView className="absolute top-0 left-0 bottom-0 right-0 z-40 bg-white">
      <View className="flex-1">
        {loading && <LoadingFullScreen />}
        <Header activeFilterInput={activeFilterInput} />
        <Content filters={filters} activeFilterInput={activeFilterInput} setLoading={setLoading} setActiveFilterInput={setActiveFilterInput}  />
        <Footer onClose={onClose} activeFilterInput={activeFilterInput} loading={loading} />
      </View>
    </SafeAreaView>
  );
}

function Content({ openSideBar, filters, activeFilterInput, setLoading, setActiveFilterInput }) {

  const [activeButton, setActiveButton] = useState(filters[0]?.label);
  const [priceRange, setPriceRange] = useState(null);
  const input = JSON.parse(
    filters?.filter((filter) => filter?.type === "PRICE_RANGE")[0]?.values[0]?.input
  );

  useEffect(() => {
    if (!filters) setLoading(true);
    if (filters) setLoading(false);
  }, [filters]);

  useEffect(() => {
    // presist maximum and minimum value through re-renders
    if (priceRange === null || priceRange.max === undefined) {
      setPriceRange({ min: input.price.min, max: input.price.max });
    }
  }, [filters, setPriceRange, priceRange]);

  return (
    <View className="flex-1 flex-row">
      <View className="basis-[30%] bg-blue-50 h-full">
        <ScrollView
          className=""
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        >
          {filters.map((filter) => {
            const isTabActive = checkTabActive(filter);

            if (filter.values.length === 0) return null;
            let isFilterValuesSelected = false;
            activeFilterInput.forEach((activeFilter) => {
              filter.values.forEach((value) => {
                if (value.id === activeFilter.id) isFilterValuesSelected = true;
              });
            });
            if (filter.type === "PRICE_RANGE")
              return (
                <TabButton
                  key={filter.id}
                  title={filter.label}
                  handlePress={() => {
                    setActiveButton(filter.label);
                  }}
                  activeButton={activeButton}
                  active={isFilterValuesSelected}
                />
              );
            else
              return (
                isTabActive && (
                  <TabButton
                    key={filter.id}
                    title={filter.label}
                    handlePress={() => {
                      setActiveButton(filter.label);
                    }}
                    activeButton={activeButton}
                    active={isFilterValuesSelected}
                  />
                )
              );
          })}
        </ScrollView>
      </View>
      <View className=" flex-1">
        <ScrollView>
          {filters.map((filter) => {
            if (activeButton === filter.label) {
              if (filter.type === "LIST") {
                return filter.values.map((value, index) => {
                  if (value.count === 0) return null;
                  return <CheckList key={index.toString()} option={value} setLoading={setLoading} setActiveFilterInput={setActiveFilterInput} activeFilterInput={activeFilterInput} />;
                });
              }
              if (filter.type === "PRICE_RANGE")
                return (
                  <PriceRangeForm
                    key={filter.values[0].id}
                    option={filter.values[0]}
                    priceRangeFilter={priceRange}
                  />
                );
            }
          })}
        </ScrollView>
      </View>
    </View>
  );
}

function Header({activeFilterInput}) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        elevation: 3,
      }}
      className={`w-full pt-3 pb-3 justify-center items-center z-10`}
    >
      <Text className="text-[16px] text-black font-light">Apply Filters</Text>
      {<ActiveFilter activeFilterInput2={activeFilterInput} style={{ paddingHorizontal: 8, paddingTop: 12 }} />}
    </View>
  );
}

function Footer({ onClose, activeFilterInput, loading }) {
  const productTotalCount = 100;

  let resutlError = null;
  if (
    activeFilterInput.length !== null &&
    productTotalCount === 0 &&
    !loading
  ) {
    resutlError = "The result is empty, Please select ohter value!!";
  }
  handleCloseButton = () => {
    !resutlError && onClose;
  };
  return (
    <View
      style={{
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        elevation: 3,
      }}
      className="w-full items-center py-3 mb-3"
    >
      {resutlError && (
        <View className="h-5 flex-row items-center ">
          <Text className="text-[16px] text-red-500 text-normal">
            {resutlError}
          </Text>
        </View>
      )}
      {!resutlError && (
        <View className="h-5 flex-row items-center ">
          {productTotalCount === 0 ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text className="text-[12px] text-black text-normal">
              {productTotalCount}
            </Text>
          )}
          <Text className="text-[12px] text-black text-normal"> results</Text>
        </View>
      )}
      <View className="w-full flex-row justify-between px-3 mt-4">
        <Button
          type="secondary"
          label="reset"
          flex
          style={{ marginRight: 16 }}
        />
        <Button label="done" flex onPress={onClose} />
      </View>
    </View>
  );
}
