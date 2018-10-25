var mutationRate;
var totalPopulation = 1000;
var population = new Array();
var matingPool;
var target;
var found=false;
var iterations=0;
var highFit=0;
var phraseHighFit='';
var testFitness='';

function go()
{

	iterations=0;
	highFit=0;
	phraseHighFit=0;
	found=false;

	testFitness=parseFloat( document.getElementById('targetFitness').value );
	totalPopulation=parseInt( document.getElementById('populous').value );

	setup();
	draw();

}

function setup()
{
	target=document.getElementById('phrase').value;
	mutationRate = parseFloat( document.getElementById('mutation').value );;
	population = new Array(totalPopulation);
	
	for( i=0, workingPopSize=population.length; i<workingPopSize; i++ )
	{
		population[i] = new DNA();
	}
}

function draw()
{
	do
	{
		for( i=0, workingPopSize=population.length;  i<workingPopSize; i++ )
		{
			population[i].calcFitness();
		}

		matingPool = new Array();

		for( i=0, workingPopSize=population.length;  i<workingPopSize; i++ )
		{
			n=parseInt( population[i].fitness * 100 );
			for( j=0; j<n; j++ )
			{
				matingPool.push(population[i]);
			}
		}

		for( i=0, workingPopSize=population.length;  i<workingPopSize; i++ )
		{
			var a = parseInt( Math.random()*matingPool.length );
			var b = parseInt( Math.random()*matingPool.length );

			partnerA = matingPool[a];
			partnerB = matingPool[b];

			child = partnerA.crossover(partnerB);

			child.mutate(mutationRate);

			population[i]=child;
		}

		iterations++;

		printPhase();
	
	}while(!found);
}

function printPop(population)
{
	html='';
	for( i=0, workingPopSize=population.length; i<workingPopSize; i++ )
	{
		html+=population[i].getPhrase()+"\r\n";
	}
	document.getElementById('output').value=html;
}

function printPhase()
{
	html=document.getElementById('output').value;
	document.getElementById('output').value=html+phraseHighFit+" ("+highFit+") ("+iterations+")\r\n";
}

function DNA()
{

	this.genes='';
	this.fitness='';

	this.genes = new Array( target.length );	
	for( var i=0, totalGenes=this.genes.length; i<totalGenes; i++ )
	{
		this.genes[i] = String.fromCharCode( (Math.random()*95)+32 );
	}

	this.calcFitness=function()
	{
		var score=0;
		for ( var i = 0, totalGenes=this.genes.length; i < totalGenes; i++) {
			if ( this.genes[i] == target[i] ) 
			{
				score++;
			}
		}
		this.fitness = score/target.length;
		if ( this.fitness > highFit )
		{
			highFit=this.fitness;
			phraseHighFit=this.genes.join('');
		}
		if ( this.fitness > testFitness )
		{
			
			found=true;
		}
	}
	
	this.crossover=function(partner) 
	{
		var child = new DNA();
		var midpoint = parseInt( Math.random()*this.genes.length );
		for ( var i = 0; i < this.genes.length; i++) 
		{
			if (i > midpoint) 
			{
				child.genes[i] = this.genes[i];
			}
			else
			{
				child.genes[i] = partner.genes[i];
			}
		}
		return child;
	}
	
	this.mutate=function(mutationRate)
	{
		for(i=0, totalGenes=this.genes.length; i<totalGenes; i++ )
		{
			if ( Math.random() < mutationRate )
			{
				this.genes[i] = String.fromCharCode( parseInt( (Math.random()*95)+32 ) );
			}
		}
	}
	
	this.getPhrase=function()
	{			
		return this.genes.join('');		
	}
}
