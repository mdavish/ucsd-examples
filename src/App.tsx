import { useEffect } from "react";
import { FilterSearch } from "@yext/search-ui-react";
import {
  useSearchActions,
  Matcher,
  StaticFilter,
  SelectableStaticFilter,
  FilterCombinator,
} from "@yext/search-headless-react"
import "@yext/search-ui-react/bundle.css"

// In reality, you'd have this variable available some other way.
const INITIAL_VALUE = "Orthopedics";

function App() {

  useEffect(() => {
    const complexFilter: SelectableStaticFilter = {
      displayName: "Specialty",
      selected: true,
      filter: {
        kind: "disjunction",
        combinator: FilterCombinator.OR,
        filters: [
          {
            kind: "fieldValue",
            fieldId: "c_relatedSpecialty.name",
            matcher: Matcher.Equals,
            value: INITIAL_VALUE,
          },
          {
            kind: "fieldValue",
            fieldId: "c_relatedSubspecialty.name",
            matcher: Matcher.Equals,
            value: INITIAL_VALUE,
          },
          {
            kind: "fieldValue",
            fieldId: "c_relatedConditionsTreated.name",
            matcher: Matcher.Equals,
            value: INITIAL_VALUE,
          },
        ]
      }
    }
    searchActions.setStaticFilters([complexFilter]);
  }, [INITIAL_VALUE])

  const searchActions = useSearchActions();

  searchActions.addListener({
    valueAccessor: (s => s.filters.static),
    callback: (filters) => {
      if (filters) {

        const locationFilter = filters.find(f => {
          return (f.filter.kind === "fieldValue" && f.filter.fieldId === "builtin.location")
        });

        const nonLocationFilters = filters.filter(f => (
          f !== locationFilter
        ))

        if (locationFilter) {
          const locationFilterFilter = locationFilter.filter;

          // Assert that it's a field value filter
          if (locationFilterFilter.kind === "fieldValue") {

            const locationPlaceId = locationFilterFilter.value;

            const projectedLocationFilter: StaticFilter = {
              fieldId: "c_linkedLocations.builtin.location",
              matcher: Matcher.Equals,
              value: locationPlaceId,
              kind: "fieldValue",
            }

            const compoundLocationFilter: SelectableStaticFilter = {
              selected: true,
              displayName: "Location",
              filter: {
                kind: "disjunction",
                combinator: FilterCombinator.OR,
                filters: [
                  locationFilterFilter,
                  projectedLocationFilter,
                ]
              }
            }

            searchActions.setStaticFilters([
              compoundLocationFilter,
              ...nonLocationFilters,
            ])

          } else {
            throw new Error("Unexpected location filter kind.")
          }
        }
      }
    }
  })

  return (
    <div>
      <h2>Filter Search Examples</h2>
      <FilterSearch
        searchOnSelect={true}
        searchFields={[
          {
            entityType: "healthcareProfessional",
            fieldApiName: "builtin.location",
          }
        ]}
      />
    </div>
  )
}

export default App
