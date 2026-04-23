import type { HeroStat, ModuleSummary, NavItem, SliderDefinition, TheorySection } from "@/lib/types";

export const LEGACY_APP_BASE =
  process.env.NEXT_PUBLIC_LEGACY_APP_URL ?? "https://martrixvis-zh.onrender.com";

export const legacyRoute = (page: string) => `${LEGACY_APP_BASE}/?page=${page}`;

export const navItems: NavItem[] = [
  {
    title: "2D变换",
    href: "/transform-2d",
    description: "在平面里观察旋转、拉伸、镜像与剪切",
    accent: "cyan",
    legacyHref: legacyRoute("2d-transform")
  },
  {
    title: "3D变换",
    href: "/transform-3d",
    description: "用立方体、基向量和空间坐标理解三维矩阵",
    accent: "violet",
    legacyHref: legacyRoute("3d-transform")
  },
  {
    title: "SVD",
    href: "/svd",
    description: "把矩阵分解成旋转与伸缩组成的动作链",
    accent: "cyan",
    legacyHref: legacyRoute("svd-img-compression")
  },
  {
    title: "PCA",
    href: "/pca",
    description: "从数据云看主成分方向、方差与降维",
    accent: "violet",
    legacyHref: legacyRoute("pca-demo")
  },
  {
    title: "最小二乘",
    href: "/least-squares",
    description: "从残差、拟合和平面理解最优近似",
    accent: "cyan",
    legacyHref: legacyRoute("lse")
  },
  {
    title: "AI助教",
    href: "/ai-tutor",
    description: "把提问、概念解释和模块导览放到同一入口",
    accent: "violet"
  }
];

export const moduleSummaries: ModuleSummary[] = [
  {
    slug: "transform-2d",
    title: "二维变换实验室",
    href: "/transform-2d",
    description: "观察单位正方形、网格与基向量如何随着 2×2 矩阵同步变化。",
    status: "ready",
    legacyHref: legacyRoute("2d-transform")
  },
  {
    slug: "transform-3d",
    title: "三维变换观察台",
    href: "/transform-3d",
    description: "用立方体与点云解释三维矩阵对空间结构的作用。",
    status: "beta",
    legacyHref: legacyRoute("3d-transform")
  },
  {
    slug: "svd",
    title: "SVD 图像压缩",
    href: "/svd",
    description: "观察保留奇异值数量变化时，图像如何从模糊逐步回到清晰。",
    status: "ready",
    legacyHref: legacyRoute("svd-img-compression")
  },
  {
    slug: "pca",
    title: "PCA 主成分分析",
    href: "/pca",
    description: "从散点云和主轴方向理解方差最大与降维保真。",
    status: "beta",
    legacyHref: legacyRoute("pca-demo")
  },
  {
    slug: "least-squares",
    title: "最小二乘工作台",
    href: "/least-squares",
    description: "从残差线段和拟合结果理解什么叫最佳近似。",
    status: "beta",
    legacyHref: legacyRoute("lse")
  },
  {
    slug: "ai-tutor",
    title: "AI 助教",
    href: "/ai-tutor",
    description: "把概念提问、公式解释与学习建议统一到同一个入口。",
    status: "beta"
  }
];

export const heroStats: HeroStat[] = [
  { label: "核心模块", value: "6" },
  { label: "主展示页", value: "2D 变换" },
  { label: "最佳补充", value: "最小二乘" }
];

export const svdTheorySections: TheorySection[] = [
  {
    id: "intuition",
    title: "直觉入口",
    content:
      "SVD 可以先理解成一串动作，而不是一堆字母。它先调整输入坐标方向，再沿正交主方向伸缩，最后把结果旋转到新的输出朝向。"
  },
  {
    id: "formula",
    title: "公式结构",
    content:
      "矩阵 A 可以写成 UΣV^T。V^T 负责旋转输入，Σ 负责伸缩，U 负责把结果送到新的输出方向。",
    formula: "A = U\\Sigma V^T"
  },
  {
    id: "applications",
    title: "和 PCA / 压缩的关系",
    content:
      "图像压缩只保留最大的奇异值，PCA 则是在中心化数据上做同类分解。它们本质上都在回答同一个问题：哪些方向最重要。"
  }
];

export const svdSliders: SliderDefinition[] = [
  { key: "sigma1", label: "第一奇异值", min: 0.5, max: 3.5, step: 0.1 },
  { key: "sigma2", label: "第二奇异值", min: 0.2, max: 2.5, step: 0.1 },
  { key: "thetaDeg", label: "旋转角度", min: -180, max: 180, step: 1, unit: "°" },
  { key: "shear", label: "附加剪切", min: -1.2, max: 1.2, step: 0.05 },
  { key: "density", label: "采样密度", min: 6, max: 20, step: 1 }
];

export const transform2DTheorySections: TheorySection[] = [
  {
    id: "matrix-action",
    title: "矩阵在做什么",
    content:
      "二维矩阵会把平面中的每个点同时映射到新位置。你看到的不是单个点的移动，而是整个网格、单位正方形和基向量一起变化。"
  },
  {
    id: "columns",
    title: "看列向量最直观",
    content:
      "矩阵 A 的第一列就是 e₁ 的去向，第二列就是 e₂ 的去向。只要盯住这两根向量，很多几何性质都会一眼显现出来。",
    formula: "A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}"
  },
  {
    id: "geometry",
    title: "几何意义",
    content:
      "行列式的绝对值对应面积缩放倍数，符号决定是否翻转朝向。当两列越来越接近共线时，平面会被压扁，矩阵也会趋近不可逆。"
  }
];

export const pcaTheorySections: TheorySection[] = [
  {
    id: "data-cloud",
    title: "先看数据云",
    content:
      "PCA 最适合先从散点云的形状理解。哪个方向拉得更长、分布更散，哪个方向就更值得保留。"
  },
  {
    id: "covariance",
    title: "协方差矩阵",
    content:
      "把中心化后的数据整理成协方差矩阵，就能把样本整体的伸展和相关性编码进一个 2×2 的矩阵里。",
    formula: "\\Sigma = \\frac{1}{n} X^T X"
  },
  {
    id: "principal-axis",
    title: "主成分方向",
    content:
      "第一主成分就是方差最大的方向，第二主成分与它正交。把数据投影到主轴上，就能在尽量少损失信息的前提下完成降维。"
  }
];

export const leastSquaresTheorySections: TheorySection[] = [
  {
    id: "fit-goal",
    title: "最小二乘在回答什么",
    content:
      "当数据点不可能全部落在同一条直线上时，最小二乘要找的是一条让整体误差最小的近似直线，而不是逐点精确穿过样本。"
  },
  {
    id: "normal-equation",
    title: "法方程",
    content:
      "把设计矩阵写出来之后，最小二乘问题可以转成求解法方程。它本质上是在比较残差平方和，并寻找梯度为零的位置。",
    formula: "\\hat{\\beta} = (X^T X)^{-1} X^T y"
  },
  {
    id: "projection-view",
    title: "投影视角",
    content:
      "从几何上看，最优拟合就是把观测向量投影到模型张成的子空间上。残差向量与这个子空间正交，因此误差已经无法继续缩短。"
  }
];

export const transform3DTheorySections: TheorySection[] = [
  {
    id: "space-action",
    title: "从平面到空间",
    content:
      "三维矩阵会同时改变立方体、坐标轴和基向量。关键不是记住公式，而是看清每个方向在空间里被拉伸、旋转和剪切之后发生了什么。"
  },
  {
    id: "columns-3d",
    title: "三列就是三根新基向量",
    content:
      "3×3 矩阵的三列分别对应 e₁、e₂、e₃ 的去向。只要盯住这三根向量，立方体为什么会倾斜、拉长或压缩就会一眼看出来。",
    formula: "A = \\begin{bmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{bmatrix}"
  },
  {
    id: "volume",
    title: "体积与行列式",
    content:
      "三维情形下，行列式的绝对值对应体积缩放倍数，符号则决定空间朝向是否翻转。原始单位立方体经过矩阵作用后，会变成一个平行六面体。"
  }
];

export const projectionTheorySections: TheorySection[] = [
  {
    id: "projection-goal",
    title: "为什么要做 3D → 2D 投影",
    content:
      "很多三维数据最终还是要落到二维平面里展示。投影模块的目标，就是让你直观看到一个 2×3 映射怎样把空间点云压缩到平面中。"
  },
  {
    id: "projection-matrix",
    title: "2×3 映射怎么理解",
    content:
      "这个矩阵有三列，分别决定 x、y、z 三个方向在二维输出中的权重。改变它，本质上就是在改变空间信息被带到平面时的组合方式。",
    formula: "P = \\begin{bmatrix} p_{11} & p_{12} & p_{13} \\\\ p_{21} & p_{22} & p_{23} \\end{bmatrix}"
  },
  {
    id: "information-loss",
    title: "投影一定伴随信息损失",
    content:
      "从三维到二维的映射不可能保留全部空间信息，所以重点不在“完全不丢”，而在“尽量保住你最关心的结构和方向”。"
  }
];
