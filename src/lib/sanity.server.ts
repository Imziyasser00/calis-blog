import { createClient } from "next-sanity"

export const serverClient = createClient({
    projectId: "imh5dids"!,
    dataset: "production",
    apiVersion: "2023-08-01",
    useCdn: false,
    token: "skrLulGJVXWfzbnfVKDFyFUeqj7chG1bk2W45Z7DrYvtvSLAxcEmsvVcrxB4AN8AezxEpxa1L96KHUO74Y0Mz1i6aKRdBWQpaLgbaE1Q3cwPv57V9ofm97jkg6MyRfSw4bSpuBH6NXRPXtNxIevpeF0MxXjrtwaDTR1NPYWrnEQx7h6fbVyz", // 👈 gives write access
})
