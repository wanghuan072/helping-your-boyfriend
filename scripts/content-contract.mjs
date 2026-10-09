const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const keys = (value, required, optional, label, errors) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) { errors.push(`${label}: expected object`); return false; }
  for (const key of required) if (!(key in value)) errors.push(`${label}: missing ${key}`);
  for (const key of Object.keys(value)) if (![...required, ...optional].includes(key)) errors.push(`${label}: unknown field ${key}`);
  return true;
};
const text = (value, label, errors) => { if (typeof value !== 'string' || !value.trim()) errors.push(`${label}: expected non-empty text`); };
const strings = (value, label, errors) => { if (!Array.isArray(value) || value.some(v=>typeof v !== 'string' || !v.trim())) errors.push(`${label}: expected string array`); };
const enumeration = (value, choices, label, errors) => { if (!choices.includes(value)) errors.push(`${label}: invalid value ${value}`); };
const image = (value, label, errors) => {
  if (!keys(value,['src','alt','width','height'],[],label,errors)) return;
  text(value.src,label,errors); text(value.alt,label,errors);
  if (![value.width,value.height].every(v=>Number.isInteger(v)&&v>0)) errors.push(`${label}: invalid dimensions`);
};

export function validateBlocks(blocks, label, errors, allowFaq) {
  if (!Array.isArray(blocks) || !blocks.length) { errors.push(`${label}: empty blocks`); return; }
  for (const [index,b] of blocks.entries()) {
    const at=`${label} block ${index}`;
    const shape={paragraph:[['type','text'],[]],image:[['type','src','alt','width','height'],['caption']],list:[['type','style','items'],[]],steps:[['type','items'],[]],callout:[['type','tone','body'],['label']],table:[['type','columns','rows'],[]],video:[['type','provider','videoId','title','description'],['poster']],faq:[['type','items'],[]]}[b?.type];
    if (!shape || (b.type==='faq'&&!allowFaq)) {errors.push(`${at}: unsupported block`);continue;}
    keys(b,...shape,at,errors);
    if(b.type==='paragraph')text(b.text,at,errors);
    if(b.type==='image')image({src:b.src,alt:b.alt,width:b.width,height:b.height},at,errors);
    if(b.type==='list'){enumeration(b.style,['ordered','unordered'],at,errors);strings(b.items,at,errors);}
    if(b.type==='steps'){if(!Array.isArray(b.items))errors.push(`${at}: invalid steps`);else for(const item of b.items){keys(item,['title','body'],[],at,errors);text(item.title,at,errors);text(item.body,at,errors);}}
    if(b.type==='callout'){enumeration(b.tone,['info','tip','warning'],at,errors);text(b.body,at,errors);if(b.label!==undefined)text(b.label,at,errors);}
    if(b.type==='table'){strings(b.columns,at,errors);if(!Array.isArray(b.rows)||b.rows.some(r=>!Array.isArray(r)||r.length!==b.columns?.length||r.some(c=>typeof c!=='string')))errors.push(`${at}: table row mismatch`);}
    if(b.type==='video'){enumeration(b.provider,['youtube'],at,errors);if(!/^[\w-]{11}$/.test(b.videoId))errors.push(`${at}: invalid video ID`);text(b.title,at,errors);text(b.description,at,errors);}
    if(b.type==='faq'){if(!Array.isArray(b.items))errors.push(`${at}: invalid FAQ`);else for(const item of b.items){keys(item,['question','answer'],[],at,errors);text(item.question,at,errors);text(item.answer,at,errors);}}
  }
}

export function visibleBodyCharacters(game) {
  return Array.from(game.content.filter(s=>!s.blocks.some(b=>b.type==='callout'&&b.label==='Spoilers ahead')).flatMap(s=>s.blocks).flatMap(b=>b.type==='paragraph'?[b.text]:b.type==='list'?b.items:b.type==='steps'?b.items.flatMap(i=>[i.title,i.body]):b.type==='callout'?[b.label??'',b.body]:b.type==='table'?[...b.columns,...b.rows.flat()]:[]).join('').replace(/\s/gu,'')).length;
}

export function validateRecord(record, kind, errors) {
  const game=kind==='game',label=record.id??'unknown';
  const required=game?['id','slug','title','shortDescription','status','publishedAt','updatedAt','tags','categories','spoilerPolicy','flags','image','player','seo','content','relatedGameIds']:['id','slug','status','title','summary','tags','authorId','spoilerPolicy','publishedAt','updatedAt','cover','seo','sections','relatedGuideIds'];
  keys(record,required,game?['credits']:['routeMap'],label,errors);
  if(!slug.test(record.id)||!slug.test(record.slug))errors.push(`${label}: invalid slug`);
  text(record.title,label,errors);text(game?record.shortDescription:record.summary,label,errors);
  enumeration(record.status,['draft','published'],label,errors);enumeration(record.spoilerPolicy,['none','marked','full'],label,errors);
  strings(record.tags,label,errors);
  if(record.status==='published')for(const key of ['publishedAt','updatedAt']){
    const date = new Date(record[key]);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(record[key])||!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==record[key])errors.push(`${label}: invalid ${key}`);
  }
  if(record.updatedAt<record.publishedAt)errors.push(`${label}: updated before published`);
  image(game?record.image:record.cover,label,errors);
  keys(record.seo,['title','description','keywords'],[],label,errors);strings(record.seo.keywords,label,errors);
  if(game){
    if(record.credits !== undefined){
      if(keys(record.credits,['creators','officialUrl'],[],`${label} credits`,errors)){
        strings(record.credits.creators,`${label} creators`,errors);
        if(Array.isArray(record.credits.creators)&&!record.credits.creators.length)errors.push(`${label}: empty creator credit`);
        try{if(new URL(record.credits.officialUrl).protocol!=='https:')errors.push(`${label}: official URL must use HTTPS`);}catch{errors.push(`${label}: invalid official URL`);}
      }
    }
    strings(record.categories,label,errors);keys(record.flags,['isNewHome','isFeaturedHome','isRecommendedHome'],[],label,errors);
    if(Object.values(record.flags).some(v=>typeof v!=='boolean'))errors.push(`${label}: invalid flag`);
    keys(record.player,['iframeSrc','aspectRatio','orientation','permissionsPolicy','referrerPolicy','sandbox','loadTimeoutMs'],[],label,errors);
    if(record.player.aspectRatio!==null&&!/^\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/.test(record.player.aspectRatio))errors.push(`${label}: invalid aspect ratio`);
    enumeration(record.player.orientation,['landscape','portrait','adaptive'],label,errors);strings(record.player.permissionsPolicy,label,errors);
    if(record.player.sandbox!==null)strings(record.player.sandbox,label,errors);
    if(!Number.isInteger(record.player.loadTimeoutMs)||record.player.loadTimeoutMs<1000)errors.push(`${label}: invalid timeout`);
  }
  const sections=game?record.content:record.sections;
  if(!Array.isArray(sections)||!sections.length){errors.push(`${label}: empty content`);return;}
  const ids=new Set();
  for(const s of sections){keys(s,['id',game?'heading':'title','blocks'],game?[]:['summary'],label,errors);if(!slug.test(s.id)||ids.has(s.id))errors.push(`${label}: invalid/duplicate section ${s.id}`);ids.add(s.id);text(game?s.heading:s.title,label,errors);if(s.summary!==undefined)text(s.summary,label,errors);validateBlocks(s.blocks,label,errors,game);}
  strings(game?record.relatedGameIds:record.relatedGuideIds,label,errors);
  if (!game && record.routeMap !== undefined) validateRouteMap(record, errors);
}

export function validateRouteMap(guide, errors) {
  const label = `${guide.id} routeMap`, map = guide.routeMap;
  if (!keys(map, ['entry','nodes','edges','afterTree'], [], label, errors)) return;
  text(map.entry, label, errors); strings(map.afterTree, label, errors);
  if (!Array.isArray(map.nodes) || !map.nodes.length || !Array.isArray(map.edges)) { errors.push(`${label}: empty graph`); return; }
  const sections = new Map(guide.sections.map(section => [section.id, section]));
  const nodes = new Map();
  const cells = new Set();
  for (const node of map.nodes) {
    keys(node,['sectionId','kind','lane','row','label','checkpoint'],[],label,errors);
    text(node.label,label,errors); text(node.checkpoint,label,errors);
    enumeration(node.kind,['choice','investigation','relationship','ending'],label,errors);
    enumeration(node.lane,['left','center','right'],label,errors);
    const section = sections.get(node.sectionId), cell = `${node.row}:${node.lane}`;
    if (!section || nodes.has(node.sectionId)) errors.push(`${label}: invalid/duplicate node ${node.sectionId}`);
    if (!Number.isInteger(node.row) || node.row<1 || cells.has(cell)) errors.push(`${label}: invalid/duplicate layout cell ${cell}`);
    if (!section?.blocks.some(block=>block.type==='image')) errors.push(`${label}: missing real image for ${node.sectionId}`);
    if (node.kind==='ending' && !/^ending-(one|two|three|four)$/.test(node.sectionId)) errors.push(`${label}: invalid terminal ${node.sectionId}`);
    nodes.set(node.sectionId,node); cells.add(cell);
  }
  const edgeIds = new Set(), adjacency = new Map(map.nodes.map(node=>[node.sectionId,[]]));
  for (const edge of map.edges) {
    keys(edge,['from','to','label'],[],label,errors); text(edge.label,label,errors);
    const key = `${edge.from}:${edge.to}`;
    if (!nodes.has(edge.from)||!nodes.has(edge.to)||edgeIds.has(key)) errors.push(`${label}: invalid/duplicate edge ${key}`);
    if (nodes.get(edge.from)?.kind==='ending') errors.push(`${label}: terminal has outgoing edge`);
    if (nodes.get(edge.from)?.row > nodes.get(edge.to)?.row) errors.push(`${label}: backward layout edge ${key}`);
    adjacency.get(edge.from)?.push(edge.to); edgeIds.add(key);
  }
  const reached = new Set(), visiting = new Set();
  function visit(id) {
    if (visiting.has(id)) { errors.push(`${label}: cycle at ${id}`); return; }
    if (reached.has(id)) return;
    reached.add(id); visiting.add(id);
    for (const child of adjacency.get(id)??[]) visit(child);
    visiting.delete(id);
  }
  if (!nodes.has(map.entry)) errors.push(`${label}: invalid entry`); else visit(map.entry);
  for (const id of nodes.keys()) if (!reached.has(id)) errors.push(`${label}: unreachable ${id}`);
  const endings = map.nodes.filter(node=>node.kind==='ending').map(node=>node.sectionId).sort();
  if (JSON.stringify(endings)!==JSON.stringify(['ending-four','ending-one','ending-three','ending-two'])) errors.push(`${label}: must have exactly four endings`);
  if (new Set(map.afterTree).size!==map.afterTree.length || map.afterTree.some(id=>!sections.has(id)||nodes.has(id))) errors.push(`${label}: invalid afterTree sections`);
  const rendered = new Set([...nodes.keys(),...map.afterTree]);
  for (const section of guide.sections) if (!rendered.has(section.id) && !section.blocks.every(block=>block.type==='callout'&&block.label==='Spoilers ahead')) errors.push(`${label}: hidden body section ${section.id}`);
}
