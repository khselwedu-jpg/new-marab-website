import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);

console.log('Connected to database...');

// ============================================================
// 1. UPDATE SITE SETTINGS - Company Info
// ============================================================
console.log('Updating site settings...');

const siteSettings = [
  { key: 'phone_main', valueAr: '+967 02 362 317', valueEn: '+967 02 362 317' },
  { key: 'phone_secondary', valueAr: '+967 02 362 318 / 319', valueEn: '+967 02 362 318 / 319' },
  { key: 'email_main', valueAr: 'info@myicyemen.com', valueEn: 'info@myicyemen.com' },
  { key: 'email_support', valueAr: 'info@myicyemen.com', valueEn: 'info@myicyemen.com' },
  { key: 'address_ar', valueAr: 'مدينة إنماء، مقابل فندق القصر، عدن، اليمن', valueEn: 'Madinat Inma, Opposite Al-Qasr Hotel, Aden, Yemen' },
  { key: 'address_en', valueAr: 'مدينة إنماء، مقابل فندق القصر، عدن، اليمن', valueEn: 'Madinat Inma, Opposite Al-Qasr Hotel, Aden, Yemen' },
  { key: 'po_box', valueAr: 'ص.ب 729', valueEn: 'P.O.Box: 729' },
  { key: 'fax_main', valueAr: '+967 02 362 317', valueEn: '+967 02 362 317' },
];

for (const s of siteSettings) {
  await conn.query(
    'UPDATE site_settings SET valueAr=?, valueEn=? WHERE `key`=?',
    [s.valueAr, s.valueEn, s.key]
  );
}

// ============================================================
// 2. UPDATE DYNAMIC PAGES - About, Vision, Mission, Goals
// ============================================================
console.log('Updating dynamic pages...');

const dynamicPages = [
  {
    slug: 'about/who-we-are',
    titleAr: 'من نحن',
    titleEn: 'Who We Are',
    contentAr: `شركة مأرب اليمنية للتأمين ( شركة مساهمة يمنية ) تأسست عام 1974م من قبل مجموعة من رجال الأعمال اليمنيين والبنك اليمني للإنشاء والتعمير والشركة الكويتية لإعادة التأمين وشركة J.H. Limit البريطانية كأول شركة يمنية مساهمة للتأمين على كافة الأخطار المختلفة وضمان الحقوق المكتسبة لها وتقوم بإعادة التأمين لدى معيدي تأمين عالميين من الدرجة الأولى.

يبلغ رأس مال الشركة مليار ريال وتدار بواسطة إدارة يمثل كل 10% من الأسهم عضو في المجلس وهناك إدارة تنفيذية تقوم بمتابعة الأعمال من خلال كادر مؤهل متخصص في مجال صناعة التأمين.

عملت شركة مأرب اليمنية للتامين وبالتعاون مع الشركة الكويتية للتأمين على إنشاء كادر متميز كانوا النواة لعملية التأمين في السوق اليمني خلال فترة المسيرة ورفدت شركة مأرب اليمنية للتأمين شركات التأمين المحلية التي أُنشأت بعد ذلك بمجموعة من الكفاءات التأمينية.

للشركة استثمارات وأصول عقارية وهى عضو نشيط في الاتحادات العربية والمحلية في مجال التأمين.`,
    contentEn: `Mareb Yemeni Insurance Company (a Yemeni joint-stock company) was established in 1974 by a group of Yemeni businessmen, the Yemen Bank for Reconstruction and Development, the Kuwait Reinsurance Company, and the British company J.H. Limit, as the first Yemeni joint-stock company for insurance against all types of risks, guaranteeing acquired rights, and reinsuring with first-class international reinsurers.

The company's capital is one billion riyals and is managed by a board where every 10% of shares represents one board member, with an executive management team following up on business through qualified staff specialized in the insurance industry.

Mareb Yemeni Insurance Company, in cooperation with Kuwait Insurance Company, established a distinguished cadre that was the nucleus of the insurance process in the Yemeni market. The company has supplied local insurance companies established afterwards with a group of insurance competencies.

The company has investments and real estate assets and is an active member of Arab and local insurance federations.`
  },
  {
    slug: 'about/vision',
    titleAr: 'رؤيتنا',
    titleEn: 'Our Vision',
    contentAr: `أن تكون شركة مأرب اليمنية للتأمين الشركة الرائدة في سوق التأمين اليمني، وأن تكون مرجعاً موثوقاً لكافة الخدمات التأمينية بمعايير عالمية عالية الجودة.

نسعى إلى تقديم حلول تأمينية شاملة ومتكاملة تلبي احتياجات الأفراد والشركات والمؤسسات في اليمن، مع الحفاظ على مكانتنا الريادية كأول شركة يمنية مساهمة للتأمين منذ عام 1974م.`,
    contentEn: `To be the leading insurance company in the Yemeni market, and to be a trusted reference for all insurance services with high international quality standards.

We strive to provide comprehensive and integrated insurance solutions that meet the needs of individuals, companies and institutions in Yemen, while maintaining our pioneering position as the first Yemeni joint-stock insurance company since 1974.`
  },
  {
    slug: 'about/mission',
    titleAr: 'رسالتنا',
    titleEn: 'Our Mission',
    contentAr: `تقديم خدمات تأمينية متميزة وشاملة تغطي كافة أنواع المخاطر، مع الالتزام بأعلى معايير الجودة والمهنية والشفافية في التعامل مع عملائنا.

نلتزم بحماية أصول وممتلكات وحقوق عملائنا من خلال شبكة واسعة من معيدي التأمين العالميين من الدرجة الأولى، وتقديم تعويضات عادلة وسريعة عند وقوع الأضرار.

نؤمن بأن نجاح عملائنا هو نجاحنا، ونسعى دائماً إلى بناء علاقات طويلة الأمد مبنية على الثقة والاحترام المتبادل.`,
    contentEn: `To provide distinguished and comprehensive insurance services covering all types of risks, while adhering to the highest standards of quality, professionalism and transparency in dealing with our clients.

We are committed to protecting the assets, properties and rights of our clients through a wide network of first-class international reinsurers, and providing fair and prompt compensation when damages occur.

We believe that our clients' success is our success, and we always strive to build long-term relationships based on mutual trust and respect.`
  },
  {
    slug: 'about/goals',
    titleAr: 'أهدافنا',
    titleEn: 'Our Goals',
    contentAr: `• توسيع نطاق الخدمات التأمينية لتشمل جميع المحافظات اليمنية.
• تطوير المنتجات التأمينية لتلبية الاحتياجات المتغيرة للسوق.
• تعزيز الكفاءات البشرية وتطوير المهارات التأمينية للكوادر الوطنية.
• الحفاظ على الملاءة المالية وتعزيز الاحتياطيات لضمان حقوق المؤمن لهم.
• تطوير أنظمة المعلومات والتكنولوجيا لتحسين جودة الخدمة.
• تعزيز الشراكات مع معيدي التأمين العالميين لتوفير تغطيات أوسع وأشمل.
• المساهمة في تطوير سوق التأمين اليمني وتعزيز الوعي التأميني.`,
    contentEn: `• Expanding insurance services to cover all Yemeni governorates.
• Developing insurance products to meet the changing needs of the market.
• Enhancing human competencies and developing insurance skills for national cadres.
• Maintaining financial solvency and strengthening reserves to guarantee policyholders' rights.
• Developing information systems and technology to improve service quality.
• Strengthening partnerships with global reinsurers to provide broader and more comprehensive coverage.
• Contributing to the development of the Yemeni insurance market and enhancing insurance awareness.`
  },
  {
    slug: 'about/chairman',
    titleAr: 'رئيس مجلس الإدارة',
    titleEn: 'Chairman of the Board',
    contentAr: `يسعدنا أن نرحب بكم في شركة مأرب اليمنية للتأمين، أول شركة يمنية مساهمة للتأمين تأسست عام 1974م.

منذ تأسيسها، حافظت الشركة على مكانتها الريادية في سوق التأمين اليمني، وعملت على تقديم خدمات تأمينية متميزة تلبي احتياجات الأفراد والشركات والمؤسسات.

نفخر بكادرنا المتخصص والمؤهل الذي يعمل بجد واجتهاد لتحقيق رضا عملائنا وحماية أصولهم وممتلكاتهم، ونؤكد التزامنا بمواصلة تطوير خدماتنا وتوسيع نطاق تغطياتنا لمواكبة التطورات في صناعة التأمين العالمية.

شركة مأرب للتأمين - حصن الأمان والضمان.`,
    contentEn: `We are pleased to welcome you to Mareb Yemeni Insurance Company, the first Yemeni joint-stock insurance company established in 1974.

Since its establishment, the company has maintained its leading position in the Yemeni insurance market, working to provide distinguished insurance services that meet the needs of individuals, companies and institutions.

We are proud of our specialized and qualified staff who work diligently to achieve customer satisfaction and protect their assets and properties. We affirm our commitment to continuing to develop our services and expand our coverage to keep pace with developments in the global insurance industry.

Mareb Insurance Company - The Fortress of Security and Guarantee.`
  }
];

for (const page of dynamicPages) {
  const [existing] = await conn.query('SELECT id FROM dynamic_pages WHERE slug=?', [page.slug]);
  if (existing.length > 0) {
    await conn.query(
      'UPDATE dynamic_pages SET titleAr=?, titleEn=?, contentAr=?, contentEn=?, isActive=1 WHERE slug=?',
      [page.titleAr, page.titleEn, page.contentAr, page.contentEn, page.slug]
    );
    console.log('Updated page:', page.slug);
  } else {
    await conn.query(
      'INSERT INTO dynamic_pages (slug, titleAr, titleEn, contentAr, contentEn, isActive) VALUES (?,?,?,?,?,1)',
      [page.slug, page.titleAr, page.titleEn, page.contentAr, page.contentEn]
    );
    console.log('Inserted page:', page.slug);
  }
}

// ============================================================
// 3. UPDATE PARTNERS (shareholders with percentages)
// ============================================================
console.log('Updating partners/shareholders...');

await conn.query('DELETE FROM partners WHERE id > 0');

const partners = [
  { nameAr: 'البنك اليمني للإنشاء والتعمير', nameEn: 'Yemen Bank for Reconstruction & Development', percentage: '53.37%', descAr: 'هاتف: 274171 - 271626', displayOrder: 1 },
  { nameAr: 'عبدالكريم فارع الأسودي', nameEn: 'Abdulkarim Fare Al-Aswadi', percentage: '10.50%', descAr: 'هاتف: 03206959 - 206620', displayOrder: 2 },
  { nameAr: 'محمد عقلان العديني', nameEn: 'Mohammed Aqlan Al-Adini', percentage: '8.75%', descAr: 'هاتف: 04251132', displayOrder: 3 },
  { nameAr: 'مجموعة هائل سعيد', nameEn: 'Hayel Saeed Group', percentage: '5.50%', descAr: 'هاتف: 01207765 - 207766', displayOrder: 4 },
  { nameAr: 'مساهمون أفراد', nameEn: 'Individual Shareholders', percentage: '21.88%', descAr: '', displayOrder: 5 },
];

for (const p of partners) {
  await conn.query(
    `INSERT INTO partners (nameAr, nameEn, logoUrl, websiteUrl, descriptionAr, descriptionEn, category, displayOrder, isActive, createdAt, updatedAt)
     VALUES (?, ?, '', '', ?, ?, 'other', ?, 1, NOW(), NOW())`,
    [p.nameAr + ' — ' + p.percentage, p.nameEn + ' — ' + p.percentage, p.descAr, p.percentage, p.displayOrder]
    // category 'other' is used for shareholders
  );
  console.log('Inserted partner:', p.nameAr);
}

// ============================================================
// 4. UPDATE TEAM MEMBERS - Branch Managers
// ============================================================
console.log('Updating team members (branch managers)...');

// First check existing team members
const [existingTeam] = await conn.query('SELECT id, nameAr FROM team_members');
console.log('Existing team members:', existingTeam.map(t => t.nameAr));

// Add branch managers
const branchManagers = [
  {
    nameAr: 'رمزي أحمد البناء',
    nameEn: 'Ramzi Ahmed Al-Banna',
    positionAr: 'مدير الإدارة العامة - عدن',
    positionEn: 'General Manager - Aden',
    phone: '362317 - 362318 - 362319',
    displayOrder: 10,
    department: 'management'
  },
  {
    nameAr: 'عبدالعفار شجاع',
    nameEn: 'Abdulaffar Shuja',
    positionAr: 'مدير فرع تعز',
    positionEn: 'Taiz Branch Manager',
    phone: '04-240928 / 240927',
    displayOrder: 11,
    department: 'branch'
  },
  {
    nameAr: 'عبدالعزيز بازارا',
    nameEn: 'Abdulaziz Bazara',
    positionAr: 'مدير فرع المكلا - حضرموت',
    positionEn: 'Al-Mukalla Branch Manager - Hadhramaut',
    phone: '05-314544',
    displayOrder: 12,
    department: 'branch'
  },
];

for (const member of branchManagers) {
  // Check if already exists
  const [exists] = await conn.query('SELECT id FROM team_members WHERE nameAr=?', [member.nameAr]);
  if (exists.length === 0) {
    await conn.query(
      `INSERT INTO team_members (nameAr, nameEn, positionAr, positionEn, imageUrl, displayOrder, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, '', ?, 1, NOW(), NOW())`,
      [member.nameAr, member.nameEn, member.positionAr, member.positionEn, member.displayOrder]
    );
    console.log('Inserted team member:', member.nameAr);
  } else {
    await conn.query(
      'UPDATE team_members SET positionAr=?, positionEn=?, displayOrder=? WHERE nameAr=?',
      [member.positionAr, member.positionEn, member.displayOrder, member.nameAr]
    );
    console.log('Updated team member:', member.nameAr);
  }
}

// ============================================================
// 5. UPDATE INSURANCE TYPES - All 13 types with full details
// ============================================================
console.log('Updating insurance types...');

const insuranceTypes = [
  {
    nameAr: 'تأمين السيارات الشامل',
    nameEn: 'Comprehensive Car Insurance',
    descriptionAr: 'تأمين شامل يشمل حوادث السير والانقلاب والحريق والسرقة، وكذا تشمل التغطية المسئولية المترتبة عن هذه الحوادث تجاه الأضرار المادية والإصابات الجسدية للغير.',
    descriptionEn: 'Comprehensive insurance covering traffic accidents, rollovers, fire and theft, as well as liability for material damages and bodily injuries to third parties.',
    detailsAr: `التغطية التأمينية: تأمين شامل يشمل حوادث السير والانقلاب والحريق والسرقة وكذا تشمل التغطية المسئولية المترتبة عن هذه الحوادث تجاه الأضرار المادية والإصابات الجسدية للغير.

المستثنيات:
• الحرب والحرب الأهلية والإرهاب والتخريب
• الشغب والاضطرابات
• الأخطار الطبيعية
• الأخطار السياسية
• السرقة الجزئية
• الاختطاف والسرقة بقوة السلاح (نهب)
يمكن تغطية بعض الأخطار المستثناة بقسط إضافي.

المستندات المطلوبة:
• كرت الملكية
• رخصة القيادة سارية المفعول
• الكشف على السيارة

يناسب هذا التأمين: جميع أصحاب السيارات والشركات والمؤسسات.`,
    detailsEn: `Coverage: Comprehensive insurance covering traffic accidents, rollovers, fire and theft, as well as liability for material damages and bodily injuries to third parties.

Exclusions:
• War, civil war, terrorism and sabotage
• Riots and disturbances
• Natural hazards
• Political risks
• Partial theft
• Kidnapping and armed robbery
Some excluded risks can be covered with additional premium.

Required Documents:
• Ownership card
• Valid driving license
• Vehicle inspection

Suitable for: All vehicle owners, companies and institutions.`,
    slug: 'car-comprehensive',
    displayOrder: 1
  },
  {
    nameAr: 'تأمين السيارات طرف ثالث',
    nameEn: 'Third Party Car Insurance',
    descriptionAr: 'توفر هذه الوثيقة الغطاء التأميني للمسئولية المدنية تجاه الغير للأضرار المادية والجسدية للطرف الثالث.',
    descriptionEn: 'This policy provides insurance coverage for civil liability towards third parties for material and physical damages.',
    detailsAr: `التغطية التأمينية: توفر هذه الوثيقة الغطاء التأميني للمسئولية المدنية تجاه الغير للأضرار المادية والجسدية للطرف الثالث.

يناسب هذا التأمين جميع الشركات والمؤسسات والمكاتب والأفراد.`,
    detailsEn: `Coverage: This policy provides insurance coverage for civil liability towards third parties for material and physical damages.

Suitable for all companies, institutions, offices and individuals.`,
    slug: 'car-third-party',
    displayOrder: 2
  },
  {
    nameAr: 'تأمين الحريق والأخطار الأخرى والسرقة',
    nameEn: 'Fire, Additional Risks & Theft Insurance',
    descriptionAr: 'توفر هذه الوثيقة الغطاء التأميني للأضرار الحاصلة للممتلكات نتيجة الحريق والانفجار والصواعق والعواصف والفيضانات والزلازل والسرقة وغيرها.',
    descriptionEn: 'This policy provides insurance coverage for damages to properties resulting from fire, explosion, lightning, storms, floods, earthquakes, theft and others.',
    detailsAr: `التغطية الرئيسية: الحريق

التغطيات الإضافية:
• الانفجار، الصواعق، العواصف، الزوابع، الأعاصير، الفيضانات، الزلازل، البراكين
• الشغب العمالي والإضرابات العمالية والأعمال الكيدية (العدائية) الناتجة عن الأزمات الاقتصادية بحد أقصى 25% من إجمالي مبلغ التأمين
• انفجار أنابيب المياه الناتج عن حادث
• سقوط الطائرات المدنية أو أجزاء منها
• الاصطدام الناتج من سيارات الغير
• الماس الكهربائي
• السرقة بالدخول القسري

يناسب هذا التأمين:
• الشركات / المصانع / المحلات التجارية / المستشفيات / الفنادق / المكاتب / المساكن
• المخازن والمستودعات

المستندات المطلوبة:
• تعبئة استمارة طلب التأمين
• كشف تفصيلي بالممتلكات المراد التأمين عليها مع القيم الفعلية
• الكشف على الممتلكات قبل التأمين`,
    detailsEn: `Main Coverage: Fire

Additional Coverages:
• Explosion, lightning, storms, tornadoes, hurricanes, floods, earthquakes, volcanoes
• Labor riots, labor strikes and malicious acts resulting from economic crises up to 25% of total insurance amount
• Water pipe explosion resulting from accident
• Fall of civil aircraft or parts thereof
• Collision from third-party vehicles
• Electrical short circuit
• Theft by forced entry

Suitable for:
• Companies / Factories / Commercial shops / Hospitals / Hotels / Offices / Residences
• Warehouses and storage facilities

Required Documents:
• Fill out insurance application form
• Detailed list of properties to be insured with actual values
• Property inspection before insurance`,
    slug: 'fire-theft',
    displayOrder: 3
  },
  {
    nameAr: 'تأمين فقدان الربح نتيجة الحريق',
    nameEn: 'Loss of Profit (Fire) Insurance',
    descriptionAr: 'تعويض المؤمن له عن الخسارة في الربح الإجمالي نتيجة هلاك أو تلف أو تضرر المباني والممتلكات المؤمن عليها نتيجة حادث مشمول ضمن غطاء وثيقة الحريق.',
    descriptionEn: 'Compensating the insured for loss of gross profit resulting from destruction, damage or harm to insured buildings and properties due to an incident covered under the fire policy.',
    detailsAr: `التغطية: تعويض المؤمن له عن الخسارة في الربح الإجمالي نتيجة هلاك أو تلف أو تضرر المباني والممتلكات المؤمن عليها نتيجة حادث مشمول ضمن غطاء وثيقة الحريق.

يناسب هذا التأمين: المصانع / الفنادق / المستشفيات

المستندات المطلوبة:
• تعبئة استمارة تأمين فقدان الربح
• تحديد الخسارة السنوية`,
    detailsEn: `Coverage: Compensating the insured for loss of gross profit resulting from destruction, damage or harm to insured buildings and properties due to an incident covered under the fire policy.

Suitable for: Factories / Hotels / Hospitals

Required Documents:
• Fill out loss of profit insurance form
• Determine annual loss`,
    slug: 'loss-of-profit',
    displayOrder: 4
  },
  {
    nameAr: 'التأمين البحري والجوي والبري',
    nameEn: 'Marine, Air & Land Insurance',
    descriptionAr: 'توفر هذه الوثيقة الغطاء التأميني لأي خسارة تلحق بالمستوردات أثناء الرحلة البحرية أو الجوية من بلد التصدير إلى ميناء الوصول.',
    descriptionEn: 'This policy provides insurance coverage for any loss to imports during sea or air travel from the country of export to the port of arrival.',
    detailsAr: `التغطية التأمينية: أخطار التحميل والتنزيل، الحريق، التصادم، الغرق، الجنوح، العواصف، الأمواج، الأمطار، الحرب، القرصنة، النقص العددي، عدم التسليم، سقوط أو انفجار الطائرة.

يناسب هذا التأمين:
• الشركات
• المصانع
• التجار والمستوردين

المستندات المطلوبة:
• تعبئة استمارة طلب التأمين والموضح فيها جميع البيانات المطلوبة`,
    detailsEn: `Coverage: Loading and unloading risks, fire, collision, sinking, grounding, storms, waves, rain, war, piracy, numerical shortage, non-delivery, aircraft fall or explosion.

Suitable for:
• Companies
• Factories
• Traders and importers

Required Documents:
• Fill out insurance application form with all required data`,
    slug: 'marine',
    displayOrder: 5
  },
  {
    nameAr: 'تأمين المنزلي الشامل',
    nameEn: 'Comprehensive Home Insurance',
    descriptionAr: 'توفر هذه الوثيقة الغطاء التأميني للأضرار الحاصلة للمبنى السكني والمحتويات التي بداخله نتيجة الحريق والسرقة والعواصف والزلازل والفيضانات وغيرها.',
    descriptionEn: 'This policy provides insurance coverage for damages to residential buildings and their contents resulting from fire, theft, storms, earthquakes, floods and others.',
    detailsAr: `التغطية: الحريق / الصاعقة / الانفجار / العواصف / الأعاصير / الزلازل / الفيضانات / سقوط الطائرات أو ما يسقط منها / اصطدام المركبات غير المعلقة للمؤمن له / السطو والسرقة بالإكراه / المسئولية المدنية تجاه مالك المبنى إذا كان مستأجراً أو المسئولية المدنية تجاه الغير.

يناسب هذا التأمين: المباني المملوكة والمستأجرة

المستندات المطلوبة:
• تعبئة استمارة طلب التأمين
• موافاة الشركة كشف بالأثاث مع القيم المطلوب التأمين عليه
• تحديد قيمة المبنى والسور في حالة الرغبة في التأمين عليه`,
    detailsEn: `Coverage: Fire / Lightning / Explosion / Storms / Hurricanes / Earthquakes / Floods / Aircraft fall / Vehicle collision / Robbery and forced theft / Civil liability towards building owner if tenant or civil liability towards third parties.

Suitable for: Owned and rented buildings

Required Documents:
• Fill out insurance application form
• Provide company with furniture list with values to be insured
• Determine building and fence value if desired`,
    slug: 'home',
    displayOrder: 6
  },
  {
    nameAr: 'تأمين أخطار المقاولين',
    nameEn: 'Contractors All Risks Insurance',
    descriptionAr: 'توفر هذه الوثيقة الغطاء التأميني لعقود المقاولات نتيجة وقوع حادث عرضي ومفاجئ خلال فترة تنفيذ المشروع وفترة الصيانة.',
    descriptionEn: 'This policy provides insurance coverage for construction contracts resulting from an accidental and sudden incident during the project execution and maintenance period.',
    detailsAr: `أولاً - الأضرار المادية:
• قيمة عقد المقاولة وجميع الأعمال التي ستنفذ في المشروع
• الممتلكات المرتبطة بالمشروع والموجودة في الموقع أو المخزنة أو المنقولة
• الآلات ومعدات المقاول والتجهيزات المؤقتة اللازمة لإنشاء موقع المشروع
• تكاليف إزالة الأنقاض
• أجور الشحن الجوي
• ساعات العمل الإضافي والعمل الليلي

ثانياً - المسئولية المدنية تجاه الغير:
• الوفاة والإصابات الجسدية التي تلحق بالغير
• الخسائر والأضرار التي تصيب ممتلكات الغير

يناسب هذا التأمين: المقاولين / مالكي المشاريع

المستندات المطلوبة:
• تعبئة الاستمارة الخاصة بهذا النوع من التأمين والذي يحتوي على جميع البيانات الخاصة بالمشروع`,
    detailsEn: `First - Material Damages:
• Contract value and all works to be executed in the project
• Project-related properties at site, stored or transported
• Contractor's machinery, equipment and temporary installations
• Debris removal costs
• Air freight charges
• Overtime and night work hours

Second - Civil Liability towards Third Parties:
• Death and bodily injuries to third parties
• Losses and damages to third-party properties

Suitable for: Contractors / Project owners

Required Documents:
• Fill out the special form for this type of insurance containing all project data`,
    slug: 'contractors',
    displayOrder: 7
  },
  {
    nameAr: 'تأمين أخطار التشييد والتركيب',
    nameEn: 'Erection All Risks Insurance',
    descriptionAr: 'توفر هذه الوثيقة الغطاء التأميني للمؤمن له الناتج عن أي ضرر أثناء فترة التركيب و/أو فترة الصيانة.',
    descriptionEn: 'This policy provides insurance coverage for the insured resulting from any damage during the installation and/or maintenance period.',
    detailsAr: `أولاً - الأضرار المادية:
تعوض الشركة المؤمن له عن أي خسارة أو ضرر مادي غير متوقع ومفاجئ بشكل يستدعي التصليح أو الاستبدال لأحد البنود المؤمن عليها أو لأي جزء منها خلال فترة سريان الوثيقة.
كما يمكن توسيع الغطاء التأميني ليشمل: المصاريف الإضافية وتغطية زيارات الصيانة.

ثانياً - المسئولية المدنية تجاه الغير:
• الوفاة والإصابات الجسدية
• الخسائر والأضرار التي تصيب ممتلكات الغير

يناسب هذا التأمين: المقاولين / المالكين

المستندات المطلوبة:
• تعبئة الاستمارة الخاصة بهذا النوع من التأمين
• تحديد مبلغ الحد الأقصى لتأمين المسئولية تجاه الأضرار المادية`,
    detailsEn: `First - Material Damages:
The company compensates the insured for any unexpected and sudden material loss or damage requiring repair or replacement of any insured item during the policy period.
Coverage can be extended to include: Additional expenses and maintenance visit coverage.

Second - Civil Liability towards Third Parties:
• Death and bodily injuries
• Losses and damages to third-party properties

Suitable for: Contractors / Owners

Required Documents:
• Fill out the special form for this type of insurance
• Determine maximum amount for liability insurance against material damages`,
    slug: 'erection',
    displayOrder: 8
  },
  {
    nameAr: 'تأمين عطب المكائن',
    nameEn: 'Machinery Breakdown Insurance',
    descriptionAr: 'توفر هذه الوثيقة الغطاء التأميني للمؤمن له الناتج عن أي ضرر أو هلاك يلحق بالمكائن المذكورة في جدول التأمين من خلال فترة التأمين.',
    descriptionEn: 'This policy provides insurance coverage for the insured resulting from any damage or destruction to machinery listed in the insurance schedule during the insurance period.',
    detailsAr: `التغطية: أي ضرر عرضي ومفاجئ ناتج عن:
• خطأ في التصميم
• عيب في المنتج
• نقص في الخبرة وإساءة الاستعمال
• نقص الماء في الغلايات

يناسب هذا التأمين:
• المصانع
• المستشفيات
• الفنادق

المستندات المطلوبة:
• تعبئة الاستمارة الخاصة بهذا النوع من التأمين والذي يحتوي على جميع البيانات الخاصة بالآلات المراد التأمين عليها`,
    detailsEn: `Coverage: Any accidental and sudden damage resulting from:
• Design error
• Product defect
• Lack of expertise and misuse
• Water shortage in boilers

Suitable for:
• Factories
• Hospitals
• Hotels

Required Documents:
• Fill out the special form for this type of insurance containing all data about the machinery to be insured`,
    slug: 'machinery',
    displayOrder: 9
  },
  {
    nameAr: 'تأمين إصابة العمل',
    nameEn: 'Workmen\'s Compensation Insurance',
    descriptionAr: 'توفر هذه الوثيقة الغطاء التأميني لصاحب العمل عن وفاة أو إصابة أحد موظفيه نتيجة تعرضه لحادث ناتج من العمل وفي موقع العمل.',
    descriptionEn: 'This policy provides insurance coverage for the employer for death or injury of an employee resulting from a work-related accident at the workplace.',
    detailsAr: `التغطية:
• وفاة أو إصابة أحد موظفيه نتيجة تعرضه لحادث ناتج من العمل وفي موقع العمل
• العجز الدائم أو المؤقت (حسب جدول المنافع)
• العجز الكلي الدائم أو المؤقت (حسب جدول المنافع)
• فقدان الأجر لمدة 52 أسبوع وفقاً لجدول الأجور المحددة في وثيقة التأمين
• المصاريف الطبية المحددة في جدول وثيقة التأمين

يناسب هذا التأمين: المقاولين / المصانع / الشركات والفنادق

المستندات المطلوبة:
• كشف يوضح: أسماء العمال وطبيعة عملهم، رواتبهم ومواقع عملهم، تاريخ الميلاد`,
    detailsEn: `Coverage:
• Death or injury of an employee resulting from a work-related accident at the workplace
• Permanent or temporary disability (according to benefits schedule)
• Total permanent or temporary disability (according to benefits schedule)
• Loss of wages for 52 weeks according to the wage schedule in the insurance policy
• Medical expenses specified in the insurance policy schedule

Suitable for: Contractors / Factories / Companies and Hotels

Required Documents:
• List showing: workers' names and nature of work, their salaries and work locations, date of birth`,
    slug: 'workmen-compensation',
    displayOrder: 10
  },
  {
    nameAr: 'تأمين الحوادث الشخصية',
    nameEn: 'Personal Accident Insurance',
    descriptionAr: 'توفر هذه الوثيقة الغطاء التأميني للمؤمن عن أي حادث جسدي عرضي ومفاجئ يؤدي إلى الوفاة أو الإصابة أو العجز.',
    descriptionEn: 'This policy provides insurance coverage for the insured for any accidental and sudden physical accident leading to death, injury or disability.',
    detailsAr: `التغطية:
• وفاة أو إصابة المؤمن له
• العجز الكلي الدائم أو المؤقت (حسب جدول المنافع)
• العجز الجزئي الدائم أو المؤقت (حسب جدول المنافع)
• المصاريف الطبية المحددة في جدول وثيقة التأمين

يناسب هذا التأمين: البنوك والمصارف / المؤسسات المالية / شركات الصرافة / الشركات

المستندات المطلوبة:
• تحديد مبالغ التأمين للوفاة
• تحديد مبالغ التأمين للمصاريف الطبية`,
    detailsEn: `Coverage:
• Death or injury of the insured
• Total permanent or temporary disability (according to benefits schedule)
• Partial permanent or temporary disability (according to benefits schedule)
• Medical expenses specified in the insurance policy schedule

Suitable for: Banks / Financial institutions / Exchange companies / Companies

Required Documents:
• Determine insurance amounts for death
• Determine insurance amounts for medical expenses`,
    slug: 'personal-accident',
    displayOrder: 11
  },
  {
    nameAr: 'تأمين الحياة الجماعي',
    nameEn: 'Group Life Insurance',
    descriptionAr: 'توفر هذه الوثيقة الغطاء التأميني للمؤمن له نتيجة الوفاة الطبيعية أو بحادث أو العجز الكلي الدائم أو المؤقت.',
    descriptionEn: 'This policy provides insurance coverage for the insured resulting from natural death, accidental death, total permanent or temporary disability.',
    detailsAr: `التغطية:
• الوفاة الطبيعية: 100% من مبلغ التأمين
• الوفاة بحادث: 200% من مبلغ التأمين
• العجز الكلي الدائم (حسب جدول المنافع)
• العجز الكلي المؤقت (بحسب جدول المنافع)
• المصاريف الطبية
• فقدان الأجر أو الراتب
يمكن تغطية الحروب والأوبئة بقسط إضافي.

يناسب هذا التأمين: المؤسسات والشركات والبنوك / المصانع والمستشفيات والفنادق

المستندات المطلوبة:
• تحديد مبالغ التأمين للوفاة
• تحديد مبالغ التأمين للمصاريف الطبية
• كشف يوضح: أسماء الموظفين وطبيعة عملهم، رواتبهم ومواقع عملهم، تاريخ الميلاد`,
    detailsEn: `Coverage:
• Natural death: 100% of insurance amount
• Accidental death: 200% of insurance amount
• Total permanent disability (according to benefits schedule)
• Total temporary disability (according to benefits schedule)
• Medical expenses
• Loss of wages or salary
Wars and epidemics can be covered with additional premium.

Suitable for: Institutions, companies and banks / Factories, hospitals and hotels

Required Documents:
• Determine insurance amounts for death
• Determine insurance amounts for medical expenses
• List showing: employees' names and nature of work, their salaries and work locations, date of birth`,
    slug: 'group-life',
    displayOrder: 12
  },
  {
    nameAr: 'التأمين الصحي الجماعي',
    nameEn: 'Group Health Insurance',
    descriptionAr: 'توفر هذه الوثيقة الغطاء التأميني للمصاريف الطبية في رسوم المعاينة والفحوصات والأدوية في العيادات الخارجية والرقود والعمليات وكافة المصاريف المتعلقة بالحالات المرضية.',
    descriptionEn: 'This policy provides insurance coverage for medical expenses including consultation fees, examinations, medications, outpatient clinics, hospitalization, surgeries and all expenses related to medical conditions.',
    detailsAr: `التغطية: المصاريف الطبية في رسوم المعاينة والفحوصات والأدوية في العيادات الخارجية والرقود والعمليات وكافة المصاريف المتعلقة بالحالات المرضية بما فيها العلاج في الخارج.

يناسب هذا التأمين: المؤسسات والشركات / البنوك والمؤسسات المالية / المصانع / الفنادق

المستندات المطلوبة:
• تعبئة الاستمارة
• صورة 4×6 لكل مستفيد على حده
• تحديد السقوف للمنافع المطلوب التأمين عليها
• توقيع العقود حسب النماذج المعمول بها لدى الشركة`,
    detailsEn: `Coverage: Medical expenses including consultation fees, examinations, medications, outpatient clinics, hospitalization, surgeries and all expenses related to medical conditions including treatment abroad.

Suitable for: Institutions and companies / Banks and financial institutions / Factories / Hotels

Required Documents:
• Fill out the form
• 4×6 photo for each beneficiary
• Determine benefit ceilings to be insured
• Sign contracts according to company templates`,
    slug: 'health',
    displayOrder: 13
  },
  {
    nameAr: 'تأمين النقود',
    nameEn: 'Cash Insurance',
    descriptionAr: 'توفر هذه الوثيقة الغطاء التأميني لأي خسارة للنقود المملوكة لكم أو تكون ضمن مسئوليتكم نتيجة السرقة والسطو المسلح والحريق والتصادم والانقلاب أثناء عملية نقلها.',
    descriptionEn: 'This policy provides insurance coverage for any loss of cash owned by you or under your responsibility resulting from theft, armed robbery, fire, collision and rollover during transportation.',
    detailsAr: `التغطية:
• السرقة والسطو المسلح
• الحريق
• التصادم والانقلاب أثناء عملية نقلها

النقود في الخزينة/الغرف المحصنة:
فقدان النقود من الخزينة أو الغرف المحصنة بالسطو أو السرقة على مدار 24 ساعة في ظل الاستقرار السياسي والأمني.

يناسب هذا التأمين: البنوك والمصارف / محلات الصرافة / الشركات والمؤسسات والمكاتب

المستندات المطلوبة:
• تحديد الحد الأقصى للنقلة الواحدة
• تحديد إجمالي مبلغ النقلات خلال السنة
• تحديد مسار النقل
• تحديد المبالغ المحفوظة في الخزينة وموقعها
• أن تكون الخزينة ذات مواصفات دولية بحيث لا يمكن حملها من قبل شخصين`,
    detailsEn: `Coverage:
• Theft and armed robbery
• Fire
• Collision and rollover during transportation

Cash in Safe/Secured Rooms:
Loss of cash from safe or secured rooms by robbery or theft around the clock under political and security stability.

Suitable for: Banks / Exchange shops / Companies, institutions and offices

Required Documents:
• Determine maximum amount per transfer
• Determine total transfer amount during the year
• Determine transfer route
• Determine amounts stored in safe and its location
• Safe must have international specifications that cannot be carried by two persons`,
    slug: 'cash',
    displayOrder: 14
  },
  {
    nameAr: 'تأمين خيانة الأمانة',
    nameEn: 'Fidelity Guarantee Insurance',
    descriptionAr: 'توفر هذه الوثيقة الغطاء التأميني للمؤمن له نتيجة قيام أحد موظفيه بأفعال التزوير أو الاختلاس أو السرقة للأموال أو ممتلكات المؤمن له.',
    descriptionEn: 'This policy provides insurance coverage for the insured resulting from an employee committing acts of forgery, embezzlement or theft of the insured\'s funds or properties.',
    detailsAr: `التغطية: تعوض الشركة المؤمن له عن أية خسائر مباشرة تلحق به جراء قيام أحد موظفيه بأفعال التزوير أو الاختلاس أو السرقة للأموال أو ممتلكاته.

يناسب هذا التأمين: البنوك والمصارف / المؤسسات المالية / شركات الصرافة / الشركات

المستندات المطلوبة:
• تعبئة الاستمارة الخاصة بهذا النوع من التأمين`,
    detailsEn: `Coverage: The company compensates the insured for any direct losses resulting from an employee committing acts of forgery, embezzlement or theft of funds or properties.

Suitable for: Banks / Financial institutions / Exchange companies / Companies

Required Documents:
• Fill out the special form for this type of insurance`,
    slug: 'fidelity',
    displayOrder: 15
  },
  {
    nameAr: 'تأمين المقترضين',
    nameEn: 'Borrowers Insurance',
    descriptionAr: 'يوفر هذا التأمين الغطاء للمقترضين في حالة الوفاة الطبيعية أو العجز الكلي الدائم الناتج عن حادث أو مرض.',
    descriptionEn: 'This insurance provides coverage for borrowers in case of natural death or total permanent disability resulting from accident or illness.',
    detailsAr: `المنافع:
• الوفاة الطبيعية: المبلغ المتفق عليه في الوثيقة في تاريخ استحقاق التعويض
• العجز الكلي الدائم الناتج عن حادث أو مرض: المبلغ المتفق عليه في الوثيقة في تاريخ استحقاق التعويض

الحد الأقصى للعمر: من 18 وحتى 60 عاماً ويمكن رفعه حسب الاتفاق.
الجهة التي تدفع لها التعويض: حامل الوثيقة باعتباره وكيلاً عن المقترض عند تلقيه الدليل اللازم لإثبات أحقية التعويض.

الاستثناءات: كما هي في وثيقة تأمينات الأشخاص كالحروب وما يرتبط بها أو الثأر وغيره مما يتفق عليه في الوثيقة.

آلية العمل: تعبئة استمارة طلب التأمين والإقرار بالحالة الصحية وتسديد القسط.

يناسب هذا التأمين: البنوك والمؤسسات المالية`,
    detailsEn: `Benefits:
• Natural death: The agreed amount in the policy at the compensation due date
• Total permanent disability resulting from accident or illness: The agreed amount in the policy at the compensation due date

Maximum age: From 18 to 60 years, can be raised by agreement.
Compensation recipient: The policy holder as agent of the borrower upon receiving necessary evidence to prove compensation eligibility.

Exclusions: As in personal insurance policies such as wars and related matters or revenge and others as agreed in the policy.

Working mechanism: Fill out insurance application form, declare health status and pay premium.

Suitable for: Banks and financial institutions`,
    slug: 'borrowers',
    displayOrder: 16
  },
];

// Clear existing insurance types and re-insert
await conn.query('DELETE FROM insurance_types WHERE id > 0');

for (const type of insuranceTypes) {
  await conn.query(
    `INSERT INTO insurance_types (slug, titleAr, titleEn, descriptionAr, descriptionEn, featuresAr, featuresEn, imageUrl, displayOrder, isActive, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, 1, NOW(), NOW())`,
    [type.slug, type.nameAr, type.nameEn, type.descriptionAr, type.descriptionEn, type.detailsAr || '', type.detailsEn || '', type.displayOrder]
  );
  console.log('Inserted insurance type:', type.nameAr);
}

// ============================================================
// 6. UPDATE ABOUT CONTENT
// ============================================================
console.log('Updating about content...');

const [aboutRows] = await conn.query('SELECT id FROM about_content LIMIT 1');
if (aboutRows.length > 0) {
  await conn.query(`UPDATE about_content SET 
    titleAr='شركة مأرب اليمنية للتأمين',
    titleEn='Mareb Yemeni Insurance Company',
    contentAr='شركة مأرب اليمنية للتأمين ( شركة مساهمة يمنية ) تأسست عام 1974م من قبل مجموعة من رجال الأعمال اليمنيين والبنك اليمني للإنشاء والتعمير والشركة الكويتية لإعادة التأمين وشركة J.H. Limit البريطانية كأول شركة يمنية مساهمة للتأمين على كافة الأخطار المختلفة وضمان الحقوق المكتسبة لها وتقوم بإعادة التأمين لدى معيدي تأمين عالميين من الدرجة الأولى.\n\nيبلغ رأس مال الشركة مليار ريال وتدار بواسطة إدارة يمثل كل 10% من الأسهم عضو في المجلس وهناك إدارة تنفيذية تقوم بمتابعة الأعمال من خلال كادر مؤهل متخصص في مجال صناعة التأمين.\n\nللشركة استثمارات وأصول عقارية وهى عضو نشيط في الاتحادات العربية والمحلية في مجال التأمين.',
    contentEn='Mareb Yemeni Insurance Company (a Yemeni joint-stock company) was established in 1974 by a group of Yemeni businessmen, the Yemen Bank for Reconstruction and Development, the Kuwait Reinsurance Company, and the British company J.H. Limit, as the first Yemeni joint-stock company for insurance against all types of risks.\n\nThe company capital is one billion riyals and is managed by a board where every 10% of shares represents one board member, with an executive management team.\n\nThe company has investments and real estate assets and is an active member of Arab and local insurance federations.'
    WHERE id=${aboutRows[0].id}`);
  console.log('Updated about content');
}

await conn.end();
console.log('\n✅ All content seeded successfully!');
