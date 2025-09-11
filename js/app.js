/* ===== Utilidades ===== */
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const get = (id) => document.getElementById(id);

const fields = [
  "cliente","clienteDoc","contatoCliente","enderecoCliente",
  "servico","valor","dataPrimeiroPgto","vencimentoDia","dataInicio","dataAssinatura",
  "detalhesPlano","clausulasExtras"
];

/* Datas padrão = hoje */
(function setDefaultDates(){
  const today = new Date();
  const iso = (d)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  ["dataPrimeiroPgto","dataInicio","dataAssinatura"].forEach(id=>{
    if(!get(id).value) get(id).value = iso(today);
  });
})();

/* Restaurar rascunho */
(function loadDraft(){
  try{
    const saved = JSON.parse(localStorage.getItem('ishelp-contrato-draft')||'{}');
    fields.forEach(f=>{ if(saved[f]) get(f).value = saved[f]; });
  }catch(e){}
})();

/* Autosave */
fields.forEach(f=>{
  const el=get(f);
  el && el.addEventListener('input',()=>{
    const o={}; fields.forEach(ff=>o[ff]=get(ff).value);
    localStorage.setItem('ishelp-contrato-draft',JSON.stringify(o));
  });
});

/* Ações */
get('limpar').addEventListener('click',()=>{
  fields.forEach(f=>get(f).value='');
  localStorage.removeItem('ishelp-contrato-draft');
  get('pdf').disabled = true;
  merge();
});
get('restaurar').addEventListener('click',()=>{
  const saved = JSON.parse(localStorage.getItem('ishelp-contrato-draft')||'{}');
  fields.forEach(f=>get(f).value=saved[f]||''); merge();
});
get('imprimir').addEventListener('click',()=>window.print());

/* Helpers */
function brDate(iso){
  if(!iso) return '';
  const [y,m,d]=iso.split('-'); return `${d}/${m}/${y}`;
}

/* Merge */
function merge(){
  const map={}; fields.forEach(f=>map[f]=(get(f).value||'').trim());
  map['dataPrimeiroPgtoLegivel']=brDate(map['dataPrimeiroPgto'])||'[dd/mm/aaaa]';
  map['dataInicioLegivel']=brDate(map['dataInicio'])||'[dd/mm/aaaa]';
  map['dataAssinaturaLegivel']=brDate(map['dataAssinatura'])||'[dd/mm/aaaa]';

  $$('[data-merge]').forEach(el=>{
    const key=el.getAttribute('data-merge');
    el.textContent = map[key] || `[${key}]`;
  });

  // Detalhes do plano (opcional)
  const d = (map['detalhesPlano']||'').trim();
  const dText = document.getElementById('detalhesPlanoText');
  dText.textContent = d || '[Opcional]';

  // Cláusulas adicionais (opcional)
  const extras = (map['clausulasExtras']||'').trim();
  const extrasBlock = document.getElementById('extrasBlock');
  extrasBlock.innerHTML = '';
  if(extras){
    const div=document.createElement('div');
    div.className='block';
    div.innerHTML = `<div class="section">CLÁUSULAS ADICIONAIS</div><p class="small" style="white-space:pre-line;word-break:break-word">${extras}</p>`;
    extrasBlock.appendChild(div);
  }

  // Habilitar PDF com campos essenciais
  const ok = !!(map['cliente'] && map['servico'] && map['valor']);
  get('pdf').disabled = !ok;
  return ok;
}

merge();
fields.forEach(f=>get(f).addEventListener('change',merge));
get('gerar').addEventListener('click',()=>{
  const ok=merge();
  if(ok){ document.getElementById('previewCard').scrollIntoView({behavior:'smooth',block:'start'}); }
  else { alert('Preencha pelo menos: Cliente, Serviço e Valor.'); }
});

/* PDF */
get('pdf').addEventListener('click',async ()=>{
  merge();
  const el = document.getElementById('contrato');
  const fileName = `Contrato_${(get('cliente').value||'cliente').replace(/\s+/g,'_')}.pdf`;
  const opt = {
    margin:[0,0,0,0], /* já usamos margens A4 internas */
    filename:fileName,
    image:{type:'jpeg',quality:0.98},
    html2canvas:{scale:2,useCORS:true},
    jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}
  };
  try{ await html2pdf().from(el).set(opt).save(); }
  catch(e){ console.error(e); alert('Falha ao gerar PDF. Tente “Imprimir (PDF nativo)”.'); }
});
