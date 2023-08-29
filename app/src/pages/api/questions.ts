import type { NextApiResponse, NextApiRequest } from "next";
import type { Question } from "@/types/index";
import { v4 } from "uuid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const data = await prisma.question.findMany({
            include: {
                //多分userとcategoryも含めて情報を取得している
                category : true,
                answers: true,
            },
        });

        res.json(data)
    } catch (error) {
        console.error("Error fetching questions:", error);  // エラーをログ出力
        res.status(500).json({ error: "not found" });
    }   
};

export default handle;