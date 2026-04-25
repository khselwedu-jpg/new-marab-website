import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pages = [
  {
    slug: "about/vision",
    titleAr: "رؤيتنا",
    titleEn: "Our Vision",
    contentAr: `<div class="prose-content">
  <h2>رؤيتنا</h2>
  <p>أن نكون الشركة الرائدة في قطاع التأمين في اليمن والمنطقة، من خلال تقديم حلول تأمينية متكاملة ومبتكرة تلبي احتياجات عملائنا وتحمي أصولهم وممتلكاتهم.</p>
  
  <h3>نسعى إلى تحقيق:</h3>
  <ul>
    <li>التميز في تقديم الخدمات التأمينية بأعلى معايير الجودة والاحترافية</li>
    <li>بناء شراكات استراتيجية مع كبرى شركات إعادة التأمين العالمية</li>
    <li>توسيع شبكة فروعنا لتغطية جميع المحافظات اليمنية</li>
    <li>الاستثمار في التكنولوجيا الحديثة لتطوير خدماتنا وتسهيل وصول العملاء إليها</li>
    <li>تعزيز ثقافة التأمين في المجتمع اليمني وتوعية المواطنين بأهميته</li>
  </ul>

  <p>نؤمن بأن التأمين ليس مجرد منتج مالي، بل هو شريك حقيقي في حماية مستقبل الأفراد والمؤسسات، ونلتزم بتقديم أفضل الحلول التأمينية بأسعار تنافسية وخدمة عملاء متميزة.</p>
</div>`,
    contentEn: `<div class="prose-content">
  <h2>Our Vision</h2>
  <p>To be the leading insurance company in Yemen and the region, by providing comprehensive and innovative insurance solutions that meet our clients' needs and protect their assets and properties.</p>
  
  <h3>We strive to achieve:</h3>
  <ul>
    <li>Excellence in delivering insurance services with the highest standards of quality and professionalism</li>
    <li>Building strategic partnerships with major global reinsurance companies</li>
    <li>Expanding our branch network to cover all Yemeni governorates</li>
    <li>Investing in modern technology to develop our services and facilitate client access</li>
    <li>Promoting insurance culture in Yemeni society and raising public awareness of its importance</li>
  </ul>

  <p>We believe that insurance is not just a financial product, but a true partner in protecting the future of individuals and institutions. We are committed to providing the best insurance solutions at competitive prices with outstanding customer service.</p>
</div>`,
    metaDescriptionAr: "رؤية شركة مأرب للتأمين - نسعى لأن نكون الشركة الرائدة في قطاع التأمين في اليمن والمنطقة",
    metaDescriptionEn: "Mareb Insurance Company Vision - We strive to be the leading insurance company in Yemen and the region",
    isActive: true,
  },
  {
    slug: "about/mission",
    titleAr: "رسالتنا",
    titleEn: "Our Mission",
    contentAr: `<div class="prose-content">
  <h2>رسالتنا</h2>
  <p>تقديم خدمات تأمينية متميزة ومتكاملة تحمي عملاءنا من المخاطر وتوفر لهم الأمان والاطمئنان، مع الالتزام بأعلى معايير الشفافية والنزاهة المهنية.</p>

  <h3>نحقق رسالتنا من خلال:</h3>
  <ul>
    <li><strong>الاحترافية:</strong> توظيف كوادر بشرية مؤهلة وذات خبرة عالية في مجال التأمين</li>
    <li><strong>الشفافية:</strong> تقديم معلومات واضحة ودقيقة حول منتجاتنا وخدماتنا</li>
    <li><strong>الموثوقية:</strong> الوفاء بالتزاماتنا تجاه عملائنا في الوقت المناسب</li>
    <li><strong>الابتكار:</strong> تطوير منتجات تأمينية جديدة تواكب متطلبات السوق</li>
    <li><strong>خدمة العملاء:</strong> توفير دعم متواصل وسريع الاستجابة لجميع احتياجات عملائنا</li>
  </ul>

  <p>نلتزم بتحقيق التوازن بين مصالح عملائنا ومساهمينا، مع المساهمة الفاعلة في تنمية قطاع التأمين الوطني وتطوير الاقتصاد اليمني.</p>
</div>`,
    contentEn: `<div class="prose-content">
  <h2>Our Mission</h2>
  <p>To provide distinguished and comprehensive insurance services that protect our clients from risks and provide them with security and peace of mind, while adhering to the highest standards of transparency and professional integrity.</p>

  <h3>We achieve our mission through:</h3>
  <ul>
    <li><strong>Professionalism:</strong> Employing qualified and highly experienced personnel in the field of insurance</li>
    <li><strong>Transparency:</strong> Providing clear and accurate information about our products and services</li>
    <li><strong>Reliability:</strong> Fulfilling our obligations to our clients in a timely manner</li>
    <li><strong>Innovation:</strong> Developing new insurance products that keep pace with market requirements</li>
    <li><strong>Customer Service:</strong> Providing continuous and responsive support for all our clients' needs</li>
  </ul>

  <p>We are committed to achieving a balance between the interests of our clients and shareholders, while actively contributing to the development of the national insurance sector and the Yemeni economy.</p>
</div>`,
    metaDescriptionAr: "رسالة شركة مأرب للتأمين - تقديم خدمات تأمينية متميزة تحمي عملاءنا من المخاطر",
    metaDescriptionEn: "Mareb Insurance Company Mission - Providing distinguished insurance services that protect our clients from risks",
    isActive: true,
  },
  {
    slug: "about/goals",
    titleAr: "أهدافنا",
    titleEn: "Our Goals",
    contentAr: `<div class="prose-content">
  <h2>أهدافنا الاستراتيجية</h2>
  <p>تسعى شركة مأرب للتأمين إلى تحقيق مجموعة من الأهداف الاستراتيجية التي تدعم رؤيتها ورسالتها وتضمن استمرار نموها وتطورها.</p>

  <h3>أهدافنا على المدى القريب:</h3>
  <ul>
    <li>توسيع محفظة منتجاتنا التأمينية لتشمل قطاعات جديدة</li>
    <li>تطوير منصة رقمية متكاملة لخدمة العملاء عبر الإنترنت</li>
    <li>افتتاح فروع جديدة في المحافظات التي لا تغطيها شبكتنا الحالية</li>
    <li>تعزيز برامج التدريب والتطوير لموظفينا</li>
  </ul>

  <h3>أهدافنا على المدى البعيد:</h3>
  <ul>
    <li>الوصول إلى حصة سوقية تبلغ 30% من إجمالي سوق التأمين اليمني</li>
    <li>التوسع في الأسواق الإقليمية المجاورة</li>
    <li>تحقيق التحول الرقمي الكامل في جميع عملياتنا</li>
    <li>الحصول على تصنيفات ائتمانية دولية معترف بها</li>
    <li>تطوير برامج التأمين الاجتماعي والتكافلي لخدمة شرائح أوسع من المجتمع</li>
  </ul>

  <h3>أهدافنا المجتمعية:</h3>
  <ul>
    <li>المساهمة في نشر الوعي التأميني في المجتمع اليمني</li>
    <li>دعم المبادرات الاجتماعية والخيرية</li>
    <li>توفير فرص عمل للكوادر الوطنية المؤهلة</li>
    <li>المساهمة في تطوير التشريعات والأنظمة التأمينية الوطنية</li>
  </ul>
</div>`,
    contentEn: `<div class="prose-content">
  <h2>Our Strategic Goals</h2>
  <p>Mareb Insurance Company seeks to achieve a set of strategic goals that support its vision and mission and ensure the continuation of its growth and development.</p>

  <h3>Short-term Goals:</h3>
  <ul>
    <li>Expanding our insurance product portfolio to include new sectors</li>
    <li>Developing a comprehensive digital platform for online customer service</li>
    <li>Opening new branches in governorates not covered by our current network</li>
    <li>Enhancing training and development programs for our employees</li>
  </ul>

  <h3>Long-term Goals:</h3>
  <ul>
    <li>Reaching a market share of 30% of the total Yemeni insurance market</li>
    <li>Expanding into neighboring regional markets</li>
    <li>Achieving complete digital transformation in all our operations</li>
    <li>Obtaining internationally recognized credit ratings</li>
    <li>Developing social and takaful insurance programs to serve broader segments of society</li>
  </ul>

  <h3>Community Goals:</h3>
  <ul>
    <li>Contributing to spreading insurance awareness in Yemeni society</li>
    <li>Supporting social and charitable initiatives</li>
    <li>Providing employment opportunities for qualified national cadres</li>
    <li>Contributing to the development of national insurance legislation and regulations</li>
  </ul>
</div>`,
    metaDescriptionAr: "أهداف شركة مأرب للتأمين الاستراتيجية - نسعى للريادة في سوق التأمين اليمني",
    metaDescriptionEn: "Mareb Insurance Company Strategic Goals - We strive for leadership in the Yemeni insurance market",
    isActive: true,
  },
  {
    slug: "about/who-we-are",
    titleAr: "من نحن",
    titleEn: "Who We Are",
    contentAr: `<div class="prose-content">
  <h2>من نحن</h2>
  <p>شركة مأرب للتأمين شركة مساهمة يمنية تأسست عام 1974، وهي من أوائل شركات التأمين في اليمن. تعمل الشركة في مجال التأمين العام وإعادة التأمين، وتقدم مجموعة متنوعة من المنتجات التأمينية التي تلبي احتياجات الأفراد والشركات والمؤسسات.</p>

  <p>تتميز شركة مأرب للتأمين بشبكة واسعة من الفروع المنتشرة في مختلف المحافظات اليمنية، وبكوادر بشرية مؤهلة وذات خبرة طويلة في مجال التأمين. كما تتمتع الشركة بعلاقات قوية مع كبرى شركات إعادة التأمين العالمية، مما يمكنها من تقديم تغطيات تأمينية عالية الجودة بأسعار تنافسية.</p>

  <h3>أبرز ما يميزنا:</h3>
  <ul>
    <li>خبرة تمتد لأكثر من 50 عاماً في سوق التأمين اليمني</li>
    <li>محفظة متنوعة من المنتجات التأمينية تغطي جميع القطاعات</li>
    <li>شبكة فروع واسعة في جميع أنحاء اليمن</li>
    <li>شراكات استراتيجية مع معيدي التأمين العالميين</li>
    <li>فريق عمل محترف ومتخصص</li>
    <li>خدمة عملاء متميزة وسريعة الاستجابة</li>
  </ul>
</div>`,
    contentEn: `<div class="prose-content">
  <h2>Who We Are</h2>
  <p>Mareb Insurance Company is a Yemeni joint-stock company founded in 1974, and is one of the first insurance companies in Yemen. The company operates in the field of general insurance and reinsurance, offering a diverse range of insurance products that meet the needs of individuals, companies, and institutions.</p>

  <p>Mareb Insurance Company is distinguished by a wide network of branches spread across various Yemeni governorates, and qualified human resources with extensive experience in the insurance field. The company also enjoys strong relationships with major global reinsurance companies, enabling it to provide high-quality insurance coverage at competitive prices.</p>

  <h3>What distinguishes us:</h3>
  <ul>
    <li>Experience spanning more than 50 years in the Yemeni insurance market</li>
    <li>A diverse portfolio of insurance products covering all sectors</li>
    <li>Wide branch network throughout Yemen</li>
    <li>Strategic partnerships with global reinsurers</li>
    <li>Professional and specialized work team</li>
    <li>Distinguished and responsive customer service</li>
  </ul>
</div>`,
    metaDescriptionAr: "تعرف على شركة مأرب للتأمين - أول شركة تأمين مساهمة يمنية تأسست عام 1974",
    metaDescriptionEn: "Learn about Mareb Insurance Company - Yemen's first joint-stock insurance company founded in 1974",
    isActive: true,
  },
];

async function seed() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  for (const page of pages) {
    // Check if page already exists
    const [existing] = await conn.query("SELECT id FROM dynamic_pages WHERE slug = ?", [page.slug]);
    
    if (existing.length > 0) {
      // Update existing
      await conn.query(
        `UPDATE dynamic_pages SET titleAr=?, titleEn=?, contentAr=?, contentEn=?, 
         metaDescriptionAr=?, metaDescriptionEn=?, isActive=? WHERE slug=?`,
        [page.titleAr, page.titleEn, page.contentAr, page.contentEn,
         page.metaDescriptionAr, page.metaDescriptionEn, page.isActive, page.slug]
      );
      console.log(`✓ Updated: ${page.slug}`);
    } else {
      // Insert new
      await conn.query(
        `INSERT INTO dynamic_pages (slug, titleAr, titleEn, contentAr, contentEn, 
         metaDescriptionAr, metaDescriptionEn, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [page.slug, page.titleAr, page.titleEn, page.contentAr, page.contentEn,
         page.metaDescriptionAr, page.metaDescriptionEn, page.isActive]
      );
      console.log(`✓ Inserted: ${page.slug}`);
    }
  }
  
  await conn.end();
  console.log("\nDone! All pages seeded successfully.");
}

seed().catch(console.error);
