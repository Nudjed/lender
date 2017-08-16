web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// In your node console, execute  compiledCode.contracts[':Lender'].interface to get the contract interface to generate the abi definition
abi = JSON.parse('[{"constant":false,"inputs":[{"name":"name","type":"string"}],"name":"addItem","outputs":[{"name":"itemId","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"itemId","type":"uint8"}],"name":"returnItem","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"itemId","type":"uint256"}],"name":"removeItem","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"itemId","type":"uint8"}],"name":"getItem","outputs":[{"name":"id","type":"uint256"},{"name":"name","type":"string"},{"name":"lender","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"itemId","type":"uint256"}],"name":"lendItem","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"getNumItems","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"}]')

LenderContract = web3.eth.contract(abi);

// In your node console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
contractInstance = LenderContract.at('0xcf4fbbccc0b34914973158a9d1463caf6a0b51fd');

const defaultLender = "0x0000000000000000000000000000000000000000"
let listOfItems = [];

function lendItem(item)
{
  contractInstance.lendItem( $("#item").val(), {from: $("#lender-key").val()}, function() {
    $("#row"+$("#item").val() + ' .lender').html($("#lender-key").val());
    $("#row"+$("#item").val() + ' .lender-link').html("<a href='#' onclick='returnItem("+$("#item").val()+")'>Return Item</a>");

    $("#item option[value='"+ $("#item").val() +"']").attr('disabled','disabled')

    $("#lender-key").val('');
    $("select").val('');
  });
}

function returnItem(item)
{
  contractInstance.returnItem(item, {from: web3.eth.accounts[0]}, function() {
    $("#row"+item + ' .lender').html('Item not lent out');
    $("#row"+item + ' .lender-link').html('N/A');
    $("#item option[value='"+item +"']").attr('disabled','');
  });
}

function addItem()
{
  let id = parseInt(contractInstance.getNumItems.call());

  contractInstance.addItem($("#newItem").val(), {from: web3.eth.accounts[0]}, function(error, result) {

    newTableRow(id, $("#newItem").val());

    $('select').append($(new Option($("#newItem").val(), id)));

    $("#newItem").val('');
  });
}

function getListOfItems()
{
  for (let i = 0; i < contractInstance.getNumItems.call().toString(); i++) {

    item = contractInstance.getItem.call(i);

    listOfItems.push({
      id : item[0].toString(),
      name : item[1].toString(),
      lender : item[2].toString()
    });
  }

  return listOfItems;
}

function isLenderDefault(lender)
{
  if (lender == defaultLender) {
    return true;
  }
  return false;
}

function newTableRow(id, name, lender = defaultLender)
{
  $("table tbody").append("<tr id='row"+ id + "'>"+
    "<td>" + (parseInt(id) + 1) +"</td>"+
    "<td class='text-nowrap'>"+ name +"</td>"+
    "<td class='lender'>"+ (isLenderDefault(lender) ? 'Item not lent out' : lender) +"</td>"+
    "<td class='lender-link'>" +(isLenderDefault(lender) ? "N/A" : "<a href='#' onclick='returnItem("+id+")'>Return Item</a>" ) +"</td></tr>");
}


$(document).ready(function()
{
  $("#admin").html(web3.eth.accounts[0]);

  listOfItems = getListOfItems();

  listOfItems.forEach( function (arrayItem)
  {
    $('select').append($(new Option(arrayItem.name, arrayItem.id)));

    if (!isLenderDefault(arrayItem.lender)) {
      $("#item option[value='"+ arrayItem.id +"']").attr('disabled','disabled')
    }

    newTableRow(arrayItem.id, arrayItem.name, arrayItem.lender);
  });
});
