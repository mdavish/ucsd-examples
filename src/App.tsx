import { FilterSearch } from "@yext/search-ui-react";
import {
  useSearchActions,
  Matcher,
  StaticFilter,
  SelectableStaticFilter,
  FilterCombinator,
} from "@yext/search-headless-react"
import "@yext/search-ui-react/bundle.css"

function App() {

  const searchActions = useSearchActions();

  searchActions.addListener({
    valueAccessor: (s => s.filters.static),
    callback: (filters) => {
      if (filters) {

        const locationFilter = filters.find(f => {
          return (f.filter.kind === "fieldValue" && f.filter.fieldId === "builtin.location")
        });

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
