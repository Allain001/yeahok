"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type TutorTopic = {
  id: string;
  title: string;
  prompt: string;
  moduleHref: string;
};

type TutorReply = {
  title: string;
  summary: string;
  explanation: string[];
  nextStep: string;
  moduleHref: string;
  formula?: string;
};

const suggestedTopics: TutorTopic[] = [
  {
    id: "determinant",
    title: "什么是行列式",
    prompt: "为什么行列式和面积变化有关？",
    moduleHref: "/transform-2d"
  },
  {
    id: "svd",
    title: "怎么理解 SVD",
    prompt: "为什么 SVD 可以看成旋转加伸缩？",
    moduleHref: "/svd"
  },
  {
    id: "pca",
    title: "PCA 和 SVD 的关系",
    prompt: "PCA 为什么能找到主成分方向？",
    moduleHref: "/pca"
  },
  {
    id: "least-squares",
    title: "最小二乘怎么讲",
    prompt: "为什么最小二乘得到的是最优近似？",
    moduleHref: "/least-squares"
  },
  {
    id: "projection",
    title: "投影为什么会丢信息",
    prompt: "三维投影到二维时，为什么一定会损失信息？",
    moduleHref: "/projection-3d-2d"
  }
];

function buildReply(question: string): TutorReply {
  const normalized = question.toLowerCase();

  if (normalized.includes("行列式") || normalized.includes("det")) {
    return {
      title: "行列式的几何意义",
      summary: "行列式最值得记住的不是代数形式，而是它对应了面积或体积的缩放倍数。",
      explanation: [
        "在二维里，矩阵会把单位正方形变成一个平行四边形，行列式的绝对值就是面积被放大或缩小了多少倍。",
        "如果行列式是负数，说明除了缩放，还发生了朝向翻转；如果行列式接近 0，说明平面被压扁，矩阵也会接近不可逆。",
        "所以行列式并不只是一个算出来的数字，它本身就是几何结构变化的读数。"
      ],
      nextStep: "去二维变换页拖动矩阵参数，观察单位正方形面积与行列式数值怎样同步变化。",
      moduleHref: "/transform-2d",
      formula: "|\\det(A)| = \\text{area / volume scale factor}"
    };
  }

  if (normalized.includes("svd")) {
    return {
      title: "SVD 的直觉入口",
      summary: "SVD 可以先理解成一个动作序列：先旋转，再伸缩，最后再旋转。",
      explanation: [
        "V^T 负责把输入旋转到更方便观察的方向。",
        "Σ 负责沿正交主方向做伸缩，奇异值决定每个方向被拉长或压缩多少。",
        "U 再把结果送到新的输出朝向，所以整体看上去是一个完整的几何动作链。"
      ],
      nextStep: "打开 SVD 页面，先只调奇异值，再调旋转角度，会更容易看清各部分分工。",
      moduleHref: "/svd",
      formula: "A = U\\Sigma V^T"
    };
  }

  if (normalized.includes("pca") || normalized.includes("主成分") || normalized.includes("方差")) {
    return {
      title: "PCA 为什么能找到主方向",
      summary: "PCA 关心的是：数据在哪个方向上最“散开”，哪个方向就最值得保留。",
      explanation: [
        "把数据中心化以后，协方差矩阵会记录整体在不同方向上的伸展情况。",
        "第一主成分就是方差最大的方向，因为把数据投影到这里能保留最多信息。",
        "如果继续找第二主成分，它必须和第一主成分正交，这样才能避免重复表达同一部分信息。"
      ],
      nextStep: "去 PCA 页面调相关性和伸展程度，观察主轴怎样旋转，以及点云怎样沿主轴分布。",
      moduleHref: "/pca",
      formula: "\\Sigma = \\frac{1}{n}X^TX"
    };
  }

  if (normalized.includes("最小二乘") || normalized.includes("least") || normalized.includes("残差") || normalized.includes("拟合")) {
    return {
      title: "最小二乘为什么是最优近似",
      summary: "最小二乘不是在追求每个点都命中，而是在整体上把误差压到最小。",
      explanation: [
        "当样本不可能全部落在同一条直线上时，我们只能找一条最接近这些点的拟合直线。",
        "最小二乘把每个点到拟合线的偏差平方后加起来，再寻找使这个总和最小的参数。",
        "从几何上看，这相当于把观测向量投影到模型张成的子空间上，因此残差会与这个子空间正交。"
      ],
      nextStep: "去最小二乘页面调斜率、截距和噪声，边看残差线段边讲“最优近似”。",
      moduleHref: "/least-squares",
      formula: "\\hat{\\beta} = (X^TX)^{-1}X^Ty"
    };
  }

  if (normalized.includes("投影") || normalized.includes("projection") || normalized.includes("降维")) {
    return {
      title: "投影为什么会丢信息",
      summary: "从高维到低维的映射本质上是在减少自由度，所以不可能保留全部空间结构。",
      explanation: [
        "当三维点云映射到二维平面时，原本分开的某些方向会在平面里重叠或压缩。",
        "这就是为什么不同的三维结构可能在二维里看起来相似，因为深度信息已经被丢掉了一部分。",
        "所以投影模块的重点不是“完全还原”，而是理解哪些方向被保留了，哪些方向被压掉了。"
      ],
      nextStep: "打开投影页，拖动观察角度和深度混合，比较左侧三维点云和右侧二维结果。",
      moduleHref: "/projection-3d-2d"
    };
  }

  return {
    title: "AI 助教建议",
    summary: "如果你还不确定从哪里问起，最好的办法是先把抽象概念落到一个具体模块里。",
    explanation: [
      "矩阵最适合从二维变换开始，因为图形变化最直观。",
      "如果你关心分解，就先看 SVD；如果你关心数据方向和降维，就看 PCA；如果你关心拟合和误差，就看最小二乘。",
      "这套网站的价值就在于把这些概念变成可观察的过程，而不只停留在公式层面。"
    ],
    nextStep: "建议先从 2D 变换开始，再根据兴趣切到 SVD、PCA 或最小二乘。",
    moduleHref: "/transform-2d"
  };
}

export default function AiTutorPage() {
  const [question, setQuestion] = useState("为什么最小二乘得到的是最优近似？");
  const [submittedQuestion, setSubmittedQuestion] = useState(question);

  const reply = useMemo(() => buildReply(submittedQuestion), [submittedQuestion]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden border-cyan/20 bg-gradient-to-br from-cyan/10 to-violet/10">
          <CardHeader>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan">
              <Sparkles className="h-3.5 w-3.5" />
              AI Tutor
            </div>
            <CardTitle className="text-4xl md:text-5xl">AI 助教</CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              这不是一个只会闲聊的聊天框，而是围绕线性代数核心概念设计的教学型助教。它负责把问题快速导向正确模块，把抽象概念翻译成可观察的页面操作。
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>推荐问法</CardTitle>
            <CardDescription>先点一个高频问题，再继续追问，最适合答辩时现场演示。</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {suggestedTopics.map((topic) => (
              <Button
                key={topic.id}
                variant="outline"
                className="justify-start text-left"
                onClick={() => {
                  setQuestion(topic.prompt);
                  setSubmittedQuestion(topic.prompt);
                }}
              >
                {topic.title}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>输入问题</CardTitle>
            <CardDescription>可以手输，也可以直接点击推荐问法。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-foreground outline-none transition focus:border-cyan/50"
              placeholder="例如：为什么行列式能表示面积变化？"
            />
            <Button className="w-full" onClick={() => setSubmittedQuestion(question)}>
              让 AI 助教解释
            </Button>
          </CardContent>
        </Card>

        <Card className="min-h-[560px]">
          <CardHeader>
            <CardTitle>{reply.title}</CardTitle>
            <CardDescription>{reply.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-cyan">当前问题</div>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{submittedQuestion}</p>
            </div>

            <div className="space-y-3">
              {reply.explanation.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-8 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>

            {reply.formula ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 text-xs uppercase tracking-[0.22em] text-violet-soft">关键公式</div>
                <div className="text-foreground">{reply.formula}</div>
              </div>
            ) : null}

            <div className="rounded-2xl border border-cyan/20 bg-cyan/10 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-cyan">下一步建议</div>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{reply.nextStep}</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href={reply.moduleHref}>
                  打开对应模块
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>它能做什么</CardTitle>
            <CardDescription>这版先做成适合答辩演示和教学讲解的稳定入口。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="font-medium text-foreground">概念翻译</div>
              <p className="mt-1">把行列式、SVD、PCA、最小二乘和投影这些术语讲成几何直觉。</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="font-medium text-foreground">模块导航</div>
              <p className="mt-1">根据当前问题，把用户带到最适合继续观察的页面，而不是让人自己去乱找。</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="font-medium text-foreground">答辩辅助</div>
              <p className="mt-1">现场可以把它当成提问入口，证明网站不是只会画图，而是有完整学习闭环。</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
