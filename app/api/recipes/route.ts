import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';
import { Result } from "@/app/models/Result";


export async function GET(request: Request) {
  let result :Result={
    recipies: [],
    inputText: ''
  };
  const { searchParams } = new URL(request.url);
  const searchInputParam = searchParams.get('search');

  if (!searchInputParam) {
    return NextResponse.json({ error: 'Missing search parameter' }, { status: 400 });
  }


  const terms = searchInputParam.split(',').map((parameter) => parameter.trim());

  const { data, error } = await supabase.rpc('get_recipes_by_ingredients_and_name', {
    terms,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  result.recipies=data;
  return NextResponse.json(result);
}