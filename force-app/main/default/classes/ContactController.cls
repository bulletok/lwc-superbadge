public with sharing class ContactController {
  @AuraEnabled(cacheable=true)
  public static LIst<Contact> getContacts() {
    return [
      SELECT FirstName, LastName, Email
      FROM Contact
      WITH SECURITY_ENFORCED
    ];
  }
}
