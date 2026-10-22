export interface Medicine {
    id: number
    name: string
    medical_name: string | null
    price: string | number | null   // Postgres returns numeric as a string
    dosage: string | null
}