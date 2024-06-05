public with sharing class CsvController {
    @AuraEnabled(cacheable=true)
    public static List<Account> fetchRecords(){
        return [SELECT Id, Name, Industry, Website, Phone FROM Account];
    }
}