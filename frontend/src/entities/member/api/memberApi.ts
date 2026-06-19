import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQueryWithReauth } from '@/entities/session'

import type { Member } from '../model/types'

export const memberApi = createApi({
  reducerPath: 'memberApi',
  baseQuery: baseQueryWithReauth,

  endpoints: (builder) => ({
    getMembers: builder.query<Member[], string>({
      query: (workspaceId) => ({ url: `workspaces/${workspaceId}/members`, method: 'GET' }),
    }),
  }),
})

export const { useGetMembersQuery } = memberApi
