import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )

  console.log('passou')

export async function POST(req: Request) {
    try {

        const formData = await req.formData()
        const file = formData.get('file') as File
        const pasta_id = formData.get('pasta_id')

        const {data, error} = await supabase.storage
          .from('Imagens/' + pasta_id + '/')
          .upload(file.name, file, {
            upsert: true,
          })

        if (error) {
          throw new Error('Falha no Upload!')
        }

        const { data: imageUrl } = supabase.storage
          .from('Imagens' + '/' + pasta_id )
          .getPublicUrl(data.path)

        return Response.json(
            {
                imageUrl: imageUrl.publicUrl,
            },
            {
              status: 201,
            },
        )

      } catch (error) {
        if (error instanceof Error) {
            return Response.json({error: error.message})
        }
      } 
}