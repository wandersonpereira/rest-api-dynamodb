/**
 * Split value the request, for the table name and primary key
 * @param event
 * @returns {{tableName: *|string, primaryKey: string}}
 */
module.exports = (event) => {
    const resource = event.resource.split('/');

    let tableName = resource[1] || resource[0];
    let primaryKey = (resource[2] || 'id').replace('{','').replace('}','');

    tableName = tableName.charAt(0).toUpperCase() + tableName.substring(1);
    primaryKey = tableName + (primaryKey.charAt(0).toUpperCase() + primaryKey.substring(1));

    return {
        tableName,
        primaryKey
    };

};