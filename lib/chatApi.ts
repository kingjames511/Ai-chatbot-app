import { error } from "console";

interface ChatMessage {
    role : 'user' | 'assistant';
    content : string;
}
 export async function sendMessageToGeminiApi(message : string, conversationHistory : ChatMessage[] = []): Promise<string>  { 
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) {
            throw new Error("Supabase URL or Key is not set");
        }
        const response = await fetch(`${supabaseUrl}/functions/v1/chat`,{
            method :'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({message,
                conversationHistory : conversationHistory.slice(-10)
            })
        })
        if(!response.ok){
            const errorData = await response.json().catch(()=>({}));
            throw new Error(`HTTPS ${ response.status} : ${errorData.error || 'unknown error occured'}`)
        }
        const data = await response.json()
        if(!data.success){
            throw new Error(data.error || ' unknown error occured')
        }
        return data.response;
    }catch(error){
        console.error('chat api error', error)
        throw error;
    }
    }
