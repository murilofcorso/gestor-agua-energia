function relativeToParent(element, percent) {
    const parent = element.parentElement;
    const parentWidth = parent.offsetWidth;
    return (parentWidth * percent) / 100;
}


const data = [
    { x: 0, y: 10 },
    { x: 1, y: 40 },
    { x: 2, y: 35 },
    { x: 3, y: 60 },
    { x: 4, y: 30 },
    { x: 5, y: 80 }
    ];



const graficoSvg = document.querySelector('.svg-grafico-energia');
const largura = graficoSvg.getBoundingClientRect().width;
const altura = graficoSvg.getBoundingClientRect().height;

const svgEnergia = d3.select(".svg-grafico-energia");
const svgAgua = d3.select(".svg-grafico-agua");
const width = largura;
const height = altura;
const margin = { top: 10, right: 25, bottom: 20, left: 22 };

// Definindo eixo x
const x = d3.scaleLinear()
.domain(d3.extent(data, d => d.x))
.range([margin.left, width - margin.right]);

// Definindo eixo y
const y = d3.scaleLinear()
.domain([0, d3.max(data, d => d.y)])
.range([height - margin.bottom, margin.top]);

// Definindo linha do grafico
const line = d3.line()
.x(d => x(d.x))
.y(d => y(d.y));

// Desenhando linha do gráfico
svgEnergia.append("path")
.datum(data)
.attr("fill", "none")
.attr("stroke", "white")
.attr("stroke-width", 2)
.attr("d", line);

// Desenhando eixo x
svgEnergia.append("g")
.attr("transform", `translate(0, ${height - margin.bottom})`)
.call(d3.axisBottom(x));

// Desenhando eixo y
svgEnergia.append("g")
.attr("transform", `translate(${margin.left}, 0)`)
.call(d3.axisLeft(y));


// Desenhando linha do gráfico
svgAgua.append("path")
.datum(data)
.attr("fill", "none")
.attr("stroke", "white")
.attr("stroke-width", 2)
.attr("d", line);

// Desenhando eixo x
svgAgua.append("g")
.attr("transform", `translate(0, ${height - margin.bottom})`)
.call(d3.axisBottom(x));

// Desenhando eixo y
svgAgua.append("g")
.attr("transform", `translate(${margin.left}, 0)`)
.call(d3.axisLeft(y));




