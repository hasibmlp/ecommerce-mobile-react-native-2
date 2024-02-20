import { useState, useEffect } from "react";
import {

  FlatList,
  Text,
  View,
} from "react-native";

import LoadingFullScreen from "../Sidebar/LoadingFullScreen";
import TabButton from "../Sidebar/Buttons/TabButton";
import CheckList from "../Sidebar/Buttons/CheckList";
import PriceRangeForm from "../Sidebar/PriceRangeForm";
import ActiveFilter from "../Sidebar/ActiveFilter";
import Button from "../buttons/Button";
import { FONT_FAMILY } from "../../theme";

function FilterBody({
  onClose,
  loading,
  filters,
  activeFilterInput,
  setLoading,
  setActiveFilterInput,
  maxFilterPriceRange,
}) {

  const handleReset = () => {
    setActiveFilterInput([])
  }
  return (
    <View className="flex-1">
      {loading && <LoadingFullScreen />}
      <Header
        activeFilterInput={activeFilterInput}
        setLoading={setLoading}
        setActiveFilterInput={setActiveFilterInput}
      />

      <Content
        filters={filters}
        activeFilterInput={activeFilterInput}
        setLoading={setLoading}
        setActiveFilterInput={setActiveFilterInput}
        loading={loading}
        maxFilterPriceRange={maxFilterPriceRange}
      />

      <Footer onClose={onClose} handleReset={handleReset} />
    </View>
  );
}

function Content({
  filters,
  activeFilterInput,
  setLoading,
  setActiveFilterInput,
  loading,
  maxFilterPriceRange,
}) {
  const [filterState, setFilterState] = useState(filters);
  const [activeTabContent, setActiveTabContent] = useState(filterState[0]);

  useEffect(() => {
    if (!filters) setLoading(true);
    if (filters) {
      setLoading(false);
      setFilterState(filters);
    }
  }, [filters]);

  const filteredArray = filterState.map((item) => {
    return {
      id: item.id,
      input: item.input,
      type: item.type,
      label: item.label,
      values:
        item.type === "PRICE_RANGE"
          ? item.values
          : item.values?.filter((i) => i.count > 0),
    };
  });

  const filteredValuesV1 = filteredArray.filter(
    (item) => item.type === "PRICE_RANGE" || item.values.length > 0
  );

  // console.log(activeFilterInput)
  
  const activeTabs = activeFilterInput.map(item => item.parent)
  
  console.log(activeTabs)
  
  return (
    <View className="flex-1 flex-row">
      <View className="basis-[30%] bg-blue-50 h-full">
        <FlatList
          data={filteredValuesV1}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => {
            // if(item.values.reduce((sum, currentIndex) => sum + currentIndex.count, 0))
            //   return null
            return (
              <TabButton
                key={item.id}
                title={item.label}
                onPress={() => setActiveTabContent(item)}
                active={item.id === activeTabContent?.id}
                tabValuesSelected={activeTabs.includes(item.label)}
              />
            );
          }}
        />
      </View>
      <View className=" flex-1">
        <FlatList
          data={activeTabContent?.values}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => {
            if (activeTabContent.type !== "PRICE_RANGE") {
              return (
                <CheckList
                  key={item?.id}
                  option={item}
                  setLoading={setLoading}
                  setActiveFilterInput={setActiveFilterInput}
                  activeFilterInput={activeFilterInput}
                  loading={loading}
                  activeTabLabel={activeTabContent?.label}
                />
              );
            } else {
              return (
                <PriceRangeForm
                  option={item}
                  setLoading={setLoading}
                  setActiveFilterInput={setActiveFilterInput}
                  maxFilterPriceRange={maxFilterPriceRange}
                  activeTabLabel={activeTabContent?.label}
                />
              );
            }
          }}
        />
      </View>
    </View>
  );
}

function Header({ activeFilterInput, setLoading, setActiveFilterInput }) {
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
      <Text
        style={FONT_FAMILY.primary}
        className="text-[16px] text-black font-light"
      >
        Apply Filters
      </Text>
      {
        <ActiveFilter
          activeFilterInput={activeFilterInput}
          style={{ paddingHorizontal: 8, paddingTop: 12 }}
          setLoading={setLoading}
          setActiveFilterInput={setActiveFilterInput}
        />
      }
    </View>
  );
}

function Footer({ onClose, handleReset }) {

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
      <View className="w-full flex-row justify-between px-3 my-4">
        <View className="flex-1">
          <Button
          onPress={handleReset}
            type="secondary"
            label="reset"
            flex
            style={{ marginRight: 16 }}
          />
        </View>
        <View className="flex-1">
          <Button label="done" flex onPress={onClose} />
        </View>
      </View>
    </View>
  );
}

export default FilterBody
