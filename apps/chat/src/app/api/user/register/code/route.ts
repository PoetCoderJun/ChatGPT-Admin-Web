import { NextRequest, NextResponse } from "next/server";
// import { RegisterCodeLogic, RegisterReturnStatus } from "database";
import { sendEmail } from "@/lib/email";
import { ResponseStatus } from "@/app/api/typing.d";

/**
 * Request verification code.
 * @param req
 * @constructor
 */
export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);

  const email = searchParams.get("email");

  if (!email) return NextResponse.json({ status: ResponseStatus.notExist });

  // Logic will automatically check the speed.
  return NextResponse.json({
    status: ResponseStatus.Success,
    code_data: '123456',
  });
}

export const runtime = 'edge';
