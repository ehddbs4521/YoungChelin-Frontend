import { api } from ".";

export const evaluateApi = api.injectEndpoints({
  endpoints: (build) => ({
    postRestaurant: build.mutation<void, RestaurantDto>({
      query: (body) => ({
        url: "/evaluate/find-restaurant",
        method: "POST",
        body,
      }),
    }),

    getDishes: build.query<MenuResponseDto[], string>({
      query: (restaurantId) => ({
        url: `/evaluate/menu/${restaurantId}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: "Dish" as const,
                id: item.menuId,
              })),
              { type: "Dish", id: "LIST" },
            ]
          : [{ type: "Dish", id: "LIST" }],
    }),

    /**
     * FormData key 목록
     * @param file - File
     * @param restaurantId - string
     * @param menuName - string
     */
    postMenu: build.mutation<MenuResponseDto, FormData>({
      query: (body) => ({
        url: "/evaluate/menu/add-menu",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Dish", id: "LIST" }],
    }),

    /**
     * FormData key 목록
     * @param menuId - number
     * @param restaurantId - string
     * @param resultDto - ResultDto
     * @param file - File
     */
    postEvaluation: build.mutation<void, { body: FormData; menuId: string }>({
      query: ({ body, menuId }) => ({
        url: `/evaluate/menu/survey/${menuId}`,
        method: "POST",
        body,
      }),
    }),
  }),
});
